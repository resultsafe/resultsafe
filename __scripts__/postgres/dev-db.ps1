param(
    [Parameter(Position = 0)]
    [ValidateSet(
        "up",
        "down",
        "start",
        "stop",
        "restart",
        "status",
        "logs",
        "psql",
        "reset",
        "dsn",
        "dsn-admin",
        "catalog-create-db",
        "catalog-init-schema",
        "catalog-rebuild",
        "catalog-incremental-refresh"
    )]
    [string]$Action = "status",

    [string]$RepositoryId = "repo_main",
    [string]$StorageRoot = "dist/snapshot-store",
    [string]$SnapshotId = "",
    [string]$FromSnapshotId = "",
    [string]$ToSnapshotId = "",
    [switch]$Follow,
    [switch]$Force
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptRoot "..\..")).Path
$composeFile = Join-Path $repoRoot "docker-compose.postgres.yml"
$envExampleFile = Join-Path $repoRoot "config\env\.env.postgres.local.example"
$envLocalFile = Join-Path $repoRoot "config\env\.env.postgres.local"
$dataDir = Join-Path $repoRoot ".data\postgres"

if (-not (Test-Path $composeFile)) {
    throw "Compose file not found: $composeFile"
}

if (-not (Test-Path $envLocalFile) -and (Test-Path $envExampleFile)) {
    Copy-Item -Path $envExampleFile -Destination $envLocalFile -Force
}

function Read-KeyValueFile {
    param([string]$Path)

    $result = @{}
    if (-not (Test-Path $Path)) {
        return $result
    }

    foreach ($line in Get-Content -Path $Path -Encoding UTF8) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed)) { continue }
        if ($trimmed.StartsWith("#")) { continue }
        $parts = $trimmed.Split("=", 2)
        if ($parts.Length -ne 2) { continue }
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        if ($value.StartsWith("'") -and $value.EndsWith("'")) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        $result[$key] = $value
    }
    return $result
}

function Get-Setting {
    param(
        [hashtable]$Map,
        [string]$Key,
        [string]$DefaultValue
    )
    if ($Map.ContainsKey($Key) -and -not [string]::IsNullOrWhiteSpace($Map[$Key])) {
        return [string]$Map[$Key]
    }
    return $DefaultValue
}

function Test-DockerComposeAvailable {
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        return $false
    }
    & docker compose version *> $null
    return $LASTEXITCODE -eq 0
}

function Ensure-DockerCompose {
    if (-not (Test-DockerComposeAvailable)) {
        throw "docker compose is not available."
    }
}

function Invoke-Compose {
    param([string[]]$ComposeArgs)
    $args = @("compose", "-f", $composeFile, "--project-directory", $repoRoot) + $ComposeArgs
    & docker @args
    if ($LASTEXITCODE -ne 0) {
        throw "docker compose command failed: docker $($args -join ' ')"
    }
}

function Wait-PostgresHealthy {
    param([string]$ContainerName)
    for ($i = 0; $i -lt 60; $i++) {
        $status = & docker inspect --format "{{.State.Health.Status}}" $ContainerName 2>$null
        if ($LASTEXITCODE -eq 0 -and $status -eq "healthy") {
            return
        }
        Start-Sleep -Seconds 1
    }
    throw "PostgreSQL container is not healthy after timeout: $ContainerName"
}

$envValues = Read-KeyValueFile -Path $envLocalFile
$postgresImage = Get-Setting -Map $envValues -Key "POSTGRES_IMAGE" -DefaultValue "pgvector/pgvector:pg16"
$postgresContainer = Get-Setting -Map $envValues -Key "POSTGRES_CONTAINER_NAME" -DefaultValue "resultsafe-postgres"
$postgresUser = Get-Setting -Map $envValues -Key "POSTGRES_USER" -DefaultValue "postgres"
$postgresPassword = Get-Setting -Map $envValues -Key "POSTGRES_PASSWORD" -DefaultValue "postgres"
$postgresDb = Get-Setting -Map $envValues -Key "POSTGRES_DB" -DefaultValue "resultsafe_catalog"
$postgresPort = Get-Setting -Map $envValues -Key "POSTGRES_PORT" -DefaultValue "5432"

$env:POSTGRES_IMAGE = $postgresImage
$env:POSTGRES_CONTAINER_NAME = $postgresContainer
$env:POSTGRES_USER = $postgresUser
$env:POSTGRES_PASSWORD = $postgresPassword
$env:POSTGRES_DB = $postgresDb
$env:POSTGRES_PORT = $postgresPort

$encodedUser = [Uri]::EscapeDataString($postgresUser)
$encodedPassword = [Uri]::EscapeDataString($postgresPassword)
$adminDsn = "postgresql://${encodedUser}:$encodedPassword@localhost:$postgresPort/postgres?connect_timeout=5"
$projectDsn = "postgresql://${encodedUser}:$encodedPassword@localhost:$postgresPort/${postgresDb}?connect_timeout=5"

switch ($Action) {
    "up" {
        Ensure-DockerCompose
        New-Item -Path $dataDir -ItemType Directory -Force | Out-Null
        Invoke-Compose @("up", "-d")
        Wait-PostgresHealthy -ContainerName $postgresContainer
        Write-Output "PostgreSQL is up. DSN: $projectDsn"
        break
    }
    "down" {
        Ensure-DockerCompose
        Invoke-Compose @("down")
        break
    }
    "start" {
        Ensure-DockerCompose
        Invoke-Compose @("start")
        break
    }
    "stop" {
        Ensure-DockerCompose
        Invoke-Compose @("stop")
        break
    }
    "restart" {
        Ensure-DockerCompose
        Invoke-Compose @("restart")
        Wait-PostgresHealthy -ContainerName $postgresContainer
        break
    }
    "status" {
        Ensure-DockerCompose
        Invoke-Compose @("ps")
        break
    }
    "logs" {
        Ensure-DockerCompose
        if ($Follow) {
            Invoke-Compose @("logs", "-f", "postgres")
        }
        else {
            Invoke-Compose @("logs", "--tail=200", "postgres")
        }
        break
    }
    "psql" {
        Ensure-DockerCompose
        Invoke-Compose @("exec", "-e", "PGPASSWORD=$postgresPassword", "postgres", "psql", "-U", $postgresUser, "-d", $postgresDb)
        break
    }
    "reset" {
        Ensure-DockerCompose
        if (-not $Force) {
            throw "reset is destructive. Re-run with -Force."
        }
        Invoke-Compose @("down")
        if (Test-Path $dataDir) {
            Remove-Item -Path $dataDir -Recurse -Force
        }
        New-Item -Path $dataDir -ItemType Directory -Force | Out-Null
        Invoke-Compose @("up", "-d")
        Wait-PostgresHealthy -ContainerName $postgresContainer
        break
    }
    "dsn" {
        Write-Output $projectDsn
        break
    }
    "dsn-admin" {
        Write-Output $adminDsn
        break
    }
    "catalog-create-db" {
        & python -m tools.automation catalog create-database --admin-dsn $adminDsn --database-name $postgresDb
        if ($LASTEXITCODE -ne 0) { throw "catalog create-database failed." }
        break
    }
    "catalog-init-schema" {
        & python -m tools.automation catalog init-schema --dsn $projectDsn --sql-file "tools/automation/sql/postgresql/001_create_catalog_projection.sql"
        if ($LASTEXITCODE -ne 0) { throw "catalog init-schema failed." }
        break
    }
    "catalog-rebuild" {
        if ([string]::IsNullOrWhiteSpace($SnapshotId)) {
            throw "catalog-rebuild requires -SnapshotId"
        }
        & python -m tools.automation catalog rebuild --dsn $projectDsn --storage-root $StorageRoot --repository-id $RepositoryId --snapshot-id $SnapshotId
        if ($LASTEXITCODE -ne 0) { throw "catalog rebuild failed." }
        break
    }
    "catalog-incremental-refresh" {
        if ([string]::IsNullOrWhiteSpace($FromSnapshotId) -or [string]::IsNullOrWhiteSpace($ToSnapshotId)) {
            throw "catalog-incremental-refresh requires -FromSnapshotId and -ToSnapshotId"
        }
        & python -m tools.automation catalog incremental-refresh --dsn $projectDsn --storage-root $StorageRoot --repository-id $RepositoryId --from-snapshot-id $FromSnapshotId --to-snapshot-id $ToSnapshotId
        if ($LASTEXITCODE -ne 0) { throw "catalog incremental-refresh failed." }
        break
    }
    default {
        throw "Unsupported action: $Action"
    }
}
