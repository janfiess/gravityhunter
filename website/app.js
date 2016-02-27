var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var MongoClient = require('mongodb').MongoClient;

// include external data, eg. css, images (public folder)
app.use(express.static(__dirname + '/public'));

// By typing localhost:3000 the browser will load index.html
app.get('/', function (req, res) {
    res.redirect('/html/index.html'); // alternative: res.sendfile('./public/html/index.html');
});


// Put the application on port 3000
var port = 3000;
http.listen(port, function () {
    console.log('listening on port ' + port);
});

// Database "test", Collection "players"
var mongo_url = 'mongodb://localhost:27017/test';



// Socket.io: Communication Server <-> Client(s)
io.on('connection', function (socket) {
    socket.on("testplayer", function (data) {
        console.log(data);
        MongoClient.connect(mongo_url, function (err, db) {
            console.log("Connected to DB: add testplayer");
            insertPlayer(db, data, function () {                       // 1. INSERT
                selectPlayer(db, function () {                   // SELECT
                    db.close();
                });
            });
        });
    });



    socket.on("getHighscore", function (data) {
        if (data == "req") {
            MongoClient.connect(mongo_url, function (err, db) {
                console.log("Connected to DB: getHighscore");
                getHighscore(db, function (resdata) {
                    socket.emit("getHighscore", resdata);
                    db.close(); // falls Probleme auftreten, entfernen !!
                });
            });
        }
    });
});


// 1. INSERT
function insertPlayer(db, data, callback) {
    // INSERT INTO players ('email', 'name',...) VALUES ('ff@ff.de', 'Fabi');
    db.collection('players').insert(data, function (err) {
        if (!err)console.log("Inserted a document into the players collection.");
        if (callback) callback();
    });
}

// SELECT
function selectPlayer(db, callback) {
    // SELECT email, name FROM players WHERE name = 'Fabi'
    db.collection('players').find(
        {name: "Fabi"},            // WHERE ...
        {email: 1, name: 1, password: 1, scores: 1, level: 1}).toArray(
        function (err, result) {
            if (!err) {
                console.log('SELECTED:');
                console.log(result);
            }
            if (callback) callback();
        }
    )
}


// SELECT
function getHighscore(db, callback) {
    // SELECT name, scores, level FROM players
    db.collection('players').find(
        {},            // WHERE ...
        {name: 1, scores: 1, level: 1}).toArray(
        function (err, result) {
            if (!err) {
                //console.log('SELECTED:');
                //console.log(result);
                if (callback)callback(result);
            }
        }
    )
}



// 2. UPDATE
function updateCar(callback) {
    // UPDATE Auto SET farbe = 'Gelb' WHERE modell = 'Scirocco';
    db.collection('autos').update(
        {modell: 'Multivan'},       // WHERE ...
        {$set: {farbe: "Gelb"}},    // SET ...
        {multi: true},
        function (err) {
            if (!err) console.log("2. updateCar");
            if (callback) callback();
        }
    )
}

// RENAME COLUMN funktioniert nur im Terminal:
//ALTER TABLE autos CHANGE modell baureihe varchar(255) // WHERE marke = 'VW' nur über Umwege möglich
//db.autos.update({marke:'VW'},{$rename: {'modell': 'baureihe'}}, false, true);

// 3. DELETE
function deleteCar(callback) {
    // DELETE FROM Autos WHERE modell = 'Scirocco';
    db.collection('autos').remove(
        {modell: "Multivan"},    // WHERE
        function (err) {
            if (!err) console.log("3. deleteCar");
            if (callback) callback();
        }
    )
}




