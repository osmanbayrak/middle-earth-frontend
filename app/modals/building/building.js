'use strict';

angular.module('myApp.buildingModal', ['ngRoute', 'ui.bootstrap'])

.controller('buildingModalCtrl', ['$scope','$rootScope', '$http', '$location','$uibModal', '$uibModalInstance', 'modalConfig', function($scope, $rootScope, $http, $location, $uibModal, $uibModalInstance, modalConfig) {
    $scope.interval = {};
    $scope.convertSeconds = function (seconds) {
        var date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 8);
    };

    $scope.building = modalConfig.building;
    $rootScope.modalReOpen = {status:false, building: $scope.building};
    $scope.town = modalConfig.town;
    $scope.resources = $scope.town.resources;
    $scope.troops = $scope.town.troops;
    $scope.preparing_troops = [];

    $scope.prodInfo = function () {
        if ($scope.building.type === "timber"){
            return {perHour: $scope.town.production.perHour.wood, type: "wood", extraCapacity: $scope.town.production.extraCapacity.wood};
        } else if ($scope.building.type === "farm"){
            return {perHour: $scope.town.production.perHour.food, type: "food", extraCapacity: $scope.town.production.extraCapacity.food};
        } else if ($scope.building.type === "stone"){
            console.log($scope.town.production.perHour.stone)
            return {perHour: $scope.town.production.perHour.stone, type: "stone", extraCapacity: $scope.town.production.extraCapacity.stone};
        }
    };

    $scope.troopPreparing = function (troop) {
        if (!(troop.id in $scope.interval)) {
            var a = document.getElementById(troop.id +'Loading');
            var sofar = parseInt((new Date().getTime() - new Date(troop.change_date).getTime())/1000);
            $scope.interval[troop.id] = setInterval(frame, 1000);
        }
        function frame() {
            if (sofar >= troop.preparation_time + 4) {
                clearInterval($scope.interval[troop.id]);
                delete $scope.interval[troop.id];
                a.style.width = '0%';
                a.innerHTML = "Initilazing";
                $rootScope.modalReOpen.status = true;
                $uibModalInstance.close();
            } else {
                sofar++;
                if (troop.preparation_time >= sofar) {
                    a.style.width = sofar *  100 / troop.preparation_time + '%';
                    a.innerHTML = $scope.convertSeconds(troop.preparation_time - sofar);
                } else {a.innerHTML = "Loading!";}
            }
        }
    };

    angular.forEach($scope.troops, function (v) {
        if (v.status === "preparing") {
            if ($scope.building.type === "archery" && v.type === 'archer') {
                $scope.preparing_troops.push(v);
                setTimeout(function() {$scope.troopPreparing(v);}, 500);
            }
            if ($scope.building.type === "stable" && v.type === 'cavalry') {
                $scope.preparing_troops.push(v);
                setTimeout(function() {$scope.troopPreparing(v);}, 500);
            }
            if ($scope.building.type === "barrack" && v.type === 'lancer') {
                $scope.preparing_troops.push(v);
                setTimeout(function() {$scope.troopPreparing(v);}, 500);
            }
        }
    });

    $scope.upBuilding = function () {
        $rootScope.buildingProcess($scope.building, false); // this function is in home.js and second parameter is for isCancel
        $uibModalInstance.close();
    };
    $scope.cancelBuilding = function () {
        $rootScope.buildingProcess($scope.building, true);
        $uibModalInstance.close();
    };

    if ($scope.building.type === "archery") {
        var result = 480 - (Math.pow($scope.building.level, 22/6));
        if (result > 0) {
            $scope.time = result;
        } else {
            $scope.time = 15;
        }
        $scope.initial_troop = {type: 'archer', cost: {food: 900, wood: 400, stone: 300}, preparation_time: $scope.time, img: "images/military/archer/profile.png"};
    } else if ($scope.building.type === "barrack") {
        var res = 360 - (Math.pow($scope.building.level, 22/6));
        if (res > 0) {
            $scope.time = res;
        } else {
            $scope.time = 15;
        }
        $scope.initial_troop = {type: 'lancer', cost: {food: 800, wood: 300, stone: 250}, preparation_time: $scope.time, img: "images/military/lancer/profile.png"};
    } else if ($scope.building.type === "stable") {
        var re = 840 - (Math.pow($scope.building.level, 22/6));
        if (re > 0) {
            $scope.time = re;
        } else {
            $scope.time = 15;
        }
        $scope.initial_troop = {type: 'cavalry', cost: {food: 2500, wood: 650, stone: 500}, preparation_time: $scope.time, img: "images/military/cavalry/profile.png"};
    }

    $scope.train = function () {
        $rootScope.trainNew($scope.initial_troop, false, undefined); // trainProcess(buildingTypeForTrainType, isCancel, idOfTRoop)
        $rootScope.modalReOpen.status = true;
        $uibModalInstance.close();
    };

    $scope.cancel_train = function (troop_id) {
        $rootScope.trainNew($scope.initial_troop, true, troop_id); // trainProcess(troopType, isCancel, idOfTroop)
        $rootScope.modalReOpen.status = true;
        $uibModalInstance.close();
    };

    $scope.checkEnough = function (resourcesType, cost) {
        if (cost !== undefined ? ($scope.resources[resourcesType] >= cost):true) {
            return true;
        }
    };

    $scope.buttonIsAvailable = function (forTroop) {
        if (forTroop === true) {
            if ($scope.town.troop_queue < $scope.town.military_process_limit && $scope.building.status !== 'loading' &&
                $scope.checkEnough('food', $scope.initial_troop.cost.food) &&
                $scope.checkEnough('wood', $scope.initial_troop.cost.wood) &&
                $scope.checkEnough('stone', $scope.initial_troop.cost.stone)) {
                return 'available';
            } else if ($scope.town.troop_queue >= $scope.town.military_process_limit) {
                return 'tainersBusy';
            } else {
                return 'underConstruction';
            }
        } else {
            if ($scope.town.building_queue < $scope.town.building_process_limit && $scope.building.status !== 'loading' && $scope.checkEnough('food', $scope.building.cost.food) &&
                $scope.checkEnough('wood', $scope.building.cost.wood) &&
                $scope.checkEnough('stone', $scope.building.cost.stone) && $scope.preparing_troops.length === 0) {
                    return 'available';
            } else if ($scope.town.building_queue >= $scope.town.building_process_limit && $scope.building.status !== 'loading') {
                return 'buildersBusy';
            } else if ($scope.preparing_troops.length > 0) {
                return 'waitTraining';
            } else if ($scope.building.status === 'loading') {
                return'cancel';
            } else {
                return 'Not Enough Resources';
            }
        }
    };

}]);