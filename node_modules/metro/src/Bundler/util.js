/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _require =

require('../babel-bridge');const babylon = _require.babylon;var _require2 =
require('../babel-bridge');const babelTypes = _require2.babelTypes;





// Structure of the object: dir.name.scale = asset









// Structure of the object: platform.dir.name.scale = asset










const assetPropertyBlacklist = new Set(['files', 'fileSystemLocation', 'path']);

function generateAssetCodeFileAst(
assetRegistryPath,
assetDescriptor)
{
  const properDescriptor = filterObject(
  assetDescriptor,
  assetPropertyBlacklist);


  // {...}
  const descriptorAst = babylon.parseExpression(
  JSON.stringify(properDescriptor));

  const t = babelTypes;

  // module.exports
  const moduleExports = t.memberExpression(
  t.identifier('module'),
  t.identifier('exports'));


  // require('AssetRegistry')
  const requireCall = t.callExpression(t.identifier('require'), [
  t.stringLiteral(assetRegistryPath)]);


  // require('AssetRegistry').registerAsset
  const registerAssetFunction = t.memberExpression(
  requireCall,
  t.identifier('registerAsset'));


  // require('AssetRegistry').registerAsset({...})
  const registerAssetCall = t.callExpression(registerAssetFunction, [
  descriptorAst]);


  return t.file(
  t.program([
  t.expressionStatement(
  t.assignmentExpression('=', moduleExports, registerAssetCall))]));



}

/**
   * Generates the code involved in requiring an asset, but to be loaded remotely.
   * If the asset cannot be found within the map, then it falls back to the
   * standard asset.
   */
function generateRemoteAssetCodeFileAst(
assetSourceResolverPath,
assetDescriptor,
remoteServer,
remoteFileMap)
{
  const t = babelTypes;

  const file = remoteFileMap[assetDescriptor.fileSystemLocation];
  const descriptor = file && file[assetDescriptor.name];

  if (!descriptor) {
    return null;
  }

  // require('AssetSourceResolver')
  const requireCall = t.callExpression(t.identifier('require'), [
  t.stringLiteral(assetSourceResolverPath)]);


  // require('AssetSourceResolver').pickScale
  const pickScale = t.memberExpression(requireCall, t.identifier('pickScale'));

  // require('AssetSourceResolver').pickScale([2, 3, ...])
  const call = t.callExpression(pickScale, [
  t.arrayExpression(
  Object.keys(descriptor).
  map(Number).
  sort((a, b) => a - b).
  map(scale => t.numericLiteral(scale)))]);



  // {2: 'path/to/image@2x', 3: 'path/to/image@3x', ...}
  const data = babylon.parseExpression(JSON.stringify(descriptor));

  // ({2: '...', 3: '...'})[require(...).pickScale(...)]
  const handler = t.memberExpression(data, call, true);

  // 'https://remote.server.com/' + ({2: ...})[require(...).pickScale(...)]
  const uri = t.binaryExpression('+', t.stringLiteral(remoteServer), handler);

  // Size numbers.
  const width = t.numericLiteral(assetDescriptor.width);
  const height = t.numericLiteral(assetDescriptor.height);

  // module.exports
  const moduleExports = t.memberExpression(
  t.identifier('module'),
  t.identifier('exports'));


  return t.file(
  t.program([
  t.expressionStatement(
  t.assignmentExpression(
  '=',
  moduleExports,
  t.objectExpression([
  t.objectProperty(t.stringLiteral('width'), width),
  t.objectProperty(t.stringLiteral('height'), height),
  t.objectProperty(t.stringLiteral('uri'), uri)])))]));





}

// Test extension against all types supported by image-size module.
// If it's not one of these, we won't treat it as an image.
function isAssetTypeAnImage(type) {
  return (
    ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff'].indexOf(
    type) !==
    -1);

}

function filterObject(object, blacklist) {
  const copied = Object.assign({}, object);
  for (const key of blacklist) {
    delete copied[key];
  }
  return copied;
}

function createRamBundleGroups(
ramGroups,
groupableModules,
subtree)
{
  // build two maps that allow to lookup module data
  // by path or (numeric) module id;
  const byPath = new Map();
  const byId = new Map();
  groupableModules.forEach(m => {
    byPath.set(m.sourcePath, m);
    byId.set(m.id, m.sourcePath);
  });

  // build a map of group root IDs to an array of module IDs in the group
  const result = new Map(
  ramGroups.map(modulePath => {
    const root = byPath.get(modulePath);
    if (root == null) {
      throw Error(`Group root ${modulePath} is not part of the bundle`);
    }
    return [
    root.id,
    // `subtree` yields the IDs of all transitive dependencies of a module
    new Set(subtree(root, byPath))];

  }));


  if (ramGroups.length > 1) {
    // build a map of all grouped module IDs to an array of group root IDs
    const all = new ArrayMap();
    for (const _ref of result) {var _ref2 = _slicedToArray(_ref, 2);const parent = _ref2[0];const children = _ref2[1];
      for (const module of children) {
        all.get(module).push(parent);
      }
    }

    // find all module IDs that are part of more than one group
    const doubles = filter(all, (_ref3) => {var _ref4 = _slicedToArray(_ref3, 2);let parents = _ref4[1];return parents.length > 1;});
    for (const _ref5 of doubles) {var _ref6 = _slicedToArray(_ref5, 2);const moduleId = _ref6[0];const parents = _ref6[1];
      const parentNames = parents.map(byId.get, byId);
      const lastName = parentNames.pop();
      throw new Error(
      `Module ${byId.get(moduleId) ||
      moduleId} belongs to groups ${parentNames.join(', ')}, and ${String(
      lastName)
      }. Ensure that each module is only part of one group.`);

    }
  }

  return result;
}

function* filter(iterator, predicate) {
  for (const value of iterator) {
    if (predicate(value)) {
      yield value;
    }
  }
}

class ArrayMap extends Map {
  get(key) {
    let array = super.get(key);
    if (!array) {
      array = [];
      this.set(key, array);
    }
    return array;
  }}


module.exports = {
  createRamBundleGroups,
  generateAssetCodeFileAst,
  generateRemoteAssetCodeFileAst,
  isAssetTypeAnImage };