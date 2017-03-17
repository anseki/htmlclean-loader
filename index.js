'use strict';

var htmlclean = require('htmlclean'),
  loaderUtils = require('loader-utils');

module.exports = function(source) {
  var options = loaderUtils.getOptions(this) || {},
    html = htmlclean(source + '', options),
    raw = typeof options.raw === 'boolean' ? options.raw : this.loaderIndex > 0;
  this.cacheable && this.cacheable();
  return raw ? html : 'module.exports = ' + JSON.stringify(html) + ';';
};
