'use strict';

angular.module('myApp.profile', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/profile', {
    templateUrl: 'profile/profile.html',
    controller: 'profileCtrl'
  });
}])

.controller('profileCtrl', ['$scope', function($scope) {
    $scope.mainLoading = function() {
        var elem = document.getElementById("mainLoading");
        var width = 0;
        var id = setInterval(frame, 1000);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
            } else {
                width++;
                elem.style.width = width + '%';
                elem.innerHTML = width * 1 + '%';
            }
        }
    }
}]);