# Bibliography

No academic paper is complete without standing on the shoulders of giants, or at least citing them
so they don't block your publication. Dr. Crumb's work builds on decades of controversial toast-drop
research, and we need to show the committee we've done our homework. Typst supports BibLaTex
(`.bib`) files or their own
[Hayagriva](https://github.com/typst/hayagriva/blob/main/docs/file-format.md) (`.yaml` or `.yml`)
files as its native bibliography format. We'll use Hayagriva for this tour, but the process is
similar for BibLaTex.

First, tell Typst where to find the bibliography:

```typst
#bibliography("refs.yaml")
```

Then cite sources in your text with `@`:

```typst
Previous work by @murphy2003 demonstrated the butter-side-down phenomenon.
The physical model follows @matthews1995.
```

> [!IMPORTANT] In this tour, the bibliography file is already provided for you. In your own
> projects, you create a `.yaml` file alongside your `.typ` file.

A Hayagriva entry looks like this:

```yaml
murphy2003:
  type: Article
  author: Murphy, Robert
  title: Tumbling Toast, Murphy's Law and the Fundamental Constants
  date: 2003
```

## Your Task

- Add `#bibliography("refs.yaml")` at the very end of the document
- Cite `@murphy2003` in the Introduction where we discuss the phenomenon
- Cite `@matthews1995` in the Methods section where we describe the physical model

The bibliography section appears automatically with all cited works. Our toast paper is now properly
academic.

> [!NOTE] Typst supports multiple citation styles. Change it with `#set bibliography(style: "ieee")`
> or try `"apa"`, `"chicago-author-date"`, and others.
