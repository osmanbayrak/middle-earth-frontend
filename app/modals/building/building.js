'use strict';

angular.module('myApp.buildingModal', ['ngRoute', 'ui.bootstrap'])

.controller('buildingModalCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', 'modalConfig', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance, modalConfig) {
    $scope.building = modalConfig.building;
    $scope.town = modalConfig.town;
    $scope.upB = function () {
        $rootScope.buildingProcess($scope.building, false); // this function is in home.js and second parameter is for isCancel
        $uibModalInstance.close()
    };
    $scope.cancel = function () {
        $rootScope.buildingProcess($scope.building, true);
        $uibModalInstance.close()
    };
    $scope.convertSeconds = function (seconds) {
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    };

    $scope.notEnough = {
        wood: false,
        stone: false,
        food: false
    };
    if ($scope.building.cost.wood ? ($scope.building.cost.wood > $scope.town.resources.wood) : false) {
        $scope.notEnough.wood = true
    }
    if ($scope.building.cost.stone ? ($scope.building.cost.stone > $scope.town.resources.stone) : false) {
        $scope.notEnough.stone = true
    }
    if ($scope.building.cost.food ? ($scope.building.cost.food > $scope.town.resources.food) : false) {
        $scope.notEnough.food = true
    }
    $scope.anyOfThemNotEnough = $scope.notEnough.wood || $scope.notEnough.food || $scope.notEnough.stone
}]);