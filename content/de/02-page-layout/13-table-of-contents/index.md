# Inhaltsverzeichnis

Unser Paper hat jetzt nummerierte Überschriften, Spalten, Kopf- und Fusszeilen. Es sieht aus wie
ein richtiger Zeitschriftenartikel. Aber jedes Paper, das länger als ein paar Seiten ist, braucht
ein Inhaltsverzeichnis, damit Leser direkt zu den Ergebnissen springen können (oder, seien wir
ehrlich, zur Schlussfolgerung).

In Typst wird ein Inhaltsverzeichnis mit einer einzigen Funktion erstellt:

```typst
#outline()
```

Das war's. Typst liest alle deine Überschriften und erstellt automatisch eine klickbare, mit
Seitenzahlen versehene Liste. Wenn du einen Abschnitt hinzufügst, entfernst oder umbenennst,
aktualisiert sich das Inhaltsverzeichnis von selbst.

### Anpassung

Du kannst Einrückung und Tiefe steuern:

```typst
#outline(depth: 2) // nur Überschriften der Ebene 1 und 2 anzeigen
```

Du kannst auch einen benutzerdefinierten Titel vergeben:

```typst
#outline(title: "Menü der Erkenntnisse")
```

## Deine Aufgabe

Füge `#outline()` direkt nach Titel und Autor, vor dem Abstract ein.

> [!NOTE] Die Funktion heisst in Typst `outline` und nicht "Inhaltsverzeichnis" – aber sie tut
> genau das, was du von einem Inhaltsverzeichnis erwartest.
