/* 
Original file available at https://github.com/hengkiardo/restcountries
Slightly change for Postman/Newman tests by bruno
*/

var _ = require('lodash');
var validator = require('validator');
var countries = require('../resources/countriesV1_8');

// Use 
var notFound = function(res) {
  res.status(404).json({
    message: "404, sorry, that page does not exist",
    code: 404,
    status: 404
  })
}

exports.index = function(req, res) {
  res.send({message : 'Welcome buddy! This is fl@g@pi v2'});
};

exports.getAll = function(req, res) {
  res.status(200).json(countries)
}

exports.callingCode = function(req, res) {
  var calling_code = req.params.callingCode;
  var country = _.find(countries, function(co) {
    return validator.isIn(calling_code, co.callingCode)
  });

if(!country) {
    notFound(res);
  }
  res.status(200).json(country)
}


exports.currency = function(req, res) {
  var currency_code = req.params.currency_code;
  var country = _.find(countries, function(co) {
    return validator.isIn(currency_code.toUpperCase(), co.currency)
  });
  if(!country) {
    notFound(res);
  }
  res.status(200).json(country)
}
/*------------ fl@g@di STUFF ------------*/

exports.flagCountryId = function(req, res) {
  var flag_label = req.params.flag_label;
  var country = _.find(countries, function(co) {
    return validator.isIn(flag_label.toUpperCase(), co.flag)

  });
  if(!country) {
    notFound(res);
  }
  res.status(200).json(country)
}

exports.callingCca2 = function(req, res) {
  var cca2_label = req.params.cca2_label;
  var country = _.find(countries, function(co) {       
  return validator.isIn(cca2_label.toUpperCase(), co.cca2)
  });
  if(!country) {
    notFound(res);
  }
  res.status(200).json(country)
}

exports.callingCapital = function (req, res, next) {
  var result = [];
  var capital_label = req.params.capital_label;
  var country_capital = _.reduce(countries, function(result, country, key) {
    if(country.capital.toLowerCase() == capital_label.toLowerCase()) {
      result.push(country);
    }
    return result;
  }, []);

  if(country_capital.length < 1) {
    notFound(res);
  }
  res.status(200).json(country_capital);
}

exports.callingNativeLanguage = function (req, res, next) {
  var result = [];
  var nativelanguage_label = req.params.nativelanguage_label;
  var country_nativelanguage = _.reduce(countries, function(result, country, key) {
    if(country.nativeLanguage.toLowerCase() == nativelanguage_label.toLowerCase()) {
      result.push(country);
    }
    return result;
  }, []);

  if(country_nativelanguage.length < 1) {
    notFound(res);
  }
  res.status(200).json(country_nativelanguage);
}

exports.callingTld = function(req, res) {
  var tld_label = req.params.tld_label;
  var country = _.find(countries, function(co) {       
  return validator.isIn(tld_label.toLowerCase(), co.tld)
  });
  if(!country) {
    notFound(res);
  }
  res.status(200).json(country)
}


exports.callingCca2 = function(req, res) {
  var cca2_label = req.params.cca2_label;
  var country = _.find(countries, function(co) {       
  return validator.isIn(cca2_label.toUpperCase(), co.cca2)
  });
  if(!country) {
    notFound(res);
  }
  res.status(200).json(country)
}


exports.callingArea = function(req, res) {

  var area_nb = req.params.area_nb; 
  var country = _.find(countries, function(co) {       
  return validator.isIn(area_nb, co.area)
  });
  if(!country) {
    notFound(res);
  }
  res.status(200).json(country)
}

/*------------ // fl@g@di STUFF ------------*/


exports.region = function (req, res, next) {
  var result = [];
  var region_name = req.params.regionName;
  var country_region = _.reduce(countries, function(result, country, key) {
    if(country.region.toLowerCase() == region_name.toLowerCase()) {
      result.push(country);
    }
    return result;
  }, []);

  if(country_region.length < 1) {
    notFound(res);
  }
  res.status(200).json(country_region);
}

exports.subregion = function (req, res, next) {
  var result = [];
  var subregion_name = req.params.subregionName;
  var country = _.reduce(countries, function(result, country, key) {
    if(country.subregion.toLowerCase() == subregion_name.toLowerCase()) {
      result.push(country);
    }
    return result;
  }, []);

  if(country.length < 1) {
    notFound(res);
  }

  res.status(200).json(country);
}



