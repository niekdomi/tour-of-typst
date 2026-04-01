# Fonts

Our paper uses the default font (Libertinus Serif), which is perfectly fine but Dr. Crumb wants that
classic academic look. In Typst, switching fonts is a single set rule:

```typst
#set text(font: "New Computer Modern")
```

### Bundled Fonts

The Typst CLI ships with four embedded fonts that work everywhere, no installation needed:

| Font                       | Type            | Typical use                    |
| -------------------------- | --------------- | ------------------------------ |
| `Libertinus Serif`         | Serif (default) | Body text                      |
| `New Computer Modern`      | Serif           | Classic academic papers        |
| `New Computer Modern Math` | Math            | Equations (used automatically) |
| `DejaVu Sans Mono`         | Monospace       | Code blocks                    |

This tour only supports these bundled fonts. When working locally, Typst can also use fonts
installed on your system. More on that in the **Local Setup** chapter.

### Different Fonts for Different Elements

You can use different fonts for different parts of your document. For example, keep body text in a
serif font but switch code blocks to monospace:

```typst
#set text(font: "New Computer Modern", size: 11pt)
#show raw: set text(font: "DejaVu Sans Mono")
```

If you have a sans-serif font installed on your system, you could also use it for headings:

```typst
#show heading: set text(font: "Arial")
```

### Fallback Fonts

If a font is missing certain characters, Typst tries the next font in a list:

```typst
#set text(font: ("New Computer Modern", "DejaVu Sans Mono"))
```

## Your Task

Style the paper's typography:

- Set the body font to `"New Computer Modern"` at `11pt`
- Try switching to `"Libertinus Serif"` and compare the two
- Experiment with the font size — try `10pt` or `12pt` and see how the layout reflows

> [!NOTE] The bundled fonts are guaranteed to work everywhere. System fonts work locally but may not
> be available when someone else compiles your document or when using the web app. For maximum
> portability, stick to the bundled fonts or include font files in your project.
