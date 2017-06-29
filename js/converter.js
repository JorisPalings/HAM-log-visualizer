'use strict';

const locator = require('./locator');
const moment = require('../node_modules/moment/moment');
const js2xml = require('../node_modules/js2xmlparser');
const zip = require('../node_modules/adm-zip/adm-zip');

// const toKML = function(records) {
//   let placemarks = [];
//   // Default .kml tags
//   let data  = {
//     "@": {
//       "xmlns": "http://www.opengis.net/kml/2.2"
//     },
//     "Document": {
//       "Placemark": {}
//     }
//   }
//   // Add a <Placemark> tag for every record
//   records.forEach(record => {
//     placemarks.push({
//       "name": record.call,
//       "description": `
//           <p style="font-family:sans-serif;margin:0;padding:0">${record.dateTime.format("LLL")}</p>
//           <p style="font-family:sans-serif;margin:0;padding:0">${record.frequency}</p>
//           <p style="font-family:sans-serif;margin:0;padding:0">Sent RST: ${record.sentRST}</p>
//           <p style="font-family:sans-serif;margin:0;padding:0">Received RST: ${record.receivedRST}</p>
//       `,
//       "Point": {
//         // KML uses {lng, lat} coordinates rather than {lat, lng}
//         "coordinates": `${locator.convert(record.gridSquare).lng},${locator.convert(record.gridSquare).lat}`
//       }
//     });
//   });
//   data["Document"]["Placemark"] = placemarks;
//   return js2xml.parse('kml', data);
// }

const toKMZ = function(records, markerColor, path) {
  let placemarks = [];
  // Default .kml tags
  let data  = {
    "@": {
      "xmlns": "http://www.opengis.net/kml/2.2"
    },
    "Document": {
      "Placemark": {}
    }
  }
  // Add a <Placemark> tag for every record
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
  let kml = js2xml.parse('kml', data);
  
  let kmz = new zip();
  kmz.addFile("map.kml", new Buffer(kml));
  kmz.writeZip(path);
}

//module.exports.toKML = toKML;
module.exports.toKMZ = toKMZ;