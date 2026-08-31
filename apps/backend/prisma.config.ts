import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',

  // Migration and seeding options
  migrations: {
    path: 'prisma/migrations',
    seed: 'ts-node ./prisma/seed.ts',
  },

  // Type-safe environment variable helper for your database URL
  datasource: {
    url: env('DATABASE_URL'),
  },
});
