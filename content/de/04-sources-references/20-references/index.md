# Querverweise

Jetzt passiert die eigentliche Magie. Diese unsichtbaren Beschriftungen, die wir hinzugefügt
haben? Sie werden mit einem einzigen `@` zu klickbaren, automatisch nummerierten Querverweisen:

```typst
Wie in @abb-rotation gezeigt, rotiert der Toast etwa 180°.
```

Typst löst den Verweis automatisch auf – es fügt die richtige Abbildungs-/Tabellen-/Gleichungsnummer
ein und erstellt sogar einen klickbaren Link. Keine manuelle Nummerierung, keine "Siehe Abbildung ??"
Katastrophen.

```typst
Die Winkelgeschwindigkeit ist gegeben durch @gl-omega.
Siehe @tab-ergebnisse für den vollständigen Datensatz.
Der Versuchsaufbau wird in @methoden beschrieben.
```

Wenn du den angezeigten Text anpassen möchtest, verwende ein Supplement:

```typst
Wie in @abb-rotation[Abbildung] gezeigt
```

## Deine Aufgabe

Unser Paper sagt im Moment vage Dinge wie "wie oben" und "wie beim Kaffee besprochen". Die
Gutachter werden das schneller ablehnen, als Toast den Boden trifft. Korrigieren wir das mit
richtigen Querverweisen:

- In der Einleitung: "Wie in @abb-rotation gezeigt..."
- In den Ergebnissen: "Mithilfe von @gl-omega..."
- In der Schlussfolgerung: "Die Daten in @tab-ergebnisse bestätigen..."
