import {test} from 'node:test';
import assert from 'node:assert/strict';
const {sectionClipInsets}=await import(new URL('../lib/blue-hour/frame-geometry.ts',import.meta.url).href);
test('section backgrounds follow the parent diagonal at their actual vertical position',()=>{
 const result=sectionClipInsets({top:0,left:0,width:300,height:200},{top:2,left:2,width:296,height:98},20,2);
 assert.equal(result.top,0);
 assert.equal(result.bottom,10);
});
test('inset content does not gain an unnecessary cut; zero-height hidden frames are safe',()=>{
 assert.deepEqual(sectionClipInsets({top:0,left:0,width:300,height:200},{top:20,left:20,width:240,height:100},20,2),{top:0,bottom:0});
 assert.deepEqual(sectionClipInsets({top:0,left:0,width:0,height:0},{top:0,left:0,width:0,height:0},20,2),{top:0,bottom:0});
});
