/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const TransformCaching = require('./lib/TransformCaching');

const blacklist = require('./blacklist');
const debug = require('debug');
const invariant = require('fbjs/lib/invariant');var _require =

require('metro-core');const Logger = _require.Logger;var _require2 =
require('metro-source-map');const fromRawMappings = _require2.fromRawMappings,toSegmentTuple = _require2.toSegmentTuple;






exports.createBlacklist = blacklist;
exports.sourceMaps = { fromRawMappings, compactMapping: toSegmentTuple };
exports.createServer = createServer;
exports.Logger = Logger;





















exports.TransformCaching = TransformCaching;

/**
                                              * This is a public API, so we don't trust the value and purposefully downgrade
                                              * it as `mixed`. Because it understands `invariant`, Flow ensure that we
                                              * refine these values completely.
                                              */
function assertPublicBundleOptions(bo) {
  invariant(
  typeof bo === 'object' && bo != null,
  'bundle options must be an object');

  invariant(
  bo.dev === undefined || typeof bo.dev === 'boolean',
  'bundle options field `dev` must be a boolean');const

  entryFile = bo.entryFile;
  invariant(
  typeof entryFile === 'string',
  'bundle options must contain a string field `entryFile`');

  invariant(
  bo.inlineSourceMap === undefined || typeof bo.inlineSourceMap === 'boolean',
  'bundle options field `inlineSourceMap` must be a boolean');

  invariant(
  bo.minify === undefined || typeof bo.minify === 'boolean',
  'bundle options field `minify` must be a boolean');

  invariant(
  bo.platform === undefined || typeof bo.platform === 'string',
  'bundle options field `platform` must be a string');

  invariant(
  bo.runModule === undefined || typeof bo.runModule === 'boolean',
  'bundle options field `runModule` must be a boolean');

  invariant(
  bo.sourceMapUrl === undefined || typeof bo.sourceMapUrl === 'string',
  'bundle options field `sourceMapUrl` must be a boolean');

  return _extends({ entryFile }, bo);
}

exports.build = (() => {var _ref = _asyncToGenerator(function* (
  options,
  bundleOptions)
  {
    if (options.targetBabelVersion !== undefined) {
      process.env.BABEL_VERSION = String(options.targetBabelVersion);
    }
    var server = createNonPersistentServer(options);
    const ServerClass = require('./Server');

    const result = yield server.build(_extends({},
    ServerClass.DEFAULT_BUNDLE_OPTIONS,
    assertPublicBundleOptions(bundleOptions), {
      bundleType: 'todo' }));


    server.end();

    return result;
  });return function (_x, _x2) {return _ref.apply(this, arguments);};})();

exports.getOrderedDependencyPaths = (() => {var _ref2 = _asyncToGenerator(function* (
  options,
  depOptions)





  {
    var server = createNonPersistentServer(options);

    const paths = yield server.getOrderedDependencyPaths(depOptions);
    server.end();

    return paths;
  });return function (_x3, _x4) {return _ref2.apply(this, arguments);};})();

function enableDebug() {
  // Metro Bundler logs debug messages using the 'debug' npm package, and uses
  // the following prefix throughout.
  // To enable debugging, we need to set our pattern or append it to any
  // existing pre-configured pattern to avoid disabling logging for
  // other packages
  var debugPattern = 'Metro:*';
  var existingPattern = debug.load();
  if (existingPattern) {
    debugPattern += ',' + existingPattern;
  }
  debug.enable(debugPattern);
}

function createServer(options) {
  // the debug module is configured globally, we need to enable debugging
  // *before* requiring any packages that use `debug` for logging
  if (options.verbose) {
    enableDebug();
  }

  // Some callsites may not be Flowified yet.
  invariant(
  options.assetRegistryPath != null,
  'createServer() requires assetRegistryPath');


  const ServerClass = require('./Server');
  return new ServerClass(toServerOptions(options));
}

function createNonPersistentServer(options) {
  return createServer(options);
}

function toServerOptions(options) {
  return {
    assetTransforms: options.assetTransforms,
    assetExts: options.assetExts,
    assetRegistryPath: options.assetRegistryPath,
    asyncRequireModulePath: options.asyncRequireModulePath,
    blacklistRE: options.blacklistRE,
    cacheStores: options.cacheStores,
    cacheVersion: options.cacheVersion,
    dynamicDepsInPackages: options.dynamicDepsInPackages,
    enableBabelRCLookup: options.enableBabelRCLookup,
    extraNodeModules: options.extraNodeModules,
    getModulesRunBeforeMainModule: options.getModulesRunBeforeMainModule,
    getPolyfills: options.getPolyfills,
    getTransformOptions: options.getTransformOptions,
    globalTransformCache: options.globalTransformCache,
    hasteImplModulePath: options.hasteImplModulePath,
    maxWorkers: options.maxWorkers,
    minifierPath: options.minifierPath,
    moduleFormat: options.moduleFormat,
    platforms: options.platforms,
    polyfillModuleNames: options.polyfillModuleNames,
    postProcessModules: options.postProcessModules,
    postMinifyProcess: options.postMinifyProcess,
    postProcessBundleSourcemap: options.postProcessBundleSourcemap,
    projectRoots: options.projectRoots,
    providesModuleNodeModules: options.providesModuleNodeModules,
    reporter: options.reporter,
    resetCache: options.resetCache,
    silent: options.silent,
    sourceExts: options.sourceExts,
    transformCache: options.transformCache || TransformCaching.useTempDir(),
    transformModulePath: options.transformModulePath,
    watch:
    typeof options.watch === 'boolean' ?
    options.watch :
    !!options.nonPersistent,
    workerPath: options.workerPath };

}