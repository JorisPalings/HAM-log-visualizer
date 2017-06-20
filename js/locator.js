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
    // The ASCII charCode of "A" is 65
    // Lat (North to South) is divided into 18 fields covering 10 degrees each (90° to -90°)
    let minFieldLat = (maidenheadLocator.charCodeAt(1) % 65) * 10;
    // Lng (West to East) is divided into 18 fields covering 20 degrees each
    let minFieldLng = (maidenheadLocator.charCodeAt(0) % 65) * 20;
    // Lat is further subdivided into 10 squares covering 1 degree each
    let minSquareLat = parseInt(maidenheadLocator[3]);
    // Lng is further subdivided into 10 squares covering 2 degrees each
    let minSquareLng = parseInt(maidenheadLocator[2]) * 2;
    // Lat is further subdivided into 24 subsquares covering 2.5 minutes each
    let minSubsquareLat = (maidenheadLocator.charCodeAt(5) % 65) * ((1 / 60) * 2.5);
    // Lng is further subdivided into 24 subsquares covering 5 minutes each
    let minSubsquareLng = (maidenheadLocator.charCodeAt(4) % 65) * ((1 / 60) * 5);

    // Southernmost subsquare bound
    let minLat = minFieldLat + minSquareLat + minSubsquareLat - 90;
    // Northernmost subsquare bound
    let maxLat = minLat + ((1 / 60) * 5);
    // Average subsquare lat
    let avgLat = (minLat + maxLat) / 2;

    // Westernmost subsquare bound
    let minLng = minFieldLng + minSquareLng + minSubsquareLng - 180;
    // Easternmost subsquare bound
    let maxLng = minLng + ((1 / 60) * 2.5);
    // Average subsquare lng
    let avgLng = (minLng + maxLng) / 2;

    return { lat: avgLat, lng: avgLng };
  } catch(exception) {
    console.log(exception.message);
  }
}

module.exports.convert = convert;