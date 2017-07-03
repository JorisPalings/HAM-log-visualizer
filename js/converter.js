'use strict';

const locator = require('./locator');
const moment = require('../node_modules/moment/moment');
const js2xml = require('../node_modules/js2xmlparser');
const zip = require('../node_modules/adm-zip/adm-zip');

// Possible marker colors with their hex value (ABGR), lower and upper frequency bounds
const markerColors = [
  { color: 'red',     hex: 'ff0000ff',  lower: 0,     upper: 52 }, 
  { color: 'orange',  hex: 'ff0088ff',  lower: 69.95, upper: 70.5 }, 
  { color: 'yellow',  hex: 'ff00ffff',  lower: 144,   upper: 148 }, 
  { color: 'green',   hex: 'ff00ff00',  lower: 430,   upper: 440 }, 
  { color: 'blue',    hex: 'ffff0000',  lower: 1240,  upper: 1300 }, 
  { color: 'purple',  hex: 'ffff0088',  lower: 2300,  upper: 2450 }, 
  { color: 'grey',    hex: 'ff888888',  lower: 5650,  upper: 5850 }, 
  { color: 'white',   hex: 'ffffffff',  lower: 10000, upper: 10500 }, 
  { color: 'black',   hex: 'ff000000',  lower: 47000,  upper: Number.MAX_VALUE }
];


const toKMZ = function(records, markerColor, path) {
  // Create an empty in-memory .kmz archive
  let kmz = new zip();
  //kmz.addFile("images/", new Buffer(""));
  console.log(records, markerColor, path);
  // Temporary Array to keep track of which marker colors are used
  // to include only the minimum required <Style> tags and avoid unnecessary duplicates
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
    let currentRecordColor;
    // Define the marker color for every record
    // Only required when setting marker color by band
    if(markerColor == 'band') {
      markerColors.forEach(color => {
        // Determine marker color based on frequency
        if(record.frequency >= color.lower && record.frequency <= color.upper) {
          currentRecordColor = color.color;
          // If the current color is not in the Array of used colors yet, add it
          if(usedColors.indexOf(color) == -1) usedColors.push(color);
        }
      });
    } else {
      let currentColor = markerColors.find(color => color.color == markerColor);
      console.log('currentColor', currentColor);
      currentRecordColor = currentColor.color;
      console.log('currentRecordColor', currentRecordColor);
      if(usedColors.indexOf(currentColor) == -1) usedColors.push(currentColor);
      console.log(usedColors);
    }

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

  // Add a <Style> tag to the styles Array for every used color
  usedColors.forEach(color => {
    styles.push({
      "@": {
        "id": color.color
      },
      "IconStyle": {
        "color": color.hex,
        "Icon": {
          //"href": `${color.color}.png`
          "href": "http://maps.google.com/mapfiles/kml/pushpin/wht-pushpin.png"
        }
      }
    });
    //kmz.addLocalFile(`./img/markers/${color.color}.png`, `${color.color}.png`);
  });

  // Add the <Style> tags in the styles Array to the data Object
  data["Document"]["Style"] = styles;
  // Add the <Placemark> tags in the placemarks Array to the data Object
  data["Document"]["Placemark"] = placemarks;

  // Convert the data Object to .kml (XML)
  let kml = js2xml.parse('kml', data);

  console.log(kml);
  
  // Compress the .kml file to a .kmz (zipped) archive
  kmz.addFile("doc.kml", new Buffer(kml));
  console.log(kmz.getEntries());
  kmz.writeZip(path);
}

module.exports.toKMZ = toKMZ;