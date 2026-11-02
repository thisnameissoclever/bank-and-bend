import {env} from '../../../lib/runtime';
import {getUserId} from '../../../lib/auth/server';
import {accessIsSupported} from '../../../lib/model';
import {spots} from '../../../lib/corpus';
import {availabilityWriteSchema,canEditAvailability,AvailabilityPermissionError} from '../../../lib/availability';
import {createAvailabilityStore} from '../../../lib/availability-store';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(req:Request){
 try{
  const data=await createAvailabilityStore(env.DB,env.AVAILABILITY_EDITOR_ID).get();
  return response({...data,canEdit:canEditAvailability(await getUserId(),env.AVAILABILITY_EDITOR_ID)});
 }catch{return response({error:'Location availability could not be loaded.'},503);}
}
export async function POST(req:Request){
 const user=await getUserId();
 if(!user)return response({error:'Sign in to change location availability.'},401);
 if(!canEditAvailability(user,env.AVAILABILITY_EDITOR_ID))return response({error:'Only the site owner can change location availability.'},403);
 const origin=req.headers.get('origin');
 if(origin&&origin!==new URL(req.url).origin)return response({error:'Origin not allowed.'},403);
 try{
  const raw=await req.text();
  if(raw.length>48000)return response({error:'Request too large.'},413);
  const command=availabilityWriteSchema.parse(JSON.parse(raw));
  const spot=spots.find(spot=>spot.id===command.spotId);
  if(!spot)return response({error:'Unknown fishing location.'},400);
  if(command.availability.active&&!accessIsSupported(spot))return response({error:'The parking-to-bank access review must be corrected before this location can become active.'},400);
  const result=await createAvailabilityStore(env.DB,env.AVAILABILITY_EDITOR_ID).save(user,command.spotId,command.availability,command.expectedRevision);
  return result.conflict?response({error:'Availability changed. Reload the location before saving again.',conflict:true},409):response(result);
 }catch(error){
  if(error instanceof AvailabilityPermissionError)return response({error:error.message},403);
  if(error instanceof SyntaxError||(error as {name?:string}).name==='ZodError')return response({error:'Check the reason, dates and source links.'},400);
  return response({error:'Availability could not be saved. Try again.'},503);
 }
}
