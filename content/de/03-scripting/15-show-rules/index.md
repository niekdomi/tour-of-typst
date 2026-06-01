# Show-Regeln

Set-Regeln ändern Parameter. Show-Regeln ändern _wie Elemente vollständig aussehen_. Wenn Set-Regeln
wie das Einstellen des Thermostats sind, dann sind Show-Regeln wie das komplette Neudekorieren des
Raums.

Die einfachste Form wendet eine Set-Regel auf einen bestimmten Elementtyp an:

```typst
#show heading: set text(blue)
```

Alle Überschriften sind jetzt blau. Für vollständige Kontrolle kannst du das Element abfangen und
neu aufbauen:

```typst
#show heading.where(level: 1): it => {
  set text(size: 18pt)
  smallcaps(it.body)
  v(0.5em)
}
```

Weitere Beispiele, denn wenn man einmal anfängt, hört man schwer auf:

```typst
// Links blau und unterstrichen machen
#show link: it => underline(text(fill: blue, it))

// Eine Linie unter Überschriften der zweiten Ebene hinzufügen
#show heading.where(level: 2): it => {
  it
  line(length: 100%, stroke: 0.5pt)
}
```

## Deine Aufgabe

Unser Paper ist funktional, sieht aber noch nicht wie ein seriöser Zeitschriftenartikel aus. Dr.
Crumb besteht darauf, dass ästhetische Perfektion die Gutachter von kleineren Rechenfehlern ablenken
kann. Füge einige Show-Regeln hinzu:

- Lass den Titel (Überschrift Ebene 1) in Kapitälchen mit `#smallcaps()` rendern
- Gestalte den Autorennamen. Versuche ihn zu zentrieren oder grau zu machen

> [!TIP] Du kannst nach Überschriftsebene filtern mit `heading.where(level: 1)`. So wird deine
> Titelgestaltung nicht versehentlich auf jeden Abschnitt angewendet.
