import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type PluginOption } from "vite";
import solidPlugin from "vite-plugin-solid";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  base: process.env.VITE_BASE_URL ?? "/",
  plugins: [tailwindcss(), solidPlugin(), wasm()],
  worker: {
    plugins: (): PluginOption[] => [wasm() as PluginOption],
    format: "es",
  },
  resolve: {
    dedupe: ["@codemirror/state", "@codemirror/view", "@codemirror/lint"],
  },
  build: {
    target: "esnext",
  },
});
