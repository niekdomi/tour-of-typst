# Spalten

Wer jemals eine Physikzeitschrift aufgeschlagen hat, hat das zweispaltige Layout bemerkt. Es ist das
universelle Signal für "Dies ist extrem komplizierte und ernsthafte Forschung." Unsere
Toast-Falldaten mögen fragwürdig sein, aber unser Layout muss es nicht sein. Wir werden uns die
Legitimität erkämpfen, die wir brauchen.

```typst
#set page(columns: 2)
```

Aber es gibt einen Haken: Titel und Abstract sollen die volle Seitenbreite einnehmen, während nur
der Hauptteil zwei Spalten verwendet. Das gelingt, indem du die Spalteneinstellung nach dem Abstract
platzierst:

```typst
= Titel
Abstract-Text hier...

#set page(columns: 2)

== Einleitung
Der Fliesstext fliesst ab hier in zwei Spalten...
```

Für gezieltere Kontrolle kannst du bestimmten Inhalt in `#columns()` einbetten:

```typst
#columns(2)[
  Nur dieser Text ist zweispaltig.
]
```

## Deine Aufgabe

Mache den Hauptteil des Papers zweispaltig, während Titel und Abstract über die volle Breite gehen.
Füge `#set page(columns: 2)` direkt nach dem Abstract-Absatz, aber vor der Einleitung ein.

> [!WARNING] `#set page(columns: 2)` ändert das Seitenlayout, was einen **Seitenumbruch** erzwingt.
> Alles danach beginnt auf einer neuen Seite. Scrolle in der Vorschau nach unten, um es zu sehen.
> Das ist erwartetes Verhalten. Typst kann die Spaltenanzahl nicht mitten auf der Seite ändern.

> [!TIP] Wenn die Vorschau beengt wirkt, versuche die Ränder leicht zu reduzieren (z.B. `1.5cm`), um
> den Spalten mehr Platz zu geben. Akademische Paper sind dicht, aber sie sollten nicht
> klaustrophobisch sein.
