# Set Rules

So far we've used `#set` for page and text, but that's just the beginning. Set rules work on almost
every element in Typst. They let you change defaults globally, so you stop repeating yourself like a
nervous toast dropper on trial 47.

For example, instead of manually numbering headings, you can set it once:

```typst
#set heading(numbering: "1.1")
```

Now all headings get numbered automatically: 1, 1.1, 1.2, 2, etc. Other useful set rules:

```typst
#set par(leading: 0.8em)        // line spacing within paragraphs
#set par(spacing: 1.2em)        // spacing between paragraphs
#set block(spacing: 1.5em)      // spacing around blocks
#set text(hyphenate: true)       // enable hyphenation
```

## Your Task

Clean up the document by adding set rules at the top (after the page setup):

- `#set heading(numbering: "1.1")`, auto-number all sections
- `#set par(leading: 0.8em)`, tighten line spacing

Watch how every heading gets a number without touching a single heading line. That's the power of
set rules, change the behavior once, apply it everywhere.

> [!NOTE] Set rules only affect elements that come _after_ them. That's why they belong at the very
> top of your document.
