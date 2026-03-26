// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-security-headers.ts

/**
 * Расширение OpenAPI: x-security-headers
 * Определяет, какие security headers должны быть установлены для ответов с этой схемой.
 */

export interface XSecurityHeaders {
  /**
   * Content-Security-Policy — политика безопасности контента.
   * @example
   *   x-csp: "default-src 'self'"
   */
  'x-csp'?: string;

  /**
   * Strict-Transport-Security — политика HSTS.
   * @example
   *   x-hsts: "max-age=31536000; includeSubDomains"
   */
  'x-hsts'?: string;

  /**
   * X-Content-Type-Options — защита от MIME-sniffing.
   * @example
   *   x-cto: "nosniff"
   */
  'x-cto'?: 'nosniff';

  /**
   * X-Frame-Options — защита от clickjacking.
   * @example
   *   x-xfo: "DENY"
   */
  'x-xfo'?: 'DENY' | 'SAMEORIGIN' | 'ALLOW-FROM';

  /**
   * Referrer-Policy — политика рефереров.
   * @example
   *   x-referrer-policy: "no-referrer-when-downgrade"
   */
  'x-referrer-policy'?: string;

  /**
   * Permissions-Policy — контроль доступа к браузерным API.
   * @example
   *   x-permissions-policy: "geolocation=(), microphone=()"
   */
  'x-permissions-policy'?: string;
}


