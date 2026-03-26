$ErrorActionPreference = 'Stop'

$files = Get-ChildItem packages -Recurse -File | Where-Object {
  $_.FullName -match '\\__examples__\\'
}

function Normalize-Token([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return '' }

  $token = $value -replace '\.','-' -replace '_','-' -replace '\s+','-'
  $token = $token -creplace '([a-z0-9])([A-Z])','$1-$2'
  $token = $token.ToLowerInvariant()
  $token = $token -replace '[^a-z0-9-]+','-'
  $token = $token -replace '-+','-'
  $token = $token.Trim('-')
  return $token
}

function Normalize-Variant([string]$value) {
  if ([string]::IsNullOrWhiteSpace($value)) { return 'v01' }

  if ($value -match '^v(\d+)$') {
    $num = [int]$matches[1]
    return 'v' + $num.ToString('00')
  }

  $norm = Normalize-Token $value
  if ([string]::IsNullOrWhiteSpace($norm)) { return 'v01' }
  return $norm
}

$plans = @()
$targetMap = @{}

foreach ($file in $files) {
  $parts = $file.FullName -split '\\'
  $idx = [Array]::IndexOf($parts, '__examples__')
  if ($idx -lt 0) { continue }

  $examplesRoot = ($parts[0..$idx] -join '\\')
  $rem = $parts[($idx + 1)..($parts.Length - 1)]
  if ($rem.Length -lt 1) { continue }

  $name = $rem[-1]
  $dirs = @()
  if ($rem.Length -gt 1) {
    $dirs = $rem[0..($rem.Length - 2)]
  }

  $scopeRaw = if ($dirs.Count -gt 0) { $dirs[0] } else { 'scenarios' }
  $scope = Normalize-Token $scopeRaw
  if (-not $scope) { $scope = 'scenarios' }

  $afterScope = @()
  if ($dirs.Count -gt 1) {
    $afterScope = $dirs[1..($dirs.Length - 1)]
  }

  $numericDir = $afterScope | Where-Object { $_ -match '^\d+$' } | Select-Object -Last 1
  $variantFromDir = $null
  if ($numericDir) {
    $variantFromDir = 'v' + ([int]$numericDir).ToString('00')
  }

  $topicTokens = @()
  foreach ($segment in $afterScope) {
    if ($segment -match '^\d+$') { continue }
    $normSeg = Normalize-Token $segment
    if ($normSeg -in @('usages', 'usage', 'internal', 'assets')) { continue }
    if ($normSeg) { $topicTokens += $normSeg }
  }
  $topicFromDirs = $topicTokens -join '-'

  $ext = [IO.Path]::GetExtension($name).ToLowerInvariant()
  $stem = [IO.Path]::GetFileNameWithoutExtension($name)

  $verFromStem = $null
  $verMatch = [regex]::Match($stem, '\.v(\d+)\b', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
  if ($verMatch.Success) {
    $verFromStem = 'v' + ([int]$verMatch.Groups[1].Value).ToString('00')
  }

  $stemBase = $stem -replace '\.v\d+\b', ''
  $stemBase = $stemBase -replace '\.example\b', ''
  $stemBase = $stemBase -replace '\busage\b', ''
  $stemBase = $stemBase -replace '\breadme\b', ''
  $baseNorm = Normalize-Token $stemBase

  $topic = if ($topicFromDirs) {
    $topicFromDirs
  } elseif ($baseNorm) {
    $baseNorm
  } else {
    'sample'
  }

  $variant = if ($verFromStem) {
    $verFromStem
  } elseif ($variantFromDir) {
    $variantFromDir
  } elseif ($topicFromDirs -and $baseNorm -and $baseNorm -notin @('example', 'usage', 'readme') -and $baseNorm -ne $topic) {
    $baseNorm
  } else {
    'v01'
  }
  $variant = Normalize-Variant $variant

  $targetBase = Join-Path (Join-Path (Join-Path $examplesRoot $scope) $topic) $variant

  $target = $null
  if ($ext -eq '.ts') {
    $target = Join-Path $targetBase 'example.ts'
  } elseif ($ext -eq '.md') {
    $target = Join-Path $targetBase 'example.md'
  } else {
    $internalIndex = [Array]::IndexOf($afterScope, 'internal')
    $assetsIndex = [Array]::IndexOf($afterScope, 'assets')

    if ($internalIndex -ge 0) {
      $suffix = @($afterScope[$internalIndex..($afterScope.Length - 1)] + $name)
      $target = $targetBase
      foreach ($part in $suffix) {
        $target = Join-Path $target $part
      }
    } elseif ($assetsIndex -ge 0) {
      $suffix = @($afterScope[$assetsIndex..($afterScope.Length - 1)] + $name)
      $target = $targetBase
      foreach ($part in $suffix) {
        $target = Join-Path $target $part
      }
    } else {
      $target = Join-Path (Join-Path $targetBase 'assets') $name
    }
  }

  if ($file.FullName -cne $target) {
    $key = $target.ToLowerInvariant()
    if ($targetMap.ContainsKey($key)) {
      throw "Target collision: $target <= $($targetMap[$key]); $($file.FullName)"
    }
    $targetMap[$key] = $file.FullName

    $plans += [PSCustomObject]@{
      Source = $file.FullName
      Target = $target
    }
  }
}

foreach ($plan in $plans) {
  $tmp = Join-Path ([IO.Path]::GetDirectoryName($plan.Source)) ('.__tmp__' + [guid]::NewGuid().ToString('N') + [IO.Path]::GetExtension($plan.Source))
  Move-Item -LiteralPath $plan.Source -Destination $tmp
  $plan | Add-Member -NotePropertyName Temp -NotePropertyValue $tmp -Force
}

foreach ($plan in $plans) {
  $targetDir = [IO.Path]::GetDirectoryName($plan.Target)
  if (-not (Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
  }
  Move-Item -LiteralPath $plan.Temp -Destination $plan.Target
}

$exampleDirs = Get-ChildItem packages -Recurse -Directory | Where-Object { $_.FullName -match '\\__examples__\\' } | Sort-Object { $_.FullName.Length } -Descending
foreach ($dir in $exampleDirs) {
  if ((Get-ChildItem $dir.FullName -Force | Measure-Object).Count -eq 0) {
    Remove-Item -LiteralPath $dir.FullName -Force
  }
}

Write-Output ('moved=' + $plans.Count)
