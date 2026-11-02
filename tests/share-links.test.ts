import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readSharedView,shareLink,detailView} from '../lib/share-links.ts';
import {RETIRE_SPECIES_PREFERENCES} from '../lib/retired-score-storage.ts';
import {preferenceWriteSql} from '../lib/preference-storage.ts';
import {DEFAULT_FILTERS,clearedFilters} from '../lib/model.ts';
import {preferencePatch} from '../lib/preferences.ts';

test('filter links preserve multi-selects, decimal scores, text and sort without personal data',()=>{
 const filters={...DEFAULT_FILTERS,query:'Lewis & trout',states:['WA','OR'],waterSpeed:['slow','still'],minOverall:7.3,minScores:{seclusion:8},favorites:true};
 const link=shareLink('https://example.test/?token=private#old',{filters,sort:'score:seclusion'});
 assert.equal(new URL(link).search,'');
 assert.deepEqual(readSharedView(new URL(link).hash),{filters,sort:'score:seclusion'});
 assert.equal(link.includes('token'),false);
});

test('spot links open independently of filters and ignore malformed filter payloads',()=>{
 const url=shareLink('https://example.test/#filters=old',{spot:'washougal-county-line-hand-launch'});
 assert.deepEqual(readSharedView(new URL(url).hash),{spot:'washougal-county-line-hand-launch'});
 assert.deepEqual(readSharedView('#filters=%7Bbad&spot=kress-lake'),{spot:'kress-lake'});
 assert.deepEqual(readSharedView('#filters='+encodeURIComponent(JSON.stringify({...DEFAULT_FILTERS,waterSpeed:['invalid']}))),{});
 assert.deepEqual(readSharedView('#spot='+encodeURIComponent('<script>')),{});
 assert.deepEqual(readSharedView('#'+'x'.repeat(12001)),{});
});

test('detail display is device-only and never accepted in cloud preferences',()=>{
 assert.equal(detailView('fullscreen'),'fullscreen');assert.equal(detailView('modal'),'modal');assert.equal(detailView(null),'panel');assert.equal(detailView('invalid'),'panel');
 assert.equal(preferencePatch.safeParse({detailMode:'modal'}).success,false);
});
