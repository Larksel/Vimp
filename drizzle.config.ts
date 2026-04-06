import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './app/main/db/schema',
  dialect: 'sqlite',
  dbCredentials: {
    url: './drizzle/dev.db',
  },
});
