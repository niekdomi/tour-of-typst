# Kopf- & Fusszeilen

Ein echter Zeitschriftenartikel flüstert seinen Titel auf jeder Seite und nummeriert sie
höflich unten. Ohne diese ist unser Paper nur eine lockere Seitensammlung, die darauf wartet,
von einem unachtsamen Gutachter fallen gelassen und durcheinandergebracht zu werden – genau wie
unser Toast. Wir können nicht zulassen, dass unsere Forschung jetzt auseinanderfällt!

```typst
#set page(
  header: [_Die Aerodynamik von Toast_],
  numbering: "1",
)
```

Der Parameter `numbering` steuert die Seitenzahlen. Gängige Muster:

| Muster    | Ergebnis     |
| --------- | ------------ |
| `"1"`     | 1, 2, 3      |
| `"1 / 1"` | 1 / 5, 2 / 5 |
| `"i"`     | i, ii, iii   |

Du kannst die Kopfzeile mit `align` ausrichten:

```typst
#set page(
  header: align(right)[_Die Aerodynamik von Toast_],
)
```

## Deine Aufgabe

Aktualisiere die `#set page(...)`-Regel, um hinzuzufügen:

- Eine rechtsbündig ausgerichtete kursive Kopfzeile mit dem Paper-Titel (damit sie nie vergessen,
  was sie lesen)
- Seitennummerierung mit dem Muster `"1"` (damit wir die Seiten wieder zusammensetzen können,
  wenn Gutachter 2 sie fallen lässt)

> [!TIP] Du kannst mehrere Einstellungen in einem einzigen `#set page(...)`-Aufruf kombinieren –
> füge sie einfach als kommagetrennte Argumente hinzu.
