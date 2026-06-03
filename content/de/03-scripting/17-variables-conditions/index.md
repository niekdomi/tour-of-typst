# Variablen & Bedingungen

Dr. Crumbs Paper ist fast einreichungsbereit, aber der Laborleiter möchte es zuerst durchsehen. Wir
brauchen eine Möglichkeit, "ENTWURF" über alle Seiten zu stempeln, ohne es jedes Mal manuell
hinzuzufügen und zu entfernen.

Dazu definieren wir die folgenden Variablen und prüfen anschliessend mit dem `if`-Ausdruck, ob
`entwurf` auf `true` gesetzt ist oder nicht.

```typst
#let autor = "Dr. Eleanor Crumb"
#let institution = "Institut für Frühstückswissenschaften"
#let entwurf = true

#set page(background: if entwurf {
  rotate(-45deg, text(80pt, fill: luma(180, 30%))[*ENTWURF*])
})
```

Ist `entwurf` `true`, erzeugt der Ausdruck den gedrehten Text; ohne `else`-Zweig liefert er `none`,
wenn `entwurf` `false` ist, also gar keinen Hintergrund. Da er am Parameter `background` hängt,
wiederholt sich das Wasserzeichen auf _jeder_ Seite.

> [!WARNING] Du kannst nicht `#if entwurf { set page(...) }` schreiben. Eine `set`-Regel innerhalb
> des Blocks gilt nur für diesen Block und erreicht das Dokument nie. Setze stattdessen den
> Parameter `background` auf den `if`-Ausdruck.

Variablen können jeden Typ enthalten; Zeichenketten, Zahlen, Wahrheitswerte, Arrays:

```typst
#let version = 3
#let schlüsselwörter = ("toast", "schwerkraft", "butter", "aerodynamik")
```

Verwende sie im Text mit dem `#`-Präfix:

```typst
Verfasst von #autor (#institution).
```

## Deine Aufgabe

Füge am Anfang des Dokuments Variablen hinzu für:

- `autor`, `"Dr. Eleanor Crumb"`
- `institution`, `"Institut für Frühstückswissenschaften"`
- `datum`, `"März 2026"`
- `entwurf`, `true`

Setze den Seiten-`background` auf ein diagonales "ENTWURF"-Wasserzeichen, das nur erscheint, wenn
`entwurf` `true` ist, indem du `if` als Wert für den Hintergrund verwendest (siehe Beispiel oben).
Ersetze den fest eingetragenen Autorennamen durch `#autor`.
