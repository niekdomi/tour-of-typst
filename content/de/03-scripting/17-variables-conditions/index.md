# Variablen & Bedingungen

Dr. Crumbs Paper ist fast einreichungsbereit, aber der Laborleiter möchte es zuerst durchsehen. Wir
brauchen eine Möglichkeit, "ENTWURF" über alle Seiten zu stempeln, ohne es jedes Mal manuell
hinzuzufügen und zu entfernen.

Dazu definieren wir die folgenden Variablen und prüfen anschliessend mit dem `if`-Ausdruck, ob
`draft` auf `true` gesetzt ist oder nicht.

```typst
#let author = "Dr. Eleanor Crumb"
#let institution = "Institut für Frühstückswissenschaften"
#let draft = true

#set page(background: if draft {
  rotate(-45deg, text(80pt, fill: luma(180, 30%))[*ENTWURF*])
})
```

Ist `draft` `true`, erzeugt der Ausdruck den gedrehten Text; ohne `else`-Zweig liefert er `none`,
wenn `draft` `false` ist, also gar keinen Hintergrund. Da er am Parameter `background` hängt,
wiederholt sich das Wasserzeichen auf _jeder_ Seite.

> [!WARNING] Du kannst nicht `#if draft { set page(...) }` schreiben. Eine `set`-Regel innerhalb des
> Blocks gilt nur für diesen Block und erreicht das Dokument nie. Setze stattdessen den Parameter
> `background` auf den `if`-Ausdruck.

Variablen können jeden Typ enthalten; Zeichenketten, Zahlen, Wahrheitswerte, Arrays:

```typst
#let version = 3
#let keywords = ("toast", "schwerkraft", "butter", "aerodynamik")
```

Verwende sie im Text mit dem `#`-Präfix:

```typst
Verfasst von #author (#institution).
```

## Deine Aufgabe

Füge am Anfang des Dokuments Variablen hinzu für:

- `author`, `"Dr. Eleanor Crumb"`
- `institution`, `"Institut für Frühstückswissenschaften"`
- `date`, `"März 2026"`
- `draft`, `true`

Setze den Seiten-`background` auf ein diagonales "ENTWURF"-Wasserzeichen, das nur erscheint, wenn
`draft` `true` ist, indem du `if` als Wert für den Hintergrund verwendest (siehe Beispiel oben).
Ersetze den fest eingetragenen Autorennamen durch `#author`.
