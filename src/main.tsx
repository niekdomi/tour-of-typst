import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";

import App from "./App";

import "./styles.css";

render(
  () => (
    <Router>
      <Route path="*" component={App} />
    </Router>
  ),
  document.querySelector("#app")!
);
