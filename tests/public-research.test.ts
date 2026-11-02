import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {publicSpot,publicText} from '../lib/public-research.ts';
import {recordFor,filterSpots,clearedFilters} from '../lib/model.ts';
import type {Spot,Journal} from '../lib/model.ts';
const raw=JSON.parse(readFileSync(new URL('../data/spots.json',import.meta.url),'utf8')) as Spot[];
test('public locations have no owner visit history or travel baseline',()=>{
 const published=raw.map(publicSpot);
 for(const spot of published){
  assert.deepEqual(spot.history,{visited:false,notes:''});
  assert.equal(spot.driveMinutes,null);
  assert.equal('driveTimeBasis' in spot,false);
  assert.equal(recordFor(spot,{}).visited,false);
  assert.equal(spot.id,raw.find(s=>s.id===spot.id)!.id);
 }
 assert.equal(filterSpots(published,{...clearedFilters(),drive:15},{}).length,published.length);
 assert.ok(raw.every(s=>!s.history.visited),'Public source contains no visit history');
});
test('configured private names are removed without changing source URLs',()=>{
 assert.equal(publicText("Alex's visit: Alex found no bites.",'Alex Example','HomeTown'),"an angler's visit: an angler found no bites.");
 assert.equal(publicText("Alexandria Lake",'Alex Example','HomeTown'),"Alexandria Lake");
 assert.equal(publicText('https://example.org/hometown-moorage','Alex Example','HomeTown'),'https://example.org/hometown-moorage');
 assert.equal(publicText('https://www.google.com/maps/dir/HomeTown/pond','Alex Example','HomeTown'),'https://www.google.com/maps');
});
