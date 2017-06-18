'use strict';

// Define the Record class
function Record(date, time, frequency, mode, myCall, sentRST, myExchange, 
  myGridSquare, call, receivedRST, exchange, gridSquare) {
    this.date = date;
    this.time = time;
    this.frequency = frequency;
    this.mode = mode;
    this.myCall = myCall;
    this.sentRST = sentRST;
    this.myExchange = myExchange;
    this.myGridSquare = myGridSquare;
    this.call = call;
    this.receivedRST = receivedRST;
    this.exchange = exchange;
    this.gridSquare = gridSquare;
  }

const parse = function(file, fileContents) {
  // Split the file's contents on newlines
  let records = fileContents.trim().split(/\n/g);

  // If the first mine of the file's contents doesn't start with a number (date),
  // remove it
  if(!records[0].charAt(0).match(/[0-9]1/g)) {
    records.shift();
  }

  // Turn each record string into a Record Object
  records.forEach((record, recordIndex) => {
    records[recordIndex] = new Record(...(record.trim().split(/\s+/g)));
  })
  
  console.log(records);
}

module.exports.parse = parse;