'use strict';

var loaderUtils = require('loader-utils'),
  htmlclean = require('htmlclean');

module.exports = function(content) {
  var options = loaderUtils.getOptions(this) || {},
    raw = typeof options.raw === 'boolean' ? options.raw : this.loaderIndex > 0;

  if (content != null) {
    content = htmlclean(content + '', options);
  }

  this.cacheable && this.cacheable();
  return raw ? content : 'module.exports = ' + JSON.stringify(content) + ';';
};
