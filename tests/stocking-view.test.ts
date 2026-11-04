import {test} from 'node:test';
import assert from 'node:assert/strict';
import type {StockingEvent,StockingReview} from '../lib/stocking.ts';
import {DEFAULT_STOCKING,stockingDaysAgo,stockingSummary,stockingFlag,recentStockingFirst,activelyStocked,normalizeStocking} from '../lib/stocking-view.ts';
import {preferencePatch} from '../lib/preferences.ts';
import {readSharedView,shareLink} from '../lib/share-links.ts';
const today='2026-11-03';
const event=(patch:Partial<StockingEvent>={}):StockingEvent=>({date:'2026-10-27',status:'confirmed',species:'Rainbow',quantity:1080,size:'Legals',sourceIds:['agency'],...patch});
const review=(events:StockingEvent[],status:StockingReview['status']='confirmed-record'):StockingReview=>({waterbody:'Test lake',status,summary:'Test',checkedAt:today,nextReviewAt:'2026-11-05',sourceIds:['agency'],events});
test('stocking ages use calendar days across DST and reject invalid or future dates',()=>{
 assert.equal(stockingDaysAgo('2026-10-27',today),7);assert.equal(stockingDaysAgo('2026-10-31','2026-11-02'),2);
 assert.equal(stockingDaysAgo('2026-11-04',today),null);assert.equal(stockingDaysAgo('2026-02-30',today),null);
});
test('plans do not become deliveries when their dates pass',()=>{
 const r=review([event({status:'scheduled',date:'2026-11-01',through:'2026-11-30'})],'schedule-only');
 const s=stockingSummary(r,DEFAULT_STOCKING,today);assert.equal(s.qualifies,true);assert.equal(s.date,null);assert.equal(s.latest.length,0);assert.equal(stockingFlag(r,DEFAULT_STOCKING,today),'Planned');
 assert.equal(stockingSummary(r,{...DEFAULT_STOCKING,days:7},today).qualifies,false);
 assert.equal(activelyStocked(r,'2026-12-01'),false);
});
test('same-day species remain separate, size and species use OR within each group',()=>{
 const r=review([event(),event({species:'Brown',quantity:500}),event({date:today,lifeStage:'fry',size:'200/lb'}),event({date:'2026-10-26'})]);
 const s=stockingSummary(r,DEFAULT_STOCKING,today);assert.equal(s.days,7);assert.equal(s.latest.length,2);assert.equal(s.previous?.date,'2026-10-26');
 const both=stockingSummary(r,{...DEFAULT_STOCKING,sizes:['catchable','young'],species:['rainbow trout','brown trout']},today);assert.equal(both.days,0);
 assert.equal(stockingSummary(r,{...DEFAULT_STOCKING,species:['kokanee']},today).qualifies,false);
});
test('discontinued programs and old or zero deliveries do not qualify',()=>{
 assert.equal(activelyStocked(review([event()],'discontinued'),today),false);
 assert.equal(activelyStocked(review([event({date:'2024-01-01'})]),today),false);
 assert.equal(activelyStocked(review([event({quantity:0})]),today),false);
 assert.equal(stockingSummary(review([event({size:null})]),DEFAULT_STOCKING,today).qualifies,false);
 assert.equal(stockingSummary(review([event({size:null})]),{...DEFAULT_STOCKING,sizes:[]},today).qualifies,true);
});
test('recent sorting puts confirmed dates first and never mutates the input',()=>{
 const spots=[{name:'Planned',stocking:review([event({status:'scheduled',date:'2026-11-08'})])},{name:'Older',stocking:review([event()])},{name:'Newer',stocking:review([event({date:today})])}];
 assert.deepEqual(recentStockingFirst(spots,DEFAULT_STOCKING,today).map(s=>s.name),['Newer','Older','Planned']);assert.equal(spots[0].name,'Planned');
});
test('stocking preferences sync and share independently of Explore sorting',()=>{
 const stocking={...DEFAULT_STOCKING,days:14,sizes:['catchable','young'] as const,species:['rainbow trout'],sort:'recent'};
 const parsed=preferencePatch.parse({sort:'drive',stocking});assert.equal(parsed.sort,'drive');assert.equal(parsed.stocking?.sort,'recent');
 const shared=readSharedView(new URL(shareLink('https://bankandbend.com/',{view:'stocking',stocking:{...stocking,sizes:[...stocking.sizes]}})).hash);
 assert.deepEqual(shared,{view:'stocking',stocking});assert.deepEqual(readSharedView('#view=stocking&stocking=broken'),{view:'stocking'});
 assert.deepEqual(normalizeStocking(undefined),DEFAULT_STOCKING);
});
