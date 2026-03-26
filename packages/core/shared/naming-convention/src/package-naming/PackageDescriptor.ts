export interface PackageDescriptor {
  /**
   * DDD context
   */
  context: string;

  /**
   * Package name
   */
  name: string;

  /**
   * Package type with dash prefix
   * @example '-shared', '-core', ''
   */
  type: string;

  /**
   * Full package scope
   * @example '@resultsafe'
   */
  scope: string;
}
