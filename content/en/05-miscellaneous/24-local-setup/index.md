# Local Setup

You've completed the entire tour in the browser. For real projects though, you'll want Typst running
on your own machine. Here's how to get started.

### Install Typst

Typst is a single binary with no dependencies. On Linux, it's likely available in your
distribution's package manager. For all platforms, check the official download page:

[Download Typst](https://typst.app/open-source/#download)

### Editor Setup

For the best experience, install the
[Tinymist](https://marketplace.visualstudio.com/items?itemName=myriad-dreamin.tinymist) extension
for your editor. It provides syntax highlighting, autocomplete, live preview, and error diagnostics.

Tinymist supports the following editors:

- VS Code
- NeoVim
- Helix
- Zed
- Sublime Text
- Emacs

See the [Tinymist documentation](https://myriad-dreamin.github.io/tinymist/frontend/main.html) for
setup instructions for each editor.

### Compile Your Document

Typst has two modes for compiling documents from the terminal:

- **`typst compile paper.typ`** compiles the document once and produces `paper.pdf`.
- **`typst watch paper.typ`** watches for changes and recompiles automatically on every save.

### Using Local Fonts

In the browser tour you were limited to the four bundled fonts. A local Typst install can also use
every font installed on your operating system, plus any font files you point it at.

To see what Typst can find on your machine, run:

```
typst fonts
```

This prints every font family available, the bundled ones and your system fonts together. Any name
in that list can go straight into a `#set text(font: "...")` rule.

To use font files that aren't installed system-wide, keep them in your project and tell Typst where
to look with `--font-path`:

```
typst compile --font-path fonts paper.typ
```

For documents that need to compile the same way on any machine, bundle the fonts with the project
and add `--ignore-system-fonts` so only your `--font-path` and the bundled fonts are used:

```
typst compile --font-path fonts --ignore-system-fonts paper.typ
```

That guarantees a collaborator (or a CI server) renders your paper with the exact fonts you
intended, instead of silently falling back to whatever they happen to have installed.

### Project Structure

For small documents, a single `.typ` file is all you need. For larger projects, split your code:

```
my-paper/
  .fonts/          # bundled fonts
    Roboto-Regular.ttf
  main.typ          # your content
  template.typ      # styling
  refs.yaml         # bibliography
  figures/
    diagram.png
```

Import your template just like we did in the Templates chapter:

```typst
#import "template.typ": paper
#show: paper.with(title: "...", author: "...")
```

That's it. You're ready to write Typst documents on your own. Happy typesetting!
