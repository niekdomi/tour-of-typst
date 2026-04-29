#import "@preview/showybox:2.0.4": showybox

#let autor = "Dr. Eleanor Crumb"
#let institution = "Institut für Frühstückswissenschaften"
#let datum = "März 2026"
#let entwurf = true

#let daten = (
  (1, 50, "62%", "178°"),
  (2, 50, "58%", "173°"),
  (3, 50, "64%", "181°"),
)

#let assistenten = ("Alice", "Bob", "Charlie")

#set page(
  paper: "a4",
  margin: 2cm,
  header: align(right)[_Die Aerodynamik von Toast_],
  numbering: "1",
)

#set text(font: "New Computer Modern", size: 11pt)
#set par(justify: true, leading: 0.8em)

#set heading(numbering: "1.1")
#set math.equation(numbering: "(1)")
#show heading: set text(font: "DejaVu Sans Mono")

#show heading.where(level: 1): it => {
  set text(size: 18pt)
  smallcaps(it.body)
  v(0.5em)
}

#show heading.where(level: 2): it => {
  it
  line(length: 100%, stroke: 0.5pt)
}

#if entwurf {
  align(center, text(red, size: 20pt)[*ENTWURF*])
}

= Die Aerodynamik von Toast: Warum er immer mit der gebutterten Seite nach unten landet

#align(center, text(gray)[#autor])

#outline(indent: auto)

Das Phänomen, dass _Toast mit der gebutterten Seite nach unten landet_, wurde in
verschiedenen Kulturen, auf Küchenböden und in allen sozioökonomischen Schichten
beobachtet. Diese Arbeit präsentiert ein physikalisches Modell der Toast-Rotation
im freien Fall und zeigt, dass *Gravitationsdrehmoment, nicht Pech* für diese
kulinarische Tragödie verantwortlich ist.

#set page(columns: 2)

== Einleitung
Toast, der von einer Standardtischhöhe von etwa 0,75 m fallen gelassen wird,
rotiert vorhersehbar während des Falls und landet mit der gebutterten Seite auf
dem Boden. Frühere Arbeiten von @murphy2003 haben dieses Phänomen gezeigt. Wie
in @abb-rotation dargestellt, ist das keine Frage der Wahrnehmung oder des
Pessimismus. Es ist eine Folge des _Drehimpulses_, der
_Gravitationsbeschleunigung_ und der unglücklichen Geometrie von
Frühstücksartikeln. Diese Arbeit leitet ein Modell für die Toast-Rotation her
und validiert es experimentell.

#figure(
  rect(width: 4cm, height: 2cm, fill: luma(230))[
    _Platzhalter für Toast-Diagramm_
  ],
  caption: [Schema der Toast-Rotation während des freien Falls.],
) <abb-rotation>

== Methoden <methoden>
Das physikalische Modell folgt @matthews1995. Für jeden Versuch wurden folgende
Materialien verwendet:

- Brot
  - Weissbrot, 12 mm Dicke
  - Einheitliche Scheibenmasse von 28 #sym.plus.minus 1 g
- Butter
  - Gesalzen, streichfähig, nur auf einer Seite aufgetragen
  - Schichtdicke: 2 mm, mit digitalem Messschieber verifiziert
- Ausrüstung
  - Holztisch, Höhe 0,75 m
  - Hochgeschwindigkeitskamera, 240 fps
  - Boden mit Papier bedeckt für Aufprallaufzeichnung

Jeder Versuch verlief wie folgt:

+ Eine Scheibe Brot mit Butter auf der Oberseite vorbereiten
+ Die Scheibe waagerecht auf Tischhöhe halten, gebutterte Seite oben
+ Die Scheibe ohne Drall fallen lassen
+ Den Fall mit der Hochgeschwindigkeitskamera aufzeichnen
+ Die Landung untersuchen und notieren, welche Seite den Boden berührt hat
+ Für insgesamt 50 Versuche pro Sitzung, über 3 Sitzungen wiederholen

Die folgende Simulation wurde verwendet, um das physikalische Modell zu verifizieren:

```python
import numpy as np

def simulate_toast_drop(height=0.75, mass=0.028):
    g = 9.81
    t_fall = np.sqrt(2 * height / g)
    omega = (g * t_fall) / (0.05)
    angle = omega * t_fall
    return np.degrees(angle) % 360
```

#showybox(
  title: "Hinweis",
  [Kein Toast wurde in dieser Studie unnötig beschädigt. Alle Scheiben wurden
    nach der Datenerhebung verantwortungsvoll verzehrt.],
)

== Ergebnisse
Die Versuche wurden von einer Tischhöhe von $h approx 0.75$ m durchgeführt.
Mit @gl-omega ergibt sich die Winkelgeschwindigkeit des Toasts während des
freien Falls zu:

$ omega = (g dot t) / r $ <gl-omega>

Der gesamte Rotationswinkel vor dem Aufprall beträgt:

$ theta = 1 / 2 dot g dot t^2 / r $

#figure(
  table(
    columns: (1fr, 1fr, 1fr, 1fr),
    [*Sitzung*], [*Versuche*], [*Butterseite unten*], [*Mittl. Rotation*],
    ..daten.map(zeile => zeile.map(v => [#v])).flatten(),
  ),
  caption: [Zusammenfassung der Butterdichte-Korrelationsversuche.],
) <tab-ergebnisse>

== Schlussfolgerung
Die Toast-Rotation wird durch Geometrie und Drehmoment bestimmt, nicht durch
Aberglauben. Die Daten in @tab-ergebnisse bestätigen, dass die gemessene
Winkelbeschleunigung eine fast halbe Umdrehung vor dem Aufprall vorhersagt,
was die Butter-unten-Tendenz in allen Versuchen erklärt.

#showybox(
  title: "Zukünftige Forschung",
  [Verschiedene Brotsorten, Butterdichten und Anti-Drehmoment-Plattendesigns
    untersuchen, um Frühstücksergebnisse zu verbessern.],
)

== Danksagungen
#for name in assistenten {
  [- Danke an #name für die Unterstützung bei der Datenerhebung.]
}

#bibliography("refs.yaml")
