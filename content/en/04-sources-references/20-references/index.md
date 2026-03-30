# References

Now the real magic happens. Those invisible labels we added? They become clickable, auto-numbered
cross-references with a single `@`:

```typst
As shown in @fig-rotation, the toast rotates approximately 180°.
```

Typst resolves the reference automatically, it inserts the correct figure/table/equation number and
even creates a clickable link. No manual numbering, no "see Figure ??" disasters.

```typst
The angular velocity is given by @eq-omega.
See @tab-results for the full dataset.
The experimental setup is described in @methods.
```

If you want to customize the displayed text, use a supplement:

```typst
As shown in @fig-rotation[Figure]
```

## Your Task

Our paper currently says vague things like "see above" and "as discussed over coffee." The reviewers
will reject this faster than toast hits the floor. Let's fix it with proper references:

- In the Introduction: "As shown in @fig-rotation..."
- In Results: "Using @eq-omega..."
- In the Conclusion: "The data in @tab-results confirms..."

> [!TIP] If a reference shows a question mark (?), the label doesn't exist yet. Check for typos,
> Typst won't guess what you meant.
