import {test} from 'node:test';
import assert from 'node:assert/strict';
const {normalizeMusicRange,sliceAudioStream}=await import(new URL('../lib/music/audio-range.ts',import.meta.url).href);
test('bounds open-ended playback and seek requests while preserving small browser probes',()=>{
  assert.equal(normalizeMusicRange('bytes=0-'),'bytes=0-1048575');
  assert.equal(normalizeMusicRange('bytes=2097152-'),'bytes=2097152-3145727');
  assert.equal(normalizeMusicRange('bytes=0-1'),'bytes=0-1');
  assert.equal(normalizeMusicRange(null),'bytes=0-1048575');
  assert.equal(normalizeMusicRange('bytes=3047424-',3292364),'bytes=3047424-3292363');
  assert.equal(normalizeMusicRange('bytes=0-',3292364),'bytes=0-3292363');
  assert.equal(normalizeMusicRange('bytes=3292364-',3292364),null);
});
test('slices a browser seek across source chunks and cancels unused upstream bytes',async()=>{
  let cancelled=false;
  const source=new ReadableStream({start(c){c.enqueue(new Uint8Array([0,1,2]));c.enqueue(new Uint8Array([3,4,5]));c.enqueue(new Uint8Array([6,7,8]));},cancel(){cancelled=true;}});
  assert.deepEqual([...new Uint8Array(await new Response(sliceAudioStream(source,2,6)).arrayBuffer())],[2,3,4,5,6]);
  assert.equal(cancelled,true);
});
test('rejects malformed/multiple/reversed ranges and bounds suffix requests',()=>{
  for(const range of ['bytes=-','bytes=20-10','bytes=0-1,5-8','bytes=999999999999999999999-']) assert.equal(normalizeMusicRange(range),null);
  assert.equal(normalizeMusicRange('bytes=-3000000'),'bytes=-1048576');
});
