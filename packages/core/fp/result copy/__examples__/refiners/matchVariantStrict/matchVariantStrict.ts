import { matchVariantStrict } from '@resultsafe/core-fp-result';

type Result =
  | { type: 'ok'; value: number }
  | { type: 'err'; code: number; message: string };

const result: Result =
  Math.random() > 0.5
    ? { type: 'ok', value: 42 }
    : { type: 'err', code: 500, message: 'fail' };

matchVariantStrict(result)
  .with('ok', (r) => `✅ ${r.value}`)
  .with('err', (r) => `❌ ${r.code}: ${r.message}`)
  .run(); // ✅ TypeScript гарантирует, что все варианты покрыты


