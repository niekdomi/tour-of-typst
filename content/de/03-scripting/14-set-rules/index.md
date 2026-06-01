# Set-Regeln

Bisher haben wir `#set` für Seite und Text verwendet, aber das ist erst der Anfang. Set-Regeln
funktionieren auf fast jedem Element in Typst. Sie erlauben dir, Standardwerte global zu ändern,
damit du dich nicht wiederholst wie ein nervöser Toast-Dropper beim 47. Versuch.

Anstatt Überschriften manuell zu nummerieren, kannst du es zum Beispiel einmal festlegen:

```typst
#set heading(numbering: "1.1")
```

Jetzt werden alle Überschriften automatisch nummeriert: 1, 1.1, 1.2, 2 usw. Weitere nützliche
Set-Regeln:

```typst
#set par(leading: 0.8em)   // Zeilenabstand innerhalb von Absätzen
#set par(spacing: 1.2em)   // Abstand zwischen Absätzen
#set block(spacing: 1.5em) // Abstand um Blöcke
#set text(hyphenate: true) // Silbentrennung aktivieren
```

## Deine Aufgabe

Säubere das Dokument durch Hinzufügen von Set-Regeln oben (nach der Seiteneinrichtung):

- `#set heading(numbering: "1.1")`, alle Abschnitte automatisch nummerieren
- `#set par(leading: 0.8em)`, Zeilenabstand verringern

Beobachte, wie jede Überschrift eine Nummer bekommt, ohne eine einzige Überschriftszeile anzufassen.
Das ist die Kraft der Set-Regeln. Das Verhalten einmal ändern, überall anwenden.

> [!NOTE] Set-Regeln wirken nur auf Elemente, die _nach_ ihnen kommen. Deshalb gehören sie ganz an
> den Anfang deines Dokuments.
