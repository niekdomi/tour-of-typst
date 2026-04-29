# Überschriften & Struktur

Kein ernstzunehmendes Paper ist nur eine einzige lange Textwand. Wir brauchen Abschnitte, ein
richtiges Gerüst, an dem wir unsere Forschung aufhängen können. In Typst werden Überschriften mit
dem `=`-Zeichen erstellt. Mehr `=`-Zeichen bedeuten tiefere Verschachtelung:

```typst
= Überschrift der ersten Ebene
== Zweite Ebene
=== Dritte Ebene
```

Du kannst dir auch Notizen hinterlassen, die im fertigen Dokument nicht erscheinen:

```typst
// Diese Zeile ist für den Leser unsichtbar
```

```typst
/*
  Mehrzeilige Kommentare funktionieren auch.
  Ideal zum Verbergen existenzieller Zweifel über die Frühstückswissenschaft.
*/
```

## Deine Aufgabe

Gib dem Paper eine ordentliche akademische Struktur. Füge Abschnittsüberschriften für
**Einleitung**, **Methoden**, **Ergebnisse** und **Schlussfolgerung** hinzu. Schreibe die Einleitung
und lass den Rest als TODO-Kommentare stehen. Diese füllen wir in den nächsten Kapiteln aus.

```typst
== Einleitung
Toast, der von einer Standardtischhöhe von etwa 0,75 m fallen gelassen wird,
rotiert vorhersehbar während des Falls...

== Methoden
// TODO: Versuchsaufbau beschreiben

== Ergebnisse
// TODO: Ergebnisse vorstellen

== Schlussfolgerung
// TODO: zusammenfassen
```

> [!NOTE] Der Titel verwendet `=` (Ebene 1), also verwenden Abschnitte `==` (Ebene 2). Typst
> verfolgt die Hierarchie für Nummerierung und das Inhaltsverzeichnis. In echten akademischen
> Papieren wird der Titel normalerweise separat gestaltet und nicht als Überschrift. Dazu kommen wir
> im Kapitel über Vorlagen.
