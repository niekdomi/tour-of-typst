# Labels

Our paper has a figure, a table, and some equations, but right now they're like researchers pointing
fingers at each other over missing data. The Results section says "see the table" without pointing
anywhere specific. Before we can create cross-references, we need to give each element a name tag.

Labels are added with `<angle-brackets>` right after an element:

```typst
#figure(
  table(...),
  caption: [Experimental results.],
) <tab-results>
```

```typst
$ omega = (g dot t) / r $ <eq-omega>
```

Labels are invisible, they don't show up in the output. They just quietly mark the element so you
can reference it later. You can label headings too:

```typst
== Methods <methods>
```

## Your Task

Go through the document and give name tags to the key elements:

- The figure: `<fig-rotation>`
- The results table: `<tab-results>`
- The angular velocity equation: `<eq-omega>`
- The Methods heading: `<methods>`

Nothing will change in the output yet, but in the next chapter, these labels will come to life.

> [!NOTE] Label names can contain letters, numbers, and hyphens. Choose descriptive names, you'll be
> typing them when creating references.
