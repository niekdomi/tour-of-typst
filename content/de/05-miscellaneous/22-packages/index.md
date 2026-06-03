# Pakete & Importe

Erinnerst du dich an die `#let note()`-Funktion, die wir von Hand gebaut haben, um unsere ethischen
Hinweise zu verwalten? Es stellt sich heraus, dass jemand in der Typst-Community bereits eine viel
schönere Version erstellt hat, mit Farben, Titeln und Schlagschatten. Das ist die Schönheit von
Paketen: Du musst nicht jedes Rad neu erfinden (oder in unserem Fall jede gebutterte Hinweisbox).

Typst hat ein wachsendes Ökosystem von Community-Paketen. Du kannst sie direkt importieren. Keine
Installation, kein Paketmanager, kein `node_modules`-Ordner in der Grösse eines kleinen Landes:

```typst
#import "@preview/cetz:0.4.2": canvas, draw
```

Im [Typst Universe](https://typst.app/universe/) findest du, was es sonst noch alles gibt.

Einige beliebte Pakete:

| Paket       | Zweck                          |
| ----------- | ------------------------------ |
| `cetz`      | Zeichnungen und Diagramme      |
| `touying`   | Präsentationsfolien erstellen  |
| `fletcher`  | Diagramme mit Pfeilen zeichnen |
| `alchemist` | Strukturformeln zeichnen       |

Du kannst auch aus deinen eigenen Dateien importieren:

```typst
#import "utils.typ": note, warning
```

## Deine Aufgabe

Importiere das `showybox`-Paket und verwende es, um unsere einfachen `note()`-Boxen aufzuwerten:

```typst
#import "@preview/showybox:2.0.4": showybox

#showybox(
  title: "Hinweis",
  [Kein Toast wurde in dieser Studie unnötig beschädigt.]
)
```

> [!WARNING] Paketversionen sind fest eingetragen (z.B. `0.4.2`). Das stellt sicher, dass dein
> Dokument immer gleich kompiliert wird, auch wenn das Paket später aktualisiert wird.
> Reproduzierbarkeit ist wichtig, in der Wissenschaft _und_ beim Schriftsatz.
