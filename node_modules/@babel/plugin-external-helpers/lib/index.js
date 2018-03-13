"use strict";

exports.__esModule = true;
exports.default = _default;

var _core = require("@babel/core");

function _default() {
  return {
    pre: function pre(file) {
      file.set("helpersNamespace", _core.types.identifier("babelHelpers"));
    }
  };
}