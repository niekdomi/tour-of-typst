## Code Blocks

Our researchers, tired of scraping butter off the floor, wrote a Python simulation to verify the
toast model virtually. Let's include it in the paper to prove we understand computers too. In Typst,
we use **Raw Blocks** to distinguish computer code from regular text.

### Inline Code

Use single backticks (`` ` ``) for short snippets, like function names or variables, that appear
inside a sentence. This applies a monospaced font so they stand out.

```typst
The function `simulate_drop()` calculates the final rotation angle.
```

### Block Code

For full scripts, use triple backticks (` ``` `). This creates a separate, indented container for
your code.

> [!TIP] If you type the name of the programming language (like `python` or `rust`) immediately
> after the first three backticks, Typst will automatically syntax highlight the code to make it
> easier to read.
>
> ````typst
> ```python
> def simulate_drop(h, m):
>     return (9.81 * h) / m
> ```
> ````

### The `raw` Function

For advanced users, Typst provides the `#raw()` function. This is useful when you need more granular
control over the styling without using backticks.

```typst
#raw("print('Simulation Complete')", lang: "python")
```

We will discuss functions in a later chapter, but for now, just know that `raw` allows you to insert
code without the triple backticks.

## Your Task

Add a code block to the **Methods** section (after the lists) showing the Python simulation used to
verify the physical model. Something like:

````typst
```python
import numpy as np

def simulate_toast_drop(height=0.75, mass=0.028):
    g = 9.81
    t_fall = np.sqrt(2 * height / g)
    omega = (g * t_fall) / (0.05)
    angle = omega * t_fall
    return np.degrees(angle) % 360
```
````
