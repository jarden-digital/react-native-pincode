"use strict";

exports.__esModule = true;
exports.findRelativeConfig = findRelativeConfig;
exports.loadConfig = loadConfig;
exports.resolvePlugin = resolvePlugin;
exports.resolvePreset = resolvePreset;
exports.loadPlugin = loadPlugin;
exports.loadPreset = loadPreset;

function findRelativeConfig(filepath, envName) {
  return {
    config: null,
    ignore: null
  };
}

function loadConfig(name, dirname) {
  throw new Error("Cannot load " + name + " relative to " + dirname + " in a browser");
}

function resolvePlugin(name, dirname) {
  return null;
}

function resolvePreset(name, dirname) {
  return null;
}

function loadPlugin(name, dirname) {
  throw new Error("Cannot load plugin " + name + " relative to " + dirname + " in a browser");
}

function loadPreset(name, dirname) {
  throw new Error("Cannot load preset " + name + " relative to " + dirname + " in a browser");
}