"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperReplaceSupers = _interopRequireDefault(require("@babel/helper-replace-supers"));

var _helperOptimiseCallExpression = _interopRequireDefault(require("@babel/helper-optimise-call-expression"));

var defineMap = _interopRequireWildcard(require("@babel/helper-define-map"));

var _core = require("@babel/core");

var _templateObject = _taggedTemplateLiteralLoose(["\n        (function () {\n          super(...arguments);\n        })\n      "]);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { if (!raw) { raw = strings.slice(0); } strings.raw = raw; return strings; }

var noMethodVisitor = {
  "FunctionExpression|FunctionDeclaration": function FunctionExpressionFunctionDeclaration(path) {
    path.skip();
  },
  Method: function Method(path) {
    path.skip();
  }
};

var verifyConstructorVisitor = _core.traverse.visitors.merge([noMethodVisitor, {
  CallExpression: {
    exit: function exit(path) {
      if (path.get("callee").isSuper()) {
        this.hasBareSuper = true;

        if (!this.isDerived) {
          throw path.buildCodeFrameError("super() is only allowed in a derived constructor");
        }
      }
    }
  },
  ThisExpression: function ThisExpression(path) {
    if (this.isDerived) {
      if (path.parentPath.isMemberExpression({
        object: path.node
      })) {
        return;
      }

      var assertion = _core.types.callExpression(this.file.addHelper("assertThisInitialized"), [path.node]);

      path.replaceWith(assertion);
      path.skip();
    }
  }
}]);

var findThisesVisitor = _core.traverse.visitors.merge([noMethodVisitor, {
  ThisExpression: function ThisExpression(path) {
    this.superThises.push(path);
  }
}]);

var ClassTransformer = function () {
  function ClassTransformer(path, file, builtinClasses) {
    this.parent = path.parent;
    this.scope = path.scope;
    this.node = path.node;
    this.path = path;
    this.file = file;
    this.clearDescriptors();
    this.instancePropBody = [];
    this.instancePropRefs = {};
    this.staticPropBody = [];
    this.body = [];
    this.bareSupers = [];
    this.pushedConstructor = false;
    this.pushedInherits = false;
    this.isLoose = false;
    this.superThises = [];
    this.classId = this.node.id;
    this.classRef = this.node.id ? _core.types.identifier(this.node.id.name) : this.scope.generateUidIdentifier("class");
    this.superName = this.node.superClass || _core.types.identifier("Function");
    this.isDerived = !!this.node.superClass;
    var name = this.superName.name;
    this.extendsNative = this.isDerived && builtinClasses.has(name) && !this.scope.hasBinding(name, true);
  }

  var _proto = ClassTransformer.prototype;

  _proto.run = function run() {
    var _this = this;

    var superName = this.superName;
    var file = this.file;
    var body = this.body;

    var constructorBody = this.constructorBody = _core.types.blockStatement([]);

    this.constructor = this.buildConstructor();
    var closureParams = [];
    var closureArgs = [];

    if (this.isDerived) {
      if (this.extendsNative) {
        closureArgs.push(_core.types.callExpression(this.file.addHelper("wrapNativeSuper"), [_core.types.cloneNode(superName)]));
      } else {
        closureArgs.push(_core.types.cloneNode(superName));
      }

      superName = this.scope.generateUidIdentifierBasedOnNode(superName);
      closureParams.push(superName);
      this.superName = _core.types.cloneNode(superName);
    }

    this.buildBody();

    if (!this.isLoose) {
      constructorBody.body.unshift(_core.types.expressionStatement(_core.types.callExpression(file.addHelper("classCallCheck"), [_core.types.thisExpression(), _core.types.cloneNode(this.classRef)])));
    }

    body = body.concat(this.staticPropBody.map(function (fn) {
      return fn(_core.types.cloneNode(_this.classRef));
    }));

    if (this.classId) {
      if (body.length === 1) return _core.types.toExpression(body[0]);
    }

    body.push(_core.types.returnStatement(_core.types.cloneNode(this.classRef)));

    var container = _core.types.arrowFunctionExpression(closureParams, _core.types.blockStatement(body));

    return _core.types.callExpression(container, closureArgs);
  };

  _proto.buildConstructor = function buildConstructor() {
    var func = _core.types.functionDeclaration(_core.types.cloneNode(this.classRef), [], this.constructorBody);

    _core.types.inherits(func, this.node);

    return func;
  };

  _proto.pushToMap = function pushToMap(node, enumerable, kind, scope) {
    if (kind === void 0) {
      kind = "value";
    }

    var mutatorMap;

    if (node.static) {
      this.hasStaticDescriptors = true;
      mutatorMap = this.staticMutatorMap;
    } else {
      this.hasInstanceDescriptors = true;
      mutatorMap = this.instanceMutatorMap;
    }

    var map = defineMap.push(mutatorMap, node, kind, this.file, scope);

    if (enumerable) {
      map.enumerable = _core.types.booleanLiteral(true);
    }

    return map;
  };

  _proto.constructorMeMaybe = function constructorMeMaybe() {
    var hasConstructor = false;
    var paths = this.path.get("body.body");
    var _arr = paths;

    for (var _i = 0; _i < _arr.length; _i++) {
      var path = _arr[_i];
      hasConstructor = path.equals("kind", "constructor");
      if (hasConstructor) break;
    }

    if (hasConstructor) return;
    var params, body;

    if (this.isDerived) {
      var _constructor = _core.template.expression.ast(_templateObject);

      params = _constructor.params;
      body = _constructor.body;
    } else {
      params = [];
      body = _core.types.blockStatement([]);
    }

    this.path.get("body").unshiftContainer("body", _core.types.classMethod("constructor", _core.types.identifier("constructor"), params, body));
  };

  _proto.buildBody = function buildBody() {
    this.constructorMeMaybe();
    this.pushBody();
    this.verifyConstructor();

    if (this.userConstructor) {
      var constructorBody = this.constructorBody;
      constructorBody.body = constructorBody.body.concat(this.userConstructor.body.body);

      _core.types.inherits(this.constructor, this.userConstructor);

      _core.types.inherits(constructorBody, this.userConstructor.body);
    }

    this.pushDescriptors();
  };

  _proto.pushBody = function pushBody() {
    var classBodyPaths = this.path.get("body.body");

    for (var _iterator = classBodyPaths, _isArray = Array.isArray(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i2 >= _iterator.length) break;
        _ref = _iterator[_i2++];
      } else {
        _i2 = _iterator.next();
        if (_i2.done) break;
        _ref = _i2.value;
      }

      var _path = _ref;
      var node = _path.node;

      if (_path.isClassProperty()) {
        throw _path.buildCodeFrameError("Missing class properties transform.");
      }

      if (node.decorators) {
        throw _path.buildCodeFrameError("Method has decorators, put the decorator plugin before the classes one.");
      }

      if (_core.types.isClassMethod(node)) {
        var isConstructor = node.kind === "constructor";

        if (isConstructor) {
          _path.traverse(verifyConstructorVisitor, this);
        }

        var replaceSupers = new _helperReplaceSupers.default({
          forceSuperMemoisation: isConstructor,
          methodPath: _path,
          methodNode: node,
          objectRef: this.classRef,
          superRef: this.superName,
          inConstructor: isConstructor,
          isStatic: node.static,
          isLoose: this.isLoose,
          scope: this.scope,
          file: this.file
        }, true);
        replaceSupers.replace();

        if (isConstructor) {
          this.pushConstructor(replaceSupers, node, _path);
        } else {
          this.pushMethod(node, _path);
        }
      }
    }
  };

  _proto.clearDescriptors = function clearDescriptors() {
    this.hasInstanceDescriptors = false;
    this.hasStaticDescriptors = false;
    this.instanceMutatorMap = {};
    this.staticMutatorMap = {};
  };

  _proto.pushDescriptors = function pushDescriptors() {
    this.pushInherits();
    var body = this.body;
    var instanceProps;
    var staticProps;

    if (this.hasInstanceDescriptors) {
      instanceProps = defineMap.toClassObject(this.instanceMutatorMap);
    }

    if (this.hasStaticDescriptors) {
      staticProps = defineMap.toClassObject(this.staticMutatorMap);
    }

    if (instanceProps || staticProps) {
      if (instanceProps) {
        instanceProps = defineMap.toComputedObjectFromClass(instanceProps);
      }

      if (staticProps) {
        staticProps = defineMap.toComputedObjectFromClass(staticProps);
      }

      var args = [_core.types.cloneNode(this.classRef), _core.types.nullLiteral(), _core.types.nullLiteral(), _core.types.nullLiteral(), _core.types.nullLiteral()];
      if (instanceProps) args[1] = instanceProps;
      if (staticProps) args[2] = staticProps;

      if (this.instanceInitializersId) {
        args[3] = this.instanceInitializersId;
        body.unshift(this.buildObjectAssignment(this.instanceInitializersId));
      }

      if (this.staticInitializersId) {
        args[4] = this.staticInitializersId;
        body.unshift(this.buildObjectAssignment(this.staticInitializersId));
      }

      var lastNonNullIndex = 0;

      for (var i = 0; i < args.length; i++) {
        if (!_core.types.isNullLiteral(args[i])) lastNonNullIndex = i;
      }

      args = args.slice(0, lastNonNullIndex + 1);
      body.push(_core.types.expressionStatement(_core.types.callExpression(this.file.addHelper("createClass"), args)));
    }

    this.clearDescriptors();
  };

  _proto.buildObjectAssignment = function buildObjectAssignment(id) {
    return _core.types.variableDeclaration("var", [_core.types.variableDeclarator(id, _core.types.objectExpression([]))]);
  };

  _proto.wrapSuperCall = function wrapSuperCall(bareSuper, superRef, thisRef, body) {
    var bareSuperNode = bareSuper.node;

    if (this.isLoose) {
      bareSuperNode.arguments.unshift(_core.types.thisExpression());

      if (bareSuperNode.arguments.length === 2 && _core.types.isSpreadElement(bareSuperNode.arguments[1]) && _core.types.isIdentifier(bareSuperNode.arguments[1].argument, {
        name: "arguments"
      })) {
        bareSuperNode.arguments[1] = bareSuperNode.arguments[1].argument;
        bareSuperNode.callee = _core.types.memberExpression(_core.types.cloneNode(superRef), _core.types.identifier("apply"));
      } else {
        bareSuperNode.callee = _core.types.memberExpression(_core.types.cloneNode(superRef), _core.types.identifier("call"));
      }
    } else {
      bareSuperNode = (0, _helperOptimiseCallExpression.default)(_core.types.logicalExpression("||", _core.types.memberExpression(_core.types.cloneNode(this.classRef), _core.types.identifier("__proto__")), _core.types.callExpression(_core.types.memberExpression(_core.types.identifier("Object"), _core.types.identifier("getPrototypeOf")), [_core.types.cloneNode(this.classRef)])), _core.types.thisExpression(), bareSuperNode.arguments);
    }

    var call;

    if (this.isLoose) {
      call = _core.types.logicalExpression("||", bareSuperNode, _core.types.thisExpression());
    } else {
      call = _core.types.callExpression(this.file.addHelper("possibleConstructorReturn"), [_core.types.thisExpression(), bareSuperNode]);
    }

    if (bareSuper.parentPath.isExpressionStatement() && bareSuper.parentPath.container === body.node.body && body.node.body.length - 1 === bareSuper.parentPath.key) {
      if (this.superThises.length) {
        call = _core.types.assignmentExpression("=", thisRef(), call);
      }

      bareSuper.parentPath.replaceWith(_core.types.returnStatement(call));
    } else {
      bareSuper.replaceWith(_core.types.assignmentExpression("=", thisRef(), call));
    }
  };

  _proto.verifyConstructor = function verifyConstructor() {
    var _this2 = this;

    if (!this.isDerived) return;
    var path = this.userConstructorPath;
    var body = path.get("body");
    path.traverse(findThisesVisitor, this);
    var guaranteedSuperBeforeFinish = !!this.bareSupers.length;

    var superRef = this.superName || _core.types.identifier("Function");

    var _thisRef = function thisRef() {
      var ref = path.scope.generateDeclaredUidIdentifier("this");

      _thisRef = function thisRef() {
        return _core.types.cloneNode(ref);
      };

      return ref;
    };

    for (var _iterator2 = this.bareSupers, _isArray2 = Array.isArray(_iterator2), _i3 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
      var _ref2;

      if (_isArray2) {
        if (_i3 >= _iterator2.length) break;
        _ref2 = _iterator2[_i3++];
      } else {
        _i3 = _iterator2.next();
        if (_i3.done) break;
        _ref2 = _i3.value;
      }

      var _bareSuper = _ref2;
      this.wrapSuperCall(_bareSuper, superRef, _thisRef, body);

      if (guaranteedSuperBeforeFinish) {
        _bareSuper.find(function (parentPath) {
          if (parentPath === path) {
            return true;
          }

          if (parentPath.isLoop() || parentPath.isConditional() || parentPath.isArrowFunctionExpression()) {
            guaranteedSuperBeforeFinish = false;
            return true;
          }
        });
      }
    }

    for (var _iterator3 = this.superThises, _isArray3 = Array.isArray(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
      var _ref3;

      if (_isArray3) {
        if (_i4 >= _iterator3.length) break;
        _ref3 = _iterator3[_i4++];
      } else {
        _i4 = _iterator3.next();
        if (_i4.done) break;
        _ref3 = _i4.value;
      }

      var _thisPath = _ref3;

      _thisPath.replaceWith(_thisRef());
    }

    var wrapReturn;

    if (this.isLoose) {
      wrapReturn = function wrapReturn(returnArg) {
        var thisExpr = _core.types.callExpression(_this2.file.addHelper("assertThisInitialized"), [_thisRef()]);

        return returnArg ? _core.types.logicalExpression("||", returnArg, thisExpr) : thisExpr;
      };
    } else {
      wrapReturn = function wrapReturn(returnArg) {
        return _core.types.callExpression(_this2.file.addHelper("possibleConstructorReturn"), [_thisRef()].concat(returnArg || []));
      };
    }

    var bodyPaths = body.get("body");

    if (!bodyPaths.length || !bodyPaths.pop().isReturnStatement()) {
      body.pushContainer("body", _core.types.returnStatement(guaranteedSuperBeforeFinish ? _thisRef() : wrapReturn()));
    }

    for (var _iterator4 = this.superReturns, _isArray4 = Array.isArray(_iterator4), _i5 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
      var _ref4;

      if (_isArray4) {
        if (_i5 >= _iterator4.length) break;
        _ref4 = _iterator4[_i5++];
      } else {
        _i5 = _iterator4.next();
        if (_i5.done) break;
        _ref4 = _i5.value;
      }

      var _returnPath = _ref4;

      _returnPath.get("argument").replaceWith(wrapReturn(_returnPath.node.argument));
    }
  };

  _proto.pushMethod = function pushMethod(node, path) {
    var scope = path ? path.scope : this.scope;

    if (node.kind === "method") {
      if (this._processMethod(node, scope)) return;
    }

    this.pushToMap(node, false, null, scope);
  };

  _proto._processMethod = function _processMethod() {
    return false;
  };

  _proto.pushConstructor = function pushConstructor(replaceSupers, method, path) {
    this.bareSupers = replaceSupers.bareSupers;
    this.superReturns = replaceSupers.returns;

    if (path.scope.hasOwnBinding(this.classRef.name)) {
      path.scope.rename(this.classRef.name);
    }

    var construct = this.constructor;
    this.userConstructorPath = path;
    this.userConstructor = method;
    this.hasConstructor = true;

    _core.types.inheritsComments(construct, method);

    construct.params = method.params;

    _core.types.inherits(construct.body, method.body);

    construct.body.directives = method.body.directives;

    this._pushConstructor();
  };

  _proto._pushConstructor = function _pushConstructor() {
    if (this.pushedConstructor) return;
    this.pushedConstructor = true;

    if (this.hasInstanceDescriptors || this.hasStaticDescriptors) {
      this.pushDescriptors();
    }

    this.body.push(this.constructor);
    this.pushInherits();
  };

  _proto.pushInherits = function pushInherits() {
    if (!this.isDerived || this.pushedInherits) return;
    this.pushedInherits = true;
    this.body.unshift(_core.types.expressionStatement(_core.types.callExpression(this.isLoose ? this.file.addHelper("inheritsLoose") : this.file.addHelper("inherits"), [_core.types.cloneNode(this.classRef), _core.types.cloneNode(this.superName)])));
  };

  return ClassTransformer;
}();

exports.default = ClassTransformer;