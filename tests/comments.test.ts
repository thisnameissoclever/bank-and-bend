import {test} from 'node:test';
import assert from 'node:assert/strict';
import {appendComment,NOTES_LIMIT} from '../lib/comments.ts';

test('appending preserves earlier notes and dates a comment in Pacific time',()=>{
 const previous='Earlier visit: no bites.\nOriginal note with its spacing. ';
 const next=appendComment(previous,'Beautiful water.\nStill no bites.',new Date('2026-10-25T01:30:00Z'));
 assert.equal(next,previous+'\n\nOctober 24, 2026:\nBeautiful water.\nStill no bites.');
});
test('empty comments and over-limit additions fail without truncating existing notes',()=>{
 assert.throws(()=>appendComment('Existing note','   '),/Write a comment/);
 const previous='x'.repeat(NOTES_LIMIT);
 assert.throws(()=>appendComment(previous,'New observation'),/8,000-character/);
 assert.equal(previous.length,NOTES_LIMIT);
});
test('the first comment uses the same format and retains literal user text',()=>{
 const text="holy shit this is beautiful <3";
 assert.equal(appendComment('',text,new Date('2026-10-24T22:00:00Z')),'October 24, 2026:\n'+text);
});
