'use strict';

function LocatorFormatException(message) {
   this.message = message;
   this.name = 'LocatorFormatException';
}

function checkIsValidLocatorFormat(maidenheadLocator) {
  // The first pair (field) encodes with base 18 and the letters "A" to "R"
  // The second pair (square) encodes with base 10 and the digits "0" to "9"
  // The third pair (subsquare) encodes with base 24 and the letters "A" to "X"
  if(!maidenheadLocator.match(/[A-R]{2}[0-9]{2}[A-X]{2}/g)) {
    throw new LocatorFormatException(`Invalid Maidenhead locator format: "${maidenheadLocator}"`);
  }
}

const convert = function(maidenheadLocator) {
  maidenheadLocator = maidenheadLocator.toUpperCase();
  try {
    // Make sure the Maidenhead locator is valid
    checkIsValidLocatorFormat(maidenheadLocator);
    
  } catch(exception) {
    console.log(exception.message);
  }
}

module.exports.convert = convert;