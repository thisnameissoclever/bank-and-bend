import type {Database} from './database.ts';
import {publicResearch} from './public-research.ts';
import {availabilityWriteSchema,requireAvailabilityEditor} from './availability.ts';
import type {Availability,AvailabilityRecords} from './availability.ts';

type AvailabilityRow={spot_id:string;payload:string;revision:number};
export function createAvailabilityStore(db:Database|undefined,editorId:string|undefined){
 const storage=()=>{if(!db)throw new Error('Availability storage is unavailable.');return db;};
 return {
  async get():Promise<{records:AvailabilityRecords;revision:number}>{
   const database=storage();
   const results=await database.batch([
    database.prepare('SELECT spot_id,payload,revision FROM availability_overrides'),
    database.prepare('SELECT COALESCE(MAX(id),0) AS revision FROM availability_audit'),
   ]);
   const rows=results[0].results as AvailabilityRow[];
   return {records:Object.fromEntries(rows.map(row=>[row.spot_id,{...publicResearch(JSON.parse(row.payload)),revision:row.revision}])),revision:Number((results[1].results[0] as {revision:number}).revision)};
  },
  async save(userId:string|null|undefined,spotId:string,input:unknown,expectedRevision:number):Promise<{record:Availability;conflict?:false}|{conflict:true}>{
   requireAvailabilityEditor(userId,editorId);
   const command=availabilityWriteSchema.parse({spotId,availability:input,expectedRevision});
   const database=storage();
   const payload=JSON.stringify(command.availability);
   const now=new Date().toISOString();
   const changeId=crypto.randomUUID();
   const write=expectedRevision===0
    ?database.prepare('INSERT INTO availability_overrides(spot_id,payload,revision,updated_at,updated_by,change_id) VALUES($1,$2,1,$3,$4,$5) ON CONFLICT(spot_id) DO NOTHING').bind(spotId,payload,now,userId,changeId)
    :database.prepare('UPDATE availability_overrides SET payload=$1,revision=revision+1,updated_at=$2,updated_by=$3,change_id=$4 WHERE spot_id=$5 AND revision=$6').bind(payload,now,userId,changeId,spotId,expectedRevision);
   const audit=database.prepare('INSERT INTO availability_audit(spot_id,payload,revision,actor_id,changed_at,change_id) SELECT spot_id,payload,revision,updated_by,updated_at,change_id FROM availability_overrides WHERE spot_id=$1 AND change_id=$2').bind(spotId,changeId);
   const results=await database.batch([write,audit]);
   if(!results[0].meta.changes)return {conflict:true};
   return {record:{...command.availability,revision:expectedRevision+1}};
  },
 };
}
