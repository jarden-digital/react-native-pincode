/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';let transform = (() => {var _ref = _asyncToGenerator(














  function* (_ref2,

  assetRegistryPath,
  assetDataPlugins)
  {let filename = _ref2.filename,localPath = _ref2.localPath,options = _ref2.options,src = _ref2.src;
    options = options || {
      platform: '',
      projectRoot: '',
      inlineRequires: false,
      minify: false };


    const data = yield getAssetData(
    filename,
    localPath,
    assetDataPlugins,
    options.platform);


    return {
      ast: generateAssetCodeFileAst(assetRegistryPath, data) };

  });return function transform(_x, _x2, _x3) {return _ref.apply(this, arguments);};})();function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}var _require = require('./Assets');const getAssetData = _require.getAssetData;var _require2 = require('./Bundler/util');const generateAssetCodeFileAst = _require2.generateAssetCodeFileAst;

module.exports = {
  transform };