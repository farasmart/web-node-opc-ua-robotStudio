const { response, json } = require("express");
var express = require("express");
var app = express();
var path = require("path");
var fs = require("fs");
const { type } = require("os");
const { request } = require("http");
var e = require ('events');
var events = new e.EventEmitter();

app.set('event',events);

app.use(express.urlencoded({ extended: true})) ;
app.use(express.json());




app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname + "/index.html"));
});


app.use("/css", express.static(__dirname + "/css"));
app.use("/image", express.static(__dirname + "/image"));
app.use("/js", express.static(__dirname + "/js"));

app.get("/nodeFunc", function (req, res) {
  fs.readFile(__dirname + "/" + "users.json", "utf8", function (err, data) {
    console.log(data);
    res.end(data);
  });
});


 app.post('/test',(req,res) => {
    const data = request.body;
    console.log('success');

    
 })
 



var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
