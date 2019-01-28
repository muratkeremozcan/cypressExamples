app.directive "contenteditable", () ->
  require: "ngModel"
  link: (scope, elm, attrs, ctrl) ->
    preventEmpty = attrs.preventEmpty or false

    ctrl.$render = ->
      elm.html(ctrl.$viewValue)

    elm.bind "blur", ->
      scope.$apply ->
        if preventEmpty and elm.html().replace(/^\s+|\s+$/g, "").length == 0
          elm.html(ctrl.$viewValue)
        else
          newVal = elm.html().replace(/<br>/g, ' ')  # no linebreaks
          elm.html(newVal)
          ctrl.$setViewValue(newVal)


app.directive "piegraph", ->
  restrict: "E"
  replace: true
  template: '<div class="piegraph"></div>'
  scope:
    width: '@'
    height: '@'
    slices: '='  # function returning array of objects with keys {name, value}
    colors: '='
  link: (scope, element, attrs) ->
    [width, height] = [parseInt(scope.width), parseInt(scope.height)]
    svg = d3.select(element[0])
            .append("svg").attr("width", width).attr("height", height)
            .append("g").attr("transform", "translate(#{width / 2}, #{height / 2})")
    radius = Math.min(width, height) / 2 - 10
    pie = d3.layout.pie().sort(null).value((d) -> d.value)
    arc = d3.svg.arc().outerRadius(radius).innerRadius(0)
    color = d3.scale.ordinal().range(scope.colors)

    update = (slices) ->
      nonZeroSlices = (slice for slice in slices when slice.value > 0)
      svg.selectAll('*').remove();
      if nonZeroSlices.length > 0
        g = svg.selectAll(".arc").data(pie(nonZeroSlices)).enter()
               .append("g").attr("class", "arc")
        g.append("path").attr("d", arc).style("fill", (d) -> color(d.data.name))
        g.append("text").attr("transform", (d) ->
          "translate(#{arc.centroid(d)})"
        ).attr("dy", ".35em").style("text-anchor", "middle").text (d) ->
          d.data.name
      else
        svg.append("circle").attr("r", radius).attr('fill', '#fff')
          .attr('stroke', '#98abc5')

    scope.$watch('slices', update, true)


app.directive "sliceGraph", ($compile) ->
  restrict: 'A'
  scope:
    width: '@'
    height: '@'
    slices: '='  # function returning array of objects with keys {name, value}
    colors: '='
  link: (scope, element, attrs) ->
    update = ->
      $('.i-slice-graph').remove()
      html = []
      html.push "<div class=\"i-slice-graph\">"
      prevY = 0
      for slice, i in scope.slices
        h = 0
        if slice.value != 0
          h = Math.round(+scope.height / 100 * slice.value)
        style = []
        style.push "left: 0; top: #{prevY}px; width: #{+scope.width}px; height: #{h}px;"
        style.push "background-color: #{scope.colors[i]};"
        style = style.join(' ')
        html.push "  <div style=\"#{style}\" popover-placement=\"right\" popover=\"#{slice.name}: #{slice.value}%\"></div>"
        prevY += h
      html.push "</div>"
      bars = $(html.join(''))
      element.append(bars)
      $compile(bars)(scope)
    scope.$watch('slices', update, true)


app.directive "showInSections", ($timeout) ->
  restrict: 'A'
  link: (scope, element, attrs) ->
    w = $(window)
    offset = 60

    isViewed = (elemId) ->
      elem = $('#' + elemId)
      docViewTop = w.scrollTop()
      docViewBottom = docViewTop + w.height()
      elemTop = elem.offset().top
      elemBottom = elemTop + elem.height()
      (elemTop < docViewTop + offset) and (elemBottom > docViewTop)

    showHide = ->
      sections = attrs.showInSections.split(';')
      viewed = false
      for section in sections
        break if viewed = isViewed(section)
      if viewed
        $(element).fadeIn()
      else
        $(element).fadeOut()

    $(window).scroll -> showHide()
    $timeout (-> $(element).hide(); showHide()), 1



app.directive "valueCell", ($compile) ->
  restrict: 'A'
  require: 'ngModel'
  link: (scope, element, attrs, ctrl) ->
    typeDef = scope.$eval(attrs.valueCell)
    # FIXME: on model changes, link function is called even though the model
    #  is not yet settled causing errors on log. The fullowing
    #  temporary fix prevents these errors happening (but there's still futile link-calls)
    return if not typeDef  
    radioUnselector = element.attr('radio-unselector')
    html = []
    switch typeDef.typeName
      when 'checkbox'
        html.push '<input @@@ type="checkbox"'
        html.push 'checked="checked"' if typeDef.default
        html.push '></input>'
      when 'radio'
        html.push '<input @@@ type="checkbox"'
        html.push "ng-click=\"#{ radioUnselector }\""
        html.push '></input>'
      when 'number'
        html.push '<input @@@ type="number"'
        html.push "value=\"#{typeDef.default}\""
        html.push 'select-on-focus></input>'
        if typeDef.unit
          html.push "<span class=\"value-unit\">#{typeDef.unit}</span>"
      when 'enum'
        scope.selectOptions = ([v, k] for own k, v of typeDef.values)
        html.push "<select @@@ ng-options=\"o[0] as o[1] for o in selectOptions\">"
        html.push '</select>'

    html = html.join(' ')
    html = html.replace('@@@', "ng-model=\"#{ element.attr('ng-model') }\"")
    input = angular.element(html)
    element.append(input)
    $compile(input)(scope)

    if typeDef.typeName in ['checkbox', 'radio']
      input.click (e) ->
        e.stopPropagation()  # prevent td to take control

      $(element).click (e) ->
        scope.$apply ->
          newVal = !input.prop('checked')
          input.prop('checked', newVal)
          ctrl.$setViewValue(newVal)
          if element.attr('radio-unselector') and typeDef.typeName == 'radio'
            scope.$eval(radioUnselector)



app.directive "scrollTo", ($timeout) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    element.bind "click", ->
      $timeout ->  # needs delay if there's ng-show before scroll
        offset = attrs.offset or 0
        target = $('#' + attrs.scrollTo)
        speed = attrs.speed or 500
        $("html,body").stop().animate
          scrollTop: target.offset().top - offset
        , speed
      , 1



app.directive "fullyCentered", ($timeout) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    $(window).resize ->
      $(element).css
        position: 'absolute'
        left: ($(window).width() - $(element).outerWidth()) / 2
        top: ($(window).height() - $(element).outerHeight()) / 2
    $timeout((-> $(window).resize()), 1)


app.directive "selectOnFocus", () ->
  restrict: "A"
  link: (scope, element, attrs) ->
    $(element).on "click", ->
      $(element).select()


app.directive "legacyBrowserRejector", ($window) ->
  restrict: "A"
  link: (scope, element, attrs) ->
    $window.onload = ->
      $.reject
        reject:
          all: false
          msie5: true
          msie6: true
          msie7: true
          msie8: true
        browserInfo:
          firefox:
            text: 'Mozilla Firefox'
            url: 'http://www.mozilla.com/firefox/'
          chrome:
            text: 'Google Chrome'
            url: 'http://www.google.com/chrome/'
          msie:
            text: 'Internet Explorer'
            url: 'http://www.microsoft.com/windows/Internet-explorer/'
        imagePath: attrs.browserImagePath
        display: ['firefox', 'chrome', 'msie']
