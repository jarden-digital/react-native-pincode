"use strict";

exports.__esModule = true;
exports.default = _default;

var _core = require("@babel/core");

function _default() {
  return {
    visitor: {
      ObjectMethod: function ObjectMethod(path) {
        var node = path.node;

        if (node.kind === "method") {
          var func = _core.types.functionExpression(null, node.params, node.body, node.generator, node.async);

          func.returnType = node.returnType;
          path.replaceWith(_core.types.objectProperty(node.key, func, node.computed));
        }
      },
      ObjectProperty: function ObjectProperty(_ref) {
        var node = _ref.node;

        if (node.shorthand) {
          node.shorthand = false;
        }
      }
    }
  };
}