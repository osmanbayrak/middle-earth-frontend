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

    $scope.page = function (willModalOpen, building) {
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
                $scope.lancers = [];
                $scope.cavs = [];
                $scope.archers = [];
                angular.forEach($scope.currentTown.troops, function (v) {
                    if (v.type === "lancer") {
                        $scope.lancers.push(v);
                        $scope.zones[v.town_position].lancers.push(v);
                    } else if (v.type === "cavalry") {
                        $scope.cavs.push(v);
                        $scope.zones[v.town_position].cavalry.push(v);
                    } else if (v.type === "archer") {
                        $scope.archers.push(v);
                        $scope.zones[v.town_position].archers.push(v);
                    }
                });
                angular.forEach($scope.currentTown.buildings, function (v) {
                    $scope[v.type] = v;
                    if (v.status === 'loading') {
                        $scope.buildingLoading(v);
                    }
                });
                $scope.currentTown.resources = JSON.parse($scope.currentTown.resources.replace(/u/g,'').replace(/\'/g,'\"'));
                if (willModalOpen === true) {
                    $scope.buildingModal(building);
                }
                if (("modalReOpen" in $rootScope)? $rootScope.modalReOpen.status: false) {
                    $scope.buildingModal($rootScope.modalReOpen.building);
                }
            })
            .error(function (data, status, header, config) {window.alert(data);});
    };

    $scope.buildingLoading = function (building) {
        if (!(building.type in $scope.interval)) {
            var a = document.getElementById(building.type +'Loading');
            var sofar = parseInt((new Date().getTime() - new Date(building.change_date).getTime())/1000);
            $scope.interval[building.type] = setInterval(frame, 1000);
        }
        function frame() {
            if (sofar >= building.construction_time + 3) {
                clearInterval($scope.interval[building.type]);
                delete $scope.interval[building.type];
                a.style.width = '0%';
                a.innerHTML = "Initilazing";
                $scope.page();
            } else {
                sofar++;
                if (building.construction_time >= sofar) {
                    a.style.width = sofar *  100 / building.construction_time + '%';
                    a.innerHTML = $scope.convertSeconds(building.construction_time - sofar);
                } else {a.innerHTML = "Loading!";}
            }
        }
    };

    $rootScope.buildingProcess = function (building, isCancel) {
        if (isCancel === false) {
            building.status = "loading";
            building.change_date = new Date();

            $http.put("http://127.0.0.1:8000/buildings/" + building.id + '/', building)
                .success(function (res) {
                    $scope.page();
                })
                .error(function (err, status, header, config) {window.alert("You have not enough resources!"); $scope.page();});
        } else {
            building.status = "completed";
            $http.put("http://127.0.0.1:8000/buildings/" + building.id + '/', building)
                .success(function (res) {
                    clearInterval($scope.interval[building.type]);
                    delete $scope.interval[building.type];
                    $scope.page();
                })
                .error(function (err, status, header, config) {window.alert("Check your queue and resources and try again!"); $scope.page();});
        }
    };

    $rootScope.trainNew = function (initial_troop, isCancel, troop_id) {
        if (isCancel === false) {
            if (initial_troop.type === 'archer') {
                $scope.troop = {type:'archer', tier:0, town:$scope.currentTown.id, change_date: new Date(), status: 'preparing', town_position:'center'};
            } else if(initial_troop.type === 'cavalry') {
                $scope.troop = {type:'cavalry', tier:0, town:$scope.currentTown.id, change_date: new Date(), status: 'preparing', town_position:'center'};
            } else if(initial_troop.type === 'lancer') {
                $scope.troop = {type:'lancer', tier:0, town:$scope.currentTown.id, change_date: new Date(), status: 'preparing', town_position:'center'};
            }
            $http.post("http://127.0.0.1:8000/troops/", $scope.troop)
                .success(function (res) {
                    $scope.page();
                })
                .error(function (err, status, header, config) {window.alert("Check your queue and resources then try again!"); $scope.page();});

        } else {
            $http.delete("http://127.0.0.1:8000/troops/"+troop_id+"/")
                .success(function (res) {
                    var cancelData = {
                        resources:JSON.stringify({
                            "wood":$scope.currentTown.resources.wood + ("wood" in initial_troop.cost ? initial_troop.cost.wood:0),
                            "food":$scope.currentTown.resources.food + ("food" in initial_troop.cost ? initial_troop.cost.food:0),
                            "stone":$scope.currentTown.resources.stone + ("stone" in initial_troop.cost ? initial_troop.cost.stone:0)
                        }),
                        troop_queue:$scope.currentTown.troop_queue - 1
                    };
                    $http.patch("http://127.0.0.1:8000/towns/"+ $scope.currentTown.id +"/", cancelData)
                        .success(function (res) {
                            //clearInterval(interval.id.oftroop);
                            //delete $scope.interval[interval.id.oftroop];
                            $scope.page();
                        })
                        .error(function (err, status) {
                            window.alert("Cant REPAY you because of" + err.data);
                        });
                })
                .error(function (err,status) {
                    window.alert("Cant cancel because of" + err);
                });
        }
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
                        town: $scope.currentTown
                    };
                }
            }
        });
    };

}]);