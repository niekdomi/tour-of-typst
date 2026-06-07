import { PreviewNavigator, type RenderedSvgPage } from "@vedivad/typst-web-service";
import {
  TbOutlineArrowAutofitHeight,
  TbOutlineArrowAutofitWidth,
  TbOutlineZoomIn,
  TbOutlineZoomOut,
} from "solid-icons/tb";
import { createMemo, createSignal, Index, onCleanup, onMount } from "solid-js";

import { Button } from "../components/ui/button";
import { useTheme } from "../lib/ThemeContext";
import { attachPan } from "./preview-pan";
import { useTypstResources } from "./typst-resources";

interface Props {
  pages: RenderedSvgPage[];
}

const BASE_WIDTH_PX = 700;
const ZOOM_STEP = 1.1;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const SCROLLER_PADDING_PX = 24;
const OUTLINE_SCROLL_MARGIN_PX = 80; // space above heading when navigating via outline/link

const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

export default function Preview(props: Props) {
  const { theme } = useTheme();
  const { project } = useTypstResources();
  const [zoom, setZoom] = createSignal(1);

  // Page wrappers by index; the navigator reads these to resolve clicks and scroll.
  const pageEls: (HTMLElement | undefined)[] = [];
  let nav: PreviewNavigator | undefined;

  // Hold the last non-empty pages so the preview keeps showing the previous output
  // (faded) while a recompile is in flight.
  const displayPages = createMemo<RenderedSvgPage[]>(
    (prev) => (props.pages.length > 0 ? props.pages : prev),
    []
  );

  let scroller: HTMLDivElement | undefined;

  const zoomAt = (newZoom: number, anchorClientX?: number, anchorClientY?: number) => {
    if (!scroller) {
      return;
    }

    const next = clampZoom(newZoom);
    const prev = zoom();
    if (next === prev) {
      return;
    }
    const ratio = next / prev;

    const rect = scroller.getBoundingClientRect();
    const ax = (anchorClientX ?? rect.left + rect.width / 2) - rect.left;
    const ay = (anchorClientY ?? rect.top + rect.height / 2) - rect.top;
    const sl = scroller.scrollLeft;
    const st = scroller.scrollTop;

    setZoom(next);

    requestAnimationFrame(() => {
      if (!scroller) {
        return;
      }

      scroller.scrollLeft = (sl + ax) * ratio - ax;
      scroller.scrollTop = (st + ay) * ratio - ay;
    });
  };

  const onWheel = (e: WheelEvent) => {
    if (!e.ctrlKey) {
      return;
    }

    e.preventDefault();
    const newZoom = e.deltaY > 0 ? zoom() / ZOOM_STEP : zoom() * ZOOM_STEP;
    zoomAt(newZoom, e.clientX, e.clientY);
  };

  const fitWidth = () => {
    if (!scroller) {
      return;
    }
    zoomAt(clampZoom((scroller.clientWidth - SCROLLER_PADDING_PX) / BASE_WIDTH_PX));
  };

  const fitHeight = () => {
    if (!scroller) {
      return;
    }

    const firstPage = displayPages()[0];
    if (!firstPage) {
      return;
    }

    const pageHeightPx = (firstPage.height / firstPage.width) * BASE_WIDTH_PX;
    zoomAt(clampZoom((scroller.clientHeight - SCROLLER_PADDING_PX) / pageHeightPx));
  };

  onMount(() => {
    requestAnimationFrame(() => {
      if (!scroller) {
        return;
      }

      const fit = (scroller.clientWidth - SCROLLER_PADDING_PX) / BASE_WIDTH_PX;
      if (fit < 1) {
        setZoom(clampZoom(fit));
      }
    });
  });

  // Click navigation through the engine: an internal link (e.g. an `#outline()`
  // entry) scrolls the preview to its target, a URL opens. The host owns pointer
  // handling (pan), so `listen` is off and clicks call `jumpAt` directly.
  onMount(() => {
    if (!scroller) {
      return;
    }
    nav = PreviewNavigator.create({
      project,
      scroller,
      pages: () => pageEls,
      listen: false,
      margin: OUTLINE_SCROLL_MARGIN_PX,
    });
  });

  onCleanup(() => nav?.dispose());

  return (
    <div class="flex h-full w-full flex-col overflow-hidden">
      <div class="border-border/60 bg-background flex shrink-0 items-center gap-1 border-b px-2 py-1">
        <Button
          variant="ghost"
          size="icon-sm"
          title="Zoom out"
          aria-label="Zoom out"
          onClick={() => {
            zoomAt(zoom() / ZOOM_STEP);
          }}
        >
          <TbOutlineZoomOut />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          class="w-14 font-mono tabular-nums"
          title="Reset zoom"
          aria-label="Reset zoom"
          onClick={() => {
            zoomAt(1);
          }}
        >
          {Math.round(zoom() * 100)}%
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          title="Zoom in"
          aria-label="Zoom in"
          onClick={() => {
            zoomAt(zoom() * ZOOM_STEP);
          }}
        >
          <TbOutlineZoomIn />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          title="Fit height"
          aria-label="Fit height"
          onClick={() => {
            fitHeight();
          }}
        >
          <TbOutlineArrowAutofitHeight />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          title="Fit width"
          aria-label="Fit width"
          onClick={() => {
            fitWidth();
          }}
        >
          <TbOutlineArrowAutofitWidth />
        </Button>
      </div>

      <div
        ref={(el) => {
          scroller = el;
          attachPan(el);
        }}
        tabindex={-1}
        class="bg-muted/40 min-h-0 flex-1 overflow-auto p-3 outline-none select-none"
        onWheel={onWheel}
        onClick={(e) => {
          e.preventDefault(); // stop SVG native href
          void nav?.jumpAt(e.clientX, e.clientY);
        }}
      >
        <div
          class="mx-auto flex flex-col items-center gap-6"
          style={{
            width: `${String(zoom() * BASE_WIDTH_PX)}px`,
            ...(theme() === "dark" ? { filter: "invert(0.85) hue-rotate(180deg)" } : {}),
          }}
        >
          <Index each={displayPages()}>
            {(page, index) => (
              // Typst draws each link as a transparent <rect> over the glyphs:
              // tint it on hover to mark the link and show a pointer.
              <div
                ref={(el) => {
                  pageEls[index] = el;
                }}
                class="w-full bg-white shadow-md ring-1 ring-black/10 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_svg_a]:cursor-pointer [&_svg_a_rect]:[transition:fill_100ms] [&_svg_a:hover_rect]:fill-yellow-300/50"
                classList={{ "opacity-50": props.pages.length === 0 }}
                innerHTML={page().svg}
              />
            )}
          </Index>
        </div>
      </div>
    </div>
  );
}
