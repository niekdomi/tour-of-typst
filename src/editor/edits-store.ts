import { composeKey } from "../content";

const STORAGE_KEY = "tour-of-typst-edits";

function load(): Map<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return new Map(JSON.parse(raw) as [string, string][]);
    }
  } catch {
    // corrupt data, start fresh
  }
  return new Map();
}

function save(map: Map<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...map.entries()]));
  } catch {
    // storage full or unavailable
  }
}

const edits = load();

export function getEdit(loc: string, k: string): string | undefined {
  return edits.get(composeKey(loc, k));
}

export function setEdit(loc: string, k: string, content: string) {
  edits.set(composeKey(loc, k), content);
  save(edits);
}

export function clearAllEdits() {
  edits.clear();
  localStorage.removeItem(STORAGE_KEY);
}
