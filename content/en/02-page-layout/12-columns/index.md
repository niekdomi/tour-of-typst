# Columns

If you've ever opened a physics journal, you've noticed the two-column layout. It's the universal
signal for "this is extremely complicated and serious research." Our toast drop data may be
questionable, but our layout doesn't have to be. We are going to fake the legitimacy we need.

```typst
#set page(columns: 2)
```

But there's a catch, the title and abstract should span the full page width, while only the body
uses two columns. You can achieve this by placing the column setting after the abstract:

```typst
= Title
Abstract text here...

#set page(columns: 2)

== Introduction
Body text flows in two columns from here on...
```

For more targeted control, you can wrap specific content in `#columns()`:

```typst
#columns(2)[
  Only this text is in two columns.
]
```

## Your Task

Make the body of the paper two-column while keeping the title and abstract full-width. Add
`#set page(columns: 2)` right after the abstract paragraph but before the Introduction.

> [!IMPORTANT] If the preview looks cramped, try reducing the margins slightly (e.g., `1.5cm`) to
> give the columns more breathing room. Academic papers are dense, but they shouldn't be
> claustrophobic.
