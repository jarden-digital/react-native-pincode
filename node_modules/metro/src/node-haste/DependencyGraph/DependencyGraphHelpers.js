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

const path = require('path');

const NODE_MODULES = path.sep + 'node_modules' + path.sep;

class DependencyGraphHelpers {



  constructor(_ref)





  {let providesModuleNodeModules = _ref.providesModuleNodeModules,assetExts = _ref.assetExts;
    this._providesModuleNodeModules = providesModuleNodeModules;
    this._assetExts = new Set(assetExts);
  }

  isNodeModulesDir(file) {
    const index = file.lastIndexOf(NODE_MODULES);
    if (index === -1) {
      return false;
    }

    const parts = file.substr(index + 14).split(path.sep);
    const dirs = this._providesModuleNodeModules;
    for (let i = 0; i < dirs.length; i++) {
      if (parts.indexOf(dirs[i]) > -1) {
        return false;
      }
    }

    return true;
  }

  isAssetFile(file) {
    return this._assetExts.has(this.extname(file));
  }

  extname(name) {
    return path.extname(name).substr(1);
  }}


module.exports = DependencyGraphHelpers;