'use strict';

angular.module('myApp.town', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/town/:townId', {
        templateUrl: 'town/town.html',
        controller: 'townCtrl'
    });
}])

.controller('townCtrl', ['$scope','$rootScope','$http', '$uibModal', '$location', '$routeParams', function($scope, $rootScope, $http, $uibModal, $location, $routeParams) {
    $http.defaults.headers.common.Authorization = 'Token ' + localStorage.getItem('key');
    $scope.page = function () {
        $http.get("http://127.0.0.1:8000/towns/"+$routeParams.townId+"/")
            .success(function (res) {
                $scope.strangerTown = res;
                $scope.zones = {north: {lancers:[], cavalry:[], archers: []},
                    south: {lancers:[], cavalry:[], archers: []},
                    west: {lancers:[], cavalry:[], archers: []},
                    east: {lancers:[], cavalry:[], archers: []},
                    center: {lancers:[], cavalry:[], archers: []}};
                $scope.lancers = [];
                $scope.cavs = [];
                $scope.archers = [];
                angular.forEach($scope.strangerTown.troops, function (v) {
                    if (v.type === "lancer") {
                        $scope.lancers.push(v);
                        $scope.zones[v.town_position].lancers.push(v);
                    } else if (v.type === "cavalry") {
                        $scope.cavs.push(v);
                        $scope.zones[v.town_position].cavalry.push(v);
                    } else if (v.type === "archer") {
                        $scope.archers.push(v);
                        $scope.zones[v.town_position].archers.push(v);
                    }
                });
                angular.forEach($scope.strangerTown.buildings, function (v) {
                    $scope[v.type] = v;
                });
                $scope.strangerTown.resources = JSON.parse($scope.strangerTown.resources.replace(/u/g,'').replace(/\'/g,'\"'));

            }).error(function (err) {
            window.alert(err.data);
        });
    };
    $scope.page();

    $scope.onArrow = function (e) {
        e.target.style.opacity = '1';
    };
    $scope.outArrow = function (e) {
        e.target.style.opacity = '0.5';
    };

}]);