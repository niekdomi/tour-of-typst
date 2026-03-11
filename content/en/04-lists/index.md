# Lists

Ordered and unordered lists are first-class citizens in Typst. They are easy to write with
lightweight markup and fully customisable when you need more control.

## Unordered lists

Start a line with `-` to create a bullet list:

```typst
- Apples
- Bananas
- Cherries
```

## Ordered lists

Start a line with `+` for a numbered list:

```typst
+ First step
+ Second step
+ Third step
```

## Nesting

Indent items by two spaces to create nested lists. You can mix ordered and unordered levels freely:

```typst
- Fruits
  - Apples
  - Bananas
    - Cavendish
    - Plantain
- Vegetables

+ Boil water
+ Add pasta
  + Stir occasionally
  + Cook for 8–10 minutes
+ Drain and serve
```

## Term lists

For definition-style lists, use the `/ term: description` syntax:

```typst
/ Typst: A modern typesetting system.
/ LaTeX: A classic typesetting system based on TeX.
/ Markdown: A lightweight markup language for plain text.
```

## Customising lists

The `#list`, `#enum`, and `#terms` functions give you full control over markers, spacing, and
indentation:

```typst
#list(
  marker: [→],
  indent: 1em,
  [First item],
  [Second item],
  [Third item],
)
```

## Try it

```typst
- Apples
- Bananas
  - Cavendish
  - Plantain
- Cherries

+ First step
+ Second step
  + Sub-step A
  + Sub-step B
+ Third step

/ Typst: Modern and fast.
/ LaTeX: Powerful and classic.
```

> **Tip:** You can change the bullet marker for the entire document with
> `#set list(marker: [•])`.
