import type { Highlighter } from "shiki";

import { createLessonHighlighter, shikiThemes } from "../content/render-lesson";

export { shikiThemes };

/** Shared highlighter singleton for the running app. */
export const highlighterReady: Promise<Highlighter> = createLessonHighlighter();
