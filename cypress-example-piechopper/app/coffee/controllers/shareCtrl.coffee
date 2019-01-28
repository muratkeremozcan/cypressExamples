app.controller "ShareCtrl", ($scope, $http, $location) ->
  $scope.linkToSnapshot(null)
  $scope.saveSnapshot = -> 
    doc =
      repo: $scope.repo.serialize()
      userId: $scope.userId

    $http.post('/api/1/proposals', doc).
      success((data, status, headers, config) ->
        loc = $location.host()
        port = $location.port()
        if port and (port != 80)
          loc += ":#{$location.port()}" 
        $scope.linkToSnapshot("http://#{loc}/#/p/#{data.id}")
        $scope.trace.shareProposal()
      ).
      error (data, status, headers, config) ->
        $scope.showMessage('Ooops !', 
          """
          We couldn't save the proposal.
          <ul>
            <li>Please check that your internet connection works.</li>
            <li>If it works, we might have a problem on our side. Sorry about the situation!</li>
          </ul>
          """)
