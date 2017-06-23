angular.module('tableApp', [])
  .controller('TableController', ['$scope', $scope => {
    $scope.files = [];
    $scope.records = [];

    $scope.getFiles = () => {
      return $scope.files;
    }

    $scope.getRecords = () => {
      return $scope.records;
    }

    $scope.addFile = (file) => {
      $scope.files.push(file);
      $scope.$apply();
    };

    $scope.addRecords = (records) => {
      $scope.records = [...$scope.records, ...records];
      $scope.$apply();
    };

    $scope.clear = () => {
      $scope.files = [];
      $scope.records = [];
    }
  }]);