/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

const optimizeModule = require('./worker/optimize-module');
const transformModule = require('./worker/transform-module');
const wrapWorkerFn = require('./worker/wrap-worker-fn');





exports.optimizeModule = wrapWorkerFn(optimizeModule);


exports.transformModule = wrapWorkerFn(transformModule);