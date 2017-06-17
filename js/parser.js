const adiParser = require('./strategies/adi')
const ediParser = require('./strategies/edi')
const txtParser = require('./strategies/txt')

const parse = function(file, fileContents) {
  let fileName = file.name.toLowerCase()
  if(fileName.endsWith('.adi')) {
    console.log('file name "' + file.name.toLowerCase() + '" ends with .adi')
    adiParser.parse(file, fileContents)
  } else if(fileName.endsWith('.edi')) {
    console.log('file name "' + file.name.toLowerCase() + '" ends with .edi')
    ediParser.parse(file, fileContents)
  } else {
    console.log('file name "' + file.name.toLowerCase() + '" doesn\'t end with .adi or .edi')
    txtParser.parse(file, fileContents)
  }
}

module.exports.parse = parse