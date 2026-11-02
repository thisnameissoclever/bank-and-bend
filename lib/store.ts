import type {Database} from './database.ts';
import type {Spot,Journal} from './model';
import {createScoringStore} from './scoring-settings';
import {env} from './runtime';
import {RETIRE_SPECIES_PREFERENCES} from './retired-score-storage';
import {z} from 'zod';
import {DEFAULT_FILTERS,normalizeFilters,normalizeSort,WEIGHTS_REVISION} from './model';
import {preferencePatch} from './preferences';
import {preferenceWriteSql} from './preference-storage';
export {preferencePatch} from './preferences';
const bounded=z.number().int().min(1).max(10);
export const recordSchema=z.object({visited:z.boolean(),rating:bounded.nullable(),notes:z.string().max(8000),lastVisited:z.string().refine(x=>x===''||/^\d{4}-\d{2}-\d{2}$/.test(x)&&!isNaN(Date.parse(x)),'Invalid visit date'),favorite:z.boolean()}).strict();
export async function getPersonal(user:string){if(!env.DB)throw new Error('Storage is unavailable');await env.DB.prepare(RETIRE_SPECIES_PREFERENCES).bind(user).run();const [p,r]=await Promise.all([env.DB.prepare('SELECT payload FROM preferences WHERE user_id=$1').bind(user).first<{payload:string}>(),env.DB.prepare('SELECT spot_id,payload,revision FROM personal_records WHERE user_id=$1').bind(user).all<{spot_id:string,payload:string,revision:number}>()]);const saved=p?JSON.parse(p.payload):null;const scoring=await createScoringStore(env.DB,env.AVAILABILITY_EDITOR_ID).get();return {preferences:saved?{...saved,sort:normalizeSort(saved.sort),filters:normalizeFilters(saved.filters),weights:scoring.weights,weightsRevision:WEIGHTS_REVISION}:{filters:DEFAULT_FILTERS,sort:'overall',mapLayer:'map',weights:scoring.weights,weightsRevision:WEIGHTS_REVISION},records:Object.fromEntries((r.results??[]).map(x=>[x.spot_id,{...JSON.parse(x.payload),revision:x.revision}])) as Journal}}
export async function patchPreferences(user:string,patch:unknown){const p=preferencePatch.parse(patch);if(!env.DB)throw new Error('Storage is unavailable');const entries=Object.entries(p);if(!entries.length)return {ok:true};await env.DB.prepare(preferenceWriteSql(entries.map(([key])=>key))).bind(user,JSON.stringify(p),new Date().toISOString()).run();return {ok:true}}
export async function saveRecord(user:string,spotId:string,input:unknown,revision:number){const record=recordSchema.parse(input);if(!env.DB)throw new Error('Storage is unavailable');const now=new Date().toISOString();const result=revision===0?await env.DB.prepare('INSERT INTO personal_records(user_id,spot_id,payload,revision,updated_at) VALUES($1,$2,$3,1,$4) ON CONFLICT(user_id,spot_id) DO NOTHING').bind(user,spotId,JSON.stringify(record),now).run():await env.DB.prepare('UPDATE personal_records SET payload=$1,revision=revision+1,updated_at=$2 WHERE user_id=$3 AND spot_id=$4 AND revision=$5').bind(JSON.stringify(record),now,user,spotId,revision).run();if(!result.meta.changes)return {conflict:true};return {record:{...record,revision:revision+1}}}
