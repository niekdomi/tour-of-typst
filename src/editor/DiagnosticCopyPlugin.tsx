import { EditorView, ViewPlugin } from "@codemirror/view";
import { render } from "solid-js/web";

import { CopyButton } from "../components/CopyButton";

const diagnosticCopyPlugin = ViewPlugin.fromClass(
  class {
    private observer: MutationObserver;
    private disposers: (() => void)[] = [];

    constructor(view: EditorView) {
      this.observer = new MutationObserver(() => {
        const tooltips = view.dom.ownerDocument.querySelectorAll(".cm-tooltip-lint .cm-diagnostic");

        for (const diagnostic of tooltips) {
          if (diagnostic.querySelector("[data-diag-copy]")) {
            continue;
          }

          const text = diagnostic.textContent.trim();
          const anchor = document.createElement("span");

          anchor.dataset["diagCopy"] = "";
          diagnostic.append(anchor);
          this.disposers.push(render(() => <CopyButton code={text} />, anchor));
        }
      });

      this.observer.observe(view.dom.ownerDocument.body, {
        childList: true,
        subtree: true,
      });
    }

    destroy() {
      this.observer.disconnect();
      for (const disposer of this.disposers) {
        disposer();
      }
      this.disposers = [];
    }
  }
);

export default diagnosticCopyPlugin;
