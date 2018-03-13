/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * 
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

const nullthrows = require('fbjs/lib/nullthrows');var _require =

require('../../babel-bridge');const babelTemplate = _require.babelTemplate;var _require2 =
require('../../babel-bridge');const traverse = _require2.babelTraverse;var _require3 =
require('../../babel-bridge');const types = _require3.babelTypes;var _require4 =
require('../../babel-bridge');const generate = _require4.babelGenerate;






















/**
                                                                         * Transform all the calls to `require()` and `import()` in a file into ID-
                                                                         * independent code, and return the list of dependencies. For example, a call
                                                                         * like `require('Foo')` could be transformed to `require(_depMap[3], 'Foo')`
                                                                         * where `_depMap` is provided by the outer scope. As such, we don't need to
                                                                         * know the actual module ID. The second argument is only provided for debugging
                                                                         * purposes.
                                                                         */
function collectDependencies(
ast,
options)
{
  const visited = new WeakSet();const
  asyncRequireModulePath = options.asyncRequireModulePath,dynamicRequires = options.dynamicRequires;
  const context = {
    asyncRequireModulePath,
    dynamicRequires,
    dependencies: [],
    nameToIndex: new Map() };

  const visitor = {
    Program(path, state) {
      state.dependencyMapIdentifier = path.scope.generateUidIdentifier(
      'dependencyMap');

    },
    CallExpression(path, state) {const
      depMapIdent = state.dependencyMapIdentifier;
      const node = path.node;
      if (visited.has(node)) {
        return;
      }
      if (node.callee.type === 'Import') {
        processImportCall(context, path, node, depMapIdent);
        return;
      }
      if (isRequireCall(node.callee)) {
        const reqNode = processRequireCall(context, path, node, depMapIdent);
        visited.add(reqNode);
      }
    } };

  const traversalState = { dependencyMapIdentifier: null };
  traverse(ast, visitor, null, traversalState);
  return {
    dependencies: context.dependencies,
    dependencyMapName: nullthrows(traversalState.dependencyMapIdentifier).name };

}

function isRequireCall(callee) {
  return callee.type === 'Identifier' && callee.name === 'require';
}

function processImportCall(context, path, node, depMapIdent) {var _getModuleNameFromCal =
  getModuleNameFromCallArgs('import', node, path),_getModuleNameFromCal2 = _slicedToArray(_getModuleNameFromCal, 2);const name = _getModuleNameFromCal2[1];
  if (name == null) {
    throw invalidRequireOf('import', node);
  }
  const index = assignDependencyIndex(context, name, 'import');
  const mapLookup = createDepMapLookup(depMapIdent, index);const
  asyncRequireModulePath = context.asyncRequireModulePath;
  const newImport = makeAsyncRequire({
    MODULE_ID: mapLookup,
    ASYNC_REQUIRE_PATH: { type: 'StringLiteral', value: asyncRequireModulePath } });

  path.replaceWith(newImport);
}

function processRequireCall(context, path, node, depMapIdent) {var _getModuleNameFromCal3 =
  getModuleNameFromCallArgs('require', node, path),_getModuleNameFromCal4 = _slicedToArray(_getModuleNameFromCal3, 2);const nameExpr = _getModuleNameFromCal4[0],name = _getModuleNameFromCal4[1];
  if (name == null) {const
    dynamicRequires = context.dynamicRequires;
    switch (dynamicRequires) {
      case 'reject':
        throw invalidRequireOf('require', node);
      case 'throwAtRuntime':
        const newNode = makeDynamicRequireReplacement({ NAME_EXPR: nameExpr });
        path.replaceWith(newNode);
        return newNode;
      default:
        dynamicRequires;
        throw new Error(`invalid dyn requires spec \`${dynamicRequires}\``);}

  }
  const index = assignDependencyIndex(context, name, 'require');
  const mapLookup = createDepMapLookup(depMapIdent, index);
  node.arguments = [mapLookup, nameExpr];
  return node;
}

const makeDynamicRequireReplacement = babelTemplate(
"(function(name){throw new Error('Module `'+name+'` was required " +
"dynamically. This is not supported by Metro bundler.')})(NAME_EXPR)");


/**
                                                                         * Extract the module name from `require` arguments. We support template
                                                                         * literal, for example one could write `require(`foo`)`.
                                                                         */
function getModuleNameFromCallArgs(type, node, path) {
  if (node.arguments.length !== 1) {
    throw invalidRequireOf(type, node);
  }

  const nameExpression = node.arguments[0];

  // Try to evaluate the first argument of the require() statement.
  // If it can be statically evaluated, resolve it.
  const result = path.get('arguments.0').evaluate();
  if (result.confident && typeof result.value === 'string') {
    return [nameExpression, result.value];
  }
  return [nameExpression, null];
}

/**
   * For each different module being required, we assign it an index in the
   * "dependency map". If we encounter the same module twice, it gets the same
   * index. A module required both asynchronously and synchronously is marked
   * as not being async.
   */
function assignDependencyIndex(
context,
name,
type)
{
  let index = context.nameToIndex.get(name);
  if (index == null) {
    const isAsync = type === 'import';
    index = context.dependencies.push({ name, isAsync }) - 1;
    context.nameToIndex.set(name, index);
    return index;
  }
  if (type === 'require') {
    context.dependencies[index].isAsync = false;
  }
  return index;
}

function createDepMapLookup(depMapIndent, index) {
  const indexLiteral = types.numericLiteral(index);
  return types.memberExpression(depMapIndent, indexLiteral, true);
}

const makeAsyncRequire = babelTemplate(
`require(ASYNC_REQUIRE_PATH)(MODULE_ID)`);


function invalidRequireOf(type, node) {
  const str = generate(node).code;
  return new InvalidRequireCallError(type, str, node.loc.start);
}

class InvalidRequireCallError extends Error {




  constructor(callType, nodeString, loc) {
    super(
    `${loc.line}:${loc.column}: ` +
    `calls to \`${callType}\` expect exactly 1 string literal ` +
    `argument, but this was found: \`${nodeString}\`.`);

    this.callType = callType;
    this.nodeString = nodeString;
    this.location = loc;
  }}

collectDependencies.InvalidRequireCallError = InvalidRequireCallError;

module.exports = collectDependencies;