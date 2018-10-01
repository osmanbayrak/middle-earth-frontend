'use strict';

angular.module('myApp.troopsModal', ['ngRoute', 'ui.bootstrap'])

.controller('troopsModalCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', 'modalConfig', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance, modalConfig) {
    $scope.troops = modalConfig.troops;
    $scope.type = $scope.troops[0].type;
    $scope.zone = $scope.troops[0].town_position;
}]);