/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

const AssetPaths = require('../../node-haste/lib/AssetPaths');
const JsFileWrapping = require('./JsFileWrapping');
const Platforms = require('./Platforms');

const collectDependencies = require('./collectDependencies');
const crypto = require('crypto');
const defaults = require('../../defaults');
const docblock = require('jest-docblock');
const generate = require('./generate');
const getImageSize = require('image-size');
const invariant = require('fbjs/lib/invariant');
const path = require('path');var _require =

require('../../Bundler/util');const isAssetTypeAnImage = _require.isAssetTypeAnImage;var _require2 =
require('path');const basename = _require2.basename;





















const NODE_MODULES = path.sep + 'node_modules' + path.sep;
const defaultTransformOptions = {
  assetDataPlugins: [],
  dev: false,
  hot: false,
  inlineRequires: false,
  minify: false,
  platform: '',
  projectRoot: '' };

const defaultVariants = { default: {} };

const ASSET_EXTENSIONS = new Set(defaults.assetExts);

function transformModule(
content,
options)
{
  const ext = path.extname(options.filename).substr(1);
  if (ASSET_EXTENSIONS.has(ext)) {
    return transformAsset(content, options.filename);
  }
  if (ext === 'json') {
    return transformJSON(content.toString('utf8'), options);
  }
  if (!options.sourceExts.has(ext)) {
    return { type: 'unknown' };
  }

  const sourceCode = content.toString('utf8');const
  filename = options.filename,transformer = options.transformer,polyfill = options.polyfill;var _options$variants = options.variants;const variants = _options$variants === undefined ? defaultVariants : _options$variants;
  const transformed = {};

  for (const variantName of Object.keys(variants)) {var _transformer$transfor =
    transformer.transform({
      filename,
      localPath: filename,
      options: _extends({}, defaultTransformOptions, variants[variantName]),
      src: sourceCode });const ast = _transformer$transfor.ast;

    invariant(ast != null, 'ast required from the transform results');const
    asyncRequireModulePath = options.asyncRequireModulePath;
    transformed[variantName] = makeResult({
      ast,
      asyncRequireModulePath,
      filename,
      isPolyfill: polyfill || false,
      sourceCode });

  }

  let hasteID = null;
  if (filename.indexOf(NODE_MODULES) === -1 && !polyfill) {
    hasteID = docblock.parse(docblock.extract(sourceCode)).providesModule;
    if (options.hasteImplModulePath != null) {
      // eslint-disable-next-line no-useless-call
      const HasteImpl = require.call(
      null,
      options.hasteImplModulePath);

      if (HasteImpl.enforceHasteNameMatches) {
        HasteImpl.enforceHasteNameMatches(filename, hasteID);
      }
      hasteID = HasteImpl.getHasteName(filename);
    }
  }

  return {
    details: {
      file: filename,
      hasteID: hasteID || null,
      transformed,
      type: options.polyfill ? 'script' : 'module' },

    type: 'code' };

}

function transformJSON(json, options) {
  const value = JSON.parse(json);const
  filename = options.filename;
  const code = `__d(function(${JsFileWrapping.MODULE_FACTORY_PARAMETERS.join(
  ', ')
  }) { module.exports = \n${json}\n});`;

  const moduleData = {
    code,
    map: null, // no source map for JSON files!
    dependencies: [],
    requireName: '_require' // not relevant for JSON files
  };
  const transformed = {};

  Object.keys(options.variants || defaultVariants).forEach(
  key => transformed[key] = moduleData);


  const result = {
    file: filename,
    hasteID: value.name,
    transformed,
    type: 'module' };


  if (basename(filename) === 'package.json') {
    result.package = {
      name: value.name,
      main: value.main,
      browser: value.browser,
      'react-native': value['react-native'] };

  }
  return { type: 'code', details: result };
}

function transformAsset(
content,
filePath)
{
  const assetData = AssetPaths.parse(filePath, Platforms.VALID_PLATFORMS);
  const contentType = path.extname(filePath).slice(1);
  const details = {
    assetPath: assetData.assetName,
    contentBase64: content.toString('base64'),
    contentType,
    hash: crypto.
    createHash('sha1').
    update(content).
    digest('base64'),
    filePath,
    physicalSize: getAssetSize(contentType, content, filePath),
    platform: assetData.platform,
    scale: assetData.resolution };

  return { details, type: 'asset' };
}

function getAssetSize(
type,
content,
filePath)
{
  if (!isAssetTypeAnImage(type)) {
    return null;
  }
  if (content.length === 0) {
    throw new Error(`Image asset \`${filePath}\` cannot be an empty file.`);
  }var _getImageSize =
  getImageSize(content);const width = _getImageSize.width,height = _getImageSize.height;
  return { width, height };
}

function makeResult(options)





{
  let dependencies, dependencyMapName;
  let requireName = 'require';let
  ast = options.ast;

  if (options.isPolyfill) {
    dependencies = [];
    ast = JsFileWrapping.wrapPolyfill(ast);
  } else {const
    asyncRequireModulePath = options.asyncRequireModulePath;
    const opts = { asyncRequireModulePath, dynamicRequires: 'reject' };var _collectDependencies =
    collectDependencies(ast, opts);dependencies = _collectDependencies.dependencies;dependencyMapName = _collectDependencies.dependencyMapName;var _JsFileWrapping$wrapM =
    JsFileWrapping.wrapModule(ast, dependencyMapName);ast = _JsFileWrapping$wrapM.ast;requireName = _JsFileWrapping$wrapM.requireName;
  }const
  filename = options.filename,sourceCode = options.sourceCode;
  const gen = generate(ast, filename, sourceCode, false);
  return {
    code: gen.code,
    map: gen.map,
    dependencies,
    dependencyMapName,
    requireName };

}

module.exports = transformModule;