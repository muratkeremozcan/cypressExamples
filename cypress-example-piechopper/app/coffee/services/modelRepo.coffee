app.service "modelRepo", () ->

  class Member
    constructor: (@id, @name, @modelDef) ->
      @values = {}  # values per criteria (coming from UI)
      @scores = {}  # updated during scoring
      @valueErrors = {}  # error messages for given values
      for own id, crit of modelDef.criterias
        @values[id] = crit.type.default
      @equity = 0

 
  # each model has own instance of a team
  class Team
    constructor: (@modelDef) ->
      @members = []
      @messages = []  # messages comfing from grading function
      
    addMember: (id, name) ->
      member = new Member(id, name, @modelDef)
      @members.push(member)
      member

    removeMember: (index) ->
      @members.splice(index, 1)


  class Model
    constructor: (@modelDef) ->
      @emphasis = {}
      @emphasisErrors = {}
      @hasInputErrors = false
      @init()

    init: () ->
      @team = new Team(@modelDef)
      for own id, e of @modelDef.emphasis
        @emphasis[id] = e.type.default

    score: ->
      @hasInputErrors = false
      # check errors in the values
      for m in @team.members
        for own k, v of m.values
          t = @modelDef.criterias[k].type
          error = t.check(v)
          if error
            m.valueErrors[k] = error
            @hasInputErrors = true
          else if m.valueErrors[k]
            delete m.valueErrors[k]
      for own k, v of @emphasis
        t = @modelDef.emphasis[k].type
        error = t.check(v)
        if error
          @emphasisErrors[k] = error
          @hasInputErrors = true
        else if @emphasisErrors[k]
          delete @emphasisErrors[k]

      # score
      @team.messages = []
      @modelDef.score(@modelDef, @team.members, @team.messages, @emphasis)
      
      # divide even if all get score 0
      allZeros = true
      for member in @team.members
        if member.equity != 0
          allZeros = false
          break
      if allZeros
        slice = Math.round(100 / @team.members.length * 10) / 10
        for member in @team.members
          member.equity = slice

    # angular seems to lose object key order in iteration, get order from here instead
    getCriteriaIds: ->    (id for own id, v of @modelDef.criterias)
    getEmphasisIds: () -> (id for own id, v of @emphasis)

  class ModelRepo
    constructor: (@modelDefList) ->
      @defaultMemberIds = "ABCDEFGHIJKLMN"  # used as an array
      @usedMemberIds = []
      @models = []
      for def in @modelDefList
        @createModel(def)
      @activeModel = @models[0]

    init: () ->
      @usedMemberIds = []
      for model in @models
        model.init()

    createModel: (modelDef) ->
      @models.push(new Model(modelDef))

    isTeamAtMax: -> @memberCount() >= 6
    isTeamAtMin: -> @memberCount() <= 2
    memberCount: -> @usedMemberIds.length
  
    getNextMemberId: ->
      for mid in @defaultMemberIds
        if mid not in @usedMemberIds
          return mid
      return 'X'

    addMember: (memberId, memberName) ->
      return if @isTeamAtMax()
      mid = memberId or @getNextMemberId()
      @usedMemberIds.push(mid)
      mname = memberName or "Member #{mid}"
      for model in @models
        model.team.addMember(mid, mname)
  
    removeMember: (index) ->
      return if @isTeamAtMin()
      @usedMemberIds.splice(index, 1)
      for model in @models
        model.team.removeMember(index)

    syncMemberNames: (fromModel) ->
      members = fromModel.team.members
      for model in @models
        if model != fromModel
          for m, i in model.team.members
            m.name = members[i].name

    serialize: ->
      sRepo =
        activeModelId: @activeModel.modelDef.id
        models: {}
      for model in @models
        sRepo.models[model.modelDef.id] = sModel = {}
        sModel.version = model.modelDef.version
        sModel.name = model.modelDef.name
        sModel.team = {}
        sModel.team.members = []
        for member in model.team.members
          sMember = {}
          sMember.id = member.id
          sMember.name = member.name
          sMember.values = member.values
          sModel.team.members.push(sMember)
        sModel.emphasis = {}
        for own k, v of model.emphasis
          sModel.emphasis[k] = v
      return sRepo

    deserialize: (sRepo) ->
      @init()
      errors = []
      assert = (field, val, typ) ->
        if typeof(val) != typ
          errors.push "field #{field}: #{val} is not of type #{typ}"
      try
        firstModel = true
        assert('sRepo', sRepo, 'object')
        assert('sRepo.activeModelId', sRepo.activeModelId, 'string')
        assert('sRepo', sRepo.models, 'object')
        for own k, v of sRepo.models
          [id, sModel] = [k, v]
          assert('sModel.id', id, 'string')
          assert('sModel', sModel, 'object')
          modelDeserialized = false
          for model in @models
            if model.modelDef.id != id
              continue
            if sRepo.activeModelId == id
              @activeModel = model

            assert('sModel.version', sModel.version, 'string')
            majorVersion = parseInt(model.modelDef.version.split('.')[0])
            sMajorVersion = parseInt(sModel.version.split('.')[0])
            if majorVersion != sMajorVersion
              errors.push "Major versions differ in model #{id}"
            assert('sModel.team', sModel.team, 'object')
            assert('sModel.team.members', sModel.team.members, 'object')
            for sMember in sModel.team.members
              if firstModel
                assert('sMember.id', sMember.id, 'string')
                @usedMemberIds.push(sMember.id)

              assert('sMember.name', sMember.name, 'string')
              member = model.team.addMember(sMember.id, sMember.name)

              assert('sMember.values', sMember.values, 'object')
              member.values = sMember.values
            
            if sModel.emphasis
              assert('sModel.emphasis', sModel.emphasis, 'object')
              for own k, v of sModel.emphasis
                model.emphasis[k] = v
            modelDeserialized = true
          
          if not modelDeserialized
            errors.push "Couldn't find model '#{name}' to deserialize into"
          firstModel = false
      if errors.length > 0
        console.error "Errors while deserializing:\n  -", errors.join('\n  - ')
      errors.length == 0

  @createRepo = (modelDefList) -> new ModelRepo(modelDefList)
  return @
