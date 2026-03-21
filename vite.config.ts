import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [svelte(), wasm()],
  build: {
    target: "esnext",
  },
});
