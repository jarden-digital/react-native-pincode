/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();



function dependenciesDot(_ref) {let modules = _ref.modules;
  const list = [];

  // Opening digraph.
  list.push('digraph {');

  const meta = new Map();

  // Adding each module -> dependency.
  for (const module of modules) {
    const file = JSON.stringify(module.file.path);
    meta.set(
    module.file.path,
    `fb_size=${Buffer.byteLength(module.file.code, 'utf8')}`);


    module.dependencies.forEach(dependency => {
      list.push(`\t${file} -> ${JSON.stringify(dependency.path)};`);
    });
  }

  for (const _ref2 of meta.entries()) {var _ref3 = _slicedToArray(_ref2, 2);const moduleName = _ref3[0];const metadata = _ref3[1];
    list.push(`\t${JSON.stringify(moduleName)}[${metadata}];`);
  }

  // Closing digraph.
  list.push('}');

  return list.join('\n');
}

module.exports = dependenciesDot;