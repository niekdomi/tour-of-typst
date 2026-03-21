# Welcome to the Tour of Typst

Typst is a modern markup-based typesetting system — think of it as a fresh take on document creation that combines the power of LaTeX with the approachability of Markdown.

You write plain text, sprinkle in some markup, and Typst compiles it into a beautifully typeset PDF.

## Why Typst?

If you've used LaTeX before, you know it can be frustrating: cryptic error messages, verbose syntax, and a steep learning curve. Typst was built to solve these problems:

- **Fast compilation** — results appear in milliseconds, not seconds
- **Clear error messages** — Typst tells you exactly what went wrong and where
- **Simple syntax** — common tasks need only a few characters
- **Scripting built-in** — a real programming language, not a macro system

If you're coming from Markdown, Typst gives you everything you're used to, plus structured layouts, mathematical formulas, bibliographies, and full control over the output.

## What this tour covers

This tour walks you through Typst from the ground up:

- **Basics** — text, headings, and lists
- **Content Elements** — math, code blocks, images, and tables
- **Page & Layout** — controlling page size, margins, headers, and columns
- **Scripting** — set rules, show rules, functions, and variables
- **Sources & References** — labels, cross-references, and bibliographies
- **Miscellaneous** — packages and reusable templates

Each chapter introduces a concept and shows you the syntax. The editor on the right is a live Typst playground — try out the examples as you go.

## How Typst documents work

A Typst document is a plain text file with the `.typ` extension. Most of what you write is *content mode* — text that ends up in the document:

```typst
Hello, world!

This is a new paragraph.
```

When you need to invoke Typst's features, you switch to *markup mode* with special characters (`=`, `-`, `*`, `_`), or to *code mode* with the `#` prefix:

```typst
= My Document

This is *bold* and _italic_ text.

#set text(size: 14pt)
```

You'll learn all of these step by step. Let's start with your first document.
