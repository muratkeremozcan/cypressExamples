do ->
  valueEnum = -> types.enum(default: 0, values: {
   'None': 0 , 'Little': 2, 'Some': 5, 'Plenty': 10 })

  modelDefs.add
    id: '6cfb9e85-90fc-4faa-954a-d99c8a9adc33'
    name: 'Company Roles'
    version: '1.0'
    image: 'roleBasedModel.png'
    target: "If you want to share equity based on roles in the company."
    priority: 10
    desc:  """
      <p>This method considers executive, development and business roles in the company,
      and scores each team member based on their contributions for each role.</p>
      <p>The method is inspired by the <a href="http://foundrs.com/">Foundrs.com</a> website.</p>
      """

    criterias:
      idea:
        text: "Who had the original idea for the project?"
        type: types.checkbox()
      
      participation:
        text: "Compared to full time job, how much time the member contributes until you raise funding?"
        info: "100 = full time, 50 = half-time, 120 = 20% overtime"
        type: types.number(default: 100, min: 1, max: 250, unit: '%')
      
      techParticipation:
        text: "How much does the member participate into technical development?"
        type: valueEnum()
      
      techLead:
        text: "Who would lead the technical team if you would get more personnel?"
        type: types.radio()
      
      leaveTech:
        text: "If the member would leave the project, how much would it affect the development schedule?"
        type: valueEnum()

      leaveFunding:
        text: "If the member would leave the project, how much would it affect the chances of getting funded?"
        type: valueEnum()
      
      launch:
        text: "If the member would leave the project, how much would it affect the launch or initial traction?"
        type: valueEnum()
      
      revenue:
        text: "If the member would leave the project, how much would it affect generating the revenue quickly?"
        type: valueEnum()
      
      pr:
        text: "How much does the member participate to the creation of marketing materials?"
        type: valueEnum()
        score: (scores, value) ->
          scores.biz += value / 5
      
      features:
        text: "How much does the member contribute to the product features?"
        type: valueEnum()
      
      budget:
        text: "Who maintains the budgeting spreadsheets?"
        type: types.radio()
      
      expenses:
        text: "How much does the member contribute to the business expenses (business cards, web hosting...)?"
        type: valueEnum()
      
      pitch:
        text: "Who pitches investors?"
        type: types.radio()
        
      connections:
        text: "How well is the member connected with the target industry (potential customers, journalists, influencers)?"
        type: valueEnum()

      ceo:
        text: "Who is or becomes the CEO?"
        type: types.radio()

    emphasis:
      ceo:
        text: "How much do you value the executive role?"
        info: "100 = normal valuation, 50 = half-valuation, 200 = double valuation"
        type: types.number(default: 140, min: 1, max: 250, unit: '%')

      dev:
        text: "How much do you value the development role?"
        info: "100 = normal valuation, 50 = half-valuation, 200 = double valuation"
        type: types.number(default: 120, min: 1, max: 250, unit: '%')

      biz:
        text: "How much do you value the business and marketing role?"
        info: "100 = normal valuation, 50 = half-valuation, 200 = double valuation"
        type: types.number(default: 100, min: 1, max: 250, unit: '%')


    score: (self, members, messages, emphasis) ->
      theCeo = members.filter((m) -> m.values.ceo)[0]

      addScore = (target, vals) ->
        for own k, v of vals
          target[k] += v

      ts = { ceo: 0, dev: 0, biz: 0 }  # teamScores
      for member in members
        ms = member.scores = { ceo: 0, dev: 0, biz: 0}
        mv = member.values

        addScore(ms, ceo: 5, dev: 3, biz: 3) if mv.idea
        addScore(ms, dev: mv.techParticipation)
        addScore(ms, ceo: 1, dev: 10) if mv.techLead
        addScore(ms, ceo: mv.leaveTech / 10, dev: mv.leaveTech)
        addScore(ms, ceo: mv.leaveFunding)
        addScore(ms, ceo: mv.launch / 3, dev: mv.launch / 3, biz: mv.launch / 3)
        addScore(ms, ceo: mv.revenue / 5, biz: mv.revenue)
        addScore(ms, biz: mv.pr / 5)
        addScore(ms, ceo: mv.features / 2, dev: mv.features / 5, biz: mv.features / 5)
        addScore(ms, ceo: 3, biz: 5) if mv.budget
        addScore(ms, ceo: mv.expenses / 5, biz: mv.expenses / 5)
        addScore(ms, ceo: 10, biz: 1) if mv.pitch
        addScore(ms, ceo: mv.connections / 3, biz: mv.connections)
        addScore(ms, ceo: 10) if mv.ceo

        for own id, value of ms
          val = ms[id] = ms[id] * (mv.participation / 100)
          ts[id] += val

      if not theCeo
        messages.push "You haven't selected the CEO."
      
      else if theCeo.scores.ceo < 35
        messages.push 'You appear to have a weak CEO.'

      if ts.dev < 25
        messages.push 'You should strengthen your development team.'
      
      if ts.biz < 20
        messages.push 'You should strengthen your business and marketing team.'

      eCeo = emphasis.ceo / 100
      eDev = emphasis.dev / 100
      eBiz = emphasis.biz / 100
      teamTotal = ts.ceo * eCeo + ts.dev * eDev + ts.biz * eBiz
      for member in members
        ms = member.scores
        memberTotal = ms.ceo * eCeo + ms.dev * eDev + ms.biz * eBiz
        member.equity = (Math.round(memberTotal / teamTotal * 1000) / 10) or 0

        if theCeo and (ms.ceo > theCeo.scores.ceo)
          messages.push "Maybe #{member.name} should be the CEO."
