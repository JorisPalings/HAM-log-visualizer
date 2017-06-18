'use strict'

const adiParser = require('./strategies/adi')
const ediParser = require('./strategies/edi')
const txtParser = require('./strategies/txt')

const parse = function(file, fileContents) {
  let fileName = file.name.toLowerCase()
  if(fileName.endsWith('.adi')) {
    adiParser.parse(file, fileContents)
  } else if(fileName.endsWith('.edi')) {
    ediParser.parse(file, fileContents)
  } else {
    txtParser.parse(file, fileContents)
  }
}

module.exports.parse = parse