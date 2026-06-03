import { FaSolidCheck, FaSolidCopy } from "solid-icons/fa";
import { createSignal } from "solid-js";

const RESET_DELAY_MS = 1500;

export function CopyButton(props: { code: string }) {
  const [copied, setCopied] = createSignal(false);

  async function copy() {
    await navigator.clipboard.writeText(props.code);
    setCopied(true);
    setTimeout(() => setCopied(false), RESET_DELAY_MS);
  }

  return (
    <button type="button" class="copy-btn" title="Copy" onClick={() => void copy()}>
      {copied() ? <FaSolidCheck size={14} color="green" /> : <FaSolidCopy size={14} />}
    </button>
  );
}
