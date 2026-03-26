# @resultsafe/playground-result

Local test playground for `@resultsafe/core-fp-result`.
By default, it uses the local workspace package.

## Run

From monorepo root:

```bash
pnpm install
pnpm run playground:result
```

Or directly:

```bash
cd packages/playground
pnpm install
pnpm run run
```

## Expected output

- Success path with transformed value and final unwrapped value.
- Failure path with normalized error string.
- Pattern-matching outputs for both `Ok` and `Err`.

## Try npm package instead

After successful npm publish, replace dependency version in `package.json`:

```json
"@resultsafe/core-fp-result": "latest"
```
