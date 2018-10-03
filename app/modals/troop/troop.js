'use strict';

angular.module('myApp.troopsModal', ['ngRoute', 'ui.bootstrap'])

.controller('troopsModalCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', 'modalConfig', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance, modalConfig) {
    $scope.moving = false;
    $scope.troops = modalConfig.troops;

    $scope.currentPage = 0;
    var pageSize = 5;
    $scope.pageCount = $scope.troops.slice(0, $scope.troops.length/pageSize + (($scope.troops.length === pageSize) ? 0 : 1));
    $scope.pageTroops = $scope.troops.slice(0, pageSize);
    $scope.pageChanged = function (p_number) {
        $scope.currentPage = p_number;
        $scope.pageTroops = $scope.troops.slice(p_number*pageSize, (p_number+1)*pageSize);
    };
    $scope.type = $scope.troops[0].type;
    $scope.zone = $scope.troops[0].town_position;
    $scope.zones = ["north", "south", "west", "east", "center"];

    $scope.willMoveTroops = [];
    $scope.troopWillMove = function (troop) {
        if (troop.town_position === $scope.zone) {
            $scope.willMoveTroops.splice( $scope.willMoveTroops.indexOf(troop), 1 );

        } else if (!$scope.willMoveTroops.includes(troop)) {
            $scope.willMoveTroops.push(troop);
        } else {
            for (var i in $scope.willMoveTroops) {
                if ($scope.willMoveTroops[i].id === troop.id) {
                    $scope.willMoveTroops[i] = troop;
                    break;
                }
            }
        }
    };
    $scope.moveTroops = function () {
        $scope.moving = true;

        angular.forEach($scope.willMoveTroops, function (v) {
            $http.patch("http://127.0.0.1:8000/troops/" + v.id + '/', v)
                .success(function (response) {
                    $scope.moving = false;
                })
                .error(function (err, status, header, config) {window.alert("You cant becaos of"+err.substr(20,45));});
        });

        $uibModalInstance.close();
        $rootScope.initPage();
    };
}]);