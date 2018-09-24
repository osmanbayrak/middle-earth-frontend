'use strict';

angular.module('myApp.buildingModal', ['ngRoute', 'ui.bootstrap'])

.controller('buildingModalCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', 'modalConfig', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance, modalConfig) {
    $scope.building = modalConfig.building;
    $scope.town = modalConfig.town;
    $scope.resources = $scope.town.resources;
    $scope.troops = $scope.town.troops;
    $scope.preparing_troops = [];
    angular.forEach($scope.troops, function (v) {
        if (v.status === 'preparing') {
            $scope.preparing_troops.push(v);
        }
    });
    $scope.upB = function () {
        $rootScope.buildingProcess($scope.building, false); // this function is in home.js and second parameter is for isCancel
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $rootScope.buildingProcess($scope.building, true);
        $uibModalInstance.close();
    };

    $scope.train = function () {
        $rootScope.trainNew($scope.building.type, false); // trainProcess(buildingTypeForTrainType, isCancel)
        $uibModalInstance.close();
    };
    $scope.convertSeconds = function (seconds) {
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    };


    if ($scope.building.type === "archery") {
        $scope.initial_troop = {cost: {food: 900, wood: 400, stone: 300}, preparation_time: 480, img: "images/military/archer/profile.png"};
    } else if ($scope.building.type === "barrack") {
        $scope.initial_troop = {cost: {food: 800, wood: 300, stone: 250}, preparation_time: 360, img: "images/military/lancer/profile.png"};
    } else if ($scope.building.type === "stable") {
        $scope.initial_troop = {cost: {food: 2500, wood: 650, stone: 500}, preparation_time: 840, img: "images/military/cavalry/profile.png"};
    }


    $scope.checkEnough = function (resourcesType, cost) {
        if (cost !== undefined ? ($scope.resources[resourcesType] >= cost):true) {
            return true;
        }
    };

    $scope.buttonIsAvailable = function (forTroop) {
        if (forTroop === true) {
            if ($scope.town.troop_queue < $scope.town.military_process_limit && $scope.building.status !== 'loading' &&
                $scope.checkEnough('food', $scope.initial_troop.cost.food) &&
                $scope.checkEnough('wood', $scope.initial_troop.cost.wood) &&
                $scope.checkEnough('stone', $scope.initial_troop.cost.stone)) {
                return true;
            }
        } else {
            if ($scope.town.building_queue < $scope.town.building_process_limit && $scope.building.status !== 'loading' && $scope.checkEnough('food', $scope.building.cost.food) &&
                $scope.checkEnough('wood', $scope.building.cost.wood) &&
                $scope.checkEnough('stone', $scope.building.cost.stone)) {
                return true;
            }
        }
    };

}]);