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









/**
               * A promise-like object that only creates the underlying value lazily
               * when requested.
               */
exports.LazyPromise = class LazyPromise {


  constructor(factory) {
    //$FlowIssue #16209141
    Object.defineProperty(this, '_promise', {
      configurable: true,
      enumerable: true,
      get: () => this._promise = factory(),
      set: value => Object.defineProperty(this, '_promise', { value }) });

  }

  then(
  fulfilled,
  rejected)
  {
    return this._promise.then(fulfilled, rejected);
  }

  catch(rejected) {
    return this._promise.catch(rejected);
  }};


/**
       * A promise-like object that allows only one `.then()` handler to access
       * the wrapped value simultaneously. Can be used to lock resources that do
       * asynchronous work.
       */
exports.LockingPromise = class LockingPromise {



  constructor(promise) {
    this._gate = this._promise = promise;
  }

  then(
  fulfilled,
  rejected)
  {
    const whenUnlocked = () => {
      const promise = this._promise.then(fulfilled, rejected);
      this._gate = promise.then(empty); // avoid retaining the result of promise
      return promise;
    };

    return this._gate.then(whenUnlocked, whenUnlocked);
  }

  catch(rejected) {
    return this._promise.catch(rejected);
  }};


function empty() {}