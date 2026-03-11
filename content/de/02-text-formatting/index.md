# Textformatierung

Typst gibt dir eine fein abgestimmte Kontrolle darüber, wie Text aussieht — von Schriftgewicht und
-stil bis hin zu Farbe, Größe und Zeichenabstand.

## Kurzschrift-Markup

Der schnellste Weg, Text zu formatieren, ist inline Markup:

| Syntax | Ergebnis |
|---|---|
| `*stark*` | **stark** (fett) |
| `_betont_` | *betont* (kursiv) |
| `#underline[...]` | unterstrichen |
| `#strike[...]` | ~~durchgestrichen~~ |

## Die Funktion `#text`

Für alles, was über die Kurzschriften hinausgeht, verwendest du `#text(...)`:

```typst
#text(fill: blue)[Blauer Text]
#text(size: 18pt)[Großer Text]
#text(weight: "light", tracking: 2pt)[Gesperrter heller Text]
```

## Set-Regeln

Anstatt jeden Textabschnitt in einen Funktionsaufruf zu verpacken, kannst du eine `#set`-Regel
verwenden, um Formatierungen auf den gesamten nachfolgenden Inhalt im Geltungsbereich anzuwenden:

```typst
#set text(font: "Libertinus Serif", size: 11pt)

Alles nach dieser Zeile verwendet Libertinus Serif bei 11 pt.
```

Set-Regeln sind kaskadierend — eine `#set`-Regel innerhalb eines Blocks wirkt sich nur auf diesen
Block aus:

```typst
#[
  #set text(fill: red)
  Das ist rot.
]
Hier gilt wieder die Standardfarbe.
```

## Ausprobieren

```typst
#set text(size: 11pt, font: "Libertinus Serif")

*Fett*, _kursiv_ und #underline[unterstrichen].

#text(weight: "light", tracking: 2pt)[
  Gesperrter heller Text
]

#[
  #set text(fill: eastern)
  Dieser Block ist türkis.
]

Zurück zur normalen Formatierung.
```

> **Tipp:** `#set`-Regeln gehören zu den mächtigsten Funktionen von Typst. Sie ermöglichen es dir,
> einen konsistenten Stil einmalig zu definieren, der dann automatisch im gesamten Dokument gilt.
