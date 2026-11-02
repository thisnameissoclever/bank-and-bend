import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {destination,directMiles,readRoutes,routeUrl,travelMinutes} from '../lib/travel.ts';
import {clearedFilters,filterSpots,sortSpots,WEIGHTS} from '../lib/model.ts';
import type {Spot} from '../lib/model.ts';
const spots=JSON.parse(readFileSync(new URL('../data/spots.json',import.meta.url),'utf8')) as Spot[];
const pair=spots.slice(0,2),origin={lat:45.7098,lng:-122.7073};
test('routing requests use longitude first and road metrics without speed fallback',()=>{
 const url=new URL(routeUrl(origin,pair));assert.ok(url.pathname.includes('-122.70730,45.70980;'));assert.equal(url.searchParams.get('annotations'),'duration,distance');assert.equal(url.searchParams.get('sources'),'0');assert.equal(url.searchParams.get('destinations'),'1;2');assert.equal(url.searchParams.has('fallback_speed'),false);
});
test('road times convert once and inaccessible or badly snapped results stay unknown',()=>{
 const table={code:'Ok',durations:[[2535.3,null]],distances:[[46605.5,null]],sources:[{distance:10}],destinations:[{distance:15},{distance:20}]};
 const result=readRoutes(table,pair);assert.equal(result[pair[0].id].minutes,42);assert.ok(Math.abs(result[pair[0].id].miles!-28.959)<.01);assert.equal(result[pair[1].id].minutes,null);
 assert.equal(readRoutes({...table,sources:[{distance:2001}]},pair)[pair[0].id].minutes,null);
 assert.equal(readRoutes({...table,destinations:[{distance:1501},{distance:20}]},pair)[pair[0].id].minutes,null);
 assert.equal(readRoutes({...table,durations:[[NaN,Infinity]]},pair)[pair[0].id].minutes,null);
 assert.throws(()=>readRoutes({...table,code:'Error'},pair));
});
test('current-location filtering and sorting never borrow another person’s travel times',()=>{
 const routes={[pair[0].id]:{minutes:95,miles:50,approximate:false},[pair[1].id]:{minutes:20,miles:10,approximate:false}};
 const drive=(spot:Spot)=>travelMinutes(spot,origin,routes);
 assert.deepEqual(filterSpots(pair,{...clearedFilters(),drive:90},{},WEIGHTS,drive).map(s=>s.id),[pair[1].id]);
 assert.equal(sortSpots(pair,'drive',{},WEIGHTS,drive)[0].id,pair[1].id);
 assert.equal(travelMinutes(pair[0],origin,{}),null);
 assert.equal(travelMinutes(pair[0],null,{}),null);
 const partial=(spot:Spot)=>travelMinutes(spot,origin,{[pair[1].id]:routes[pair[1].id]});
 assert.equal(filterSpots(pair,{...clearedFilters(),drive:30},{},WEIGHTS,partial).length,2);
 assert.equal(sortSpots(pair,'drive',{},WEIGHTS,partial)[0].id,pair[1].id);
});
test('unsupported parking uses a labeled area destination without enabling directions',()=>{
 const spot={...pair[0],accessAudit:undefined};assert.deepEqual(destination(spot),{lat:spot.lat,lng:spot.lng,approximate:true});assert.equal(directMiles(origin,origin),0);assert.ok(directMiles(origin,{lat:46.7098,lng:origin.lng})>69);
});
