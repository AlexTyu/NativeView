var express = require('express');
var path    = require("path");
var fs      = require('fs');
var pug     = require('pug');
var http    = require('http');

var app     = express();

app.use(express.static('static'));
app.set('views', 'src/views');
app.set('view engine', 'pug');

var port    = 80;
process.argv.forEach((val, index) => {
    if( val.indexOf('-p=') >= 0 ) {
        try {
            port = parseInt(val.replace('-p=', ''));
        } catch (e) {
            console.log('Unable to parse port');
        }
    }
});

app.listen(port, function() {
    console.log('App is running on port', port);
});

app.get('/', function (req, res) {
    res.render('index.pug', {});
});

app.get('/views/:name', function (req, res) {
    var name = req.params.name;
    console.log(name);
    res.render(name + '.pug', {});
});
