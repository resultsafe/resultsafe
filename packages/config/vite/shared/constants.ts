// packages/config/vite/shared/constants.ts
import { ALL_CORE_PACKAGES } from '@resultsafe/core-shared-naming-convention';

// Общие зависимости
export const WORKSPACE_EXTERNALS = [...ALL_CORE_PACKAGES, /^node:/] as const;


