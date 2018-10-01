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
  'myApp.troopsModal',
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

    $rootScope.onEmpty = function (e) {
        e.target.style.opacity = '1';
    };
    $rootScope.outEmpty = function (e) {
        e.target.style.opacity = '0.5';
    };

    $rootScope.brighter = function (e) {
        e.target.style.filter = 'brightness(150%)';
    };
    $rootScope.darker = function (e) {
        e.target.style.filter = 'brightness(100%)';
    };

    $rootScope.home = function () {
        $location.path('/home');
    };

    $rootScope.map = function () {
        $location.path('/map');
    };

    $rootScope.settings = function () {
        $location.path('/settings');
    };

    $rootScope.profile = function () {
        $location.path('/profile');
    };

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
