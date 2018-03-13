/**
 * Copyright (c) 2018-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}



class Cache {


  constructor(stores) {
    this._stores = stores;
  }

  get(key) {var _this = this;return _asyncToGenerator(function* () {
      const stores = _this._stores;
      const length = stores.length;

      for (let i = 0; i < length; i++) {
        let value = stores[i].get(key);

        if (value instanceof Promise) {
          value = yield value;
        }

        if (value != null) {
          return value;
        }
      }

      return null;})();
  }

  set(key, value) {
    Promise.all(this._stores.map(store => store.set(key, value))).catch(err => {
      process.nextTick(() => {
        throw err;
      });
    });
  }}


module.exports = Cache;