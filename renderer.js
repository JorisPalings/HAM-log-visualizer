// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

'use strict';

const parser = require('./js/parser');

(() => {
  const dropzone = document.getElementsByClassName('drag-and-drop__dropzone')[0];

  dropzone.ondragover = (event) => {
    console.log('dragover', event);
    dropzone.classList.add('dragover');
    return false;
  }

  dropzone.ondragleave = (event) => {
    console.log('dragleave', event);
    dropzone.classList.remove('dragover');
    return false;
  }

  dropzone.ondragend = (event) => {
    console.log('dragend', event);
    dropzone.classList.remove('dragover');
    return false;
  }

  dropzone.ondrop = (event) => {
    console.log('drop', event);
    // Stop the browser window from simply displaying the dropped file
    event.stopPropagation();
    event.preventDefault();

    // Remove the CSS
    dropzone.classList.remove('dragover')

    handleFileUpload(event.dataTransfer.files[0]);
    return false;
  } 

  const fileUpload = document.getElementsByClassName('file-upload__input')[0];
  fileUpload.onchange = (event) => {
    handleFileUpload(event.target.files[0]);
    return false;
  }
})()

function handleFileUpload(file) {
  let fileReader = new FileReader();

  // When the File is read entirely, process its contents
  fileReader.onload = () => {
    const selectedFile = document.getElementsByClassName('file-upload__uploaded-file-name')[0];
    try {
      parser.parse(file, fileReader.result);
      // Show the uploaded file's name and size
      selectedFile.innerHTML = `${file.name} (${bytesToSize(file.size)})`;
      selectedFile.classList.remove('upload-failed');
      selectedFile.classList.add('upload-successful');
    } catch(exception) {
      console.log(exception.message);
      document.getElementsByClassName('file-upload__uploaded-file-name')[0].innerHTML = exception.message;
      selectedFile.classList.remove('upload-successful');
      selectedFile.classList.add('upload-failed');
    }
  }

  // Read the File's contents from its reference
  fileReader.readAsText(file);
}

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if(bytes == 0) return 'n/a';
  const number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if(number == 0) return `${bytes} ${sizes[number]}`;
  return `${(bytes / (1024 ** number)).toFixed(2)} ${sizes[number]}`;
}