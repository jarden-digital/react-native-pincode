/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

const denodeify = require('denodeify');
const fs = require('fs');
const throat = require('throat');






const writeFile = throat(128, denodeify(fs.writeFile));

module.exports = writeFile;