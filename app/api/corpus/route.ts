import {env} from '../../../lib/runtime';
import {getUserId} from '../../../lib/auth/server';
import {createScoringStore} from '../../../lib/scoring-settings';
import {corpus} from '../../../lib/corpus';
import {availabilityFor,navigationFor,mapsArea} from '../../../lib/model';
import {createAvailabilityStore} from '../../../lib/availability-store';
export async function GET(){
 try{
  const scoring=await createScoringStore(env.DB,env.AVAILABILITY_EDITOR_ID).get();
  const c=corpus(scoring.weights);
  const data=await createAvailabilityStore(env.DB,env.AVAILABILITY_EDITOR_ID).get();
  return Response.json({...c,scoringRevision:scoring.revision,availabilityRevision:data.revision,spots:c.spots.map(spot=>{
   const merged=data.records[spot.id]?{...spot,availability:data.records[spot.id]}:spot;
   return {...merged,availability:availabilityFor(merged),navigation:{parking:navigationFor(merged,'parking'),fishing:navigationFor(merged,'fishing'),generalArea:mapsArea(merged)}};
  })},{headers:{'Cache-Control':'no-store'}});
 }catch{return Response.json({error:'Current location availability could not be loaded.',availabilityStatus:'unavailable'},{status:503,headers:{'Cache-Control':'no-store'}});}
}
