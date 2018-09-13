'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'ui.bootstrap',
  'myApp.home',
  'myApp.profile',
  'myApp.register',
  'myApp.login'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/home'});
}]).
run(function ($location, $rootScope) {

  $rootScope.$on('$routeChangeStart', function($event, next, current) {
          if ($location.path() == '/register') {
              document.getElementById('body').style.backgroundImage = "url(images/asterix.jpg)"
          } else {
              document.getElementById('body').style.backgroundImage = "url(images/arkaplan.jpeg)"
          }
    });
});
