"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _core = require("@babel/core");

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);
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
});

exports.default = _default;