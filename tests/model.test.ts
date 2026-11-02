import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {DEFAULT_FILTERS,clearedFilters,activeFilterCount,estimatedDriveMinutes,filterSpots,sortSpots,overall,fitAssessment,coverage,FIT_KEYS,scoresFor,scorePass,mapsPin,mapsArea,SCORE_LABELS,WEIGHTS,recordFor,normalizeFilters,availabilityFor,normalizeWeights,normalizeSavedWeights,WEIGHTS_REVISION,effectiveWeightShare,weightShare,formatScore,color} from '../lib/model.ts';
import {pacificDate,validSeasonality,validSeasonalOverride} from '../lib/seasonality.ts';
import type {Spot,Journal,Filters} from '../lib/model.ts';
const data=JSON.parse(readFileSync(new URL('../data/spots.json',import.meta.url),'utf8')) as Spot[];
const sample:Spot={accessAudit:{status:'supported',checkedAt:'2026-10-28',summary:'Public test access',parkingVerified:false,fishingVerified:false,routeVerified:true,sourceIds:[],findings:['Test route']},seasonalCheckedAt:pacificDate(),id:'sample',name:'Sample lake',state:'WA',waterType:'lake',waterSpeed:['still'],region:'Clark',lat:45.8,lng:-122.7,driveMinutes:[60,80],species:['trout'],walk:{minutes:[5,10],description:''},scores:{bankQuantity:8,bankQuality:8,accessEase:8,seclusion:8,waterManageability:8,seasonalProspects:8,scenery:8,evidence:8},scoreReasons:{} as Spot['scoreReasons'],sources:[],parking:null,fishing:null,visualVerification:{status:'not available',method:'',notes:'',sourceIds:[]},description:'',accessNotes:'',currentStatus:{label:'check before trip',summary:'',checkedAt:'2026-10-24'},retentionNotes:'',seasonNotes:'',crowdNotes:'',history:{visited:false,notes:''},unknowns:[],researchLog:[]};
const f=(patch:Partial<Filters>={})=>({...DEFAULT_FILTERS,minScores:{},...patch});
test('remaining baseline importances are preserved and distance cannot affect fit',()=>{assert.equal(Object.values(WEIGHTS).reduce((a,b)=>a+b,0),75);assert.equal('travelFit' in scoresFor(sample),false);assert.equal(overall({...sample,driveMinutes:[115,120]}),overall(sample));assert.equal('speciesFit' in scoresFor(sample),false);assert.equal(overall(sample),8)});
test('drive filter uses the displayed midpoint, and state/species intersection is correct',()=>{assert.equal(estimatedDriveMinutes(sample),70);assert.equal(filterSpots([sample],f({drive:69}),{}).length,0);assert.equal(filterSpots([sample],f({drive:70}),{}).length,1);assert.equal(filterSpots([sample],f({drive:80,species:['trout']}),{}).length,1);assert.equal(filterSpots([sample],f({states:['OR']}),{}).length,0);assert.equal(filterSpots([sample],f({species:['perch']}),{}).length,0)});
test('every sub-score can filter and nulls do not turn into zeros',()=>{for(const k of Object.keys(SCORE_LABELS)){const altered={...sample,scores:{...sample.scores,[k]:2}};assert.equal(filterSpots([altered],f({minScores:{[k]:9}}),{}).length,0)}assert.equal(scorePass(null,1,false),true);assert.equal(scorePass(null,5,false),false);assert.equal(scorePass(null,5,true),true)});
test('visited overrides seeded history in both directions',()=>{const seeded={...sample,history:{visited:true,notes:'Past visit'}};assert.equal(recordFor(seeded,{}).visited,true);const journal:Journal={sample:{visited:false,rating:7,notes:'',favorite:true,lastVisited:'',revision:1}};assert.equal(filterSpots([seeded],f({visited:['visited']}),journal).length,0);assert.equal(filterSpots([seeded],f({visited:['unvisited'],minRating:8}),journal).length,0);assert.equal(filterSpots([seeded],f({visited:['unvisited'],minRating:7,favorites:true}),journal).length,1)});
test('sort order handles unrated last without mutating the corpus',()=>{const b={...sample,id:'other',name:'Other',driveMinutes:[20,30] as [number,number]};const a=[sample,b];assert.equal(sortSpots(a,'drive',{})[0].id,'other');assert.equal(a[0].id,'sample');assert.equal(sortSpots(a,'rating',{sample:{visited:false,rating:5,notes:'',favorite:false,lastVisited:'',revision:1}})[0].id,'sample')});
test('exact pin links preserve coordinates and general area stays anchored',()=>{const p={lat:45.123456,lng:-122.654321,label:'bank',confidence:'documented',notes:'',sourceIds:[]};assert.equal(new URL(mapsPin(p)).searchParams.get('query'),'45.123456,-122.654321');assert.equal(new URL(mapsArea(sample)).searchParams.get('center'),`${sample.lat},${sample.lng}`)});
test('research corpus has supported unique locations, valid scores, sources and bounded pins',()=>{assert.ok(data.length>=15,'Must publish actual researched candidates');assert.equal(new Set(data.map(s=>s.id)).size,data.length);for(const s of data){assert.ok(['WA','OR'].includes(s.state));assert.ok(s.driveMinutes===null||s.driveMinutes[1]<=120,s.id+' drive');assert.ok(s.lat>=44&&s.lat<=48&&s.lng>=-125&&s.lng<=-120,s.id+' marker');assert.ok(s.species.every(x=>['trout','smallmouth bass','salmon','crappie','perch'].includes(x)),s.id+' species');assert.ok(s.sources.length>=2,s.id+' sources');assert.ok(s.waterSpeed.every(x=>['still','slow','fast'].includes(x)),s.id+' water speed');assert.ok(s.currentStatus.checkedAt);assert.ok(s.researchLog.length>0);for(const [k,v] of Object.entries(s.scores))assert.ok(v===null||Number.isInteger(v)&&v>=1&&v<=10,s.id+' '+k);for(const p of [s.parking,s.fishing])if(p){assert.ok(Math.abs(p.lat-s.lat)<.15&&Math.abs(p.lng-s.lng)<.15,s.id+' distant pin');assert.ok(p.sourceIds.length>0,s.id+' unsupported pin');for(const id of p.sourceIds)assert.ok(s.sources.some(x=>x.id===id),s.id+' dangling source '+id)}for(const src of s.sources){if(src.kind!=='user')assert.ok(src.url.startsWith('https://')||src.url.startsWith('http://'),s.id+' source URL');assert.ok(src.checkedAt)}}});

test('hard-fit mismatches cannot be averaged away by scenery',()=>{assert.equal(overall({...sample,scores:{...sample.scores,waterManageability:2}}),4);assert.equal(overall({...sample,scores:{...sample.scores,seclusion:3}}),5)});

test('confidence stays separate while seasonal prospects affect fit and remain filterable',()=>{
 const weaker={...sample,id:'season',scores:{...sample.scores,evidence:2,seasonalProspects:3}};
 assert.ok(fitAssessment(weaker).value!<fitAssessment(sample).value!);
 assert.equal(fitAssessment({...sample,scores:{...sample.scores,evidence:2}}).value,fitAssessment(sample).value);
 assert.equal(coverage(weaker),FIT_KEYS.filter(k=>WEIGHTS[k]>0).length);
 assert.deepEqual(filterSpots([sample,weaker],f({minScores:{seasonalProspects:7}}),{}).map(s=>s.id),['sample']);
 assert.deepEqual(filterSpots([sample,weaker],f({minScores:{evidence:7}}),{}).map(s=>s.id),['sample']);
 assert.equal(sortSpots([weaker,sample],'score:seasonalProspects',{})[0].id,'sample');
});
test('retired scores cannot affect fit or impose a cap',()=>{
 const noisy={...sample,scores:{...sample.scores,quietness:2}};
 assert.equal(fitAssessment(noisy).cap,10);
 assert.equal(fitAssessment(noisy).value,fitAssessment(sample).value);
 assert.ok(overall(noisy)!>4);
 const unknown={...sample,scores:{...sample.scores,evidence:null}};
 assert.equal(fitAssessment(unknown).value,fitAssessment(sample).value);
 assert.equal(coverage(unknown),FIT_KEYS.filter(k=>WEIGHTS[k]>0).length);
});

test('categorical selections use OR within a group and AND across groups',()=>{
 const slow={...sample,id:'slow',waterType:'river',waterSpeed:['slow']};
 const fast={...sample,id:'fast',waterType:'river',waterSpeed:['fast']};
 const variable={...sample,id:'variable',waterType:'river',waterSpeed:['slow','fast']};
 const pond={...sample,id:'pond',waterType:'pond',waterSpeed:['still']};
 const spots=[sample,slow,fast,variable,pond];
 assert.deepEqual(filterSpots(spots,f({waterSpeed:['still','slow']}),{}).map(s=>s.id),['sample','slow','variable','pond']);
 assert.deepEqual(filterSpots(spots,f({waterSpeed:['still','slow'],waterType:['lake','river']}),{}).map(s=>s.id),['sample','slow','variable']);
 assert.deepEqual(filterSpots(spots,f({waterSpeed:['fast']}),{}).map(s=>s.id),['fast','variable']);
 assert.equal(filterSpots(spots,f({visited:['visited','unvisited']}),{}).length,5);
 assert.equal(filterSpots(spots,f({waterType:[],waterSpeed:[]}),{}).length,5);
});
test('legacy saved filters migrate without resetting unrelated choices',()=>{
 const migrated=normalizeFilters({...DEFAULT_FILTERS,waterType:'river',waterSpeed:'mixed',visited:'unvisited',pinQuality:'both',drive:75});
 assert.deepEqual(migrated.waterType,['river']);assert.deepEqual(migrated.waterSpeed,['slow','fast']);assert.deepEqual(migrated.visited,['unvisited']);assert.deepEqual(migrated.pinQuality,['both']);assert.equal(migrated.drive,75);
 assert.deepEqual(normalizeFilters({waterType:'all',waterSpeed:'all',visited:'all',pinQuality:'all'}).waterType,[]);
 const chosen=f({waterSpeed:['still','slow'],waterType:['lake','river']});assert.deepEqual(normalizeFilters(JSON.parse(JSON.stringify(chosen))),chosen);
});

test('availability filter keeps inactive records discoverable without changing fit scores',()=>{
 const closed={...sample,id:'closed',availability:{active:false,reason:'Gate closed',checkedAt:'2026-10-24',sourceUrls:[]}};
 assert.deepEqual(filterSpots([sample,closed],f(),{}).map(s=>s.id),['sample']);
 assert.deepEqual(filterSpots([sample,closed],f({availability:['inactive']}),{}).map(s=>s.id),['closed']);
 assert.equal(filterSpots([sample,closed],f({availability:['active','inactive']}),{}).length,2);
 assert.equal(filterSpots([sample,closed],f({availability:[]}),{}).length,2);
 assert.equal(overall(closed),overall(sample));
 assert.deepEqual(normalizeFilters({drive:70,minScores:{seclusion:6}}).availability,['active']);
 assert.equal(normalizeFilters({drive:70,minScores:{seclusion:6}}).drive,70);
});


test('known closure dates change availability on the local date and leave earlier days active',()=>{
 const scheduled={...sample,availability:{active:true,reason:'Season ends October 31',checkedAt:'2026-10-24',inactiveFrom:'2026-11-01',sourceUrls:[]}};
 assert.equal(availabilityFor(scheduled,'2026-10-31').active,true);
 assert.equal(availabilityFor(scheduled,'2026-11-01').active,false);
 assert.equal(availabilityFor(scheduled,'2026-11-02').active,false);
});

test('decimal scores, colors and thresholds agree at the rounding boundary',()=>{
 const weights={...WEIGHTS,seasonalProspects:34};
 const fractional={...sample,scores:{...sample.scores,seasonalProspects:7}};
 const v=overall(fractional,weights)!;
 assert.equal(v,7.6);assert.ok(Math.abs(fitAssessment(fractional,weights).value!-(678/89))<.000001);
 assert.equal(formatScore(7),'7.0');assert.equal(formatScore(null),'?');
 for(let n=10;n<=100;n++)assert.match(color(n/10),/^#[0-9a-f]{6}$/);
 assert.equal(color(1),'#bd493d');assert.equal(color(10),'#087b59');
 assert.equal(filterSpots([fractional],f({minOverall:v}),{},weights).length,1);
 assert.equal(filterSpots([fractional],f({minOverall:v+.1}),{},weights).length,0);
});
test('custom weights change ranking consistently and preserve hard-fit caps',()=>{
 const fish={...sample,id:'fish',scores:{...sample.scores,seasonalProspects:9,scenery:5}};
 const view={...sample,id:'view',scores:{...sample.scores,seasonalProspects:5,scenery:9}};
 const weights={...Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,0])),scenery:100} as typeof WEIGHTS;
 assert.equal(sortSpots([view,fish],'overall',{})[0].id,'fish');
 assert.equal(sortSpots([view,fish],'overall',{},weights)[0].id,'view');
 assert.deepEqual(filterSpots([view,fish],f({minOverall:8.1}),{},weights).map(s=>s.id),['view']);
 assert.equal(overall(view,weights),9);assert.equal(coverage(view,weights),1);
 assert.equal(overall({...view,scores:{...view.scores,waterManageability:2}},weights),4);
 const unknown={...view,scores:{...view.scores,scenery:null}};
 assert.equal(overall(unknown,weights),null);assert.equal(coverage(unknown,weights),0);
});
test('weight migration handles legacy, invalid and zero values without changing independent scores',()=>{
 assert.deepEqual(normalizeWeights(undefined),WEIGHTS);
 assert.deepEqual(normalizeWeights(Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,0]))),WEIGHTS);
 const w=normalizeWeights({scenery:80,fishProspects:NaN,evidence:100,seasonalProspects:100});
 assert.equal(w.scenery,80);assert.equal('fishProspects' in w,false);assert.equal(w.evidence,100);assert.equal(w.seasonalProspects,100);
 assert.ok(Math.abs(FIT_KEYS.reduce((sum,k)=>sum+weightShare(w,k),0)-100)<.000001);
});
test('bank-speed filters distinguish the Hathaway observation from Mission Bar current',()=>{
 assert.ok(data.every(s=>s.waterSpeed.length===1||s.waterSpeed.length===0&&!availabilityFor(s).active),'Use the primary casting-position current, or leave an unsupported inactive position unknown');
 const rivers=data.filter(s=>s.waterType==='river');
 const slow=filterSpots(rivers,f({drive:120,waterSpeed:['slow']}),{}).map(s=>s.id);
 const fast=filterSpots(rivers,f({drive:120,waterSpeed:['fast']}),{}).map(s=>s.id);
 assert.ok(slow.includes('washougal-hathaway-bank'));assert.ok(!fast.includes('washougal-hathaway-bank'));
 assert.ok(fast.includes('cowlitz-mission-bar'));assert.ok(!slow.includes('cowlitz-mission-bar'));
 const h=data.find(s=>s.id==='washougal-hathaway-bank')!;
 assert.equal(h.waterSpeedBasis,'observed');assert.equal(h.waterSpeedCheckedAt,'2026-10-24');assert.equal(h.scores.waterManageability,9);
});

test('saved default weights upgrade while custom and revisioned choices remain intact',()=>{
 const legacy={fishProspects:30,seclusion:15,quietness:10,bankQuantity:4,bankQuality:8,accessEase:3,waterManageability:15,scenery:10,evidence:0,seasonalProspects:0,travelFit:3,speciesFit:2};
 assert.deepEqual(normalizeSavedWeights(legacy),WEIGHTS);
 const {travelFit,fishProspects,quietness,speciesFit,...withoutTravel}=legacy;assert.deepEqual(normalizeSavedWeights({...legacy,scenery:25}),{...withoutTravel,scenery:25});
 assert.deepEqual(normalizeSavedWeights(legacy,WEIGHTS_REVISION),withoutTravel);
 assert.deepEqual(normalizeSavedWeights(undefined),WEIGHTS);
});
test('usable bank outweighs casting and casting no longer imposes a separate cap',()=>{
 const casting={...sample,scores:{...sample.scores,bankQuality:1}};
 const bank={...sample,scores:{...sample.scores,bankQuantity:1}};
 assert.equal(fitAssessment(casting).cap,10);
 assert.ok(Math.abs(fitAssessment(sample).value!-fitAssessment(casting).value!-(21/75))<1e-9);
 assert.ok(fitAssessment(bank).value!<fitAssessment(casting).value!);
});

test('missing factors redistribute their weight without lowering or inventing a score',()=>{
 const missing={...sample,scores:{...sample.scores,bankQuantity:null}};
 const expected=(fitAssessment(sample).raw!*77-8*WEIGHTS.bankQuantity)/(77-WEIGHTS.bankQuantity);
 assert.ok(Math.abs(fitAssessment(missing).raw!-expected)<1e-9);
 assert.equal(effectiveWeightShare(missing,WEIGHTS,'bankQuantity'),0);
 assert.ok(Math.abs(FIT_KEYS.reduce((sum,k)=>sum+effectiveWeightShare(missing,WEIGHTS,k),0)-100)<1e-9);
 const noEvidence={...sample,species:[],scores:Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,null])) as Spot['scores']};
 const weights={...Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,0])),bankQuantity:100} as typeof WEIGHTS;
 assert.equal(overall(noEvidence,weights),null);
});

test('all published seasonal profiles and recent overrides have valid dates and attached sources',()=>{
 for(const spot of data){
  assert.ok(validSeasonality(spot.seasonality),spot.id+' monthly profile');
  const ids=new Set(spot.sources.map(source=>source.id));
  assert.ok(spot.seasonality!.sourceIds.length>0,spot.id+' profile evidence');
  for(const id of spot.seasonality!.sourceIds)assert.ok(ids.has(id),spot.id+' missing profile source '+id);
  if(spot.seasonalOverride){
   assert.ok(validSeasonalOverride(spot.seasonalOverride),spot.id+' override');
   assert.ok(spot.seasonalOverride.sourceIds.length>0,spot.id+' override evidence');
   for(const id of spot.seasonalOverride.sourceIds)assert.ok(ids.has(id),spot.id+' missing override source '+id);
  }
 }
});

test('water-advisory findings retain dates and resolvable evidence separately from access',()=>{
 for(const spot of data){
  const review=spot.waterQuality;if(!review)continue;
  assert.ok(['none-reported','none-found','caution','active','unavailable'].includes(review.status),spot.id);
  assert.match(review.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(review.nextReviewAt>=review.checkedAt,spot.id+' follow-up date');
  assert.ok(review.sourceIds.length>0,spot.id+' advisory evidence');
  for(const id of review.sourceIds)assert.ok(spot.sources.some(s=>s.id===id&&s.url),spot.id+' missing advisory source '+id);
  if(review.lastSampleDate)assert.ok(review.lastSampleDate<=review.checkedAt,spot.id+' sample date');
  if(review.sourceUpdatedAt)assert.ok(review.sourceUpdatedAt<=review.checkedAt,spot.id+' source date');
 }
});

test('clear filters restores the entire corpus, including inactive and unknown-score spots',()=>{
 const cleared=clearedFilters();
 assert.equal(activeFilterCount(cleared),0);
 assert.equal(filterSpots(data,cleared,{}).length,data.length);
 assert.equal(activeFilterCount({...cleared,query:'Example Lake'}),1);
 assert.equal(activeFilterCount({...cleared,states:['WA'],minScores:{seasonalProspects:6}}),2);
});

test('drive sorting uses rounded midpoint rather than the largest estimate',()=>{
 const broad={...sample,id:'broad',driveMinutes:[40,80] as [number,number]};
 const narrow={...sample,id:'narrow',driveMinutes:[61,65] as [number,number]};
 assert.equal(sortSpots([narrow,broad],'drive',{})[0].id,'broad');
 assert.equal(estimatedDriveMinutes({...sample,driveMinutes:[60,65]}),63);
});

test('privacy affects weighted fit while physical separation retains its own cap',()=>{
 const review={checkedAt:'2026-10-31',sourceIds:[],limitations:[],physicalSpaceScore:8,physicalSpaceReason:'Room to spread out.'};
 const exposed={...sample,privacyReview:review,scores:{...sample.scores,seclusion:2}};
 assert.equal(fitAssessment(exposed).cap,10);
 assert.ok(overall(exposed)!<overall({...exposed,scores:{...exposed.scores,seclusion:8}})!);
 const cramped={...exposed,privacyReview:{...review,physicalSpaceScore:3},scores:{...exposed.scores,seclusion:8}};
 assert.equal(fitAssessment(cramped).cap,5);
 assert.equal(fitAssessment(cramped).limitingFactor,'Physical separation');
 const unknown={...exposed,privacyReview:{...review,physicalSpaceScore:null},scores:{...exposed.scores,seclusion:null}};
 assert.equal(fitAssessment(unknown).cap,10);
 assert.equal(scoresFor(unknown).seclusion,null);
});

test('every privacy review has a dated rationale and attached evidence',()=>{
 for(const spot of data){
  assert.ok(spot.privacyReview,spot.id+' missing privacy review');
  const review=spot.privacyReview!;
  assert.match(review.checkedAt,/^\d{4}-\d{2}-\d{2}$/);
  assert.ok(spot.scoreReasons.seclusion.length>30,spot.id+' privacy rationale');
  assert.ok(review.physicalSpaceScore===null||Number.isInteger(review.physicalSpaceScore)&&review.physicalSpaceScore>=1&&review.physicalSpaceScore<=10,spot.id+' physical separation');
  if(spot.scores.seclusion!==null)assert.ok(review.sourceIds.length>0,spot.id+' unsupported privacy rating');
  for(const id of review.sourceIds)assert.ok(spot.sources.some(source=>source.id===id),spot.id+' dangling privacy source '+id);
 }
});
