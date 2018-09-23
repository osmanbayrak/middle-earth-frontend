'use strict';

angular.module('myApp.home', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/home', {
    templateUrl: 'home/home.html',
    controller: 'homeCtrl'
  });
}])

.controller('homeCtrl', ['$scope','$rootScope','$http', '$uibModal', '$location', function($scope, $rootScope, $http, $uibModal, $location) {
    $http.defaults.headers.common.Authorization = 'Token '+ localStorage.getItem('key');
    $scope.interval = {};

    $scope.convertSeconds = function (seconds) {
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    };
    $scope.convertFloor = function (data) {
        return Math.floor(data);
    };

    $scope.page = function () {
        if (localStorage.getItem('profile') !== undefined) {

            $http.get("http://127.0.0.1:8000/profiles/?user__username=" + JSON.parse(localStorage.getItem('profile')).user.username)
                .success(function (profile) {
                    $scope.profile = profile[0];
                    $scope.currentTown = $scope.profile.town[0];
                    $scope.allTowns = [];
                    angular.forEach($scope.profile.town, function (v) {
                        $scope.allTowns.push(v);});
                    $scope.zones = {north: {lancers:[], cavalry:[], archers: []},
                                    south: {lancers:[], cavalry:[], archers: []},
                                    west: {lancers:[], cavalry:[], archers: []},
                                    east: {lancers:[], cavalry:[], archers: []},
                                    center: {lancers:[], cavalry:[], archers: []}};
                    angular.forEach($scope.currentTown.troops, function (v) {
                        if (v.type === "lancer") {
                            $scope.zones[v.town_position].lancers.push(v);
                        } else if (v.type === "cavalry") {
                            $scope.zones[v.town_position].cavalry.push(v);
                        } else if (v.type === "archer") {
                            $scope.zones[v.town_position].archers.push(v);
                        }
                    });
                    console.log($scope.zones);
                    angular.forEach($scope.currentTown.buildings, function (v) {
                        $scope[v.type] = v;
                        if (v.status === 'loading') {
                            $scope.buildingLoading(v);
                        }
                    });
                    $scope.currentTown.resources = JSON.parse($scope.currentTown.resources.replace(/u/g,'').replace(/\'/g,'\"'));
                })
                .error(function (data, status, header, config) {$location.path('/register');});

        } else { $location.path('/register'); }
    };

    $scope.buildingLoading = function (building) {
        if (!(building.type in $scope.interval)) {
            var a = document.getElementById(building.type +'Loading');
            var sofar = parseInt((new Date().getTime() - new Date(building.change_date).getTime())/1000);
            $scope.interval[building.type] = setInterval(frame, 1000);
        }
        function frame() {
            if (sofar >= building.construction_time + 2) {
                console.log($scope.interval);
                clearInterval($scope.interval[building.type]);
                delete $scope.interval[building.type];
                a.style.width = '0%';
                a.innerHTML = "Initilazing";
                $scope.page();
            } else {
                sofar++;
                if (building.construction_time >= sofar) {
                    a.style.width = sofar * 100 / building.construction_time + '%';
                    a.innerHTML = $scope.convertSeconds(building.construction_time - sofar);
                } else {a.innerHTML = "Loading!";}
            }}};

    $rootScope.buildingProcess = function (building, isCancel) {
        if (isCancel === false) {
            building.status = "loading";
            building.change_date = new Date();
        } else {building.status = "completed";}
        $http.put("http://127.0.0.1:8000/buildings/" + building.id + '/', building)
            .success(function (res) {
                if (res.status === "loading") {
                     $http.put("http://127.0.0.1:8000/towns/"+res.town+"/", {resources:"{'wood':"+(parseInt($scope.currentTown.resources.wood) - (building.cost["wood"] ? parseInt(building.cost["wood"]):0)) + ", 'food':"+(parseInt($scope.currentTown.resources.food) - (building.cost["food"] ? parseInt(building.cost["food"]):0)) +", 'stone':" + (parseInt($scope.currentTown.resources.stone) - (building.cost["stone"] ? parseInt(building.cost["stone"]):0)) +"}"})
                         .success(function (res) {
                             $scope.page();
                         })
                         .error(function (err, status, header, config) {console.log("put da error var");});
                } else {
                    $http.put("http://127.0.0.1:8000/towns/"+res.town+"/", {resources:"{'wood':"+(parseInt($scope.currentTown.resources.wood) + (building.cost["wood"] ? parseInt(building.cost["wood"]):0)) + ", 'food':"+(parseInt($scope.currentTown.resources.food) + (building.cost["food"] ? parseInt(building.cost["food"]):0)) +", 'stone':" + (parseInt($scope.currentTown.resources.stone) + (building.cost["stone"] ? parseInt(building.cost["stone"]):0)) +"}"})
                        .success(function (res) {
                            clearInterval($scope.interval[building.type]); $scope.page();
                        })
                        .error(function (err, status, header, config) {console.log("put da error var");});
                }
            })
            .error(function (err, status, header, config) {window.alert("You have not enough resources!"); $scope.page();});
    };

    $scope.page();

    $scope.buildingModal = function (building) {
        $uibModal.open({
            templateUrl: 'modals/building/building.html',
            controller: 'buildingModalCtrl',
            controllerUrl: 'modals/building/building.js',
            size: 'lg',
            resolve: {
                modalConfig: function() {
                    return {
                        building: building,
                        resources: $scope.currentTown.resources
                    };
                }
            }
        });
    };

}]);