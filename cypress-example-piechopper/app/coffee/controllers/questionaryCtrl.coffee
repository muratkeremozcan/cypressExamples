app.controller "QuestionaryCtrl", ($scope, $http, $timeout, $rootScope) ->
  $scope.questionary = {}
  $scope.questionarySent = false

  $scope.sendQuestionary = -> 
    $scope.trace.sendQuestionary()
    doc =
      userId: $scope.userId
      questionary: $scope.questionary
    $http.post('/api/1/questionaries', doc).
      success((data, status, headers, config) ->
        $scope.questionarySent = true
      ).
      error (data, status, headers, config) ->
        $scope.showMessage('Oops !', 
          """
          There was an error while saving the questionary.
          <ul>
            <li>Please check that your internet connection works.</li>
            <li>If it works, there might be a problem with the service. Sorry about the situation!</li>
          </ul>
          """)
