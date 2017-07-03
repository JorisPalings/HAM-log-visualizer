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
      let loadedFiles = angular.element(document.getElementById('table')).scope().getFiles();
      // Only add new files (disregard previously uploaded files)
      if(loadedFiles.indexOf(event.target.files[i].name) == -1) {
        handleFileUpload(event.target.files[i]);
      }
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

      // Add the file to the list of loaded files
      angular.element(document.getElementById('table')).scope().addFile(file.name);

      // Add an onclick event handler to the "Save" button
      let saveButton = document.getElementsByClassName('table-controls__save-button button')[0];
      saveButton.onclick = () => {
        showSaveModal();
      }
    } catch(exception) {
      // If the file is invalid, show an error message
      document.getElementsByClassName('file-upload__message')[0].innerHTML = exception.message;
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

function showSaveModal() {
  // Show backdrop
  let backdrop = document.getElementsByClassName('backdrop')[0];
  backdrop.classList.remove('hidden');
  // Show save modal
  let saveModal = document.getElementsByClassName('save-modal__outer')[0];
  saveModal.classList.remove('hidden');
  // Add an onclick event handler to the "Save" button
  let saveButton = document.getElementsByClassName('save-modal__save-button')[0];
  saveButton.onclick = () => {
    saveToKMZ();
  }
  // Add an onclick event handler to the "Cancel" button
  let cancelButton = document.getElementsByClassName('save-modal__cancel-button')[0];
  cancelButton.onclick = () => {
    hideSaveModal();
  }
}

function hideSaveModal() {
  // Hide backdrop
  let backdrop = document.getElementsByClassName('backdrop')[0];
  backdrop.classList.add('hidden');
  // Hide save modal
  let saveModal = document.getElementsByClassName('save-modal__outer')[0];
  saveModal.classList.add('hidden');
}

function saveToKMZ() {
  dialog.showSaveDialog({
    filters: [{
      name: 'Google Earth',
      extensions: ['kmz']
    }]
  }, path => {
    // If the given path is valid
    if(path) {
      let checkedMarkerColor = document.querySelector('input[name="markerColor"]:checked').value;
      // Write .kmz file to the chosen path
      let kmz = converter.toKMZ(angular.element(document.getElementById('table')).scope().getRecords(), // Records
        checkedMarkerColor == 'band' 
          ? checkedMarkerColor 
          : document.getElementsByClassName('save-modal__color-select')[0].value, // Marker color ('band' or a color)
        path); // Path
    }
  });
}