import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import App from "./App";

import "./styles.css";

// Strip the trailing slash from Vite's base ("/tour-of-typst/" -> "/tour-of-typst", "/" -> "") so the router treats it as a path prefix.
const base = import.meta.env.BASE_URL.replace(/\/+$/, "");

const root = document.querySelector("#app")!;
// Clear any prerendered markup so the client render() starts from a clean slate
// instead of appending a second copy next to the static snapshot.
root.textContent = "";

render(
  () => (
    <Router base={base}>
      <Route path="/:chapter?" component={App} />
    </Router>
  ),
  root
);
