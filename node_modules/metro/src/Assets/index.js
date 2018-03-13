/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';let getAbsoluteAssetRecord = (() => {var _ref = _asyncToGenerator(












































































































  function* (
  assetPath)




  {let platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const filename = path.basename(assetPath);
    const dir = path.dirname(assetPath);
    const files = yield readDir(dir);

    const assetData = AssetPaths.parse(
    filename,
    new Set(platform != null ? [platform] : []));


    const map = buildAssetMap(dir, files, platform);

    let record;
    if (platform != null) {
      record =
      map.get(getAssetKey(assetData.assetName, platform)) ||
      map.get(assetData.assetName);
    } else {
      record = map.get(assetData.assetName);
    }

    if (!record) {
      throw new Error(
      /* $FlowFixMe: platform can be null */
      `Asset not found: ${assetPath} for platform: ${platform}`);

    }

    return record;
  });return function getAbsoluteAssetRecord(_x) {return _ref.apply(this, arguments);};})();let findRoot = (() => {var _ref2 = _asyncToGenerator(

  function* (
  roots,
  dir,
  debugInfoFile)
  {
    const stats = yield Promise.all(
    roots.map((() => {var _ref3 = _asyncToGenerator(function* (root) {
        // important: we want to resolve root + dir
        // to ensure the requested path doesn't traverse beyond root
        const absPath = path.resolve(root, dir);

        try {
          const fstat = yield stat(absPath);

          // keep asset requests from traversing files
          // up from the root (e.g. ../../../etc/hosts)
          if (!absPath.startsWith(path.resolve(root))) {
            return { path: absPath, isValid: false };
          }
          return { path: absPath, isValid: fstat.isDirectory() };
        } catch (_) {
          return { path: absPath, isValid: false };
        }
      });return function (_x6) {return _ref3.apply(this, arguments);};})()));


    for (let i = 0; i < stats.length; i++) {
      if (stats[i].isValid) {
        return stats[i].path;
      }
    }

    const rootsString = roots.map(function (s) {return `'${s}'`;}).join(', ');
    throw new Error(
    `'${debugInfoFile}' could not be found, because '${dir}' is not a ` +
    `subdirectory of any of the roots  (${rootsString})`);

  });return function findRoot(_x3, _x4, _x5) {return _ref2.apply(this, arguments);};})();let getAssetRecord = (() => {var _ref4 = _asyncToGenerator(

  function* (
  relativePath,
  projectRoots)




  {let platform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    const dir = yield findRoot(
    projectRoots,
    path.dirname(relativePath),
    relativePath);


    return yield getAbsoluteAssetRecord(
    path.join(dir, path.basename(relativePath)),
    platform);

  });return function getAssetRecord(_x7, _x8) {return _ref4.apply(this, arguments);};})();let getAbsoluteAssetInfo = (() => {var _ref5 = _asyncToGenerator(

  function* (
  assetPath)

  {let platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const nameData = AssetPaths.parse(
    assetPath,
    new Set(platform != null ? [platform] : []));const

    name = nameData.name,type = nameData.type;var _ref6 =

    yield getAbsoluteAssetRecord(assetPath, platform);const scales = _ref6.scales,files = _ref6.files;
    const hasher = crypto.createHash('md5');

    if (files.length > 0) {
      yield hashFiles(Array.from(files), hasher);
    }

    return { files, hash: hasher.digest('hex'), name, scales, type };
  });return function getAbsoluteAssetInfo(_x10) {return _ref5.apply(this, arguments);};})();let getAssetData = (() => {var _ref7 = _asyncToGenerator(

  function* (
  assetPath,
  localPath,
  assetDataPlugins)

  {let platform = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    let assetUrlPath = path.join('/assets', path.dirname(localPath));

    // On Windows, change backslashes to slashes to get proper URL path from file path.
    if (path.sep === '\\') {
      assetUrlPath = assetUrlPath.replace(/\\/g, '/');
    }

    const isImage = isAssetTypeAnImage(path.extname(assetPath).slice(1));
    const assetInfo = yield getAbsoluteAssetInfo(assetPath, platform);
    const dimensions = isImage ? imageSize(assetInfo.files[0]) : null;
    const scale = assetInfo.scales[0];

    const assetData = {
      __packager_asset: true,
      fileSystemLocation: path.dirname(assetPath),
      httpServerLocation: assetUrlPath,
      width: dimensions ? dimensions.width / scale : undefined,
      height: dimensions ? dimensions.height / scale : undefined,
      scales: assetInfo.scales,
      files: assetInfo.files,
      hash: assetInfo.hash,
      name: assetInfo.name,
      type: assetInfo.type };

    return yield applyAssetDataPlugins(assetDataPlugins, assetData);
  });return function getAssetData(_x12, _x13, _x14) {return _ref7.apply(this, arguments);};})();let applyAssetDataPlugins = (() => {var _ref8 = _asyncToGenerator(

  function* (
  assetDataPlugins,
  assetData)
  {
    if (!assetDataPlugins.length) {
      return assetData;
    }var _assetDataPlugins = _toArray(

    assetDataPlugins);const currentAssetPlugin = _assetDataPlugins[0],remainingAssetPlugins = _assetDataPlugins.slice(1);
    // $FlowFixMe: impossible to type a dynamic require.
    const assetPluginFunction = require(currentAssetPlugin);
    const resultAssetData = yield assetPluginFunction(assetData);
    return yield applyAssetDataPlugins(remainingAssetPlugins, resultAssetData);
  });return function applyAssetDataPlugins(_x16, _x17) {return _ref8.apply(this, arguments);};})();

/**
                                                                                                     * Returns all the associated files (for different resolutions) of an asset.
                                                                                                     **/let getAssetFiles = (() => {var _ref9 = _asyncToGenerator(
  function* (
  assetPath)

  {let platform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    const assetData = yield getAbsoluteAssetRecord(assetPath, platform);

    return assetData.files;
  });return function getAssetFiles(_x18) {return _ref9.apply(this, arguments);};})();

/**
                                                                                       * Return a buffer with the actual image given a request for an image by path.
                                                                                       * The relativePath can contain a resolution postfix, in this case we need to
                                                                                       * find that image (or the closest one to it's resolution) in one of the
                                                                                       * project roots:
                                                                                       *
                                                                                       * 1. We first parse the directory of the asset
                                                                                       * 2. We check to find a matching directory in one of the project roots
                                                                                       * 3. We then build a map of all assets and their scales in this directory
                                                                                       * 4. Then try to pick platform-specific asset records
                                                                                       * 5. Then pick the closest resolution (rounding up) to the requested one
                                                                                       */let getAsset = (() => {var _ref10 = _asyncToGenerator(
  function* (
  relativePath,
  projectRoots)

  {let platform = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    const assetData = AssetPaths.parse(
    relativePath,
    new Set(platform != null ? [platform] : []));


    const record = yield getAssetRecord(relativePath, projectRoots, platform);

    for (let i = 0; i < record.scales.length; i++) {
      if (record.scales[i] >= assetData.resolution) {
        return readFile(record.files[i]);
      }
    }

    return readFile(record.files[record.files.length - 1]);
  });return function getAsset(_x20, _x21) {return _ref10.apply(this, arguments);};})();function _toArray(arr) {return Array.isArray(arr) ? arr : Array.from(arr);}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}const AssetPaths = require('../node-haste/lib/AssetPaths');const crypto = require('crypto');const denodeify = require('denodeify');const fs = require('fs');const imageSize = require('image-size');const path = require('path');var _require = require('../Bundler/util');const isAssetTypeAnImage = _require.isAssetTypeAnImage;const stat = denodeify(fs.stat);const readDir = denodeify(fs.readdir);const readFile = denodeify(fs.readFile);const hashFiles = denodeify(function hashFilesCb(files, hash, callback) {if (!files.length) {callback(null);return;}fs.createReadStream(files.shift()).on('data', data => hash.update(data)).once('end', () => hashFilesCb(files, hash, callback)).once('error', error => callback(error));});function buildAssetMap(dir, files, platform) {const platforms = new Set(platform != null ? [platform] : []);const assets = files.map(file => AssetPaths.tryParse(file, platforms));const map = new Map();assets.forEach(function (asset, i) {if (asset == null) {return;}const file = files[i];const assetKey = getAssetKey(asset.assetName, asset.platform);let record = map.get(assetKey);if (!record) {record = { scales: [], files: [] };map.set(assetKey, record);}let insertIndex;const length = record.scales.length;for (insertIndex = 0; insertIndex < length; insertIndex++) {if (asset.resolution < record.scales[insertIndex]) {break;}}record.scales.splice(insertIndex, 0, asset.resolution);record.files.splice(insertIndex, 0, path.join(dir, file));});return map;}function getAssetKey(assetName, platform) {if (platform != null) {return `${assetName} : ${platform}`;} else {return assetName;}}

module.exports = {
  getAsset,
  getAssetData,
  getAssetFiles };