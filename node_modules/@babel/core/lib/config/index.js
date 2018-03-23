"use strict";

exports.__esModule = true;
exports.loadOptions = loadOptions;
exports.OptionManager = exports.loadPartialConfig = void 0;

var _full = _interopRequireDefault(require("./full"));

exports.default = _full.default;

var _partial = require("./partial");

exports.loadPartialConfig = _partial.loadPartialConfig;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadOptions(opts) {
  var config = (0, _full.default)(opts);
  return config ? config.options : null;
}

var OptionManager = function () {
  function OptionManager() {}

  var _proto = OptionManager.prototype;

  _proto.init = function init(opts) {
    return loadOptions(opts);
  };

  return OptionManager;
}();

exports.OptionManager = OptionManager;