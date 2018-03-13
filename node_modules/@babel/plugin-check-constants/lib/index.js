"use strict";

exports.__esModule = true;
exports.default = _default;

var _core = require("@babel/core");

function _default() {
  return {
    visitor: {
      Scope: function Scope(_ref, state) {
        var scope = _ref.scope;

        for (var name in scope.bindings) {
          var binding = scope.bindings[name];
          if (binding.kind !== "const") continue;
          var _arr = binding.constantViolations;

          for (var _i = 0; _i < _arr.length; _i++) {
            var violation = _arr[_i];
            var readOnlyError = state.addHelper("readOnlyError");

            var throwNode = _core.types.callExpression(readOnlyError, [_core.types.stringLiteral(name)]);

            if (violation.isAssignmentExpression()) {
              violation.get("right").replaceWith(_core.types.sequenceExpression([throwNode, violation.get("right").node]));
            } else if (violation.isUpdateExpression()) {
              violation.replaceWith(_core.types.sequenceExpression([throwNode, violation.node]));
            } else if (violation.isForXStatement()) {
              violation.ensureBlock();
              violation.node.body.body.unshift(_core.types.expressionStatement(throwNode));
            }
          }
        }
      }
    }
  };
}