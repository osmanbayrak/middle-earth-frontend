'use strict';

angular.module('myApp.buildingModal', ['ngRoute', 'ui.bootstrap'])

.controller('buildingModalCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', 'modalConfig', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance, modalConfig) {
    $scope.building = modalConfig.building;
    $scope.resources = modalConfig.resources;
    $scope.upB = function () {
        $rootScope.buildingProcess($scope.building, false); // this function is in home.js and second parameter is for isCancel
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $rootScope.buildingProcess($scope.building, true);
        $uibModalInstance.close();
    };
    $scope.convertSeconds = function (seconds) {
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    };


    if ($scope.building.type === "archery") {
        $scope.troop = {cost: {food: 900, wood: 400, stone: 300}, preparation_time: 480, img: "images/military/archer/profile.png"};
    } else if ($scope.building.type === "barrack") {
        $scope.troop = {cost: {food: 800, wood: 300, stone: 250}, preparation_time: 360, img: "images/military/lancer/profile.png"};
    } else if ($scope.building.type === "stable") {
        $scope.troop = {cost: {food: 2500, wood: 650, stone: 500}, preparation_time: 840, img: "images/military/cavalry/profile.png"};
    }


    $scope.checkEnough = function (resourcesType, cost) {
        if ($scope.resources[resourcesType] >= cost) {
            return true;
        }
    };

}]);