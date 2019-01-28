app = angular.module('piechopper', ['ui', 'ui.bootstrap', 'ngSanitize'])

# The following are the globals in the app
modelDefs =
  all: []
  add: (newDef) ->
    for oldDef, i in modelDefs.all
      if newDef.priority < oldDef.priority
        modelDefs.all.splice(i, 0, newDef)
        newDef = null
        break
    if newDef
      modelDefs.all.push(newDef)

types =
  checkbox: (options) ->
    typeName: 'checkbox'
    default: options?.default or false
    check: (value) ->
      if typeof(value) != 'boolean'
        return 'Value must be on / off'

  radio: (options) ->
    typeName: 'radio'
    default: false
    check: (value) ->
      if typeof(value) != 'boolean'
        return 'Value must be on / off'

  number: (options) ->
    typeName: 'number'
    default: options.default or 0
    min: options?.min
    max: options?.max
    unit: options?.unit
    check: (value) ->
      if typeof(value) != 'number'
        return 'Value must be a number'
      if options?.min and value < options.min
        return "Value must be bigger than #{options.min}"
      if options?.max and value > options.max
        return "Value must be smaller than #{options.max}"

  enum: (options) ->
    r =
      typeName: 'enum'
      values: options.values
      default: options.default
      check: (value) ->
        found = false
        for own k, v of options.values
          if value == v
            found = true
        if not found
          return "Value must be one of #{options.values}"
    if r.default == undefined
      r.default = (v for k, v in options.values)[0]
    r
