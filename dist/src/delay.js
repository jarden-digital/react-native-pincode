"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.default = delay;
