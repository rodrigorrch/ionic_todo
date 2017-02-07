// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('todoapp', ['ionic']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('list', {
        url: '/list',
        templateUrl: 'templates/lista.html'
    });

    $stateProvider.state('new', {
        url: '/new',
        templateUrl: 'templates/novo.html'
    });

    $urlRouterProvider.otherwise('/list');

});

app.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});

var tarefa = [{
        "texto": "Realizar as atividades do curso",
        "data": new Date(),
        "feita": false
    },
    {
        "texto": "Passear com o cachorro",
        "data": new Date(),
        "feita": true
    }
];

app.controller('ListaCtrl', function($scope) {
    // auqi vem a implementacao do meu controller

    $scope.tarefas = tarefas;

    $scope.concluir = function(indice) {
        $scope.tarefas[indice].feita = true;
    }

    $scope.apagar = function(indice) {
        $scope.tarefas.splice(indice);
    }
});

app.controller('NovoCtrl', function($scope, $state) {
    // auqi vem a implementacao do meu controller

    $scope.salvar = function() {

        var tarefa = {
            "texto": $scope.texto, // <input ng-model="texto"...
            "data": new Date(),
            "feita": false
        };

        tarefas.push(tarefa);

        $state.go('list');

    }
});