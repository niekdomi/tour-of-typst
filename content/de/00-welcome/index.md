# Willkommen zur Tour durch Typst

Willkommen zur **Tour durch Typst**! Dieser interaktive Leitfaden führt dich durch alles, was du
brauchst, um schöne Dokumente mit Typst zu erstellen — von der einfachen Textformatierung bis hin zu
Skripting, Layouts und Literaturverzeichnissen.

Typst ist ein neues markup-basiertes Schriftsatzsystem, das so leistungsfähig wie LaTeX sein soll,
aber wesentlich einfacher zu erlernen und zu verwenden ist. Egal ob du eine wissenschaftliche
Arbeit, ein Buch oder einen einfachen Brief schreiben möchtest — Typst hat alles, was du brauchst.

## Wie diese Tour funktioniert

Jedes Kapitel stellt ein neues Konzept vor. Auf der rechten Seite findest du einen Editor, in dem du
Dinge ausprobieren kannst, sowie eine Live-Vorschau, die sich beim Tippen aktualisiert.

- Lies die Erklärung auf der linken Seite
- Experimentiere mit dem Code auf der rechten Seite
- Gehe zum nächsten Kapitel, wenn du bereit bist

## Dein erstes Dokument

Ein Typst-Dokument ist einfacher Text mit Markup. Es gibt keine Präambel, keinen Boilerplate-Code —
fang einfach an zu schreiben.

```typst
// Dein erstes Typst-Dokument
#set text(font: "New Computer Modern")

= Willkommen bei Typst

Das ist eine *fette* Aussage und das ist _kursiv_.

Du kannst auch #text(fill: blue)[farbigen Text] schreiben.
```

> **Tipp:** Du kannst den Code auf der rechten Seite jederzeit bearbeiten. Änderungen werden sofort
> in der Vorschau angezeigt.
