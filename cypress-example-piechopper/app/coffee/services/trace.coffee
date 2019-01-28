app.service "trace", ($window) ->
  traceCounter = {}

  @createGaArray = (params, prio) ->
    params = params.split(':') 
    if params[0].length == 0
      params = []
    if params.length > 3
      params = params[0..2]
    while params.length < 3
      params.push null
    params.push(prio)
    ['_trackEvent'].concat(params)
  
  @trace = (params, prio) ->
    if traceCounter[params] == undefined
      traceCounter[params] = 1
    else 
      traceCounter[params] += 1
    arr = @createGaArray(params, prio)
    if $window._gaq
      $window._gaq.push(arr)
    arr
  
  @traceFirst = (params, prio) ->
    return [] if traceCounter[params] == 1
    @trace(params, prio)

  @addMember = () -> @traceFirst('Click:Add / Remove Member', 10)
  @removeMember = () -> @traceFirst('Click:Add / Remove Member', 10)
  @changeMemberName = () -> @traceFirst('Click:Change Member Name', 20)
  @openEmail = () -> @traceFirst('Click:Open Email', 20)
  @openTwitter = () -> @traceFirst('Click:Open Twitter', 5)
  @openGithub = () -> @traceFirst('Click:Open Github', 5)
  @showAbout = () -> @traceFirst('Click:Show About', 5)
  @showTos = () -> @traceFirst('Click:Show TOS', 10)
  @wantMoreResults = () -> @trace('Click:Show More Results', 80)
  @cancelMoreResults = () -> @trace('Click:Cancel More Results', -80)
  @loadOwnProposal = () -> @trace('Persist:Load Own Proposal', 60)
  @loadPartnerProposal = () -> @trace('Persist:Load Partner Proposal', 100)
  @shareProposal = () -> @trace('Persist:Share Prososal', 80)
  @sendQuestionary = () -> @trace('Persist:Send Questionary', 150)


  # TODO: add these to tracing
  @changeContrib = () -> @traceFirst('Click:Change Contrib', 1)
  @changeEmphasis = () -> @traceFirst('Click:Change Emphasis', 2)
  @switchModel = () -> @traceFirst('Click:Switch Model', 10, 3)
  
  return @
