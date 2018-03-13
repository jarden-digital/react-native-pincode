/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _require =

require('../../babel-bridge');const t = _require.babelTypes;var _require2 =
require('../../babel-bridge');const transformFromAstSync = _require2.transformFromAstSync;



const Conditional = {
  exit(path) {
    const node = path.node;
    const test = node.test;
    if (t.isLiteral(test)) {
      if (test.value || node.alternate) {
        path.replaceWith(test.value ? node.consequent : node.alternate);
      } else if (!test.value) {
        path.remove();
      }
    }
  } };


const plugin = {
  visitor: {
    BinaryExpression: {
      exit(path) {
        const node = path.node;
        if (t.isLiteral(node.left) && t.isLiteral(node.right)) {
          const result = path.evaluate();
          if (result.confident) {
            path.replaceWith(t.valueToNode(result.value));
          }
        }
      } },

    ConditionalExpression: Conditional,
    IfStatement: Conditional,
    LogicalExpression: {
      exit(path) {
        const node = path.node;
        const left = node.left;
        if (t.isLiteral(left)) {
          const value = t.isNullLiteral(left) ? null : left.value;
          if (node.operator === '||') {
            path.replaceWith(value ? left : node.right);
          } else {
            path.replaceWith(value ? node.right : left);
          }
        }
      } },

    UnaryExpression: {
      exit(path) {
        const node = path.node;
        if (node.operator === '!' && t.isLiteral(node.argument)) {
          path.replaceWith(t.valueToNode(!node.argument.value));
        }
      } } } };




function constantFolding(filename, transformResult) {
  return transformFromAstSync(transformResult.ast, transformResult.code, {
    filename,
    plugins: [plugin],
    inputSourceMap: transformResult.map || undefined, // may not be null
    sourceMaps: true,
    sourceFileName: filename,
    babelrc: false,
    compact: true,
    retainLines: true });

}

constantFolding.plugin = plugin;
module.exports = constantFolding;