'use strict';

// Define the Record class
function Record(frequency, mode, date, time, myCall, sentRST, myExchange,
  call, receivedRST, exchange, gridSquare) {
    this.frequency = frequency;
    this.mode = mode;
    this.date = date;
    this.time = time;
    this.myCall = myCall;
    this.sentRST = sentRST;
    this.myExchange = myExchange;
    this.call = call;
    this.receivedRST = receivedRST;
    this.exchange = exchange;
    this.gridSquare = gridSquare;
  }

const parse = function(file, fileContents) {
  // Split the file's contents into the header (before the first QSO)
  // and the records
  let fileParts = fileContents.split(/QSO:/);
  let header = fileParts[0];
  let records = fileParts.slice(1);
  // Split the header into separate fields
  let headerFields = header.trim().split(/\n/g);
  // Split fields into [key, value] Arrays
  headerFields.forEach((field, fieldIndex) => {
    headerFields[fieldIndex] = field.split(': ');
  });
  // Turn the field [key, value] Arrays into properties of the header Object
  header = {};
  headerFields.forEach(field => {
    header[field[0]] = field[1];
  });

  // Remove all whitespace and the END-OF-LOG tag from the records
  // Split each record into fields and turn it into a Rescord object
  records.forEach((record, recordIndex) => {
    records[recordIndex] = new Record(...(record.replace('END-OF-LOG:', '').trim().split(/ +/g)));
  });
  
  console.log(header);
  console.log(records);
}

const uniformParse = function(file, fileContents) {
  parse(file, fileContents);
}

module.exports.parse = parse;
module.exports.uniformParse = uniformParse;