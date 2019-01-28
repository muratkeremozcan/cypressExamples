modelDefs.add

  id: 'd691b574-58d0-44dd-be19-7196d34d781f'
  name: 'Market Value'
  version: '1.0'
  image: 'marketValueModel.png'
  target: "If you want to match equity to monetary value of the contribution."
  priority: 20
  desc: """
      <p>This method compares market price for each contribution in the company.
      It considers the opportunity cost of the lost salary, as well as assets and sales
      benefitting the project.</p>
      <p>The method is inspired by the <a href="http://www.slicingpie.com/">Slicing Pie</a> website.</p>
    """

  criterias:
    marketSalary:
      text: "What is the member's market salary per month?"
      type: types.number(default: 0, min: 0, unit: '$')
    
    salary:
      text: "How much does the member get salary from the company per month?"
      type: types.number(default: 0, min: 0, unit: '$')
    
    hours:
      text: "How many hours has the member been working for the company?"
      type: types.number(default: 0, min: 0, unit: 'h')
      
    cash:
      text: "How much cash is the member investing?"
      type: types.number(default: 0, min: 0, unit: '$')
      
    otherItems:
      text: "How much does the member bring in other valuables (premises, tools etc.)?"
      type: types.number(default: 0, min: 0, unit: '$')
  
    sales:
      text: "How much sales revenue is the member bringing in?"
      type: types.number(default: 0, min: 0, unit: '$')
      
    salesCommissionPercent:
      text: "What is the sales commission percent that is usually paid on the market?"
      type: types.number(default: 0, min: 0, max: 100, unit: '%')
    
    salesCommissionPaid:
      text: "How much sales commission has been paid to the member?"
      type: types.number(default: 0, min: 0, unit: '$')
      
  emphasis:
    salary:
      text: "How much do you value contributed work?"
      type: types.number(default: 200, min: 0, unit: '%')

    cash:
      text: "How much do you value contributed cash?"
      type: types.number(default: 400, min: 0, unit: '%')

    otherItems:
      text: "How much do you value contributed other items?"
      type: types.number(default: 400, min: 0, unit: '%')

    sales:
      text: "How much do you value sales?"
      type: types.number(default: 200, min: 0, unit: '%')

  score: (self, members, messages, emphasis) ->
    pie = 0
    for member in members
      ms = member.scores = { slice: 0 }
      mv = member.values

      salaryPart = (mv.marketSalary - mv.salary) / 160 * mv.hours * (emphasis.salary / 100) 
      if salaryPart < 0
        messages.push "#{member.name}'s salary is too high."
        salaryPart = 0
      ms.slice = salaryPart

      ms.slice += mv.cash * (emphasis.cash / 100)
      ms.slice += mv.otherItems * (emphasis.otherItems / 100)
      
      salesPart = ((mv.sales * mv.salesCommissionPercent / 100) - mv.salesCommissionPaid) * (emphasis.sales / 100)
      if salesPart < 0
        messages.push "#{member.name}'s sales commission is too high."
        salaryPart = 0

      ms.slice += salesPart
      pie += ms.slice
    
    for member in members
      member.equity = (Math.round(member.scores.slice / pie * 1000) / 10) or 0
