'use strict';

angular.module('myApp.profile', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'profile/profile.html',
    controller: 'profileCtrl'
  });
}])

.controller('profileCtrl', ['$scope', function($scope) {
  $scope.name = "osman";
  console.log($scope.name)
}]);