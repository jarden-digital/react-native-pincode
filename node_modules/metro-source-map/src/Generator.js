/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

const B64Builder = require('./B64Builder');



/**
                                             * Generates a source map from raw mappings.
                                             *
                                             * Raw mappings are a set of 2, 4, or five elements:
                                             *
                                             * - line and column number in the generated source
                                             * - line and column number in the original source
                                             * - symbol name in the original source
                                             *
                                             * Mappings have to be passed in the order appearance in the generated source.
                                             */
class Generator {














  constructor() {
    this.builder = new B64Builder();
    this.last = {
      generatedColumn: 0,
      generatedLine: 1, // lines are passed in 1-indexed
      name: 0,
      source: 0,
      sourceColumn: 0,
      sourceLine: 1 };

    this.names = new IndexedSet();
    this.source = -1;
    this.sources = [];
    this.sourcesContent = [];
  }

  /**
     * Mark the beginning of a new source file.
     */
  startFile(file, code) {
    this.source = this.sources.push(file) - 1;
    this.sourcesContent.push(code);
  }

  /**
     * Mark the end of the current source file
     */
  endFile() {
    this.source = -1;
  }

  /**
     * Adds a mapping for generated code without a corresponding source location.
     */
  addSimpleMapping(generatedLine, generatedColumn) {
    const last = this.last;
    if (
    this.source === -1 ||
    generatedLine === last.generatedLine &&
    generatedColumn < last.generatedColumn ||
    generatedLine < last.generatedLine)
    {
      const msg =
      this.source === -1 ?
      'Cannot add mapping before starting a file with `addFile()`' :
      'Mapping is for a position preceding an earlier mapping';
      throw new Error(msg);
    }

    if (generatedLine > last.generatedLine) {
      this.builder.markLines(generatedLine - last.generatedLine);
      last.generatedLine = generatedLine;
      last.generatedColumn = 0;
    }

    this.builder.startSegment(generatedColumn - last.generatedColumn);
    last.generatedColumn = generatedColumn;
  }

  /**
     * Adds a mapping for generated code with a corresponding source location.
     */
  addSourceMapping(
  generatedLine,
  generatedColumn,
  sourceLine,
  sourceColumn)
  {
    this.addSimpleMapping(generatedLine, generatedColumn);

    const last = this.last;
    this.builder.
    append(this.source - last.source).
    append(sourceLine - last.sourceLine).
    append(sourceColumn - last.sourceColumn);

    last.source = this.source;
    last.sourceColumn = sourceColumn;
    last.sourceLine = sourceLine;
  }

  /**
     * Adds a mapping for code with a corresponding source location + symbol name.
     */
  addNamedSourceMapping(
  generatedLine,
  generatedColumn,
  sourceLine,
  sourceColumn,
  name)
  {
    this.addSourceMapping(
    generatedLine,
    generatedColumn,
    sourceLine,
    sourceColumn);


    const last = this.last;
    const nameIndex = this.names.indexFor(name);
    this.builder.append(nameIndex - last.name);
    last.name = nameIndex;
  }

  /**
     * Return the source map as object.
     */
  toMap(file, options) {
    let content;

    if (options && options.excludeSource) {
      content = {};
    } else {
      content = { sourcesContent: this.sourcesContent.slice() };
    }

    return _extends({
      version: 3,
      file,
      sources: this.sources.slice() },
    content, {
      names: this.names.items(),
      mappings: this.builder.toString() });

  }

  /**
     * Return the source map as string.
     *
     * This is ~2.5x faster than calling `JSON.stringify(generator.toMap())`
     */
  toString(file, options) {
    let content;

    if (options && options.excludeSource) {
      content = '';
    } else {
      content = `"sourcesContent":${JSON.stringify(this.sourcesContent)},`;
    }

    return (
      '{' +
      '"version":3,' + (
      file ? `"file":${JSON.stringify(file)},` : '') +
      `"sources":${JSON.stringify(this.sources)},` +
      content +
      `"names":${JSON.stringify(this.names.items())},` +
      `"mappings":"${this.builder.toString()}"` +
      '}');

  }}


class IndexedSet {



  constructor() {
    this.map = new Map();
    this.nextIndex = 0;
  }

  indexFor(x) {
    let index = this.map.get(x);
    if (index == null) {
      index = this.nextIndex++;
      this.map.set(x, index);
    }
    return index;
  }

  items() {
    return Array.from(this.map.keys());
  }}


module.exports = Generator;