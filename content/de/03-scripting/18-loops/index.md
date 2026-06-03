# Schleifen

Unsere Ergebnistabelle haben wir im Kapitel über Tabellen fest eingetragen. Das war für drei Zeilen
in Ordnung, aber Dr. Crumb hat gerade Daten aus _zehn_ Versuchssitzungen geschickt. Jede Zeile von
Hand zu tippen ist keine Wissenschaft, das ist Quälerei. Lass Typst den langweiligen Teil erledigen.

```typst
#for i in range(1, 4) {
  [Versuch #i ist abgeschlossen. ]
}
```

Das erzeugt folgenden Text: "Versuch 1 ist abgeschlossen. Versuch 2 ist abgeschlossen. Versuch 3 ist
abgeschlossen."

Schleifen funktionieren auch mit Arrays, perfekt für Danksagungen:

```typst
#let names = ("Alice", "Bob", "Charlie")

#for name in names {
  [- Danke an #name für die Unterstützung. ]
}
```

Die wahre Stärke zeigt sich innerhalb von `#table()`:

```typst
#let data = (
  (1, 50, "62%", "178°"),
  (2, 50, "58%", "173°"),
  (3, 50, "64%", "181°"),
)

#table(
  columns: 4,
    [*Sitzung*], [*Versuche*], [*Butterseite unten*], [*Mittl. Rotation*],
  ..data.map(zeile => zeile.map(str)).flatten()
)
```

Hier passieren zwei Dinge. `flatten()` macht aus den verschachtelten Zeilen ein einziges langes
Array von Zellen, und der `..`-_Spread-Operator_ übergibt diese Zellen einzeln an `#table()`, ganz
so, als hättest du jede selbst getippt.

`#table()` akzeptiert als Zellen aber nur Inhalt (`[...]`) oder Zeichenketten (`"..."`), keine
reinen Zahlen. Deshalb wandelt `zeile.map(str)` zuerst jeden Wert in eine Zeichenkette um (aus `1`
wird `"1"`). Lieber Inhalt statt Zeichenketten? Dann bilde die Werte mit `[#element]` ab:
`..data.map(zeile => zeile.map(element => [#element])).flatten()`. Denk daran, dass `zeile` und
`element` nur Variablen sind, du kannst sie beliebig benennen.

## Deine Aufgabe

Ersetze die fest eingetragene Ergebnistabelle durch eine, die aus Daten generiert wird:

- Definiere ein Array mit Versuchsdaten
- Verwende eine `#for`-Schleife oder `.map()`, um die Tabellenzeilen zu erzeugen
- Füge am Ende einen Abschnitt **Danksagungen** hinzu, der eine Liste von Laborassistenten mithilfe
  einer Schleife dankt (sie haben viele gebutterte Böden gereinigt)

> [!TIP] Der `..`-Spread-Operator flacht ein Array in einzelne Argumente um. Unverzichtbar, um
> generierte Zeilen an `#table()` zu übergeben.
