# Welcome to the Tour of Typst

Welcome to the **Tour of Typst**! This interactive guide will walk you through everything you need
to know to create beautiful documents with Typst — from basic text formatting all the way to
scripting, layouts, and bibliographies.

Typst is a new markup-based typesetting system designed to be as powerful as LaTeX while being much
easier to learn and use. Whether you want to write a scientific paper, a book, or a simple letter,
Typst has you covered.

## How this tour works

Each chapter introduces a new concept. On the right side you will find an editor where you can try
things out, and a live preview that updates as you type.

- Read the explanation on the left
- Experiment with the code on the right
- Move to the next chapter when you feel ready

## Your first document

A Typst document is just plain text with markup. There is no preamble, no boilerplate — just start
writing.

```typst
// Your first Typst document
#set text(font: "New Computer Modern")

= Welcome to Typst

This is a *bold* statement and this is _italic_.

You can also write #text(fill: blue)[coloured text].
```

> **Tip:** You can edit the code on the right at any time. Changes are reflected instantly in the
> preview.
