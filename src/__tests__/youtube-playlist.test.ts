import {test} from 'node:test';
import assert from 'node:assert/strict';
const {parseYouTubePlaylistUrl}=await import(new URL('../lib/music/youtube-playlist.ts',import.meta.url).href);
test('canonicalizes music and watch playlist links without keeping tracking parameters',()=>{
 assert.deepEqual(parseYouTubePlaylistUrl('https://music.youtube.com/playlist?list=PLBCF2DAC6FFB574DE&si=tracking'),{id:'PLBCF2DAC6FFB574DE',url:'https://music.youtube.com/playlist?list=PLBCF2DAC6FFB574DE'});
 assert.equal(parseYouTubePlaylistUrl('www.youtube.com/watch?v=dQw4w9WgXcQ&list=PLBCF2DAC6FFB574DE')?.id,'PLBCF2DAC6FFB574DE');
});
test('rejects off-site, credential-bearing, non-playlist and malformed links',()=>{
 for(const url of ['https://youtube.com.evil.test/playlist?list=PLBCF2DAC6FFB574DE','https://evil.test/?list=PLBCF2DAC6FFB574DE','https://user:pass@youtube.com/playlist?list=PLBCF2DAC6FFB574DE','javascript:alert(1)','https://youtube.com/watch?v=dQw4w9WgXcQ','https://youtube.com/playlist?list=../secret','https://youtube.com:8888/playlist?list=PLBCF2DAC6FFB574DE']) assert.equal(parseYouTubePlaylistUrl(url),null,url);
});
