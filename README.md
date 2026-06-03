# Tour of Typst

An interactive, in-browser tour of the [Typst](https://typst.app) typesetting language. Each chapter
pairs a short explanation with a live editor and preview, so you can learn Typst by writing it.

## Adding a new language

Content is discovered automatically from the `content/` directory, so adding a language is mostly a
matter of adding files:

1. **Copy a content directory.** Duplicate `content/en` to `content/<locale>` (e.g. `content/fr`)
   and translate the chapter files. Each chapter folder holds an `index.md` and optionally a
   `template.typ`, `solution.typ`, and `refs.yaml`. Translate only the file _contents_ — the file
   and folder names must stay unchanged.

2. **Update `tour.ts`.** In `content/<locale>/tour.ts`, set `meta.locale` to the new locale code and
   `meta.label` to its display name, then translate the part and chapter titles. Keep the chapter
   `key` values unchanged; they must match the folder names.

3. **Add UI strings.** Add an entry for the new locale to the `translations` object in
   `content/i18n.ts`.
