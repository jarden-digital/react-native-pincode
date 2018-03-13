/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const Module = require('./Module');



class Polyfill extends Module {



  constructor(
  options)



  {
    super(options);
    this._id = options.id;
    this._dependencies = options.dependencies;
  }

  isHaste() {
    return false;
  }

  getName() {
    return this._id;
  }

  getPackage() {
    return null;
  }

  getDependencies() {var _this = this;return _asyncToGenerator(function* () {
      return _this._dependencies;})();
  }

  isPolyfill() {
    return true;
  }}


module.exports = Polyfill;