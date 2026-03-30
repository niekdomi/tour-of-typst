# Fonts

Our paper uses the default font, which is perfectly fine but Dr. Crumb wants that classic academic
look. In Typst, switching fonts is a single set rule:

```typst
#set text(font: "New Computer Modern")
```

Typst ships with a set of bundled fonts that work everywhere. You can also use any font installed on
your system. To see what's available:

```typst
// Try these and see how the paper changes:
#set text(font: "New Computer Modern")   // classic LaTeX look
#set text(font: "Libertinus Serif")      // elegant alternative
#set text(font: "IBM Plex Serif")        // modern serif
```

### Different Fonts for Different Elements

You can mix fonts for example, use a sans-serif for headings and a serif for body text:

```typst
#set text(font: "New Computer Modern", size: 11pt)
#show heading: set text(font: "IBM Plex Sans")
```

### Fallback Fonts

If a font is missing a character (say, a math symbol or emoji), Typst can try the next font in a
list:

```typst
#set text(font: ("New Computer Modern", "DejaVu Sans"))
```

## Your Task

Style the paper's typography:

- Set the body font to `"New Computer Modern"` at `11pt`
- Set headings to use a different font (try `"IBM Plex Sans"` or another sans-serif)
- Experiment; swap fonts and watch the entire paper transform instantly

> [!TIP] Not sure which fonts are available? Typst's bundled fonts work on every platform. System
> fonts depend on what's installed on your machine. They'll work locally but may not render the same
> for someone else.
