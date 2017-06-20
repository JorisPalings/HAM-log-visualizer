angular.module('tableApp', [])
  .controller('TableController', function() {
    var table = this;

    table.records = ["Sample record", "Another sample record"];

    table.addRecords = (records) => {
      table.records = [...table.records, ...records];
    };

    table.clear = () => {
      table.records = [];
    }
  });