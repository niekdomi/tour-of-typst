# Packages & Imports

Remember the `#let note()` function we built by hand to handle our ethical disclaimers? Turns out,
someone in the Typst community already made a much nicer version, with colors, titles, and drop
shadows. That's the beauty of packages: you don't have to reinvent every wheel (or in our case,
every buttered callout box).

Typst has a growing ecosystem of community packages. You can import them directly, no installation,
no package manager, no `node_modules` folder the size of a small country:

```typst
#import "@preview/cetz:0.4.2": canvas, draw
```

Some popular packages:

| Package    | Purpose                         |
| ---------- | ------------------------------- |
| `cetz`     | Drawing and charts              |
| `tablex`   | Advanced tables                 |
| `codelst`  | Code listings with line numbers |
| `showybox` | Colorful callout boxes          |

You can also import from your own files:

```typst
#import "utils.typ": note, warning
```

## Your Task

Import the `showybox` package and use it to upgrade our plain `note()` boxes:

```typst
#import "@preview/showybox:2.0.4": showybox

#showybox(
  title: "Note",
  [No toasts were harmed unnecessarily in this study.]
)
```

> [!WARNING] Package versions are pinned (e.g., `0.4.2`). This ensures your document always compiles
> the same way, even if the package gets updated later. Reproducibility matters, in science _and_ in
> typesetting.
