"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperFunctionName = _interopRequireDefault(require("@babel/helper-function-name"));

var _vanilla = _interopRequireDefault(require("./vanilla"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; subClass.__proto__ = superClass; }

var LooseClassTransformer = function (_VanillaTransformer) {
  _inheritsLoose(LooseClassTransformer, _VanillaTransformer);

  function LooseClassTransformer() {
    var _this;

    _this = _VanillaTransformer.apply(this, arguments) || this;
    _this._protoAlias = null;
    _this.isLoose = true;
    return _this;
  }

  var _proto = LooseClassTransformer.prototype;

  _proto._insertProtoAliasOnce = function _insertProtoAliasOnce() {
    if (!this._protoAlias) {
      this._protoAlias = this.scope.generateUidIdentifier("proto");

      var classProto = _core.types.memberExpression(this.classRef, _core.types.identifier("prototype"));

      var protoDeclaration = _core.types.variableDeclaration("var", [_core.types.variableDeclarator(this._protoAlias, classProto)]);

      this.body.push(protoDeclaration);
    }
  };

  _proto._processMethod = function _processMethod(node, scope) {
    if (!node.decorators) {
      var classRef = this.classRef;

      if (!node.static) {
        this._insertProtoAliasOnce();

        classRef = this._protoAlias;
      }

      var methodName = _core.types.memberExpression(_core.types.cloneNode(classRef), node.key, node.computed || _core.types.isLiteral(node.key));

      var func = _core.types.functionExpression(null, node.params, node.body, node.generator, node.async);

      func.returnType = node.returnType;

      var key = _core.types.toComputedKey(node, node.key);

      if (_core.types.isStringLiteral(key)) {
        func = (0, _helperFunctionName.default)({
          node: func,
          id: key,
          scope: scope
        });
      }

      var expr = _core.types.expressionStatement(_core.types.assignmentExpression("=", methodName, func));

      _core.types.inheritsComments(expr, node);

      this.body.push(expr);
      return true;
    }
  };

  return LooseClassTransformer;
}(_vanilla.default);

exports.default = LooseClassTransformer;