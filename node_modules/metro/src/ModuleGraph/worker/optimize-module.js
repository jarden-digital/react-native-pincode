/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

const constantFoldingPlugin = require('../../JSTransformer/worker/constant-folding-plugin');
const generate = require('./generate');
const getMinifier = require('../../lib/getMinifier');
const inlinePlugin = require('../../JSTransformer/worker/inline-plugin');
const invariant = require('fbjs/lib/invariant');
const optimizeDependencies = require('./optimizeDependencies');
const sourceMap = require('source-map');var _require =

require('../../babel-bridge');const transformSync = _require.transformSync;















function optimizeModule(
content,
optimizationOptions)
{
  const data = JSON.parse(content.toString('utf8'));

  if (data.type !== 'code') {
    return data;
  }const

  details = data.details;const
  file = details.file,transformed = details.transformed;
  const result = _extends({}, details, { transformed: {} });const
  postMinifyProcess = optimizationOptions.postMinifyProcess;

  Object.entries(transformed).forEach((_ref) => {var _ref2 = _slicedToArray(_ref, 2);let k = _ref2[0],t = _ref2[1];
    const optimized = optimize(t, file, optimizationOptions);
    const processed = postMinifyProcess({
      code: optimized.code,
      map: optimized.map });

    optimized.code = processed.code;
    optimized.map = processed.map;
    result.transformed[k] = optimized;
  });

  return { type: 'code', details: result };
}

function optimize(
transformed,
file,
options)
{const
  code = transformed.code,dependencyMapName = transformed.dependencyMapName,map = transformed.map;
  const optimized = optimizeCode(code, map, file, options);

  let dependencies;
  if (options.isPolyfill) {
    dependencies = [];
  } else {
    if (dependencyMapName == null) {
      invariant(
      transformed.dependencies.length === 0,
      'there should be no dependency is the map name is missing');

      dependencies = [];
    } else {
      dependencies = optimizeDependencies(
      optimized.ast,
      transformed.dependencies,
      dependencyMapName,
      transformed.requireName);

    }
  }

  const inputMap = transformed.map;
  const gen = generate(optimized.ast, file, '', true);

  const minify = getMinifier(options.minifierPath);
  const min = minify.withSourceMap(
  gen.code,
  inputMap && gen.map && mergeSourceMaps(file, inputMap, gen.map),
  file);

  return {
    code: min.code,
    map: min.map,
    dependencies,
    requireName: transformed.requireName };

}

function optimizeCode(
code,
map,
filename,
inliningOptions)
{
  return transformSync(code, {
    plugins: [
    [constantFoldingPlugin],
    [inlinePlugin, _extends({}, inliningOptions, { isWrapped: true })]],

    babelrc: false,
    code: false,
    filename });

}

function mergeSourceMaps(
file,
originalMap,
secondMap)
{
  const merged = new sourceMap.SourceMapGenerator();
  const inputMap = new sourceMap.SourceMapConsumer(originalMap);
  new sourceMap.SourceMapConsumer(secondMap).eachMapping(mapping => {
    const original = inputMap.originalPositionFor({
      line: mapping.originalLine,
      column: mapping.originalColumn });

    if (original.line == null) {
      return;
    }

    merged.addMapping({
      generated: { line: mapping.generatedLine, column: mapping.generatedColumn },
      original: { line: original.line, column: original.column || 0 },
      source: file,
      name: original.name || mapping.name });

  });
  return merged.toJSON();
}

module.exports = optimizeModule;