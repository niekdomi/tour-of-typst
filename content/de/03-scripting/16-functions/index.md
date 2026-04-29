# Funktionen

Dr. Crumbs Paper braucht redaktionelle Hinweisboxen – eine für ethische Hinweise zur
Toast-Behandlung, eine weitere für zukünftige Forschungsideen. Wir _könnten_ jedes Mal dieselbe
Formatierung kopieren und einfügen, aber so sehen akademische Paper wie Erpresserbriefe aus.

Definiere stattdessen eine Funktion mit `#let`:

```typst
#let hinweis(body) = block(
  fill: luma(230),
  inset: 10pt,
  radius: 4pt,
  body,
)
```

Jetzt kannst du sie überall verwenden:

```typst
#hinweis[In dieser Studie wurde kein Toast unnötig beschädigt.]
```

Funktionen können mehrere Parameter haben, auch optionale mit Standardwerten:

```typst
#let hinweis(titel: "Hinweis", body) = block(
  fill: luma(230),
  inset: 10pt,
  radius: 4pt,
)[
  *#titel:* #body
]

#hinweis[Standardtitel.]
#hinweis(titel: "Warnung")[Benutzerdefinierter Titel.]
```

## Deine Aufgabe

Erstelle eine `#let hinweis(body)`-Funktion, die eine gestaltete Hinweisbox rendert. Verwende sie
dann an zwei Stellen:

- **Abschnitt Methoden**: Ein Hinweis zur ethischen Toast-Behandlung ("Kein Toast wurde unnötig
  beschädigt...")
- **Schlussfolgerung**: Ein Hinweis zu zukünftigen Forschungsrichtungen (vielleicht verschiedene
  Brotsorten testen?)

> [!NOTE] Die Funktion `block()` eignet sich hervorragend zum Erstellen von Boxen. Verwende `fill`
> für die Hintergrundfarbe, `inset` für den Innenabstand und `radius` für abgerundete Ecken.
