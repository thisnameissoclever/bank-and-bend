import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {PGlite} from '@electric-sql/pglite';
import type {Database,Statement,DatabaseResult} from '../lib/database.ts';
import {saveFavorite} from '../lib/favorite-store.ts';
import {createScoringStore} from '../lib/scoring-settings.ts';
import {createAvailabilityStore} from '../lib/availability-store.ts';
import {preferenceWriteSql} from '../lib/preference-storage.ts';
import {RETIRE_SPECIES_PREFERENCES} from '../lib/retired-score-storage.ts';
import {WEIGHTS,clearedFilters} from '../lib/model.ts';
import {safeReturnPath} from '../lib/auth/return-path.ts';

async function database(){
 const pg=new PGlite();
 await pg.exec(readFileSync(new URL('../db/001-initial.sql',import.meta.url),'utf8'));
 let rejectAudit=false;
 class Query implements Statement {
  values:unknown[]=[];sql:string;
  constructor(sql:string){this.sql=sql;}
  bind(...values:unknown[]){this.values=values;return this;}
  async run():Promise<DatabaseResult>{const r=await pg.query<Record<string,unknown>>(this.sql,this.values);return {results:r.rows,meta:{changes:r.affectedRows??0},success:true};}
  async all<T>(){return {results:(await this.run()).results as T[]};}
  async first<T>(){return (await this.all<T>()).results[0]??null;}
 }
 const db:Database={prepare(sql){return new Query(sql);},async batch(statements){return pg.transaction(async tx=>{const results:DatabaseResult[]=[];for(const s of statements){const q=s as Query;if(rejectAudit&&q.sql.startsWith('INSERT INTO availability_audit'))throw new Error('Audit unavailable');const r=await tx.query<Record<string,unknown>>(q.sql,q.values);results.push({results:r.rows,meta:{changes:r.affectedRows??0},success:true});}return results;});}};
 return {db,pg,rejectAudit(){rejectAudit=true;}};
}
test('PostgreSQL favorites preserve comments and visits and isolate accounts',async()=>{
 const {db,pg}=await database();
 try{
 const initial={visited:true,rating:9,notes:'An existing comment',lastVisited:'2026-10-24',favorite:false};
 await db.prepare('INSERT INTO personal_records VALUES($1,$2,$3,3,$4)').bind('owner','lake',JSON.stringify(initial),'2026-10-24').run();
 assert.deepEqual((await saveFavorite(db,'owner','lake',true)).record,{...initial,favorite:true,revision:4});
 await saveFavorite(db,'other','lake',false);
 assert.equal((await db.prepare('SELECT COUNT(*)::int AS count FROM personal_records').first<{count:number}>())?.count,2);
 const stale=await db.prepare('UPDATE personal_records SET payload=$1 WHERE user_id=$2 AND spot_id=$3 AND revision=$4').bind('{}','owner','lake',3).run();assert.equal(stale.meta.changes,0);
 assert.equal((await saveFavorite(db,'owner','lake',false)).record.notes,initial.notes);
 await assert.rejects(saveFavorite(db,'','lake',true),/Sign in/);
 }finally{await pg.close();}
});
test('PostgreSQL preference patches replace nested filters and retain other settings',async()=>{
 const {db,pg}=await database();try{
 const write=(user:string,patch:object)=>db.prepare(preferenceWriteSql(Object.keys(patch))).bind(user,JSON.stringify(patch),'2026-11-02').run();
 await write('owner',{filters:{...clearedFilters(),query:'lake',minScores:{seclusion:9}},sort:'drive',mapLayer:'satellite'});
 await write('owner',{filters:clearedFilters()});await write('other',{sort:'name'});
 const row=await db.prepare('SELECT payload FROM preferences WHERE user_id=$1').bind('owner').first<{payload:string}>();
 assert.deepEqual(JSON.parse(row!.payload),{filters:clearedFilters(),sort:'drive',mapLayer:'satellite'});
 }finally{await pg.close();}
});
test('PostgreSQL retired preference keys are removed without changing other choices',async()=>{
 const {db,pg}=await database();try{
 const saved={weights:{seclusion:80,speciesFit:100},filters:{...clearedFilters(),minScores:{seclusion:7,speciesFit:8}},sort:'score:speciesFit'};
 await db.prepare('INSERT INTO preferences VALUES($1,$2,$3)').bind('owner',JSON.stringify(saved),'2026-11-02').run();
 assert.equal((await db.prepare(RETIRE_SPECIES_PREFERENCES).bind('owner').run()).meta.changes,1);
 const row=await db.prepare('SELECT payload FROM preferences WHERE user_id=$1').bind('owner').first<{payload:string}>();
 assert.deepEqual(JSON.parse(row!.payload),{...saved,weights:{seclusion:80},filters:{...saved.filters,minScores:{seclusion:7}},sort:'overall'});
 assert.equal((await db.prepare(RETIRE_SPECIES_PREFERENCES).bind('owner').run()).meta.changes,0);
 }finally{await pg.close();}
});
test('PostgreSQL shared weights enforce owner access and compare revisions',async()=>{
 const {db,pg}=await database();try{
 const store=createScoringStore(db,'owner');assert.deepEqual((await store.get()).weights,WEIGHTS);
 await assert.rejects(store.save('visitor',{weights:WEIGHTS,expectedRevision:0}),/owner/);
 const weights={...WEIGHTS,seclusion:100,seasonalProspects:80};await store.save('owner',{weights,expectedRevision:0});
 assert.deepEqual(await store.save('owner',{weights:WEIGHTS,expectedRevision:0}),{conflict:true});
 assert.deepEqual((await createScoringStore(db,'owner').get()).weights,weights);
 await db.prepare("UPDATE scoring_settings SET payload=$1,revision=89 WHERE id='site'").bind(JSON.stringify({...weights,speciesFit:100})).run();
 assert.equal((await store.get()).revision,90);assert.equal((await store.get()).revision,90);assert.deepEqual((await store.get()).weights,weights);
 }finally{await pg.close();}
});
test('PostgreSQL availability writes retain audit history and roll back together',async()=>{
 const {db,pg,rejectAudit}=await database();try{
 const store=createAvailabilityStore(db,'owner');
 const closed={active:false,reason:'The access road is closed.',checkedAt:'2026-11-02',nextReviewAt:'2026-11-09',sourceUrls:['https://example.gov/park']};
 await store.save('owner','lake',{...closed,inactiveFrom:'2026-11-03'},0);
 await assert.rejects(store.save('visitor','lake',closed,1),/owner/);
 assert.deepEqual(await store.save('owner','lake',closed,0),{conflict:true});
 await store.save('owner','lake',{...closed,active:true,reason:'The park reopened.'},1);
 const result=await store.get();assert.equal(result.revision,2);assert.equal(result.records.lake.revision,2);assert.equal(result.records.lake.inactiveFrom,undefined);
 const audits=await db.prepare('SELECT revision,actor_id FROM availability_audit ORDER BY id').all<{revision:number;actor_id:string}>();assert.deepEqual(audits.results,[{revision:1,actor_id:'owner'},{revision:2,actor_id:'owner'}]);
 rejectAudit();await assert.rejects(store.save('owner','lake',closed,2),/Audit/);assert.deepEqual(await store.get(),result);
 }finally{await pg.close();}
});
test('new tables deny direct public reads unless the server role is used',async()=>{
 const {pg}=await database();try{
 await pg.exec('CREATE ROLE anonymous');
 await pg.exec('GRANT USAGE ON SCHEMA public TO anonymous; GRANT SELECT ON ALL TABLES IN SCHEMA public TO anonymous;');
 await pg.query('INSERT INTO preferences VALUES($1,$2,$3)',['owner','{}','2026-11-02']);
 await pg.exec('SET ROLE anonymous');
 assert.equal((await pg.query('SELECT * FROM preferences')).rows.length,0);
 await pg.exec('RESET ROLE');
 }finally{await pg.close();}
});
test('sign-in return paths reject external and recursive destinations',()=>{
 for(const value of ['https://evil.example','//evil.example','/\\evil.example','/auth/sign-in',null])assert.equal(safeReturnPath(value),'/');
 assert.equal(safeReturnPath('/?spot=lake#overview'),'/?spot=lake#overview');
});
