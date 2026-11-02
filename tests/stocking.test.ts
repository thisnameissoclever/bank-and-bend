import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {stockingEventLabel,stockingEventText,sortedStockingEvents} from '../lib/stocking.ts';
import type {StockingEvent} from '../lib/stocking.ts';
import type {Spot} from '../lib/model.ts';
import {validSeasonDate} from '../lib/seasonality.ts';

const spots=JSON.parse(readFileSync(new URL('../data/spots.json',import.meta.url),'utf8')) as Spot[];
const plan:StockingEvent={date:'2026-10-19',through:'2026-10-23',status:'scheduled',species:'rainbow trout',quantity:1000,size:'Trophy',sourceIds:['schedule']};

test('past scheduled dates never become confirmed deliveries',()=>{
 assert.equal(stockingEventLabel(plan),'Scheduled');
 assert.equal(stockingEventLabel({...plan,status:'confirmed'}),'Confirmed delivery');
 assert.equal(stockingEventText(plan),'1,000 rainbow trout · Trophy');
 const unknown=stockingEventText({...plan,quantity:null,size:null});
 assert.ok(unknown.includes('Quantity not reported'));
 assert.ok(!unknown.includes('0 rainbow'));
});

test('event order retains status and the original array',()=>{
 const future={...plan,date:'2026-11-02',through:'2026-11-06'};
 const recent={...plan,date:'2026-10-27',through:undefined,status:'confirmed' as const};
 const original=[plan,recent,future];
 assert.deepEqual(sortedStockingEvents(original,'2026-11-01'),[future,recent,plan]);
 assert.deepEqual(original,[plan,recent,future]);
});

test('every stillwater has a dated stocking review with traceable events',()=>{
 const statuses=['confirmed-record','schedule-only','no-record','discontinued','private-managed','unavailable'];
 for(const spot of spots.filter(s=>['lake','pond','reservoir'].includes(s.waterType))){
  const review=spot.stocking;
  assert.ok(review,spot.id+' needs a stocking review');
  assert.ok(statuses.includes(review.status),spot.id);
  assert.ok(review.waterbody&&review.summary,spot.id);
  assert.ok(validSeasonDate(review.checkedAt)&&validSeasonDate(review.nextReviewAt),spot.id);
  assert.ok(review.nextReviewAt>review.checkedAt,spot.id);
  assert.ok(review.sourceIds.length>0,spot.id);
  const sourceIds=new Set(spot.sources.map(s=>s.id));
  for(const id of review.sourceIds)assert.ok(sourceIds.has(id),spot.id+' missing '+id);
  for(const event of review.events){
   assert.ok(['confirmed','scheduled'].includes(event.status),spot.id);
   assert.ok(validSeasonDate(event.date),spot.id+' invalid event date');
   if(event.through)assert.ok(validSeasonDate(event.through)&&event.through>=event.date,spot.id);
   if(event.status==='confirmed')assert.ok((event.through??event.date)<=review.checkedAt,spot.id+' future delivery');
   assert.ok(event.quantity===null||Number.isInteger(event.quantity)&&event.quantity>=0,spot.id);
   assert.ok(event.species&&event.sourceIds.length,spot.id);
   for(const id of event.sourceIds)assert.ok(sourceIds.has(id),spot.id+' missing event source '+id);
  }
 }
});

test('distinct neighboring ponds retain separate stocking evidence',()=>{
 const byId=(id:string)=>spots.find(s=>s.id===id)!.stocking!;
 assert.notDeepEqual(byId('east-pond-klineline').events,byId('klineline-pond').events);
 assert.notDeepEqual(byId('east-salish-pond-north-bank').events,byId('west-salish-pond-northwest-platform').events);
});
