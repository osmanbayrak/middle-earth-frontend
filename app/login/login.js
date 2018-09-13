'use strict';

angular.module('myApp.login', ['ngRoute', 'ui.bootstrap'])

    .controller('loginCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance) {
        $scope.user = {};

        $scope.login = function () {
            $http.post("http://127.0.0.1:8000/auth/login/", $scope.user)
                .success(function (data) {
                    localStorage.setItem('key', data.key)
                    $http.defaults.headers.common.Authorization = 'Token '+ data.key;
                    $http.get("http://127.0.0.1:8000/profiles/?user__username=" + $scope.user.username)
                        .success(function (profile) {
                            localStorage.setItem('profile', JSON.stringify(profile[0]))
                            $location.path("/home")
                            $uibModalInstance.close()
                        })
                })
                .error(function (data, status, header, config) {
                    window.alert(data)
                });
        };


    }]);