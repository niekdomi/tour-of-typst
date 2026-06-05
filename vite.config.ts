import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin, type PluginOption, type ResolvedConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import wasm from "vite-plugin-wasm";

import { createLessonHighlighter, renderLessonHtml } from "./src/content/render-lesson";

const DEFAULT_LOCALE = "en";
const CHAPTER_DIR_PREFIX = /^\d+-/;

interface ChapterPage {
  key: string;
  index: number;
  lessonContent: string;
  title: string;
}

/**
 * Discover chapters from the default-locale content tree, ordered by their numeric directory prefix.
 */
function discoverChapters(root: string): ChapterPage[] {
  const localeDir = join(root, "content", DEFAULT_LOCALE);
  const pages: ChapterPage[] = [];

  for (const part of readdirSync(localeDir, { withFileTypes: true })) {
    if (!part.isDirectory()) {
      continue;
    }

    for (const dir of readdirSync(join(localeDir, part.name), { withFileTypes: true })) {
      if (!dir.isDirectory()) {
        continue;
      }

      const markdown = readFileSync(join(localeDir, part.name, dir.name, "index.md"), "utf8");
      const heading = /^#\s+(.+)$/m.exec(markdown)?.[1]?.trim();
      const key = dir.name.replace(CHAPTER_DIR_PREFIX, "");

      pages.push({
        key,
        index: Number.parseInt(dir.name, 10),
        lessonContent: markdown,
        title: heading ?? key,
      });
    }
  }

  return pages.toSorted((a, b) => a.index - b.index);
}

function escapeHtml(value: string): string {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/**
 * Emit a static HTML page per chapter at build time. Renders the lesson
 * markdown to HTML  and injects it into the built app shell so every
 * /<chapter> route is crawlable and paints prose before the SPA boots. Also
 * writes a 404.html copy of the shell as the GitHub Pages SPA fallback.
 */
function prerenderLessons(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "prerender-lessons",
    apply: "build",
    configResolved(resolved) {
      config = resolved;
    },
    async closeBundle() {
      const outDir = join(config.root, config.build.outDir);
      const shell = readFileSync(join(outDir, "index.html"), "utf8");
      const highlighter = await createLessonHighlighter();
      const chapters = discoverChapters(config.root);

      for (const page of chapters) {
        const label = page.key === "welcome" ? "" : `Chapter ${String(page.index)}`;
        const prose = renderLessonHtml(page.lessonContent, highlighter);
        const article = `<article class="lesson"><div class="lesson-chapter-label">${label}</div>${prose}</article>`;
        const html = shell
          .replace(
            "<title>Tour of Typst</title>",
            `<title>${escapeHtml(page.title)} · Tour of Typst</title>`
          )
          .replace('<div id="app"></div>', `<div id="app">${article}</div>`);

        mkdirSync(join(outDir, page.key), { recursive: true });
        writeFileSync(join(outDir, page.key, "index.html"), html, "utf8");
      }

      // SPA fallback: GitHub Pages serves 404.html for any unmatched path.
      writeFileSync(join(outDir, "404.html"), shell, "utf8");
      config.logger.info(`prerendered ${String(chapters.length)} chapters + 404.html`);
    },
  };
}

export default defineConfig({
  base: process.env["VITE_BASE_URL"] ?? "/",
  plugins: [tailwindcss(), solidPlugin(), wasm(), prerenderLessons()],
  worker: {
    plugins: (): PluginOption[] => [wasm() as PluginOption],
    format: "es",
  },
  build: {
    target: "esnext",
  },
});
