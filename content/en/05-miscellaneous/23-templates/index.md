# Templates

Scroll to the top of our document. See all those set rules, show rules, variables, and functions
piled up before the actual content? It looks like our lab bench after a 48-hour testing sprint,
necessary, but a total mess. Templates let you tuck all of that into a separate, clean file.

A template is just a function that wraps content with styling:

```typst
// template.typ
#let paper(title: "", author: "", body) = {
  set page(paper: "a4", margin: 2cm)
  set text(font: "New Computer Modern", size: 11pt)
  set heading(numbering: "1.1")
  set par(justify: true)

  align(center)[
    #text(size: 18pt)[*#title*]
    #v(1em)
    #author
    #v(2em)
  ]

  body
}
```

Then in your main file, apply it with a show rule:

```typst
#import "template.typ": paper

#show: paper.with(
  title: "The Aerodynamics of Toast",
  author: "Dr. Eleanor Crumb",
)

// Now just write content, all styling comes from the template
The phenomenon of toast landing butter-side down...
```

The `#show: function` pattern applies the function to the entire document body. Your main file
becomes pure content, clean, readable, and free of formatting clutter.

## Your Task

Extract all the styling from the top of the document into a `paper()` template function. Then apply
it with `#show: paper.with(...)`.

Your content should be clean, just headings, text, figures, and tables, with no set/show rules mixed
in.

> [!TIP] This is exactly how real Typst projects are structured. Conference and journal templates
> follow this same pattern.

Congratulations, you've built a complete academic paper from scratch. It has equations, figures,
tables, citations, a custom template, and a butter-side-down rate of 61.3%. Dr. Crumb would be
proud.
