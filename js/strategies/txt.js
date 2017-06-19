'use strict';

// Contains the model for the uniform Record object
const Record = require('../models/record').Record;
// External library for more convenient Date manipulation
const moment = require('../../node_modules/moment/moment');

// Define the Record class
function TxtRecord(date, time, frequency, mode, myCall, sentRST, myExchange, 
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
    records[recordIndex] = new TxtRecord(...(record.trim().split(/\s+/g)));
  });

  return records;
}

// Return only the necessary fields of the file's records in the form of a
// uniform Record object
const uniformParse = function(file, fileContents) {
  let records = parse(file, fileContents);
  let uniformRecords = [];
  records.forEach(record => {
    uniformRecords.push(new Record(
      record.call,
      moment(record.date + record.time, "YYYYMMDDhhmm"),
      parseFloat(record.frequency.replace(',', '.')) / 1000,
      record.sentRST,
      record.receivedRST,
      record.gridSquare
    ));
  });
  return uniformRecords;
}

module.exports.parse = parse;
module.exports.uniformParse = uniformParse;