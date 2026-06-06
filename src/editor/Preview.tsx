import type { RenderedSvgPage } from "@vedivad/typst-web-service";
import {
  TbOutlineArrowAutofitHeight,
  TbOutlineArrowAutofitWidth,
  TbOutlineZoomIn,
  TbOutlineZoomOut,
} from "solid-icons/tb";
import { createMemo, createSignal, Index, onMount } from "solid-js";

import { Button } from "../components/ui/button";
import { useTheme } from "../lib/ThemeContext";
import { useTypstResources } from "./typst-resources";

interface Props {
  pages: RenderedSvgPage[];
}

const BASE_WIDTH_PX = 700;
const ZOOM_STEP = 1.1;
const ZOOM_MIN = 0.25;
const ZOOM_MAX = 4;
const SCROLLER_PADDING_PX = 24;

const clampZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

export default function Preview(props: Props) {
  const { theme } = useTheme();
  const { project } = useTypstResources();
  const [zoom, setZoom] = createSignal(1);
  const [panning, setPanning] = createSignal(false);

  // Page wrappers by index, for hit-testing a click to a page + point.
  const pageEls: (HTMLElement | undefined)[] = [];
  let dragMoved = false;

  // Hold the last non-empty pages so the preview keeps showing the previous output
  // (faded) while a recompile is in flight.
  const displayPages = createMemo<RenderedSvgPage[]>(
    (prev) => (props.pages.length > 0 ? props.pages : prev),
    []
  );

  let scroller: HTMLDivElement | undefined;
  let panOrigin: { x: number; y: number; scrollLeft: number; scrollTop: number } | null = null;

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

  /**
   * Smoothly scrolls the preview so a document location sits near the top of the
   * viewport. `page` is 0-based; `y` is in page points, scaled to pixels via the
   * page's rendered width.
   */
  function jumpToLocation(page: number, y: number) {
    const el = pageEls[page];
    const dims = displayPages()[page];
    if (!scroller || !el || !dims) {
      return;
    }

    const scale = (zoom() * BASE_WIDTH_PX) / dims.width;
    const pageTop = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
    scroller.scrollTo({
      top: scroller.scrollTop + pageTop + y * scale - 40,
      behavior: "smooth",
    });
  }

  /**
   * Resolve a plain click via the engine (the SVG carries no link destinations):
   * an internal link (e.g. an `#outline()` entry) scrolls the preview to its
   * target; a URL opens. Other clicks (plain text) do nothing here.
   */
  function handleClick(clientX: number, clientY: number) {
    const pages = displayPages();
    for (let i = 0; i < pageEls.length; i++) {
      const el = pageEls[i];
      const page = pages[i];
      if (!el || !page) {
        continue;
      }

      const r = el.getBoundingClientRect();
      if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) {
        continue;
      }

      const scale = (zoom() * BASE_WIDTH_PX) / page.width;
      void (async () => {
        const jump = await project.clickJump(
          i,
          (clientX - r.left) / scale,
          (clientY - r.top) / scale
        );

        if (jump?.kind === "position") {
          jumpToLocation(jump.page, jump.y);
        } else if (jump?.kind === "url") {
          globalThis.open(jump.url, "_blank", "noopener,noreferrer");
        }
      })();

      return;
    }
  }

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

  const onPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || !scroller) {
      return;
    }

    e.preventDefault();
    scroller.setPointerCapture(e.pointerId);
    scroller.focus({ preventScroll: true });
    dragMoved = false;

    panOrigin = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: scroller.scrollLeft,
      scrollTop: scroller.scrollTop,
    };
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!panOrigin || !scroller) {
      return;
    }

    const dx = e.clientX - panOrigin.x;
    const dy = e.clientY - panOrigin.y;

    // Only a real drag is a pan; below the threshold, the release is a click.
    if (!dragMoved && (Math.abs(dx) > 4 || Math.abs(dy) > 4)) {
      dragMoved = true;
      setPanning(true);
    }

    scroller.scrollLeft = panOrigin.scrollLeft - dx;
    scroller.scrollTop = panOrigin.scrollTop - dy;
  };

  const onPointerUp = (e: PointerEvent) => {
    if (scroller?.hasPointerCapture(e.pointerId)) {
      scroller.releasePointerCapture(e.pointerId);
    }

    const wasClick = panOrigin !== null && !dragMoved;
    panOrigin = null;
    setPanning(false);

    if (wasClick) {
      handleClick(e.clientX, e.clientY);
    }
  };

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
        }}
        tabindex={-1}
        class="bg-muted/40 min-h-0 flex-1 cursor-grab overflow-auto p-3 outline-none"
        classList={{ "!cursor-grabbing select-none": panning() }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
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
              <div
                ref={(el) => {
                  pageEls[index] = el;
                }}
                class="w-full bg-white shadow-md ring-1 ring-black/10 [&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
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
