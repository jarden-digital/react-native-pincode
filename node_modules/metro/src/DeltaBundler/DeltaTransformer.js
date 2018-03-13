/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;} else {return Array.from(arr);}}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const DeltaCalculator = require('./DeltaCalculator');

const addParamsToDefineCall = require('../lib/addParamsToDefineCall');
const createModuleIdFactory = require('../lib/createModuleIdFactory');
const crypto = require('crypto');
const defaults = require('../defaults');
const getPreludeCode = require('../lib/getPreludeCode');
const nullthrows = require('fbjs/lib/nullthrows');var _require =

require('events');const EventEmitter = _require.EventEmitter;





































const globalCreateModuleId = createModuleIdFactory();

/**
                                                       * This class is in charge of creating the delta bundle with the actual
                                                       * transformed source code for each of the modified modules. For each modified
                                                       * module it returns a `DeltaModule` object that contains the basic information
                                                       * about that file. Modules that have been deleted contain a `null` module
                                                       * parameter.
                                                       *
                                                       * The actual return format is the following:
                                                       *
                                                       *   {
                                                       *     pre: [{id, module: {}}],   Scripts to be prepended before the actual
                                                       *                                modules.
                                                       *     post: [{id, module: {}}],  Scripts to be appended after all the modules
                                                       *                                (normally the initial require() calls).
                                                       *     delta: [{id, module: {}}], Actual bundle modules (dependencies).
                                                       *   }
                                                       */
class DeltaTransformer extends EventEmitter {










  constructor(
  bundler,
  dependencyGraph,
  deltaCalculator,
  options,
  bundleOptions)
  {
    super();this.































































































































































































    _getDependencies = path => {
      const dependencies = this._getDeps(
      path,
      this._deltaCalculator.getDependencyEdges(),
      new Set());


      // Remove the main entry point, since this method only returns the
      // dependencies.
      dependencies.delete(path);

      return dependencies;
    };this.





















































































































































































































































    _onFileChange = () => {
      this.emit('change');
    };this._bundler = bundler;this._dependencyGraph = dependencyGraph;this._deltaCalculator = deltaCalculator;this._getPolyfills = options.getPolyfills;this._polyfillModuleNames = options.polyfillModuleNames;this._bundleOptions = bundleOptions; // Only when isolateModuleIDs is true the Module IDs of this instance are
    // sandboxed from the rest.
    // Isolating them makes sense when we want to get consistent module IDs
    // between different builds of the same bundle (for example when building
    // production builds), while coupling them makes sense when we want
    // different bundles to share the same ids (on HMR, where we need to patch
    // the correct module).
    this._getModuleId = this._bundleOptions.isolateModuleIDs ? (bundleOptions.createModuleIdFactory || createModuleIdFactory)() : globalCreateModuleId;this._deltaCalculator.on('change', this._onFileChange);}static create(bundler, options, bundleOptions) {return _asyncToGenerator(function* () {const dependencyGraph = yield bundler.getDependencyGraph();const deltaCalculator = new DeltaCalculator(bundler, dependencyGraph, bundleOptions);return new DeltaTransformer(bundler, dependencyGraph, deltaCalculator, options, bundleOptions);})();} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * Destroy the Delta Transformer and its calculator. This should be used to
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             * clean up memory and resources once this instance is not used anymore.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             */end() {this._deltaCalculator.removeListener('change', this._onFileChange);return this._deltaCalculator.end();} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * Returns a function that can be used to calculate synchronously the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               * transitive dependencies of any given file within the dependency graph.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               **/getDependenciesFn() {var _this = this;return _asyncToGenerator(function* () {if (!_this._deltaCalculator.getDependencyEdges().size) {// If by any means the dependency graph has not been initialized, call
        // getDelta() to initialize it.
        yield _this._getDelta({ reset: false });}return _this._getDependencies;})();} /**
                                                                                       * Returns a function that can be used to calculate synchronously the
                                                                                       * transitive dependencies of any given file within the dependency graph.
                                                                                       **/getInverseDependencies() {var _this2 = this;return _asyncToGenerator(function* () {if (!_this2._deltaCalculator.getDependencyEdges().size) {// If by any means the dependency graph has not been initialized, call
        // getDelta() to initialize it.
        yield _this2._getDelta({ reset: false });}const dependencyEdges = _this2._deltaCalculator.getDependencyEdges();const output = new Map();for (const _ref of dependencyEdges.entries()) {var _ref2 = _slicedToArray(_ref, 2);const path = _ref2[0];const inverseDependencies = _ref2[1].inverseDependencies;output.set(_this2._getModuleId(path), Array.from(inverseDependencies).map(function (dep) {return _this2._getModuleId(dep);}));}return output;})();}getRamOptions(entryFile, options) {var _this3 = this;return _asyncToGenerator(function* () {const getDependenciesFn = yield _this3.getDependenciesFn();return yield _this3._bundler.getRamOptions(entryFile, options, (() => {var _ref3 = _asyncToGenerator(function* (path) {return Array.from(getDependenciesFn(path));});return function (_x) {return _ref3.apply(this, arguments);};})());})();} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * Main method to calculate the bundle delta. It returns a DeltaResult,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * which contain the source code of the modified and added modules and the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           * list of removed modules.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           */getDelta(sequenceId) {var _this4 = this;return _asyncToGenerator(function* () {// If the passed sequenceId is different than the last calculated one,
      // return a reset delta (since that means that the client is desynchronized)
      const reset = !!_this4._lastSequenceId && sequenceId !== _this4._lastSequenceId; // If there is already a build in progress, wait until it finish to start
      // processing a new one (delta transformer doesn't support concurrent
      // builds).
      if (_this4._currentBuildPromise) {yield _this4._currentBuildPromise;}_this4._currentBuildPromise = _this4._getDelta({ reset });let result;try {result = yield _this4._currentBuildPromise;} finally {_this4._currentBuildPromise = null;}return result;})();}_getDelta(_ref4) {var _this5 = this;let resetDelta = _ref4.reset;return _asyncToGenerator(function* () {// Calculate the delta of modules.
      var _ref5 = yield _this5._deltaCalculator.getDelta({ reset: resetDelta });const modified = _ref5.modified,deleted = _ref5.deleted,reset = _ref5.reset;const transformerOptions = yield _this5._deltaCalculator.getTransformerOptions();const dependencyEdges = _this5._deltaCalculator.getDependencyEdges(); // Return the source code that gets prepended to all the modules. This
      // contains polyfills and startup code (like the require() implementation).
      const prependSources = reset ? yield _this5._getPrepend(transformerOptions, dependencyEdges) : new Map(); // Precalculate all module ids sequentially. We do this to be sure that the
      // mapping between module -> moduleId is deterministic between runs.
      const modules = Array.from(modified.values());modules.forEach(function (module) {return _this5._getModuleId(module.path);}); // Get the transformed source code of each modified/added module.
      const modifiedDelta = yield _this5._transformModules(modules, transformerOptions, dependencyEdges);deleted.forEach(function (id) {modifiedDelta.set(_this5._getModuleId(id), null);}); // Return the source code that gets appended to all the modules. This
      // contains the require() calls to startup the execution of the modules.
      const appendSources = reset ? yield _this5._getAppend(dependencyEdges) : new Map(); // generate a random
      _this5._lastSequenceId = crypto.randomBytes(8).toString('hex');return { pre: prependSources, post: appendSources, delta: modifiedDelta, reset, id: _this5._lastSequenceId };})();}_getDeps(path, edges, deps) {if (deps.has(path)) {return deps;}const edge = edges.get(path);if (!edge) {return deps;}deps.add(path);for (const _ref6 of edge.dependencies) {var _ref7 = _slicedToArray(_ref6, 2);const dependencyPath = _ref7[1];this._getDeps(dependencyPath, edges, deps);}return deps;}_getPrepend(transformOptions, dependencyEdges) {var _this6 = this;return _asyncToGenerator(function* () {const preludeId = _this6._getModuleId('__prelude__'); // Get all the polyfills from the relevant option params (the
      // `getPolyfills()` method and the `polyfillModuleNames` variable).
      const polyfillModuleNames = _this6._getPolyfills({ platform: _this6._bundleOptions.platform }).concat(_this6._polyfillModuleNames); // Build the module system dependencies (scripts that need to
      // be included at the very beginning of the bundle) + any polifyll.
      const modules = [defaults.moduleSystem].concat(polyfillModuleNames).map(function (polyfillModuleName) {return _this6._dependencyGraph.createPolyfill({ file: polyfillModuleName, id: polyfillModuleName, dependencies: [] });});const edges = yield Promise.all(modules.map(function (module) {return _this6._createEdgeFromScript(module, transformOptions);}));const transformedModules = yield _this6._transformModules(edges, transformOptions, dependencyEdges); // The prelude needs to be the first thing in the file, and the insertion
      // order of entries in the Map is significant.
      return new Map([[preludeId, _this6._getPrelude(preludeId)]].concat(_toConsumableArray(transformedModules)));})();}_getPrelude(id) {const code = getPreludeCode({ isDev: this._bundleOptions.dev });const name = '__prelude__';return { code, id, map: [], name, source: code, path: name, type: 'script' };}_getAppend(dependencyEdges) {var _this7 = this;return _asyncToGenerator(function* () {// Get the absolute path of the entry file, in order to be able to get the
      // actual correspondant module (and its moduleId) to be able to add the
      // correct require(); call at the very end of the bundle.
      const entryPointModulePath = _this7._dependencyGraph.getAbsolutePath(_this7._bundleOptions.entryFile); // First, get the modules correspondant to all the module names defined in
      // the `runBeforeMainModule` config variable. Then, append the entry point
      // module so the last thing that gets required is the entry point.
      const append = new Map(_this7._bundleOptions.runBeforeMainModule.concat(entryPointModulePath).filter(function (path) {return dependencyEdges.has(path);}).map(_this7._getModuleId).map(function (moduleId) {const code = `require(${JSON.stringify(moduleId)});`;const name = 'require-' + String(moduleId);const path = name + '.js';return [moduleId, { code, id: moduleId, map: [], name, source: code, path, type: 'require' }];}));if (_this7._bundleOptions.sourceMapUrl) {const code = '//# sourceMappingURL=' + _this7._bundleOptions.sourceMapUrl;const id = _this7._getModuleId('/sourcemap.js');append.set(id, { code, id, map: [], name: 'sourcemap.js', path: '/sourcemap.js', source: code, type: 'comment' });}return append;})();}_transformModules(modules, transformOptions, dependencyEdges) {var _this8 = this;return _asyncToGenerator(function* () {return new Map((yield Promise.all(modules.map(function (module) {return _this8._transformModule(module, transformOptions, dependencyEdges);}))));})();}_createEdgeFromScript(module, transformOptions) {return _asyncToGenerator(function* () {const result = yield module.read(transformOptions);const edge = { dependencies: new Map(), inverseDependencies: new Set(), path: module.path, output: { code: result.code, map: result.map, source: result.source, type: 'script' } };return edge;})();}_transformModule(edge, transformOptions, dependencyEdges) {var _this9 = this;return _asyncToGenerator(function* () {const name = _this9._dependencyGraph.getHasteName(edge.path);const dependencyPairs = edge ? edge.dependencies : new Map();let wrappedCode; // Get the absolute path of each of the module dependencies from the
      // dependency edges. The module dependencies ensure correct order, while
      // the dependency edges do not ensure the same order between rebuilds.
      const dependencies = Array.from(edge.dependencies.keys()).map(function (dependency) {return nullthrows(dependencyPairs.get(dependency));});if (edge.output.type !== 'script') {wrappedCode = _this9._addDependencyMap({ code: edge.output.code, dependencies, name, path: edge.path });} else {wrappedCode = edge.output.code;}var _ref8 = transformOptions.minify ? yield _this9._bundler.minifyModule(edge.path, wrappedCode, edge.output.map) : { code: wrappedCode, map: edge.output.map };const code = _ref8.code,map = _ref8.map;const id = _this9._getModuleId(edge.path);return [id, { code, id, map, name, source: edge.output.source, path: edge.path, type: edge.output.type }];})();} /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Function to add the mapping object between local module ids and
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * actual bundle module ids for dependencies. This way, we can do the path
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * replacements on require() calls on transformers (since local ids do not
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * change between bundles).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         */_addDependencyMap(_ref9) {let code = _ref9.code,dependencies = _ref9.dependencies,name = _ref9.name,path = _ref9.path;const moduleId = this._getModuleId(path);const params = [moduleId, dependencies.map(this._getModuleId)]; // Add the module name as the last parameter (to make it easier to do
    // requires by name when debugging).
    if (this._bundleOptions.dev) {params.push(name);}return addParamsToDefineCall.apply(undefined, [code].concat(params));}}module.exports = DeltaTransformer;