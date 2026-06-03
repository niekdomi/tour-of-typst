# Lokale Einrichtung

Du hast die gesamte Tour im Browser abgeschlossen. Für echte Projekte wirst du Typst jedoch auf
deinem eigenen Rechner haben wollen. Hier erfährst du, wie du loslegen kannst.

### Typst installieren

Typst ist eine einzelne Binärdatei ohne Abhängigkeiten. Unter Linux ist es wahrscheinlich im
Paketmanager deiner Distribution verfügbar. Für alle Plattformen findest du es auf der offiziellen
Downloadseite: [Typst herunterladen](https://typst.app/open-source/#download)

### Editor einrichten

Für das beste Erlebnis installiere die
[Tinymist](https://myriad-dreamin.github.io/tinymist/frontend/main.html)-Erweiterung für deinen
Editor. Sie bietet Syntaxhervorhebung, Autovervollständigung, Live-Vorschau und Fehlerdiagnose.

### Dein Dokument kompilieren

Typst hat zwei Modi zum Kompilieren von Dokumenten im Terminal:

- **`typst compile paper.typ`** kompiliert das Dokument einmalig und erstellt `paper.pdf`.
- **`typst watch paper.typ`** beobachtet Änderungen und kompiliert bei jedem Speichern neu.

### Lokale Schriftarten verwenden

In der Browser-Tour warst du auf die vier mitgelieferten Schriftarten beschränkt. Eine lokale
Typst-Installation kann zusätzlich jede auf deinem Betriebssystem installierte Schriftart verwenden,
sowie beliebige Schriftdateien, auf die du sie hinweist.

Um zu sehen, was Typst auf deinem Rechner findet, führe aus:

```
typst fonts
```

Das listet jede verfügbare Schriftfamilie auf, die mitgelieferten und deine Systemschriften
zusammen. Jeder Name aus dieser Liste kann direkt in eine `#set text(font: "...")`-Regel eingesetzt
werden.

Um Schriftdateien zu verwenden, die nicht systemweit installiert sind, lege sie in deinem Projekt ab
und sage Typst mit `--font-path`, wo es suchen soll:

```
typst compile --font-path fonts paper.typ
```

Für Dokumente, die auf jedem Rechner gleich kompilieren sollen, lege die Schriften zum Projekt und
füge `--ignore-system-fonts` hinzu, damit nur dein `--font-path` und die mitgelieferten Schriften
verwendet werden:

```
typst compile --font-path fonts --ignore-system-fonts paper.typ
```

Das stellt sicher, dass dein Mitarbeiter (oder ein CI-Server) dein Paper mit genau den Schriften
rendert, die du vorgesehen hast, statt stillschweigend auf irgendwelche zurückzufallen, die zufällig
installiert sind.

### Projektstruktur

Für kleine Dokumente reicht eine einzige `.typ`-Datei. Für grössere Projekte teile deinen Code auf:

```
mein-paper/
  .fonts/           # mitgelieferte Schriften
    Roboto-Regular.ttf
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

Das war's. Du bist bereit, Typst-Dokumente selbständig zu schreiben. Viel Spass mit Typst!
