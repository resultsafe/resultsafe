// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-legal-compliance.ts

/**
 * Расширение OpenAPI: x-legal-compliance
 * Указывает юридические требования и стандарты, которым соответствует схема.
 */

export interface XLegalCompliance {
  /**
   * Массив стандартов комплаенса.
   * @example
   *   x-compliance: ["GDPR", "CCPA", "HIPAA"]
   */
  'x-compliance'?: ('GDPR' | 'CCPA' | 'HIPAA' | 'PCI-DSS' | string)[];

  /**
   * Флаг: содержит ли схема персональные данные (PII).
   * @example
   *   x-pii: true
   */
  'x-pii'?: boolean;

  /**
   * Флаг: содержит ли схема медицинские данные (PHI).
   * @example
   *   x-phi: false
   */
  'x-phi'?: boolean;

  /**
   * Флаг: содержит ли схема финансовые данные (PCI).
   * @example
   *   x-pci: false
   */
  'x-pci'?: boolean;

  /**
   * Срок хранения данных (для GDPR и др.).
   * @example
   *   x-retention-period: "365 days"
   */
  'x-retention-period'?: string;

  /**
   * Опциональная ссылка на юридический документ.
   * @example
   *   x-legal-reference: "https://company.com/legal/data-processing-agreement"
   */
  'x-legal-reference'?: string;
}


