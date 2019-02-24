/**
 * Credits:  Original file available at https://github.com/hengkiardo/restcountries.
 Slightly change for Postman/Newman tests by bruno
 * Method:  cd /Applications/MAMP/htdocs/fl@g@pi/fl@g@pi-v2/
            node server.js
*/

var express = require('express');
var cookieParser = require('cookie-parser');
var compress = require('compression');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var path = require('path');
var expressValidator = require('express-validator');


/**
 * Create Express server.
 */

var app = express();

var hour = 3600000;
var day = hour * 24;
var week = day * 7;

/**
 * Load controllers.
 */
var API = require('./controllers/api');

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { maxAge: week }));

/**
 * Application routes.
 */

/**
      * @api {get} / Hello
      * @apiGroup 1_Welcome
      * @apiSuccess {String} message Welcome buddy! This is fl@g@pi v2
      * @apiSuccessExample Success-Response:
      *     HTTP/1.1 200 OK
      *     {
      *       "message": "Welcome buddy! This is fl@g@pi v2"
      *     }
      *
      * @apiErrorExample Error-Response:
      *     HTTP/1.1 404 Not Found
      *     [{
      *      "url": "/[the-route-that-does-not exist]",
      *     "message": "404, sorry, that page does not exist",
      *     "code": 404,
      *     "status": 404
      *     }]
   */
app.get('/', API.index);
app.get('/api/', API.index);

/**
    * @api {get} /api/v2 All countries
    * @apiGroup 2_Countries List
    * @apiSuccess {Object[]} list All Countries
    * @apiSuccess {String} name Country Name
    * @apiSuccess {String} tld Country top-level domain
    * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
    * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
    * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
    * @apiSuccess {String} currency Country Currency
    * @apiSuccess {String} flag Country Flag
    * @apiSuccess {Number} callingCode Country callingCode
    * @apiSuccess {String} capital Country Capital
    * @apiSuccess {String} altSpellings Country altSpellings
    * @apiSuccess {Number} relevance Country relevance
    * @apiSuccess {String} region Country region
    * @apiSuccess {String} subregion Country subregion
    * @apiSuccess {String} nativeLanguage Country native Language
    * @apiSuccess {String} languages Country Languages
    * @apiSuccess {String} translations Country Translations
    * @apiSuccess {Number} latlng Country Latitude and Longitude
    * @apiSuccess {String} demonym Country Demonym
    * @apiSuccess {String} borders Country Borders
    * @apiSuccess {Number} area Country Area
    * @apiSuccess {Number} status Country Status  
    */
app.get('/api/v2', API.getAll);

/**
    * @api {get} /api/v2 by callingCode
    * @apiGroup 2_Countries List
    * @apiSuccess {Object[]} list All the Countries
    * @apiSuccess {String} name Country Name
    * @apiSuccess {String} tld Country top-level domain
    * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
    * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
    * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
    * @apiSuccess {String} currency Country Currency
    * @apiSuccess {String} flag Country Flag
    * @apiSuccess {Number} callingCode Country callingCode
    * @apiSuccess {String} capital Country Capital
    * @apiSuccess {String} altSpellings Country altSpellings
    * @apiSuccess {Number} relevance Country relevance
    * @apiSuccess {String} region Country region
    * @apiSuccess {String} subregion Country subregion
    * @apiSuccess {String} nativeLanguage Country native Language
    * @apiSuccess {String} languages Country Languages
    * @apiSuccess {String} translations Country Translations
    * @apiSuccess {Number} latlng Country Latitude and Longitude
    * @apiSuccess {String} demonym Country Demonym
    * @apiSuccess {String} borders Country Borders
    * @apiSuccess {Number} area Country Area
    * @apiSuccess {Number} status Country Status
*/
app.get('/api/v2/callingcode/:callingCode', API.callingCode)


          /**
          * @api {get} /api/v2/region/:regionName by regionName
          * @apiGroup 2_Countries List
          * @apiSuccess {Object[]} list All the Countries
          * @apiSuccess {String} name Country Name
          * @apiSuccess {String} tld Country top-level domain
          * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
          * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
          * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
          * @apiSuccess {String} currency Country Currency
          * @apiSuccess {String} flag Country Flag
          * @apiSuccess {Number} callingCode Country callingCode
          * @apiSuccess {String} capital Country Capital
          * @apiSuccess {String} altSpellings Country altSpellings
          * @apiSuccess {Number} relevance Country relevance
          * @apiSuccess {String} region Country region
          * @apiSuccess {String} subregion Country subregion
          * @apiSuccess {String} nativeLanguage Country native Language
          * @apiSuccess {String} languages Country Languages
          * @apiSuccess {String} translations Country Translations
          * @apiSuccess {Number} latlng Country Latitude and Longitude
          * @apiSuccess {String} demonym Country Demonym
          * @apiSuccess {String} borders Country Borders
          * @apiSuccess {Number} area Country Area
          * @apiSuccess {Number} status Country Status
          * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/region/asia
          *  {
          *  "name": {
          *  "common": "Afghanistan",
          *  "official": "Islamic Republic of Afghanistan",
          *  "native": {
          *  "common": "افغانستان",
          *  "official": "د افغانستان اسلامي جمهوریت"
          *  }
          *  },
          *  "tld": [
          *  ".af"
          *  ],
          *  "cca2": "AF",
          *  "ccn3": "004",
          *  "cca3": "AFG",
          *  "currency": [
          *  "AFN"
          *  ],
          *  ...
          *  }
          * @apiErrorExample Error-Response:
          *     HTTP/1.1 404 Not Found
          *     [{
          * "message": "404, sorry, that page does not exist",
          * "code": 404,
          * "status": 404
          * }]
          */
app.get('/api/v2/region/:regionName', API.region)

                /**
                * @api {get} /api/v2/language/:nativelanguage_label by native language
                * @apiGroup 2_Countries List
                * @apiSuccess {Object[]} list All the Countries
                * @apiSuccess {String} name Country Name
                * @apiSuccess {String} tld Country top-level domain
                * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
                * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
                * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
                * @apiSuccess {String} currency Country Currency
                * @apiSuccess {String} flag Country Flag
                * @apiSuccess {Number} callingCode Country callingCode
                * @apiSuccess {String} capital Country Capital
                * @apiSuccess {String} altSpellings Country altSpellings
                * @apiSuccess {Number} relevance Country relevance
                * @apiSuccess {String} region Country region
                * @apiSuccess {String} subregion Country subregion
                * @apiSuccess {String} nativeLanguage Country native Language
                * @apiSuccess {String} languages Country Languages
                * @apiSuccess {String} translations Country Translations
                * @apiSuccess {Number} latlng Country Latitude and Longitude
                * @apiSuccess {String} demonym Country Demonym
                * @apiSuccess {String} borders Country Borders
                * @apiSuccess {Number} area Country Area
                * @apiSuccess {Number} status Country Status
                * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/language/spa
                *           {
                * "name": {
                * "common": "Argentina",
                * "official": "Argentine Republic",
                * "native": {
                * "common": "Argentina",
                * "official": "República Argentina"
                * }
                * },
                * "tld": [
                * ".ar"
                * ],
                * "cca2": "AR",
                * "ccn3": "032",
                * "cca3": "ARG",
                * "currency": [
                * "ARS"
                * ],
                * ...
                * @apiErrorExample Error-Response:
                *     HTTP/1.1 404 Not Found
                *     [{
                * "message": "404, sorry, that page does not exist",
                * "code": 404,
                * "status": 404
                * }]
                */ 
app.get('/api/v2/language/:nativelanguage_label', API.callingNativeLanguage)
          /**
          * @api {get} /api/v2/subregion/:subregionName by subregionName
          * @apiGroup 2_Countries List
          * @apiSuccess {Object[]} list All the Countries
          * @apiSuccess {String} name Country Name
          * @apiSuccess {String} tld Country top-level domain
          * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
          * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
          * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
          * @apiSuccess {String} currency Country Currency
          * @apiSuccess {String} flag Country Flag
          * @apiSuccess {Number} callingCode Country callingCode
          * @apiSuccess {String} capital Country Capital
          * @apiSuccess {String} altSpellings Country altSpellings
          * @apiSuccess {Number} relevance Country relevance
          * @apiSuccess {String} region Country region
          * @apiSuccess {String} subregion Country subregion
          * @apiSuccess {String} nativeLanguage Country native Language
          * @apiSuccess {String} languages Country Languages
          * @apiSuccess {String} translations Country Translations
          * @apiSuccess {Number} latlng Country Latitude and Longitude
          * @apiSuccess {String} demonym Country Demonym
          * @apiSuccess {String} borders Country Borders
          * @apiSuccess {Number} area Country Area
          * @apiSuccess {Number} status Country Status
          * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/subregion/caribbean
          *  "name": {
          *  "common": "Anguilla",
          *  "official": "Anguilla",
          *  "native": {
          *  "common": "Anguilla",
          *  "official": "Anguilla"
          *  }
          *  },
          *  "tld": [
          *  ".ai"
          *  ],
          *  "cca2": "AI",
          *  "ccn3": "660",
          *  "cca3": "AIA",
          *  "currency": [
          *  "XCD"
          *  ],
          * ...
          * @apiErrorExample Error-Response:
          *     HTTP/1.1 404 Not Found
          *     [{
          * "message": "404, sorry, that page does not exist",
          * "code": 404,
          * "status": 404
          * }]
          */
app.get('/api/v2/subregion/:subregionName', API.subregion)
            /**
            * @api {get} /api/v2/currency/:currency_code Country by currency
            * @apiGroup 3_Country
            * @apiSuccess {String} name Country Name
            * @apiSuccess {String} tld Country top-level domain
            * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
            * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
            * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
            * @apiSuccess {String} currency Country Currency
            * @apiSuccess {String} flag Country Flag
            * @apiSuccess {Number} callingCode Country callingCode
            * @apiSuccess {String} capital Country Capital
            * @apiSuccess {String} altSpellings Country altSpellings
            * @apiSuccess {Number} relevance Country relevance
            * @apiSuccess {String} region Country region
            * @apiSuccess {String} subregion Country subregion
            * @apiSuccess {String} nativeLanguage Country native Language
            * @apiSuccess {String} languages Country Languages
            * @apiSuccess {String} translations Country Translations
            * @apiSuccess {Number} latlng Country Latitude and Longitude
            * @apiSuccess {String} demonym Country Demonym
            * @apiSuccess {String} borders Country Borders
            * @apiSuccess {Number} area Country Area
            * @apiSuccess {Number} status Country Status  
            * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/currency/uah
            *  {
            *    "name": {
            *      "common": "Ukraine",
            *      "official": "Ukraine",
            *      "native": {
            *        "common": "Україна",
            *        "official": "Україна"
            *      }
            *    },
            *    "tld": [".ua", ".укр"],
            *    "cca2": "UA",
            *    "ccn3": "804",
            *    "cca3": "UKR",
            *    "currency": ["UAH"],
            *    "flag": ["UA", "Ukraine", "http:* localhost:3000/images/ua.png"],
            *    "callingCode": ["380"],
            *    "capital": "Kiev",
            *    "altSpellings": ["UA", "Ukrayina"],
            *    "relevance": "0",
            *    "region": "Europe",
            *    "subregion": "Eastern Europe",
            *    "nativeLanguage": "ukr",
            *    "languages": {
            *      "ukr": "Ukrainian"
            *    },
            *    "translations": {
            *      "deu": "Ukraine",
            *      "fra": "Ukraine",
            *      "hrv": "Ukrajina",
            *      "ita": "Ucraina",
            *      "jpn": "ウクライナ",
            *      "nld": "Oekraïne",
            *      "por": "Ucrânia",
            *      "rus": "Украина",
            *      "spa": "Ucrania"
            *    },
            *    "latlng": [49, 32],
            *    "demonym": "Ukrainian",
            *    "borders": ["BLR", "HUN", "MDA", "POL", "ROU", "RUS", "SVK"],
            *    "area": "603500",
            *    "status": "200"
            *  }
            * @apiErrorExample Error-Response:
            *     HTTP/1.1 404 Not Found
            *     [{
            * "message": "404, sorry, that page does not exist",
            * "code": 404,
            * "status": 404
            * }]
            */
app.get('/api/v2/currency/:currency_code', API.currency)
/*------------ Few routes added for fl@g@di v2 ------------*/ 
/**
          * @api {get} /api/v2/flag/:flag_label Single Country by flag
          * @apiGroup 3_Country
          * @apiSuccess {String} name Country Name
          * @apiSuccess {String} tld Country top-level domain
          * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
          * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
          * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
          * @apiSuccess {String} currency Country Currency
          * @apiSuccess {String} flag Country Flag
          * @apiSuccess {Number} callingCode Country callingCode
          * @apiSuccess {String} capital Country Capital
          * @apiSuccess {String} altSpellings Country altSpellings
          * @apiSuccess {Number} relevance Country relevance
          * @apiSuccess {String} region Country region
          * @apiSuccess {String} subregion Country subregion
          * @apiSuccess {String} nativeLanguage Country native Language
          * @apiSuccess {String} languages Country Languages
          * @apiSuccess {String} translations Country Translations
          * @apiSuccess {Number} latlng Country Latitude and Longitude
          * @apiSuccess {String} demonym Country Demonym
          * @apiSuccess {String} borders Country Borders
          * @apiSuccess {Number} area Country Area
          * @apiSuccess {Number} status Country Status  
          * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/flag/af
          * {
          *   "name": {
          *     "common": "Afghanistan",
          *     "official": "Islamic Republic of Afghanistan",
          *     "native": {
          *       "common": "افغانستان",
          *       "official": "د افغانستان اسلامي جمهوریت"
          *     }
          *   },
          *   "tld": [".af"],
          *   "cca2": "AF",
          *   "ccn3": "004",
          *   "cca3": "AFG",
          *   "currency": ["AFN"],
          *   "flag": ["AF", "Afghanistan", "http://localhost:3000/images/af.png"],
          *   "callingCode": ["93"],
          *   "capital": "Kabul",
          *   "altSpellings": ["AF", "Afġānistān"],
          *   "relevance": "0",
          *   "region": "Asia",
          *   "subregion": "Southern Asia",
          *   "nativeLanguage": "pus",
          *   "languages": {
          *     "prs": "Dari",
          *     "pus": "Pashto",
          *     "tuk": "Turkmen"
          *   },
          *   "translations": {
          *     "cym": "Affganistan",
          *     "deu": "Afghanistan",
          *     "fra": "Afghanistan",
          *     "hrv": "Afganistan",
          *     "ita": "Afghanistan",
          *     "jpn": "アフガニスタン",
          *     "nld": "Afghanistan",
          *     "por": "Afeganistão",
          *     "rus": "Афганистан",
          *     "spa": "Afganistán"
          *   },
          *   "latlng": [33, 65],
          *   "demonym": "Afghan",
          *   "borders": ["IRN", "PAK", "TKM", "UZB", "TJK", "CHN"],
          *   "area": "652230",
          *   "status": "200"
          * }
          * @apiErrorExample Error-Response:
          *     HTTP/1.1 404 Not Found
          *     [{
          * "message": "404, sorry, that page does not exist",
          * "code": 404,
          * "status": 404
          * }]
          */
app.get('/api/v2/flag/:flag_label', API.flagCountryId)
        /**
        * @api {get} /api/v2/name/:cca2_label Single Country by cca2
        * @apiGroup 3_Country
        * @apiSuccess {String} name Country Name
        * @apiSuccess {String} tld Country top-level domain
        * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
        * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
        * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
        * @apiSuccess {String} currency Country Currency
        * @apiSuccess {String} flag Country Flag
        * @apiSuccess {Number} callingCode Country callingCode
        * @apiSuccess {String} capital Country Capital
        * @apiSuccess {String} altSpellings Country altSpellings
        * @apiSuccess {Number} relevance Country relevance
        * @apiSuccess {String} region Country region
        * @apiSuccess {String} subregion Country subregion
        * @apiSuccess {String} nativeLanguage Country native Language
        * @apiSuccess {String} languages Country Languages
        * @apiSuccess {String} translations Country Translations
        * @apiSuccess {Number} latlng Country Latitude and Longitude
        * @apiSuccess {String} demonym Country Demonym
        * @apiSuccess {String} borders Country Borders
        * @apiSuccess {Number} area Country Area
        * @apiSuccess {Number} status Country Status  
        * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/name/BI
        * {
        *   "name": {
        *     "common": "Burundi",
        *     "official": "Republic of Burundi",
        *     "native": {
        *       "common": "Burundi",
        *       "official": "République du Burundi"
        *     }
        *   },
        *   "tld": [".bi"],
        *   "cca2": "BI",
        *   "ccn3": "108",
        *   "cca3": "BDI",
        *   "currency": ["BIF"],
        *   "flag": ["BI", "Burundi", "http://localhost:3000/images/bi.png"],
        *   "callingCode": ["257"],
        *   "capital": "Bujumbura",
        *   "altSpellings": ["BI", "Republic of Burundi", "Republika y'Uburundi", "République du Burundi"],
        *   "relevance": "0",
        *   "region": "Africa",
        *   "subregion": "Eastern Africa",
        *   "nativeLanguage": "run",
        *   "languages": {
        *     "fra": "French",
        *     "run": "Kirundi"
        *   },
        *   "translations": {
        *     "cym": "Bwrwndi",
        *     "deu": "Burundi",
        *     "fra": "Burundi",
        *     "hrv": "Burundi",
        *     "ita": "Burundi",
        *     "jpn": "ブルンジ",
        *     "nld": "Burundi",
        *     "por": "Burundi",
        *     "rus": "Бурунди",
        *     "spa": "Burundi"
        *   },
        *   "latlng": [-3.5, 30],
        *   "demonym": "Burundian",
        *   "borders": ["COD", "RWA", "TZA"],
        *   "area": "27834",
        *   "status": "200"
        * }
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 404 Not Found
        *     [{
        * "message": "404, sorry, that page does not exist",
        * "code": 404,
        * "status": 404
        * }]
        */
app.get('/api/v2/name/:cca2_label', API.callingCca2)
        /**
        * @api {get} /api/v2/capital/:capital_label Single Country by capital
        * @apiGroup 3_Country
        * @apiSuccess {String} name Country Name
        * @apiSuccess {String} tld Country top-level domain
        * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
        * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
        * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
        * @apiSuccess {String} currency Country Currency
        * @apiSuccess {String} flag Country Flag
        * @apiSuccess {Number} callingCode Country callingCode
        * @apiSuccess {String} capital Country Capital
        * @apiSuccess {String} altSpellings Country altSpellings
        * @apiSuccess {Number} relevance Country relevance
        * @apiSuccess {String} region Country region
        * @apiSuccess {String} subregion Country subregion
        * @apiSuccess {String} nativeLanguage Country native Language
        * @apiSuccess {String} languages Country Languages
        * @apiSuccess {String} translations Country Translations
        * @apiSuccess {Number} latlng Country Latitude and Longitude
        * @apiSuccess {String} demonym Country Demonym
        * @apiSuccess {String} borders Country Borders
        * @apiSuccess {Number} area Country Area
        * @apiSuccess {Number} status Country Status  
        * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/capital/Santiago
        *     HTTP/1.1 200 OK 

        * [{
        *   "name": {
        *     "common": "Chile",
        *     "official": "Republic of Chile",
        *     "native": {
        *       "common": "Chile",
        *       "official": "República de Chile"
        *     }
        *   },
        *   "tld": [".cl"],
        *   "cca2": "CL",
        *   "ccn3": "152",
        *   "cca3": "CHL",
        *   "currency": ["CLF", "CLP"],
        *   "flag": ["CL", "Chile", "http://localhost:3000/images/cl.png"],
        *   "callingCode": ["56"],
        *   "capital": "Santiago",
        *   "altSpellings": ["CL", "Republic of Chile", "República de Chile"],
        *   "relevance": "0",
        *   "region": "Americas",
        *   "subregion": "South America",
        *   "nativeLanguage": "spa",
        *   "languages": {
        *     "spa": "Spanish"
        *   },
        *   "translations": {
        *     "cym": "Chile",
        *     "deu": "Chile",
        *     "fra": "Chili",
        *     "hrv": "Čile",
        *     "ita": "Cile",
        *     "jpn": "チリ",
        *     "nld": "Chili",
        *     "por": "Chile",
        *     "rus": "Чили",
        *     "spa": "Chile"
        *   },
        *   "latlng": [-30, -71],
        *   "demonym": "Chilean",
        *   "borders": ["ARG", "BOL", "PER"],
        *   "area": "756102",
        *   "status": "200"
        * }]
        *
        * @apiErrorExample Error-Response:
        *     HTTP/1.1 404 Not Found
        *     [{
        * "message": "404, sorry, that page does not exist",
        * "code": 404,
        * "status": 404
        * }]
        */
app.get('/api/v2/capital/:capital_label', API.callingCapital)

          /**
          * @api {get} /api/v2/language/:nativelanguage_label Single Country by tld
          * @apiGroup 3_Country
          * @apiSuccess {String} name Country Name
          * @apiSuccess {String} tld Country top-level domain
          * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
          * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
          * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
          * @apiSuccess {String} currency Country Currency
          * @apiSuccess {String} flag Country Flag
          * @apiSuccess {Number} callingCode Country callingCode
          * @apiSuccess {String} capital Country Capital
          * @apiSuccess {String} altSpellings Country altSpellings
          * @apiSuccess {Number} relevance Country relevance
          * @apiSuccess {String} region Country region
          * @apiSuccess {String} subregion Country subregion
          * @apiSuccess {String} nativeLanguage Country native Language
          * @apiSuccess {String} languages Country Languages
          * @apiSuccess {String} translations Country Translations
          * @apiSuccess {Number} latlng Country Latitude and Longitude
          * @apiSuccess {String} demonym Country Demonym
          * @apiSuccess {String} borders Country Borders
          * @apiSuccess {Number} area Country Area
          * @apiSuccess {Number} status Country Status  
          * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/tld/.jp
          *     HTTP/1.1 200 OK 
          * {
          *    "name": {
          *      "common": "Japan",
          *      "official": "Japan",
          *      "native": {
          *        "common": "日本",
          *        "official": "日本"
          *      }
          *    },
          *    "tld": [".jp", ".みんな"],
          *    "cca2": "JP",
          *    "ccn3": "392",
          *    "cca3": "JPN",
          *    "currency": ["JPY"],
          *    "flag": ["JP", "Japan", "http:* localhost:3000/images/jp.png"],
          *    "callingCode": ["81"],
          *    "capital": "Tokyo",
          *    "altSpellings": ["JP", "Nippon", "Nihon"],
          *    "relevance": "2.5",
          *    "region": "Asia",
          *    "subregion": "Eastern Asia",
          *    "nativeLanguage": "jpn",
          *    "languages": {
          *      "jpn": "Japanese"
          *    },
          *    "translations": {
          *      "deu": "Japan",
          *      "fra": "Japon",
          *      "hrv": "Japan",
          *      "ita": "Giappone",
          *      "jpn": "日本",
          *      "nld": "Japan",
          *      "por": "Japão",
          *      "rus": "Япония",
          *      "spa": "Japón"
          *    },
          *    "latlng": [36, 138],
          *    "demonym": "Japanese",
          *    "borders": [],
          *    "area": "377930",
          *    "status": "200"
          *  }
          *
          * @apiErrorExample Error-Response:
          *     HTTP/1.1 404 Not Found
          *     [{
          * "message": "404, sorry, that page does not exist",
          * "code": 404,
          * "status": 404
          * }]
          */
app.get('/api/v2/tld/:tld_label', API.callingTld)
          /**
          * @api {get} /api/v2/area/:area_nb Single Country by area
          * @apiGroup 3_Country
          * @apiSuccess {String} name Country Name
          * @apiSuccess {String} tld Country top-level domain
          * @apiSuccess {String} cca2 Country code ISO 3166-1 alpha-2
          * @apiSuccess {Number} ccn3 Country code ISO 3166-1 numeric
          * @apiSuccess {String} cca3 Country code ISO 3166-1 alpha-3 
          * @apiSuccess {String} currency Country Currency
          * @apiSuccess {String} flag Country Flag
          * @apiSuccess {Number} callingCode Country callingCode
          * @apiSuccess {String} capital Country Capital
          * @apiSuccess {String} altSpellings Country altSpellings
          * @apiSuccess {Number} relevance Country relevance
          * @apiSuccess {String} region Country region
          * @apiSuccess {String} subregion Country subregion
          * @apiSuccess {String} nativeLanguage Country native Language
          * @apiSuccess {String} languages Country Languages
          * @apiSuccess {String} translations Country Translations
          * @apiSuccess {Number} latlng Country Latitude and Longitude
          * @apiSuccess {String} demonym Country Demonym
          * @apiSuccess {String} borders Country Borders
          * @apiSuccess {Number} area Country Area
          * @apiSuccess {Number} status Country Status  
          * @apiSuccessExample Success-Response. Example: http://localhost:3000/api/v2/area/17098242
          *     HTTP/1.1 200 OK 
          *  {
          *    "name": {
          *      "common": "Russia",
          *      "official": "Russian Federation",
          *      "native": {
          *        "common": "Россия",
          *        "official": "Русская Федерация"
          *      }
          *    },
          *    "tld": [".ru", ".su", ".рф"],
          *    "cca2": "RU",
          *    "ccn3": "643",
          *    "cca3": "RUS",
          *    "currency": ["RUB"],
          *    "flag": ["RU", "Russian Federation", "http:* localhost:3000/images/ru.png"],
          *    "callingCode": ["7"],
          *    "capital": "Moscow",
          *    "altSpellings": ["RU", "Rossiya", "Russian Federation", "Российская Федерация", "Rossiyskaya Federatsiya"],
          *    "relevance": "2.5",
          *    "region": "Europe",
          *    "subregion": "Eastern Europe",
          *    "nativeLanguage": "rus",
          *    "languages": {
          *      "rus": "Russian"
          *    },
          *    "translations": {
          *      "deu": "Russland",
          *      "fra": "Russie",
          *      "hrv": "Rusija",
          *      "ita": "Russia",
          *      "jpn": "ロシア連邦",
          *      "nld": "Rusland",
          *      "por": "Rússia",
          *      "rus": "Россия",
          *      "spa": "Rusia"
          *    },
          *    "latlng": [60, 100],
          *    "demonym": "Russian",
          *    "borders": ["AZE", "BLR", "CHN", "EST", "FIN", "GEO", "KAZ", "PRK", "LVA", "LTU", "MNG", "NOR", "POL", "UKR"],
          *    "area": "17098242",
          *    "status": "200"
          *  }
          * @apiErrorExample Error-Response:
          *     HTTP/1.1 404 Not Found
          *     [{
          * "message": "404, sorry, that page does not exist",
          * "code": 404,
          * "status": 404
          * }]
          */

          app.get('/api/v2/area/:area_nb', API.callingArea)
/*------------ // Few routes added for fl@g@di v2 ------------*/ 


/**
 * 500 Error Handler.
 * As of Express 4.0 it must be placed at the end, after all routes.
 */

app.use(function(err, req, res, next){
  // treat as 404
  if (err.message
    && (~err.message.indexOf('not found')
    || (~err.message.indexOf('Cast to ObjectId failed')))) {
    return next()
  }
  // log it
  // send emails if you want
  // error page
  res.status(500).json({
    error: err,
    pkg: pkg,
    CONFIG: CONFIG
  })
})

// assume 404 since no middleware responded
app.use(function(req, res, next){
  res.status(404).json({
    url: req.originalUrl,
    message: "404, sorry, that page does not exist",
    code: 404,
    status: 404
  })
})

if (app.get('env') === 'development') {
  app.use(errorHandler())
}

/*------------ Add filename for fl@g@di ------------*/ 
var file = 'countriesV1_8.json';
var localhost_url = 'http://localhost:3000/api/v2/';

/**
 * Start Express server.
 */

/*------------ Change the welcome message in console for fl@g@di ------------*/ 
app.listen(app.get('port'), function() {
  console.log("✔ Express server listening at "+localhost_url+" on port %d in %s mode with "+file+" file", app.get('port'), app.get('env'));
});


module.exports = app;
