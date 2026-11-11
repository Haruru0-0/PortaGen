/** Radix Select removes its popup immediately. Animate a decorative copy only;
 * the real menu can dismiss and restore focus without waiting for the effect. */
export function snapshotMenuExit(element: HTMLElement, onDone: () => void) {
  const rect = element.getBoundingClientRect();
  const computed = getComputedStyle(element);
  const snapshot = element.cloneNode(true) as HTMLElement;
  snapshot.inert = true;
  snapshot.setAttribute('aria-hidden', 'true');
  snapshot.setAttribute('data-state', 'closed');
  snapshot.setAttribute('data-menu-exit-snapshot', '');
  [snapshot, ...snapshot.querySelectorAll<HTMLElement>('[id]')].forEach(node => node.removeAttribute('id'));
  // Popper variables are normally inherited from a positioning wrapper.
  for (const property of computed) {
    if (property.startsWith('--')) snapshot.style.setProperty(property, computed.getPropertyValue(property));
  }
  snapshot.style.setProperty('--ws-menu-exit-opacity', computed.opacity);
  Object.assign(snapshot.style, {
    position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`, right: 'auto', bottom: 'auto',
    width: `${rect.width}px`, height: `${rect.height}px`, minWidth: '0', maxWidth: 'none',
    minHeight: '0', maxHeight: 'none', margin: '0', pointerEvents: 'none',
  });
  let removed = false;
  const cleanup = () => {
    if (removed) return;
    removed = true;
    clearTimeout(fallback);
    snapshot.removeEventListener('animationend', ended);
    snapshot.remove();
    onDone();
  };
  const ended = (event: AnimationEvent) => { if (event.target === snapshot) cleanup(); };
  const fallback = setTimeout(cleanup, 220);
  snapshot.addEventListener('animationend', ended);
  document.body.appendChild(snapshot);
  const viewports = element.querySelectorAll<HTMLElement>('.ws-menu-viewport');
  snapshot.querySelectorAll<HTMLElement>('.ws-menu-viewport').forEach((viewport, index) => {
    viewport.scrollTop = viewports[index]?.scrollTop ?? 0;
    viewport.scrollLeft = viewports[index]?.scrollLeft ?? 0;
  });
  return cleanup;
}
