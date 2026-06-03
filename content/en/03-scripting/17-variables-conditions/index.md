# Variables & Conditions

Dr. Crumb's paper is almost ready for submission, but the lab director wants to review it first. We
need a way to stamp "DRAFT" across all pages without manually adding and removing it every time.

We have to define the following variables and can then check with the `if` expression wheter `draft`
is set to true or not.

```typst
#let author = "Dr. Eleanor Crumb"
#let institution = "Institute of Breakfast Studies"
#let draft = true

#set page(background: if draft {
  rotate(-45deg, text(80pt, fill: luma(180, 30%))[*DRAFT*])
})
```

When `draft` is `true` it produces the rotated text, and with no `else` branch, it produces `none`
when `draft` is `false`, no background at all. Because it lives on the `background` parameter, the
watermark repeats on _every_ page.

> [!WARNING] You can't write `#if draft { set page(...) }`. A `set` rule inside the block is scoped
> to that block and never reaches the document. Set the `background` parameter to the `if`
> expression instead.

Variables can hold any type, strings, numbers, booleans, arrays:

```typst
#let version = 3
#let keywords = ("toast", "gravity", "butter", "aerodynamics")
```

Use them in text with the `#` prefix:

```typst
Written by #author (#institution).
```

## Your Task

Add variables at the top of the document for:

- `author`, `"Dr. Eleanor Crumb"`
- `institution`, `"Institute of Breakfast Studies"`
- `date`, `"March 2026"`
- `draft`, `true`

Set the page `background` to a diagonal "DRAFT" watermark that only appears when `draft` is `true`,
using `if` as the background value (see the example above). Replace the hardcoded author name with
`#author`.
