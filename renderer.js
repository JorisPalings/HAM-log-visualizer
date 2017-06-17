// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const parser = require('./js/parser');

(() => {
  const dropzone = document.getElementsByClassName('drag-and-drop__dropzone')[0]

  dropzone.ondragover = () => {
    dropzone.classList.add('dragover')
    return false 
  }

  dropzone.ondragleave = () => {
    dropzone.classList.remove('dragover')
    return false 
  }

  dropzone.ondragend = () => {
    dropzone.classList.remove('dragover')
    return false 
  }

  dropzone.ondrop = (event) => {
    // Stop the browser window from simply displaying the dropped file
    event.stopPropagation()
    event.preventDefault()

    // Remove the CSS
    dropzone.classList.remove('dragover')

    handleFileUpload(event.dataTransfer.files[0])
    return false
  } 

  const fileUpload = document.getElementsByClassName('file-upload__input')[0]
  fileUpload.onchange = (event) => {
    console.log(event);
    handleFileUpload(event.target.files[0])
    return false
  }
})()

function handleFileUpload(file) {
  let fileReader = new FileReader();
  console.log('FileReader created', fileReader)

  // When the File is read entirely, process its contents
  fileReader.onload = () => {
    // Show the uploaded file's name and size
    const selectedFile = document.getElementsByClassName('file-upload__uploaded-file-name')[0]
    console.log(file);
    selectedFile.innerHTML = `${file.name} (${bytesToSize(file.size)})`
    console.log('File loaded', fileReader.result)
    parser.parse(file, fileReader.result);
  }

  // Read the File's contents from its reference
  fileReader.readAsText(file)
}

function bytesToSize(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if(bytes == 0) return 'n/a'
  const number = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
  if(number == 0) return `${bytes} ${sizes[number]}`
  return `${(bytes / (1024 ** number)).toFixed(2)} ${sizes[number]}`
}