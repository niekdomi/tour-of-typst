# Table of Contents

Our paper now has numbered headings, columns, headers, and footers. It looks like a proper journal
article. But any paper longer than a few pages needs a table of contents so readers can jump
straight to the Results (or, let's be honest, skip to the Conclusion).

In Typst, a table of contents is generated with a single function:

```typst
#outline()
```

That's it. Typst reads all your headings and builds a clickable, page-numbered list automatically.
If you add, remove, or rename a section, the outline updates on its own.

### Customization

You can control indentation and depth:

```typst
#outline(indent: auto)           // indent sub-sections
#outline(depth: 2)               // only show level 1 and 2 headings
#outline(indent: auto, depth: 2) // both
```

You can also give it a custom title:

```typst
#outline(title: "Contents")
```

## Your Task

Add `#outline()` right after the title and author, before the abstract. Use `indent: auto` so the
sub-sections are visually nested.

> [!NOTE] The outline function is called `outline` in Typst, not "table of contents" but it does
> exactly what you'd expect a TOC to do.
