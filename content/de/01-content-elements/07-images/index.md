# Bilder & Abbildungen

Ein Physikpaper ohne Diagramm ist nur eine Sammlung beängstigend aussehender Buchstaben. Da wir
nicht erwarten können, dass unsere Leser die Tragödie des fallenden Toasts einfach so imaginieren,
müssen wir es ihnen zeigen. Jedes gute Paper hat Abbildungen. In Typst werden Bilder mit der
Funktion `#image()` eingefügt und in `#figure()` eingebettet, um eine Bildunterschrift
hinzuzufügen.

```typst
#figure(
  image("diagramm.png", width: 60%),
  caption: [Ein Diagramm des Toasts im freien Fall.],
)
```

Wenn deine Hochgeschwindigkeitskamera noch in der Werkstatt ist, kannst du ein `#rect()` als
Platzhalter verwenden. Das hält dein Layout bereit, während du auf das echte Bild wartest.

```typst
#figure(
  rect(width: 4cm, height: 2cm, fill: luma(230))[
    _Platzhalter für Toast-Diagramm_
  ],
  caption: [Schema der Toast-Rotation während des freien Falls.],
)
```

> [!NOTE] Die Funktion `#figure()` nummeriert deine Bilder automatisch (Abbildung 1, Abbildung 2
> usw.). Du musst nicht selbst zählen – Typst macht das für dich! Später lernen wir, wie man sie
> per Beschriftung referenziert.

## Deine Aufgabe

Füge eine Abbildung mit einem Platzhalter-Rechteck zum Abschnitt **Einleitung** hinzu. Gib ihr
eine beschreibende Bildunterschrift über die Rotationsbahn des Toasts.
