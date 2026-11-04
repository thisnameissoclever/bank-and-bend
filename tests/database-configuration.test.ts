import {test} from 'node:test';
import assert from 'node:assert/strict';
import {databaseConnectionUrl} from '../lib/database-configuration.ts';

test('missing, redacted and placeholder database credentials fail before connection',()=>{
 assert.throws(()=>databaseConnectionUrl(undefined));
 for(const password of ['', '[REDACTED]','[YOUR-PASSWORD]','password','*****','••••••']){
  assert.throws(()=>databaseConnectionUrl(`postgresql://postgres:${encodeURIComponent(password)}@example.test:6543/postgres`));
 }
});
test('connection validation preserves a complete URL without exposing credentials in errors',()=>{
 const url='postgresql://postgres.project:synthetic%40test%3Avalue@example.test:6543/postgres';
 assert.equal(databaseConnectionUrl(url),url);
 assert.throws(()=>databaseConnectionUrl('https://example.test'),/PostgreSQL/);
 assert.throws(()=>databaseConnectionUrl('postgresql://postgres:bad%encoding@example.test/postgres'),/encoding is invalid/);
});
