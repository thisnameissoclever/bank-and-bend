import postgres from 'postgres';
import {SUPABASE_DATABASE_CA} from './database-ca';

export type DatabaseResult={results:Record<string,unknown>[];meta:{changes:number};success:boolean};
export interface Statement {
 bind(...values:unknown[]):Statement;
 first<T>():Promise<T|null>;
 all<T>():Promise<{results:T[]}>;
 run():Promise<DatabaseResult>;
}
export interface Database {
 prepare(sql:string):Statement;
 batch(statements:Statement[]):Promise<DatabaseResult[]>;
}

/** Run parameterized PostgreSQL statements and preserve transaction boundaries. */
export function createDatabase(url:string):Database {
 const client=postgres(url,{prepare:false,max:5,idle_timeout:20,connect_timeout:10,ssl:{ca:SUPABASE_DATABASE_CA,rejectUnauthorized:true}});
 class Query implements Statement {
  values:unknown[]=[];
  sql:string;
  constructor(sql:string){this.sql=sql;}
  bind(...values:unknown[]){this.values=values;return this;}
  async first<T>(){const result=await this.all<T>();return result.results[0]??null;}
  async all<T>(){return {results:(await this.run()).results as T[]};}
  async run(){const result=await client.unsafe(this.sql,this.values as never[]);return {results:Array.from(result),meta:{changes:result.count??0},success:true};}
 }
 return {
  prepare(sql){return new Query(sql);},
  async batch(statements){
   const queries=statements.map(s=>{if(!(s instanceof Query))throw new Error('Statement belongs to another database.');return s;});
   return client.begin(async transaction=>{
    const results:DatabaseResult[]=[];
    for(const query of queries){
     const result=await transaction.unsafe(query.sql,query.values as never[]);
     results.push({results:Array.from(result),meta:{changes:result.count??0},success:true});
    }
    return results;
   });
  },
 };
}
let database:Database|undefined;
export function getDatabase():Database {
 const url=process.env.DATABASE_URL;
 if(!url)throw new Error('Database is not configured.');
 return database??=createDatabase(url);
}
