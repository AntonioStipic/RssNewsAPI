var app = angular.module("RssNewsAPI", []);

app.controller("KeysController", function ($rootScope, $scope, $http) {

    $scope.loaderShow = true;

    $http({
        method: "POST",
        url: "/fetchUserData"
    }).then(function successCallback(response) {
        $rootScope.data = response.data;
    }), function errorCallback(response) {
        console.log("Error while fetching user data!");
    }

    $http({
        method: "POST",
        url: "/fetchApiKeys"
    }).then(function successCallback(response) {
        $scope.keys = response.data;
        $scope.loaderShow = false;
        // console.log(response);
    }), function errorCallback(response) {
        console.log("Error while fetching user data!");
    }

});