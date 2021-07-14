# Projekt Text-Adventure

Es soll ein Text-Adventure entwickelt werden.

Dieses soll im Rahmen des Zwischenprojekts nur grundlegende Funktionen bieten, kann aber für das Abschlussprojekt erweitert werden. Das kann etwa durch das Hochladen eines eigenen Adventures mittels JSON oder einem angemesseneren Datenformat, Visualisierungen der Gegner und NPCs, das Teilen von Spielständen, usw. möglich werden.

# Installation

**Hinweis:** Das Projekt muss von Teilnehmern des Zwischen- und Abschlussprojekts nicht selbst installiert werden. 
Stattdessen werden dafür URLs bereitgestellt, unter denen vorinstallierte Services ansprechbar sind.

## Vorbereitung

Bevor die Anwendung gestartet werden kann, muss sie noch entsprechend konfiguriert werden. Im Verzeichnis `app/` befindet sich eine Datei names `template.env`, welche ein Muster für die Konfiguration ist. Nach diesem Vorbild muss eine Datei namens `.env` erstellt werden.

Die bereits ausgefüllten Variablen sollten so belassen werden. Der Nutzer, die Datenbank und das Passwort müssen hingegen unbedingt ausgefüllt werden.
Dabei müssen `POSTGRES_PASSWORD` und `PGPASSWORD`, `POSTGRES_DB` und `PGDATABASE` und zuletzt `PGUSER` und `POSTGRES_USER` jeweils gleich sein.

Der Port, unter dem die Anwendung erreichbar ist, muss in der `docker-compose.yml` unter `nginx` > `ports` > `{Hier den gewünschten Port einfügen ohne Klammern}:443` zu dem gewünschten geändert werden.

Zuletzt müssen, um den Service auszuführen, noch Docker und docker-compose installiert sein.

Wenn die Anwendung nicht auf einem Hochschulserver gestartet werden soll, müssten noch die `nginx/nginx.conf`-Datei angepasst und die Zertifikate in `nginx/certs/` ausgetauscht/entfernt werden (Der Ordner sollte erhalten bleiben).

## Ausführung und Testen

Um den Service zu starten, muss im Wurzelverzeichnis des Projektes `text-adventure-service/` der Befehl `docker-compose up --build -d` auf Windows- bzw. `sudo docker-compose up --build -d` auf Linux-Systemen ausgeführt werden.

Sobald der Befehl fertig durchgelaufen ist, müssten die Services verfügbar sein. Zuerst sollte dafür geschaut werden, ob die Docker-Container laufen und die Ports korrekt exposed und gemappt werden. Dafür muss `docker ps` auf Windows- und `sudo docker ps` auf Linux-Systemen ausgeführt werden. Sofern die Services dort sichtbar sind, hat alles geklappt. Die Ports müssten denen aus der Konfiguration (`.env`, `docker-compose.yml`, `app/Dockerfile` und `nginx/nginx.conf`) entsprechen.

Der Service müsste nun per `curl https://webengineering.ins.hs-anhalt.de:{Hier den gewünschten Port einfügen ohne Klammern}/playthrough` die Liste aller Spiele (anfangs leer) liefern.

## Anforderungen/Features

Der Nutzer möchte ...

* ... seine Spieldaten (Name, Schwierigkeit) in einem Menü konfigurieren können.
* ... Spielstände ...
  * laden,
  * löschen,
  * und mit den zuletzt eingegebenen Spieldaten (Name, Schwierigkeit - Schwierigkeit kann im Zwischenprojekt nur 'easy' sein, lässt sich aber später dynamisch laden) neu erstellen können.
* ... im laufenden Spiel ...
  * ... den aktuellen Status (Spielerzustand, Geld, Text, der die Situation und Umgebung beschreibt) angezeigt bekommen
  * seine Optionen (und deren Erfolgswahrscheinlichkeit und ggf. Kosten) angezeigt bekommen,
  * eine Option wählen können,
  * die Konsequenzen seiner Handlungen im Nachhinein sehen können.
  * das Spiel zu einem Ende führen können (Endbildschirm/Option zur Rückkehr zum Hauptbildschirm o. Ä.)

Als Entwickler muss man für sinnvolle Tests..

* .. überprüfen, ob ein Spielzustand richtig dargestellt wird..
  * .. indem das Backend gemockt wird und Beispielwerte geladen werden,
  * und das Gerenderte mit einem Snapshot verglichen wird.
* .. überprüfen, ob das Startmenü richtig dargestellt wird..
  * .. indem eine Option ausgewählt und
  * das Backend gemockt wird und Beispielwerte geladen werden
  * und dann das Gerenderte mit einem Snapshot verglichen wird.
* .. überprüfen, ob ein Folgezustand richtig dargestellt wird..
  * .. indem das Gerenderte mit einem Snapshot verglichen wird.
* .. überprüfen, ob die Spiel-Enden (Sieg, Niederlage) richtig dargestellt werden..
  * .. indem das Backend gemockt wird und Beispielwerte geladen werden,
  * und das Gerenderte mit einem Snapshot verglichen wird.
* .. überprüfen, ob die Eingabemöglichkeit für Handlungsoptionen (Button zur Bestätigung oder Textfeld mit Validierung bspw.)..
  * .. bei Betätigung eine Netzwerkanfrage an das gemockte Backend schickt.
* .. überprüfen, ob mich der Endbildschirm zum Startbildschirm zurückbringt.
* .. überprüfen, ob die Eingabemöglichkeiten für die Konfiguration (Textfeld für Spielernamen, Textfeld mit Validierung oder Select-Element für Schwierigkeit bspw.) sich bearbeiten lassen und einen Einfluss auf das Neuerstellen eines Spielstands haben
* und in dem Zusammenhang überprüfen, ob sich ein neuer Spielstand erstellen lässt
  * .. indem man diese bspw. per User-Events ausfüllt
  * und dann entsprechend einen neuen Spielstand erstellt
* .. überprüfen, ob die Eingabeelemente zum Löschen eines Spielstandes (Textfeld für Id oder Liste mit Spielständen sowie Button zur Bestätigung bspw.) funktionieren..
  * .. indem man ggf. die Id etwa per User-Events ausfüllt,
  * das Backend mockt und auf Anfragen lauscht,
  * dann die Löschbestätigung betätigt und auf Anfragen überprüft
  * und zuletzt UI-Aktualisierungen prüft (Element ist aus Liste verschwunden bspw.).
* .. überprüfen, ob die Eingabeelemente zum Laden eines Spielstandes (Textfeld für Id oder Liste mit Spielständen sowie Button zur Bestätigung bspw.) funktionieren..
  * .. indem man ggf. die Id etwa per User-Events ausfüllt,
  * das Backend mockt und auf Anfragen lauscht,
  * dann die Ladebestätigung betätigt und auf Anfragen überprüft
  * und zuletzt UI-Aktualisierungen prüft (Zu Spielansicht gewechselt bspw.).

## API

Allgemein wird sich an die REST-Prinzipien gehalten. Jegliche Daten werden als JSON übermittelt. Die gezeigten JSON-Daten sollen nur exemplarisch die Struktur zeigen und sind bzgl. der Inhalte nicht verbindlich.

In der folgenden Dokumentation ist `${Wort}` als Pfadvariable zu verstehen, also als ein Platzhalter, der bei der tatsächlichen Anfrage durch einen validen Wert ausgetauscht werden muss.

### Neues Spiel anlegen

Anfrage:

POST: `/playthrough/`

Body:

```json
{
    "difficulty": "easy",
    "playerName": "Namenloser Held"
}
```

Antwort:

Header:

```
HTTP/1.1 201 CREATED
...
Location: /playthroughs/${playthroughId}
...
```

Body:

```json
{
    "id": "playthroughId",
    "difficulty": "easy",
    "isCompleted": false,
    "player": {
        "status": "healthy",
        "money": 0,
        "name": "Namenloser Held",
        "options": [
            {
                "action": "Talk to vendor",
                "monetaryCost": 0,
                "chanceOfSuccess": 1
            },
            {
                "action": "Attack vendor",
                "monetaryCost": 0,
                "chanceOfSuccess": 0.5
            },
            {
                "action": "Pickpocket vendor",
                "monetaryCost": 0,
                "chanceOfSuccess": 0.2
            },
            {
                "action": "Run",
                "monetaryCost": 0,
                "chanceOfSuccess": 1
            }
        ]
    },
    "currentSituation": "You wake up in a shop you're not familiar with. Behind a counter, there's an old vendor inspecting you with a raised eyebrow.",
}
```

### Alle Spielstände abfragen

GET: `/playthrough/`

Antwort:

Body:

```json
[
    {
        // Playthrough 1
    },
    {
        // Playthrough 2
    }
    // ...
]
```

### Spielstand löschen

DELETE: `/playthrough/${playthroughId}`

## Bestimmten Spielstand abfragen

GET: `/playthrough/${playthroughId}`

Antwort:

Body:

```json
{
    "id": "playthroughId",
    "difficulty": "easy",
    "isCompleted": false,
    "player": {
        "status": "healthy",
        "money": 0,
        "name": "Namenloser Held",
        "options": [
            {
                "action": "Talk to vendor",
                "monetaryCost": 0,
                "chanceOfSuccess": 1
            },
            {
                "action": "Attack vendor",
                "monetaryCost": 0,
                "chanceOfSuccess": 0.5
            },
            {
                "action": "Pickpocket vendor",
                "monetaryCost": 0,
                "chanceOfSuccess": 0.2
            },
            {
                "action": "Run",
                "monetaryCost": 0,
                "chanceOfSuccess": 1
            }
        ]
    },
    "currentSituation": "You wake up in a shop you're not familiar with. Behind a counter, there's an old vendor inspecting you with a raised eyebrow.",
}
```

### Eine Handlung ausführen

POST: `/playthrough/${playthroughId}/action/`

Anfrage:

Body:

```json
{
    "action": "Talk to vendor"
}
```

Antwort:

Body:

```json
{
    "id": "playthroughId",
    "difficulty": "easy",
    "isCompleted": false, // Can change
    "player": {
        "status": "new status",
        "money": 0, // Can change
        "name": "Namenloser Held",
        "options": [
            // Neue Handlungsoptionen
        ]
    },
    "currentSituation": "New situation",
}
```
