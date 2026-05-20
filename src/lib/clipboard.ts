import { checkIcon, copyIcon } from "./icons";

const RESET_DELAY_MS = 1500;

/** Copy `text`, then flash a check icon on `button` before reverting to the copy icon. */
export async function copyToButton(button: HTMLElement, text: string) {
  await navigator.clipboard.writeText(text);
  button.innerHTML = checkIcon;
  setTimeout(() => {
    button.innerHTML = copyIcon;
  }, RESET_DELAY_MS);
}
