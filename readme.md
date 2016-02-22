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
``

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

Fußnote gefällig... <sup id="a1">[1](#f1)</sup>



# Quellen

<b id="f1">1</b> Footnote content here. [↩](#a1)

<b id="f2">1</b> [Florian Rappl - C# Programmierung](https://www.google.de/url?sa=t&rct=j&q=&esrc=s&source=web&cd=14&ved=0ahUKEwiSzqXX2ovLAhVBDQ8KHZJQADE4ChAWCCswAw&url=http%3A%2F%2Fwww.florian-rappl.de%2Fdownload%2F91%2Fvorlesungsfolien&usg=AFQjCNGupMqoFPjuUJ_BGKwvYXK6fefS6Q&sig2=9INGqsabSvWs6RsLqOhAvA) [↩](#a2) 
