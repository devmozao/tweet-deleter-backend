'use strict'
const api = require('./api')

function request(functionRequest) {
  console.log(functionRequest)

  return new Promise((resolve, reject) => {
    functionRequest
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

module.exports = { api, request }
