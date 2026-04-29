# Mathematik

Ein Physikpaper ohne Gleichungen ist nur ein Meinungsartikel. Es ist Zeit, unserer
Toast-Forschung mathematische Glaubwürdigkeit zu verleihen. Typst verwendet das `$`-Symbol, um in
den Mathematikmodus zu wechseln.

### Inline- vs. Anzeigemathematik

- **Inline-Mathematik** (`$pi$`) ist für Variablen oder kleine Ausdrücke, die innerhalb eines
  Satzes stehen.
- **Anzeigemathematik** (`$ pi $`) ist für die Hauptgleichungen. Durch ein Leerzeichen nach dem
  öffnenden `$` und vor dem schliessenden `$` zentriert Typst die Formel auf einer eigenen Zeile
  und stellt sie in voller Grösse dar.

```typst
Die Winkelgeschwindigkeit ist $omega$.

$ omega = (g dot t) / r $
```

Hier sind einige Symbole, die du für unsere Toast-Physik benötigst:

| Typst    | Ergebnis               |
| -------- | ---------------------- |
| `omega`  | ω                      |
| `theta`  | θ                      |
| `approx` | ≈                      |
| `dot`    | · (Multiplikationspunkt) |
| `pi`     | π                      |

## Deine Aufgabe

Zeit, den Abschnitt **Ergebnisse** auszufüllen. Unser Toast fällt nicht einfach – er fällt mit
_Stil_ und _Gleichungen_:

- Erwähne inline, dass die Tischhöhe `$h approx 0.75$` m beträgt
- Füge eine Anzeigegleichung für die Winkelgeschwindigkeit hinzu: `$omega = (g dot t) / r$`
- Füge eine zweite Gleichung für den Rotationswinkel hinzu: `$theta = 1/2 dot g dot t^2 / r$`

> [!NOTE] Brüche werden im Mathematikmodus als `a / b` geschrieben. Typst stellt sie in der
> Anzeigemathematik automatisch als echte Brüche dar. Keine speziellen Bruchbefehle nötig.
