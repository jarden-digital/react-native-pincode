/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};let buildBundle = (() => {var _ref = _asyncToGenerator(









  function* (
  packagerClient,
  requestOptions)
  {
    const options = _extends({},
    Server.DEFAULT_BUNDLE_OPTIONS,
    requestOptions, {
      bundleType: 'ram',
      isolateModuleIDs: true });

    return yield packagerClient.getRamBundleInfo(options);
  });return function buildBundle(_x, _x2) {return _ref.apply(this, arguments);};})();function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}const Server = require('../../../Server');const asAssets = require('./as-assets');const asIndexedFile = require('./as-indexed-file').save;

function saveUnbundle(
bundle,
options,
log)
{
  // we fork here depending on the platform:
  // while android is pretty good at loading individual assets, ios has a large
  // overhead when reading hundreds pf assets from disk
  return options.platform === 'android' && !options.indexedUnbundle ?
  asAssets(bundle, options, log) :
  asIndexedFile(bundle, options, log);
}

exports.build = buildBundle;
exports.save = saveUnbundle;
exports.formatName = 'bundle';