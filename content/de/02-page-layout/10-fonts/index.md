# Schriftarten

Unser Paper verwendet die Standardschrift (Libertinus Serif), was völlig in Ordnung ist, aber
Dr. Crumb möchte diesen klassischen akademischen Look. In Typst ist ein Schriftartwechsel eine
einzige Set-Regel:

```typst
#set text(font: "New Computer Modern")
```

### Mitgelieferte Schriftarten

Die Typst-CLI wird mit vier eingebetteten Schriftarten geliefert, die überall funktionieren –
keine Installation nötig:

| Schriftart                 | Typ               | Typische Verwendung            |
| -------------------------- | ----------------- | ------------------------------ |
| `Libertinus Serif`         | Serif (Standard)  | Fliesstext                     |
| `New Computer Modern`      | Serif             | Klassische akademische Paper   |
| `New Computer Modern Math` | Mathematik        | Gleichungen (automatisch)      |
| `DejaVu Sans Mono`         | Nichtproportional | Code-Blöcke                    |

Diese Tour unterstützt nur diese mitgelieferten Schriftarten. Bei lokaler Arbeit kann Typst auch
auf deinem System installierte Schriftarten verwenden. Mehr dazu im Kapitel **Lokale Einrichtung**.

### Verschiedene Schriftarten für verschiedene Elemente

Du kannst verschiedene Schriftarten für verschiedene Teile deines Dokuments verwenden. Zum
Beispiel den Fliesstext in einer Serifenschrift belassen, aber Code-Blöcke auf nichtproportional
umstellen:

```typst
#set text(font: "New Computer Modern", size: 11pt)
#show raw: set text(font: "DejaVu Sans Mono")
```

Falls du eine serifenlose Schrift auf deinem System hast, könntest du sie auch für Überschriften
verwenden:

```typst
#show heading: set text(font: "Arial")
```

### Ersatzschriftarten

Wenn einer Schrift bestimmte Zeichen fehlen, versucht Typst die nächste Schrift aus einer Liste:

```typst
#set text(font: ("New Computer Modern", "DejaVu Sans Mono"))
```

## Deine Aufgabe

Gestalte die Typografie des Papers:

- Setze die Hauptschrift auf `"New Computer Modern"` mit `11pt`
- Probiere `"Libertinus Serif"` aus und vergleiche die beiden
- Experimentiere mit der Schriftgrösse – probiere `10pt` oder `12pt` und beobachte, wie das Layout
  neu fliesst

> [!NOTE] Die mitgelieferten Schriftarten funktionieren garantiert überall. Systemschriften
> funktionieren lokal, sind aber möglicherweise nicht verfügbar, wenn jemand anderes dein Dokument
> kompiliert oder die Web-App verwendet. Für maximale Portabilität bleibe bei den mitgelieferten
> Schriftarten oder füge Schriftartdateien in dein Projekt ein.
