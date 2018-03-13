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

const DependencyGraph = require('../node-haste/DependencyGraph');
const Transformer = require('../JSTransformer');

const assert = require('assert');
const defaults = require('../defaults');
const fs = require('fs');
const getTransformCacheKeyFn = require('../lib/getTransformCacheKeyFn');var _require =

require('metro-cache');const Cache = _require.Cache,stableHash = _require.stableHash;var _require2 =




require('metro-source-map');const toSegmentTuple = _require2.toSegmentTuple,fromRawMappings = _require2.fromRawMappings,toBabelSegments = _require2.toBabelSegments;
























































































class Bundler {







  constructor(opts) {
    opts.projectRoots.forEach(verifyRootExists);

    this._opts = opts;
    this._cache = opts.cacheStores.length ? new Cache(opts.cacheStores) : null;

    this._transformer = new Transformer({
      asyncRequireModulePath: opts.asyncRequireModulePath,
      maxWorkers: opts.maxWorkers,
      minifierPath: opts.minifierPath,
      reporters: {
        stdoutChunk: chunk =>
        opts.reporter.update({ type: 'worker_stdout_chunk', chunk }),
        stderrChunk: chunk =>
        opts.reporter.update({ type: 'worker_stderr_chunk', chunk }) },

      transformModulePath: opts.transformModulePath,
      dynamicDepsInPackages: opts.dynamicDepsInPackages,
      workerPath: opts.workerPath || undefined });


    this._depGraphPromise = DependencyGraph.load({
      assetExts: opts.assetExts,
      assetRegistryPath: opts.assetRegistryPath,
      blacklistRE: opts.blacklistRE,
      // TODO: T26134860 Only use experimental caches if stores are provided.
      experimentalCaches: !!opts.cacheStores.length,
      extraNodeModules: opts.extraNodeModules,
      getPolyfills: opts.getPolyfills,
      getTransformCacheKey: getTransformCacheKeyFn({
        asyncRequireModulePath: opts.asyncRequireModulePath,
        cacheVersion: opts.cacheVersion,
        dynamicDepsInPackages: opts.dynamicDepsInPackages,
        projectRoots: opts.projectRoots,
        transformModulePath: opts.transformModulePath }),

      globalTransformCache: opts.globalTransformCache,
      hasteImplModulePath: opts.hasteImplModulePath,
      maxWorkers: opts.maxWorkers,
      platforms: new Set(opts.platforms),
      polyfillModuleNames: opts.polyfillModuleNames,
      projectRoots: opts.projectRoots,
      providesModuleNodeModules:
      opts.providesModuleNodeModules || defaults.providesModuleNodeModules,
      reporter: opts.reporter,
      resetCache: opts.resetCache,
      sourceExts: opts.sourceExts,
      transformCode: this._cachedTransformCode.bind(this),
      transformCache: opts.transformCache,
      watch: opts.watch });


    this._projectRoots = opts.projectRoots;
    this._getTransformOptions = opts.getTransformOptions;
  }

  getOptions() {
    return this._opts;
  }

  end() {var _this = this;return _asyncToGenerator(function* () {
      _this._transformer.kill();
      yield _this._depGraphPromise.then(function (dependencyGraph) {return (
          dependencyGraph.getWatcher().end());});})();

  }

  /**
     * Returns the transform options related to a specific entry file, by calling
     * the config parameter getTransformOptions().
     */
  getTransformOptionsForEntryFile(
  entryFile,
  options,
  getDependencies)
  {var _this2 = this;return _asyncToGenerator(function* () {
      if (!_this2._getTransformOptions) {
        return {
          inlineRequires: false };

      }var _ref =

      yield _this2._getTransformOptions(
      [entryFile],
      { dev: options.dev, hot: true, platform: options.platform },
      getDependencies);const transform = _ref.transform;


      return transform || { inlineRequires: false };})();
  }

  /**
     * Returns the options needed to create a RAM bundle.
     */
  getRamOptions(
  entryFile,
  options,
  getDependencies)



  {var _this3 = this;return _asyncToGenerator(function* () {
      if (!_this3._getTransformOptions) {
        return {
          preloadedModules: {},
          ramGroups: [] };

      }var _ref2 =

      yield _this3._getTransformOptions(
      [entryFile],
      { dev: options.dev, hot: true, platform: options.platform },
      getDependencies);const preloadedModules = _ref2.preloadedModules,ramGroups = _ref2.ramGroups;


      return {
        preloadedModules: preloadedModules || {},
        ramGroups: ramGroups || [] };})();

  }

  /*
     * Helper method to return the global transform options that are kept in the
     * Bundler.
     */
  getGlobalTransformOptions()


  {
    return {
      enableBabelRCLookup: this._opts.enableBabelRCLookup,
      projectRoot: this._projectRoots[0] };

  }

  getDependencyGraph() {
    return this._depGraphPromise;
  }

  minifyModule(
  path,
  code,
  map)
  {var _this4 = this;return _asyncToGenerator(function* () {
      const sourceMap = fromRawMappings([{ code, source: code, map, path }]).toMap(
      undefined,
      {});


      const minified = yield _this4._transformer.minify(path, code, sourceMap);
      const result = yield _this4._opts.postMinifyProcess(_extends({}, minified));

      return {
        code: result.code,
        map: result.map ? toBabelSegments(result.map).map(toSegmentTuple) : [] };})();

  }

  _cachedTransformCode(
  module,
  code,
  transformCodeOptions)
  {var _this5 = this;return _asyncToGenerator(function* () {
      const cache = _this5._cache;
      let result;
      let key;

      // First, try getting the result from the cache if enabled.
      if (cache) {
        key = stableHash([
        module.localPath,
        code,
        transformCodeOptions,
        _this5._opts.assetExts,
        _this5._opts.assetRegistryPath,
        _this5._opts.cacheVersion]);


        result = yield cache.get(key);
      }

      // Second, if there was no result, compute it ourselves.
      if (!result) {
        result = yield _this5._transformer.transform(
        module.path,
        module.localPath,
        code,
        module.isPolyfill(),
        transformCodeOptions,
        _this5._opts.assetExts,
        _this5._opts.assetRegistryPath);

      }

      // Third, propagate the result to all cache layers.
      if (key && cache) {
        cache.set(key, result);
      }

      return result;})();
  }}


function verifyRootExists(root) {
  // Verify that the root exists.
  assert(fs.statSync(root).isDirectory(), 'Root has to be a valid directory');
}

module.exports = Bundler;