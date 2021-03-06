// http://www.adif.org/305/ADIF_305.htm

'use strict';

// Contains the model for the uniform Record object
const Record = require('../models/record').Record;
// External library for more convenient Date manipulation
const moment = require('../../node_modules/moment/moment');

const delimiterTags = {
  header: {
    upper: '<EOH>',
    lower: '<eoh>',
    camel: '<Eoh'
  },
  record: {
    upper: '<EOR>',
    lower: '<eor>',
    camel: '<Eor>'
  }
}

// Assume uppercase
let delimiterTagCase = 'upper';

const parse = function(file, fileContents) {
  // Split the .adi file into its header (before the <eoh> or <EOH> tag)
  // and its list of records (calls)
  // Start by figuring out the case of the tags
  if(fileContents.indexOf(delimiterTags.record.upper != 1)) {
    delimiterTagCase = 'upper';
  } else if(fileContents.indexOf(delimiterTags.record.lower != 1)) {
    delimiterTagCase = 'lower';
  } else if(fileContents.indexOf(delimiterTags.record.camel != 1)) {
    delimiterTagCase = 'camel';
  }

  let [header, records] = fileContents.split(delimiterTags.header[delimiterTagCase]);

  // Split the String containing the list of calls into an Array
  // Each call ends with an end-of-record (<eor> or <EOR>) tag
  // Filter out all whitespace and empty Array elements
  records = records.replace(/\s/g, '').split(delimiterTags.record[delimiterTagCase]).filter(String);
  records.forEach((record, recordIndex) => {
    // Split each record into its separate fields <F:L:T>
    // Filter out all empty Array elements
    // Drop the data length
    records[recordIndex] = record.split(/</g).filter(String);
    records[recordIndex].forEach((field, fieldIndex) => {
      records[recordIndex][fieldIndex] = field.split(/\:[0-9]>/g);
    });
  });

  // We now have an Array of records, where every record contains 
  // an Array of fields, and every field contains a [key, value] Array

  // Create an Array with an Object for every record in the Array of records, 
  // and add every field [key, value] Array as an Object property
  let calls = [];
  records.forEach(record => {
    let call = {};
    record.forEach(field => {
      call[field[0]] = field[1];
    })
    calls.push(call);
  });
  return calls;
}

// Return only the necessary fields of the file's records in the form of a
// uniform Record object
const uniformParse = function(file, fileContents) {
  let records = parse(file, fileContents);
  let uniformRecords = [];
  records.forEach(record => {
    uniformRecords.push(new Record(
      file.name,
      record["CALL"],
      moment(record["QSO_DATE"] + record["TIME_ON"], "YYYYMMDDHHmmss"),
      parseFloat(record["FREQ"]),
      record["RST_SENT"],
      record["RST_RCVD"],
      record["GRIDSQUARE"]
    ));
  });
  return uniformRecords;
}

module.exports.parse = parse;
module.exports.uniformParse = uniformParse;