/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();let build = (() => {var _ref = _asyncToGenerator(

















  function* (options) {const

    entryPointPaths =






    options.entryPointPaths,getPolyfills = options.getPolyfills,graphFn = options.graphFn,optimize = options.optimize,platform = options.platform,postProcessModules = options.postProcessModules,translateDefaultsPath = options.translateDefaultsPath;
    const graphOptions = { optimize };

    const graphWithOptions = function (entry) {return graphFn(entry, platform, graphOptions);};
    const graphOnlyModules = (() => {var _ref2 = _asyncToGenerator(function* (m) {return (yield graphWithOptions(m)).modules;});return function graphOnlyModules(_x2) {return _ref2.apply(this, arguments);};})();var _ref3 =

    yield Promise.all([
    _asyncToGenerator(function* () {
      const result = yield graphWithOptions(entryPointPaths);const
      modules = result.modules,entryModules = result.entryModules;
      const prModules = postProcessModules(modules, [].concat(_toConsumableArray(entryPointPaths)));
      return { modules: prModules, entryModules };
    })(),
    graphOnlyModules([translateDefaultsPath(defaults.moduleSystem)]),
    graphOnlyModules(getPolyfills({ platform }).map(translateDefaultsPath))]),_ref4 = _slicedToArray(_ref3, 3);const graph = _ref4[0],moduleSystem = _ref4[1],polyfills = _ref4[2];const


    entryModules = graph.entryModules;
    const preludeScript = virtualModule(getPreludeCode({ isDev: !optimize }));
    const prependedScripts = [preludeScript].concat(_toConsumableArray(moduleSystem), _toConsumableArray(polyfills));
    return {
      entryModules,
      modules: [].concat(_toConsumableArray(prependedScripts), _toConsumableArray(graph.modules)),
      prependedScripts };

  });return function build(_x) {return _ref.apply(this, arguments);};})();function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;} else {return Array.from(arr);}}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}const defaults = require('../defaults');const virtualModule = require('./module').virtual;const getPreludeCode = require('../lib/getPreludeCode');

module.exports = build;