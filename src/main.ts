import { mount } from "svelte";
import App from "./App.svelte";
import "./styles/global.css";

mount(App, { target: document.getElementById("app")! });

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Enter") {
    event.preventDefault();
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement.tagName === "BUTTON") {
      activeElement.click();
    }
  }
}
