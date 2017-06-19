'use strict';

const adiParser = require('./strategies/adi');
const ediParser = require('./strategies/edi');
const logParser = require('./strategies/log');
const txtParser = require('./strategies/txt');

function FileFormatException(message) {
   this.message = message;
   this.name = 'FileFormatException';
}

const parse = function(file, fileContents) {
  let fileName = file.name.toLowerCase();
  if(fileName.endsWith('.adi')) {
    adiParser.parse(file, fileContents);
  } else if(fileName.endsWith('.edi')) {
    ediParser.parse(file, fileContents);
  } else if(fileName.endsWith('.log')) {
    logParser.parse(file, fileContents);
  } else if(fileName.endsWith('.txt')) {
    txtParser.parse(file, fileContents);
  } else {
    throw new FileFormatException(`Invalid file format: "${file.name.slice(file.name.lastIndexOf('.'))}"`);
  }
}

module.exports.parse = parse;