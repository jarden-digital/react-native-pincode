"use strict";

exports.__esModule = true;

var _configuration = require("./configuration");

Object.keys(_configuration).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = _configuration[key];
});

var _plugins = require("./plugins");

Object.keys(_plugins).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  exports[key] = _plugins[key];
});
({});