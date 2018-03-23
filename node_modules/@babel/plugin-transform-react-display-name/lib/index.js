"use strict";

exports.__esModule = true;
exports.default = void 0;

var _helperPluginUtils = require("@babel/helper-plugin-utils");

var _path = _interopRequireDefault(require("path"));

var _core = require("@babel/core");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _helperPluginUtils.declare)(function (api) {
  api.assertVersion(7);

  function addDisplayName(id, call) {
    var props = call.arguments[0].properties;
    var safe = true;

    for (var i = 0; i < props.length; i++) {
      var prop = props[i];

      var key = _core.types.toComputedKey(prop);

      if (_core.types.isLiteral(key, {
        value: "displayName"
      })) {
        safe = false;
        break;
      }
    }

    if (safe) {
      props.unshift(_core.types.objectProperty(_core.types.identifier("displayName"), _core.types.stringLiteral(id)));
    }
  }

  var isCreateClassCallExpression = _core.types.buildMatchMemberExpression("React.createClass");

  var isCreateClassAddon = function isCreateClassAddon(callee) {
    return callee.name === "createReactClass";
  };

  function isCreateClass(node) {
    if (!node || !_core.types.isCallExpression(node)) return false;

    if (!isCreateClassCallExpression(node.callee) && !isCreateClassAddon(node.callee)) {
      return false;
    }

    var args = node.arguments;
    if (args.length !== 1) return false;
    var first = args[0];
    if (!_core.types.isObjectExpression(first)) return false;
    return true;
  }

  return {
    visitor: {
      ExportDefaultDeclaration: function ExportDefaultDeclaration(_ref, state) {
        var node = _ref.node;

        if (isCreateClass(node.declaration)) {
          var filename = state.filename || "unknown";

          var displayName = _path.default.basename(filename, _path.default.extname(filename));

          if (displayName === "index") {
            displayName = _path.default.basename(_path.default.dirname(filename));
          }

          addDisplayName(displayName, node.declaration);
        }
      },
      CallExpression: function CallExpression(path) {
        var node = path.node;
        if (!isCreateClass(node)) return;
        var id;
        path.find(function (path) {
          if (path.isAssignmentExpression()) {
            id = path.node.left;
          } else if (path.isObjectProperty()) {
            id = path.node.key;
          } else if (path.isVariableDeclarator()) {
            id = path.node.id;
          } else if (path.isStatement()) {
            return true;
          }

          if (id) return true;
        });
        if (!id) return;

        if (_core.types.isMemberExpression(id)) {
          id = id.property;
        }

        if (_core.types.isIdentifier(id)) {
          addDisplayName(id.name, node);
        }
      }
    }
  };
});

exports.default = _default;