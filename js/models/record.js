'use strict';

function Record(call, dateTime, frequency, sentRST, receivedRST, gridSquare) {
    this.call = call;
    this.dateTime = dateTime;
    this.frequency = frequency;
    this.sentRST = sentRST;
    this.receivedRST = receivedRST;
    this.gridSquare = gridSquare;
  }

module.exports.Record = Record;