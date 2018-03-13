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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Dependency Traversal logic for the Delta Bundler. This method calculates
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * the modules that should be included in the bundle by traversing the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * dependency graph.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * Instead of traversing the whole graph each time, it just calculates the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * difference between runs by only traversing the added/removed dependencies.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * To do so, it uses the passed `edges` paramater, which is a data structure
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * that contains the whole status of the dependency graph. During the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * recalculation of the dependencies, it mutates the edges graph.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * The paths parameter contains the absolute paths of the root files that the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * method should traverse. Normally, these paths should be the modified files
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       * since the last traversal.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       */let traverseDependencies = (() => {var _ref = _asyncToGenerator(
  function* (
  paths,
  dependencyGraph,
  transformOptions,
  edges)

  {let onProgress = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
    const changes = [];

    yield Promise.all(
    paths.map((() => {var _ref2 = _asyncToGenerator(function* (path) {
        const edge = edges.get(path);

        if (!edge) {
          return;
        }

        changes.push((
        yield traverseDependenciesForSingleFile(
        edge,
        dependencyGraph,
        transformOptions,
        edges,
        onProgress)));


      });return function (_x6) {return _ref2.apply(this, arguments);};})()));


    const added = new Map();
    const deleted = new Set();
    const modified = new Map();

    for (const change of changes) {
      for (const _ref3 of change.added) {var _ref4 = _slicedToArray(_ref3, 2);const path = _ref4[0];const edge = _ref4[1];
        added.set(path, edge);
      }

      for (const _ref5 of change.modified) {var _ref6 = _slicedToArray(_ref5, 2);const path = _ref6[0];const edge = _ref6[1];
        modified.set(path, edge);
      }
    }

    for (const change of changes) {
      for (const path of change.deleted) {
        // If a dependency has been marked as added, it should never be included
        // in as added.
        // At the same time, if a dependency has been marked both as added and
        // deleted, it means that this is a renamed file (or that dependency
        // has been removed from one path but added back in a different path).
        // In this case the addition and deletion "get cancelled".
        const markedAsAdded = added.delete(path);

        if (!markedAsAdded || modified.has(path)) {
          deleted.add(path);
        }
      }
    }

    return {
      added,
      deleted };

  });return function traverseDependencies(_x, _x2, _x3, _x4) {return _ref.apply(this, arguments);};})();let initialTraverseDependencies = (() => {var _ref7 = _asyncToGenerator(

  function* (
  path,
  dependencyGraph,
  transformOptions,
  edges)

  {let onProgress = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
    const edge = createEdge(dependencyGraph.getModuleForPath(path), edges);

    return yield traverseDependenciesForSingleFile(
    edge,
    dependencyGraph,
    transformOptions,
    edges,
    onProgress);

  });return function initialTraverseDependencies(_x7, _x8, _x9, _x10) {return _ref7.apply(this, arguments);};})();let traverseDependenciesForSingleFile = (() => {var _ref8 = _asyncToGenerator(

  function* (
  edge,
  dependencyGraph,
  transformOptions,
  edges)

  {let onProgress = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : function () {};
    let numProcessed = 0;
    let total = 1;
    onProgress(numProcessed, total);

    const result = yield processEdge(
    edge,
    dependencyGraph,
    transformOptions,
    edges,
    function () {
      total++;
      onProgress(numProcessed, total);
    },
    function () {
      numProcessed++;
      onProgress(numProcessed, total);
    });


    numProcessed++;
    onProgress(numProcessed, total);

    const modified = new Map([[edge.path, edge]]);

    return {
      added: reorderDependencies(edge, result.added),
      deleted: result.deleted,
      modified };

  });return function traverseDependenciesForSingleFile(_x12, _x13, _x14, _x15) {return _ref8.apply(this, arguments);};})();let processEdge = (() => {var _ref9 = _asyncToGenerator(

  function* (
  edge,
  dependencyGraph,
  transformOptions,
  edges,
  onDependencyAdd,
  onDependencyAdded)
  {
    const previousDependencies = new Set(edge.dependencies.values());

    const result = yield dependencyGraph.
    getModuleForPath(edge.path).
    read(
    removeInlineRequiresBlacklistFromOptions(edge.path, transformOptions));


    // Get the absolute path of all sub-dependencies (some of them could have been
    // moved but maintain the same relative path).
    const currentDependencies = resolveDependencies(
    edge.path,
    result.dependencies,
    dependencyGraph,
    transformOptions);


    // Update the edge information.
    edge.output.code = result.code;
    edge.output.map = result.map;
    edge.output.source = result.source;
    edge.dependencies = new Map();

    currentDependencies.forEach(function (relativePath, absolutePath) {
      edge.dependencies.set(relativePath, absolutePath);
    });

    const deleted = [];
    for (const absolutePath of previousDependencies.values()) {
      if (!currentDependencies.has(absolutePath)) {
        deleted.push(removeDependency(edge, absolutePath, edges));
      }
    }

    const added = new Map([[edge.path, edge]]);

    // Check all the module dependencies and start traversing the tree from each
    // added and removed dependency, to get all the modules that have to be added
    // and removed from the dependency graph.
    yield Promise.all(
    Array.from(currentDependencies.keys()).map((() => {var _ref10 = _asyncToGenerator(function* (absolutePath) {
        if (previousDependencies.has(absolutePath)) {
          return;
        }

        const dependencies = yield addDependency(
        edge,
        absolutePath,
        dependencyGraph,
        transformOptions,
        edges,
        onDependencyAdd,
        onDependencyAdded);


        for (const _ref11 of dependencies) {var _ref12 = _slicedToArray(_ref11, 2);const path = _ref12[0];const edge = _ref12[1];
          added.set(path, edge);
        }
      });return function (_x23) {return _ref10.apply(this, arguments);};})()));


    return {
      added,
      deleted: flatten(deleted) };

  });return function processEdge(_x17, _x18, _x19, _x20, _x21, _x22) {return _ref9.apply(this, arguments);};})();let addDependency = (() => {var _ref13 = _asyncToGenerator(

  function* (
  parentEdge,
  path,
  dependencyGraph,
  transformOptions,
  edges,
  onDependencyAdd,
  onDependencyAdded)
  {
    const existingEdge = edges.get(path);

    // The new dependency was already in the graph, we don't need to do anything.
    if (existingEdge) {
      existingEdge.inverseDependencies.add(parentEdge.path);

      return new Map();
    }

    const edge = createEdge(dependencyGraph.getModuleForPath(path), edges);

    edge.inverseDependencies.add(parentEdge.path);

    onDependencyAdd();var _ref14 =

    yield processEdge(
    edge,
    dependencyGraph,
    transformOptions,
    edges,
    onDependencyAdd,
    onDependencyAdded);const added = _ref14.added;


    onDependencyAdded();

    return added;
  });return function addDependency(_x24, _x25, _x26, _x27, _x28, _x29, _x30) {return _ref13.apply(this, arguments);};})();function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}const removeInlineRequiresBlacklistFromOptions = require('../lib/removeInlineRequiresBlacklistFromOptions'); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * Internal data structure that the traversal logic uses to know which of the
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * files have been modified. This helps us know which files to mark as deleted
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * (a file should not be deleted if it has been added, but it should if it
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         * just has been modified).
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         **/function removeDependency(parentEdge, absolutePath, edges)
{
  const edge = edges.get(absolutePath);

  if (!edge) {
    return new Set();
  }

  edge.inverseDependencies.delete(parentEdge.path);

  // This module is still used by another modules, so we cannot remove it from
  // the bundle.
  if (edge.inverseDependencies.size) {
    return new Set();
  }

  const removedDependencies = new Set([edge.path]);

  // Now we need to iterate through the module dependencies in order to
  // clean up everything (we cannot read the module because it may have
  // been deleted).
  for (const depAbsolutePath of edge.dependencies.values()) {
    const removed = removeDependency(edge, depAbsolutePath, edges);

    for (const removedDependency of removed.values()) {
      removedDependencies.add(removedDependency);
    }
  }

  // This module is not used anywhere else!! we can clear it from the bundle
  destroyEdge(edge, edges);

  return removedDependencies;
}

function createEdge(module, edges) {
  const edge = {
    dependencies: new Map(),
    inverseDependencies: new Set(),
    path: module.path,
    output: {
      code: '',
      map: [],
      source: '',
      type: getType(module) } };


  edges.set(module.path, edge);

  return edge;
}

function getType(module) {
  if (module.isAsset()) {
    return 'asset';
  }

  if (module.isPolyfill()) {
    return 'script';
  }

  return 'module';
}

function destroyEdge(edge, edges) {
  edges.delete(edge.path);
}

function resolveDependencies(
parentPath,
dependencies,
dependencyGraph,
transformOptions)
{
  const parentModule = dependencyGraph.getModuleForPath(parentPath);

  return new Map(
  dependencies.map(relativePath => [
  dependencyGraph.resolveDependency(
  parentModule,
  relativePath,
  transformOptions.platform).
  path,
  relativePath]));


}

/**
   * Retraverse the dependency graph in DFS order to reorder the modules and
   * guarantee the same order between runs.
   */
function reorderDependencies(
edge,
dependencies)

{let orderedDependencies = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Map();
  if (
  !edge ||
  !dependencies.has(edge.path) ||
  orderedDependencies.has(edge.path))
  {
    return orderedDependencies;
  }

  orderedDependencies.set(edge.path, edge);

  edge.dependencies.forEach(path =>
  reorderDependencies(
  dependencies.get(path),
  dependencies,
  orderedDependencies));



  return orderedDependencies;
}

function flatten(input) {
  const output = new Set();

  for (const items of input) {
    for (const item of items) {
      output.add(item);
    }
  }

  return output;
}

module.exports = {
  initialTraverseDependencies,
  traverseDependencies,
  reorderDependencies };