import {readFile} from 'node:fs/promises';
import {neon} from '@neondatabase/serverless';
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required for migrations.');
const sql=neon(process.env.DATABASE_URL);
const source=await readFile(new URL('../db/001-initial.sql',import.meta.url),'utf8');
await sql.transaction(source.split(';').map(s=>s.trim()).filter(Boolean).map(s=>sql.query(s)));
console.log('Database schema is ready.');
