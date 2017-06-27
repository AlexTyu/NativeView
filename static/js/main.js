var app = angular.module('NativeView', ['ngStorage']);


var settings = {
    autoreload: true,
    headtracking: {
        active: true,
        sdk: 'BRFv4',
        basedon: 'Rotation'
    },
    eyetracking: false
}


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

camera.position.x = 71;
camera.position.y = 29;
camera.position.z = 116;

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

app.controller("ctrlr", function($scope, $localStorage, $http, $timeout) {

    $scope.$storage = $localStorage;

    $scope.camera = camera;
    $scope.sdks = sdks;
    $scope.based = based;
    $scope.settings = settings;
    $scope.data = head;

    setInterval(function(){
       $scope.$apply(function() {
           if (settings.headtracking.active){
               $scope.data = head;
               $scope.camera.position.x = head.position.x - 300;
               $scope.camera.position.y = -head.position.y + 190;
            //    $scope.camera.position.y = head.rotation.z
            //    $scope.camera.rotation.x = head.rotationX;
            //    $scope.camera.rotation.y = $scope.head.rotationY;
            //    $scope.camera.rotation.z = $scope.head.rotationZ;


            //    camera.position.x = head.translationX;
            //    camera.position.y = head.translationY;
            //    camera.rotation._z = head.rotation.z;
            StopTracker();
           }
       });
   }, 10);

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
