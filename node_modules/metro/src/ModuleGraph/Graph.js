/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';function _toConsumableArray(arr) {if (Array.isArray(arr)) {for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];return arr2;} else {return Array.from(arr);}}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const invariant = require('fbjs/lib/invariant');
const emptyModule = require('./module').empty;
const nullthrows = require('fbjs/lib/nullthrows');










const NO_OPTIONS = {};

exports.create = function create(resolve, load) {let Graph = (() => {var _ref = _asyncToGenerator(
    function* (entryPoints, platform, options) {var _ref2 =

      options || NO_OPTIONS,_ref2$log = _ref2.log;const log = _ref2$log === undefined ? console : _ref2$log;var _ref2$optimize = _ref2.optimize;const optimize = _ref2$optimize === undefined ? false : _ref2$optimize,skip = _ref2.skip;

      if (typeof platform !== 'string') {
        log.error('`Graph`, called without a platform');
        return Promise.reject(new Error('The target platform has to be passed'));
      }

      const loadOptions = { log, optimize };
      const memoizingLoad = memoizeLoad(load);

      const queue =








      new Queue(
      function (_ref3) {let dependency = _ref3.dependency,parent = _ref3.parent;return (
          memoizingLoad(
          resolve(dependency.name, parent, platform, options || NO_OPTIONS),
          loadOptions));},

      onFileLoaded,
      new Map([[null, emptyModule()]]));


      const tasks = Array.from(entryPoints, function (id, i) {return {
          dependency: { name: id, isAsync: false },
          parent: null,
          parentDependencyIndex: i,
          skip };});


      if (tasks.length === 0) {
        log.error('`Graph` called without any entry points');
        return Promise.reject(
        new Error('At least one entry point has to be passed.'));

      }

      queue.enqueue.apply(queue, _toConsumableArray(tasks));
      return collect((yield queue.result));
    });return function Graph(_x, _x2, _x3) {return _ref.apply(this, arguments);};})();

  return Graph;
};

class Queue {










  constructor(
  runTask,
  accumulate,
  initial)
  {this._pending = new Set();this._queue = [];
    this._runTask = runTask;
    this._accumulate = accumulate;
    this._result = initial;var _deferred =

    deferred();const promise = _deferred.promise,reject = _deferred.reject,resolve = _deferred.resolve;
    this.result = promise;
    this._reject = reject;
    this._resolve = resolve;
  }

  enqueue() {var _queue;
    (_queue = this._queue).push.apply(_queue, arguments);
    this._run();
  }

  _onAsyncTaskDone(result, task) {
    this._pending.delete(task);
    this._onTaskDone(result, task);
    this._run();
  }

  _onTaskDone(result, task) {
    this._result = this._accumulate(this, this._result, result, task);
  }

  _run() {
    if (this._running) {
      return;
    }

    this._running = true;

    const queue = this._queue;
    const runTask = this._runTask;
    while (queue.length) {
      const task = queue.shift();
      const result = runTask(task);
      if (isPromise(result)) {
        this._pending.add(task);
        result.then(
        result => this._onAsyncTaskDone(result, task),
        this._reject);

      } else {
        this._onTaskDone(result, task);
      }
    }

    this._running = false;
    if (this._pending.size === 0) {
      this._resolve(this._result);
    }
  }}


function onFileLoaded(
queue,
modules, _ref4, _ref5)


{let file = _ref4.file,dependencies = _ref4.dependencies;let dependency = _ref5.dependency,parent = _ref5.parent,parentDependencyIndex = _ref5.parentDependencyIndex,skip = _ref5.skip;const
  path = file.path;
  const parentModule = modules.get(parent);

  invariant(parentModule, 'Invalid parent module: ' + String(parent));
  parentModule.dependencies[parentDependencyIndex] = {
    id: dependency.name,
    isAsync: dependency.isAsync,
    path };


  if ((!skip || !skip.has(path)) && !modules.has(path)) {
    modules.set(path, { file, dependencies: Array(dependencies.length) });
    queue.enqueue.apply(queue, _toConsumableArray(
    dependencies.map((dependency, i) => ({
      dependency,
      parent: path,
      parentDependencyIndex: i,
      skip }))));


  }

  return modules;
}

function collect(
modules)



{let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;let serialized = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { entryModules: [], modules: [] };let seen = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Set();
  const module = modules.get(path);
  if (module == null || seen.has(path)) {
    return serialized;
  }const

  dependencies = module.dependencies;
  if (path === null) {
    serialized.entryModules = dependencies.map(dep =>
    nullthrows(modules.get(dep.path)));

  } else {
    serialized.modules.push(module);
    seen.add(path);
  }

  for (const dependency of dependencies) {
    collect(modules, dependency.path, serialized, seen);
  }

  return serialized;
}



function memoizeLoad(load) {
  const cache = new Map();
  return (path, options) => {
    const cached = cache.get(path);
    if (cached !== undefined) {
      return cached;
    }

    const result = load(path, options);
    cache.set(path, result);
    if (isPromise(result)) {
      result.then(resolved => cache.set(path, resolved));
    }

    return result;
  };
}

// eslint-disable-next-line lint/no-unclear-flowtypes, no-redeclare
function isPromise(x) {
  return x != null && typeof x.then === 'function';
}

function deferred()



{
  let reject, resolve;
  const promise = new Promise((res, rej) => {
    reject = rej;
    resolve = res;
  });

  return { promise, reject: nullthrows(reject), resolve: nullthrows(resolve) };
}