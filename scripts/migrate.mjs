import {readFile} from 'node:fs/promises';
import postgres from 'postgres';
import {SUPABASE_DATABASE_CA} from '../lib/database-ca.ts';
import {databaseConnectionUrl} from '../lib/database-configuration.ts';
const url=databaseConnectionUrl(process.env.SUPABASE_DATABASE_URL);
const sql=postgres(url,{prepare:false,max:1,ssl:{ca:SUPABASE_DATABASE_CA,rejectUnauthorized:true}});
const source=await readFile(new URL('../db/001-initial.sql',import.meta.url),'utf8');
try{await sql.begin(async tx=>{await tx.unsafe(source).simple();});}finally{await sql.end();}
console.log('Database schema is ready.');
