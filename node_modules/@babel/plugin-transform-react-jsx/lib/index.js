"use strict";

exports.__esModule = true;
exports.default = _default;

var _pluginSyntaxJsx = _interopRequireDefault(require("@babel/plugin-syntax-jsx"));

var _helperBuilderReactJsx = _interopRequireDefault(require("@babel/helper-builder-react-jsx"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(api, options) {
  var THROW_IF_NAMESPACE = options.throwIfNamespace === undefined ? true : !!options.throwIfNamespace;
  var PRAGMA_DEFAULT = options.pragma || "React.createElement";
  var PRAGMA_FRAG_DEFAULT = options.pragmaFrag || "React.Fragment";
  var JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
  var JSX_FRAG_ANNOTATION_REGEX = /\*?\s*@jsxFrag\s+([^\s]+)/;

  var createIdentifierParser = function createIdentifierParser(id) {
    return function () {
      return id.split(".").map(function (name) {
        return _core.types.identifier(name);
      }).reduce(function (object, property) {
        return _core.types.memberExpression(object, property);
      });
    };
  };

  var visitor = (0, _helperBuilderReactJsx.default)({
    pre: function pre(state) {
      var tagName = state.tagName;
      var args = state.args;

      if (_core.types.react.isCompatTag(tagName)) {
        args.push(_core.types.stringLiteral(tagName));
      } else {
        args.push(state.tagExpr);
      }
    },
    post: function post(state, pass) {
      state.callee = pass.get("jsxIdentifier")();
    },
    throwIfNamespace: THROW_IF_NAMESPACE
  });
  visitor.Program = {
    enter: function enter(path, state) {
      var file = state.file;
      var pragma = PRAGMA_DEFAULT;
      var pragmaFrag = PRAGMA_FRAG_DEFAULT;
      var pragmaSet = !!options.pragma;
      var pragmaFragSet = !!options.pragmaFrag;
      var _arr = file.ast.comments;

      for (var _i = 0; _i < _arr.length; _i++) {
        var comment = _arr[_i];
        var jsxMatches = JSX_ANNOTATION_REGEX.exec(comment.value);

        if (jsxMatches) {
          pragma = jsxMatches[1];
          pragmaSet = true;
        }

        var jsxFragMatches = JSX_FRAG_ANNOTATION_REGEX.exec(comment.value);

        if (jsxFragMatches) {
          pragmaFrag = jsxFragMatches[1];
          pragmaFragSet = true;
        }
      }

      state.set("jsxIdentifier", createIdentifierParser(pragma));
      state.set("jsxFragIdentifier", createIdentifierParser(pragmaFrag));
      state.set("usedFragment", false);
      state.set("pragmaSet", pragmaSet);
      state.set("pragmaFragSet", pragmaFragSet);
    },
    exit: function exit(path, state) {
      if (state.get("pragmaSet") && state.get("usedFragment") && !state.get("pragmaFragSet")) {
        throw new Error("transform-react-jsx: pragma has been set but " + "pragmafrag has not been set");
      }
    }
  };

  visitor.JSXAttribute = function (path) {
    if (_core.types.isJSXElement(path.node.value)) {
      path.node.value = _core.types.jsxExpressionContainer(path.node.value);
    }
  };

  return {
    inherits: _pluginSyntaxJsx.default,
    visitor: visitor
  };
}