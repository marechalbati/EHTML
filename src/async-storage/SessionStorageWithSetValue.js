'use strict'

const { AsyncObject } = require('./../cutie/exports')

class SessionStorageWithSetValue extends AsyncObject {
  constructor (sessionStorage, key, value) {
    super(sessionStorage, key, value)
  }

  syncCall () {
    return (sessionStorage, key, value) => {
      sessionStorage.setItem(key, value)
      return sessionStorage
    }
  }
}

module.exports = SessionStorageWithSetValue
