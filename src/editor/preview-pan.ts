import { makeEventListener } from "@solid-primitives/event-listener";
import { createPointerListeners } from "@solid-primitives/pointer";

/**
 * Middle-drag panning for a scroll container, suppressing the two middle-button
 * defaults it would otherwise trigger: the autoscroll circle (a mousedown
 * default), and on Linux/X11 the primary-selection paste into the editor (the
 * auxclick default, canceling it stops the paste at its source). Toggles
 * `cursor-grabbing` while panning. Listeners self-clean, so just call from a ref.
 */
export function attachPan(el: HTMLElement): void {
  let origin: { x: number; y: number; scrollLeft: number; scrollTop: number } | null = null;

  createPointerListeners({
    target: el,
    pointerTypes: ["mouse"],
    onDown: (e) => {
      if (e.button !== 1) {
        return;
      }
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
      origin = { x: e.clientX, y: e.clientY, scrollLeft: el.scrollLeft, scrollTop: el.scrollTop };
    },
    onMove: (e) => {
      if (!origin) {
        return;
      }
      el.scrollLeft = origin.scrollLeft - (e.clientX - origin.x);
      el.scrollTop = origin.scrollTop - (e.clientY - origin.y);
    },
    onUp: (e) => {
      if (e.button !== 1) {
        return;
      }
      origin = null;
      el.classList.remove("cursor-grabbing");
    },
  });

  // Suppress the autoscroll circle.
  makeEventListener(el, "mousedown", (e) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  });

  // Cancel the X11 primary-selection paste at its source.
  makeEventListener(el, "auxclick", (e) => {
    if (e.button === 1) {
      e.preventDefault();
    }
  });
}
