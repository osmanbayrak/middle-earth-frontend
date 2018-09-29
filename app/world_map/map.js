'use strict';

angular.module('myApp.map', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/map', {
        templateUrl: 'world_map/map.html',
        controller: 'mapCtrl'
    });
}])

.controller('mapCtrl', ['$scope','$rootScope','$http', '$uibModal', '$location', function($scope, $rootScope, $http, $uibModal, $location) {
    $http.defaults.headers.common.Authorization = 'Token '+ localStorage.getItem('key');

    $scope.locateMap = function (x, y) {
        $scope.x_parcels = []; $scope.y_parcels = [];
        var i; var j;
        var x_range = x-7+","+x+8; var y_range = y-3+","+y+4;
        for (i = x-7; i < x+8; i++) {
            $scope.x_parcels.push(i);
        }
        for (j = y-3; j < y + 4; j++) {
            $scope.y_parcels.push(j);
        }
        $http.get("http://127.0.0.1:8000/towns/"+"?x_coord__range="+x_range+"&y_coord__range="+y_range)
            .success(function (towns) {
                $scope.towns = towns;
            })
            .error(function (err) {
                window.alert(err);
            });
    };

    $scope.first = function () {
        $http.get("http://127.0.0.1:8000/profiles/?user__username=" + JSON.parse(localStorage.getItem('profile')).user.username)
            .success(function (profile) {
                $scope.profile = profile[0];
                $scope.currentTown = $scope.profile.town[0];
                $scope.last_x = $scope.currentTown.x_coord;
                $scope.last_y = $scope.currentTown.y_coord;
                $scope.locateMap($scope.currentTown.x_coord, $scope.currentTown.y_coord);
            })
            .error(function (data, status, header, config) {window.alert(data);});
    };
    $scope.thereIsTown = {};
    $scope.first();

    $scope.showTown = function (x, y) {
        angular.forEach($scope.towns, function (v) {
            if (v.x_coord === x && v.y_coord === y) {
                $scope.thereIsTown[x+"."+y] = [true, v];
            }
        });
        if (x+"."+y in $scope.thereIsTown) {
            return $scope.thereIsTown[x + "." + y][1].name;
        }
    };

    $scope.townDetail = function (x, y) {
        angular.forEach($scope.towns, function (v) {
            if (v.x_coord === x && v.y_coord === y) {
                $location.path('town/'+v.id);
            }
        });
    };

    $scope.moveMap = function (direction) {
        if (direction === 'east'){
            $scope.locateMap($scope.last_x + 15, $scope.last_y);
            $scope.last_x += 15;
        } else if (direction === 'west'){
            $scope.locateMap($scope.last_x - 15, $scope.last_y);
            $scope.last_x -= 15;
        } else if(direction === 'north'){
            $scope.locateMap($scope.last_x, $scope.last_y + 7);
            $scope.last_y += 7;
        } else if(direction === 'south'){
            $scope.locateMap($scope.last_x, $scope.last_y - 7);
            $scope.last_y -= 7;
        } else if (direction === 'home') {
            $scope.locateMap($scope.currentTown.x_coord, $scope.currentTown.y_coord);
            $scope.last_x = $scope.currentTown.x_coord;
            $scope.last_y = $scope.currentTown.y_coord;
        }
    };

}]);