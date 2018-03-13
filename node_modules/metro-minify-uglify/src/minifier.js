/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

const uglify = require('uglify-es');





function noSourceMap(code) {
  return minify(code).code;
}

function withSourceMap(
code,
sourceMap,
filename)
{
  const result = minify(code, sourceMap);

  const map = JSON.parse(result.map);
  map.sources = [filename];
  return { code: result.code, map };
}

function minify(inputCode, inputMap) {
  const result = uglify.minify(inputCode, {
    mangle: { toplevel: true },
    output: {
      ascii_only: true,
      quote_style: 3,
      wrap_iife: true },

    sourceMap: {
      content: inputMap,
      includeSources: false },

    toplevel: true,
    compress: {
      // reduce_funcs inlines single-use function, which cause perf regressions.
      reduce_funcs: false } });



  if (result.error) {
    throw result.error;
  }

  return {
    code: result.code,
    map: result.map };

}

const metroMinifier = {
  noSourceMap,
  withSourceMap };


module.exports = metroMinifier;