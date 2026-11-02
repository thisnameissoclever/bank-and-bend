import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {availabilityFor,visuallyInspected,missingPinReason,mapsArea,navigationFor,pinIsApproximate,supportedPin,filterSpots,DEFAULT_FILTERS} from '../lib/model.ts';
import type {Spot} from '../lib/model.ts';

const records=JSON.parse(readFileSync(new URL('../data/spots.json',import.meta.url),'utf8')) as Spot[];
const pin={lat:45.7,lng:-122.6,label:'Public bank',confidence:'Approximate supported access point',notes:'Bank visible on park map.',sourceIds:['park']};
const sample:Spot={...records[0],id:'access-test',parking:{...pin,label:'Public parking'},fishing:pin,availability:{active:true,checkedAt:'2026-10-28',reason:'Open',sourceUrls:[]},accessAudit:{status:'supported',checkedAt:'2026-10-28',summary:'Public parking connects to the park bank.',parkingVerified:true,fishingVerified:true,routeVerified:true,sourceIds:['park'],findings:['Manager map shows the public path.']}};

test('a coordinate alone cannot enable directions or an active recommendation',()=>{
 const unaudited={...sample,accessAudit:undefined};
 assert.equal(supportedPin(unaudited,'fishing'),null);
 assert.equal(navigationFor(unaudited,'parking').href,null);
 assert.equal(availabilityFor(unaudited).active,false);
});
test('failed public-route evidence blocks directions even after an active status override',()=>{
 const blocked={...sample,accessAudit:{...sample.accessAudit!,status:'unresolved' as const,routeVerified:false,summary:'The route crosses a residential parcel without a documented easement.'}};
 assert.equal(availabilityFor(blocked).active,false);
 assert.equal(navigationFor(blocked,'fishing').href,null);
 assert.equal(navigationFor(blocked,'parking').href,null);
 assert.equal(filterSpots([blocked],{...DEFAULT_FILTERS,drive:120},{}).length,0);
 assert.equal(filterSpots([blocked],{...DEFAULT_FILTERS,drive:120,availability:['inactive']},{}).length,1);
});
test('a missing or unsupported bank coordinate never falls back to a waterbody center',()=>{
 const missing={...sample,fishing:null};
 assert.equal(navigationFor(missing,'fishing').href,null);
 assert.ok(navigationFor(missing,'parking').href);
 const unchecked={...sample,accessAudit:{...sample.accessAudit!,fishingVerified:false}};
 assert.equal(navigationFor(unchecked,'fishing').href,null);
 assert.equal(supportedPin(unchecked,'fishing'),null);
});
test('supported coordinate links retain separate endpoints and identify approximate pins',()=>{
 const valid={...sample,parking:{...pin,lat:45.701,lng:-122.601}};
 assert.equal(new URL(navigationFor(valid,'parking').href!).searchParams.get('query'),'45.701,-122.601');
 assert.equal(new URL(navigationFor(valid,'fishing').href!).searchParams.get('query'),'45.7,-122.6');
 assert.equal(navigationFor(valid,'fishing').label,'Approx. point');
 assert.equal(pinIsApproximate({...pin,confidence:'approximate, imagery-supported'}),true);
 assert.equal(pinIsApproximate({...pin,confidence:'Documented parking lot'}),false);
});
test('inactive and date-closed locations retain research while directions are disabled',()=>{
 const closed={...sample,availability:{...sample.availability!,active:false,reason:'Access gate closed.'}};
 assert.equal(navigationFor(closed,'fishing').href,null);
 assert.equal(navigationFor(closed,'parking').reason,'Access gate closed.');
 const dated={...sample,availability:{...sample.availability!,inactiveFrom:'2000-01-01'}};
 assert.equal(navigationFor(dated,'fishing').href,null);
});
test('every published access has a dated individual audit and supported source references',()=>{
 for(const spot of records){
  const audit=spot.accessAudit;
  assert.ok(audit,spot.id+' access audit missing');
  if(spot.availability){assert.equal(typeof spot.availability.active,'boolean',spot.id+' explicit availability');assert.ok(spot.availability.reason&&spot.availability.checkedAt,spot.id+' availability details');}
  assert.ok(['supported','unresolved','blocked'].includes(audit.status),spot.id+' audit status');
  assert.match(audit.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(audit.summary.length>15,spot.id+' access summary');
  assert.ok(audit.findings.length>0,spot.id+' access findings');
  assert.ok(audit.sourceIds.length>0,spot.id+' access evidence');
  for(const id of audit.sourceIds)assert.ok(spot.sources.some(source=>source.id===id),spot.id+' missing access source '+id);
  if(audit.parkingVerified)assert.ok(spot.parking,spot.id+' parking evidence without coordinate');
  if(audit.fishingVerified)assert.ok(spot.fishing,spot.id+' bank evidence without coordinate');
  if(audit.status==='supported')assert.equal(audit.routeVerified,true,spot.id+' legal route');
  if(audit.status!=='supported'){
   assert.equal(availabilityFor(spot).active,false,spot.id+' unsupported access active');
   assert.equal(navigationFor(spot,'fishing').href,null,spot.id+' unsupported bank link');
  }
 }
});


test('fresh pause reviews remain visible without overriding a failed route audit',()=>{
 const audit={...sample.accessAudit!,status:'unresolved' as const,routeVerified:false,summary:'Older route uncertainty.'};
 const fresh={...sample,accessAudit:audit,availability:{...sample.availability!,active:false,checkedAt:'2026-10-30',reason:'Manager still closes the approach for construction.',sourceUrls:['https://example.com/current-closure']}};
 assert.deepEqual(availabilityFor(fresh),fresh.availability);
 assert.equal(navigationFor(fresh,'fishing').href,null);
 const prematureReopening={...fresh,availability:{...fresh.availability,active:true,reason:'Open'}};
 assert.equal(availabilityFor(prematureReopening).active,false);
 assert.equal(availabilityFor(prematureReopening).reason,audit.summary);
 const stalePause={...fresh,availability:{...fresh.availability,checkedAt:'2026-10-27'}};
 assert.equal(availabilityFor(stalePause).reason,audit.summary);
});

 test('every area link opens its own coordinate view without ambiguous place search',()=>{
  for(const spot of records){const url=new URL(mapsArea(spot));assert.equal(url.searchParams.get('map_action'),'map',spot.id);assert.equal(url.searchParams.get('center'),`${spot.lat},${spot.lng}`,spot.id);assert.equal(url.searchParams.has('query'),false,spot.id);}
  const county=records.find(s=>s.id==='washougal-county-line-hand-launch')!;assert.ok(mapsArea(county).includes('center=45.'));assert.equal(mapsArea({...county,generalAreaName:'Steamboat Landing Park'}),mapsArea(county));
 });

test('visual inspection is independent of missing coordinates and closure status',()=>{
 const inspected={...sample,parking:null,fishing:null,visualVerification:{status:'partial',method:'Aerial inspection',notes:'Trees cover parking.',sourceIds:['park']},sources:[{id:'park',title:'Manager aerial',url:'https://example.com/aerial',checkedAt:'2026-11-01',kind:'aerial',supports:'Reviewed'}],pinGaps:{parking:'Trees obscure the marked public lot.',fishing:'The bluff path endpoint has not been identified.'}};
 const filters={...DEFAULT_FILTERS,availability:[],drive:120,pinQuality:['visual']};
 assert.equal(visuallyInspected(inspected),true);assert.equal(filterSpots([inspected],filters,{}).length,1);
 assert.equal(filterSpots([inspected],{...filters,pinQuality:['both']},{}).length,0);
 assert.equal(filterSpots([inspected],{...filters,pinQuality:['both','visual']},{}).length,1);
 assert.equal(visuallyInspected({...inspected,visualVerification:{...inspected.visualVerification,status:'not available'}}),false);
 assert.equal(missingPinReason(inspected,'parking'),'Trees obscure the marked public lot.');
});

test('every listing records visual review and explains each absent parking or shore pin',()=>{
 for(const spot of records){
  assert.equal(visuallyInspected(spot),true,spot.id+' missing visual evidence');
  for(const kind of ['parking','fishing'] as const){
   if(!spot[kind])assert.ok((spot.pinGaps?.[kind]?.length??0)>20,spot.id+' missing '+kind+' explanation');
   if(spot[kind])assert.equal(spot.pinGaps?.[kind],undefined,spot.id+' obsolete '+kind+' gap');
  }
  assert.equal('speciesFit' in spot.scores,false,spot.id+' retired score');
  assert.equal('speciesFit' in spot.scoreReasons,false,spot.id+' retired explanation');
 }
});
