# Beschriftungen

Unser Paper hat eine Abbildung, eine Tabelle und einige Gleichungen, aber im Moment zeigen sie
gegenseitig mit dem Finger auf fehlende Daten. Der Abschnitt Ergebnisse sagt "siehe Tabelle", ohne
irgendwo konkret hinzuzeigen. Bevor wir Querverweise erstellen können, müssen wir jedem Element
ein Namensschild geben.

Beschriftungen werden mit `<spitzen-klammern>` direkt nach einem Element hinzugefügt:

```typst
#figure(
  table(...),
  caption: [Versuchsergebnisse.],
) <tab-ergebnisse>
```

```typst
$ omega = (g dot t) / r $ <gl-omega>
```

Gleichungen müssen nummeriert werden, bevor sie beschriftet werden können. Füge eine Set-Regel
hinzu, um das zu aktivieren:

```typst
#set math.equation(numbering: "(1)")
```

Beschriftungen sind unsichtbar – sie erscheinen nicht in der Ausgabe. Sie markieren das Element
nur stillschweigend, damit du es später referenzieren kannst. Du kannst auch Überschriften
beschriften:

```typst
== Methoden <methoden>
```

## Deine Aufgabe

Gehe durch das Dokument und gib den wichtigsten Elementen Namensschilder:

- Die Abbildung: `<abb-rotation>`
- Die Ergebnistabelle: `<tab-ergebnisse>`
- Die Winkelgeschwindigkeitsgleichung: `<gl-omega>`
- Die Überschrift Methoden: `<methoden>`

In der Ausgabe wird sich noch nichts ändern, aber im nächsten Kapitel werden diese Beschriftungen
zum Leben erweckt.

> [!NOTE] Beschriftungsnamen können Buchstaben, Zahlen und Bindestriche enthalten. Wähle
> beschreibende Namen – du wirst sie beim Erstellen von Verweisen eintippen.
