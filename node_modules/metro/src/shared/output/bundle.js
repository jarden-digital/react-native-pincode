/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

const Server = require('../../Server');

const meta = require('./meta');
const relativizeSourceMapInline = require('../../lib/relativizeSourceMap');
const writeFile = require('./writeFile');




function buildBundle(
packagerClient,
requestOptions)
{
  return packagerClient.build(_extends({},
  Server.DEFAULT_BUNDLE_OPTIONS,
  requestOptions, {
    bundleType: 'bundle',
    isolateModuleIDs: true }));

}

function relativateSerializedMap(
map,
sourceMapSourcesRoot)
{
  const sourceMap = JSON.parse(map);
  relativizeSourceMapInline(sourceMap, sourceMapSourcesRoot);
  return JSON.stringify(sourceMap);
}

function saveBundleAndMap(
bundle,
options,
log)
{const

  bundleOutput =



  options.bundleOutput,encoding = options.bundleEncoding,sourcemapOutput = options.sourcemapOutput,sourcemapSourcesRoot = options.sourcemapSourcesRoot;

  log('Writing bundle output to:', bundleOutput);const

  code = bundle.code;
  const writeBundle = writeFile(bundleOutput, code, encoding);
  const writeMetadata = writeFile(
  bundleOutput + '.meta',
  meta(code, encoding),
  'binary');

  Promise.all([writeBundle, writeMetadata]).then(() =>
  log('Done writing bundle output'));


  if (sourcemapOutput) {let
    map = bundle.map;
    if (sourcemapSourcesRoot !== undefined) {
      log('start relativating source map');
      map = relativateSerializedMap(map, sourcemapSourcesRoot);
      log('finished relativating');
    }

    log('Writing sourcemap output to:', sourcemapOutput);
    const writeMap = writeFile(sourcemapOutput, map, null);
    writeMap.then(() => log('Done writing sourcemap output'));
    return Promise.all([writeBundle, writeMetadata, writeMap]);
  } else {
    return writeBundle;
  }
}

exports.build = buildBundle;
exports.save = saveBundleAndMap;
exports.formatName = 'bundle';