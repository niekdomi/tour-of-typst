import { createSignal, onCleanup, onMount } from "solid-js";

interface Props {
  direction: "horizontal" | "vertical";
  fraction: number;
  min?: number;
  max?: number;
  onChange: (fraction: number) => void;
}

export default function ResizeHandle(props: Props) {
  const min = () => props.min ?? 0.15;
  const max = () => props.max ?? 0.85;
  const [dragging, setDragging] = createSignal(false);
  let el: HTMLDivElement | undefined;

  function onPointerMove(e: PointerEvent) {
    if (!dragging() || !el?.parentElement) return;
    const rect = el.parentElement.getBoundingClientRect();
    const raw =
      props.direction === "horizontal"
        ? (e.clientX - rect.left) / rect.width
        : (e.clientY - rect.top) / rect.height;
    props.onChange(Math.min(Math.max(raw, min()), max()));
  }

  function onPointerUp() {
    setDragging(false);
  }

  onMount(() => {
    globalThis.addEventListener("pointermove", onPointerMove);
    globalThis.addEventListener("pointerup", onPointerUp);
  });

  onCleanup(() => {
    globalThis.removeEventListener("pointermove", onPointerMove);
    globalThis.removeEventListener("pointerup", onPointerUp);
  });

  function onPointerDown(e: PointerEvent) {
    setDragging(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onKeyDown(e: KeyboardEvent) {
    const step = 0.05;
    const back = props.direction === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const forward = props.direction === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (e.key === back) {
      e.preventDefault();
      props.onChange(Math.max(props.fraction - step, min()));
    } else if (e.key === forward) {
      e.preventDefault();
      props.onChange(Math.min(props.fraction + step, max()));
    }
  }

  const isHorizontal = () => props.direction === "horizontal";

  return (
    <div
      ref={(e) => {
        el = e;
      }}
      role="slider"
      aria-orientation={props.direction}
      aria-label={isHorizontal() ? "Resize panels left and right" : "Resize panels up and down"}
      aria-valuemin={Math.round(min() * 100)}
      aria-valuemax={Math.round(max() * 100)}
      aria-valuenow={Math.round(props.fraction * 100)}
      tabindex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      class="relative z-10 shrink-0 touch-none bg-border transition-colors after:absolute after:inset-0 hover:bg-brand focus-visible:bg-brand focus-visible:outline-none"
      classList={{
        "w-[5px] h-full cursor-col-resize after:inset-y-0 after:-inset-x-1": isHorizontal(),
        "h-[5px] w-full cursor-row-resize after:inset-x-0 after:-inset-y-1": !isHorizontal(),
        "bg-brand": dragging(),
      }}
    />
  );
}
