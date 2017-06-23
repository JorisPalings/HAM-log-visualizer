'use strict';

// Model for the uniform Record returned by all different parsing strategies
function Record(fileName, call, dateTime, frequency, sentRST, receivedRST, gridSquare) {
    this.fileName = fileName,
    this.call = call;
    this.dateTime = dateTime;
    this.frequency = frequency;
    this.sentRST = sentRST;
    this.receivedRST = receivedRST;
    this.gridSquare = gridSquare;
  }

module.exports.Record = Record;