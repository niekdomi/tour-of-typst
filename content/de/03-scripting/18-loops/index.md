# Schleifen

Unsere Ergebnistabelle haben wir im Kapitel über Tabellen fest eingetragen. Das war für drei Zeilen
in Ordnung, aber Dr. Crumb hat gerade Daten aus _zehn_ Versuchssitzungen geschickt. Jede Zeile
von Hand zu tippen ist keine Wissenschaft, das ist Quälerei. Lass Typst den langweiligen Teil
erledigen.

```typst
#for i in range(1, 4) {
  [Versuch #i ist abgeschlossen. ]
}
```

Das gibt aus: "Versuch 1 ist abgeschlossen. Versuch 2 ist abgeschlossen. Versuch 3 ist
abgeschlossen."

Schleifen funktionieren auch mit Arrays – perfekt für Danksagungen:

```typst
#let namen = ("Alice", "Bob", "Charlie")

#for name in namen {
  [- Danke an #name für die Unterstützung. ]
}
```

Die wahre Stärke zeigt sich innerhalb von `#table()`:

```typst
#let daten = ((1, 50, "62%"), (2, 50, "58%"), (3, 50, "64%"))

#table(
  columns: 3,
  [*Sitzung*], [*Versuche*], [*Butterseite unten*],
  ..daten.map(zeile => zeile.map(str)).flatten()
)
```

## Deine Aufgabe

Ersetze die fest eingetragene Ergebnistabelle durch eine, die aus Daten generiert wird:

- Definiere ein Array mit Versuchsdaten
- Verwende eine `#for`-Schleife oder `.map()`, um die Tabellenzeilen zu erzeugen
- Füge am Ende einen Abschnitt **Danksagungen** hinzu, der eine Liste von Laborassistenten
  mithilfe einer Schleife dankt (sie haben viele gebutterte Böden gereinigt)

> [!TIP] Der `..`-Spread-Operator flacht ein Array in einzelne Argumente um – unverzichtbar, um
> generierte Zeilen an `#table()` zu übergeben.
