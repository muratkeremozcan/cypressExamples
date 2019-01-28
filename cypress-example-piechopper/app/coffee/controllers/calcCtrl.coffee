app.controller "CalcCtrl", ($scope, $timeout, trace) ->
  updateEquities = () ->
    $scope.equities = []
    for m in $scope.members()
      $scope.equities.push({ name: m.name, value: m.equity })

  $scope.memberValues = ->
    (m.values for m in $scope.members())
  scoreTimer = null
  score = ->
    $scope.linkToSnapshot(null)  # since another round of scoring is done, link is invalid
    $timeout.cancel(scoreTimer) if scoreTimer
    doScore = ->
      $scope.model().score()
      updateEquities()
    scoreTimer = $timeout(doScore, 1)
  $scope.$watch('memberValues()', score, true)
  $scope.$watch('model().emphasis', score, true)
  
  # --- if team member's name change, update it to other models also ---
  syncMemberNames = ->
    $scope.repo.syncMemberNames($scope.model())
    updateEquities()  # to update names into piechart
  $scope.memberNames = -> (m.name for m in $scope.members())
  $scope.$watch('memberNames()', syncMemberNames, true)

  # --- Imitate radio controls ---
  $scope.unselectOtherRadios = (id, member) ->
    $timeout ->  # needs timeout to get member.values[id] -value set correctly by angular
      if member.values[id]
        for other in $scope.members()
          if other.id != member.id
            other.values[id] = false
    , 1
