# Hallo, Welt!

Jede Reise beginnt mit einem einzigen Schritt — oder in unserem Fall mit einer einzigen Zeile Markup.

Das einfachste Typst-Dokument ist reiner Text. Anders als bei LaTeX brauchst du keine Präambel oder
Boilerplate-Code. Fang einfach an zu schreiben.

## Markup-Grundlagen

Typst verwendet eine kleine Anzahl von Sonderzeichen für die häufigsten Formatierungsanforderungen:

| Syntax | Ergebnis |
|---|---|
| `*fett*` | **fett** |
| `_kursiv_` | *kursiv* |
| `= Überschrift` | Überschrift erster Ebene |
| `== Unterüberschrift` | Überschrift zweiter Ebene |

Alles, was nicht als Markup erkannt wird, wird als normaler Text behandelt — du kannst also
natürlich schreiben, ohne dir Gedanken zu machen, versehentlich Formatierungen auszulösen.

## Funktionen aufrufen

Typst verwendet `#`, um eingebaute Funktionen aufzurufen. So greifst du auf die volle Leistung des
Systems zu, ohne dein Dokument zu verlassen:

```typst
#text(fill: rgb("#e63946"))[Dieser Text ist rot.]
#underline[Dieser Text ist unterstrichen.]
```

Funktionen nehmen Argumente in runden Klammern und Inhalt in eckigen Klammern entgegen. Dieses
Muster begegnet dir überall in Typst.

## Ausprobieren

```typst
= Hallo, Welt!

Das ist mein erstes Typst-Dokument.

Ich kann *fetten*, _kursiven_ oder sogar
#text(fill: rgb("#e63946"))[roten] Text schreiben.
```

> **Tipp:** Das `=`-Zeichen erstellt eine Überschrift. Mehr `=`-Zeichen erzeugen tiefere
> Überschriftenebenen: `==`, `===` und so weiter.
