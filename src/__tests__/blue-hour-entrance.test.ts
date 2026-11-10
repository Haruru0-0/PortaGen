import { test } from 'node:test';
import assert from 'node:assert/strict';
const { canLoadEntrance, advanceEntrance } = await import(new URL('../lib/blue-hour/entrance-policy.ts', import.meta.url).href);
test('fresh eligible visit loads; every restriction prevents loading', () => {
  assert.equal(canLoadEntrance({ seen:false, reducedMotion:false, saveData:false }),true);
  for (const key of ['seen','reducedMotion','saveData']) assert.equal(canLoadEntrance({seen:false,reducedMotion:false,saveData:false,[key]:true}),false);
});
test('ready starts only waiting, settlement is terminal for late events', () => {
  assert.equal(advanceEntrance('waiting','ready'),'playing');
  for (const event of ['skip','ended','error','timeout','autoplay-rejected','interrupted','pause']) {
    assert.equal(advanceEntrance('playing',event),'settled');
    assert.equal(advanceEntrance(advanceEntrance('waiting',event),'ready'),'settled');
  }
});
