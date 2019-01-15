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


    let doughnutPieData = {
        datasets: [{
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: []
    };
    let doughnutPieOptions = {
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };

    let doughnutPieDataCategory = {
        datasets: [{
            data: [],
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: []
    };
    let doughnutPieOptionsCategory = {
        responsive: true,
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };



    let data = { select: "language" };

    $http({
        method: "POST",
        url: "/countQueries",
        data: data
    }).then(function successCallback(response) {
        // $rootScope.data = response.data;
        // console.log(response.data);

        let data = JSON.parse(response.data);

        for (i in data) {
            // console.log(doughnutPieData.datasets[0])
            doughnutPieData.datasets[0].data.push(data[i].occurences);
            doughnutPieData.labels.push(data[i].language);
        }

        $scope.refreshLanguageChart();

    }), function errorCallback(response) {
        console.log("Error while fetching user data!");
    }

    data = { select: "category" };

    $http({
        method: "POST",
        url: "/countQueries",
        data: data
    }).then(function successCallback(response) {
        // $rootScope.data = response.data;
        // console.log(response.data);

        let data = JSON.parse(response.data);

        for (i in data) {
            // console.log(doughnutPieDataCategory.datasets[0])
            doughnutPieDataCategory.datasets[0].data.push(data[i].occurences);
            doughnutPieDataCategory.labels.push(data[i].category);
        }

        $scope.refreshCategoryChart();

    }), function errorCallback(response) {
        console.log("Error while fetching user data!");
    }


    $scope.refreshLanguageChart = function () {
        if ($("#doughnutChart").length) {
            let doughnutChartCanvas = $("#doughnutChart").get(0).getContext("2d");
            let doughnutChart = new Chart(doughnutChartCanvas, {
                type: "doughnut",
                data: doughnutPieData,
                options: doughnutPieOptions
            });
        }
    }

    $scope.refreshCategoryChart = function () {
        if ($("#doughnutChartCategory").length) {
            let doughnutChartCanvas = $("#doughnutChartCategory").get(0).getContext("2d");
            let doughnutChart = new Chart(doughnutChartCanvas, {
                type: "doughnut",
                data: doughnutPieDataCategory,
                options: doughnutPieOptionsCategory
            });
        }
    }

});