import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readMapState,mergeMapState,shouldCenterSelection} from '../lib/map-state.ts';
test('map view and open detail survive refresh without storing location fixes',()=>{
 const saved=mergeMapState(null,{center:[45.618,-122.255],zoom:16.5,spotId:'washougal-county-line-hand-launch',tab:'sources',detailHidden:false});
 assert.deepEqual(readMapState(JSON.stringify(saved)),saved);
 assert.deepEqual(mergeMapState(JSON.stringify(saved),{spotId:null}),{...saved,spotId:null});
 assert.deepEqual(mergeMapState(JSON.stringify(saved),{center:[46,-123],zoom:10}),{...saved,center:[46,-123],zoom:10});
 assert.deepEqual(readMapState(JSON.stringify({...saved,accuracy:12,origin:{lat:45,lng:-123},timestamp:123})),saved);
});
test('invalid storage cannot move the map outside supported bounds',()=>{
 for(const raw of ['bad','null','{"center":[999,999],"zoom":16}','{"center":[45,-122],"zoom":100}','{"center":["45",-122],"zoom":10}'])assert.deepEqual(readMapState(raw),{});
 assert.deepEqual(readMapState('{"spotId":"<bad>","tab":"unknown"}'),{});
});
test('restored and refreshed selections keep the viewport; new spot links center once',()=>{
 const saved={center:[45.6,-122.2] as [number,number],zoom:16,spotId:'saved-spot'};
 assert.equal(shouldCenterSelection('saved-spot',undefined,saved),false);
 assert.equal(shouldCenterSelection('new-spot',undefined,saved),true);
 assert.equal(shouldCenterSelection('saved-spot','saved-spot',saved),false);
 assert.equal(shouldCenterSelection('new-spot','saved-spot',saved),true);
 assert.equal(shouldCenterSelection(null,'saved-spot',saved),false);
 assert.equal(shouldCenterSelection('saved-spot',undefined,{}),true);
});

test('close Google views survive reload and selection updates',()=>{
 for(const zoom of [20,21,22,22.5]){
  const saved={center:[45.618,-122.255] as [number,number],zoom,spotId:'washougal-county-line-hand-launch'};
  const raw=JSON.stringify(saved);
  assert.deepEqual(readMapState(raw),saved);
  assert.deepEqual(mergeMapState(raw,{tab:'sources'}),{...saved,tab:'sources'});
  assert.equal(shouldCenterSelection(saved.spotId,undefined,readMapState(raw)),false);
 }
});
