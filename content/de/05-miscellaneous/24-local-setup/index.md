# Lokale Einrichtung

Du hast die gesamte Tour im Browser abgeschlossen. Für echte Projekte wirst du Typst jedoch auf
deinem eigenen Rechner haben wollen. Hier erfährst du, wie du loslegen kannst.

### Typst installieren

Typst ist eine einzelne Binärdatei ohne Abhängigkeiten. Unter Linux ist es wahrscheinlich im
Paketmanager deiner Distribution verfügbar. Für alle Plattformen findest du es auf der offiziellen
Downloadseite:

[Typst herunterladen](https://typst.app/open-source/#download)

### Editor einrichten

Für das beste Erlebnis installiere die
[Tinymist](https://marketplace.visualstudio.com/items?itemName=myriad-dreamin.tinymist)-Erweiterung
für deinen Editor. Sie bietet Syntaxhervorhebung, Autovervollständigung, Live-Vorschau und
Fehlerdiagnose.

Tinymist unterstützt folgende Editoren:

- VS Code
- NeoVim
- Helix
- Zed
- Sublime Text
- Emacs

Siehe die [Tinymist-Dokumentation](https://myriad-dreamin.github.io/tinymist/frontend/main.html) für
Einrichtungsanweisungen zu jedem Editor.

### Dein Dokument kompilieren

Typst hat zwei Modi zum Kompilieren von Dokumenten im Terminal:

- **`typst compile paper.typ`** kompiliert das Dokument einmalig und erstellt `paper.pdf`.
- **`typst watch paper.typ`** beobachtet Änderungen und kompiliert bei jedem Speichern neu.

### Projektstruktur

Für kleine Dokumente reicht eine einzige `.typ`-Datei. Für grössere Projekte teile deinen Code auf:

```
mein-paper/
  main.typ          # dein Inhalt
  vorlage.typ       # Gestaltung
  refs.yaml         # Literaturverzeichnis
  abbildungen/
    diagramm.png
```

Importiere deine Vorlage genau wie im Kapitel über Vorlagen:

```typst
#import "vorlage.typ": paper
#show: paper.with(title: "...", author: "...")
```

Das war's. Du bist bereit, Typst-Dokumente selbständig zu schreiben. Viel Spass beim Setzen!
