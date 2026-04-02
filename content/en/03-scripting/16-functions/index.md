# Functions

Dr. Crumb's paper needs editorial callout boxes, one for ethical disclaimers about toast treatment,
another for future research ideas. We _could_ copy-paste the same formatting each time, but that's
how academic papers end up looking like ransom notes.

Instead, define a function with `#let`:

```typst
#let note(body) = block(
  fill: luma(230),
  inset: 10pt,
  radius: 4pt,
  body,
)
```

Now you can use it anywhere:

```typst
#note[No toasts were harmed unnecessarily in this study.]
```

Functions can have multiple parameters, including optional ones with defaults:

```typst
#let note(title: "Note", body) = block(
  fill: luma(230),
  inset: 10pt,
  radius: 4pt,
)[
  *#title:* #body
]

#note[Default title.]
#note(title: "Warning")[Custom title.]
```

## Your Task

Create a `#let note(body)` function that renders a styled callout box. Then use it in two places:

- **Methods section**: A note about ethical toast treatment ("No toasts were harmed
  unnecessarily...")
- **Conclusion**: A note about future research directions (maybe testing different bread types?)

> [!NOTE] The `block()` function is great for creating boxes. Use `fill` for background color,
> `inset` for padding, and `radius` for rounded corners.
