type Rect = { top: number; left: number; width: number; height: number };
/** How much of a rectangular section sits beyond its parent's inner diagonal. */
export function sectionClipInsets(frame: Rect, section: Rect, cut: number, border: number) {
  if (frame.height <= border * 2 || frame.width <= border * 2) return { top: 0, bottom: 0 };
  const innerTop = frame.top + border;
  const innerRight = frame.left + frame.width - border;
  const innerHeight = frame.height - border * 2;
  const at = (y: number) => {
    const progress = Math.max(0, Math.min(1, (y - innerTop) / innerHeight));
    return Math.max(0, section.left + section.width - (innerRight - cut * progress));
  };
  return { top: at(section.top), bottom: at(section.top + section.height) };
}
