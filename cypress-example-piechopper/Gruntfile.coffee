module.exports = (grunt) ->
  acceptedTargets = ['development', 'staging', 'production']
  targetName = "#{grunt.option('target') || 'development'}"
  if targetName not in acceptedTargets
    throw "Grunt target must be one of " + acceptedTargets

  readConfig = ->
    flattenObject = (obj) ->
      for own k, v of obj
        if (typeof obj[k]) is 'object'
          flattenObject(obj[k])
          for own k2 of obj[k]
            obj["#{k}.#{k2}"] = obj[k][k2]
      obj

    getJsonConfig = (target) ->
      try
        return grunt.file.readJSON("config/#{target}.json")
      catch e
        return null

    config =
      deploy: getJsonConfig('deploy') or { address: '', username: '', password: ''}
      targetName: targetName
      timestamp: grunt.template.today('yyyy-mm-d--HH-MM-ss')
      targets:
        development: getJsonConfig('development')
        staging: getJsonConfig('staging') or {}
        production: getJsonConfig('production') or {}
      addCommonSetting: (key, value) ->
        for own k, v of config.targets
          v[key] = value
    config.addCommonSetting('deploy', config.deploy)
    config.addCommonSetting('timestamp', config.timestamp)
    config.target = config.targets[targetName]
    config.addCommonSetting('name', targetName)
    flattenObject(config)
  config = readConfig()


  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')
    config: config

    watch:
      all:
        files: [
          'app/**/*.coffee'
          'app/**/*.scss'
          'app/**/*.html'
          'app/**/*.svg'
          'app/**/*.ico'
          'app/**/*.png'
          'server/src/**/*'
          'e2e/**/*'
          'Gruntfile.coffee'
          'config/**/*'
        ]
        tasks: 'default'

    clean:
      preBuild: ['build']
      postBuild: ['build/preprocess']
      distClean: config.target.removedFiles

    copy:
      lib:
        files: [
          expand: true
          flatten: true
          src: [
            'bower_components/font-awesome/fonts/*'
          ]
          dest: 'build/served/vendor/fonts/'
         ,
          expand: true
          flatten: true
          src: [
            'bower_components/bower-bootstrap-css/*.min.css'
            'bower_components/font-awesome/css/font-awesome.min.css'
            'bower_components/angular-ui/build/angular-ui.min.css'
          ]
          dest: 'build/served/vendor/css/'
         ,
          expand: true
          flatten: true
          src: ['app/vendor/jreject/browsers/*.gif']
          dest: 'build/served/vendor/images/'
         ,
          expand: true
          flatten: true
          src: [
            'bower_components/jquery/*.js'
            'bower_components/jquery/*.map'
            'bower_components/angular/*.js'
            'bower_components/angular-sanitize/*.js'
            'bower_components/angular-sanitize/*.map'
            'bower_components/angular-ui/build/*.js'
            'bower_components/angular-ui-bootstrap-bower/*.js'
            'bower_components/angular-mocks/*.js'
            'bower_components/d3/*.js'
            'app/vendor/**/*.js'
          ]
          dest: 'build/served/vendor/js/'
         ,
          expand: true
          cwd: 'bower_components/angular-ui-bootstrap/template/'
          src: ['**']
          dest: 'build/served/vendor/js/template/'
         ,
          expand: true
          flatten: true
          src: [ 'app/vendor/**/*.css' ]
          dest: 'build/served/vendor/css/'
         ,
          expand: true
          flatten: true
          src: [ 'app/vendor/**/*.woff' ]
          dest: 'build/served/vendor/fonts/'
        ]
      appImages:
        files: [
          expand: true
          flatten: true
          src: [
            'app/**/*.ico'
            'app/**/*.png'
          ]
          dest: 'build/served/app/img/'
        ]
      preProcess:
        files: [
          expand: true
          flatten: false
          src: ['app/**/*', 'server/**/*', 'config/**/*', 'e2e/**/*']
          dest: 'build/preprocess/'
        ]
      appHtmls:
        files: [
          expand: true
          flatten: true
          src: ['build/preprocess/app/*.html']
          dest: 'build/served/'
        ]
      serverMgmt:
        files: [
          expand: true
          flatten: false
          cwd: 'build/preprocess/server/mgmt'
          src: ['**/*']
          dest: 'build/server/mgmt/'
        ]


    preprocess:
      options:
        inline: true
      src:
        options:
          context: config
        src: [
          'build/preprocess/**/*.*'
          '!build/preprocess/app/vendor/**/*'
        ]

    coffee:
      options:
        sourceMap: false
        bare: true
      app:
        files:
          'build/served/app/js/app.js': [
            'build/preprocess/app/coffee/init.coffee'
            'build/preprocess/app/coffee/**/*.coffee'
            '!build/preprocess/app/coffee/**/*Spec.coffee'
          ]
      server:
        files:
          'build/server/src/server.js': 'build/preprocess/server/src/server.coffee'
          'build/server/src/db.js': 'build/preprocess/server/src/db.coffee'
          'build/server/src/config.js': 'build/preprocess/server/src/config.coffee'

    ngmin:
      app:
        src: ['build/served/app/js/app.js']
        dest: 'build/served/app/js/app.min.js'

    uglify:
      app:
        files:
          'build/served/app/js/app.min.js': ['build/served/app/js/app.min.js']

    cssmin:
      app:
        files:
          'build/served/app/css/style.min.css': ['build/served/app/css/style.css']

    sass:
      app:
        files:
          'build/served/app/css/style.css': 'build/preprocess/app/style/*.scss'

    exec:
      browser:
        command: 'chrome http://localhost:8080 &'
      server:
        command: "./node_modules/.bin/nodemon --delay 2 build/server/src/server.js"

    sshconfig:
      server:
        host: config.deploy.address
        username: config.deploy.username
        password: config.deploy.password

    sshexec:
      options:
        config: 'server'
        path: '/'
      listVersions:
        command: "cd #{config.target.webServer.directory}; ls -1t versions/"
      createLinkToLatest:
        command: "cd #{config.target.webServer.directory}; rm -f build; ln -s versions/`ls versions -1t | head -1` build"
      restartServer:
        command: "cd #{config.target.webServer.directory}; sh build/server/mgmt/express/stop.sh; sleep #{config.target.webServer.restartDelaySecs}; sh build/server/mgmt/express/start.sh;"

    sftp:
      options:
        config: 'server'
        path: "#{config.target.webServer.directory}/versions/#{config.timestamp}/"
        srcBasePath: 'build/'
        createDirectories: true
      deploy:
        files:
          "./": 'build/**'


  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-preprocess'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-exec'
  grunt.loadNpmTasks 'grunt-ssh'
  grunt.loadNpmTasks 'grunt-ngmin'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'

  grunt.registerTask 'build', [
    'clean:preBuild'
    'copy:lib'
    'copy:preProcess'
    'preprocess'
    'copy:appImages'
    'copy:appHtmls'
    'copy:serverMgmt'
    'coffee:app'
    'coffee:server'
    'ngmin:app'
    'uglify:app'
    'cssmin:app'
    'clean:postBuild'
    'clean:distClean'
  ]

  grunt.registerTask 'deploy', [
    'build'
    'sftp:deploy'
    'sshexec:createLinkToLatest'
    'sshexec:restartServer'
  ]

  grunt.registerTask 'browse', ['exec:browser']
  grunt.registerTask 'serve', ['exec:server']
  grunt.registerTask 'default', ['build']
