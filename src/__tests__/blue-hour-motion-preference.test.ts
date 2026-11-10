import {test} from 'node:test';
import assert from 'node:assert/strict';
const {parseMotionPreference,resolveReducedMotion,preferenceFromStorageEvent}=await import(new URL('../lib/blue-hour/motion-preference.ts',import.meta.url).href);
test('system follows device; explicit choices override it',()=>{
 for(const device of [false,true]){
  assert.equal(resolveReducedMotion('system',device),device);
  assert.equal(resolveReducedMotion('reduced',device),true);
  assert.equal(resolveReducedMotion('full',device),false);
 }
});
test('stored modes validate and cross-tab reset/clear returns system',()=>{
 for(const value of [null,'','garbage']) assert.equal(parseMotionPreference(value),'system');
 for(const value of ['system','full','reduced']) assert.equal(parseMotionPreference(value),value);
 assert.equal(preferenceFromStorageEvent('portagen:workspace-motion:v1',null),'system');
 assert.equal(preferenceFromStorageEvent(null,null),'system');
 assert.equal(preferenceFromStorageEvent('other','full'),null);
});
