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

const Generator = require('./Generator');
const SourceMap = require('source-map');


































/**
                                          * Creates a source map from modules with "raw mappings", i.e. an array of
                                          * tuples with either 2, 4, or 5 elements:
                                          * generated line, generated column, source line, source line, symbol name.
                                          */
function fromRawMappings(
modules)





{
  const generator = new Generator();
  let carryOver = 0;

  for (var j = 0, o = modules.length; j < o; ++j) {
    var module = modules[j];var
    code = module.code,map = module.map;

    if (Array.isArray(map)) {
      addMappingsForFile(generator, map, module, carryOver);
    } else if (map != null) {
      throw new Error(
      `Unexpected module with full source map found: ${module.path}`);

    }

    carryOver = carryOver + countLines(code);
  }

  return generator;
}

/**
   * Transforms a standard source map object into a Raw Mappings object, to be
   * used across the bundler.
   */
function toBabelSegments(
sourceMap)
{
  const rawMappings = [];

  new SourceMap.SourceMapConsumer(sourceMap).eachMapping(map => {
    rawMappings.push({
      generated: {
        line: map.generatedLine,
        column: map.generatedColumn },

      original: {
        line: map.originalLine,
        column: map.originalColumn },

      source: map.source,
      name: map.name });

  });

  return rawMappings;
}

function toSegmentTuple(
mapping)
{var _mapping$generated =
  mapping.generated;const column = _mapping$generated.column,line = _mapping$generated.line;const
  name = mapping.name,original = mapping.original;

  if (original == null) {
    return [line, column];
  }

  if (typeof name !== 'string') {
    return [line, column, original.line, original.column];
  }

  return [line, column, original.line, original.column, name];
}

function addMappingsForFile(generator, mappings, module, carryOver) {
  generator.startFile(module.path, module.source);

  const columnOffset = module.code.indexOf('{') + 1;
  for (let i = 0, n = mappings.length; i < n; ++i) {
    addMapping(generator, mappings[i], carryOver, columnOffset);
  }

  generator.endFile();
}

function addMapping(generator, mapping, carryOver, columnOffset) {
  const n = mapping.length;
  const line = mapping[0] + carryOver;
  // lines start at 1, columns start at 0
  const column = mapping[0] === 1 ? mapping[1] + columnOffset : mapping[1];
  if (n === 2) {
    generator.addSimpleMapping(line, column);
  } else if (n === 4) {
    // $FlowIssue #15579526
    generator.addSourceMapping(line, column, mapping[2], mapping[3]);
  } else if (n === 5) {
    generator.addNamedSourceMapping(
    line,
    column,
    // $FlowIssue #15579526
    mapping[2],
    // $FlowIssue #15579526
    mapping[3],
    // $FlowIssue #15579526
    mapping[4]);

  } else {
    throw new Error(`Invalid mapping: [${mapping.join(', ')}]`);
  }
}

function countLines(string) {
  return string.split('\n').length;
}

function createIndexMap(
file,
sections)
{
  return {
    version: 3,
    file,
    sections };

}

module.exports = {
  createIndexMap,
  fromRawMappings,
  toBabelSegments,
  toSegmentTuple };