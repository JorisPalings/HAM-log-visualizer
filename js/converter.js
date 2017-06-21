'use strict';

const locator = require('./locator');
const moment = require('../node_modules/moment/moment')
const js2xml = require('../node_modules/js2xmlparser');

const toKML = function(records) {
  let placemarks = [];
  let data  = {
    "@": {
      "xmlns": "http://www.opengis.net/kml/2.2"
    },
    "Document": {
      "Placemark": {}
    }
  }
  records.forEach(record => {
    placemarks.push({
      "name": record.call,
      "description": `
          <p style="font-family:sans-serif;margin:0;padding:0">${record.dateTime.format("LLL")}</p>
          <p style="font-family:sans-serif;margin:0;padding:0">${record.frequency}</p>
          <p style="font-family:sans-serif;margin:0;padding:0">Sent RST: ${record.sentRST}</p>
          <p style="font-family:sans-serif;margin:0;padding:0">Received RST: ${record.receivedRST}</p>
      `,
      "Point": {
        // KML uses {lng, lat} coordinates rather than {lat, lng}
        "coordinates": `${locator.convert(record.gridSquare).lng},${locator.convert(record.gridSquare).lat}`
      }
    });
  });
  data["Document"]["Placemark"] = placemarks;
  return js2xml.parse('kml', data);
}

module.exports.toKML = toKML;