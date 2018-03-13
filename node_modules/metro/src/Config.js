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

const blacklist = require('./blacklist');
const path = require('path');var _require =

require('./defaults');const providesModuleNodeModules = _require.providesModuleNodeModules;




















































































































































const DEFAULT = {
  assetRegistryPath: 'missing-asset-registry-path',
  enhanceMiddleware: middleware => middleware,
  extraNodeModules: {},
  assetTransforms: false,
  cacheStores: [],
  cacheVersion: '1.0',
  dynamicDepsInPackages: 'throwAtRuntime',
  getAssetExts: () => [],
  getBlacklistRE: () => blacklist(),
  getEnableBabelRCLookup: () => true,
  getPlatforms: () => [],
  getPolyfillModuleNames: () => [],
  // We assume the default project path is two levels up from
  // node_modules/metro/
  getProjectRoots: () => [path.resolve(__dirname, '../..')],
  getProvidesModuleNodeModules: () => providesModuleNodeModules.slice(),
  getSourceExts: () => [],
  getTransformModulePath: () => require.resolve('./transformer.js'),
  getTransformOptions: (() => {var _ref = _asyncToGenerator(function* () {return {};});return function getTransformOptions() {return _ref.apply(this, arguments);};})(),
  getPolyfills: () => [],
  getUseGlobalHotkey: () => true,
  postMinifyProcess: x => x,
  postProcessModules: modules => modules,
  postProcessBundleSourcemap: (_ref2) => {let code = _ref2.code,map = _ref2.map,outFileName = _ref2.outFileName;return { code, map };},
  getModulesRunBeforeMainModule: () => [],
  getWorkerPath: () => null };


const normalize = (initialConfig, defaults) => {
  return _extends({},
  defaults || DEFAULT,
  initialConfig);

};

const load = (configFile, defaults
// $FlowFixMe dynamic require
) => normalize(require(configFile), defaults);

module.exports = {
  DEFAULT,
  load,
  normalize };