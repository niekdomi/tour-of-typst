# Math

A physics paper without equations is just an opinion piece. It's time to give our toast research
some mathematical credibility. Typst uses the `$` symbol to enter math mode.

### Inline vs. Display Math

- **Inline math** (`$pi$`) is for variables or small expressions that live inside a sentence.
- **Display math** (`$ pi $`) is for the headliner equations. By adding a space after the opening
  `$` and before the closing `$`, Typst centers the formula on its own line and renders it in full
  glory.

```typst
The angular velocity is $omega$.

$ omega = (g dot t) / r $
```

Here are some symbols you'll need for our toast physics:

| Typst    | Result                 |
| -------- | ---------------------- |
| `omega`  | ω                      |
| `theta`  | θ                      |
| `approx` | ≈                      |
| `dot`    | · (multiplication dot) |
| `pi`     | π                      |

## Your Task

Time to fill in the **Results** section. Our toast doesn't just fall, it falls with _style_ and
_equations_:

- Mention inline that the table height is `$h approx 0.75$` m
- Add a display equation for angular velocity: `$omega = (g dot t) / r$`
- Add a second equation for the rotation angle: `$theta = 1/2 dot g dot t^2 / r$`

> [!NOTE] Fractions are written as `a / b` in math mode. Typst automatically renders them as proper
> fractions in display math. No need for special fraction commands.
