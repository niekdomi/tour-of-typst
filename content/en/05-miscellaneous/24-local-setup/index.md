# Local Setup

You've completed the entire tour in the browser. For real projects though, you'll want Typst running
on your own machine. Here's how to get started.

### Install Typst

Typst is a single binary with no dependencies. Pick your platform:

```
# macOS (Homebrew)
brew install typst

# Arch Linux
pacman -S typst

# Windows (Winget)
winget install --id Typst.Typst

# Cargo (any platform)
cargo install typst-cli
```

### Editor Setup

For the best experience, use **VS Code** with the **Tinymist** extension:

1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Tinymist Typst** extension from the marketplace
3. Open a `.typ` file; you get syntax highlighting, autocomplete, live preview, and error
   diagnostics

> [!TIP] Tinymist also supports other editors like Neovim, Helix, and Zed. Check the Tinymist
> documentation for setup instructions.

### Compile Your Document

From the terminal:

```
# Compile once
typst compile paper.typ

# Watch mode: Recompiles on every save
typst watch paper.typ
```

Both commands produce a `paper.pdf` in the same directory.

### Project Structure

For small documents, a single `.typ` file is all you need. For larger projects, split your code:

```
my-paper/
  main.typ          # your content
  template.typ      # styling (the template we built!)
  refs.bib          # bibliography
  figures/
    diagram.png
```

Import your template just like we did in the Templates chapter:

```typst
#import "template.typ": paper
#show: paper.with(title: "...", author: "...")
```

That's it. You're ready to write Typst documents on your own. Happy typesetting!
