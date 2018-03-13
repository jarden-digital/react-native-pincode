/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';

// eslint-disable-next-line lint/flow-no-fixme
const dynamicRequire = require;
module.exports = function (moduleID) {
  return Promise.resolve().then(() => ({ default: dynamicRequire(moduleID) }));
};