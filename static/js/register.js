var app = angular.module("RssNewsAPI", []);

app.controller("RegisterController", function ($rootScope, $scope, $http) {

    $scope.email = "";
    $scope.username = "";
    $scope.password = "";
    $scope.password2 = "";

    $scope.register = function () {

        if (validateEmail($scope.email)) {
            if ($scope.password.replace(/ /g, "") == "" || $scope.username.replace(/ /g, "") == "" || $scope.email.replace(/ /g, "") == "" || $scope.password2.replace(/ /g, "") == "") {
                Swal({
                    type: 'error',
                    title: 'Oops...',
                    text: 'All fields must be filled!'
                })
            } else {
                if ($scope.password == $scope.password2) {
                    if ($scope.password.length < 6) {
                        Swal({
                            type: 'error',
                            title: 'Oops...',
                            text: 'Password must be at least 6 characters long!'
                        })
                    } else {
                        let data = {username: $scope.username, password: $scope.password, email: $scope.email};
                        $http({
                            method: "POST",
                            url: "/register",
                            data: data
                        }).then(function successCallback(response) {

                            // console.log(response.data);
                            if (response.data.code == 200) {
                                Swal({
                                    type: 'success',
                                    title: 'Success!',
                                    text: response.data.message
                                }).then( () => {
                                    
                                    window.location.replace("/login");

                                });
                            } else {
                                Swal({
                                    type: 'error',
                                    title: 'Oops!',
                                    text: response.data.message
                                })
                            }

                        }), function errorCallback(response) {
                            console.log("Error while registering!");
                        }
                    }
                } else {
                    Swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Passwords do not match!'
                    })
                }
            }
        } else {
            Swal({
                type: 'error',
                title: 'Oops...',
                text: 'Enter valid email!'
            })
        }

    }

});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}