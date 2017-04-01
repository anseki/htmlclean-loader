# htmlclean-loader

[![npm](https://img.shields.io/npm/v/htmlclean-loader.svg)](https://www.npmjs.com/package/htmlclean-loader) [![GitHub issues](https://img.shields.io/github/issues/anseki/htmlclean-loader.svg)](https://github.com/anseki/htmlclean-loader/issues) [![David](https://img.shields.io/david/anseki/htmlclean-loader.svg)](package.json) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)

[htmlclean](https://github.com/anseki/htmlclean) loader module for [webpack](https://webpack.js.org/).

* [Grunt](http://gruntjs.com/) plugin: [grunt-htmlclean](https://github.com/anseki/grunt-htmlclean)
* [gulp](http://gulpjs.com/) plugin: [gulp-htmlclean](https://github.com/anseki/gulp-htmlclean)

**If you want to just clean files, [Command Line Tool](https://github.com/anseki/htmlclean-cli) is easy way.**

Simple and safety HTML/SVG cleaner to minify without changing its structure.  
See [htmlclean](https://github.com/anseki/htmlclean) for options and more information about htmlclean.

## Installation

```
npm install --save-dev htmlclean-loader htmlclean
```

## Usage

Documentation:

- [Loaders](https://webpack.js.org/concepts/loaders/)
- [Using loaders](http://webpack.github.io/docs/using-loaders.html) (for webpack v1)

For example:

```js
// app.js
var headerHtml = require('./header.html');
document.getElementById('header').innerHTML = headerHtml;
```

```js
// webpack.config.js
module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.html$/,
      loader: 'htmlclean-loader'
    }]
  }
};
```

## Options

You can specify options via query parameters or an `options` (or `htmlcleanLoader` for webpack v1) object in webpack configuration.

For example:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.html$/,
      loader: 'htmlclean-loader',
      options: {
        protect: /<\!--%fooTemplate\b.*?%-->/g,
        edit: function(html) {
          return html.replace(/foo/g, 'bar');
        }
      }
    }]
  }
};
```

See [htmlclean](https://github.com/anseki/htmlclean#options) for the options.  
Also, the following additional option is available.

### `raw`

*Type:* boolean  
*Default:* Automatic

This loader outputs a JavaScript code when it is specified as a final loader, otherwise it outputs a raw HTML code for next loader that expects it to be given, automatically.  
That is, when it is specified as a final loader, it works like that a `raw-loader` is chained to the list of loaders.  
For example, the following two codes work same:

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    // Actually, `raw-loader` is unnecessary.
    rules: [{test: /\.html$/, use: ['raw-loader', 'htmlclean-loader']}]
    // htmlclean-loader passes a raw HTML code to raw-loader,
    // and raw-loader changes it to a JavaScript code and outputs it.
  }
};
```

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [{test: /\.html$/, loader: 'htmlclean-loader'}]
    // htmlclean-loader outputs a JavaScript code.
  }
};
```

By default, it chooses the JavaScript code or the raw HTML code automatically.  
If `true` is specified for `raw` option, it chooses a raw HTML code always. If `false` is specified for `raw` option, it chooses a JavaScript code always.
