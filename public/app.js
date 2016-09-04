angular.module('myApp', ['ngMaterial']).

controller("mainController", function mainController($scope, $http) {

  $scope.searchTermName = "";
  $scope.searchTermType = "";
  $scope.searchTermLocation = "";
  $scope.searchTermAKing = "";
  $scope.searchTermDKing = "";

  $scope.url = "api/battles/list";
  $scope.resultCount = 0;
  $scope.battles = [];

  $scope.stats  = {};

  listBattles($scope);
  countBattles($scope);
  getStats($scope);

  $scope.search = function () {
    $scope.url = "api/battles/search";
    searchBattles($scope);
  }

  function listBattles($scope) {
    $http.get($scope.url)
        .success(function (data, status, headers, config) {
          $scope.resultCount = data.length;
          $scope.battles = data;
          
        })
        .error(function (data, status, headers, config) {
          console.log('Error: ' + data);
          $scope.resultCount = 0;
          $scope.battles = [];
        });
  }

  function countBattles($scope) {

    var url = "api/battles/count";
    $http.get(url)
        .success(function (data, status, headers, config) {
          $scope.resultCount = data;

        })
        .error(function (data, status, headers, config) {
          console.log('Error: ' + data);
          $scope.resultCount = 0;
        });
  }

  function searchBattles($scope) {
    var url = "api/battles/search";
    var q = "?";
    var temp;
    if ($scope.searchTermName != "") {
      temp = "name=" + $scope.searchTermName;
      if (q == "?") {
        q = q + temp;
      } else {
        q = q + '&' + temp;
      }
    }
    if ($scope.searchTermType != "") {
      temp = "type=" + $scope.searchTermType;
      if (q == "?") {
        q = q + temp;
      } else {
        q = q + '&' +  temp;
      }
    }
    if ($scope.searchTermLocation != "") {
      temp = "location=" + $scope.searchTermLocation;
      if (q == "?") {
        q = q + temp;
      } else {
        q = q + '&' +  temp;
      }
    }
    if ($scope.searchTermAKing != "") {
      temp = "attacker_king=" + $scope.searchTermAKing;
      if (q == "?") {
        q = q + temp;
      } else {
        q = q + '&' +  temp;
      }
    }
    if ($scope.searchTermDKing != "") {
      temp = "defender_king=" + $scope.searchTermDKing;
      if (q == "?") {
        q = q + temp;
      } else {
        q = q + '&' +  temp;
      }
    }

    if (q != "?") {
      url = url +q;
    }

    $http.get(url)
        .success(function (data, status, headers, config) {
          $scope.resultCount = data.length;
          $scope.battles = data;

        })
        .error(function (data, status, headers, config) {
          console.log('Error: ' + data);
          $scope.resultCount = 0;
          $scope.battles = [];
        });
  }

  function getStats($scope) {
    $http.get("api/battles/stats")
        .success(function (data, status, headers, config) {
          $scope.stats = data;

        })
        .error(function (data, status, headers, config) {
          console.log('Error: ' + data);
          $scope.stats = data;
        });
  }

});
