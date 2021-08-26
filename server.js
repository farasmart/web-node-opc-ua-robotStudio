const { response } = require('express');
var express = require('express');
var app = express();
var path = require('path');
 var sass = require('node-sass')
var fs = require("fs");
const { type } = require('os');

app.get('/', function (req,res){
   res.sendFile(path.join(__dirname + "/index.html"));
})

app.use('/css',express.static(__dirname +'/css'));
app.use('/image',express.static(__dirname + '/image'));


// app.get('/listUsers', function (req, res) {
//    fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
//       console.log( data );
//       res.end( data );
//    });
// })

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})

