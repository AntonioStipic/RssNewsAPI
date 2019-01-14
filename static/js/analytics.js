var app = angular.module("RssNewsAPI", []);

app.controller("AnalyticsController", function ($rootScope, $scope, $http) {

    $http({
        method: "POST",
        url: "/fetchUserData"
    }).then(function successCallback(response) {
        $rootScope.data = response.data;
    }), function errorCallback(response) {
        console.log("Error while fetching user data!");
    }

});