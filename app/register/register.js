'use strict';

angular.module('myApp.register', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'register/register.html',
        controller: 'registerCtrl'
    });
}])

.controller('registerCtrl', ['$scope','$rootScope', '$http', '$location', '$uibModal', function($scope, $rootScope, $http, $location, $uibModal) {
    $scope.user = {};
    $scope.register = function () {
        if ($scope.user.password != $scope.user.passwordConfirm){
            window.alert('Two passwords are different! Please try again.')
        } else {
            $scope.user.last_login = new Date();
            $http.post("http://127.0.0.1:9000/user/", $scope.user)
                .success(function (data, status, headers, config) {
                    window.alert('Successfully Registered!');
                    $rootScope.currentUser = localStorage.setItem('currentUser', JSON.stringify(data));
                    $location.path("/home")
                })
                .error(function (data, status, header, config) {
                    window.alert(data);
                    document.getElementById("registerForm").reset();
                });

        }
    };

    $scope.loginModal = function () {
        $uibModal.open({
            templateUrl: 'modals/login/login.html',
            controller: 'loginCtrl',
            controllerUrl: 'modals/login/login.js'
        })
    };

    $scope.containerOn = function () {
        document.getElementById('registerContainer').style.opacity = 1
    };

    $scope.containerOff = function () {
        document.getElementById('registerContainer').style.opacity = 0.8
    };

    $scope.loginContainerOn = function () {
        document.getElementById('loginContainer').style.opacity = 1
    };

    $scope.loginContainerOff = function () {
        document.getElementById('loginContainer').style.opacity = 0.8
    };



}]);