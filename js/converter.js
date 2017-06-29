'use strict';

const locator = require('./locator');
const moment = require('../node_modules/moment/moment');
const js2xml = require('../node_modules/js2xmlparser');
const zip = require('../node_modules/adm-zip/adm-zip');

// Possible marker colors with their lower and upper frequency bounds
const markerColors = [
  { color: 'red',     hex: 'ff0000ff',  lower: 0,     upper: 52 }, 
  { color: 'orange',  hex: 'ff0088ff',  lower: 69.95, upper: 70.5 }, 
  { color: 'yellow',  hex: 'ff00ffff',  lower: 144,   upper: 148 }, 
  { color: 'green',   hex: 'ff00ff00',  lower: 430,   upper: 440 }, 
  { color: 'blue',    hex: 'ffff0000',  lower: 1240,  upper: 1300 }, 
  { color: 'purple',  hex: 'ffff00ff',  lower: 2300,  upper: 2450 }, 
  { color: 'grey',    hex: '888888ff',  lower: 5650,  upper: 5850 }, 
  { color: 'white',   hex: 'ffffffff',  lower: 10000, upper: 10500 }, 
  { color: 'black',   hex: '000000ff',  lower: 4770,  upper: Number.MAX_VALUE }
];

// Create an empty in-memory .kmz archive and add an empty "images" directory
let kmz = new zip();
kmz.addFile("images/", new Buffer(""));

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
  // Temporary Array to keep track of which marker colors are used
  // (to include only the required <Style> tags and marker images) in the .kmz archive
  let usedColors = [];
  // Array containing a <Style> tag for every marker color
  let styles = [];
  // Array containing a <Placemark> tag for every record
  let placemarks = [];

  // Default .kml tags
  let data  = {
    "@": {
      "xmlns": "http://www.opengis.net/kml/2.2"
    },
    "Document": {
      "Style": {},
      "Placemark": {}
    }
  }

  records.forEach(record => {
    // Define the marker color for every record
    let currentRecordColor;
    markerColors.forEach(color => {
      if(record.frequency >= color.lower && record.frequency <= color.upper) {
        currentRecordColor = color.color;
        // If the current color is not in the Array of used colors yet, add it
        if(usedColors.indexOf(color) == -1) usedColors.push(color);
      }
    });

    // Add a <Placemark> tag for every record
    placemarks.push({
      "name": record.call,
      "description": `
          <p style="font-family:sans-serif;margin:0;padding:0">${record.dateTime.format("LLL")}</p>
          <p style="font-family:sans-serif;margin:0;padding:0">${record.frequency}</p>
          <p style="font-family:sans-serif;margin:0;padding:0">Sent RST: ${record.sentRST}</p>
          <p style="font-family:sans-serif;margin:0;padding:0">Received RST: ${record.receivedRST}</p>
      `,
      "styleUrl": `#${currentRecordColor}`,
      "Point": {
        // KML uses {lng, lat} coordinates rather than {lat, lng}
        "coordinates": `${locator.convert(record.gridSquare).lng},${locator.convert(record.gridSquare).lat}`
      }
    });
  });

  // Add a <Style> tag for every used color
  usedColors.forEach(color => {
    styles.push({
      "@": {
        "id": color.color
      },
      "IconStyle": {
        "color": color.hex
      }
    });
  });

  data["Document"]["Style"] = styles;
  data["Document"]["Placemark"] = placemarks;

  let kml = js2xml.parse('kml', data);

  console.log(kml);
  
  kmz.addFile("map.kml", new Buffer(kml));
  kmz.writeZip(path);
}

//module.exports.toKML = toKML;
module.exports.toKMZ = toKMZ;