# Loops

We hardcoded our results table back in the Tables chapter. That was fine for three rows, but Dr.
Crumb just sent over data from _ten_ trial sessions. Typing each row by hand is not science, it's
suffering. Let Typst do the tedious part.

```typst
#for i in range(1, 4) {
  [Trial #i is complete. ]
}
```

This outputs: "Trial 1 is complete. Trial 2 is complete. Trial 3 is complete."

Loops work on arrays too, perfect for acknowledgments:

```typst
#let names = ("Alice", "Bob", "Charlie")

#for name in names {
  [- Thanks to #name for assistance. ]
}
```

The real power shows up inside `#table()`:

```typst
#let data = ((1, 50, "62%"), (2, 50, "58%"), (3, 50, "64%"))

#table(
  columns: 3,
  [*Session*], [*Drops*], [*Butter-side down*],
  ..data.map(row => row.map(str)).flatten()
)
```

## Your Task

Replace the hardcoded results table with one generated from data:

- Define an array of trial data
- Use a `#for` loop or `.map()` to generate the table rows
- Add an **Acknowledgments** section at the end that thanks a list of lab assistants using a loop
  (they cleaned up a lot of buttered floors)

> [!TIP] The `..` spread operator flattens an array into individual arguments, essential for passing
> generated rows to `#table()`.
