"use strict";

exports.__esModule = true;
exports.findRelativeConfig = findRelativeConfig;
exports.loadConfig = loadConfig;

var _debug = _interopRequireDefault(require("debug"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _json = _interopRequireDefault(require("json5"));

var _resolve = _interopRequireDefault(require("resolve"));

var _caching = require("../caching");

var _configApi = _interopRequireDefault(require("../helpers/config-api"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug.default)("babel:config:loading:files:configuration");
var BABELRC_FILENAME = ".babelrc";
var BABELRC_JS_FILENAME = ".babelrc.js";
var PACKAGE_FILENAME = "package.json";
var BABELIGNORE_FILENAME = ".babelignore";

function findRelativeConfig(filepath, envName) {
  var config = null;
  var ignore = null;

  var dirname = _path.default.dirname(filepath);

  var loc = dirname;

  while (true) {
    if (!config) {
      config = [BABELRC_FILENAME, BABELRC_JS_FILENAME, PACKAGE_FILENAME].reduce(function (previousConfig, name) {
        var filepath = _path.default.join(loc, name);

        var config = readConfig(filepath, envName);

        if (config && previousConfig) {
          throw new Error("Multiple configuration files found. Please remove one:\n" + (" - " + _path.default.basename(previousConfig.filepath) + "\n") + (" - " + name + "\n") + ("from " + loc));
        }

        return config || previousConfig;
      }, null);

      if (config) {
        debug("Found configuration %o from %o.", config.filepath, dirname);
      }
    }

    if (!ignore) {
      var ignoreLoc = _path.default.join(loc, BABELIGNORE_FILENAME);

      ignore = readIgnoreConfig(ignoreLoc);

      if (ignore) {
        debug("Found ignore %o from %o.", ignore.filepath, dirname);
      }
    }

    var nextLoc = _path.default.dirname(loc);

    if (loc === nextLoc) break;
    loc = nextLoc;
  }

  return {
    config: config,
    ignore: ignore
  };
}

function loadConfig(name, dirname, envName) {
  var filepath = _resolve.default.sync(name, {
    basedir: dirname
  });

  var conf = readConfig(filepath, envName);

  if (!conf) {
    throw new Error("Config file " + filepath + " contains no configuration data");
  }

  debug("Loaded config %o from $o.", name, dirname);
  return conf;
}

function readConfig(filepath, envName) {
  return _path.default.extname(filepath) === ".js" ? readConfigJS(filepath, {
    envName: envName
  }) : readConfigFile(filepath);
}

var LOADING_CONFIGS = new Set();
var readConfigJS = (0, _caching.makeStrongCache)(function (filepath, cache) {
  if (!_fs.default.existsSync(filepath)) {
    cache.forever();
    return null;
  }

  if (LOADING_CONFIGS.has(filepath)) {
    cache.never();
    debug("Auto-ignoring usage of config %o.", filepath);
    return {
      filepath: filepath,
      dirname: _path.default.dirname(filepath),
      options: {}
    };
  }

  var options;

  try {
    LOADING_CONFIGS.add(filepath);

    var configModule = require(filepath);

    options = configModule && configModule.__esModule ? configModule.default || undefined : configModule;
  } catch (err) {
    err.message = filepath + ": Error while loading config - " + err.message;
    throw err;
  } finally {
    LOADING_CONFIGS.delete(filepath);
  }

  if (typeof options === "function") {
    options = options((0, _configApi.default)(cache));
    if (!cache.configured()) throwConfigError();
  }

  if (!options || typeof options !== "object" || Array.isArray(options)) {
    throw new Error(filepath + ": Configuration should be an exported JavaScript object.");
  }

  if (typeof options.then === "function") {
    throw new Error("You appear to be using an async configuration, " + "which your current version of Babel does not support. " + "We may add support for this in the future, " + "but if you're on the most recent version of @babel/core and still " + "seeing this error, then you'll need to synchronously return your config.");
  }

  return {
    filepath: filepath,
    dirname: _path.default.dirname(filepath),
    options: options
  };
});
var readConfigFile = makeStaticFileCache(function (filepath, content) {
  var options;

  if (_path.default.basename(filepath) === PACKAGE_FILENAME) {
    try {
      options = JSON.parse(content).babel;
    } catch (err) {
      err.message = filepath + ": Error while parsing JSON - " + err.message;
      throw err;
    }

    if (!options) return null;
  } else {
    try {
      options = _json.default.parse(content);
    } catch (err) {
      err.message = filepath + ": Error while parsing config - " + err.message;
      throw err;
    }

    if (!options) throw new Error(filepath + ": No config detected");
  }

  if (typeof options !== "object") {
    throw new Error(filepath + ": Config returned typeof " + typeof options);
  }

  if (Array.isArray(options)) {
    throw new Error(filepath + ": Expected config object but found array");
  }

  return {
    filepath: filepath,
    dirname: _path.default.dirname(filepath),
    options: options
  };
});
var readIgnoreConfig = makeStaticFileCache(function (filepath, content) {
  var ignore = content.split("\n").map(function (line) {
    return line.replace(/#(.*?)$/, "").trim();
  }).filter(function (line) {
    return !!line;
  });
  return {
    filepath: filepath,
    dirname: _path.default.dirname(filepath),
    ignore: ignore
  };
});

function makeStaticFileCache(fn) {
  return (0, _caching.makeStrongCache)(function (filepath, cache) {
    if (cache.invalidate(function () {
      return fileMtime(filepath);
    }) === null) {
      cache.forever();
      return null;
    }

    return fn(filepath, _fs.default.readFileSync(filepath, "utf8"));
  });
}

function fileMtime(filepath) {
  try {
    return +_fs.default.statSync(filepath).mtime;
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }

  return null;
}

function throwConfigError() {
  throw new Error("Caching was left unconfigured. Babel's plugins, presets, and .babelrc.js files can be configured\nfor various types of caching, using the first param of their handler functions:\n\nmodule.exports = function(api) {\n  // The API exposes the following:\n\n  // Cache the returned value forever and don't call this function again.\n  api.cache(true);\n\n  // Don't cache at all. Not recommended because it will be very slow.\n  api.cache(false);\n\n  // Cached based on the value of some function. If this function returns a value different from\n  // a previously-encountered value, the plugins will re-evaluate.\n  var env = api.cache(() => process.env.NODE_ENV);\n\n  // If testing for a specific env, we recommend specifics to avoid instantiating a plugin for\n  // any possible NODE_ENV value that might come up during plugin execution.\n  var isProd = api.cache(() => process.env.NODE_ENV === \"production\");\n\n  // .cache(fn) will perform a linear search though instances to find the matching plugin based\n  // based on previous instantiated plugins. If you want to recreate the plugin and discard the\n  // previous instance whenever something changes, you may use:\n  var isProd = api.cache.invalidate(() => process.env.NODE_ENV === \"production\");\n\n  // Note, we also expose the following more-verbose versions of the above examples:\n  api.cache.forever(); // api.cache(true)\n  api.cache.never();   // api.cache(false)\n  api.cache.using(fn); // api.cache(fn)\n\n  // Return the value that will be cached.\n  return { };\n};");
}