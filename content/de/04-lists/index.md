# Listen

Geordnete und ungeordnete Listen sind erstklassige Elemente in Typst. Sie lassen sich mit
leichtgewichtigem Markup einfach schreiben und sind vollständig anpassbar, wenn du mehr Kontrolle
benötigst.

## Ungeordnete Listen

Beginne eine Zeile mit `-`, um eine Aufzählungsliste zu erstellen:

```typst
- Äpfel
- Bananen
- Kirschen
```

## Geordnete Listen

Beginne eine Zeile mit `+` für eine nummerierte Liste:

```typst
+ Erster Schritt
+ Zweiter Schritt
+ Dritter Schritt
```

## Verschachtelung

Rücke Einträge um zwei Leerzeichen ein, um verschachtelte Listen zu erstellen. Du kannst geordnete
und ungeordnete Ebenen frei mischen:

```typst
- Obst
  - Äpfel
  - Bananen
    - Cavendish
    - Kochbanane
- Gemüse

+ Wasser kochen
+ Nudeln hinzufügen
  + Gelegentlich umrühren
  + 8–10 Minuten kochen
+ Abgießen und servieren
```

## Begriffslisten

Für definitionsartige Listen verwende die Syntax `/ Begriff: Beschreibung`:

```typst
/ Typst: Ein modernes Schriftsatzsystem.
/ LaTeX: Ein klassisches Schriftsatzsystem auf Basis von TeX.
/ Markdown: Eine leichtgewichtige Auszeichnungssprache für Klartext.
```

## Listen anpassen

Die Funktionen `#list`, `#enum` und `#terms` geben dir vollständige Kontrolle über Markierungen,
Abstände und Einrückungen:

```typst
#list(
  marker: [→],
  indent: 1em,
  [Erster Eintrag],
  [Zweiter Eintrag],
  [Dritter Eintrag],
)
```

## Ausprobieren

```typst
- Äpfel
- Bananen
  - Cavendish
  - Kochbanane
- Kirschen

+ Erster Schritt
+ Zweiter Schritt
  + Teilschritt A
  + Teilschritt B
+ Dritter Schritt

/ Typst: Modern und schnell.
/ LaTeX: Leistungsstark und klassisch.
```

> **Tipp:** Du kannst das Aufzählungszeichen für das gesamte Dokument ändern mit
> `#set list(marker: [•])`.
