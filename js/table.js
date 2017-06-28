angular.module('tableApp', [])
  .controller('TableController', ['$scope', $scope => {
    $scope.files = [];
    $scope.records = [];

    $scope.isSaveModalOpen = false;

    // Return the names of all loaded files
    $scope.getFiles = () => {
      return $scope.files;
    }

    // Return all records in all loaded files
    $scope.getRecords = () => {
      return $scope.records;
    }

    // Add a file's name to the list of files
    $scope.addFile = file => {
      $scope.files.push(file);
      $scope.$apply();
    }

    // Delete a file from the list of files and
    // its records from the list of records
    $scope.deleteFile = file => {
      $scope.files.splice($scope.files.indexOf(file), 1);
      $scope.deleteRecords(file);
    }

    // Add records to the list of records
    $scope.addRecords = records => {
      $scope.records = [...$scope.records, ...records];
      $scope.$apply();
    }

    // Delete the records from the given file
    // from the list of records
    $scope.deleteRecords = file => {
      $scope.records = $scope.records.filter(record => record.fileName != file);
    }

    // Clear all files, as well as all records
    $scope.clear = () => {
      $scope.files = [];
      $scope.records = [];
    }
  }]);