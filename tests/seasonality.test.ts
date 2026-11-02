import {test} from 'node:test';
import assert from 'node:assert/strict';
import {seasonAssessment,seasonalCalendar,pacificDate,validSeasonDate,validSeasonalOverride,validSeasonality,MONTH_LABELS} from '../lib/seasonality.ts';
import type {Seasonality,SeasonalOverride,SeasonalSpotLike} from '../lib/seasonality.ts';

const profile:Seasonality={monthlyScores:[2,3,5,7,9,8,6,5,7,8,4,3],rationale:'Cool spring and fall water usually favors trout near shore.',sourceIds:['fishery'],reviewedAt:'2026-01-01'};
const override:SeasonalOverride={score:9,from:'2026-10-24',through:'2026-11-02',reason:'A recent trout delivery improves near-term prospects.',sourceIds:['stocking'],checkedAt:'2026-10-24'};

test('calendar score follows month and year changes without changing the stored profile',()=>{
 const spot={seasonality:profile};
 assert.equal(seasonAssessment(spot,'2026-10-31').score,8);
 assert.equal(seasonAssessment(spot,'2026-11-01').score,4);
 assert.equal(seasonAssessment(spot,'2026-12-31').score,3);
 assert.equal(seasonAssessment(spot,'2027-01-01').score,2);
 assert.equal(seasonAssessment(spot,'2026-11-01').basis,'calendar');
 assert.equal(MONTH_LABELS.length,12);
 const calendar=seasonalCalendar(spot);calendar[0]=10;
 assert.equal(profile.monthlyScores[0],2);
});
test('Pacific dates cross midnight and daylight-saving boundaries correctly',()=>{
 assert.equal(pacificDate(new Date('2026-11-01T06:59:59Z')),'2026-10-31');
 assert.equal(pacificDate(new Date('2026-11-01T07:00:00Z')),'2026-11-01');
 assert.equal(pacificDate(new Date('2026-11-01T09:30:00Z')),'2026-11-01');
 assert.equal(pacificDate(new Date('2026-03-08T07:59:59Z')),'2026-03-07');
 assert.equal(pacificDate(new Date('2026-03-08T08:00:00Z')),'2026-03-08');
 assert.equal(seasonAssessment({seasonality:profile},new Date('2026-11-01T06:59:59Z')).score,8);
 assert.equal(seasonAssessment({seasonality:profile},new Date('2026-11-01T07:00:00Z')).score,4);
});
test('recent evidence overrides both boundary dates and then returns to the calendar',()=>{
 const spot={seasonality:profile,seasonalOverride:override};
 assert.equal(seasonAssessment(spot,'2026-10-23').score,8);
 for(const date of ['2026-10-24','2026-11-02']){
  const result=seasonAssessment(spot,date);
  assert.equal(result.score,9);assert.equal(result.basis,'recent');assert.equal(result.through,'2026-11-02');assert.equal(result.reviewedAt,'2026-10-24');assert.deepEqual(result.sourceIds,['stocking']);
 }
 const after=seasonAssessment(spot,'2026-11-03');
 assert.equal(after.score,4);assert.equal(after.basis,'calendar');assert.equal(after.through,undefined);
});
test('explicit unknown ratings remain unknown even when another stored score exists',()=>{
 const months=[...profile.monthlyScores];months[9]=null;
 const spot={seasonality:{...profile,monthlyScores:months},seasonalCheckedAt:'2026-10-24',scores:{seasonalProspects:10}};
 assert.equal(seasonAssessment(spot,'2026-10-26').score,null);
 assert.equal(seasonAssessment(spot,'2026-10-26').basis,'calendar');
 const recent=seasonAssessment({...spot,seasonalOverride:{...override,score:null}},'2026-10-26');
 assert.equal(recent.score,null);assert.equal(recent.basis,'recent');
 assert.equal(seasonAssessment({},'2026-10-26').basis,'unknown');
 assert.deepEqual(seasonalCalendar({}),Array(12).fill(null));
});
test('legacy scalar requires its own checked date and expires after fourteen calendar days',()=>{
 const spot={scores:{seasonalProspects:7},seasonalCheckedAt:'2026-10-18',scoreReasons:{seasonalProspects:'Earlier autumn assessment.'}};
 assert.equal(seasonAssessment(spot,'2026-10-18').score,7);
 const last=seasonAssessment(spot,'2026-11-01');
 assert.equal(last.score,7);assert.equal(last.through,'2026-11-01');assert.equal(last.reviewedAt,'2026-10-18');
 assert.equal(seasonAssessment(spot,'2026-11-02').score,null);
 assert.equal(seasonAssessment(spot,'2026-10-17').score,null);
 assert.equal(seasonAssessment({scores:spot.scores},'2026-10-26').score,null);
 assert.equal(seasonAssessment({...spot,seasonality:profile},'2026-10-26').score,8);
 assert.equal(seasonAssessment({...spot,scores:{seasonalProspects:null}},'2026-10-26').score,null);
});
test('invalid or future dates cannot activate recent evidence or borrow a stale score',()=>{
 assert.equal(validSeasonDate('2026-02-29'),false);
 assert.equal(validSeasonDate('2024-02-29'),true);
 for(const date of ['2026-02-30','2026-13-01','2026-10-26T00:00:00Z','today',''])assert.equal(seasonAssessment({seasonality:profile,seasonalOverride:override},date).score,null);
 assert.equal(seasonAssessment({seasonality:profile},new Date(NaN)).score,null);
 for(const invalid of [
  {...override,from:'2026-02-30'},
  {...override,through:'2026-10-01'},
  {...override,checkedAt:'2026-11-03'},
  {...override,score:11},
 ]){
  assert.equal(validSeasonalOverride(invalid),false);
  assert.equal(seasonAssessment({seasonality:profile,seasonalOverride:invalid},'2026-10-26').basis,'calendar');
 }
 assert.equal(seasonAssessment({seasonality:profile,seasonalOverride:{...override,checkedAt:'2026-10-27'}},'2026-10-26').basis,'calendar');
 assert.equal(seasonAssessment({seasonalCheckedAt:'2026-02-30',scores:{seasonalProspects:9}},'2026-10-26').score,null);
});
test('malformed monthly profiles fail closed, including when a legacy score is fresh',()=>{
 const invalidProfiles=[{...profile,monthlyScores:Array(12)},{...profile,monthlyScores:profile.monthlyScores.slice(1)},{...profile,monthlyScores:[0,...profile.monthlyScores.slice(1)]},{...profile,reviewedAt:'2026-02-30'},{...profile,rationale:''}];
 for(const invalid of invalidProfiles){
  assert.equal(validSeasonality(invalid),false);
  const spot={seasonality:invalid,scores:{seasonalProspects:10},seasonalCheckedAt:'2026-10-24'};
  assert.equal(seasonAssessment(spot,'2026-10-26').score,null);
 }
 assert.equal(seasonAssessment({seasonality:{...profile,reviewedAt:'2026-11-01'}},'2026-10-26').score,null);
 const malformed={seasonality:{monthlyScores:null}} as unknown as SeasonalSpotLike;
 assert.doesNotThrow(()=>seasonAssessment(malformed,'2026-10-26'));
});
