import type {Database} from './database.ts';
import {z} from 'zod';
import {RETIRE_SPECIES_WEIGHTS} from './retired-score-storage.ts';
import {SCORE_LABELS,WEIGHTS,normalizeWeights} from './model.ts';
import type {ScoreWeights} from './model.ts';
import {canEditAvailability} from './availability.ts';

export type ScoringSettings={weights:ScoreWeights;revision:number;updatedAt:string|null};
export const scoringWeightsSchema=z.object(Object.fromEntries([...Object.keys(SCORE_LABELS).map(k=>[k,z.number().int().min(0).max(100)]),...['fishProspects','quietness','speciesFit'].map(k=>[k,z.number().int().min(0).max(100).optional()])])).strict().refine(w=>Object.keys(SCORE_LABELS).some(k=>(w[k]??0)>0),'Set at least one importance above zero.').transform(normalizeWeights);
export const scoringWriteSchema=z.object({weights:scoringWeightsSchema,expectedRevision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1)}).strict();
export class ScoringPermissionError extends Error{constructor(){super('Only the signed-in site owner can change scoring settings.');this.name='ScoringPermissionError';}}
export const canEditScoring=canEditAvailability;

export function createScoringStore(db:Database|undefined,ownerId:string|undefined){
 const storage=()=>{if(!db)throw new Error('Scoring storage is unavailable.');return db;};
 return {
  async get():Promise<ScoringSettings>{
   const result=await storage().batch([storage().prepare(RETIRE_SPECIES_WEIGHTS),storage().prepare("SELECT payload,revision,updated_at FROM scoring_settings WHERE id='site'")]);
   const row=result[1].results[0] as {payload:string;revision:number;updated_at:string}|undefined;
   return row?{weights:normalizeWeights(JSON.parse(row.payload)),revision:row.revision,updatedAt:row.updated_at}:{weights:{...WEIGHTS},revision:0,updatedAt:null};
  },
  async save(userId:string|null|undefined,input:unknown):Promise<{settings:ScoringSettings;conflict?:false}|{conflict:true}>{
   if(!canEditScoring(userId,ownerId))throw new ScoringPermissionError();
   const command=scoringWriteSchema.parse(input),database=storage();
   const weights=command.weights as ScoreWeights,now=new Date().toISOString();
   const write=command.expectedRevision===0
    ?database.prepare("INSERT INTO scoring_settings(id,payload,revision,updated_at,updated_by) VALUES('site',$1,1,$2,$3) ON CONFLICT(id) DO NOTHING").bind(JSON.stringify(weights),now,userId)
    :database.prepare("UPDATE scoring_settings SET payload=$1,revision=revision+1,updated_at=$2,updated_by=$3 WHERE id='site' AND revision=$4").bind(JSON.stringify(weights),now,userId,command.expectedRevision);
   const result=await database.batch([write]);
   return result[0].meta.changes?{settings:{weights,revision:command.expectedRevision+1,updatedAt:now}}:{conflict:true};
  }
 };
}
