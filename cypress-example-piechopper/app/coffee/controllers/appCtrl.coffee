app.controller "AppCtrl",
($scope, $location, $http, $modal, $window, modelRepo, trace) =>

  # from http://stackoverflow.com/a/2117523
  uuid = ->
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace /[xy]/g, (c) ->
      r = Math.random() * 16 | 0
      v = (if c is "x" then r else r & 0x3 | 0x8)
      v.toString 16
  localStorage.userId = uuid() if not localStorage.userId
  $scope.userId = localStorage.userId

  # expose commonly used pieces to scope
  $scope.repo = repo = modelRepo.createRepo(modelDefs.all)
  $scope.model = model = -> repo.activeModel
  $scope.members = members = -> repo.activeModel.team.members
  $scope.criteria = (id) -> repo.activeModel.modelDef.criterias[id]
  $scope.memberColors = ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c"]
  $scope.trace = trace
  
  $scope.moreResultsWanted = false  # does user want more results to be shown?
  $scope.showMoreResults = (show) -> $scope.moreResultsWanted = show

  _linkToSnapshot = null
  $scope.linkToSnapshot = (val) ->
    _linkToSnapshot = val if val != undefined
    _linkToSnapshot

  $scope.showMessage = (title, desc, timeout) ->
    html = """
    <div class="error-dlg">
      <h2>#{title}</h2>
      <d>#{desc}</d>
    </div>
    """
    dlg = $modal.open(template: html)
    if timeout
      $timeout((-> dlg.dismiss()), timeout)

  $scope.showTos = ->
    $scope.showMessage("Terms and Conditions", $('#tos').html())
    $scope.trace.showTos()

  showUnknownProposalError = ->
    $scope.showMessage('Oops !', 
      """
      <p>The proposal you were looking for wasn't found.</p>
      <p>
        Please note that proposals older than a month are deleted.
        For more recent proposals, please check that your address is correct.
      </p>
      """)

  showInvalidProposalError = ->
    $scope.showMessage('Ooops !', 
      """
      <p>
        There was an error while loading the given address.
        Some parts of the proposal might not be correct!
      </p>
      <p>
        If your data is mission critical, mail to info@piechopper.com.
      </p>
      """)

  addDefaultMembers = -> repo.addMember() for [1..2]
  pathParts = $location.path().split('/')

  if pathParts.length == 3 and pathParts[1] == 'p'
    $http.get("/api/1/proposals/#{ pathParts[2] }").
      success((data, status, headers, config) ->
        success = repo.deserialize(data.repo)
        if not success
          showInvalidProposalError()
        else
          $scope.$broadcast('modelLoaded')
        if data.userId and (data.userId == $scope.userId)
          $scope.trace.loadOwnProposal()
        else
          $scope.trace.loadPartnerProposal()
      ).
      error (data, status, headers, config) ->
        addDefaultMembers()
        showUnknownProposalError()
  else if pathParts.length >= 2
    addDefaultMembers()
    showUnknownProposalError()
  else
    addDefaultMembers()
