//process.env.NODE_ENV = 'production';
var express = require('express');
var path = require("path");
var util = require('util'); //繼承object
var events = require('events'); //事件
var fs = require('fs');
var http = require('http');


var multer = require('multer')

var mongoose = require('mongoose');
var bodyParser = require('body-parser');



var upload = multer({
    dest: './upload_temp/'
});



var app = express();

mongoose.connect("mongodb://localhost:27017/gps");

global.appRoot = path.resolve(__dirname + '/frontend/');


//body parser
app.use(bodyParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

app.use(express.static(global.appRoot));


//console.log(app.get('env'));

var route = require('./routes.js')(app);

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});
