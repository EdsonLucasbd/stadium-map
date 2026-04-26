import * as schema from '@/db/schema';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: process.env.NEXT_PUBLIC_DB_URL!,
  authToken: process.env.DB_TOKEN!,
});

export const db = drizzle(client, { schema });
