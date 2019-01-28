app.controller "ModelSelectionCtrl", ($scope, $timeout) ->
  # Models in repo could directly be used as slides; however if done so, 
  #   slide activation causes heavy DOM updates since models are tied to
  #   tables via 2-way binding. Therefore slides are isolated as separate
  #   objects, and their changes are reflected in the repo after a short delay
  
  class Slide
    constructor: (@model, @id, @active, @name, @image, @target, @desc) ->

  $scope.slides = slides = []
  for m in $scope.repo.models
    slide = new Slide(m, m.modelDef.id, m.active, m.modelDef.name,
                      m.modelDef.image, m.modelDef.target, m.modelDef.desc)
    slides.push(slide)
  
  slideChangeTimer = null
  onSlideChange = ->
    $timeout.cancel(slideChangeTimer) if slideChangeTimer
    slideChangeTimer = $timeout ->  
      $scope.repo.activeModel = $scope.activeSlide().model
      console.log "in onSlideChange timed", $scope.repo.activeModel.modelDef.name
    , 1000

  $scope.activeSlide = ->
    for s in slides
      return s if s.active
  $scope.$on 'modelLoaded', () ->
    model = $scope.repo.activeModel
    console.log "in modelLoaded", model.modelDef.name
    $timeout.cancel(slideChangeTimer) if slideChangeTimer
    for s in slides
      s.active = (s.model == model)

  $scope.$watch($scope.activeSlide, onSlideChange)
