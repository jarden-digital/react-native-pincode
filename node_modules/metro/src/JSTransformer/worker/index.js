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

const JsFileWrapping = require('../../ModuleGraph/worker/JsFileWrapping');

const assetTransformer = require('../../assetTransformer');
const collectDependencies = require('../../ModuleGraph/worker/collectDependencies');
const constantFoldingPlugin = require('./constant-folding-plugin');
const getMinifier = require('../../lib/getMinifier');
const inlinePlugin = require('./inline-plugin');
const optimizeDependencies = require('../../ModuleGraph/worker/optimizeDependencies');
const path = require('path');var _require =

require('../../babel-bridge');const babylon = _require.babylon;var _require2 =
require('../../babel-bridge');const generate = _require2.babelGenerate;var _require3 =
require('metro-source-map');const toSegmentTuple = _require3.toSegmentTuple;







































































function postTransform(
filename,
localPath,
sourceCode,
isScript,
options,
transformFileStartLogEntry,
asyncRequireModulePath,
dynamicDepsInPackages,
receivedAst)
{
  // Transformers can ouptut null ASTs (if they ignore the file). In that case
  // we need to parse the module source code to get their AST.
  const ast = receivedAst || babylon.parse(sourceCode, { sourceType: 'module' });

  const timeDelta = process.hrtime(transformFileStartLogEntry.start_timestamp);
  const duration_ms = Math.round((timeDelta[0] * 1e9 + timeDelta[1]) / 1e6);
  const transformFileEndLogEntry = {
    action_name: 'Transforming file',
    action_phase: 'end',
    file_name: filename,
    duration_ms,
    log_entry_label: 'Transforming file' };


  let dependencies, wrappedAst;

  // If the module to transform is a script (meaning that is not part of the
  // dependency graph and it code will just be prepended to the bundle modules),
  // we need to wrap it differently than a commonJS module (also, scripts do
  // not have dependencies).
  if (isScript) {
    dependencies = [];
    wrappedAst = JsFileWrapping.wrapPolyfill(ast);
  } else {
    let dependencyMapName;
    try {
      const opts = {
        asyncRequireModulePath,
        dynamicRequires: getDynamicDepsBehavior(
        dynamicDepsInPackages,
        filename) };var _collectDependencies =


      collectDependencies(ast, opts);dependencies = _collectDependencies.dependencies;dependencyMapName = _collectDependencies.dependencyMapName;
    } catch (error) {
      if (error instanceof collectDependencies.InvalidRequireCallError) {
        throw new InvalidRequireCallError(error, filename);
      }
      throw error;
    }

    const wrapped = JsFileWrapping.wrapModule(ast, dependencyMapName);

    wrappedAst = wrapped.ast;

    if (!options.dev) {
      dependencies = optimizeDependencies(
      wrappedAst,
      dependencies,
      dependencyMapName,
      wrapped.requireName);

    }

    dependencies = dependencies.map(dep => dep.name);
  }

  const result = generate(
  wrappedAst,
  {
    code: false,
    comments: false,
    compact: false,
    filename: localPath,
    retainLines: false,
    sourceFileName: filename,
    sourceMaps: true },

  sourceCode);


  const map = result.rawMappings ? result.rawMappings.map(toSegmentTuple) : [];

  return {
    result: { dependencies, code: result.code, map },
    transformFileStartLogEntry,
    transformFileEndLogEntry };

}

function getDynamicDepsBehavior(
inPackages,
filename)
{
  switch (inPackages) {
    case 'reject':
      return 'reject';
    case 'throwAtRuntime':
      const isPackage = /(?:^|[/\\])node_modules[/\\]/.test(filename);
      return isPackage ? inPackages : 'reject';
    default:
      inPackages;
      throw new Error(
      `invalid value for dynamic deps behavior: \`${inPackages}\``);}


}

function transformCode(
filename,
localPath,
sourceCode,
transformerPath,
isScript,
options,
assetExts,
assetRegistryPath,
asyncRequireModulePath,
dynamicDepsInPackages)
{
  const isJson = filename.endsWith('.json');

  if (isJson) {
    sourceCode = 'module.exports=' + sourceCode;
  }

  const transformFileStartLogEntry = {
    action_name: 'Transforming file',
    action_phase: 'start',
    file_name: filename,
    log_entry_label: 'Transforming file',
    start_timestamp: process.hrtime() };


  const plugins = options.dev ?
  [] :
  [[inlinePlugin, options], [constantFoldingPlugin, options]];

  // $FlowFixMe TODO t26372934 Plugin system
  const transformer = require(transformerPath);

  const transformerArgs = {
    filename,
    localPath,
    options,
    plugins,
    src: sourceCode };


  const transformResult = isAsset(filename, assetExts) ?
  assetTransformer.transform(
  transformerArgs,
  assetRegistryPath,
  options.assetDataPlugins) :

  transformer.transform(transformerArgs);

  const postTransformArgs = [
  filename,
  localPath,
  sourceCode,
  isScript,
  options,
  transformFileStartLogEntry,
  asyncRequireModulePath,
  dynamicDepsInPackages];


  return transformResult instanceof Promise ?
  transformResult.then((_ref) => {let ast = _ref.ast;return postTransform.apply(undefined, postTransformArgs.concat([ast]));}) :
  postTransform.apply(undefined, postTransformArgs.concat([transformResult.ast]));
}

function minifyCode(
filename,
code,
sourceMap,
minifierPath)
{
  const minify = getMinifier(minifierPath);
  try {
    return minify.withSourceMap(code, sourceMap, filename);
  } catch (error) {
    if (error.constructor.name === 'JS_Parse_Error') {
      throw new Error(
      `${error.message} in file ${filename} at ${error.line}:${error.col}`);

    }

    throw error;
  }
}

function isAsset(filePath, assetExts) {
  return assetExts.indexOf(path.extname(filePath).slice(1)) !== -1;
}

class InvalidRequireCallError extends Error {



  constructor(
  innerError,
  filename)
  {
    super(`${filename}:${innerError.message}`);
    this.innerError = innerError;
    this.filename = filename;
  }}


module.exports = {
  transform: transformCode,
  minify: minifyCode,
  InvalidRequireCallError };