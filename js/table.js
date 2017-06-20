angular.module('tableApp', [])
  .controller('TableController', ['$scope', $scope => {
    $scope.records = [];

    $scope.addRecords = (records) => {
      console.log('entered addRecords');
      console.log('current records', $scope.records);
      console.log('new records', records);
      $scope.records = [...$scope.records, ...records];
      console.log('current + new records', $scope.records);
      $scope.$apply();
    };

    $scope.clear = () => {
      console.log('entered clear');
      $scope.records = [];
      console.log('cleared records', $scope.records);
    }
  }]);