var app = angular.module("RssNewsAPI", []);

app.controller("KeysController", function ($rootScope, $scope, $http) {

    $scope.loaderShow = true;

    $scope.refreshKeys = function () {
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
    }

    $http({
        method: "POST",
        url: "/fetchUserData"
    }).then(function successCallback(response) {
        $rootScope.data = response.data;
    }), function errorCallback(response) {
        console.log("Error while fetching user data!");
    }

    $scope.refreshKeys();

    $scope.editKey = async function (key) {
        // swal({
        //     text: "Rename key:",
        //     // content: "input",
        //     inputValue: "test",
        //     showCancelButton: true,
        //     input: 'email',
        //     button: {
        //         text: "Rename"
        //     },
        // })
        //     .then(name => {
        //         console.log(name);
        //     })

        const { value: name } = await Swal({
            title: "Change key name:",
            input: "text",
            inputValue: key.name,
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && "You need to write something!";
            }
        })

        if (name != key.name) {
            let data = { keyID: key.keyID, name: name };
            $http({
                method: "POST",
                url: "/renameApiKey",
                data: data
            }).then(function successCallback(response) {
                console.log(response);

                $scope.refreshKeys();
            }), function errorCallback(response) {
                console.log("Error while renaming key!");
            }
        }
    }

    $scope.deleteKey = function (keyID) {

        Swal({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes"
        }).then((result) => {
            if (result.value) {

                console.log(keyID);

                let data = { keyID: keyID };
                $http({
                    method: "POST",
                    url: "/deleteApiKey",
                    data: data
                }).then(function successCallback(response) {

                    $scope.refreshKeys();

                    Swal(
                        "Deleted!",
                        "Your API key has been deleted.",
                        "success"
                    )

                    console.log(response);
                }), function errorCallback(response) {
                    console.log("Error while deleting key!");
                }

            }
        });
    }


    $scope.createKey = async function () {
        const { value: name } = await Swal({
            title: "New key name:",
            input: "text",
            inputValue: "",
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && "Key name cannot be empty!";
            }
        })

        if (name) {
            let data = { name: name };
            $http({
                method: "POST",
                url: "/createApiKey",
                data: data
            }).then(function successCallback(response) {
                console.log(response);

                $scope.refreshKeys();
            }), function errorCallback(response) {
                console.log("Error while creating key!");
            }
        }

    }

});