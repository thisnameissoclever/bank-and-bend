import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {clearedFilters,filterSpots,normalizeFilters,activeFilterCount} from '../lib/model.ts';
import {preferencePatch} from '../lib/preferences.ts';
import type {Spot} from '../lib/model.ts';
const spots=JSON.parse(readFileSync(new URL('../data/spots.json',import.meta.url),'utf8')) as Spot[];
test('paid and unpaid filters partition the same corpus without changing other filters',()=>{
 const all=clearedFilters();
 const paid=filterSpots(spots,{...all,payment:'paid'},{});
 const unpaid=filterSpots(spots,{...all,payment:'unpaid'},{});
 assert.ok(paid.length>=4);
 assert.equal(paid.length+unpaid.length,spots.length);
 assert.ok(paid.every(s=>s.paidFishing));assert.ok(unpaid.every(s=>!s.paidFishing));
 assert.ok(paid.some(s=>s.id==='rainbow-trout-farm-sandy'));
 assert.ok(paid.some(s=>s.id==='hornings-hideout-trout'));
 assert.ok(!filterSpots(spots,{...all,payment:'paid',availability:['active']},{}).some(s=>s.id==='hornings-hideout-trout'));
 assert.ok(filterSpots(spots,{...all,payment:'paid',states:['WA']},{}).every(s=>s.state==='WA'));
 assert.equal(activeFilterCount({...all,payment:'paid'}),activeFilterCount(all)+1);
});
test('paid preference survives server validation and legacy preferences default to all',()=>{
 const before={...clearedFilters(),payment:'paid' as const,drive:75,species:['trout'],minScores:{seclusion:6}};
 const saved=preferencePatch.parse({filters:before,sort:'name'});
 assert.deepEqual(normalizeFilters(saved.filters),before);
 const {payment,...legacy}=before;
 assert.equal(normalizeFilters(legacy).payment,'all');
 assert.equal(preferencePatch.parse({filters:legacy}).filters?.payment,'all');
 assert.equal(normalizeFilters({...legacy,payment:'bogus'}).payment,'all');
 assert.equal(preferencePatch.safeParse({filters:{...legacy,payment:'bogus'}}).success,false);
});
test('paid access fees have dated attached sources and private license exceptions are explicit',()=>{
 for(const s of spots.filter(s=>s.paidFishing)){
  const p=s.paidFishing!;assert.match(p.checkedAt,/^\d{4}-\d{2}-\d{2}$/);assert.ok(p.summary.length>20);
  assert.ok(p.sourceIds.length>0);
  for(const id of p.sourceIds)assert.ok(s.sources.some(src=>src.id===id),s.id+' fee source');
 }
 assert.equal(spots.find(s=>s.id==='hornings-hideout-trout')?.paidFishing?.licenseRequired,false);
 assert.equal(spots.find(s=>s.id==='silver-lake-resort-docks')?.paidFishing?.licenseRequired,true);
});
test('unverified walking distance stays unknown and does not crash filtering',()=>{
 const candidate=spots.find(s=>s.id==='indian-springs-trout-farm')!;
 assert.equal(candidate.walk.minutes,null);
 assert.equal(filterSpots([candidate],{...clearedFilters(),walk:5},{}).length,1);
});
