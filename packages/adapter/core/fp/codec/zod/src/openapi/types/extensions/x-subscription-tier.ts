// @resultsafe/core-fp-codec-zod/src/openapi/types/extensions/x-subscription-tier.ts

/**
 * Расширение OpenAPI: x-subscription-tier
 * Определяет, какие уровни подписки имеют доступ к схеме или операции.
 */

export interface XSubscriptionTier {
  /**
   * Минимальный уровень подписки, необходимый для доступа.
   * @example
   *   x-subscription-tier-min: "pro"
   */
  'x-subscription-tier-min'?: 'free' | 'basic' | 'pro' | 'enterprise' | string;

  /**
   * Массив уровней подписки, которым разрешён доступ.
   * @example
   *   x-subscription-tiers: ["pro", "enterprise"]
   */
  'x-subscription-tiers'?: string[];

  /**
   * Флаг: доступно ли для trial-периода.
   * @example
   *   x-subscription-trial-allowed: true
   */
  'x-subscription-trial-allowed'?: boolean;

  /**
   * Ограничения по использованию (например, лимиты вызовов).
   * @example
   *   x-subscription-limits:
   *     free: 100
   *     pro: 1000
   */
  'x-subscription-limits'?: Record<string, number>;

  /**
   * Опциональное описание — что входит в каждый уровень.
   * @example
   *   x-subscription-details: "See pricing page for full details"
   */
  'x-subscription-details'?: string;
}


