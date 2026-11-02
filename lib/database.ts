import {neon} from '@neondatabase/serverless';

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
 const client=neon(url);
 class Query implements Statement {
  values:unknown[]=[];
  sql:string;
  constructor(sql:string){this.sql=sql;}
  bind(...values:unknown[]){this.values=values;return this;}
  async first<T>(){const result=await this.all<T>();return result.results[0]??null;}
  async all<T>(){return {results:(await this.run()).results as T[]};}
  async run(){const result=await client.query(this.sql,this.values,{fullResults:true});return {results:result.rows,meta:{changes:result.rowCount??0},success:true};}
 }
 return {
  prepare(sql){return new Query(sql);},
  async batch(statements){
   const queries=statements.map(s=>{if(!(s instanceof Query))throw new Error('Statement belongs to another database.');return client.query(s.sql,s.values);});
   const results=await client.transaction(queries,{fullResults:true});
   return results.map(result=>({results:result.rows,meta:{changes:result.rowCount??0},success:true}));
  },
 };
}
let database:Database|undefined;
export function getDatabase():Database {
 const url=process.env.DATABASE_URL;
 if(!url)throw new Error('Database is not configured.');
 return database??=createDatabase(url);
}
