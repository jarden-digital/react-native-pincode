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

require('../../babel-bridge');const babelGenerate = _require.babelGenerate;



function generate(
ast,
filename,
sourceCode,
compact)
{
  const generated = babelGenerate(
  ast,
  {
    comments: false,
    compact,
    filename,
    sourceFileName: filename,
    sourceMaps: true,
    sourceMapTarget: filename },

  sourceCode);


  if (generated.map) {
    delete generated.map.sourcesContent;
  }
  return generated;
}

module.exports = generate;