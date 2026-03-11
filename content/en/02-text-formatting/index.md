# Text Formatting

Typst gives you fine-grained control over how text looks — from font weight and style to colour,
size, and spacing.

## Shorthand markup

The quickest way to format text is with inline markup:

| Syntax | Result |
|---|---|
| `*strong*` | **strong** (bold) |
| `_emphasis_` | *emphasis* (italic) |
| `#underline[...]` | underlined |
| `#strike[...]` | ~~strikethrough~~ |

## The `#text` function

For anything beyond the shorthands, use `#text(...)`:

```typst
#text(fill: blue)[Blue text]
#text(size: 18pt)[Large text]
#text(weight: "light", tracking: 2pt)[Spaced light text]
```

## Set rules

Instead of wrapping every piece of text in a function call, you can use a `#set` rule to apply
formatting to all subsequent content in scope:

```typst
#set text(font: "Libertinus Serif", size: 11pt)

Everything after this line uses Libertinus Serif at 11 pt.
```

Set rules cascade — a `#set` inside a block only affects that block:

```typst
#[
  #set text(fill: red)
  This is red.
]
Back to the default colour here.
```

## Try it

```typst
#set text(size: 11pt, font: "Libertinus Serif")

*Bold*, _italic_, and #underline[underlined].

#text(weight: "light", tracking: 2pt)[
  Spaced-out light text
]

#[
  #set text(fill: eastern)
  This block is teal.
]

Back to normal.
```

> **Tip:** `#set` rules are one of Typst's most powerful features. They let you define a consistent
> style once and have it apply throughout your document automatically.
