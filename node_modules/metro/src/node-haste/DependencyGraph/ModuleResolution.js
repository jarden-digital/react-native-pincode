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

const Resolver = require('metro-resolver');

const invariant = require('fbjs/lib/invariant');
const path = require('path');
const util = require('util');










/**
                               * `jest-haste-map`'s interface for ModuleMap.
                               */













































class ModuleResolver {




  constructor(options) {this.









































































    _getPackageMainPath = packageJsonPath => {
      const package_ = this._options.moduleCache.getPackage(packageJsonPath);
      return package_.getMain();
    };this._options = options;}_redirectRequire(fromModule, modulePath) {const pck = fromModule.getPackage();if (pck) {return pck.redirectRequire(modulePath);}return modulePath;}resolveDependency(fromModule, moduleName, allowHaste, platform) {const result = Resolver.resolve(_extends({}, this._options, { originModulePath: fromModule.path, redirectModulePath: modulePath => this._redirectRequire(fromModule, modulePath), allowHaste, platform, resolveHasteModule: name => this._options.moduleMap.getModule(name, platform, true), resolveHastePackage: name => this._options.moduleMap.getPackage(name, platform, true), getPackageMainPath: this._getPackageMainPath }), moduleName, platform);if (result.type === 'resolved') {return this._getFileResolvedModule(result.resolution);}if (result.candidates.type === 'modulePath') {const which = result.candidates.which;throw new UnableToResolveError(fromModule.path, moduleName, `The module \`${moduleName}\` could not be found ` + `from \`${fromModule.path}\`. ` + `Indeed, none of these files exist:\n\n` + `  * \`${Resolver.formatFileCandidates(which.file)}\`\n` + `  * \`${Resolver.formatFileCandidates(which.dir)}\``);}var _result$candidates = result.candidates;const dirPaths = _result$candidates.dirPaths,extraPaths = _result$candidates.extraPaths;const displayDirPaths = dirPaths.filter(dirPath => this._options.dirExists(dirPath)).concat(extraPaths);const hint = displayDirPaths.length ? ' or in these directories:' : '';throw new UnableToResolveError(fromModule.path, moduleName, `Module does not exist in the module map${hint}\n` + displayDirPaths.map(dirPath => `  ${path.dirname(dirPath)}\n`).join(', ') + '\n' + `This might be related to https://github.com/facebook/react-native/issues/4968\n` + `To resolve try the following:\n` + `  1. Clear watchman watches: \`watchman watch-del-all\`.\n` + `  2. Delete the \`node_modules\` folder: \`rm -rf node_modules && npm install\`.\n` + '  3. Reset Metro Bundler cache: `rm -rf /tmp/metro-bundler-cache-*` or `npm start -- --reset-cache`.' + '  4. Remove haste cache: `rm -rf /tmp/haste-map-react-native-packager-*`.');}

  /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * FIXME: get rid of this function and of the reliance on `TModule`
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        * altogether, return strongly typed resolutions at the top-level instead.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        */
  _getFileResolvedModule(resolution) {
    switch (resolution.type) {
      case 'sourceFile':
        return this._options.moduleCache.getModule(resolution.filePath);
      case 'assetFiles':
        // FIXME: we should forward ALL the paths/metadata,
        // not just an arbitrary item!
        const arbitrary = getArrayLowestItem(resolution.filePaths);
        invariant(arbitrary != null, 'invalid asset resolution');
        return this._options.moduleCache.getAssetModule(arbitrary);
      case 'empty':const
        moduleCache = this._options.moduleCache;
        const module = moduleCache.getModule(ModuleResolver.EMPTY_MODULE);
        invariant(module != null, 'empty module is not available');
        return module;
      default:
        resolution.type;
        throw new Error('invalid type');}

  }}ModuleResolver.EMPTY_MODULE = require.resolve('./assets/empty-module.js');


function getArrayLowestItem(a) {
  if (a.length === 0) {
    return undefined;
  }
  let lowest = a[0];
  for (let i = 1; i < a.length; ++i) {
    if (a[i] < lowest) {
      lowest = a[i];
    }
  }
  return lowest;
}

class UnableToResolveError extends Error {
  /**
                                           * File path of the module that tried to require a module, ex. `/js/foo.js`.
                                           */







  constructor(
  originModulePath,
  targetModuleName,
  message)
  {
    super();
    this.originModulePath = originModulePath;
    this.targetModuleName = targetModuleName;
    this.message = util.format(
    'Unable to resolve module `%s` from `%s`: %s',
    targetModuleName,
    originModulePath,
    message);

  } /**
     * The name of the module that was required, no necessarily a path,
     * ex. `./bar`, or `invariant`.
     */}module.exports = {
  ModuleResolver,
  UnableToResolveError };