/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

const chalk = require('chalk');
const util = require('util');var _require =

require('metro-core');const Terminal = _require.Terminal;











/**
                                                           * A tagged union of all the actions that may happen and we may want to
                                                           * report to the tool user.
                                                           */



































































/**
                                                               * Code across the application takes a reporter as an option and calls the
                                                               * update whenever one of the ReportableEvent happens. Code does not directly
                                                               * write to the standard output, because a build would be:
                                                               *
                                                               *   1. ad-hoc, embedded into another tool, in which case we do not want to
                                                               *   pollute that tool's own output. The tool is free to present the
                                                               *   warnings/progress we generate any way they want, by specifing a custom
                                                               *   reporter.
                                                               *   2. run as a background process from another tool, in which case we want
                                                               *   to expose updates in a way that is easily machine-readable, for example
                                                               *   a JSON-stream. We don't want to pollute it with textual messages.
                                                               *
                                                               * We centralize terminal reporting into a single place because we want the
                                                               * output to be robust and consistent. The most common reporter is
                                                               * TerminalReporter, that should be the only place in the application should
                                                               * access the `terminal` module (nor the `console`).
                                                               */




/**
                                                                   * A standard way to log a warning to the terminal. This should not be called
                                                                   * from some arbitrary Metro Bundler logic, only from the reporters. Instead of
                                                                   * calling this, add a new type of ReportableEvent instead, and implement a
                                                                   * proper handler in the reporter(s).
                                                                   */
function logWarning(
terminal,
format)

{for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {args[_key - 2] = arguments[_key];}
  const str = util.format.apply(util, [format].concat(args));
  terminal.log('%s: %s', chalk.yellow('warning'), str);
}

/**
   * Similar to `logWarning`, but for messages that require the user to act.
   */
function logError(
terminal,
format)

{for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {args[_key2 - 2] = arguments[_key2];}
  const str = util.format.apply(util, [format].concat(args));
  terminal.log('%s: %s', chalk.red('error'), str);
}

/**
   * A reporter that does nothing. Errors and warnings will be swallowed, that
   * is generally not what you want.
   */
const nullReporter = { update() {} };

module.exports = {
  logWarning,
  logError,
  nullReporter };