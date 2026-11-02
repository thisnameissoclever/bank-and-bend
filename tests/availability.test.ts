import {test} from 'node:test';
import assert from 'node:assert/strict';
import {availabilitySchema,availabilityWriteSchema,canEditAvailability,AvailabilityPermissionError} from '../lib/availability.ts';
import {createAvailabilityStore} from '../lib/availability-store.ts';

const input={active:false,reason:'Access road is closed.',checkedAt:'2026-10-24',nextReviewAt:'2026-10-31',sourceUrls:['https://example.gov/closures']};
test('availability editing requires the configured owner, including before storage access',async()=>{
 assert.equal(canEditAvailability('owner','owner'),true);
 for(const [user,owner] of [[null,'owner'],['visitor','owner'],['owner',undefined],['owner',''],[' ',' ']] as const){
  assert.equal(canEditAvailability(user,owner),false);
  await assert.rejects(createAvailabilityStore(undefined,owner).save(user,'lake',input,0),AvailabilityPermissionError);
 }
});

test('availability validates dates, public source URLs and the complete write shape',()=>{
 assert.deepEqual(availabilitySchema.parse({...input,inactiveFrom:'2026-11-01'}),{...input,inactiveFrom:'2026-11-01'});
 for(const invalid of [
  {...input,checkedAt:'2026-02-31'},
  {...input,nextReviewAt:'2026-10-01'},
  {...input,sourceUrls:['javascript:alert(1)']},
  {...input,sourceUrls:['not a URL']},
  {...input,sourceUrls:['https://secret:password@example.gov/']},
  {...input,active:'false'},
  {...input,reason:' '},
  {...input,revision:4},
  {...input,inactiveFrom:'tomorrow'},
  {...input,inactiveFrom:'2026-11-01T00:00:00Z'},
 ])assert.equal(availabilitySchema.safeParse(invalid).success,false);
 assert.equal(availabilityWriteSchema.safeParse({spotId:'lake',expectedRevision:-1,availability:input}).success,false);
 assert.equal(availabilityWriteSchema.safeParse({spotId:'lake',expectedRevision:0,availability:input,actorId:'owner'}).success,false);
});
