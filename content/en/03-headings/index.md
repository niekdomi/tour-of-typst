# Headings & Structure

Headings give your document structure and automatically generate an outline. Typst supports up to
six levels of headings, all created with `=` signs.

## Creating headings

The number of `=` signs determines the heading level:

```typst
= Level 1 Heading
== Level 2 Heading
=== Level 3 Heading
==== Level 4 Heading
```

This maps directly to the document hierarchy — use level 1 for chapters, level 2 for sections,
level 3 for subsections, and so on.

## Numbering

You can add automatic numbering to all headings with a `#set` rule:

```typst
#set heading(numbering: "1.1")

= Introduction
== Background
== Motivation
= Methods
```

Typst supports many numbering patterns: `"1."`, `"1.1"`, `"I.A"`, `"a)"` — any combination of
digits, letters, and Roman numerals.

## Customising appearance

Use a `#show` rule to change how every heading looks:

```typst
#show heading.where(level: 1): it => [
  #set text(fill: eastern)
  #block(it.body)
]
```

## Outline

The `#outline()` function generates a table of contents from your headings automatically:

```typst
#outline()
```

You can limit the depth with `#outline(depth: 2)` to only show the top two heading levels.

## Try it

```typst
#set heading(numbering: "1.1")

#outline()

= Chapter One

== Section 1.1

Some content here.

== Section 1.2

=== Subsection 1.2.1

Even deeper structure.
```

> **Tip:** You can exclude a specific heading from the outline by setting `outlined: false` on it:
> `#heading(outlined: false)[Appendix]`.
