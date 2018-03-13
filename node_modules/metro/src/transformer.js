/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Note: This is a fork of the fb-specific transform.js
 *
 * 
 * @format
 */
'use strict';

const crypto = require('crypto');
const fs = require('fs');
const json5 = require('json5');
const path = require('path');var _require =

require('./babel-bridge');const externalHelpersPlugin = _require.externalHelpersPlugin;var _require2 =
require('./babel-bridge');const getPreset = _require2.getPreset;var _require3 =
require('./babel-bridge');const inlineRequiresPlugin = _require3.inlineRequiresPlugin;var _require4 =
require('./babel-bridge');const makeHMRConfig = _require4.makeHMRConfig;var _require5 =
require('./babel-bridge');const resolvePlugins = _require5.resolvePlugins;var _require6 =
require('./babel-bridge');const transformSync = _require6.transformSync;




const cacheKeyParts = [
fs.readFileSync(__filename),
require('babel-plugin-external-helpers/package.json').version,
require('babel-preset-fbjs/package.json').version,
require('babel-preset-react-native/package.json').version];


/**
                                                             * Return a memoized function that checks for the existence of a
                                                             * project level .babelrc file, and if it doesn't exist, reads the
                                                             * default RN babelrc file and uses that.
                                                             */
const getBabelRC = function () {
  let babelRC = null;

  return function _getBabelRC(projectRoot) {
    if (babelRC !== null) {
      return babelRC;
    }

    babelRC = { plugins: [] };

    // Let's look for the .babelrc in the project root.
    // In the future let's look into adding a command line option to specify
    // this location.
    let projectBabelRCPath;
    if (projectRoot) {
      projectBabelRCPath = path.resolve(projectRoot, '.babelrc');
    }

    // If a .babelrc file doesn't exist in the project,
    // use the Babel config provided with react-native.
    if (!projectBabelRCPath || !fs.existsSync(projectBabelRCPath)) {
      babelRC = json5.parse(
      fs.readFileSync(path.resolve(__dirname, '..', 'rn-babelrc.json')));


      // Require the babel-preset's listed in the default babel config
      babelRC.presets = babelRC.presets.map(getPreset);
      babelRC.plugins = resolvePlugins(babelRC.plugins);
    } else {
      // if we find a .babelrc file we tell babel to use it
      babelRC.extends = projectBabelRCPath;
    }

    return babelRC;
  };
}();

/**
      * Given a filename and options, build a Babel
      * config object with the appropriate plugins.
      */
function buildBabelConfig(filename, options) {let plugins = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
  const babelRC = getBabelRC(options.projectRoot);

  const extraConfig = {
    babelrc:
    typeof options.enableBabelRCLookup === 'boolean' ?
    options.enableBabelRCLookup :
    true,
    code: false,
    filename };


  let config = Object.assign({}, babelRC, extraConfig);

  // Add extra plugins
  const extraPlugins = [externalHelpersPlugin];

  if (options.inlineRequires) {
    extraPlugins.push(inlineRequiresPlugin);
  }

  config.plugins = extraPlugins.concat(config.plugins, plugins);

  if (options.dev && options.hot) {
    const hmrConfig = makeHMRConfig(options, filename);
    config = Object.assign({}, config, hmrConfig);
  }

  return Object.assign({}, babelRC, config);
}








function transform(_ref) {let filename = _ref.filename,options = _ref.options,src = _ref.src,plugins = _ref.plugins;
  options = options || {
    assetDataPlugins: [],
    platform: '',
    projectRoot: '',
    inlineRequires: false,
    minify: false };


  const OLD_BABEL_ENV = process.env.BABEL_ENV;
  process.env.BABEL_ENV = options.dev ? 'development' : 'production';

  try {
    const babelConfig = buildBabelConfig(filename, options, plugins);var _transformSync =
    transformSync(src, babelConfig);const ast = _transformSync.ast;

    return { ast };
  } finally {
    process.env.BABEL_ENV = OLD_BABEL_ENV;
  }
}

function getCacheKey() {
  var key = crypto.createHash('md5');
  cacheKeyParts.forEach(part => key.update(part));
  return key.digest('hex');
}

module.exports = {
  transform,
  getCacheKey };