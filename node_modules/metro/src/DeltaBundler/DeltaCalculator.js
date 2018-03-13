/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}var _require =





require('./traverseDependencies');const initialTraverseDependencies = _require.initialTraverseDependencies,reorderDependencies = _require.reorderDependencies,traverseDependencies = _require.traverseDependencies;var _require2 =
require('events');const EventEmitter = _require2.EventEmitter;














/**
                                                                * This class is in charge of calculating the delta of changed modules that
                                                                * happen between calls. To do so, it subscribes to file changes, so it can
                                                                * traverse the files that have been changed between calls and avoid having to
                                                                * traverse the whole dependency tree for trivial small changes.
                                                                */
class DeltaCalculator extends EventEmitter {











  constructor(
  bundler,
  dependencyGraph,
  options)
  {
    super();this._deletedFiles = new Set();this._modifiedFiles = new Set();this._dependencyEdges = new Map();this.

































































































































































    _handleMultipleFileChanges = (_ref) => {let eventsQueue = _ref.eventsQueue;
      eventsQueue.forEach(this._handleFileChange);
    };this.






    _handleFileChange = (_ref2) =>





    {let type = _ref2.type,filePath = _ref2.filePath;
      if (type === 'delete') {
        this._deletedFiles.add(filePath);
        this._modifiedFiles.delete(filePath);
      } else {
        this._deletedFiles.delete(filePath);
        this._modifiedFiles.add(filePath);
      }

      // Notify users that there is a change in some of the bundle files. This
      // way the client can choose to refetch the bundle.
      this.emit('change');
    };this._bundler = bundler;this._options = options;this._dependencyGraph = dependencyGraph;this._dependencyGraph.getWatcher().on('change', this._handleMultipleFileChanges);} /**
                                                                                                                                                                                  * Stops listening for file changes and clears all the caches.
                                                                                                                                                                                  */end() {this._dependencyGraph.getWatcher().removeListener('change', this._handleMultipleFileChanges);this.reset();}reset() {// Clean up all the cache data structures to deallocate memory.
    this._modifiedFiles = new Set();this._deletedFiles = new Set();this._dependencyEdges = new Map();} /**
                                                                                                        * Main method to calculate the delta of modules. It returns a DeltaResult,
                                                                                                        * which contain the modified/added modules and the removed modules.
                                                                                                        */getDelta(_ref3) {var _this = this;let reset = _ref3.reset;return _asyncToGenerator(function* () {// If there is already a build in progress, wait until it finish to start
      // processing a new one (delta server doesn't support concurrent builds).
      if (_this._currentBuildPromise) {yield _this._currentBuildPromise;} // We don't want the modified files Set to be modified while building the
      // bundle, so we isolate them by using the current instance for the bundling
      // and creating a new instance for the file watcher.
      const modifiedFiles = _this._modifiedFiles;_this._modifiedFiles = new Set();const deletedFiles = _this._deletedFiles;_this._deletedFiles = new Set(); // Concurrent requests should reuse the same bundling process. To do so,
      // this method stores the promise as an instance variable, and then it's
      // removed after it gets resolved.
      _this._currentBuildPromise = _this._getChangedDependencies(modifiedFiles, deletedFiles);let result;const numDependencies = _this._dependencyEdges.size;try {result = yield _this._currentBuildPromise;} catch (error) {// In case of error, we don't want to mark the modified files as
        // processed (since we haven't actually created any delta). If we do not
        // do so, asking for a delta after an error will produce an empty Delta,
        // which is not correct.
        modifiedFiles.forEach(function (file) {return _this._modifiedFiles.add(file);});deletedFiles.forEach(function (file) {return _this._deletedFiles.add(file);}); // If after an error the number of edges has changed, we could be in
        // a weird state. As a safe net we clean the dependency edges to force
        // a clean traversal of the graph next time.
        if (_this._dependencyEdges.size !== numDependencies) {_this._dependencyEdges = new Map();}throw error;} finally {_this._currentBuildPromise = null;} // Return all the modules if the client requested a reset delta.
      if (reset) {return { modified: reorderDependencies(_this._dependencyEdges.get(_this._dependencyGraph.getAbsolutePath(_this._options.entryFile)), _this._dependencyEdges), deleted: new Set(), reset: true };}return result;})();} /**
                                                                                                                                                                                                                                         * Returns the options object that is used by the transformer to parse
                                                                                                                                                                                                                                         * all the modules. This can be used by external objects to read again
                                                                                                                                                                                                                                         * any module very fast (since the options object instance will be the same).
                                                                                                                                                                                                                                         */getTransformerOptions() {var _this2 = this;return _asyncToGenerator(function* () {if (!_this2._transformerOptions) {_this2._transformerOptions = yield _this2._calcTransformerOptions();}return _this2._transformerOptions;})();}_calcTransformerOptions() {var _this3 = this;return _asyncToGenerator(function* () {var _bundler$getGlobalTra = _this3._bundler.getGlobalTransformOptions();const enableBabelRCLookup = _bundler$getGlobalTra.enableBabelRCLookup,projectRoot = _bundler$getGlobalTra.projectRoot;const transformOptionsForBlacklist = { assetDataPlugins: _this3._options.assetPlugins, customTransformOptions: _this3._options.customTransformOptions, enableBabelRCLookup, dev: _this3._options.dev, hot: _this3._options.hot, inlineRequires: false, minify: _this3._options.minify, platform: _this3._options.platform, projectRoot };var _ref4 = yield _this3._bundler.getTransformOptionsForEntryFile(_this3._options.entryFile, { dev: _this3._options.dev, platform: _this3._options.platform }, (() => {var _ref5 = _asyncToGenerator(function* (path) {var _ref6 = yield initialTraverseDependencies(path, _this3._dependencyGraph, transformOptionsForBlacklist, new Map());const added = _ref6.added;return Array.from(added.keys());});return function (_x) {return _ref5.apply(this, arguments);};})());const inlineRequires = _ref4.inlineRequires; // $FlowFixMe flow does not recognize well Object.assign() return types.
      return _extends({}, transformOptionsForBlacklist, { inlineRequires: inlineRequires || false });})();} /**
                                                                                                             * Returns all the dependency edges from the graph. Each edge contains the
                                                                                                             * needed information to do the traversing (dependencies, inverseDependencies)
                                                                                                             * plus some metadata.
                                                                                                             */getDependencyEdges() {return this._dependencyEdges;} /**
                                                                                                                                                                     * Handles a single file change. To avoid doing any work before it's needed,
                                                                                                                                                                     * the listener only stores the modified file, which will then be used later
                                                                                                                                                                     * when the delta needs to be calculated.
                                                                                                                                                                     */_getChangedDependencies(modifiedFiles, deletedFiles) {var _this4 = this;return _asyncToGenerator(function* () {const transformerOptions = yield _this4.getTransformerOptions();if (!_this4._dependencyEdges.size) {const path = _this4._dependencyGraph.getAbsolutePath(_this4._options.entryFile);var _ref7 = yield initialTraverseDependencies(path, _this4._dependencyGraph, transformerOptions, _this4._dependencyEdges, _this4._options.onProgress || undefined);const added = _ref7.added;return { modified: added, deleted: new Set(), reset: true };} // If a file has been deleted, we want to invalidate any other file that
      // depends on it, so we can process it and correctly return an error.
      deletedFiles.forEach(function (filePath) {const edge = _this4._dependencyEdges.get(filePath);if (edge) {edge.inverseDependencies.forEach(function (path) {return modifiedFiles.add(path);});}});
      // We only want to process files that are in the bundle.
      const modifiedDependencies = Array.from(modifiedFiles).filter(function (filePath) {return (
          _this4._dependencyEdges.has(filePath));});


      // No changes happened. Return empty delta.
      if (modifiedDependencies.length === 0) {
        return { modified: new Map(), deleted: new Set(), reset: false };
      }var _ref8 =

      yield traverseDependencies(
      modifiedDependencies,
      _this4._dependencyGraph,
      transformerOptions,
      _this4._dependencyEdges,
      _this4._options.onProgress || undefined);const added = _ref8.added,deleted = _ref8.deleted;


      return {
        modified: added,
        deleted,
        reset: false };})();

  }}


module.exports = DeltaCalculator;