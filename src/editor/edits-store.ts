import { composeKey } from "../content";

const STORAGE_KEY = "tour-of-typst-edits";

/**
 * Hydrate the edits map from localStorage, returning an empty map on missing or corrupt data.
 */
function load(): Map<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return new Map(JSON.parse(raw) as [string, string][]);
    }
  } catch {
    // Fall through and return an empty map
  }
  return new Map();
}

/**
 * Persist the edits map to localStorage, silently ignoring write failures.
 */
function save(map: Map<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...map.entries()]));
  } catch {
    // storage full or unavailable
  }
}

const edits = load();

/**
 * Return the user's saved edit for a chapter, or `undefined` if untouched.
 */
export function getEdit(locale: string, chapterKey: string): string | undefined {
  return edits.get(composeKey(locale, chapterKey));
}

/**
 * Save a user edit for a chapter and persist to localStorage.
 */
export function setEdit(locale: string, chapterKey: string, content: string) {
  edits.set(composeKey(locale, chapterKey), content);
  save(edits);
}

/**
 * Clear all edits and persist to localStorage.
 */
export function clearAllEdits() {
  edits.clear();
  localStorage.removeItem(STORAGE_KEY);
}
