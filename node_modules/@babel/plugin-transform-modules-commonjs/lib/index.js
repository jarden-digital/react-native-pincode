"use strict";

exports.__esModule = true;
exports.default = _default;

var _helperModuleTransforms = require("@babel/helper-module-transforms");

var _helperSimpleAccess = _interopRequireDefault(require("@babel/helper-simple-access"));

var _core = require("@babel/core");

var _templateObject = _taggedTemplateLiteralLoose(["\n    (function(){\n      throw new Error(\"The CommonJS '\" + \"", "\" + \"' variable is not available in ES6 modules.\");\n    })()\n  "], ["\n    (function(){\n      throw new Error(\"The CommonJS '\" + \"", "\" + \"' variable is not available in ES6 modules.\");\n    })()\n  "]),
    _templateObject2 = _taggedTemplateLiteralLoose(["\n                  function ", "() {\n                    const data = ", ";\n                    ", " = function(){ return data; };\n                    return data;\n                  }\n                "], ["\n                  function ", "() {\n                    const data = ", ";\n                    ", " = function(){ return data; };\n                    return data;\n                  }\n                "]),
    _templateObject3 = _taggedTemplateLiteralLoose(["\n                  var ", " = ", ";\n                "], ["\n                  var ", " = ", ";\n                "]);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

function _default(api, options) {
  var loose = options.loose,
      allowTopLevelThis = options.allowTopLevelThis,
      strict = options.strict,
      strictMode = options.strictMode,
      noInterop = options.noInterop,
      _options$lazy = options.lazy,
      lazy = _options$lazy === void 0 ? false : _options$lazy,
      _options$allowCommonJ = options.allowCommonJSExports,
      allowCommonJSExports = _options$allowCommonJ === void 0 ? true : _options$allowCommonJ;

  if (typeof lazy !== "boolean" && typeof lazy !== "function" && (!Array.isArray(lazy) || !lazy.every(function (item) {
    return typeof item === "string";
  }))) {
    throw new Error(".lazy must be a boolean, array of strings, or a function");
  }

  var getAssertion = function getAssertion(localName) {
    return _core.template.expression.ast(_templateObject, localName);
  };

  var moduleExportsVisitor = {
    ReferencedIdentifier: function ReferencedIdentifier(path) {
      var localName = path.node.name;
      if (localName !== "module" && localName !== "exports") return;
      var localBinding = path.scope.getBinding(localName);
      var rootBinding = this.scope.getBinding(localName);

      if (rootBinding !== localBinding || path.parentPath.isObjectProperty({
        value: path.node
      }) && path.parentPath.parentPath.isObjectPattern() || path.parentPath.isAssignmentExpression({
        left: path.node
      }) || path.isAssignmentExpression({
        left: path.node
      })) {
        return;
      }

      path.replaceWith(getAssertion(localName));
    },
    AssignmentExpression: function AssignmentExpression(path) {
      var _this = this;

      var left = path.get("left");

      if (left.isIdentifier()) {
        var localName = path.node.name;
        if (localName !== "module" && localName !== "exports") return;
        var localBinding = path.scope.getBinding(localName);
        var rootBinding = this.scope.getBinding(localName);
        if (rootBinding !== localBinding) return;
        var right = path.get("right");
        right.replaceWith(_core.types.sequenceExpression([right.node, getAssertion(localName)]));
      } else if (left.isPattern()) {
        var ids = left.getOuterBindingIdentifiers();
        var _localName = Object.keys(ids).filter(function (localName) {
          if (localName !== "module" && localName !== "exports") return false;
          return _this.scope.getBinding(localName) === path.scope.getBinding(localName);
        })[0];

        if (_localName) {
          var _right = path.get("right");

          _right.replaceWith(_core.types.sequenceExpression([_right.node, getAssertion(_localName)]));
        }
      }
    }
  };
  return {
    visitor: {
      Program: {
        exit: function exit(path) {
          if (!(0, _helperModuleTransforms.isModule)(path, true)) return;
          path.scope.rename("exports");
          path.scope.rename("module");
          path.scope.rename("require");
          path.scope.rename("__filename");
          path.scope.rename("__dirname");

          if (!allowCommonJSExports) {
            (0, _helperSimpleAccess.default)(path, new Set(["module", "exports"]));
            path.traverse(moduleExportsVisitor, {
              scope: path.scope
            });
          }

          var moduleName = this.getModuleName();
          if (moduleName) moduleName = _core.types.stringLiteral(moduleName);

          var _rewriteModuleStateme = (0, _helperModuleTransforms.rewriteModuleStatementsAndPrepareHeader)(path, {
            exportName: "exports",
            loose: loose,
            strict: strict,
            strictMode: strictMode,
            allowTopLevelThis: allowTopLevelThis,
            noInterop: noInterop,
            lazy: lazy
          }),
              meta = _rewriteModuleStateme.meta,
              headers = _rewriteModuleStateme.headers;

          for (var _iterator = meta.source, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
            var _ref2;

            if (_isArray) {
              if (_i >= _iterator.length) break;
              _ref2 = _iterator[_i++];
            } else {
              _i = _iterator.next();
              if (_i.done) break;
              _ref2 = _i.value;
            }

            var _ref3 = _ref2;
            var _source = _ref3[0];
            var _metadata = _ref3[1];

            var loadExpr = _core.types.callExpression(_core.types.identifier("require"), [_core.types.stringLiteral(_source)]);

            var header = void 0;

            if ((0, _helperModuleTransforms.isSideEffectImport)(_metadata)) {
              if (_metadata.lazy) throw new Error("Assertion failure");
              header = _core.types.expressionStatement(loadExpr);
            } else {
              var init = (0, _helperModuleTransforms.wrapInterop)(path, loadExpr, _metadata.interop) || loadExpr;

              if (_metadata.lazy) {
                header = _core.template.ast(_templateObject2, _metadata.name, init, _metadata.name);
              } else {
                header = _core.template.ast(_templateObject3, _metadata.name, init);
              }
            }

            header.loc = _metadata.loc;
            headers.push(header);
            headers.push.apply(headers, (0, _helperModuleTransforms.buildNamespaceInitStatements)(meta, _metadata, loose));
          }

          (0, _helperModuleTransforms.ensureStatementsHoisted)(headers);
          path.unshiftContainer("body", headers);
        }
      }
    }
  };
}