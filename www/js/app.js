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
        templateUrl: 'templates/novo.html',
        controller: "NovoCtrl"
    });

    $stateProvider.state('edit', {
        url: '/edit/:indice',
        templateUrl: 'templates/novo.html',
        controller: "EditCtrl"
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

app.controller('ListaCtrl', function($scope, $state, TarefaService) {
    // auqi vem a implementacao do meu controller

    $scope.tarefas = TarefaService.lista();

    $scope.concluir = function(indice) {
        TarefaService.concluir(indice);
    }

    $scope.apagar = function(indice) {
        TarefaService.apagar(indice);
    }

    $scope.editar = function(indice) {
        $state.go('edit', { indice: indice });
    }
});

app.controller('NovoCtrl', function($scope, $state, TarefaService) {
    // aqui vem a implementacao do meu controller

    $scope.tarefa = {
        "texto": '',
        "data": new Date(),
        "feita": false
    };

    $scope.salvar = function() {

        TarefaService.inserir($scope.tarefa);

        $state.go('list');

    }
});

app.controller('EditCtrl', function($scope, $state, $stateParams, TarefaService) {
    // auqi vem a implementacao do meu controller

    $scope.indice = $stateParams.indice; //indice passado pela rota

    $scope.tarefa = angular.copy(TarefaService.obtem($scope.indice));

    $scope.salvar = function() {

        TarefaService.alterar($scope.indice, $scope.tarefa);

        $state.go('list');

    }
});

app.factory('TarefaService', function() {

    var tarefas = JSON.parse(window.localStorage.getItem('db_tarefas') || '[]');

    function persistir() {
        window.localStorage.setItem('db_tarefas', JSON.stringify(tarefas));
    }

    return {
        lista: function() {
            return tarefas;
        },

        obtem: function(indice) {
            return tarefas[indice];
        },

        inserir: function(tarefa) {
            tarefas.push(tarefa);
            persistir();
        },

        alterar: function(indice, tarefa) {
            tarefas[indice] = tarefa;
            persistir();
        },

        concluir: function(indice) {
            tarefas[indice].concluida = true;
            persistir();
        },

        apagar: function(indice) {
            tarefas.splice(indice, 1);
            persistir();
        }
    }
});