angular.module('tableApp', [])
  .controller('TableController', ['$scope', $scope => {
    $scope.records = [];

    $scope.getRecords = () => {
      return $scope.records;
    }

    $scope.addRecords = (records) => {
      $scope.records = [...$scope.records, ...records];
      $scope.$apply();
    };

    $scope.clear = () => {
      $scope.records = [];
    }
  }]);