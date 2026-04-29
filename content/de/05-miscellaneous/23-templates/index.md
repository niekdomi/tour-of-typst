# Vorlagen

Scrolle zum Anfang unseres Dokuments. Siehst du all die Set-Regeln, Show-Regeln, Variablen und
Funktionen, die sich vor dem eigentlichen Inhalt angehäuft haben? Es sieht aus wie unser Labortisch
nach einem 48-stündigen Testmarathon – notwendig, aber ein totales Chaos. Vorlagen erlauben dir,
das alles in eine separate, saubere Datei auszulagern.

Eine Vorlage ist einfach eine Funktion, die Inhalt mit Gestaltung einbettet:

```typst
// vorlage.typ
#let paper(title: "", author: "", body) = {
  set page(paper: "a4", margin: 2cm)
  set text(font: "New Computer Modern", size: 11pt)
  set heading(numbering: "1.1")
  set par(justify: true)

  align(center)[
    #text(size: 18pt)[*#title*]
    #v(1em)
    #author
    #v(2em)
  ]

  body
}
```

In deiner Hauptdatei wendest du sie dann mit einer Show-Regel an:

```typst
#import "vorlage.typ": paper

#show: paper.with(
  title: "Die Aerodynamik von Toast",
  author: "Dr. Eleanor Crumb",
)

// Jetzt einfach Inhalt schreiben – alle Gestaltung kommt aus der Vorlage
Das Phänomen, dass Toast mit der gebutterten Seite nach unten landet...
```

Das Muster `#show: funktion` wendet die Funktion auf den gesamten Dokumentinhalt an. Deine
Hauptdatei wird zu reinem Inhalt – sauber, lesbar und frei von Formatierungsunordnung.

## Deine Aufgabe

Lagere alle Gestaltungselemente vom Anfang des Dokuments in eine `paper()`-Vorlagenfunktion aus.
Wende sie dann mit `#show: paper.with(...)` an.

Dein Inhalt sollte sauber sein – nur Überschriften, Text, Abbildungen und Tabellen, ohne
gemischte Set-/Show-Regeln.

> [!TIP] Genau so sind echte Typst-Projekte strukturiert. Konferenz- und Zeitschriftenvorlagen
> folgen demselben Muster.

Herzlichen Glückwunsch – du hast ein vollständiges akademisches Paper von Grund auf erstellt. Es
hat Gleichungen, Abbildungen, Tabellen, Zitate, eine eigene Vorlage und eine
Butter-unten-Rate von 61,3 %. Dr. Crumb wäre stolz.
