"use strict";

exports.__esModule = true;
exports.default = simplifyAccess;

var t = _interopRequireWildcard(require("@babel/types"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function simplifyAccess(path, bindingNames) {
  path.traverse(simpleAssignmentVisitor, {
    scope: path.scope,
    bindingNames: bindingNames,
    seen: new WeakSet()
  });
}

var simpleAssignmentVisitor = {
  UpdateExpression: {
    exit: function exit(path) {
      var scope = this.scope,
          bindingNames = this.bindingNames;
      var arg = path.get("argument");
      if (!arg.isIdentifier()) return;
      var localName = arg.node.name;
      if (!bindingNames.has(localName)) return;

      if (scope.getBinding(localName) !== path.scope.getBinding(localName)) {
        return;
      }

      if (path.node.prefix || path.parentPath.isExpressionStatement() && !path.isCompletionRecord()) {
        var operator = path.node.operator == "++" ? "+=" : "-=";
        path.replaceWith(t.assignmentExpression(operator, arg.node, t.numericLiteral(1)));
      } else {
        var varName = path.scope.generateDeclaredUidIdentifier("old").name;
        var binary = t.binaryExpression(path.node.operator.slice(0, 1), t.identifier(varName), t.numericLiteral(1));
        path.replaceWith(t.sequenceExpression([t.assignmentExpression("=", t.identifier(varName), arg.node), t.assignmentExpression("=", t.cloneNode(arg.node), binary), t.identifier(varName)]));
      }
    }
  },
  AssignmentExpression: {
    exit: function exit(path) {
      var scope = this.scope,
          seen = this.seen,
          bindingNames = this.bindingNames;
      if (path.node.operator === "=") return;
      if (seen.has(path.node)) return;
      seen.add(path.node);
      var left = path.get("left");
      if (!left.isIdentifier()) return;
      var localName = left.node.name;
      if (!bindingNames.has(localName)) return;

      if (scope.getBinding(localName) !== path.scope.getBinding(localName)) {
        return;
      }

      path.node.right = t.binaryExpression(path.node.operator.slice(0, -1), t.cloneNode(path.node.left), path.node.right);
      path.node.operator = "=";
    }
  }
};