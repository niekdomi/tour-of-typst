import { type Extension, RangeSetBuilder, StateField, type Text } from "@codemirror/state";
import { Decoration, type DecorationSet, EditorView } from "@codemirror/view";

/**
 * Compute the 1-based line numbers in `solution` that are new or changed
 * relative to `template`, via a longest-common-subsequence (LCS) line diff.
 * Lines that belong to the LCS are considered unchanged; everything else is
 * what the chapter's solution actually introduces.
 */
export function changedSolutionLines(template: string, solution: string): Set<number> {
  const a = template.split("\n");
  const b = solution.split("\n");
  const n = a.length;
  const m = b.length;

  // dp[i][j] = LCS length of a[i:] and b[j:].
  const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) {
    const row = dp[i]!;
    const nextRow = dp[i + 1]!;

    for (let j = m - 1; j >= 0; j--) {
      // oxlint-disable-next-line unicorn/prefer-ternary
      if (a[i] === b[j]) {
        row[j] = nextRow[j + 1]! + 1;
      } else {
        row[j] = Math.max(nextRow[j]!, row[j + 1]!);
      }
    }
  }

  // Walk the table to mark which solution lines participate in the LCS.
  const matched = new Set<number>();
  let i = 0;
  let j = 0;

  while (i < n && j < m) {
    if (a[i] === b[j]) {
      matched.add(j);
      i++;
      j++;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      i++;
    } else {
      j++;
    }
  }

  const changed = new Set<number>();
  for (let k = 0; k < m; k++) {
    if (!matched.has(k)) {
      changed.add(k + 1);
    }
  }
  return changed;
}

const dimmedLine = Decoration.line({ class: "cm-dimmed" });

function buildDecorations(doc: Text, changed: Set<number>): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();

  for (let n = 1; n <= doc.lines; n++) {
    if (!changed.has(n)) {
      builder.add(doc.line(n).from, doc.line(n).from, dimmedLine);
    }
  }

  return builder.finish();
}

/**
 * An editor extension that dims every line *not* in `changed`, so the
 * solution's new lines stand out. The decoration set is rebuilt on edits so it
 * degrades gracefully if the solution doc is modified.
 */
export function dimUnchangedLines(changed: Set<number>): Extension {
  return StateField.define<DecorationSet>({
    create(state) {
      return buildDecorations(state.doc, changed);
    },
    update(deco, tr) {
      return tr.docChanged ? buildDecorations(tr.state.doc, changed) : deco;
    },
    provide: (f) => EditorView.decorations.from(f),
  });
}
