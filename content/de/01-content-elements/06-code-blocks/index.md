## Code-Blöcke

Unsere Forscher, des Butterabschabens vom Boden überdrüssig, schrieben eine Python-Simulation,
um das Toast-Modell virtuell zu verifizieren. Lasst uns diese ins Paper aufnehmen, um zu beweisen,
dass wir auch Computer verstehen. In Typst verwenden wir **Rohblöcke**, um Computercode von
normalem Text zu unterscheiden.

### Inline-Code

Verwende einfache Backticks (`` ` ``) für kurze Ausschnitte, wie Funktionsnamen oder Variablen,
die innerhalb eines Satzes erscheinen. Dadurch wird eine nichtproportionale Schrift angewendet,
damit sie hervorstechen.

```typst
Die Funktion `simulate_drop()` berechnet den endgültigen Rotationswinkel.
```

### Block-Code

Für vollständige Skripte verwende dreifache Backticks (` ``` `). Das erstellt einen separaten,
eingerückten Container für deinen Code.

> [!TIP] Wenn du den Namen der Programmiersprache (z.B. `python` oder `rust`) direkt nach den
> ersten drei Backticks eingibst, hebt Typst den Code automatisch syntaktisch hervor, um ihn
> leichter lesbar zu machen.
>
> ````typst
> ```python
> def simulate_drop(h, m):
>     return (9.81 * h) / m
> ```
> ````

### Die `raw`-Funktion

Für fortgeschrittene Nutzer bietet Typst die Funktion `#raw()`. Diese ist nützlich, wenn du
genauere Kontrolle über die Gestaltung benötigst, ohne Backticks zu verwenden.

```typst
#raw("print('Simulation abgeschlossen')", lang: "python")
```

Wir werden Funktionen in einem späteren Kapitel besprechen, aber für jetzt reicht es zu wissen,
dass `raw` das Einfügen von Code ohne dreifache Backticks ermöglicht.

## Deine Aufgabe

Füge einen Code-Block zum Abschnitt **Methoden** hinzu (nach den Listen), der die Python-Simulation
zeigt, die zur Verifizierung des physikalischen Modells verwendet wurde. Etwa so:

````typst
```python
import numpy as np

def simulate_toast_drop(height=0.75, mass=0.028):
    g = 9.81
    t_fall = np.sqrt(2 * height / g)
    omega = (g * t_fall) / (0.05)
    angle = omega * t_fall
    return np.degrees(angle) % 360
```
````
