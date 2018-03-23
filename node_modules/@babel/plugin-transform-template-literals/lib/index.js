"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _helperAnnotateAsPure = _interopRequireDefault(require("@babel/helper-annotate-as-pure"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)(function (api, options) {
  api.assertVersion(7);
  var loose = options.loose;
  var helperName = "taggedTemplateLiteral";
  if (loose) helperName += "Loose";

  function buildConcatCallExressions(items) {
    var avail = true;
    return items.reduce(function (left, right) {
      var canBeInserted = _core.types.isLiteral(right);

      if (!canBeInserted && avail) {
        canBeInserted = true;
        avail = false;
      }

      if (canBeInserted && _core.types.isCallExpression(left)) {
        left.arguments.push(right);
        return left;
      }

      return _core.types.callExpression(_core.types.memberExpression(left, _core.types.identifier("concat")), [right]);
    });
  }

  return {
    pre: function pre() {
      this.templates = new Map();
    },
    visitor: {
      TaggedTemplateExpression: function TaggedTemplateExpression(path) {
        var node = path.node;
        var quasi = node.quasi;
        var strings = [];
        var raws = [];
        var isStringsRawEqual = true;
        var _arr = quasi.quasis;

        for (var _i = 0; _i < _arr.length; _i++) {
          var elem = _arr[_i];
          var _elem$value = elem.value,
              raw = _elem$value.raw,
              cooked = _elem$value.cooked;
          var value = cooked == null ? path.scope.buildUndefinedNode() : _core.types.stringLiteral(cooked);
          strings.push(value);
          raws.push(_core.types.stringLiteral(raw));

          if (raw !== cooked) {
            isStringsRawEqual = false;
          }
        }

        var rawParts = raws.map(function (s) {
          return s.value;
        }).join(",");
        var name = helperName + "_" + raws.length + "_" + rawParts;
        var templateObject = this.templates.get(name);

        if (templateObject) {
          templateObject = _core.types.cloneNode(templateObject);
        } else {
          var programPath = path.find(function (p) {
            return p.isProgram();
          });
          templateObject = programPath.scope.generateUidIdentifier("templateObject");
          this.templates.set(name, templateObject);
          var helperId = this.addHelper(helperName);
          var callExpressionInput = [];
          callExpressionInput.push(_core.types.arrayExpression(strings));

          if (!isStringsRawEqual) {
            callExpressionInput.push(_core.types.arrayExpression(raws));
          }

          var init = _core.types.callExpression(helperId, callExpressionInput);

          (0, _helperAnnotateAsPure.default)(init);
          init._compact = true;
          programPath.scope.push({
            id: templateObject,
            init: init,
            _blockHoist: 1.9
          });
        }

        path.replaceWith(_core.types.callExpression(node.tag, [_core.types.cloneNode(templateObject)].concat(quasi.expressions)));
      },
      TemplateLiteral: function TemplateLiteral(path) {
        var nodes = [];
        var expressions = path.get("expressions");
        var index = 0;
        var _arr2 = path.node.quasis;

        for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
          var elem = _arr2[_i2];

          if (elem.value.cooked) {
            nodes.push(_core.types.stringLiteral(elem.value.cooked));
          }

          if (index < expressions.length) {
            var expr = expressions[index++];
            var node = expr.node;

            if (!_core.types.isStringLiteral(node, {
              value: ""
            })) {
              nodes.push(node);
            }
          }
        }

        var considerSecondNode = !loose || !_core.types.isStringLiteral(nodes[1]);

        if (!_core.types.isStringLiteral(nodes[0]) && considerSecondNode) {
          nodes.unshift(_core.types.stringLiteral(""));
        }

        var root = nodes[0];

        if (loose) {
          for (var i = 1; i < nodes.length; i++) {
            root = _core.types.binaryExpression("+", root, nodes[i]);
          }
        } else if (nodes.length > 1) {
          root = buildConcatCallExressions(nodes);
        }

        path.replaceWith(root);
      }
    }
  };
});

exports.default = _default;