import { VsCheck, VsCopy } from "solid-icons/vs";
import { render } from "solid-js/web";

function toHtml(fn: () => JSX.Element): string {
  const div = document.createElement("div");
  const dispose = render(fn, div);
  console.log("[icons] childNodes:", div.childNodes.length, [...div.childNodes]);
  console.log("[icons] innerHTML:", JSON.stringify(div.innerHTML));
  const html = div.innerHTML;
  dispose();
  console.log("[icons] after dispose innerHTML:", JSON.stringify(html));
  return html;
}

export const copyIcon = toHtml(() => <VsCopy size={14} />);
export const checkIcon = toHtml(() => <VsCheck size={14} color="#3fb950" />);
