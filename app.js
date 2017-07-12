var express = require('express')
var http    = require('http');

var path    = require("path");
var fs      = require('fs');
var pug     = require('pug');

var app = require('express')();

var io = require("socket.io").listen(server)



var server = app.listen(4444, function(){
    console.log("Express server listening on port %d in %s mode", app.get('port'),
    app.settings.env);
});




var gyroscope = {
    active: false,
    data: null
}

if (gyroscope.active){
    var SerialPort = require('serialport');
    var serialport = new SerialPort("/dev/cu.usbmodem1431", {
      baudRate: 57600,
      parser: SerialPort.parsers.readline('\n')
    });

    serialport.on('open', function(){
      console.log('Serial Port Opend');
      serialport.on('data', function(data){
          gyroscope.data = data; //assign data
          updateGyro(gyroscope);
      });
    });
} else {
    updateGyro(gyroscope);
}

function updateGyro(data){
    io.sockets.emit('sendGyro', { gyro: data });
    console.log(data)
}

function onConnection(socket){
    console.log('CONNCECTED');
    socket.emit('sendGyro', { gyro: gyroscope });
}

io.sockets.on('connection', onConnection);


app.use(express.static('static'));

app.set('views', 'src/views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index.pug', {
    });
});
