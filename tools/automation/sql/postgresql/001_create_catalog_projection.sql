-- ResultSafe Parquet Snapshot Layer -> PostgreSQL Catalog Projection
-- Версия: 1.0

CREATE SCHEMA IF NOT EXISTS catalog;

CREATE TABLE IF NOT EXISTS catalog.snapshot_manifest_index (
    snapshot_id TEXT PRIMARY KEY,
    repository_id TEXT NOT NULL,
    scan_id TEXT NOT NULL,
    commit_hash TEXT NOT NULL,
    branch_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    snapshot_kind TEXT NOT NULL,
    extractor_version TEXT NOT NULL,
    schema_version TEXT NOT NULL,
    storage_root TEXT NOT NULL,
    dataset_count INTEGER NOT NULL,
    row_counts_json JSONB NOT NULL,
    checksums_json JSONB NOT NULL,
    is_complete BOOLEAN NOT NULL,
    manifest_json JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS snapshot_manifest_index_repository_created_idx
    ON catalog.snapshot_manifest_index(repository_id, created_at DESC);

CREATE TABLE IF NOT EXISTS catalog.active_snapshot (
    repository_id TEXT PRIMARY KEY,
    snapshot_id TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS catalog.rebuild_audit (
    audit_id BIGSERIAL PRIMARY KEY,
    repository_id TEXT NOT NULL,
    snapshot_id TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    status TEXT NOT NULL,
    details_json JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS rebuild_audit_repository_started_idx
    ON catalog.rebuild_audit(repository_id, started_at DESC);

CREATE TABLE IF NOT EXISTS catalog.incremental_refresh_audit (
    audit_id BIGSERIAL PRIMARY KEY,
    repository_id TEXT NOT NULL,
    from_snapshot_id TEXT NOT NULL,
    to_snapshot_id TEXT NOT NULL,
    started_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    status TEXT NOT NULL,
    details_json JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS incremental_refresh_audit_repository_started_idx
    ON catalog.incremental_refresh_audit(repository_id, started_at DESC);

CREATE TABLE IF NOT EXISTS catalog.projection_repository_files (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_repository_files_entity_idx
    ON catalog.projection_repository_files(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_modules (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_modules_entity_idx
    ON catalog.projection_modules(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_packages (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_packages_entity_idx
    ON catalog.projection_packages(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_code_types (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_code_types_entity_idx
    ON catalog.projection_code_types(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_methods (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_methods_entity_idx
    ON catalog.projection_methods(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_method_parameters (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_method_parameters_entity_idx
    ON catalog.projection_method_parameters(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_members (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_members_entity_idx
    ON catalog.projection_members(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_domain_entities (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_domain_entities_entity_idx
    ON catalog.projection_domain_entities(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_documentation (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_documentation_entity_idx
    ON catalog.projection_documentation(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_documentation_sections (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_documentation_sections_entity_idx
    ON catalog.projection_documentation_sections(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_database_catalog (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_database_catalog_entity_idx
    ON catalog.projection_database_catalog(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_relations (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_relations_entity_idx
    ON catalog.projection_relations(entity_id);

CREATE TABLE IF NOT EXISTS catalog.projection_provenance (
    snapshot_id TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (snapshot_id, entity_id)
);

CREATE INDEX IF NOT EXISTS projection_provenance_entity_idx
    ON catalog.projection_provenance(entity_id);
