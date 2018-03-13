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

const fs = require('fs-extra');

exports.watchFile = (() => {var _ref = _asyncToGenerator(function* (
  filename,
  callback)
  {
    fs.watchFile(filename, function () {
      callback();
    });

    yield callback();
  });return function (_x, _x2) {return _ref.apply(this, arguments);};})();

exports.makeAsyncCommand = command =>
// eslint-disable-next-line lint/no-unclear-flowtypes
argv =>
{
  Promise.resolve(command(argv)).catch(error => {
    console.error(error.stack);
    process.exitCode = 1;
  });
};