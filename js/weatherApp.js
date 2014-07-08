'use strict';

var app = angular.module('weatherApp', []);

app.controller("weatherCtrl", ['$scope', 'weatherService', function ($scope,weather) {    
    $scope.metric = 'C';
    $scope.loading = false;
    $scope.cityName = '';
    $scope.cityTitle = 'City Name';
	$scope.cities = {};
	$scope.forecast = {};
    $scope.loadForecast=function(e){
    	$scope.getForecast($scope.cityName, 'q');
    }

    $scope.getForecast = function(value, type){
        $scope.loading = true;
        weather.forecast(value, type).then(function(data){
            console.log(data);
            if(data.data.cod == 200){
                $scope.currentForecast = data.data.city.id;
                console.log(data.data.city);
                $scope.cities[$scope.currentForecast] = data.data.city;
                $scope.forecast[$scope.currentForecast] = data.data;
                $scope.cityTitle = $scope.forecast[$scope.currentForecast].city.name + ', ' + $scope.forecast[$scope.currentForecast].city.country;
                console.log($scope.cities);
                console.log($scope.forecast);
            }else{
                console.log("Not found");
            }
            $scope.cityName = '';
            $scope.loading = false;
        });
    }

    $scope.getDayTemprature = function(temprature){
        if(typeof temprature == 'undefined') temprature = 0;
        return Math.round(temprature - 273.15); //Convert Kelvin to Celsius
    }

    $scope.getCurrentLocation = function(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.getCurrentLocationForecast);
        } else {
            x.innerHTML = "Geolocation is not supported by this browser.";
        }
    }

    $scope.getCurrentLocationForecast = function(position){
        $scope.getForecast({lat: position.coords.latitude.toFixed(2), lon: position.coords.longitude.toFixed(2)}, 'latlong');
        
    }

    $scope.isEmpty = function (obj) {
       return angular.equals({},obj); 
    };
}]);

app.factory('weatherService',['$http',function($http){
    return {
        forecast : function(locationName, type){            
            if(typeof type == 'undefined') type = 'q';
            var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?';
            if(type == 'latlong'){
                url += 'lat='+locationName.lat+'&lon='+locationName.lon;
            }else{
                url += type+'='+locationName;
            }
            url += '&cnt=14&APPID=5667aae51435fa9043509ac68ae0ea8a&callback=JSON_CALLBACK';
            return $http.jsonp(url);
        }
    }
}]);

app.filter('capitalize', function() {
    return function(input, scope) {
        if (input!=null)
            return input.substring(0,1).toUpperCase()+input.substring(1);
    }
});