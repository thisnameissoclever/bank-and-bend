import {env} from '../../../lib/runtime';
import {getUserId} from '../../../lib/auth/server';
import {canEditScoring,createScoringStore,ScoringPermissionError} from '../../../lib/scoring-settings';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req:Request){
 try{return response({...await createScoringStore(env.DB,env.AVAILABILITY_EDITOR_ID).get(),canEdit:canEditScoring(await getUserId(),env.AVAILABILITY_EDITOR_ID)});}
 catch{return response({error:'Saved scoring settings could not load.'},503);}
}
export async function POST(req:Request){
 const user=await getUserId();
 if(!user)return response({error:'Sign in to change scoring settings.'},401);
 if(!canEditScoring(user,env.AVAILABILITY_EDITOR_ID))return response({error:'Only the site owner can change scoring settings.'},403);
 const origin=req.headers.get('origin');
 if(origin&&origin!==new URL(req.url).origin)return response({error:'Origin not allowed.'},403);
 try{
  const text=await req.text();if(text.length>6000)return response({error:'Request too large.'},413);
  const result=await createScoringStore(env.DB,env.AVAILABILITY_EDITOR_ID).save(user,JSON.parse(text));
  return result.conflict?response({error:'Settings changed in another browser. Load the saved settings before editing again.',conflict:true},409):response(result.settings);
 }catch(error){
  if(error instanceof ScoringPermissionError)return response({error:error.message},403);
  if(error instanceof SyntaxError||(error as {name?:string}).name==='ZodError')return response({error:'Use whole numbers from 0 to 100 and keep at least one setting above zero.'},400);
  return response({error:'Settings could not be saved. Retry to keep these changes.'},503);
 }
}
