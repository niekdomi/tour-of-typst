# Headings & Structure

Headings divide your document into sections. In Typst, you create them with `=` signs — one for each
level:

```typst
= Top-level heading

== Second level

=== Third level

==== Fourth level
```

The number of `=` signs determines the heading level, equivalent to `<h1>` through `<h4>` in HTML or
`\section` through `\subsubsubsection` in LaTeX.

## Heading levels in practice

Most documents only use two or three levels. A typical report might look like:

```typst
= Introduction

Some introductory text.

== Background

Context and prior work.

== Motivation

Why this matters.

= Methodology

== Experiment Setup

=== Hardware

=== Software
```

## Automatic numbering

You can add automatic numbering to all headings with a single set rule:

```typst
#set heading(numbering: "1.")

= Introduction
== Background
== Motivation
= Methodology
```

This produces: _1. Introduction_, _1.1 Background_, _1.2 Motivation_, _2. Methodology_.

You can change the numbering style:

```typst
#set heading(numbering: "1.1")   // 1.1, 1.1.1 ...
#set heading(numbering: "A.")    // A., A.1 ...
#set heading(numbering: "I.")    // I., I.I ...
```

## Outline (table of contents)

Adding a table of contents is one line:

```typst
#outline()
```

Typst automatically collects all headings and generates the outline. You can place it anywhere in
the document — typically after the title, before the first section.

## Try it

```typst
#set heading(numbering: "1.")

#outline()

= The Basics
== Getting Started
== Core Concepts

= Advanced Topics
== Scripting
== Templates
```
