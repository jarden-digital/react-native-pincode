/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}var _require =

require('metro-core');const Logger = _require.Logger;

const debug = require('debug')('Metro:JStransformer');
const Worker = require('jest-worker').default;




















module.exports = class Transformer {






  constructor(options)







  {
    this._transformModulePath = options.transformModulePath;
    this._asyncRequireModulePath = options.asyncRequireModulePath;
    this._dynamicDepsInPackages = options.dynamicDepsInPackages;
    this._minifierPath = options.minifierPath;var _options$workerPath =
    options.workerPath;const workerPath = _options$workerPath === undefined ? require.resolve('./worker') : _options$workerPath;

    if (options.maxWorkers > 1) {
      this._worker = this._makeFarm(
      workerPath,
      this._computeWorkerKey,
      ['minify', 'transform'],
      options.maxWorkers);const


      reporters = options.reporters;
      this._worker.getStdout().on('data', chunk => {
        reporters.stdoutChunk(chunk.toString('utf8'));
      });
      this._worker.getStderr().on('data', chunk => {
        reporters.stderrChunk(chunk.toString('utf8'));
      });
    } else {
      // eslint-disable-next-line lint/flow-no-fixme
      // $FlowFixMe: Flow doesn't support dynamic requires
      this._worker = require(workerPath);
    }
  }

  kill() {
    if (this._worker && typeof this._worker.end === 'function') {
      this._worker.end();
    }
  }

  minify(
  filename,
  code,
  sourceMap)
  {var _this = this;return _asyncToGenerator(function* () {
      return yield _this._worker.minify(
      filename,
      code,
      sourceMap,
      _this._minifierPath);})();

  }

  transform(
  filename,
  localPath,
  code,
  isScript,
  options,
  assetExts,
  assetRegistryPath)
  {var _this2 = this;return _asyncToGenerator(function* () {
      try {
        debug('Started transforming file', filename);

        const data = yield _this2._worker.transform(
        filename,
        localPath,
        code,
        _this2._transformModulePath,
        isScript,
        options,
        assetExts,
        assetRegistryPath,
        _this2._asyncRequireModulePath,
        _this2._dynamicDepsInPackages);


        debug('Done transforming file', filename);

        Logger.log(data.transformFileStartLogEntry);
        Logger.log(data.transformFileEndLogEntry);

        return data.result;
      } catch (err) {
        debug('Failed transform file', filename);

        if (err.loc) {
          throw _this2._formatBabelError(err, filename);
        } else {
          throw _this2._formatGenericError(err, filename);
        }
      }})();
  }

  _makeFarm(workerPath, computeWorkerKey, exposedMethods, numWorkers) {
    // We whitelist only what would work. For example `--inspect` doesn't work
    // in the workers because it tries to open the same debugging port. Feel
    // free to add more cases to the RegExp. A whitelist is preferred, to
    // guarantee robustness when upgrading node, etc.
    const execArgv = process.execArgv.filter(
    arg =>
    /^--stack[_-]trace[_-]limit=[0-9]+$/.test(arg) ||
    /^--heap[_-]growing[_-]percent=[0-9]+$/.test(arg) ||
    /^--max[_-]old[_-]space[_-]size=[0-9]+$/.test(arg));


    return new Worker(workerPath, {
      computeWorkerKey,
      exposedMethods,
      forkOptions: { execArgv },
      numWorkers });

  }

  _computeWorkerKey(method, filename) {
    // Only when transforming a file we want to stick to the same worker; and
    // we'll shard by file path. If not; we return null, which tells the worker
    // to pick the first available one.
    if (method === 'transform') {
      return filename;
    }

    return null;
  }

  _formatGenericError(err, filename) {
    const error = new TransformError(`${filename}: ${err.message}`);

    return Object.assign(error, {
      stack: (err.stack || '').
      split('\n').
      slice(0, -1).
      join('\n'),
      lineNumber: 0 });

  }

  _formatBabelError(err, filename) {
    const error = new TransformError(
    `${err.type || 'Error'} in ${filename}: ${err.message}`);


    // $FlowFixMe: extending an error.
    return Object.assign(error, {
      stack: err.stack,
      snippet: err.codeFrame,
      lineNumber: err.loc.line,
      column: err.loc.column,
      filename });

  }};


class TransformError extends SyntaxError {


  constructor(message) {
    super(message);this.type = 'TransformError';
    Error.captureStackTrace && Error.captureStackTrace(this, TransformError);
  }}