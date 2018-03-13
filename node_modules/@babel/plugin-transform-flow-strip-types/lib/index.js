"use strict";

exports.__esModule = true;
exports.default = _default;

var _pluginSyntaxFlow = _interopRequireDefault(require("@babel/plugin-syntax-flow"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  var FLOW_DIRECTIVE = "@flow";
  var skipStrip = false;
  return {
    inherits: _pluginSyntaxFlow.default,
    visitor: {
      Program: function Program(path, _ref) {
        var comments = _ref.file.ast.comments,
            opts = _ref.opts;
        skipStrip = false;
        var directiveFound = false;
        var _arr = comments;

        for (var _i = 0; _i < _arr.length; _i++) {
          var comment = _arr[_i];

          if (comment.value.indexOf(FLOW_DIRECTIVE) >= 0) {
            directiveFound = true;
            comment.value = comment.value.replace(FLOW_DIRECTIVE, "");
            if (!comment.value.replace(/\*/g, "").trim()) comment.ignore = true;
          }
        }

        if (!directiveFound && opts.requireDirective) {
          skipStrip = true;
        }
      },
      ImportDeclaration: function ImportDeclaration(path) {
        if (skipStrip) return;
        if (!path.node.specifiers.length) return;
        var typeCount = 0;
        path.node.specifiers.forEach(function (_ref2) {
          var importKind = _ref2.importKind;

          if (importKind === "type" || importKind === "typeof") {
            typeCount++;
          }
        });

        if (typeCount === path.node.specifiers.length) {
          path.remove();
        }
      },
      Flow: function Flow(path) {
        if (skipStrip) {
          throw path.buildCodeFrameError("A @flow directive is required when using Flow annotations with " + "the `requireDirective` option.");
        }

        path.remove();
      },
      ClassProperty: function ClassProperty(path) {
        if (skipStrip) return;
        path.node.variance = null;
        path.node.typeAnnotation = null;
        if (!path.node.value) path.remove();
      },
      Class: function Class(path) {
        if (skipStrip) return;
        path.node.implements = null;
        path.get("body.body").forEach(function (child) {
          if (child.isClassProperty()) {
            child.node.typeAnnotation = null;
            if (!child.node.value) child.remove();
          }
        });
      },
      AssignmentPattern: function AssignmentPattern(_ref3) {
        var node = _ref3.node;
        if (skipStrip) return;
        node.left.optional = false;
      },
      Function: function Function(_ref4) {
        var node = _ref4.node;
        if (skipStrip) return;

        for (var i = 0; i < node.params.length; i++) {
          var param = node.params[i];
          param.optional = false;

          if (param.type === "AssignmentPattern") {
            param.left.optional = false;
          }
        }

        node.predicate = null;
      },
      TypeCastExpression: function TypeCastExpression(path) {
        if (skipStrip) return;
        var node = path.node;

        do {
          node = node.expression;
        } while (_core.types.isTypeCastExpression(node));

        path.replaceWith(node);
      }
    }
  };
}