var app = angular.module('NativeView', ['ngStorage']);

var socket = io();
var gyro;

var socket = io.connect();


var sdks = ['visage', 'BRFv4']
var based = ['Movement', 'Rotation', 'Magic']

var head = {
    position: {
        x: 0,
        y: 0,
        z: 0
    },
    rotation: {
        x: 0,
        y: 0,
        z: 0
    },
    scale: 0,
    smile: false
}

// camera.position.x = 0;
// camera.position.y = 0;
camera.position.z = 85;

neck.rotation.x = 0;
neck.rotation.y = 0;
neck.rotation.z = 0;


function resetRotation(){
    neck.rotation.x = 0;
    neck.rotation.y = 0;
    neck.rotation.z = 0;
}

function resetPosition(){
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 35;
}

function getFace(facos){
    data = facos[0];
    head.position.x = data.translationX;
    head.position.y = data.translationY;
    head.rotation.x = data.rotationX;
    head.rotation.y = data.rotationY;
    head.rotation.z = data.rotationZ;
    head.scale = data.scale;
}

function getSmile(smileFactor){
    if (smileFactor > 0.6){
        head.smile = true;
    }
}

function updateDistortion(value){
    effect2.uniforms[ "strength" ].value = value;
}


app.controller("ctrlr", function($scope, $localStorage, $http, $timeout) {

    $scope.$storage = $localStorage;
    $scope.camera = camera;
    $scope.sdks = sdks;
    $scope.based = based;
    $scope.settings = settings;
    $scope.data = head;
    $scope.gyroCenter = {
        yaw: 0,
        pitch: 0,
        roll: 0
    };

    $scope.vector = lineGeometry.vertices[1];

    $scope.changeVector = function (){
        lineGeometry.vertices[1] = $scope.vector;
    };

    $scope.folder0 = false;
    $scope.folder1 = false;
    $scope.folder2 = false;
    $scope.folder3 = false;

    $scope.distortion = distortion;



    socket.on('sendGyro', function (data) {
        var text = data.gyro.toString();
        var quotes = text.replace(/'/g, '"')
        var json = JSON.parse(quotes)
        $scope.gyro = json;

        if (settings.gyroscope) {
            camera.rotation.y =  -$scope.gyro.yaw * 0.016666 - $scope.gyroCenter.yaw;
            camera.rotation.x = $scope.gyro.pitch * 0.016666 - $scope.gyroCenter.pitch;
            camera.rotation.z = -$scope.gyro.roll * 0.016666 - $scope.gyroCenter.roll;
        }
    });


    $scope.recenterRotation = function() {
        $scope.gyroCenter.yaw = 0;
        camera.rotation.y = -$scope.gyro.yaw * 0.016666;
        $scope.gyroCenter.yaw = camera.rotation.y - $scope.gyroCenter.yaw;
        $scope.gyroCenter.pitch = 0;
        camera.rotation.x = $scope.gyro.pitch * 0.016666;
        $scope.gyroCenter.pitch = camera.rotation.x - $scope.gyroCenter.pitch;
        $scope.gyroCenter.roll = 0;
        camera.rotation.z = -$scope.gyro.roll * 0.016666;
        $scope.gyroCenter.roll = camera.rotation.z  - $scope.gyroCenter.roll;
    }

    $scope.resetRotation = function() {
        camera.rotation.y = 0;
        camera.rotation.x = 0;
        camera.rotation.z = 0;
    }


    // if (settings.headtracking.active){
    //     brfv4Example.start();

    // setInterval(function(){
    //    $scope.$apply(function() {
    //        if (settings.headtracking.active){
    //            $scope.data = head;
    //            $scope.camera.position.x = head.position.x - 300;
    //            $scope.camera.position.y = -head.position.y + 190;
            //    $scope.camera.position.y = head.rotation.z
            //    $scope.camera.rotation.x = head.rotationX;
            //    $scope.camera.rotation.y = $scope.head.rotationY;
            //    $scope.camera.rotation.z = $scope.head.rotationZ;


            //    camera.position.x = head.translationX;
            //    camera.position.y = head.translationY;
            //    camera.rotation._z = head.rotation.z;
            // StopTracker();
   //         }
   //     });
   // }, 10);
    // }


    // updateSDK(false);
    $scope.updateSDK = function(bool){
        if (bool){
            settings.eyetracking = true;
            settings.headtracking.active = false;
            StartTracker();
            setTimeout("location.reload();",60000);
        } else {
            StopTracker();
        settings.eyetracking = false;
            setTimeout("location.reload();",6000000);
        }
    }

    $scope.$storage = $localStorage.$default({
        settings: settings
    });

    $scope.settings = $scope.$storage.settings


});


function refresh(){
    location.reload();
}

function clearLocalStorage(){
    localStorage.clear();
}



//block alerts
window._alert = window.alert;
    window.alert = function () {
};


function streamData(Data){
    if (settings.eyetracking){
        var pointer = document.getElementById('pointer');
        var faceData = Data;
        var gaze = faceData.getGazeDirectionGlobal();
        var gazeX = window.innerWidth / 2;
        var gazeY = window.innerHeight / 2;
        var transformY = (gaze[0]*3) * gazeY;
        var transformX = (gaze[1]*2) * gazeX;
        pointer.style.opacity = 1;
        pointer.style.transform = 'translate3d('+ -transformX + 'px,' + transformY + 'px,0)';
    }
}
