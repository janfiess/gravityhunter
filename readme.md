# gravityhunter

Eine Anleitung zur Formatierung von Github Wikis gibt es [hier](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

Wie man Fußnoten für Quellen o. Ä. ergänzt, erfährt ihr [hier](http://stackoverflow.com/a/32119820/2426386).

# Persistenz

(wird ausformuliert...)
Daten verfügbar über einen Programmneustart hinaus.
-> JSON! LitJSON vs. JSON Utility ab V5.3. Vergleich und Gegenüberstellung nach [diesem Post](http://jacksondunstan.com/articles/3294).
[Dieser Post](http://forgeunity.com/t/unity-5-3-introduces-json-serialization-out-of-the-box/71) rät von LitJSON ab.
JSON Utility ist in Unity 5.3 [brandneu](http://blogs.unity3d.com/2015/12/08/unity-5-3-all-new-features-and-more-platforms/).
Im Folgenden wird die Vorgehensweise beim Lesen bzw. beim Schreiben von Datenobjekten in JSON-Dateien, insbesondere Arrays, innerhalb Unity3D dokumentiert, sowohl mit der LitJson-Library als auch mit der neuen nativen JSON Utility in Unity3D.

### JSON-Dateien in Unity schreiben
#### Datenobjekten zu JSON-formatierten Text konvertieren

Zur Erklärung der Vorgehensweise wird im Folgenden dieser String generiert, zuerst mit LitJson, dann mit JsonUtility:
```
{"name":"Fabi","level":4711,"tags":["Beginner","Fast"]}
```
Es handelt sich um ein Objekt, das drei Attribute enthält; von den Typen string, int und int[]. In einem späteren Beispiel wird gezeigt, wie auch verschachtelte Objekte in Arrays gespeichert werden und in einen JSON-formatierten Text umgewandelt werden können.

##### JsonUtility
Zunächst muss eine Klasse erstellt werden, die die Attribute der späteren .json-Datei enthält. Sie muss mit dem [Serializable] Flag versehen werden. Ist ein Objekt serialisierbar, können dessen Klasseninstanzen, die möglicherweise sehr abstrakt sind, in ein binäres Objekt oder - wie in unserem Fall - in einen gut lesbaren Datentext in beispielsweise JSON- oder XML-Formatierung umgewandelt werden. <sup id="a2">[2](#f2)</sup>

```
using UnityEngine;
using System.Collections;
using System;

[Serializable]
public class ObjectData {
	public string name;
	public int level;
	public string [] tags;
}
```

Diese Klasse wird in der Hauptklasse instanziiert und die Attribute mit Daten gefüllt. Danach wird das generierte Object mit ```JsonUtility.ToString()```in einen JSON-formatierten Text umgewandelt.

```
using UnityEngine;
using System;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;
using System.Collections.Generic;

public class JSONio01 : MonoBehaviour {
	public ObjectData myObject = new ObjectData();

	void Start () {
		myObject.name = "Fabi";
		myObject.level = 4711;
		List<string> tags =new List<string>();
		tags.Add ("Beginner");
		tags.Add ("Fast");
		myObject.tags = tags.ToArray();

		string jsonString = JsonUtility.ToJson(myObject);
		Debug.Log (jsonString);
	}
}
```
##### LitJson

Auch unter der Verwendung der Bibliothek LitJson muss eine Klasse instanziiert werden und die Instanz mit Werten gefüllt werden:

```
public class ObjectData_Lit{
	public string name;
	public int level;
	public string [] tags;
	public ObjectData_Lit(string name, int level, string[] tags){
		this.name = name;
		this.level = level;
		this.tags = tags;
	}
}
```

Die Instanz wird über den Konstruktur in folgender Hauptklasse gefüllt: 

```
using UnityEngine;
using LitJson;
using System.IO;
using System.Collections.Generic;


public class JSONio06 : MonoBehaviour {

	public ObjectData myObject = new ObjectData();

	void Start () {
		List<string> tags =new List<string>();
		tags.Add ("Beginner");
		tags.Add ("Fast");
		string [] tags_array = tags.ToArray();

		ObjectData_Lit mainObject = new ObjectData_Lit ("Fabi", 4711, tags_array);

		JsonData generatedJsonString = JsonMapper.ToJson (mainObject);
		Debug.Log (generatedJsonString);
		File.WriteAllText(Application.dataPath+"/Resources/CreateLitJson_basic.json", generatedJsonString.ToString());
	}
}
```

#### Sonderfall Arrays
##### LitJson
##### JsonUtility
## Text-Datei schreiben

### JSON-Dateien in Unity lesen
#### Text-Datei einlesen
#### JSON-formatierten Text zu Datenobjekten konvertieren
##### LitJson
##### JsonUtility




# Networking

Für moderne Computerspiele wird heute häufig ein Online-Server-Backend angelegt. Dafür sprechen einige Gründe, unter anderen:

- Multiplayer-Games werden ermöglicht: Die teilnehmenden Spieler (Clients) kommunizieren über einen Server und können gegeneinander spielen. Für das zeitgleiche Spielen ist GravityHunter allerdings nicht konzipiert. Jedoch können Highscores verglichen werden.
- Mit Player-Accounts können die Spieler das Spiel unterbrechen und an einem anderen Gerät oder auf einer Website weiterspielen
- Liegen die Config-Dateien, die die Levels spezifizieren, auf dem Server, können von den Entwicklern Updates (z. B. neue Spiellevels)  erstellt und via JSON-Packages an die Clients verteilt werden, ohne dass das Spiel neu installiert werden muss
- Datenbankabfragen sind im Vergleich zum reinen Parsen von JSON-formatierten Strings effizienter. Datenbanken im Allgemeinen einen Webserver. Zwar kann dies auch ein lokaler Webserver auf dem mobilen Endgerät sein (z. B. SQLite), jedoch zeichnet sich die Dokumentendatenbank MongoDB durch die Möglichkeit aus, mehrdimensionale, JSON-formatierte Objekte unverändert zu speichern. Bei relationalen Datenbanken (SQL) können mehrdimensionale 1:N-Beziehungen nur über zusätzliche Zwischentabellen realisiert werden.

GravityHunter verfügt über einen virtuellen Linux-Server (Debian 8.3), der über [gravityhunter.mi.hdm-stuttgart.de](http://gravityhunter.mi.hdm-stuttgart.de)erreichbar ist.
Er hat folgende Funktionen:

- Er hostet die Spieledatenbank
- Er hastet eine Website, auf der die Spieler Accounts anlegen können und auch das Game spielen können

### Einrichtung des Webservers

Der virtuelle Webserver verfügt das typische UNIX-übliche Dateisystem, wie es auch bei nicht-virtuellen UNIX-basierten Betriebssystemen wie Mac OS X und Linux-Distributionen der Fall ist. In dieses Verzeichnis können beliebige Serverkomponenten installiert werden. In unserem Fall werden Webserver-Tätigkeiten mit Node.js-Paketen bewerkstelligt. Node.js-Applikationen werden mit serverseitigem JavaScript konfiguriert und zeichnen durch ihre asynchrone Arbeitsweise im Singlethread sowie durch ihre Vielfalt an Möglichkeiten dank ihres stark modularen Aufbaus aus.
Folgender Abschnitt beschreibt die Installation eines einfachen Node.js-Programms auf den virtuellen Webserver via SSH:

#### Zugriff auf den virtuellen Webserver via SSH 
Zur Erstellung eines virtuellen Webservers benötigt der Server-Admin der HdM (Joachim Kuhn) einen öffentlichen RSA-Schlüssel. Mit PuTTy (Windows) bzw. Terminal (Mac OS X) kann ein Schlüsselpaar, bestehend aus dem bereits erwähnten öffentlichen Schlüssel und einem geheimen Schlüssel (gravityhunter), generiert werden. Eine sehr gute Anleitung für Mac OS X gibt es [hier](https://docs.joyent.com/public-cloud/getting-started/ssh-keys/generating-an-ssh-key-manually/manually-generating-your-ssh-key-in-mac-os-x). Der öffentliche Schlüssel wird standardgemäß hier abgelegt: /Users/Fabi/.ssh/id_rsa.pub. Mit Hilfe des privaten Schlüssels und mit einem offenen VPN-Tunnel kann von einem beliebigen Standort via SSH auf den virtuellen Server zugegriffen werden. Dazu muss im Terminal-Programm folgender Befehl eingegeben werden: ```ssh -l root -i .ssh/id_rsa gravityhunter.mi.hdm-stuttgart.de```

#### Installation von Node.js
Mit den Befehlen ```sudo apt-get install nodejs``` und ```sudo apt-get install npm```werden Node.js und der Node Package Manager installiert. Mit ```sudo ln -s /usr/bin/nodejs /usr/bin/node```wird ein Systemlink erstellt, sodass Node.js-Programme künftig mit dem Befehl ```node```gestartet werden können. 
Zu Testzwecken wird eine simple Node.js-Applikation erstellt, bestehend aus den Dateien ```app.js``` und ``test.html```.
Zunächst wird ein neues Verzeichnis erstellt: ```mkdir /root/helloworld```. Hier werden die beiden Dateien erstellt:
```
nano app.js
```
```
var express = require('express');
var app = express();

app.get('/', function(req, res){
  res.sendfile('test.html');
});
app.use(express.static(__dirname + '/public'));
app.listen(80, function(){
  console.log('listening on port 80');
});
```

```
nano test.html
```
```
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>GravityHunter</title>
</head>
<body>
<h>Hello World</h>
</body>
</html>
```
Die Aplikation ```àpp.js``` stellt ```test.html``` auf dem Standardport 80 bereit. Sie wird aus dem aktuellen Verzeichnis mit ```node app.js```gestartet.
Dann wird mit ```npm install --save express``` das benötigte Package expressjs in den Unterordner ```node-modules``` installiert.
Auf [gravityhunter.mi.hdm-stuttgart.de](http://gravityhunter.mi.hdm-stuttgart.de) erscheint der Text ```Hello World```.

Dieser Webserver ist allerdngs noch unbrauchbar, da er mit dem Ende der SSH-Verbindung ebenfalls beendet wird. Das liegt daran, dass dieser Prozess im Vordergrund des Linux-Betriebssystems läuft. Da der Webserver aber auch nach Ende der SSH-Verbindung funktionieren soll, muss für dieses Node.js-Programm ein Background-Prozess erstellt werden.

#### Ausführung des Node.js-Webservers im Hintergrund mit systemd

Mit dem Linux-Programm systemd können beendete Programme automatisch neu gestartet werden. 
Das im vorigen Schritt geöffnete Programm muss geöffnet bleiben! Die Installation von systemd erfolgt mit [folgenden Befehlen](https://wiki.debian.org/systemd):
```
apt-get install systemd
init=/bin/systemd
apt-get install systemd-sysv
```
Um ```/root/helloworld/app.js```mit systemd zu verbinden, muss mit ```cd /etc/systemd/system``` in dieses Verzeichnis gewechselt werden und mit ```nano nodeserver.service```eine Servicedatei hierfür erstellt.
```
[Unit]
Description=Node.js Example Server

[Service]
WorkingDirectory=/root/helloworld
ExecStart=/usr/bin/node app.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nodeserver
#User=gravityhunter
#Group=gravityhunter
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Bei ```ExexStart``` muss der genaue Ort von Node.js angegeben werden, der mit ```which node```ermittelt werden kann; hier: ```/usr/bin/node```. Dann folgt die auszuführende Datei ```app.js```.
Bei ```WorkingDirectory```muss der das Verzeichnis angegeben werden, in dem ```app.js```liegt. Wird das Arbeitsverzeichnis nicht angegeben werden relative Pfade in der ```app.js```nicht funktionieren, somit auch nicht die Datei ```test.html```.
Dieser Service wird mit dem Befehl ```systemctl enable nodeserver.service```aktiviert und mit ```systemctl start nodeserver.service``` gestartet. Ob die Applikation läuft, kann mit ```systemctl status nodeserver.service```überprüft werden. Logs der Applikation können mit ```journalctl -u nodeserver```eingesehen werden.
Nun kann die SSH-Verbindung getrennt werden. Dann wird ```app.js```neu gestartet.
Wenn Änderungen am der Webserver-Applikation vorgenommen werden sollen, muss im Verzeichnis ```/etc/systemd/system```mit dem Befehl ```systemctl stop nodeserver.service```der Prozess zunächst beendet werden.
Hilfreich waren die Posts [1](http://www.axllent.org/docs/view/nodejs-service-with-systemd/) und [2](http://blog.carbonfive.com/2014/06/02/node-js-in-production/).

#### Dateien auf den Server kopieren

Entwickelt wird der Spieleserver auf einem lokalen Server. Die finalen Dateien werden über SSH an den virtuellen Server gesendet, unter Verwendung des Konsolenprogramms scp.

Während die Verbindung zum Server aufrecht ist, muss ein weiteres Terminalfenster geöffnet werden. Hier soll allerdings nicht zum Srver geroutet werden. Der Cursor wird in das Verzeichnis des lokalen Rechners gesetzt, in dem die zu kopierende Datei liegt, z. B. ```cd /Users/Fabi/Desktop```. Die zu kopierende Beispieldatei heißt ```trashlog.txt```. Das Zielverzeichnis des virtuellen Servers lautet ```/root```. Der Kopiervorgang wird mit folgendem Befehl laut [dieser Anleitung](http://www.howtogeek.com/66776/how-to-remotely-copy-files-over-ssh-without-entering-your-password/) ausgeführt:
```
scp /Users/Fabi/Desktop/trashlog.txt root@gravityhunter.mi.hdm-stuttgart.de:/root
```
Gesamte Verzeichnisse werden mit dem flag ```-r```kopiert:
```
scp -r /Users/Fabi/Desktop/sampledirectory root@gravityhunter.mi.hdm-stuttgart.de:/root
```
Der Kopiervorgang von der virtuellen Maschine zur lokalen Maschine funktioniert ähnlich:
```
scp root@gravityhunter.mi.hdm-stuttgart.de:/root/trashlog.txt /Users/Fabi/Desktop
```




Fußnote gefällig... <sup id="a1">[1](#f1)</sup>



# Quellen

<b id="f1">1</b> Footnote content here. [↩](#a1)

<b id="f2">1</b> [Florian Rappl - C# Programmierung](https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=14&ved=0ahUKEwiSzqXX2ovLAhVBDQ8KHZJQADE4ChAWCCswAw&url=http%3A%2F%2Fwww.florian-rappl.de%2Fdownload%2F91%2Fvorlesungsfolien&usg=AFQjCNGupMqoFPjuUJ_BGKwvYXK6fefS6Q&sig2=9INGqsabSvWs6RsLqOhAvA) [↩](#a2) 
