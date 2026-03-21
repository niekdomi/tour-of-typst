# Text Formatting

Typst gives you several ways to emphasize and style inline text.

## Emphasis and strong

Wrap text in `_underscores_` to _emphasize_ it (rendered as italic), and in `*asterisks*` to make it
**strong** (rendered as bold):

```typst
This is _emphasized_ text.
This is *strong* text.
You can _combine *both* together_.
```

> [!NOTE] Unlike Markdown, doubling the characters (`**bold**`) does not work in Typst. Use a single
> `*` for strong and a single `_` for emphasis.

## Inline code

Surround text with backticks to render it as inline code:

```typst
The function `print()` outputs text to the console.
```

## Superscript and subscript

Use `#super[]` and `#sub[]` for superscripts and subscripts:

```typst
H#sub[2]O is water.
E = mc#super[2]
```

## Underline and strikethrough

These aren't available as shorthand syntax, but you can use the corresponding functions:

```typst
#underline[This text is underlined.]
#strike[This text is crossed out.]
```

## Changing text appearance

The `#text()` function lets you adjust color, size, font, and more inline:

```typst
This is #text(fill: red)[red text].
This is #text(size: 1.5em)[larger text].
This is #text(font: "Georgia")[a different font].
```

## Combining styles

All of these can be freely combined:

```typst
*#underline[Important:]* do _not_ run this as #text(fill: red)[root].
```

## Try it

```typst
= My Formatted Document

Typst makes it easy to write *bold*, _italic_, and `monospaced` text.

You can also #underline[underline] or #strike[strike through] words.

Water is H#sub[2]O. Einstein's famous equation is E = mc#super[2].
```
