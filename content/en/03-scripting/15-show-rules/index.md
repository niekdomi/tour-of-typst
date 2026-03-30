# Show Rules

Set rules change parameters. Show rules change _how elements look entirely_. If set rules are like
adjusting the thermostat, show rules are like redecorating the whole room.

The simplest form applies a set rule to a specific element type:

```typst
#show heading: set text(blue)
```

All headings are now blue. But for full control, you can intercept the element and rebuild it:

```typst
#show heading.where(level: 1): it => [
  #set text(size: 18pt)
  #smallcaps(it.body)
  #v(0.5em)
]
```

More examples, because once you start, it's hard to stop:

```typst
// Make links blue and underlined
#show link: set text(fill: blue)

// Add a line under level-2 headings
#show heading.where(level: 2): it => {
  it
  line(length: 100%, stroke: 0.5pt)
}
```

## Your Task

Our paper is functional, but it doesn't _look_ like a reputable journal article yet. Dr. Crumb
insists that aesthetic perfection can distract reviewers from minor calculation errors. Add some
show rules:

- Make the title (level 1 heading) render in small caps using `#smallcaps()`
- Add a horizontal line under level-2 section headings
- Style the author name, try centering it or making it gray

> [!TIP] You can filter by heading level with `heading.where(level: 1)`. This way your title styling
> doesn't accidentally apply to every section.
