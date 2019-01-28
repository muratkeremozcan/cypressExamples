CONFIG =
# @if target.name == 'development'
# @include ../../../../config/development.json
# @endif
# @if target.name == 'staging'
# @include ../../../../config/staging.json
# @endif
# @if target.name == 'production'
# @include ../../../../config/production.json
# @endif

exports.config = CONFIG
