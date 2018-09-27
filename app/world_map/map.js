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

    $scope.first = function () {
        $http.get("http://127.0.0.1:8000/profiles/?user__username=" + JSON.parse(localStorage.getItem('profile')).user.username)
            .success(function (profile) {
                $scope.profile = profile[0];
                $scope.currentTown = $scope.profile.town[0];
                $scope.x_parcels = [];
                $scope.y_parcels = [];
                var i;
                var j;
                var x_cor = $scope.currentTown.x_coord;
                var y_cor = $scope.currentTown.y_coord;
                for (i = x_cor-7; i < x_cor + 8; i++) {
                    $scope.x_parcels.push(i);
                }
                for (j = y_cor-3; j < y_cor + 4; j++) {
                    $scope.y_parcels.push(j);
                }
                $http.get("http://127.0.0.1:8000/towns/"+"?x_coord__range="+(x_cor-7)+","+(x_cor+8)+
                    "&y_coord__range="+(y_cor-3)+","+(y_cor +4))
                    .success(function (towns) {
                        $scope.towns = towns;
                    })
                    .error(function (err) {
                        window.alert(err);
                    });
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
            return $scope.thereIsTown[x + "." + y][1].id;
        }
    };
    $scope.townDetail = function (x, y) {
        angular.forEach($scope.towns, function (v) {
            if (v.x_coord === x && v.y_coord === y) {
                $location.path('town/'+v.id);
            }
        });
    };

}]);