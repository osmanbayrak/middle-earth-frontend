'use strict';

angular.module('myApp.home', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', ['$scope','$rootScope','$http', function($scope, $rootScope, $http) {
    $http.defaults.headers.common.Authorization = 'Token '+ localStorage.getItem('key');
    $scope.profile = JSON.parse(localStorage.getItem('profile'));
    if (localStorage.getItem('currentTown') == undefined) {
        localStorage.setItem('currentTown', JSON.stringify($scope.profile.town[0]));
    }
    $scope.currentTown = JSON.parse(localStorage.getItem('currentTown'));
    console.log($scope.currentTown)
    var allTowns = []
    angular.forEach($scope.profile.town, function (v) {
        allTowns.push(v)
    });
    localStorage.setItem('towns', JSON.stringify(allTowns))
    angular.forEach($scope.currentTown.buildings, function (v) {
        console.log(v)
        if (v.type == "main") {
            $scope.mainBuilding = v
        }
        if (v.type == "barrack") {
            $scope.barrack = v
        }
        if (v.type == "timber") {
            $scope.timber = v
        }
    })
    console.log($scope.mainBuilding)

    $scope.buildingUp = function (id) {
        $scope.mainBuilding.status = "loading";
        $http.put("http://127.0.0.1:8000/buildings/" + id + '/', $scope.mainBuilding)
            .success(function (res) {
                console.log("will be ready in" + res.construction_time)
            })
        /*$http.patch("http://127.0.0.1:8000/buildings/"+id, {status:"loading"})
            .success(function (data) {
                console.log(data)

            })
            .error(function (data, status, header, config) {
                console.log(data)
            }); */
    };
}]);