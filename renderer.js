// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

'use strict';

const parser = require('./js/parser');
const converter = require('./js/converter');
const {dialog} = require('electron').remote;
const fs = require('fs');

(() => {
  const dropzone = document.getElementsByTagName('body')[0];

  dropzone.ondragover = (event) => {
    dropzone.classList.add('dragover');
    return false;
  }

  dropzone.ondragleave = (event) => {
    dropzone.classList.remove('dragover');
    return false;
  }

  dropzone.ondragend = (event) => {
    dropzone.classList.remove('dragover');
    return false;
  }

  dropzone.ondrop = (event) => {
    // Stop the browser window from simply displaying the dropped file
    event.stopPropagation();
    event.preventDefault();

    // Remove the CSS
    dropzone.classList.remove('dragover')

    for(let i = 0; i < event.dataTransfer.files.length; i ++) {
      handleFileUpload(event.dataTransfer.files[i]);
    }
    return false;
  } 

  const fileUpload = document.getElementsByClassName('file-upload__input')[0];
  fileUpload.onchange = (event) => {
    for(let i = 0; i < event.target.files.length; i ++) {
      handleFileUpload(event.target.files[i]);
    }
    // Reset the input's value, otherwise the onchange event is not fired 
    // and the same file cannot be uploaded twice in a row
    fileUpload.value = null;
    return false;
  }
})()

function handleFileUpload(file) {
  let fileReader = new FileReader();

  // When the File is read entirely, process its contents
  fileReader.onload = () => {
    const selectedFile = document.getElementsByClassName('file-upload__uploaded-file-name')[0];
    try {
      // Make sure the file is of a valid format (.adi, .edi, .log or .txt)
      angular.element(document.getElementById('table')).scope().addRecords(parser.parse(file, fileReader.result));
      // If the file is valid, show its name and size
      selectedFile.innerHTML = `Loaded file: "${file.name}" (${bytesToSize(file.size)})`;
      selectedFile.classList.remove('upload-failed');
      selectedFile.classList.add('upload-successful');
      // Add an onclick event handler to the "Save as .kml" button
      let convertButton = document.getElementsByClassName('table-controls__convert-button button')[0];
      convertButton.onclick = () => {
        saveToKML();
      }
    } catch(exception) {
      // If the file is invalid, show an error message
      console.log(exception.message);
      document.getElementsByClassName('file-upload__uploaded-file-name')[0].innerHTML = exception.message;
      selectedFile.classList.remove('upload-successful');
      selectedFile.classList.add('upload-failed');
    }
  }

  // Read the File's contents from its reference
  fileReader.readAsText(file);
}

// Convert file size in bytes to a more fitting unit
function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if(bytes == 0) return 'n/a';
  const number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if(number == 0) return `${bytes} ${sizes[number]}`;
  return `${(bytes / (1024 ** number)).toFixed(2)} ${sizes[number]}`;
}

function saveToKML() {
  dialog.showSaveDialog({
    filters: [{
      name: 'Google Earth Keyhole Markup',
      extensions: ['kml']
    }]
  }, path => {
    // Convert all currently loaded records to .kml data
    let kml = converter.toKML(angular.element(document.getElementById('table')).scope().getRecords());
    // Write .kml data to the chosen path
    fs.writeFile(path, kml, function(error) {
      // TODO: Proper error handling
      if(error) console.log(error);
    });
  });
}