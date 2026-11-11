const CHUNK = 1024 * 1024;

/** Normalize browser ranges against the actual media length. */
export function normalizeMusicRange(input: string | null, totalLength?: number): string | null {
  if (!input) return `bytes=0-${(totalLength ?? CHUNK) - 1}`;
  const match = /^bytes=(\d*)-(\d*)$/.exec(input);
  if (!match || (!match[1] && !match[2])) return null;
  if (!match[1]) {
    const length = Number(match[2]);
    if (!Number.isSafeInteger(length) || length <= 0) return null;
    return totalLength ? `bytes=${Math.max(0, totalLength - length)}-${totalLength - 1}` : `bytes=-${Math.min(length, CHUNK)}`;
  }
  const start = Number(match[1]);
  const end = match[2] ? Number(match[2]) : totalLength ? totalLength - 1 : start + CHUNK - 1;
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || end < start) return null;
  if (totalLength && start >= totalLength) return null;
  return `bytes=${start}-${Math.min(end, totalLength ? totalLength - 1 : start + CHUNK - 1)}`;
}

/** Some upstream streams allow complete delivery but reject arbitrary seeks.
 * Slice a fresh full response incrementally, without buffering the song. */
export function sliceAudioStream(body: ReadableStream<Uint8Array>, start: number, end: number) {
  const reader = body.getReader();
  let offset = 0;
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) { controller.close(); return; }
          const from = Math.max(0, start - offset);
          const to = Math.min(value.byteLength, end + 1 - offset);
          offset += value.byteLength;
          if (from < to) controller.enqueue(value.subarray(from, to));
          if (offset > end) { controller.close(); await reader.cancel(); return; }
          if (from < to) return;
        }
      } catch (error) { controller.error(error); }
    },
    cancel(reason) { return reader.cancel(reason); },
  });
}
