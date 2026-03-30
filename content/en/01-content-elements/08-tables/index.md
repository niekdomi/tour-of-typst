# Tables

After weeks of dropping bread from varying heights (and a significant cleaning bill), our
researchers finally collected the raw data. In Typst, we present these findings using the `#table()`
function.

A table is essentially a grid. You tell Typst how many **columns** you want, and then you simply
list your data points one by one. Typst automatically "wraps" them into the next row based on the
column count you provided.

```typst
#table(
  columns: 3,
  [*Trial*], [*Status*], [*Outcome*],
  [1],       [Success],  [Butter-down],
  [2],       [Success],  [Floor ruined],
)
```

### Giving the Data a Title

Just like images, a table floating in space is a mystery. We wrap it in a `#figure()` to give it a
formal caption and a number so other scientists can cite our groundbreaking toast research.

## Your Task

Our team has finished three grueling sessions of 50 drops each. The kitchen floor is a disaster, but
the data is beautiful.

**Update the Results section** by converting the following field notes into a table:

| Session | Drops | Butter-Side Down | Avg. Rotation |
| :------ | :---- | :--------------- | :------------ |
| 1       | 50    | 62%              | 178°          |
| 2       | 50    | 58%              | 173°          |
| 3       | 50    | 64%              | 181°          |

**Requirements:**

1. Use `#table()` with 4 columns.
2. Use `columns: (1fr, 1fr, 1fr, 1fr)` to give every column equal breathing room.
3. Wrap the whole thing in a `#figure()`.
4. Add a caption: _[Summary of the butter-density correlation trials.]_

> [!TIP] To make your headers pop like a Senior Researcher, use `*Bold Text*` for the first four
> items in your table list!
