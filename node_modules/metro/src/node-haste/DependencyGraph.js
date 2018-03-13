/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const AssetResolutionCache = require('./AssetResolutionCache');
const DependencyGraphHelpers = require('./DependencyGraph/DependencyGraphHelpers');
const FilesByDirNameIndex = require('./FilesByDirNameIndex');
const JestHasteMap = require('jest-haste-map');
const Module = require('./Module');
const ModuleCache = require('./ModuleCache');
const ResolutionRequest = require('./DependencyGraph/ResolutionRequest');

const fs = require('fs');
const isAbsolutePath = require('absolute-path');
const parsePlatformFilePath = require('./lib/parsePlatformFilePath');
const path = require('path');
const toLocalPath = require('../node-haste/lib/toLocalPath');
const util = require('util');var _require =

require('./DependencyGraph/ModuleResolution');const ModuleResolver = _require.ModuleResolver;var _require2 =
require('events');const EventEmitter = _require2.EventEmitter;var _require3 =


require('metro-core'),_require3$Logger = _require3.Logger;const createActionStartEntry = _require3$Logger.createActionStartEntry,createActionEndEntry = _require3$Logger.createActionEndEntry,log = _require3$Logger.log;




































const JEST_HASTE_MAP_CACHE_BREAKER = 2;

class DependencyGraph extends EventEmitter {










  constructor(config)




  {
    super();this.

















































































































































































    _doesFileExist = filePath => {
      return this._hasteFS.exists(filePath);
    };this._opts = config.opts;this._filesByDirNameIndex = new FilesByDirNameIndex(config.initialHasteFS.getAllFiles());this._assetResolutionCache = new AssetResolutionCache({ assetExtensions: new Set(config.opts.assetExts), getDirFiles: dirPath => this._filesByDirNameIndex.getAllFiles(dirPath), platforms: config.opts.platforms });this._haste = config.haste;this._hasteFS = config.initialHasteFS;this._moduleMap = config.initialModuleMap;this._helpers = new DependencyGraphHelpers(this._opts);this._haste.on('change', this._onHasteChange.bind(this));this._moduleCache = this._createModuleCache();this._createModuleResolver();}static _createHaste(opts) {let useWatchman = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;return new JestHasteMap({ extensions: opts.sourceExts.concat(opts.assetExts), forceNodeFilesystemAPI: !useWatchman, hasteImplModulePath: opts.hasteImplModulePath, ignorePattern: opts.blacklistRE || / ^/, maxWorkers: opts.maxWorkers, mocksPattern: '', name: 'metro-' + JEST_HASTE_MAP_CACHE_BREAKER, platforms: Array.from(opts.platforms), providesModuleNodeModules: opts.providesModuleNodeModules, resetCache: opts.resetCache, retainAllFiles: true, roots: opts.projectRoots, useWatchman, watch: opts.watch });}static _getJestHasteMapOptions(opts) {}static load(opts) {let useWatchman = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;return _asyncToGenerator(function* () {const initializingMetroLogEntry = log(createActionStartEntry('Initializing Metro'));opts.reporter.update({ type: 'dep_graph_loading' });const haste = DependencyGraph._createHaste(opts, useWatchman);var _ref = yield haste.build();const hasteFS = _ref.hasteFS,moduleMap = _ref.moduleMap;log(createActionEndEntry(initializingMetroLogEntry));opts.reporter.update({ type: 'dep_graph_loaded' });return new DependencyGraph({ haste, initialHasteFS: hasteFS, initialModuleMap: moduleMap, opts });})();}_getClosestPackage(filePath) {const parsedPath = path.parse(filePath);const root = parsedPath.root;let dir = parsedPath.dir;do {const candidate = path.join(dir, 'package.json');if (this._hasteFS.exists(candidate)) {return candidate;}dir = path.dirname(dir);} while (dir !== '.' && dir !== root);return null;}_onHasteChange(_ref2) {let eventsQueue = _ref2.eventsQueue,hasteFS = _ref2.hasteFS,moduleMap = _ref2.moduleMap;this._hasteFS = hasteFS;this._filesByDirNameIndex = new FilesByDirNameIndex(hasteFS.getAllFiles());this._assetResolutionCache.clear();this._moduleMap = moduleMap;eventsQueue.forEach((_ref3) => {let type = _ref3.type,filePath = _ref3.filePath;return this._moduleCache.processFileChange(type, filePath);});this._createModuleResolver();this.emit('change');}_createModuleResolver() {this._moduleResolver = new ModuleResolver({ dirExists: filePath => {try {return fs.lstatSync(filePath).isDirectory();} catch (e) {}return false;}, doesFileExist: this._doesFileExist, extraNodeModules: this._opts.extraNodeModules, isAssetFile: filePath => this._helpers.isAssetFile(filePath), moduleCache: this._moduleCache, moduleMap: this._moduleMap, preferNativePlatform: true, resolveAsset: (dirPath, assetName, platform) => this._assetResolutionCache.resolve(dirPath, assetName, platform), sourceExts: this._opts.sourceExts });}_createModuleCache() {const _opts = this._opts;return new ModuleCache({ assetDependencies: [_opts.assetRegistryPath], depGraphHelpers: this._helpers, experimentalCaches: _opts.experimentalCaches, getClosestPackage: this._getClosestPackage.bind(this), getTransformCacheKey: _opts.getTransformCacheKey, globalTransformCache: _opts.globalTransformCache, hasteImplModulePath: _opts.hasteImplModulePath, resetCache: _opts.resetCache, transformCache: _opts.transformCache, reporter: _opts.reporter, roots: _opts.projectRoots, transformCode: _opts.transformCode }, _opts.platforms);} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * Returns a promise with the direct dependencies the module associated to
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   * the given entryPath has.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   */getShallowDependencies(entryPath, transformOptions) {return this._moduleCache.getModule(entryPath).getDependencies(transformOptions);}getWatcher() {return this._haste;}end() {this._haste.end();}getModuleForPath(entryFile) {if (this._helpers.isAssetFile(entryFile)) {return this._moduleCache.getAssetModule(entryFile);}return this._moduleCache.getModule(entryFile);}resolveDependency(fromModule, toModuleName, platform) {const req = new ResolutionRequest({ moduleResolver: this._moduleResolver, entryPath: fromModule.path, helpers: this._helpers, platform: platform || null, moduleCache: this._moduleCache });return req.resolveDependency(fromModule, toModuleName);}_getRequestPlatform(entryPath, platform) {if (platform == null) {
      platform = parsePlatformFilePath(entryPath, this._opts.platforms).
      platform;
    } else if (!this._opts.platforms.has(platform)) {
      throw new Error('Unrecognized platform: ' + platform);
    }
    return platform;
  }

  getHasteName(filePath) {
    const hasteName = this._hasteFS.getModuleName(filePath);

    if (hasteName) {
      return hasteName;
    }

    return toLocalPath(this._opts.projectRoots, filePath);
  }

  getAbsolutePath(filePath) {
    if (isAbsolutePath(filePath)) {
      return path.resolve(filePath);
    }

    for (let i = 0; i < this._opts.projectRoots.length; i++) {
      const root = this._opts.projectRoots[i];
      const potentialAbsPath = path.join(root, filePath);
      if (this._hasteFS.exists(potentialAbsPath)) {
        return path.resolve(potentialAbsPath);
      }
    }

    // If we failed to find a file, maybe this is just a Haste name so try that
    // TODO: We should prefer Haste name resolution first ideally since it is faster
    // TODO: Ideally, we should not do any `path.parse().name` here and just use the
    //       name, but in `metro/src/Server/index.js` we append `'.js'` to all names
    //       so until that changes, we have to do this.
    const potentialPath = this._moduleMap.getModule(
    path.parse(filePath).name,
    null);

    if (potentialPath) {
      return potentialPath;
    }

    throw new NotFoundError(
    'Cannot find entry file %s in any of the roots: %j',
    filePath,
    this._opts.projectRoots);

  }

  createPolyfill(options) {
    return this._moduleCache.createPolyfill(options);
  }}


function NotFoundError() {
  Error.call(this);
  Error.captureStackTrace(this, this.constructor);for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {args[_key] = arguments[_key];}
  var msg = util.format.apply(util, args);
  this.message = msg;
  this.type = this.name = 'NotFoundError';
  this.status = 404;
}
util.inherits(NotFoundError, Error);

module.exports = DependencyGraph;