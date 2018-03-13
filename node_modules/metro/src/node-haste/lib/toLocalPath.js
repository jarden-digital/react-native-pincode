/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _require =

require('path');const relative = _require.relative,basename = _require.basename;




// FIXME: This function has the shortcoming of potentially returning identical
// paths for two files in different roots.
function toLocalPath(
roots,
absolutePath)
{
  for (let i = 0; i < roots.length; i++) {
    const localPath = relative(roots[i], absolutePath);
    if (localPath[0] !== '.' || basename(absolutePath) == localPath) {
      return localPath;
    }
  }

  throw new Error(
  `Expected path \`${absolutePath}\` to be relative to one of the project roots`);

}

module.exports = toLocalPath;