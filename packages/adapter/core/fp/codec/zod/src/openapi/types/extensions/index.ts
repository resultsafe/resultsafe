// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/index.ts

// Core
export type { XExamples } from './x-examples.js';
export type { XNullable } from './x-nullable.js';
export type { XOrder } from './x-order.js';
export type { XTags } from './x-tags.js';

// Access & Security
export type { XAudience } from './x-audience.js';
export type { XCors } from './x-cors.js';
export type { XPermissions } from './x-permissions.js';
export type { XSecurityHeaders } from './x-security-headers.js';

// Lifecycle
export type { XDeprecated } from './x-deprecated.js';
export type { XMigrationPath } from './x-migration-path.js';
export type { XVersion } from './x-version.js';

// Performance
export type { XCache } from './x-cache.js';
export type { XCompression } from './x-compression.js';
export type { XRateLimit } from './x-rate-limit.js';

// Observability
export type { XLogging } from './x-logging.js';
export type { XTracing } from './x-tracing.js';

// Validation & AI
export type { XAIGeneration } from './x-ai-generation.js';
export type { XValidationRules } from './x-validation-rules.js';

// Business
export type { XCostEstimation } from './x-cost-estimation.js';
export type { XSubscriptionTier } from './x-subscription-tier.js';
export type { XWebhookEvents } from './x-webhook-events.js';

// Compliance & Geo
export type { XGeoRestrictions } from './x-geo-restrictions.js';
export type { XLegalCompliance } from './x-legal-compliance.js';
export type { XLocalization } from './x-localization.js';

/**
 * Объединённый тип всех расширений — для удобного импорта.
 */
export type Extensions = XNullable &
  XExamples &
  XTags &
  XOrder &
  XPermissions &
  XAudience &
  XDeprecated &
  XVersion &
  XCache &
  XRateLimit &
  XLogging &
  XTracing &
  XValidationRules &
  XMigrationPath &
  XSecurityHeaders &
  XCors &
  XCompression &
  XWebhookEvents &
  XSubscriptionTier &
  XLocalization &
  XGeoRestrictions &
  XLegalCompliance &
  XAIGeneration &
  XCostEstimation;


