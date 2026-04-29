# Literaturverzeichnis

Kein akademisches Paper ist vollständig ohne auf den Schultern von Giganten zu stehen, oder sie
zumindest zu zitieren, damit sie deine Publikation nicht blockieren. Dr. Crumbs Arbeit baut auf
Jahrzehnten kontroverser Toast-Fall-Forschung auf, und wir müssen dem Komitee zeigen, dass wir
unsere Hausaufgaben gemacht haben. Typst unterstützt BibLaTex (`.bib`)-Dateien oder das eigene
[Hayagriva](https://github.com/typst/hayagriva/blob/main/docs/file-format.md) (`.yaml` oder
`.yml`)-Format als natives Literaturverzeichnisformat. Wir verwenden Hayagriva für diese Tour, aber
der Prozess ist ähnlich für BibLaTex.

Zuerst teile Typst mit, wo die Literaturdatei zu finden ist:

```typst
#bibliography("refs.yaml")
```

Dann zitiere Quellen in deinem Text mit `@`:

```typst
Frühere Arbeiten von @murphy2003 demonstrierten das Butter-unten-Phänomen.
Das physikalische Modell folgt @matthews1995.
```

> [!IMPORTANT] In dieser Tour ist die Literaturdatei bereits für dich bereitgestellt. In deinen
> eigenen Projekten erstellst du eine `.yaml`-Datei neben deiner `.typ`-Datei.

Ein Hayagriva-Eintrag sieht so aus:

```yaml
murphy2003:
  type: Article
  author: Murphy, Robert
  title: Tumbling Toast, Murphy's Law and the Fundamental Constants
  date: 2003
```

## Deine Aufgabe

- Füge `#bibliography("refs.yaml")` ganz am Ende des Dokuments hinzu
- Zitiere `@murphy2003` in der Einleitung, wo wir das Phänomen besprechen
- Zitiere `@matthews1995` im Abschnitt Methoden, wo wir das physikalische Modell beschreiben

Der Literaturverzeichnis-Abschnitt erscheint automatisch mit allen zitierten Werken. Unser
Toast-Paper ist jetzt ordentlich akademisch.

> [!NOTE] Typst unterstützt mehrere Zitierstile. Ändere ihn mit `#set bibliography(style: "ieee")`
> oder probiere `"apa"`, `"chicago-author-date"` und andere.
