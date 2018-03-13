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

const Module = require('./Module');
const Package = require('./Package');





module.exports = class ModuleCache {





  constructor(
  getClosestPackage,
  getTransformedFile)
  {
    this._getClosestPackage = getClosestPackage;
    this.getTransformedFile = getTransformedFile;
    this.modules = new Map();
    this.packages = new Map();
  }

  getAssetModule(path) {
    return this.getModule(path);
  }

  getModule(path) {
    let m = this.modules.get(path);
    if (!m) {
      m = new Module(path, this, this.getTransformedFile(path));
      this.modules.set(path, m);
    }
    return m;
  }

  getPackage(path) {
    let p = this.packages.get(path);
    if (!p) {
      p = new Package(path, this.getPackageData(path));
      this.packages.set(path, p);
    }
    return p;
  }

  getPackageData(path) {
    const pkg = this.getTransformedFile(path).package;
    if (!pkg) {
      throw new Error(`"${path}" does not exist`);
    }
    return pkg;
  }

  getPackageOf(filePath) {
    const candidate = this._getClosestPackage(filePath);
    return candidate != null ? this.getPackage(candidate) : null;
  }};