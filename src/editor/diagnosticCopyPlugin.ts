import { EditorView, ViewPlugin } from "@codemirror/view";
import copyIcon from "../assets/icons/copy.svg?raw";
import checkIcon from "../assets/icons/check.svg?raw";

/**
 * CodeMirror plugin that:
 * - Adds a copy button (reusing the same icon as lesson code blocks) to diagnostics
 * - Constrains the lint tooltip so it never extends past the editor's right edge
 */
const diagnosticCopyPlugin = ViewPlugin.fromClass(
  class {
    private observer: MutationObserver;
    private rafId = 0;

    constructor(view: EditorView) {
      this.observer = new MutationObserver(() => {
        // Defer to next frame so CodeMirror has finished positioning the tooltip
        cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => {
          this.constrainTooltip(view);
          this.addCopyButtons(view);
        });
      });
      this.observer.observe(view.dom.ownerDocument.body, {
        childList: true,
        subtree: true,
      });
    }

    destroy() {
      this.observer.disconnect();
      cancelAnimationFrame(this.rafId);
    }

    private constrainTooltip(view: EditorView) {
      const editorRight = view.dom.getBoundingClientRect().right;
      const tooltips = view.dom.ownerDocument.querySelectorAll<HTMLElement>(".cm-tooltip-lint");
      for (const tt of tooltips) {
        // Reset so we can measure the natural position
        tt.style.maxWidth = "";
        // Read the position after reset
        const ttLeft = tt.getBoundingClientRect().left;
        const maxW = editorRight - ttLeft;
        if (maxW > 0) {
          tt.style.maxWidth = `${String(maxW)}px`;
          tt.style.boxSizing = "border-box";
          tt.style.overflowWrap = "break-word";
          tt.style.wordBreak = "break-word";
        }
      }
    }

    private addCopyButtons(view: EditorView) {
      const tooltips = view.dom.ownerDocument.querySelectorAll(".cm-tooltip-lint .cm-diagnostic");
      for (const diag of tooltips) {
        if (diag.querySelector(".diag-copy-btn")) continue;
        const btn = document.createElement("button");
        btn.className = "diag-copy-btn";
        btn.innerHTML = copyIcon;
        btn.title = "Copy error message";
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const text = diag.textContent.replace(/Copy$/, "").trim();
          void navigator.clipboard.writeText(text).then(() => {
            btn.innerHTML = checkIcon;
            setTimeout(() => (btn.innerHTML = copyIcon), 1500);
          });
        });
        diag.appendChild(btn);
      }
    }
  }
);

export default diagnosticCopyPlugin;
