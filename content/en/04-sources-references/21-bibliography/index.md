# Bibliography

No academic paper is complete without standing on the shoulders of giants, or at least citing them
so they don't block your publication. Dr. Crumb's work builds on decades of controversial toast-drop
research, and we need to show the committee we've done our homework. Typst uses standard `.bib`
files for bibliography management.

First, tell Typst where to find the bibliography:

```typst
#bibliography("refs.bib")
```

Then cite sources in your text with `@`:

```typst
Previous work by @murphy2003 demonstrated the butter-side-down phenomenon.
The physical model follows @matthews1995.
```

> [!IMPORTANT] In this tour, the bibliography file is already provided for you. In your own
> projects, you create a `.bib` file alongside your `.typ` file.

A `.bib` entry looks like this:

```
@article{murphy2003,
  author = {Robert Murphy},
  title = {Tumbling Toast, Murphy's Law and the Fundamental Constants},
  journal = {Journal of Applied Butter Studies},
  year = {2003},
}
```

## Your Task

- Add `#bibliography("refs.bib")` at the very end of the document
- Cite `@murphy2003` in the Introduction where we discuss the phenomenon
- Cite `@matthews1995` in the Methods section where we describe the physical model

The bibliography section appears automatically with all cited works. Our toast paper is now properly
academic.

> [!NOTE] Typst supports multiple citation styles. Change it with `#set bibliography(style: "ieee")`
> or try `"apa"`, `"chicago-author-date"`, and others.
