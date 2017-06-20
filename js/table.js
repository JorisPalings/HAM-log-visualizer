angular.module('tableApp', [])
  .controller('TableController', ['$scope', $scope => {
    $scope.records = ["A", "B", "C"];

    $scope.addRecords = (records) => {
      $scope.records = [...$scope.records, ...records];
      $scope.$apply();
    };

    $scope.clear = () => {
      $scope.records = [];
      $scope.$apply();
    }
  }]);