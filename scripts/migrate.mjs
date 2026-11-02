import {readFile} from 'node:fs/promises';
import postgres from 'postgres';
if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL is required for migrations.');
const sql=postgres(process.env.DATABASE_URL,{prepare:false,max:1,ssl:'verify-full'});
const source=await readFile(new URL('../db/001-initial.sql',import.meta.url),'utf8');
try{await sql.begin(async tx=>{await tx.unsafe(source).simple();});}finally{await sql.end();}
console.log('Database schema is ready.');
