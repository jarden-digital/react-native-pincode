"use strict";

exports.__esModule = true;
exports.default = transformSync;

var _config = _interopRequireDefault(require("./config"));

var _transformation = require("./transformation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformSync(code, opts) {
  var config = (0, _config.default)(opts);
  if (config === null) return null;
  return (0, _transformation.runSync)(config, code);
}