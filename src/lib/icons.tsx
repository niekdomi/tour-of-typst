import { VsCheck, VsCopy } from "solid-icons/vs";
import { render } from "solid-js/web";

function toHtml(fn: () => JSX.Element): string {
  const div = document.createElement("div");
  const dispose = render(fn, div);
  const html = div.innerHTML;
  dispose();
  return html;
}

export const copyIcon = toHtml(() => <VsCopy size={14} />);
export const checkIcon = toHtml(() => <VsCheck size={14} color="#3fb950" />);
