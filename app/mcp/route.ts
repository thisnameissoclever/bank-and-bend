import {createScoringStore} from '../../lib/scoring-settings';
import {env} from '../../lib/runtime';
import {getUserId} from '../../lib/auth/server';
import {corpus,spots} from '../../lib/corpus';
import {getPersonal,saveRecord} from '../../lib/store';
import {availabilityFor,navigationFor,mapsArea,accessIsSupported} from '../../lib/model';
import {canEditAvailability} from '../../lib/availability';
import {createAvailabilityStore} from '../../lib/availability-store';

const readAnnotations={readOnlyHint:true,destructiveHint:false,idempotentHint:true,openWorldHint:false};
const writeAnnotations={readOnlyHint:false,destructiveHint:false,idempotentHint:false,openWorldHint:false};
const toolList=[
 {name:'get_fishing_research',description:'Read the Washington and Oregon fishing corpus, sources, access coordinates, subjective scores, availability and refresh policy. Reconsider previous reasoning against current evidence. Use when researching fishing, planning a trip or updating the finder.',annotations:readAnnotations,inputSchema:{type:'object',properties:{spot_id:{type:'string'}},additionalProperties:false}},
 {name:'get_fishing_journal',description:'Read the signed-in user\'s visits, personal ratings, notes and saved filters. Preserve these during research updates. The viewer field identifies the caller and availability editing permission.',annotations:readAnnotations,inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'get_fishing_availability',description:'Read shared location availability overrides and revisions, plus the authenticated caller identity and editing permission. A missing override uses the research corpus status. Read this before updating availability.',annotations:readAnnotations,inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'update_fishing_availability',description:'Update shared location availability after checking access, seasonal rules and dated evidence, or when the owner requests a manual change. Only the configured site owner can write. Read current revisions first. Set active=false for a closed or inaccessible location. Include the reason, checked date, source links and next review date when known. Every accepted write is recorded in the audit history.',annotations:writeAnnotations,inputSchema:{type:'object',required:['spot_id','expected_revision','availability'],properties:{spot_id:{type:'string'},expected_revision:{type:'integer',minimum:0},availability:{type:'object',required:['active','reason','checkedAt','sourceUrls'],properties:{active:{type:'boolean'},reason:{type:'string',minLength:3,maxLength:1600},checkedAt:{type:'string',description:'Date YYYY-MM-DD or ISO timestamp'},nextReviewAt:{type:'string',description:'Optional date YYYY-MM-DD or ISO timestamp, on or after checkedAt'},inactiveFrom:{type:'string',description:'Optional date YYYY-MM-DD when this location becomes inactive in Pacific time; omit to clear a saved date'},sourceUrls:{type:'array',maxItems:20,items:{type:'string',format:'uri',maxLength:2000}}},additionalProperties:false}},additionalProperties:false}},
 {name:'update_fishing_visit',description:'Record a visit or personal review only when the user requests it. Fetch journal first and pass current revision. Does not modify research or automated fit scores.',annotations:writeAnnotations,inputSchema:{type:'object',required:['spot_id','expected_revision','visited','rating','notes','last_visited','favorite'],properties:{spot_id:{type:'string'},expected_revision:{type:'integer',minimum:0},visited:{type:'boolean'},rating:{type:['integer','null'],minimum:1,maximum:10},notes:{type:'string',maxLength:8000},last_visited:{type:'string',description:'YYYY-MM-DD or empty string'},favorite:{type:'boolean'}},additionalProperties:false}},
];

export async function POST(req:Request){
 let id:unknown=null;
 const origin=req.headers.get('origin');
 if(origin&&origin!==new URL(req.url).origin)return new Response('Origin not allowed.',{status:403});
 const ok=(result:unknown)=>Response.json({jsonrpc:'2.0',id,result},{headers:{'Cache-Control':'no-store'}});
 try{
  const raw=await req.text();
  if(raw.length>64000)return new Response('Request too large',{status:413});
  const b=JSON.parse(raw);
  id=b.id??null;
  if(b.method==='server/discover')return ok({supportedVersions:['2026-07-28'],capabilities:{tools:{}}});
  if(b.method==='initialize')return ok({protocolVersion:'2025-03-26',capabilities:{tools:{}},serverInfo:{name:'bank-and-bend',version:'1.1.0'}});
  if(b.method==='notifications/initialized')return new Response(null,{status:202});
  if(b.method==='tools/list')return ok({tools:toolList});
  if(b.method==='tools/call'){
   const user=await getUserId();
   if(!user)return ok({content:[{type:'text',text:'Authenticated user identity required.'}],isError:true});
   const a=b.params.arguments??{};
   const availability=createAvailabilityStore(env.DB,env.AVAILABILITY_EDITOR_ID);
   const canEdit=canEditAvailability(user,env.AVAILABILITY_EDITOR_ID);
   const viewer={id:user,canEditAvailability:canEdit};
   let result:unknown;
   if(b.params.name==='get_fishing_research'){
    const scoring=await createScoringStore(env.DB,env.AVAILABILITY_EDITOR_ID).get();
    const c=corpus(scoring.weights);
    const data=await availability.get();
    result={...c,scoringRevision:scoring.revision,availabilityRevision:data.revision,availabilityUpdateInstructions:{readTool:'get_fishing_availability',writeTool:'update_fishing_availability',writeArguments:{spot_id:'stable spot ID',expected_revision:'current override revision, or 0 when no override exists',availability:{active:'boolean',reason:'evidence and practical effect',checkedAt:'YYYY-MM-DD',nextReviewAt:'optional YYYY-MM-DD',inactiveFrom:'optional Pacific closure date YYYY-MM-DD',sourceUrls:'array of public source URLs'}},policy:'Recheck closed and inaccessible locations weekly. Verify access, rules and relevant advisories; consider an additional source. Set active=false while a closure prevents fishing. Reopen only when current evidence supports access. An unresolved source access audit must be corrected and published before an active override is accepted. Record source URLs and a checked date. Preserve personal journals and ratings. A missing owner configuration rejects writes. Read again after a revision conflict.',viewer},spots:c.spots.filter(spot=>!a.spot_id||spot.id===a.spot_id).map(spot=>{const merged=data.records[spot.id]?{...spot,availability:data.records[spot.id]}:spot;return {...merged,availability:availabilityFor(merged),navigation:{parking:navigationFor(merged,'parking'),fishing:navigationFor(merged,'fishing'),generalArea:mapsArea(merged)}};})};
   }else if(b.params.name==='get_fishing_journal')result={...await getPersonal(user),viewer};
   else if(b.params.name==='get_fishing_availability')result={...await availability.get(),viewer,canEdit};
   else if(b.params.name==='update_fishing_availability'){
    const spot=spots.find(spot=>spot.id===a.spot_id);
    if(!spot)throw new Error('Unknown fishing location.');
    if(a.availability?.active&&!accessIsSupported(spot))throw new Error('Correct and publish the parking-to-bank access audit before restoring active status.');
    result=await availability.save(user,a.spot_id,a.availability,a.expected_revision);
    if((result as {conflict?:boolean}).conflict)throw new Error('Availability changed. Read availability again before updating.');
   }else if(b.params.name==='update_fishing_visit'){
    if(!spots.some(s=>s.id===a.spot_id)||!Number.isInteger(a.expected_revision)||a.expected_revision<0)throw new Error('Invalid spot or revision');
    result=await saveRecord(user,a.spot_id,{visited:a.visited,rating:a.rating,notes:a.notes,lastVisited:a.last_visited,favorite:a.favorite},a.expected_revision);
    if((result as {conflict?:boolean}).conflict)throw new Error('Entry changed. Read the journal again before updating.');
   }else throw new Error('Unknown tool');
   return ok({content:[{type:'text',text:JSON.stringify(result)}]});
  }
  return Response.json({jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}});
 }catch(error){return ok({isError:true,content:[{type:'text',text:error instanceof Error?error.message:'Request failed'}]});}
}
