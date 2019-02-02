// because this file is imported from cypress/support/index.js
// that means all other spec files will have this assertion plugin
// available to them because the supportFile is bundled and served
// prior to any spec files loading
import chaiDateString from "chai-date-string"

// chai is a global exposed by Cypress which means
// we can just simply extend it
chai.use(chaiDateString)


// we installed this node_module in package.json
// https://github.com/hurrymaplelad/chai-colors
import chaiColors from 'chai-colors'

// and we are extending chai to use this assertion
// plugin, but this plugin will only be available once
// this spec file runs.
//
// if we were running any other spec file
// it would not have access to this plugin
chai.use(chaiColors)