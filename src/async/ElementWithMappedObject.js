'use strict'

const { AsyncObject } = require('@page-libs/cutie')
const StringWithAppliedStorageVariables = require('./../util/StringWithAppliedStorageVariables')
const StringWithMappedObject = require('./../util/StringWithMappedObject')

class ElementWithMappedObject extends AsyncObject {
  constructor (element, obj) {
    super(element, obj)
  }

  syncCall () {
    return (element, obj) => {
      const objName = element.getAttribute('data-object')
      if (!objName) {
        throw new Error(`elm #${element.getAttribute('id')} must have attribute data-object for applying values to child nodes, so you can know what object it encapsulates`)
      }
      const OBJ = { }
      OBJ[objName] = obj
      return this.mapObjToChildren(element, OBJ)
    }
  }

  mapObjToChildren (element, obj) {
    element.childNodes.forEach(child => {
      if (child.getAttribute) {
        for (let i = 0; i < child.attributes.length; i++) {
          const attrName = child.attributes[i].name
          const attrValue = child.attributes[i].value
          if (attrName !== 'data-actions') {
            this.applyStorageVariablesInAttribute(child, attrName, attrValue)
            this.mapObjToAttribute(child, attrName, attrValue, obj)
            if (attrName === 'data-text') {
              if (!this.hasParamsInAttributeToApply(child, 'data-text')) {
                this.insertTextIntoElm(child, child.getAttribute('data-text'))
                child.removeAttribute('data-text')
              }
            } else if (attrName === 'data-value') {
              if (!this.hasParamsInAttributeToApply(child, 'data-value')) {
                child.value = child.getAttribute('data-value')
                child.removeAttribute('data-value')
              }
            }
          }
        }
        this.mapObjToChildren(child, obj)
      }
    })
    return element
  }

  insertTextIntoElm (elm, text) {
    const textNode = document.createTextNode(text)
    if (elm.childNodes.length === 0) {
      elm.appendChild(textNode)
    } else {
      elm.insertBefore(textNode, elm.childNodes[0])
    }
  }

  applyStorageVariablesInAttribute (element, attrName, attrValue) {
    element.setAttribute(
      attrName,
      new StringWithAppliedStorageVariables(
        attrValue
      ).value()
    )
  }

  mapObjToAttribute (element, attrName, attrValue, obj) {
    element.setAttribute(
      attrName,
      new StringWithMappedObject(
        element.getAttribute(attrName), obj
      ).value()
    )
  }

  hasParamsInAttributeToApply (element, attrName) {
    return /\$\{([^{}]+|\S*)\}/g.test(
      element.getAttribute(attrName)
    )
  }
}

module.exports = ElementWithMappedObject