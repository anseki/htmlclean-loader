'use strict';

var htmlclean = require('htmlclean'),
  loaderUtils = require('loader-utils');

module.exports = function(source) {
  var options = (loaderUtils.getOptions ? loaderUtils.getOptions(this) :
      loaderUtils.getLoaderConfig(this, 'htmlcleanLoader')) || {},
    html = htmlclean(source + '', options),
    raw = typeof options.raw === 'boolean' ? options.raw : this.loaderIndex > 0;
  this.cacheable && this.cacheable();
  return raw ? html : 'module.exports = ' + JSON.stringify(html) + ';';
};
