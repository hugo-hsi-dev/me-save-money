import { DATABASE_URL } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

export const db = drizzle(DATABASE_URL, { casing: 'snake_case', schema });

export type DBClient = typeof db;
