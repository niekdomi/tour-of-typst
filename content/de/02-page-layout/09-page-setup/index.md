# Seiteneinrichtung

Unser Paper hat Gleichungen, Abbildungen, Tabellen und Code – sieht aber immer noch aus wie eine
hastig formatierte E-Mail eines Studenten, der gerade gemerkt hat, dass die Abgabefrist in zwei
Stunden ist. Zeit, es so aussehen zu lassen, als würde es das _Journal of Applied Butter Studies_
tatsächlich annehmen. Typst lässt dich Seitengrösse, Ränder und Schriftarten mit `#set`-Regeln am
Anfang deines Dokuments konfigurieren.

```typst
#set page(paper: "a4", margin: 2cm)
#set text(font: "New Computer Modern", size: 11pt)
```

Gängige Papierformate: `"a4"`, `"us-letter"`. Du kannst auch Ränder gezielt festlegen:

```typst
#set page(margin: (top: 2.5cm, bottom: 2cm, left: 2cm, right: 2cm))
```

## Deine Aufgabe

Füge Seiteneinrichtungsregeln ganz oben im Dokument hinzu (vor dem Titel):

- Seitengrösse auf `"a4"` setzen
- Ränder auf `2cm` setzen
- Schriftart auf `"New Computer Modern"` mit `11pt` setzen
- Absatzausrichtung mit `#set par(justify: true)` setzen

Beobachte die Vorschau – der Text sollte in eine seriöse, serifierte Blocksatzdarstellung
einrasten. Dr. Crumb hat gedroht, uns den Laborzugang zu entziehen, wenn sie noch einmal einen
Flattersatz sieht, also ist das entscheidend.

> [!NOTE] `#set`-Regeln gelten für alles, was nach ihnen kommt. Deshalb gehören sie ganz an den
> Anfang des Dokuments.
