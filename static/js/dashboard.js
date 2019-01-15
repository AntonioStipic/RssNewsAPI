var app = angular.module("RssNewsAPI", []);

app.controller("DashboardController", function ($rootScope, $scope, $http) {

    $scope.exampleURL = "newsapi.xyz/news?appid={APPID}&category={CATEGORY}&limit={LIMIT}";
    $scope.exampleOutput = `[{\n\t"id": 1610,\n\t"title": "Trump treats the border like a natural disaster. He even dresses the part.",\n\t"description": "Trump has a uniform he wears to visit hurricanes and wildfires — and it says a lot that he wore it to the Mexico border.",\n\t"link": "{LINK}",\n\t"language": "en",\n\t"category": "latest",\n\t"time": 1547464873\n}]`;

    $http({
        method: "POST",
        url: "/fetchUserData"
    }).then(function successCallback(response) {
        $rootScope.data = response.data;
    }), function errorCallback(response) {
        console.log("Error while fetching user data!");
    }

});