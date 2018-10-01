'use strict';

angular.module('myApp.troopsModal', ['ngRoute', 'ui.bootstrap'])

.controller('troopsModalCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', 'modalConfig', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance, modalConfig) {
    $scope.troops = modalConfig.troops;
    $scope.currentPage = 0;
    var pageSize = 5;
    $scope.pageCount = $scope.troops.slice(0, $scope.troops.length/pageSize + (($scope.troops.length === pageSize) ? 0 : 1));
    $scope.pageTroops = $scope.troops.slice(0, pageSize);
    $scope.pageChanged = function (p_number) {
        $scope.currentPage = p_number;
        $scope.pageTroops = $scope.troops.slice(p_number*pageSize, (p_number+1)*pageSize);
        console.log('cur page:',$scope.currentPage, 'page count:',$scope.pageCount.length);
    };
    $scope.type = $scope.troops[0].type;
    $scope.zone = $scope.troops[0].town_position;
}]);