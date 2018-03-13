/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

const MAGIC_UNBUNDLE_NUMBER = require('../../shared/output/unbundle/magic-number');
const MAGIC_UNBUNDLE_FILENAME = 'UNBUNDLE';
const JS_MODULES = 'js-modules';

const buildSourceMapWithMetaData = require('../../shared/output/unbundle/build-unbundle-sourcemap-with-metadata.js');
const path = require('path');var _require =

require('./util');const concat = _require.concat,getModuleCode = _require.getModuleCode,partition = _require.partition,toModuleTransport = _require.toModuleTransport;




function asMultipleFilesRamBundle(_ref)





{let filename = _ref.filename,idsForPath = _ref.idsForPath,modules = _ref.modules,requireCalls = _ref.requireCalls,preloadedModules = _ref.preloadedModules;
  const idForPath = x => idsForPath(x).moduleId;var _partition =
  partition(modules, preloadedModules),_partition2 = _slicedToArray(_partition, 2);const startup = _partition2[0],deferred = _partition2[1];
  const startupModules = Array.from(concat(startup, requireCalls));
  const deferredModules = deferred.map(m => toModuleTransport(m, idsForPath));
  const magicFileContents = new Buffer(4);

  // Just concatenate all startup modules, one after the other.
  const code = startupModules.map(m => getModuleCode(m, idForPath)).join('\n');

  // Write one file per module, wrapped with __d() call if it proceeds.
  const extraFiles = new Map();
  deferredModules.forEach(deferredModule => {
    extraFiles.set(
    path.join(JS_MODULES, deferredModule.id + '.js'),
    deferredModule.code);

  });

  // Prepare and write magic number file.
  magicFileContents.writeUInt32LE(MAGIC_UNBUNDLE_NUMBER, 0);
  extraFiles.set(
  path.join(JS_MODULES, MAGIC_UNBUNDLE_FILENAME),
  magicFileContents);


  // Create the source map (with no module groups, as they are ignored).
  const map = buildSourceMapWithMetaData({
    fixWrapperOffset: false,
    lazyModules: deferredModules,
    moduleGroups: null,
    startupModules: startupModules.map(m => toModuleTransport(m, idsForPath)) });


  return { code, extraFiles, map };
}

function createBuilder(
preloadedModules,
ramGroupHeads)
{
  return x => asMultipleFilesRamBundle(_extends({}, x, { preloadedModules, ramGroupHeads }));
}

exports.createBuilder = createBuilder;