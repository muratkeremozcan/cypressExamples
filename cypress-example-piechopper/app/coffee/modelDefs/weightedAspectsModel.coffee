modelDefs.add

  id: '6ee7289c-6eb6-4239-9fe1-5ded5dd511e4'
  name: 'Relative Importance'
  version: '1.0'
  image: 'weightedAspectsModel.png'
  target: "If you want something quick and simple"
  priority: 30
  desc: """
      <p>This method considers relative importance of various aspect related to establishing a company. It's quick to fill, though highly subjective.</p>
      <p>The method is inspired by the <a href="http://www.andrew.cmu.edu/user/fd0n/35%20Founders'%20Pie%20Calculator.htm">Founders Pie Calculator</a>.</p>
    """

  criterias:
    idea:
      text: "How much has the member been contributing to the original idea? (0-10)"
      type: types.number(default: 0, min: 0, max: 10)

    businessPlan:
      text: "How much has the member been contributing to the business plan? (0-10)"
      type: types.number(default: 0, min: 0, max: 10)
    
    domainExpertise:
      text: "How well does the member know your target industry, and how well they are connected? (0-10)"
      type: types.number(default: 0, min: 0, max: 10)
    
    commitmentAndRisk:
      text: "How committed the member is in terms of consumed time and money? (0-10)"
      type: types.number(default: 0, min: 0, max: 10)
      
    responsibilities:
      text: "How demanding are the responsibilities of the member? (0-10)"
      type: types.number(default: 0, min: 0, max: 10)
      
  emphasis:
    idea:
      text: "How much do you value the idea? (0-10)"
      type: types.number(default: 5, min: 0, max: 10)

    businessPlan:
      text: "How much do you value the business plan? (0-10)"
      type: types.number(default: 5, min: 0, max: 10)
    
    domainExpertise:
      text: "How much do you value the domain expertise? (0-10)"
      type: types.number(default: 5, min: 0, max: 10)
    
    commitmentAndRisk:
      text: "How much do you value the commitment and risk? (0-10)"
      type: types.number(default: 5, min: 0, max: 10)
      
    responsibilities:
      text: "How much do you value the demandingness of responsibilities? (0-10)"
      type: types.number(default: 5, min: 0, max: 10)


  score: (self, members, messages, emphasis) ->
    pie = 0
    for member in members
      member.scores = { slice: 0 }
      for own k, v of emphasis
        member.scores.slice += member.values[k] * v
      pie += member.scores.slice
    for member in members
      member.equity = (Math.round(member.scores.slice / pie * 1000) / 10) or 0
