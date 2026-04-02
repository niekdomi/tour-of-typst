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
- Neovim
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

### Project Structure

For small documents, a single `.typ` file is all you need. For larger projects, split your code:

```
my-paper/
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
