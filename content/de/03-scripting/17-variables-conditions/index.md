# Variablen & Bedingungen

Dr. Crumbs Paper ist fast einreichungsbereit, aber der Laborleiter möchte es zuerst
durchsehen. Wir brauchen eine Möglichkeit, "ENTWURF" oben zu stempeln, ohne es jedes Mal
manuell hinzuzufügen und zu entfernen. Hier kommen Variablen und Bedingungen ins Spiel.

```typst
#let autor = "Dr. Eleanor Crumb"
#let institution = "Institut für Frühstückswissenschaften"
#let entwurf = true

#if entwurf {
  align(center, text(red, size: 20pt)[*ENTWURF*])
}
```

Variablen können jeden Typ enthalten – Zeichenketten, Zahlen, Wahrheitswerte, Arrays:

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

Verwende `#if entwurf`, um ein rotes "ENTWURF"-Wasserzeichen oben anzuzeigen. Ersetze den
fest eingetragenen Autorennamen durch `#autor`. Stelle dann `entwurf` auf `false` und beobachte,
wie das Wasserzeichen verschwindet – bereit zur Einreichung.
