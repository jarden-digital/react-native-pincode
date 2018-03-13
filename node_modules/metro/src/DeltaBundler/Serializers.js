/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();
































/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * This module contains many serializers for the Delta Bundler. Each serializer
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * returns a string representation for any specific type of bundle, which can
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              * be directly sent to the devices.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              */let deltaBundle = (() => {var _ref = _asyncToGenerator(

  function* (
  deltaBundler,
  clientId,
  options)
  {var _ref2 =
    yield _build(deltaBundler, clientId, options);const delta = _ref2.delta;

    function stringifyModule(_ref3) {var _ref4 = _slicedToArray(_ref3, 2);let id = _ref4[0],module = _ref4[1];
      return [id, module ? module.code : undefined];
    }

    const bundle = JSON.stringify({
      id: delta.id,
      pre: Array.from(delta.pre).map(stringifyModule),
      post: Array.from(delta.post).map(stringifyModule),
      delta: Array.from(delta.delta).map(stringifyModule),
      reset: delta.reset });


    return {
      bundle,
      numModifiedFiles: delta.pre.size + delta.post.size + delta.delta.size };

  });return function deltaBundle(_x, _x2, _x3) {return _ref.apply(this, arguments);};})();let fullSourceMap = (() => {var _ref5 = _asyncToGenerator(

  function* (
  deltaBundler,
  options)
  {var _ref6 =
    yield _getAllModules(deltaBundler, options);const modules = _ref6.modules;

    return fromRawMappings(modules).toString(undefined, {
      excludeSource: options.excludeSource });

  });return function fullSourceMap(_x4, _x5) {return _ref5.apply(this, arguments);};})();let fullSourceMapObject = (() => {var _ref7 = _asyncToGenerator(

  function* (
  deltaBundler,
  options)
  {var _ref8 =
    yield _getAllModules(deltaBundler, options);const modules = _ref8.modules;

    return fromRawMappings(modules).toMap(undefined, {
      excludeSource: options.excludeSource });

  });return function fullSourceMapObject(_x6, _x7) {return _ref7.apply(this, arguments);};})();

/**
                                                                                                 * Returns the full JS bundle, which can be directly parsed by a JS interpreter
                                                                                                 */let fullBundle = (() => {var _ref9 = _asyncToGenerator(
  function* (
  deltaBundler,
  options)
  {var _ref10 =
    yield _getAllModules(
    deltaBundler,
    options);const modules = _ref10.modules,numModifiedFiles = _ref10.numModifiedFiles,lastModified = _ref10.lastModified;


    const code = modules.map(function (m) {return m.code;});

    return {
      bundle: code.join('\n'),
      lastModified,
      numModifiedFiles };

  });return function fullBundle(_x8, _x9) {return _ref9.apply(this, arguments);};})();let getAllModules = (() => {var _ref11 = _asyncToGenerator(

  function* (
  deltaBundler,
  options)
  {var _ref12 =
    yield _getAllModules(deltaBundler, options);const modules = _ref12.modules;

    return modules;
  });return function getAllModules(_x10, _x11) {return _ref11.apply(this, arguments);};})();let _getAllModules = (() => {var _ref13 = _asyncToGenerator(

  function* (
  deltaBundler,
  options)





  {
    const hashedOptions = options;
    delete hashedOptions.sourceMapUrl;

    const clientId = '__SERVER__' + stableHash(hashedOptions).toString('hex');

    const deltaPatcher = DeltaPatcher.get(clientId);

    options = _extends({},
    options, {
      deltaBundleId: deltaPatcher.getLastBundleId() });var _ref14 =


    yield _build(
    deltaBundler,
    clientId,
    options);const delta = _ref14.delta,deltaTransformer = _ref14.deltaTransformer;


    const modules = deltaPatcher.
    applyDelta(delta).
    getAllModules(deltaBundler.getPostProcessModulesFn(options.entryFile));

    return {
      deltaTransformer,
      lastModified: deltaPatcher.getLastModifiedDate(),
      modules,
      numModifiedFiles: deltaPatcher.getLastNumModifiedFiles() };

  });return function _getAllModules(_x12, _x13) {return _ref13.apply(this, arguments);};})();let getRamBundleInfo = (() => {var _ref15 = _asyncToGenerator(

  function* (
  deltaBundler,
  options)
  {var _ref16 =
    yield _getAllModules(
    deltaBundler,
    options);const modules = _ref16.modules,deltaTransformer = _ref16.deltaTransformer;


    const ramModules = modules.map(function (module) {return {
        id: module.id,
        code: module.code,
        map: fromRawMappings([module]).toMap(module.path, {
          excludeSource: options.excludeSource }),

        name: module.name,
        sourcePath: module.path,
        source: module.source,
        type: module.type };});var _ref17 =


    yield deltaTransformer.getRamOptions(
    options.entryFile,
    {
      dev: options.dev,
      platform: options.platform });const preloadedModules = _ref17.preloadedModules,ramGroups = _ref17.ramGroups;



    const startupModules = [];
    const lazyModules = [];
    ramModules.forEach(function (module) {
      if (preloadedModules.hasOwnProperty(module.sourcePath)) {
        startupModules.push(module);
        return;
      }

      if (module.type === 'script' || module.type === 'require') {
        startupModules.push(module);
        return;
      }

      if (module.type === 'asset' || module.type === 'module') {
        lazyModules.push(module);
      }
    });

    const getDependencies = yield deltaTransformer.getDependenciesFn();

    const groups = createRamBundleGroups(
    ramGroups,
    lazyModules,
    function (module, dependenciesByPath) {
      const deps = getDependencies(module.sourcePath);
      const output = new Set();

      for (const dependency of deps) {
        const module = dependenciesByPath.get(dependency);

        if (module) {
          output.add(module.id);
        }
      }

      return output;
    });


    return {
      getDependencies,
      groups,
      lazyModules,
      startupModules };

  });return function getRamBundleInfo(_x14, _x15) {return _ref15.apply(this, arguments);};})();let getAssets = (() => {var _ref18 = _asyncToGenerator(

  function* (
  deltaBundler,
  options)
  {var _ref19 =
    yield _getAllModules(deltaBundler, options);const modules = _ref19.modules;

    const assets = yield Promise.all(
    modules.map((() => {var _ref20 = _asyncToGenerator(function* (module) {
        if (module.type === 'asset') {
          const localPath = toLocalPath(
          deltaBundler.getOptions().projectRoots,
          module.path);


          return getAssetData(
          module.path,
          localPath,
          options.assetPlugins,
          options.platform);

        }
        return null;
      });return function (_x18) {return _ref20.apply(this, arguments);};})()));


    return assets.filter(Boolean);
  });return function getAssets(_x16, _x17) {return _ref18.apply(this, arguments);};})();let _build = (() => {var _ref21 = _asyncToGenerator(

  function* (
  deltaBundler,
  clientId,
  options)



  {
    const deltaTransformer = yield deltaBundler.getDeltaTransformer(
    clientId,
    options);


    const delta = yield deltaTransformer.getDelta(options.deltaBundleId);

    return {
      delta,
      deltaTransformer };

  });return function _build(_x19, _x20, _x21) {return _ref21.apply(this, arguments);};})();function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}const DeltaPatcher = require('./DeltaPatcher');const stableHash = require('metro-cache/src/stableHash');const toLocalPath = require('../node-haste/lib/toLocalPath');var _require = require('../Assets');const getAssetData = _require.getAssetData;var _require2 = require('../Bundler/util');const createRamBundleGroups = _require2.createRamBundleGroups;var _require3 = require('metro-source-map');const fromRawMappings = _require3.fromRawMappings;

module.exports = {
  deltaBundle,
  fullBundle,
  fullSourceMap,
  fullSourceMapObject,
  getAllModules,
  getAssets,
  getRamBundleInfo };