'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.home',
  'myApp.profile',
  'myApp.register',
  'myApp.login',
  'myApp.buildingModal',
  'myApp.map',
  'myApp.town'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}]).
run(function ($location, $rootScope, $http) {
    $http.defaults.headers.common.Authorization = 'Token '+ localStorage.getItem('key');

});
