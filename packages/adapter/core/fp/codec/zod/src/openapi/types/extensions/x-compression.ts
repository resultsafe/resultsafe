// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-compression.ts

/**
 * Расширение OpenAPI: x-compression
 * Управляет сжатием ответов, использующих эту схему.
 */

export interface XCompression {
  /**
   * Алгоритмы сжатия, которые сервер поддерживает для этого эндпоинта.
   * @example
   *   x-compression-encodings: ["gzip", "br", "deflate"]
   */
  'x-compression-encodings'?: ('gzip' | 'br' | 'deflate' | string)[];

  /**
   * Минимальный размер ответа в байтах, при котором применяется сжатие.
   * @example
   *   x-compression-min-size: 1024
   */
  'x-compression-min-size'?: number;

  /**
   * Флаг: сжимать ли ответы, даже если клиент не запрашивает сжатие.
   * @example
   *   x-compression-force: false
   */
  'x-compression-force'?: boolean;

  /**
   * Уровень сжатия (0-9) для алгоритмов, поддерживающих уровни.
   * @example
   *   x-compression-level: 6
   */
  'x-compression-level'?: number;

  /**
   * Опциональное описание — почему выбраны такие настройки.
   * @example
   *   x-compression-reason: "Optimize for CDN delivery"
   */
  'x-compression-reason'?: string;
}


