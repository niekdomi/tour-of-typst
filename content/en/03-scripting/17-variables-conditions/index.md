# Variables & Conditions

Dr. Crumb's paper is almost ready for submission, but the lab director wants to review it first. We
need a way to stamp "DRAFT" across the top without manually adding and removing it every time. Enter
variables and conditions.

```typst
#let author = "Dr. Eleanor Crumb"
#let institution = "Institute of Breakfast Studies"
#let draft = true

#if draft {
  align(center, text(red, size: 20pt)[*DRAFT*])
}
```

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

Use `#if draft` to show a red "DRAFT" watermark at the top. Replace the hardcoded author name with
`#author`. Then toggle `draft` to `false` and watch the watermark vanish, ready for submission.
