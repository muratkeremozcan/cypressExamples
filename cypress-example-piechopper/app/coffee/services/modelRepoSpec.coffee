describe 'modelRepo', ->
  testModelDef =
    id: 'test'
    name: 'test model'
    version: '0.1'
    summary: ''
    desc: ''
    image: ''
    initScores: (scores) -> scores.test = false
    criterias:
      test:
        text: "Testing"
        type: types.checkbox()
        score: (scores, value) -> scores.test = value
    emphasis:
      foo:
        text: "Foo"
        type: types.number(default: 100, min: 1, max: 250, unit: '%')
    grade: (team) ->
      for member in team.members
        member.equity = Math.round(100 / team.members.length) or 0
      team.messages.push 'Test message'

  defs = [testModelDef]
  createRepo = null
  repo = null

  beforeEach ->
    module('piechopper')
    inject (modelRepo) -> 
      createRepo = modelRepo.createRepo
      repo = createRepo(defs)

  it "should have one activated model after init",  ->
    expect(repo.models.length).toBe(1)
    expect(repo.activeModel.modelDef.id).toBe('test')

  it "should allow addition and removal of members", ->
    repo.addMember() for [1..5]
    expect(repo.memberCount()).toBe(5)
    expect(repo.isTeamAtMax()).toBe(false)
    expect(repo.isTeamAtMin()).toBe(false)

    repo.addMember()
    expect(repo.memberCount()).toBe(6)
    expect(repo.isTeamAtMax()).toBe(true)

    repo.addMember()
    expect(repo.memberCount()).toBe(6)
    expect(repo.isTeamAtMax()).toBe(true)

    repo.removeMember() for [1..3]
    expect(repo.memberCount()).toBe(3)
    expect(repo.isTeamAtMin()).toBe(false)

    repo.removeMember()
    expect(repo.memberCount()).toBe(2)
    expect(repo.isTeamAtMin()).toBe(true)

    repo.removeMember()
    expect(repo.memberCount()).toBe(2)
    expect(repo.isTeamAtMin()).toBe(true)

  it "should create unique member names on member additions", ->
    repo.addMember() for [1..2]
    members = repo.activeModel.team.members
    expect(members[0].name).toBe('Member A')
    expect(members[1].name).toBe('Member B')
    
    # are member names correctly re-used?
    repo.removeMember(1)
    repo.addMember()
    expect(members[1].name).toBe('Member B')

  it "should change member names in all models if one changes", ->
    testName = "Teemu Testi"
    repo.addMember() for [1..6]
    repo.activeModel.team.members[0].name = testName
    repo.syncMemberNames(repo.activeModel)
    for m in repo.models
      do (m) ->
        expect(m.team.members[0].name).toBe(testName)

  it "should serialize & deserialize properly", ->
    testName = "Teemu Testi"
    repo.addMember() for [1..3]
    members1 = repo.activeModel.team.members
    members1[0].values.test = true
    members1[1].values.test = false
    members1[0].name = testName
    repo.activeModel.emphasis.foo = 3
    
    sRepo = repo.serialize()
    expect(typeof(sRepo)).toBe('object')
    
    # create completely new repo and deserialize it
    repo2 = createRepo(defs)
    success = repo2.deserialize(sRepo)
    expect(success).toBe(true)
    expect(repo2.activeModel.modelDef.id).toBe(repo.activeModel.modelDef.id)
    members2 = repo2.activeModel.team.members
    expect(members2.length).toBe(3)
    expect(members2[0].values.test).toBe(true)
    expect(members2[1].values.test).toBe(false)
    expect(members2[0].name).toBe(testName)
    expect(repo2.memberCount()).toBe(3)
    expect(repo2.activeModel.emphasis.foo).toBe(3)
