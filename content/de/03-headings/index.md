# Überschriften & Struktur

Überschriften verleihen deinem Dokument Struktur und erzeugen automatisch ein Inhaltsverzeichnis.
Typst unterstützt bis zu sechs Überschriftenebenen, alle erstellt mit `=`-Zeichen.

## Überschriften erstellen

Die Anzahl der `=`-Zeichen bestimmt die Ebene der Überschrift:

```typst
= Überschrift Ebene 1
== Überschrift Ebene 2
=== Überschrift Ebene 3
==== Überschrift Ebene 4
```

Das entspricht direkt der Dokumenthierarchie — verwende Ebene 1 für Kapitel, Ebene 2 für
Abschnitte, Ebene 3 für Unterabschnitte und so weiter.

## Nummerierung

Du kannst alle Überschriften mit einer `#set`-Regel automatisch nummerieren lassen:

```typst
#set heading(numbering: "1.1")

= Einleitung
== Hintergrund
== Motivation
= Methoden
```

Typst unterstützt viele Nummerierungsmuster: `"1."`, `"1.1"`, `"I.A"`, `"a)"` — beliebige
Kombinationen aus Ziffern, Buchstaben und römischen Zahlen.

## Erscheinungsbild anpassen

Verwende eine `#show`-Regel, um das Aussehen jeder Überschrift zu ändern:

```typst
#show heading.where(level: 1): it => [
  #set text(fill: eastern)
  #block(it.body)
]
```

## Inhaltsverzeichnis

Die Funktion `#outline()` erzeugt automatisch ein Inhaltsverzeichnis aus deinen Überschriften:

```typst
#outline()
```

Mit `#outline(depth: 2)` kannst du die Tiefe einschränken und nur die obersten zwei
Überschriftenebenen anzeigen.

## Ausprobieren

```typst
#set heading(numbering: "1.1")

#outline()

= Kapitel Eins

== Abschnitt 1.1

Etwas Inhalt hier.

== Abschnitt 1.2

=== Unterabschnitt 1.2.1

Noch tiefere Struktur.
```

> **Tipp:** Du kannst eine bestimmte Überschrift vom Inhaltsverzeichnis ausschließen, indem du
> `outlined: false` setzt: `#heading(outlined: false)[Anhang]`.
