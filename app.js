var express = require('express')
var http    = require('http');

var path    = require("path");
var fs      = require('fs');
var pug     = require('pug');

var app = require('express')();

var server = app.listen(4444, function(){
    console.log("Express server listening on port %d in %s mode", app.get('port'),
    app.settings.env);
});

var io = require("socket.io").listen(server)

var SerialPort = require('serialport');
var serialport = new SerialPort("/dev/cu.usbmodem1451", {
  baudRate: 57600,
  parser: SerialPort.parsers.readline('\n')
});

var gyroData;

serialport.on('open', function(){
  console.log('Serial Port Opend');
  serialport.on('data', function(data){
      gyroData = data;
    //   console.log(data)
      updateShit(data);
  });
});

function updateShit(data){
    io.sockets.emit('sendGyro', { gyro: data });
}

function onConnection(socket){
    console.log('CONNCECTED');
    socket.emit('sendGyro', { gyro: gyroData });
}

io.sockets.on('connection', onConnection);


app.use(express.static('static'));

app.set('views', 'src/views');
app.set('view engine', 'pug');

app.get('/', function (req, res) {
    res.render('index.pug', {
    });
});



// app.get('/views/:name', function (req, res) {
//     var name = req.params.name;
//     console.log(name);
//     res.render(name + '.pug', {
//         gyro: 'slon'
//     });
// });
