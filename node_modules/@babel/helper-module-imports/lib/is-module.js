"use strict";

exports.__esModule = true;
exports.default = isModule;

function isModule(path) {
  var sourceType = path.node.sourceType;

  if (sourceType !== "module" && sourceType !== "script") {
    throw path.buildCodeFrameError("Unknown sourceType \"" + sourceType + "\", cannot transform.");
  }

  return path.node.sourceType === "module";
}