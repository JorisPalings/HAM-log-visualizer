// https://hrvhf.net/upload/edi_reg1test.pdf

'use strict'

// Define the Record class
function Record(date, time, call, modeCode, sentRST, sentQSO, 
  receivedRST, receivedQSO, receivedExchange, receivedWWL, QSOpoints,
  newEchange, newWWL, newDXCC, duplicateQSO) {
    this.date = date
    this.time = time
    this.call = call
    this.modeCode = modeCode
    this.sentRST = sentRST
    this.sentQSO = sentQSO
    this.receivedRST = receivedRST
    this.receivedQSO = receivedQSO
    this.receivedExchange = receivedExchange
    this.receivedWWL = receivedWWL
    this.QSOpoints = QSOpoints
    this.newEchange = newEchange
    this.newWWL = newWWL
    this.newDXCC = newDXCC
    this.duplicateQSO = duplicateQSO
  }

const parse = function(file, fileContents) {
  // Split the file's contents into header, remarks and records
  // using the square bracket tags
  let [, header, remarks, records] = fileContents.split(/\[[a-zA-Z0-9;]+\]/g)

  // Remove all whitespace (newlines) from the beginning and the end of the header
  // Split the header into separate fields using newlines
  let headerFields = header.trim().split(/\n/g)

  // Split the header fields into keys and their respective values
  headerFields.forEach((field, fieldIndex) => {
    headerFields[fieldIndex] = field.split('=')
  })

  // Convert each field's [key, value] Array into a property of the header Object
  header = {}
  headerFields.forEach(field => {
    let key = field[0]
    let value = field[1]
    header[key] = value
  })

  // Split the records String into a separate String for each record
  records = records.trim().split(/\n/g)
  // Turn each record string into a Record Object
  records.forEach((record, recordIndex) => {
    records[recordIndex] = new Record(...(record.split(';')))
  })

  console.log(header)
  console.log(remarks)
  console.log(records)
}

module.exports.parse = parse