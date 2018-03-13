"use strict";

exports.__esModule = true;
exports.default = _default;

var _core = require("@babel/core");

var TRACE_ID = "__source";
var FILE_NAME_VAR = "_jsxFileName";

function _default() {
  function makeTrace(fileNameIdentifier, lineNumber) {
    var fileLineLiteral = lineNumber != null ? _core.types.numericLiteral(lineNumber) : _core.types.nullLiteral();

    var fileNameProperty = _core.types.objectProperty(_core.types.identifier("fileName"), fileNameIdentifier);

    var lineNumberProperty = _core.types.objectProperty(_core.types.identifier("lineNumber"), fileLineLiteral);

    return _core.types.objectExpression([fileNameProperty, lineNumberProperty]);
  }

  var visitor = {
    JSXOpeningElement: function JSXOpeningElement(path, state) {
      var id = _core.types.jsxIdentifier(TRACE_ID);

      var location = path.container.openingElement.loc;

      if (!location) {
        return;
      }

      var attributes = path.container.openingElement.attributes;

      for (var i = 0; i < attributes.length; i++) {
        var name = attributes[i].name;

        if (name && name.name === TRACE_ID) {
          return;
        }
      }

      if (!state.fileNameIdentifier) {
        var fileName = state.filename || "";
        var fileNameIdentifier = path.scope.generateUidIdentifier(FILE_NAME_VAR);
        path.hub.file.scope.push({
          id: fileNameIdentifier,
          init: _core.types.stringLiteral(fileName)
        });
        state.fileNameIdentifier = fileNameIdentifier;
      }

      var trace = makeTrace(state.fileNameIdentifier, location.start.line);
      attributes.push(_core.types.jsxAttribute(id, _core.types.jsxExpressionContainer(trace)));
    }
  };
  return {
    visitor: visitor
  };
}