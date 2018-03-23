"use strict";

exports.__esModule = true;
exports.Plugin = Plugin;
exports.types = exports.DEFAULT_EXTENSIONS = exports.createConfigItem = exports.OptionManager = exports.loadOptions = exports.loadPartialConfig = exports.getEnv = exports.version = exports.resolvePreset = exports.resolvePlugin = exports.parse = exports.transformFromAstSync = exports.transformFromAst = exports.transformFileSync = exports.transformFile = exports.transformSync = exports.transform = exports.template = exports.traverse = exports.buildExternalHelpers = exports.File = void 0;

var _file = _interopRequireDefault(require("./transformation/file/file"));

exports.File = _file.default;

var _buildExternalHelpers = _interopRequireDefault(require("./tools/build-external-helpers"));

exports.buildExternalHelpers = _buildExternalHelpers.default;

var _files = require("./config/files");

exports.resolvePlugin = _files.resolvePlugin;
exports.resolvePreset = _files.resolvePreset;

var _package = require("../package.json");

exports.version = _package.version;

var _environment = require("./config/helpers/environment");

exports.getEnv = _environment.getEnv;

var _types = _interopRequireWildcard(require("@babel/types"));

exports.types = _types;

var _traverse = _interopRequireDefault(require("@babel/traverse"));

exports.traverse = _traverse.default;

var _template = _interopRequireDefault(require("@babel/template"));

exports.template = _template.default;

var _config = require("./config");

exports.loadPartialConfig = _config.loadPartialConfig;
exports.loadOptions = _config.loadOptions;
exports.OptionManager = _config.OptionManager;

var _item = require("./config/item");

exports.createConfigItem = _item.createConfigItem;

var _transform = _interopRequireDefault(require("./transform"));

exports.transform = _transform.default;

var _transformSync = _interopRequireDefault(require("./transform-sync"));

exports.transformSync = _transformSync.default;

var _transformFile = _interopRequireDefault(require("./transform-file"));

exports.transformFile = _transformFile.default;

var _transformFileSync = _interopRequireDefault(require("./transform-file-sync"));

exports.transformFileSync = _transformFileSync.default;

var _transformAst = _interopRequireDefault(require("./transform-ast"));

exports.transformFromAst = _transformAst.default;

var _transformAstSync = _interopRequireDefault(require("./transform-ast-sync"));

exports.transformFromAstSync = _transformAstSync.default;

var _parse = _interopRequireDefault(require("./parse"));

exports.parse = _parse.default;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function Plugin(alias) {
  throw new Error("The (" + alias + ") Babel 5 plugin is being run with an unsupported Babel version.");
}

var DEFAULT_EXTENSIONS = Object.freeze([".js", ".jsx", ".es6", ".es", ".mjs"]);
exports.DEFAULT_EXTENSIONS = DEFAULT_EXTENSIONS;