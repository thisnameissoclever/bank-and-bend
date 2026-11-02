import {test} from 'node:test';
import assert from 'node:assert/strict';
import {saveFavorite} from '../lib/favorite-store.ts';
import {applyDeviceFavorites,readDeviceFavorites,refreshJournalDraft} from '../lib/favorites.ts';
import type {JournalRecord,Spot} from '../lib/model.ts';

const record:JournalRecord={visited:true,rating:9,notes:'Quiet bank. No bites.',lastVisited:'2026-10-25',favorite:false,revision:3};
const spot={id:'river',history:{visited:true}} as Spot;
test('device favorites survive serialization and preserve unrelated journal fields',()=>{
 const choices=readDeviceFavorites(JSON.stringify({river:true,missing:true,bad:'true'}),[spot,{...spot,id:'bad'}]);
 assert.deepEqual(choices,{river:true});
 const journal={river:record};
 assert.deepEqual(applyDeviceFavorites(journal,[spot],choices).river,{...record,favorite:true});
 assert.equal(journal.river.favorite,false);
 assert.equal(applyDeviceFavorites({},[spot],choices).river.visited,true);
 assert.equal(applyDeviceFavorites({},[spot],{river:false}).river.favorite,false);
 for(const value of ['null','[]','broken',null])assert.deepEqual(readDeviceFavorites(value,[spot]),{});
});

test('changing favorites preserves an unfinished comment and permits its later save',()=>{
 const draft={...record,notes:'An unfinished new comment',rating:8};
 const current={...record,favorite:true,revision:4};
 assert.deepEqual(refreshJournalDraft(draft,record,current),{...draft,favorite:true,revision:4});
 assert.deepEqual(refreshJournalDraft(record,record,current),current);
});

test('other simultaneous journal changes keep the old revision to prevent an overwrite',()=>{
 const draft={...record,notes:'My unsaved comment'};
 const current={...record,notes:'A comment from another device',favorite:true,revision:5};
 assert.deepEqual(refreshJournalDraft(draft,record,current),draft);
});
