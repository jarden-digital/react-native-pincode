/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

const path = require('path');const

DuplicateHasteCandidatesError = require('jest-haste-map').ModuleMap.DuplicateHasteCandidatesError;var _require =






require('metro-resolver');const InvalidPackageError = _require.InvalidPackageError,formatFileCandidates = _require.formatFileCandidates;






































class ResolutionRequest {





  constructor(options) {
    this._options = options;
    this._resetResolutionCache();
  }

  resolveDependency(fromModule, toModuleName) {
    const resHash = getResolutionCacheKey(fromModule.path, toModuleName);

    const immediateResolution = this._immediateResolutionCache[resHash];
    if (immediateResolution) {
      return immediateResolution;
    }

    const cacheResult = result => {
      this._immediateResolutionCache[resHash] = result;
      return result;
    };

    const resolver = this._options.moduleResolver;
    const platform = this._options.platform;

    const allowHaste = !this._options.helpers.isNodeModulesDir(fromModule.path);

    try {
      return cacheResult(
      resolver.resolveDependency(
      fromModule,
      toModuleName,
      allowHaste,
      platform));


    } catch (error) {
      if (error instanceof DuplicateHasteCandidatesError) {
        throw new AmbiguousModuleResolutionError(fromModule.path, error);
      }
      if (error instanceof InvalidPackageError) {
        throw new PackageResolutionError({
          packageError: error,
          originModulePath: fromModule.path,
          targetModuleName: toModuleName });

      }
      throw error;
    }
  }

  _resetResolutionCache() {
    this._immediateResolutionCache = Object.create(null);
  }

  getResolutionCache() {
    return this._immediateResolutionCache;
  }}


function getResolutionCacheKey(modulePath, depName) {
  return `${path.resolve(modulePath)}:${depName}`;
}

class AmbiguousModuleResolutionError extends Error {



  constructor(
  fromModulePath,
  hasteError)
  {
    super(
    `Ambiguous module resolution from \`${fromModulePath}\`: ` +
    hasteError.message);

    this.fromModulePath = fromModulePath;
    this.hasteError = hasteError;
  }}


class PackageResolutionError extends Error {




  constructor(opts)



  {
    const perr = opts.packageError;
    super(
    `While trying to resolve module \`${opts.targetModuleName}\` from file ` +
    `\`${opts.originModulePath}\`, the package ` +
    `\`${perr.packageJsonPath}\` was successfully found. However, ` +
    `this package itself specifies ` +
    `a \`main\` module field that could not be resolved (` +
    `\`${perr.mainPrefixPath}\`. Indeed, none of these files exist:\n\n` +
    `  * \`${formatFileCandidates(perr.fileCandidates)}\`\n` +
    `  * \`${formatFileCandidates(perr.indexCandidates)}\``);

    Object.assign(this, opts);
  }}


ResolutionRequest.AmbiguousModuleResolutionError = AmbiguousModuleResolutionError;
ResolutionRequest.PackageResolutionError = PackageResolutionError;

module.exports = ResolutionRequest;