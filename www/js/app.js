// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('todoapp', ['ionic']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('list', {
        cache: false,
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

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: "LoginCtrl"
    });

    $urlRouterProvider.otherwise('/login');

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

app.controller('ListaCtrl', function($scope, $state, TarefaService, TarefaWebService) {
    // aqui vem a implementacao do meu controller

    // $scope.tarefas = TarefaService.lista();
    TarefaWebService.lista().then(function(dados) {
        $scope.tarefas = dados;
    });

    $scope.concluir = function(indice, tarefa) {

        tarefa.feita = true;

        TarefaWebService.concluir(indice, tarefa).then(function() {
            TarefaWebService.lista().then(function(dados) {
                $scope.tarefas = dados;
            });
        });
    }

    $scope.apagar = function(indice) {
        TarefaWebService.apagar(indice).then(function() {
            TarefaWebService.lista().then(function(dados) {
                $scope.tarefas = dados;
            });
        });
    }

    $scope.editar = function(indice) {
        $state.go('edit', { indice: indice });
    }
});

app.controller('NovoCtrl', function($scope, $state, TarefaWebService) {
    // aqui vem a implementacao do meu controller

    $scope.tarefa = {
        "texto": '',
        "data": new Date(),
        "feita": false
    };

    $scope.salvar = function() {

        TarefaWebService.inserir($scope.tarefa).then(function() {
            $state.go('list');
        });

    }
});

app.controller('EditCtrl', function($scope, $state, $stateParams, TarefaWebService) {

    $scope.indice = $stateParams.indice; //indice passado pela rota

    // $scope.tarefa = angular.copy(TarefaService.obtem($scope.indice));
    TarefaWebService.obtem($scope.indice).then(function(dados) {
        $scope.tarefa = dados;
    });

    $scope.salvar = function() {

        TarefaWebService.alterar($scope.indice, $scope.tarefa).then(function() {
            $state.go('list');
        });

    }
});

app.controller('LoginCtrl', function($scope, $http, $state, $ionicHistory, $ionicPopup) {

    $scope.usuario = {};

    $scope.login = function() {
        $http.post('http://localhost:3004/api/usuario', $scope.usuario)
            .then(function(response) {
                if (response.status == 200) {
                    window.localStorage.setItem('usuario', JSON.stringify(response.data));

                    $ionicHistory.nextViewOptions({
                        disableBack: true
                    })

                    $state.go('list');
                }
            }, function(response) {
                $ionicPopup.alert({
                    title: 'Falha no acesso',
                    template: 'Usuario Invalido'
                })
            });
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

app.factory('TarefaWebService', function($http, $q) {

    var url = 'http://localhost:3004/api/tarefa';
    var config = {
        headers: { 'Authorization': JSON.parse(window.localStorage.getItem('usuario')).token }
    };

    return {
        lista: function() {
            var deferido = $q.defer();

            $http.get(url, config).then(function(response) {
                deferido.resolve(response.data);
            });

            return deferido.promise;
        },

        obtem: function(indice) {
            var deferido = $q.defer();

            $http.get(url + '/' + indice).then(function(response) {
                deferido.resolve(response.data);
            });

            return deferido.promise;
        },

        inserir: function(tarefa) {
            var deferido = $q.defer();

            $http.post(url, tarefa).then(function() {
                deferido.resolve();
            });

            return deferido.promise;
        },

        alterar: function(indice, tarefa) {
            var deferido = $q.defer();

            $http.put(url + '/' + indice, tarefa).then(function() {
                deferido.resolve();
            });

            return deferido.promise;
        },

        concluir: function(indice, tarefa) {
            var deferido = $q.defer();

            $http.put(url + '/' + indice, tarefa).then(function() {
                deferido.resolve();
            });

            return deferido.promise;
        },

        apagar: function(indice) {
            var deferido = $q.defer();

            $http.put(url + '/' + indice).then(function() {
                deferido.resolve();
            });

            return deferido.promise;
        }
    }
});