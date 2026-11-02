import type {Database} from './database.ts';
import type {JournalRecord} from './model';

/** Change one favorite without replacing comments, ratings or visit history. */
export async function saveFavorite(db:Database|undefined,user:string,spotId:string,favorite:boolean,visited=false) {
 if(!user)throw new Error('Sign in to sync favorites.');
 if(typeof favorite!=='boolean')throw new Error('Invalid favorite.');
 if(!db)throw new Error('Storage is unavailable');
 const initial={visited,rating:null,notes:'',lastVisited:'',favorite};
 const results=await db.batch([
  db.prepare("INSERT INTO personal_records(user_id,spot_id,payload,revision,updated_at) VALUES($1,$2,$3,1,$4) ON CONFLICT(user_id,spot_id) DO UPDATE SET payload=jsonb_set(personal_records.payload::jsonb,'{favorite}',$5::jsonb)::text,revision=personal_records.revision+1,updated_at=excluded.updated_at")
   .bind(user,spotId,JSON.stringify(initial),new Date().toISOString(),JSON.stringify(favorite)),
  db.prepare('SELECT payload,revision FROM personal_records WHERE user_id=$1 AND spot_id=$2').bind(user,spotId),
 ]);
 const saved=results[1].results[0] as {payload:string;revision:number}|undefined;
 if(!saved)throw new Error('Favorite could not be saved.');
 return {record:{...JSON.parse(saved.payload),revision:saved.revision} as JournalRecord};
}
