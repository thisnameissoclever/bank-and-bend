import {test} from 'node:test';
import assert from 'node:assert/strict';
import {preferencePatch} from '../lib/preferences.ts';
import {DEFAULT_FILTERS,clearedFilters,WEIGHTS,WEIGHTS_REVISION} from '../lib/model.ts';
test('saved preference API accepts and preserves multi-select arrays',()=>{
 const filters={...DEFAULT_FILTERS,waterType:['lake','river'],waterSpeed:['still','slow'],visited:['visited','unvisited'],pinQuality:['both','visual']};
 const result=preferencePatch.parse({filters,sort:'drive'});assert.deepEqual(result,{filters,sort:'drive'});
});
test('season and confidence thresholds persist while retired quietness is removed',()=>{
 const filters={...DEFAULT_FILTERS,minScores:{seasonalProspects:6,evidence:5,quietness:7}};
 const saved=preferencePatch.parse(JSON.parse(JSON.stringify({filters,sort:'score:seasonalProspects'})));
 assert.deepEqual(saved.filters?.minScores,{seasonalProspects:6,evidence:5});
 assert.equal(saved.sort,'score:seasonalProspects');
});
test('preference API upgrades old browser writes and rejects unknown categories',()=>{
 const filters={...DEFAULT_FILTERS,waterType:'river',waterSpeed:'mixed',visited:'all',pinQuality:'visual'};
 const result=preferencePatch.parse({filters}).filters!;assert.deepEqual(result.waterSpeed,['slow','fast']);assert.deepEqual(result.waterType,['river']);assert.deepEqual(result.visited,[]);assert.deepEqual(result.pinQuality,['visual']);
 assert.equal(preferencePatch.safeParse({filters:{...DEFAULT_FILTERS,waterSpeed:['torrential']}}).success,false);
});

test('availability preferences preserve OR selections and upgrade old requests',()=>{
 const {availability,...legacy}=DEFAULT_FILTERS;
 assert.deepEqual(preferencePatch.parse({filters:legacy}).filters?.availability,['active']);
 const chosen={...DEFAULT_FILTERS,availability:['active','inactive']};
 assert.deepEqual(preferencePatch.parse({filters:chosen}).filters?.availability,chosen.availability);
 assert.equal(preferencePatch.safeParse({filters:{...DEFAULT_FILTERS,availability:['maybe']}}).success,false);
});

test('custom weight preferences and decimal minimums survive a saved round trip',()=>{
 const prefs={weightsRevision:WEIGHTS_REVISION,weights:{...WEIGHTS,scenery:80},filters:{...DEFAULT_FILTERS,minOverall:7.3},sort:'overall'};
 assert.deepEqual(preferencePatch.parse(JSON.parse(JSON.stringify(prefs))),prefs);
 assert.equal(preferencePatch.safeParse({weights:{...WEIGHTS,evidence:25}}).success,true);
 assert.equal(preferencePatch.safeParse({weights:{...WEIGHTS,scenery:-1}}).success,false);
 assert.equal(preferencePatch.safeParse({weights:Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,0]))}).success,false);
 assert.equal(preferencePatch.safeParse({weights:{scenery:50}}).success,false);
});

test('old queued defaults migrate without changing filters or sort',()=>{
 const legacy={fishProspects:30,seclusion:15,quietness:10,bankQuantity:4,bankQuality:8,accessEase:3,waterManageability:15,scenery:10,evidence:0,seasonalProspects:0,travelFit:3,speciesFit:2};
 const result=preferencePatch.parse({weights:legacy,filters:{...DEFAULT_FILTERS,drive:50,states:['WA']},sort:'drive'});
 assert.deepEqual(result.weights,WEIGHTS);
 assert.equal(result.weightsRevision,WEIGHTS_REVISION);
 assert.equal(result.filters?.drive,50);
 assert.deepEqual(result.filters?.states,['WA']);
 assert.equal(result.sort,'drive');
 const {travelFit,fishProspects,quietness,speciesFit,...withoutTravel}=legacy;assert.deepEqual(preferencePatch.parse({weights:legacy,weightsRevision:WEIGHTS_REVISION}).weights,withoutTravel);
 assert.equal(preferencePatch.safeParse({weightsRevision:WEIGHTS_REVISION}).success,false);
});

test('removed travel thresholds and sort migrate without losing other filters',()=>{
 const result=preferencePatch.parse({filters:{...DEFAULT_FILTERS,drive:60,minScores:{travelFit:8,seclusion:6}},sort:'score:travelFit'});
 assert.deepEqual(result.filters?.minScores,{seclusion:6});assert.equal(result.filters?.drive,60);assert.equal(result.sort,'drive');
});

test('cleared filters survive validation and reload without changing other preferences',()=>{
 const previous={filters:{...DEFAULT_FILTERS,query:'Example Lake',favorites:true},sort:'drive',mapLayer:'satellite',weights:WEIGHTS};
 const patch=preferencePatch.parse({filters:clearedFilters()});
 const saved=JSON.parse(JSON.stringify({...previous,...patch}));
 assert.deepEqual(saved,{...previous,filters:clearedFilters()});
});

test('retired factor migration preserves current weights and removes hidden thresholds',()=>{
 const old={...WEIGHTS,fishProspects:100,quietness:15,seclusion:75,seasonalProspects:40};
 const result=preferencePatch.parse({weights:old,weightsRevision:3,filters:{...DEFAULT_FILTERS,drive:70,minScores:{fishProspects:6,quietness:7,seclusion:5,seasonalProspects:1}},sort:'score:fishProspects'});
 assert.deepEqual(result.weights,{...WEIGHTS,seclusion:75,seasonalProspects:40});
 assert.deepEqual(result.filters?.minScores,{seclusion:5,seasonalProspects:1});assert.equal(result.filters?.drive,70);assert.equal(result.sort,'score:seasonalProspects');
 assert.equal(preferencePatch.parse({sort:'score:quietness'}).sort,'overall');
});

test('retired species factor cannot survive settings, thresholds or sort migration',()=>{
 const saved=preferencePatch.parse({weights:{...WEIGHTS,seclusion:100,speciesFit:100},weightsRevision:4,sort:'score:speciesFit',filters:{...DEFAULT_FILTERS,species:['trout'],minScores:{speciesFit:10,seclusion:7}}});
 assert.deepEqual(saved.weights,{...WEIGHTS,seclusion:100});assert.equal(saved.sort,'overall');assert.deepEqual(saved.filters?.minScores,{seclusion:7});assert.deepEqual(saved.filters?.species,['trout']);assert.equal(saved.weightsRevision,WEIGHTS_REVISION);
});
