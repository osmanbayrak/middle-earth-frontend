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
    document.getElementById('body').style.backgroundImage = "url(images/map.png)";

  $rootScope.$on('$routeChangeStart', function($event, next, current) {
      if (localStorage.getItem('profile') !== undefined) {
          if ($location.path() === '/register') {
              document.getElementById('body').style.backgroundImage = "url(images/asterix.jpg)";
          } else if ($location.path() === '/map') {
              document.getElementById('body').style.backgroundImage = "url(images/map.png)";
              document.getElementById('body').style.backgroundRepeat = "repeat";
          }
          else {
              document.getElementById('body').style.backgroundImage = "url(images/map.png)";
          }
      } else {
          $location.path('/register');
      }
    });
});
