# Headings & Structure

No self-respecting paper is just one long wall of text. We need sections, a proper skeleton to hang
our research on. In Typst, headings are created with the `=` sign. More `=` signs mean deeper
nesting:

```typst
= Top-Level Heading
== Second Level
=== Third Level
```

You can also leave yourself notes that won't show up in the final document:

```typst
// This line is invisible to the reader
```

```typst
/*
  Multi-line comments work too.
  Great for hiding your existential doubts about breakfast science.
*/
```

## Your Task

Give the paper a proper academic structure. Add section headings for **Introduction**, **Methods**,
**Results**, and **Conclusion**. Write the Introduction and leave the rest as TODO comments, we'll
fill those in over the next few chapters.

```typst
== Introduction
Toast, when dropped from a standard table height of approximately 0.75 m,
rotates predictably during its fall...

== Methods

// TODO: describe experimental setup

== Results

// TODO: present findings

== Conclusion

// TODO: summarize
```

> [!NOTE] The title uses `=` (level 1), so sections use `==` (level 2). Typst tracks the hierarchy
> for numbering and the table of contents. In real academic papers, the title is usually styled
> separately rather than as a heading. We'll get to that in the Templates chapter.
