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

const DeltaTransformer = require('./DeltaTransformer');
















/**
                                                         * `DeltaBundler` uses the `DeltaTransformer` to build bundle deltas. This
                                                         * module handles all the transformer instances so it can support multiple
                                                         * concurrent clients requesting their own deltas. This is done through the
                                                         * `clientId` param (which maps a client to a specific delta transformer).
                                                         */
class DeltaBundler {





  constructor(bundler, options) {this._deltaTransformers = new Map();this._currentId = 0;
    this._bundler = bundler;
    this._options = options;
  }

  end() {
    this._deltaTransformers.forEach(DeltaTransformer => DeltaTransformer.end());
    this._deltaTransformers = new Map();
  }

  getOptions() {
    return this._bundler.getOptions();
  }

  getDeltaTransformer(
  clientId,
  options)
  {var _this = this;return _asyncToGenerator(function* () {
      let deltaTransformer = _this._deltaTransformers.get(clientId);

      if (!deltaTransformer) {
        deltaTransformer = yield DeltaTransformer.create(
        _this._bundler,
        _this._options,
        options);


        _this._deltaTransformers.set(clientId, deltaTransformer);
      }

      return deltaTransformer;})();
  }

  getPostProcessModulesFn(
  entryPoint)
  {
    const postProcessFn = this._options.postProcessModules;

    if (!postProcessFn) {
      return modules => modules;
    }

    return entries => postProcessFn(entries, entryPoint);
  }}


module.exports = DeltaBundler;