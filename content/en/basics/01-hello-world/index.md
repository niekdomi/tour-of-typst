# Hello, World!

Let's write your first Typst document. Unlike LaTeX, there's no boilerplate — you just start writing:

```typst
Hello, world!
```

That's it. Typst produces a document with that text on the page.

## Paragraphs

A blank line separates paragraphs. Single line breaks within a block of text are treated as spaces:

```typst
This is the first paragraph.
This line is still part of it.

This is a new paragraph, separated by a blank line.
```

If you need a forced line break without starting a new paragraph, use `\`:

```typst
Line one \
Line two, still the same paragraph.
```

## Comments

Comments start with `//` and are ignored by the compiler. They're useful for leaving notes to yourself:

```typst
// This won't appear in the output.
Hello, world! // Neither will this.
```

For multi-line comments, use `/* ... */`:

```typst
/* This whole
   block is a comment */
Hello again!
```

## Escaping special characters

Some characters have special meaning in Typst (`*`, `_`, `=`, etc.). To use them literally, prefix them with a backslash:

```typst
I want to write \*this\* without making it bold.
```

## Try it

Type the following in the editor and see the result:

```typst
Hello, world!

My name is Alice. I am learning Typst.

This is a second paragraph — notice the blank line above.
```
