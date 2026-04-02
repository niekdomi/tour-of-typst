#set page(
  paper: "a4",
  margin: 2cm,
  header: align(right)[_The Aerodynamics of Toast_],
  numbering: "1",
)

#set text(font: "New Computer Modern", size: 11pt)
#set par(justify: true, leading: 0.8em)

#set heading(numbering: "1.1")
#show heading: set text(font: "DejaVu Sans Mono")

= The Aerodynamics of Toast: Why It Always Lands Butter-Side Down
Dr. Eleanor Crumb

#outline(indent: auto)

The phenomenon of _toast landing butter-side down_ has been observed across
cultures, kitchen surfaces, and socioeconomic backgrounds. This paper presents a
physical model of toast rotation during free fall and demonstrates that
*gravitational torque, not bad luck* is responsible for this culinary tragedy.

#set page(columns: 2)

== Introduction
Toast, when dropped from a standard table height of approximately 0.75 m,
rotates predictably during its fall and arrives at the floor with the buttered
surface facing down. This is not a matter of perception or pessimism. It is a
consequence of _angular momentum_, _gravitational acceleration_, and the
unfortunate geometry of breakfast items. This paper derives a model for toast
rotation and validates it experimentally.

#figure(
  rect(width: 4cm, height: 2cm, fill: luma(230))[
    _Toast diagram placeholder_
  ],
  caption: [Schematic of toast rotation during free fall.],
)

== Methods
The following materials were used in each trial:

- Bread
  - White sandwich bread, 12 mm thickness
  - Uniform slice mass of 28 #sym.plus.minus 1 g
- Butter
  - Salted, spreadable, applied to one side only
  - Layer thickness: 2 mm, verified with digital calipers
- Equipment
  - Wooden table, height 0.75 m
  - High-speed camera, 240 fps
  - Floor covered in paper for impact recording

Each trial proceeded as follows:

+ Prepare one slice of bread with butter applied to the top face
+ Hold the slice horizontally at table height, buttered side up
+ Release the slice without imparting spin
+ Record the fall with the high-speed camera
+ Inspect the landing and record which face contacted the floor
+ Repeat for a total of 50 trials per session, across 3 sessions

The following simulation was used to verify the physical model:

```python
import numpy as np

def simulate_toast_drop(height=0.75, mass=0.028):
    g = 9.81
    t_fall = np.sqrt(2 * height / g)
    omega = (g * t_fall) / (0.05)
    angle = omega * t_fall
    return np.degrees(angle) % 360
```

== Results
Drops were performed from a table height of $h approx 0.75$ m. The angular
velocity of the toast during free fall is given by:

$ omega = (g dot t) / r $

The total rotation angle before impact is:

$ theta = 1 / 2 dot g dot t^2 / r $

#figure(
  table(
    columns: (1fr, 1fr, 1fr, 1fr),
    [*Session*], [*Drops*], [*Butter-Side Down*], [*Avg. Rotation*],
    [1], [50], [62%], [178°],
    [2], [50], [58%], [173°],
    [3], [50], [64%], [181°],
  ),
  caption: [Summary of the butter-density correlation trials.],
)

== Conclusion
// TODO: summarize
