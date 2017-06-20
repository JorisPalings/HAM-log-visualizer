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
    return adiParser.uniformParse(file, fileContents);
  } else if(fileName.endsWith('.edi')) {
    return ediParser.uniformParse(file, fileContents);
  } else if(fileName.endsWith('.log')) {
    return logParser.uniformParse(file, fileContents);
  } else if(fileName.endsWith('.txt')) {
    return txtParser.uniformParse(file, fileContents);
  } else {
    throw new FileFormatException(`Invalid file format: "${file.name.slice(file.name.lastIndexOf('.'))}"`);
  }
}

module.exports.parse = parse;