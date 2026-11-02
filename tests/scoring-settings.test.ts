import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createScoringStore,ScoringPermissionError,scoringWriteSchema} from '../lib/scoring-settings.ts';
import {pacificDate} from '../lib/seasonality.ts';
import {WEIGHTS,overall,effectiveWeightShare} from '../lib/model.ts';
import type {Spot} from '../lib/model.ts';

test('importance accepts every score independently and rejects invalid or all-zero values',()=>{
 for(const key of Object.keys(WEIGHTS))assert.ok(scoringWriteSchema.safeParse({weights:{...WEIGHTS,[key]:100},expectedRevision:0}).success);
 for(const weights of [{...WEIGHTS,seclusion:-1},{...WEIGHTS,seclusion:101},{...WEIGHTS,seclusion:1.5},{...WEIGHTS,travelFit:5},Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,0]))])assert.equal(scoringWriteSchema.safeParse({weights,expectedRevision:0}).success,false);
});

test('independent 80 settings have equal influence and missing scores redistribute',()=>{
 const zero=Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,0])) as typeof WEIGHTS;
 const weights={...zero,seasonalProspects:80,seclusion:80,scenery:40};
 const spot={seasonalCheckedAt:pacificDate(),species:[],scores:{...Object.fromEntries(Object.keys(WEIGHTS).map(k=>[k,null])),seasonalProspects:9,seclusion:7,scenery:10}} as unknown as Spot;
 assert.equal(effectiveWeightShare(spot,weights,'seasonalProspects'),40);assert.equal(effectiveWeightShare(spot,weights,'seclusion'),40);assert.equal(overall(spot,weights),8.4);
 const missing={...spot,scores:{...spot.scores,scenery:null}};assert.equal(effectiveWeightShare(missing,weights,'seasonalProspects'),50);assert.equal(overall(missing,weights),8);
});

