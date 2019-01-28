describe 'AppCtrl', ->
  scope = null
  ctrl = null

  beforeEach ->
    module('piechopper')
    inject ($controller, $rootScope) -> 
      scope = $rootScope.$new()
      ctrl = $controller('AppCtrl', $scope: scope)

  it "should have specific active model at the start",  ->
    expect(scope.repo.activeModel).not.toBeUndefined()
    expect(scope.repo.activeModel.modelDef.id).toBe('6cfb9e85-90fc-4faa-954a-d99c8a9adc33')
    expect(scope.repo.activeModel).not.toBeUndefined()


describe 'CalcCtrl', ->
  scope = null
  ctrl = null

  beforeEach ->
    module('piechopper')
    inject ($controller, $rootScope) -> 
      $controller('AppCtrl', $scope: $rootScope)
      scope = $rootScope.$new()
      ctrl = $controller('CalcCtrl', $scope: scope)

  it "should automatically change member names in all models if one changes", ->
    testName = "Teemu Testi"
    scope.repo.activeModel.team.members[0].name = testName
    scope.$digest()
    for m in scope.repo.models
      do (m) ->
        expect(m.team.members[0].name).toBe(testName)
