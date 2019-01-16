var app = angular.module("RssNewsAPI", []);

app.controller("LoginController", function ($rootScope, $scope, $http) {

    $scope.username = "";
    $scope.password = "";


    $scope.login = function () {
        let data = { username: $scope.username, password: $scope.password };
        $http({
            method: "POST",
            url: "/login",
            data: data
        }).then(function successCallback(response) {

            console.log(response.data);
            if (response.data.code == 200) {
                window.location.replace("/dashboard");
            } else {
                Swal({
                    type: 'error',
                    title: 'Oops!',
                    text: response.data.message
                })
            }

        }), function errorCallback(response) {
            console.log("Error while login!");
        }
    }

});
