'use strict';

var app = angular.module('weatherApp', []);

app.controller("weatherCtrl", ['$scope', 'weatherService', function ($scope,weather) {    
    $scope.metric = 'C';
    $scope.metricText = '° '+$scope.metric;
    
    $scope.searchButtonText="Search";
    $scope.cityName = 'Ahmedabad, India';
    $scope.cityTitle = 'City Name';
	$scope.cities = {};
	$scope.forecast = {};
    $scope.loadForecast=function(e){
    	console.log($scope.cityName);
        weather.forecast($scope.cityName).then(function(data){
        	console.log(data);
        	$scope.currentForecast = data.data.city.id;
            console.log(data.data.city);
        	$scope.cities[$scope.currentForecast] = data.data.city;
            $scope.forecast[$scope.currentForecast] = data.data;
            $scope.cityTitle = $scope.forecast[$scope.currentForecast].city.name + ', ' + $scope.forecast[$scope.currentForecast].city.country;
        console.log($scope.cities);
        console.log($scope.forecast);
        });
    }

    $scope.getDayTemprature = function(temprature){
        if(typeof temprature == 'undefined') temprature = 0;
        return Math.round(temprature - 273.15); //Convert Kelvin to Celsius
    }
}]);

app.factory('weatherService',['$http',function($http){
    return {
        forecast : function(locationName){
            return $http.jsonp('http://api.openweathermap.org/data/2.5/forecast/daily?q='+locationName+'&cnt=14&APPID=xxxxx&callback=JSON_CALLBACK');
        }
    }
}]);