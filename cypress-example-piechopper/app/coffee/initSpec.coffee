describe 'Init', ->
  describe "Model Definition", ->
    
    for md, i in modelDefs.all
      do (md, i) ->

        it "no. #{i} should have an id", ->
          expect(typeof md.id).toBe('string')

        it "no. #{i} should have a priority", ->
          expect(typeof md.priority).toBe('number')
      
        it "no. #{i} should have a name", ->
          expect(typeof md.name).toBe('string')

        it "no. #{i} should have a version", ->
          expect(typeof md.version).toBe('string')
          majorVersion = parseInt(md.version.split('.')[0])
          expect(typeof majorVersion).toBe('number')
          expect(majorVersion).not.toBe(NaN)

        it "#{md.name} should have a target", ->
          expect(typeof md.target).toBe('string')

        it "#{md.name} should have a description", ->
          expect(typeof md.desc).toBe('string')

        it "#{md.name} should have criterias", ->
          expect(typeof md.criterias).toBe('object')

        for own c, v of md.criterias
          do (c, v) ->
            it "#{md.name}:criteria:#{c} should have correct subfields", ->
              expect(typeof v.text).toBe('string')
              expect(typeof v.type).toBe('object')
              expect((k for own k, kv of types)).toContain(v.type.typeName)
              if v.type in [types.radio, types.checkbox]
                expect(typeof v.default).toBe('boolean')
              else if v.type == types.number
                expect(typeof v.default).toBe('number')
              else if v.type == types.enum
                expect(typeof v.default).toBe('string')
              if v.info
                expect(typeof v.info).toBe('string')
              if v.constraint
                expect(typeof v.constraint).toBe('function')

        it "#{md.name} should have an scoring function", ->
          expect(typeof md.score).toBe('function')
