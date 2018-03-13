/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

const os = require('os');var _require =

require('events');const EventEmitter = _require.EventEmitter;

const VERSION = require('../../package.json').version;






















const log_session = `${os.hostname()}-${Date.now()}`;
const eventEmitter = new EventEmitter();

function on(event, handler) {
  eventEmitter.on(event, handler);
}

function createEntry(data) {
  const logEntry = typeof data === 'string' ? { log_entry_label: data } : data;

  return _extends({},
  logEntry, {
    log_session,
    metro_bundler_version: VERSION });

}

function createActionStartEntry(data) {
  const logEntry = typeof data === 'string' ? { action_name: data } : data;const
  action_name = logEntry.action_name;

  return createEntry(_extends({},
  logEntry, {
    action_name,
    action_phase: 'start',
    log_entry_label: action_name,
    start_timestamp: process.hrtime() }));

}

function createActionEndEntry(logEntry) {const
  action_name = logEntry.action_name,action_phase = logEntry.action_phase,start_timestamp = logEntry.start_timestamp;

  if (action_phase !== 'start' || !Array.isArray(start_timestamp)) {
    throw new Error('Action has not started or has already ended');
  }

  const timeDelta = process.hrtime(start_timestamp);
  const duration_ms = Math.round((timeDelta[0] * 1e9 + timeDelta[1]) / 1e6);

  return createEntry(_extends({},
  logEntry, {
    action_name,
    action_phase: 'end',
    duration_ms,
    log_entry_label: action_name }));

}

function log(logEntry) {
  eventEmitter.emit('log', logEntry);
  return logEntry;
}

module.exports = {
  on,
  createEntry,
  createActionStartEntry,
  createActionEndEntry,
  log };