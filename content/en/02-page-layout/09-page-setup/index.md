# Page Setup

Our paper has equations, figures, tables, and code, but it still looks like a hastily formatted
email from an undergrad who just realized the deadline is in two hours. Time to make it look like
something the _Journal of Applied Butter Studies_ would actually accept. Typst lets you configure
page size, margins, and fonts with `#set` rules at the top of your document.

```typst
#set page(paper: "a4", margin: 2cm)
#set text(font: "New Computer Modern", size: 11pt)
```

Common paper sizes: `"a4"`, `"us-letter"`. You can also get specific about margins:

```typst
#set page(margin: (top: 2.5cm, bottom: 2cm, left: 2cm, right: 2cm))
```

## Your Task

Add page setup rules at the very top of the document (before the title):

- Set the paper size to `"a4"`
- Set margins to `2cm`
- Set the font to `"New Computer Modern"` at `11pt`
- Set paragraph justification with `#set par(justify: true)`

Watch the preview, the text should snap into justified, serif-font respectability. Dr. Crumb has
threatened to revoke our lab access if she sees one more ragged-right margin, so this is crucial.

> [!NOTE] `#set` rules apply to everything that comes after them. That's why they go at the very top
> of the document.
