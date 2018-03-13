/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

const buildSourceMapWithMetaData = require('../../shared/output/unbundle/build-unbundle-sourcemap-with-metadata.js');
const invariant = require('invariant');var _require =

require('../../Bundler/util');const createRamBundleGroups = _require.createRamBundleGroups;var _require2 =



require('../../shared/output/unbundle/as-indexed-file');const buildTableAndContents = _require2.buildTableAndContents,createModuleGroups = _require2.createModuleGroups;var _require3 =
require('./util');const concat = _require3.concat,getModuleCode = _require3.getModuleCode,partition = _require3.partition,toModuleTransport = _require3.toModuleTransport;




function asIndexedRamBundle(_ref)






{let filename = _ref.filename,idsForPath = _ref.idsForPath,modules = _ref.modules,preloadedModules = _ref.preloadedModules,ramGroupHeads = _ref.ramGroupHeads,requireCalls = _ref.requireCalls;
  const idForPath = x => idsForPath(x).moduleId;var _partition =
  partition(modules, preloadedModules),_partition2 = _slicedToArray(_partition, 2);const startup = _partition2[0],deferred = _partition2[1];
  const startupModules = Array.from(concat(startup, requireCalls));
  const deferredModules = deferred.map(m => toModuleTransport(m, idsForPath));
  for (const m of deferredModules) {
    invariant(
    m.id >= 0,
    'A script (non-module) cannot be part of the deferred modules of a RAM bundle');

  }
  const ramGroups = createRamBundleGroups(
  ramGroupHeads || [],
  deferredModules,
  subtree);

  const moduleGroups = createModuleGroups(ramGroups, deferredModules);

  const tableAndContents = buildTableAndContents(
  startupModules.map(m => getModuleCode(m, idForPath)).join('\n'),
  deferredModules,
  moduleGroups,
  'utf8');


  return {
    code: Buffer.concat(tableAndContents),
    map: buildSourceMapWithMetaData({
      fixWrapperOffset: false,
      lazyModules: deferredModules,
      moduleGroups,
      startupModules: startupModules.map(m => toModuleTransport(m, idsForPath)) }) };


}

function* subtree(moduleTransport, moduleTransportsByPath) {let seen = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Set();
  seen.add(moduleTransport.id);
  for (const _ref2 of moduleTransport.dependencies) {const path = _ref2.path;
    const dependency = moduleTransportsByPath.get(path);
    if (dependency && !seen.has(dependency.id)) {
      yield dependency.id;
      yield* subtree(dependency, moduleTransportsByPath, seen);
    }
  }
}

function createBuilder(
preloadedModules,
ramGroupHeads)
{
  return x => asIndexedRamBundle(_extends({}, x, { preloadedModules, ramGroupHeads }));
}

exports.createBuilder = createBuilder;