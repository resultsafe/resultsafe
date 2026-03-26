import { matchVariant } from '@resultsafe/core-fp-result';

// Расширяем тип Result, добавляя meta в ok-вариант
type OkWithMeta<T, M> = { type: 'ok'; value: T; meta: M };
type Err<E> = { type: 'err' } & E;

type ResultWithMeta<T, E, M> = OkWithMeta<T, M> | Err<E>;

const result: ResultWithMeta<
  number,
  { code: number; message: string },
  { source: string }
> =
  Math.random() > 0.5
    ? { type: 'ok', value: 42, meta: { source: 'api' } }
    : { type: 'err', code: 500, message: 'fail' };

matchVariant(result)
  .with('ok', (r) => {
    console.log(`✅ ok: ${r.value} from ${r.meta.source}`);
  })
  .with('err', (r) => {
    console.log(`❌ err ${r.code}: ${r.message}`);
  })
  .otherwise((r) => {
    console.log(`🤷 unknown type: ${r.type}`);
  })
  .run();


