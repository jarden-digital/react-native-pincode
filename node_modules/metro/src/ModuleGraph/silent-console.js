/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */
'use strict';var _require =

require('console');const Console = _require.Console;var _require2 =
require('stream');const Writable = _require2.Writable;

const write = (_, __, callback) => callback();
module.exports = new Console(new Writable({ write, writev: write }));