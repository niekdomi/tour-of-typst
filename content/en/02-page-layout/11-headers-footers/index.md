# Headers & Footers

A real journal article whispers its title on every page and politely numbers them at the bottom.
Without these, our paper is just a loose collection of pages waiting to be dropped and shuffled by a
careless peer reviewer, much like our toast. We can't let our research fall apart now!

```typst
#set page(
  header: [_The Aerodynamics of Toast_],
  numbering: "1",
)
```

The `numbering` parameter controls page numbers. Common patterns:

| Pattern   | Result       |
| --------- | ------------ |
| `"1"`     | 1, 2, 3      |
| `"1 / 1"` | 1 / 5, 2 / 5 |
| `"i"`     | i, ii, iii   |

You can position the header with `align`:

```typst
#set page(
  header: align(right)[_The Aerodynamics of Toast_],
)
```

## Your Task

Update the `#set page(...)` rule to add:

- A right-aligned italic header with the paper title (so they never forget what they're reading)
- Page numbering using the `"1"` pattern (so we can put the pages back together when Reviewer 2
  drops them)

> [!TIP] You can combine multiple settings in one `#set page(...)` call, just add them as
> comma-separated arguments.
