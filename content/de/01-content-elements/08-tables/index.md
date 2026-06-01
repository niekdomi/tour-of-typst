# Tabellen

Nach wochenlangem Brotfallenlassen aus verschiedenen Höhen (und einer beträchtlichen
Reinigungsrechnung) haben unsere Forscher endlich die Rohdaten gesammelt. In Typst präsentieren wir
diese Ergebnisse mit der Funktion `#table()`.

Eine Tabelle ist im Grunde ein Raster. Du sagst Typst, wie viele **Spalten** du möchtest, und
listest dann einfach deine Datenpunkte nacheinander auf. Typst "bricht" sie automatisch in die
nächste Zeile um, basierend auf der von dir angegebenen Spaltenanzahl.

```typst
#table(
  columns: 3,
  [*Versuch*], [*Status*],  [*Ergebnis*],
  [1],         [Erfolg],    [Butterseite unten],
  [2],         [Erfolg],    [Boden ruiniert],
)
```

### Den Daten einen Titel geben

Genau wie bei Bildern ist eine im Raum schwebende Tabelle ein Rätsel. Wir betten sie in eine
`#figure()` ein, um ihr eine formale Bildunterschrift und eine Nummer zu geben, damit andere
Wissenschaftler unsere bahnbrechende Toast-Forschung zitieren können.

## Deine Aufgabe

Unser Team hat drei anstrengende Sitzungen mit je 50 Versuchen abgeschlossen. Der Küchenboden ist
eine Katastrophe, aber die Daten sind schön.

**Aktualisiere den Abschnitt Ergebnisse**, indem du die folgenden Feldnotizen in eine Tabelle
umwandelst:

| Sitzung | Versuche | Butterseite unten | Mittl. Rotation |
| :------ | :------- | :---------------- | :-------------- |
| 1       | 50       | 62%               | 178°            |
| 2       | 50       | 58%               | 173°            |
| 3       | 50       | 64%               | 181°            |

**Anforderungen:**

1. Verwende `#table()` mit 4 Spalten.
2. Verwende `columns: (1fr, 1fr, 1fr, 1fr)`, um jeder Spalte gleich viel Platz zu geben.
3. Bette das Ganze in eine `#figure()` ein.
4. Füge eine Bildunterschrift hinzu: _[Zusammenfassung der Butterdichte-Korrelationsversuche.]_

> [!TIP] Um deine Kopfzeilen wie ein Senior-Forscher aussehen zu lassen, verwende `*Fetter Text*`
> für die ersten vier Einträge in deiner Tabellenliste!
