# htmlclean-loader

[htmlclean](https://github.com/anseki/htmlclean) loader module for [webpack](http://webpack.github.io/).

* [Grunt](http://gruntjs.com/) plugin: [grunt-htmlclean](https://github.com/anseki/grunt-htmlclean)
* [gulp](http://gulpjs.com/) plugin: [gulp-htmlclean](https://github.com/anseki/gulp-htmlclean)

Simple and safety HTML/SVG cleaner to minify without changing its structure.  
See [htmlclean](https://github.com/anseki/htmlclean) for options and more information about htmlclean.

## Installation

```
npm install --save-dev htmlclean-loader htmlclean
```

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

For example:

```js
// app.js
var headerHtml = require('./header.html');
document.getElementById('header').innerHTML = headerHtml;
```

**webpack v2**

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
      use: [{
        loader: 'htmlclean-loader',
        options: {
          protect: /<\!--%fooTemplate\b.*?%-->/g
        }
      }]
    }]
  }
};
```

**webpack v1**

```js
// webpack.config.js
module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {test: /\.html$/, loader: 'htmlclean-loader'}
    ]
  },
  // htmlclean-loader options
  htmlcleanLoader: {
    protect: /<\!--%fooTemplate\b.*?%-->/g
  }
};
```

## Specifying Options

You can specify options for behavior of htmlclean. See [htmlclean](https://github.com/anseki/htmlclean#options) for the options.  
There are three ways to specify options.

* Query parameters
* `options` (webpack v2) or `htmlcleanLoader` (webpack v1) object in webpack configuration
* Specified property in webpack configuration (webpack v1)

### Query parameters

You can specify the options via query parameters. See: http://webpack.github.io/docs/using-loaders.html#query-parameters

Note that RegExp and function can not be specified via the query parameters. Use webpack configuration if you want to specify these types.

For example:

```js
// app.js
var code = require('raw!htmlclean-loader?raw=false!./header.html');
```

### `options` (webpack v2) or `htmlcleanLoader` (webpack v1)

You can specify the options via an `options` (webpack v2) or `htmlcleanLoader` (webpack v1) object in webpack configuration.

For example:

**webpack v2**

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [{
      test: /\.html$/,
      use: [{
        loader: 'htmlclean-loader',
        options: {
          protect: /<\!--%fooTemplate\b.*?%-->/g,
          edit: function(html) {
            return html.replace(/foo/g, 'bar');
          }
        }
      }]
    }]
  }
};
```

**webpack v1**

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    loaders: [
      {test: /\.html$/, loader: 'htmlclean-loader'}
    ]
  },
  // htmlclean-loader options
  htmlcleanLoader: {
    protect: /<\!--%fooTemplate\b.*?%-->/g,
    edit: function(html) {
      return html.replace(/foo/g, 'bar');
    }
  }
};
```

### Specified property (webpack v1)

You can specify a name via a `config` query parameter, and you can specify the options via an object that has this name in webpack configuration.  
This is useful for switching the options by each file or condition.

For example:

```js
// app.js
var
  html1 = require('htmlclean-loader?config=optionsA!./file-1.html'),
  html2 = require('htmlclean-loader?config=optionsB!./file-2.html');
// Or, you can specify these parameters in webpack configuration.
```

```js
// webpack.config.js
module.exports = {
  // ...
  // options-A
  optionsA: {
    protect: /foo/g,
  },
  // options-B
  optionsB: {
    protect: /bar/g,
  }
};
```

## Additional Option

### `raw`

*Type:* boolean  
*Default:* Automatic

This loader outputs a JavaScript code when it is specified as a final loader, otherwise it outputs a raw HTML code for next loader that expects it to be given, automatically.  
That is, when it is specified as a final loader, it works like that a `raw-loader` is chained to `loaders` list.  
For example, the following two codes work same:

**webpack v2**

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

**webpack v2**

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    rules: [{test: /\.html$/, use: ['htmlclean-loader']}]
    // htmlclean-loader outputs a JavaScript code.
  }
};
```

**webpack v1**

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    loaders: [
      // Actually, `raw-loader` is unnecessary.
      {test: /\.html$/, loaders: ['raw-loader', 'htmlclean-loader']}
      // htmlclean-loader passes a raw HTML code to raw-loader,
      // and raw-loader changes it to a JavaScript code and outputs it.
    ]
  }
};
```

**webpack v1**

```js
// webpack.config.js
module.exports = {
  // ...
  module: {
    loaders: [
      {test: /\.html$/, loader: 'htmlclean-loader'}
      // htmlclean-loader outputs a JavaScript code.
    ]
  }
};
```

By default, it chooses the JavaScript code or the raw HTML code automatically.  
If `true` is specified for `raw` option, it chooses a raw HTML code always. If `false` is specified for `raw` option, it chooses a JavaScript code always.
