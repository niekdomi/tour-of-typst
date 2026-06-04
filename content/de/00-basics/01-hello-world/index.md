# Hallo, Welt!

Jede grosse wissenschaftliche Karriere beginnt mit einer leeren Seite und zu viel Selbstvertrauen.
In Typst brauchst du kein spezielles Setup, fang einfach an zu tippen und es wird zu einem Dokument
generiert.

## Deine Aufgabe

Ersetze den Text im Editor durch den Titel und den Autor unseres Toast-Papers:

```typst
= Die Aerodynamik von Toast: Warum er immer mit der gebutterten Seite nach unten landet
Dr. Eleanor Crumb

Das Phänomen, dass Toast mit der gebutterten Seite nach unten landet, wurde in
verschiedenen Kulturen, auf Küchenböden und in allen sozioökonomischen Schichten
beobachtet.
```

Das `=` erstellt eine Überschrift der obersten Ebene. Alles andere ist normaler Text. Das war's, du
hast gerade ein neues Forschungsgebiet der Frühstückswissenschaft ins Leben gerufen.

> [!NOTE] Ein Zeilenumbruch innerhalb eines Absatzes beginnt in Typst keinen neuen Absatz. Dafür
> brauchst du eine Leerzeile.
>
> Zum Beispiel ergibt dieser Quelltext:
>
> ```typst
> Toast landet
> mit der Butterseite nach unten.
> ```
>
> einen einzigen Absatz:
>
> **Toast landet mit der Butterseite nach unten.**
>
> Fügst du aber eine Leerzeile dazwischen ein:
>
> ```typst
> Toast landet
>
> mit der Butterseite nach unten.
> ```
>
> erhältst du zwei getrennte Absätze:
>
> **Toast landet**
>
> **mit der Butterseite nach unten.**
