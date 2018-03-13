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

const fs = require('fs');
const mkdirp = require('mkdirp');var _require =

require('path');const dirname = _require.dirname;









function wrapWorkerFn(
workerFunction)
{
  return (infile, outfile, options) => {
    const contents = fs.readFileSync(infile);
    const result = workerFunction(contents, options);
    mkdirp.sync(dirname(outfile));
    fs.writeFileSync(outfile, JSON.stringify(result), 'utf8');
  };
}

module.exports = wrapWorkerFn;