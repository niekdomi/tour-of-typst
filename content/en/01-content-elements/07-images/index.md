# Images & Figures

A physics paper without a diagram is just a collection of scary-looking letters. Since we can't
expect our readers to imagine the tragedy of falling toast, we need to show them. Every good paper
has figures. In Typst, images are placed with the `#image()` function, and wrapped in `#figure()` to
add a caption.

```typst
#figure(
  image("diagram.png", width: 60%),
  caption: [A diagram of toast in free fall.],
)
```

If your high-speed camera is still in the shop, you can use a `#rect()` as a placeholder. This keeps
your layout ready while you wait for the real image.

```typst
#figure(
  rect(width: 4cm, height: 2cm, fill: luma(230))[
    _Toast diagram placeholder_
  ],
  caption: [Schematic of toast rotation during free fall.],
)
```

> [!NOTE] The `#figure()` function automatically numbers your images (Figure 1, Figure 2, etc.). You
> don't have to keep track; Typst does the counting for you! Later, we'll learn how to reference
> them by label.

## Your Task

Add a figure to the **Introduction** section using a placeholder rectangle. Give it a descriptive
caption about the toast's rotational trajectory.
