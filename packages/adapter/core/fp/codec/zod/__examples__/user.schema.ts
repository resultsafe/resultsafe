// user.schema.ts
import * as z from 'zod';

const UserSchema = z.object({
  name: z.string().describe('Full name').example('Alice'),
  avatar: z.string().openapi({
    description: 'Base64-encoded PNG avatar',
    contentEncoding: 'base64',
    contentMediaType: 'image/png',
  }),
  preferences: z
    .object({
      theme: z.string(),
      notifications: z.boolean(),
    })
    .openapi({
      xml: { name: 'preferences', wrapped: true },
      externalDocs: {
        description: 'Preferences schema documentation',
        url: 'https://docs.company.com/api/preferences',
      },
    }),
});

// codec.ts
import { fromZod } from 'packages/adapter/fp/codec/zod/src/index.js';

// 🔥 Автоматически регистрируется в components.schemas как "User"
export const UserCodec = fromZod(UserSchema, { name: 'User' });

// openapi.ts
import { getComponents } from 'packages/adapter/fp/codec/zod/src/index.js';

const openapiSpec = {
  openapi: '3.1.0',
  info: { title: 'API', version: '1.0.0' },
  components: getComponents(), // 🔥 { schemas: { User: { ... } } }
  paths: {
    '/user': {
      get: {
        responses: {
          '200': {
            description: 'User object',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }, // 🔥 ссылка на components
              },
            },
          },
        },
      },
    },
  },
};
