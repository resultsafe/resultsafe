// packages/core/shared/naming-convention/package-naming.ts

// =============================================================================
// PACKAGE NAMING INTERFACES
// =============================================================================
export interface PackageNamingOptions {
  /**
   * DDD context (fp, ds, utils, etc.)
   * @example 'fp', 'ds', 'utils'
   */
  context: string;

  /**
   * Package name within context
   * @example 'option', 'result', 'collection'
   */
  name: string;

  /**
   * Package type suffix
   * @default ''
   * @example '-shared', '-core', '-utils'
   */
  type?: string;

  /**
   * Package scope
   * @default '@resultsafe'
   */
  scope?: string;
}
