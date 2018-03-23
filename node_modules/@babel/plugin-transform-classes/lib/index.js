"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _loose = _interopRequireDefault(require("./loose"));

var _vanilla = _interopRequireDefault(require("./vanilla"));

var _helperAnnotateAsPure = _interopRequireDefault(require("@babel/helper-annotate-as-pure"));

var _helperFunctionName = _interopRequireDefault(require("@babel/helper-function-name"));

var _helperSplitExportDeclaration = _interopRequireDefault(require("@babel/helper-split-export-declaration"));

var _core = require("@babel/core");

var _globals = _interopRequireDefault(require("globals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getBuiltinClasses = function getBuiltinClasses(category) {
  return Object.keys(_globals.default[category]).filter(function (name) {
    return /^[A-Z]/.test(name);
  });
};

var builtinClasses = new Set(getBuiltinClasses("builtin").concat(getBuiltinClasses("browser")));

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  api.assertVersion(7);
  var loose = options.loose;
  var Constructor = loose ? _loose.default : _vanilla.default;
  var VISITED = Symbol();
  return {
    visitor: {
      ExportDefaultDeclaration: function ExportDefaultDeclaration(path) {
        if (!path.get("declaration").isClassDeclaration()) return;
        (0, _helperSplitExportDeclaration.default)(path);
      },
      ClassDeclaration: function ClassDeclaration(path) {
        var node = path.node;
        var ref = node.id || path.scope.generateUidIdentifier("class");
        path.replaceWith(_core.types.variableDeclaration("let", [_core.types.variableDeclarator(ref, _core.types.toExpression(node))]));
      },
      ClassExpression: function ClassExpression(path, state) {
        var node = path.node;
        if (node[VISITED]) return;
        var inferred = (0, _helperFunctionName.default)(path);

        if (inferred && inferred !== node) {
          path.replaceWith(inferred);
          return;
        }

        node[VISITED] = true;
        path.replaceWith(new Constructor(path, state.file, builtinClasses).run());

        if (path.isCallExpression()) {
          (0, _helperAnnotateAsPure.default)(path);

          if (path.get("callee").isArrowFunctionExpression()) {
            path.get("callee").arrowFunctionToExpression();
          }
        }
      }
    }
  };
});

exports.default = _default;