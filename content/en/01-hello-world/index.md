# Hello, World!

Every journey starts with a single step — or in our case, a single line of markup.

The simplest Typst document is just plain text. Unlike LaTeX, you don't need a preamble or any
boilerplate to get started. Just start writing.

## Markup basics

Typst uses a small set of special characters for the most common formatting needs:

| Syntax | Result |
|---|---|
| `*bold*` | **bold** |
| `_italic_` | *italic* |
| `= Heading` | top-level heading |
| `== Subheading` | second-level heading |

Anything that isn't recognised as markup is treated as plain text, so you can write naturally
without worrying about accidentally triggering formatting.

## Calling functions

Typst uses `#` to call built-in functions. This is how you access the full power of the system
without leaving your document:

```typst
#text(fill: rgb("#e63946"))[This text is red.]
#underline[This text is underlined.]
```

Functions take arguments in parentheses and content in square brackets. You will see this pattern
everywhere in Typst.

## Try it

```typst
= Hello, World!

This is my first Typst document.

I can write *bold*, _italic_, or even
#text(fill: rgb("#e63946"))[red] text.
```

> **Tip:** The `=` sign creates a heading. More `=` signs create deeper heading levels: `==`, `===`,
> and so on.
