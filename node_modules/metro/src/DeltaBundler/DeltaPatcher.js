/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();






/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * This is a reference client for the Delta Bundler: it maintains cached the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * last patched bundle delta and it's capable of applying new Deltas received
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * from the Bundler.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */
class DeltaPatcher {constructor() {this.


    _lastBundle = {
      pre: new Map(),
      post: new Map(),
      modules: new Map(),
      id: undefined };this.

    _initialized = false;this.
    _lastNumModifiedFiles = 0;this.
    _lastModifiedDate = new Date();}

  static get(id) {
    let deltaPatcher = this._deltaPatchers.get(id);

    if (!deltaPatcher) {
      deltaPatcher = new DeltaPatcher();
      this._deltaPatchers.set(id, deltaPatcher);
    }

    return deltaPatcher;
  }

  /**
     * Applies a Delta Bundle to the current bundle.
     */
  applyDelta(deltaBundle) {
    // Make sure that the first received delta is a fresh one.
    if (!this._initialized && !deltaBundle.reset) {
      throw new Error(
      'DeltaPatcher should receive a fresh Delta when being initialized');

    }

    this._initialized = true;

    // Reset the current delta when we receive a fresh delta.
    if (deltaBundle.reset) {
      this._lastBundle = {
        pre: new Map(),
        post: new Map(),
        modules: new Map(),
        id: undefined };

    }

    this._lastNumModifiedFiles =
    deltaBundle.pre.size + deltaBundle.post.size + deltaBundle.delta.size;

    if (this._lastNumModifiedFiles > 0) {
      this._lastModifiedDate = new Date();
    }

    this._patchMap(this._lastBundle.pre, deltaBundle.pre);
    this._patchMap(this._lastBundle.post, deltaBundle.post);
    this._patchMap(this._lastBundle.modules, deltaBundle.delta);

    this._lastBundle.id = deltaBundle.id;

    return this;
  }

  getLastBundleId() {
    return this._lastBundle.id;
  }

  /**
     * Returns the number of modified files in the last received Delta. This is
     * currently used to populate the `X-Metro-Files-Changed-Count` HTTP header
     * when metro serves the whole JS bundle, and can potentially be removed once
     * we only send the actual deltas to clients.
     */
  getLastNumModifiedFiles() {
    return this._lastNumModifiedFiles;
  }

  getLastModifiedDate() {
    return this._lastModifiedDate;
  }

  getAllModules()



  {let modifierFn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : modules => modules;
    return [].concat(
    Array.from(this._lastBundle.pre.values()),
    modifierFn(Array.from(this._lastBundle.modules.values())),
    Array.from(this._lastBundle.post.values()));

  }

  _patchMap(original, patch) {
    for (const _ref of patch.entries()) {var _ref2 = _slicedToArray(_ref, 2);const key = _ref2[0];const value = _ref2[1];
      if (value == null) {
        original.delete(key);
      } else {
        original.set(key, value);
      }
    }
  }}DeltaPatcher._deltaPatchers = new Map();


module.exports = DeltaPatcher;