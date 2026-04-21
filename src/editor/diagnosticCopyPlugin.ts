import { EditorView, ViewPlugin } from "@codemirror/view";
import copyIcon from "../assets/icons/copy.svg?raw";
import checkIcon from "../assets/icons/check.svg?raw";

const diagnosticCopyPlugin = ViewPlugin.fromClass(
  class {
    private observer: MutationObserver;

    constructor(view: EditorView) {
      this.observer = new MutationObserver(() => {
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
      });
      this.observer.observe(view.dom.ownerDocument.body, {
        childList: true,
        subtree: true,
      });
    }

    destroy() {
      this.observer.disconnect();
    }
  }
);

export default diagnosticCopyPlugin;
