describe 'Trace', ->
  t = null

  beforeEach ->
    module('piechopper')
    inject (trace) -> 
      t = trace

  it "Should form proper GA array",  ->
    expect(t.createGaArray('category:action:opt_label', 1)).toEqual(
      [ '_trackEvent', 'category', 'action', 'opt_label', 1 ])
    expect(t.createGaArray('category:action', 1)).toEqual(
      [ '_trackEvent', 'category', 'action', null, 1 ])
    expect(t.createGaArray('category', 1)).toEqual(
      [ '_trackEvent', 'category', null, null, 1 ])
    expect(t.createGaArray('', 1)).toEqual(
      [ '_trackEvent', null, null, null, 1 ])
    expect(t.createGaArray('category:action:opt_label:extra', 1)).toEqual(
      [ '_trackEvent', 'category', 'action', 'opt_label', 1 ])
    expect(t.createGaArray('category:action:opt_label:extra:extra2', 1)).toEqual(
      [ '_trackEvent', 'category', 'action', 'opt_label', 1 ])

  it "Should trace properly", ->
    expect(t.trace('foo:bar', 2)).toEqual(['_trackEvent', 'foo', 'bar', null, 2])
    expect(t.traceFirst('onlyOnce', 10)).toEqual(['_trackEvent', 'onlyOnce', null, null, 10])
    expect(t.traceFirst('onlyOnce', 10)).toEqual([])
    expect(t.traceFirst('onlyOnce', 20)).toEqual([])

  it "Should handle facade methods the right way", ->
    expect(t.addMember()).toEqual(['_trackEvent', 'Click', 'Add / Remove Member', null, 10])
    expect(t.addMember()).toEqual([])
