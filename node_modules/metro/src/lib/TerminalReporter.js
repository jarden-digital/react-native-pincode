/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};

const chalk = require('chalk');
const path = require('path');
const reporting = require('./reporting');
const throttle = require('lodash.throttle');var _require =



require('../node-haste/DependencyGraph/ResolutionRequest');const AmbiguousModuleResolutionError = _require.AmbiguousModuleResolutionError;var _require2 =
require('metro-core');const formatBanner = _require2.formatBanner;








const DEP_GRAPH_MESSAGE = 'Loading dependency graph';
const GLOBAL_CACHE_DISABLED_MESSAGE_FORMAT =
'The global cache is now disabled because %s';








const DARK_BLOCK_CHAR = '\u2593';
const LIGHT_BLOCK_CHAR = '\u2591';
const MAX_PROGRESS_BAR_CHAR_WIDTH = 16;












/**
                                         * We try to print useful information to the terminal for interactive builds.
                                         * This implements the `Reporter` interface from the './reporting' module.
                                         */
class TerminalReporter {
  /**
                         * The bundle builds for which we are actively maintaining the status on the
                         * terminal, ie. showing a progress bar. There can be several bundles being
                         * built at the same time.
                         */











  constructor(terminal) {
    this._dependencyGraphHasLoaded = false;
    this._activeBundles = new Map();
    this._scheduleUpdateBundleProgress = throttle(data => {
      this.update(_extends({}, data, { type: 'bundle_transform_progressed_throttled' }));
    }, 100);
    this.terminal = terminal;
  }

  /**
     * Construct a message that represents the progress of a
     * single bundle build, for example:
     *
     *     BUNDLE [ios, dev, minified] foo.js  ▓▓▓▓▓░░░░░░░░░░░ 36.6% (4790/7922)
     */
  _getBundleStatusMessage(_ref,






  phase)
  {var _ref$bundleDetails = _ref.bundleDetails;let entryFile = _ref$bundleDetails.entryFile,platform = _ref$bundleDetails.platform,dev = _ref$bundleDetails.dev,minify = _ref$bundleDetails.minify,bundleType = _ref$bundleDetails.bundleType,transformedFileCount = _ref.transformedFileCount,totalFileCount = _ref.totalFileCount,ratio = _ref.ratio;
    const localPath = path.relative('.', entryFile);
    const fileName = path.basename(localPath);
    const dirName = path.dirname(localPath);

    platform = platform ? platform + ', ' : '';
    const devOrProd = dev ? 'dev' : 'prod';
    const min = minify ? ', minified' : '';
    const progress = (100 * ratio).toFixed(1);
    const currentPhase =
    phase === 'done' ? ', done.' : phase === 'failed' ? ', failed.' : '';

    const filledBar = Math.floor(ratio * MAX_PROGRESS_BAR_CHAR_WIDTH);

    return (
      chalk.inverse.green.bold(` ${bundleType.toUpperCase()} `) +
      chalk.dim(` [${platform}${devOrProd}${min}] ${dirName}/`) +
      chalk.bold(fileName) +
      ' ' +
      chalk.green.bgGreen(DARK_BLOCK_CHAR.repeat(filledBar)) +
      chalk.bgWhite.white(
      LIGHT_BLOCK_CHAR.repeat(MAX_PROGRESS_BAR_CHAR_WIDTH - filledBar)) +

      chalk.bold(` ${progress}% `) +
      chalk.dim(`(${transformedFileCount}/${totalFileCount})`) +
      currentPhase +
      '\n');

  }

  _logCacheDisabled(reason) {
    const format = GLOBAL_CACHE_DISABLED_MESSAGE_FORMAT;
    switch (reason) {
      case 'too_many_errors':
        reporting.logWarning(
        this.terminal,
        format,
        'it has been failing too many times.');

        break;
      case 'too_many_misses':
        reporting.logWarning(
        this.terminal,
        format,
        'it has been missing too many consecutive keys.');

        break;}

  }

  _logBundleBuildDone(buildID) {
    const progress = this._activeBundles.get(buildID);
    if (progress != null) {
      const msg = this._getBundleStatusMessage(_extends({},

      progress, {
        ratio: 1,
        transformedFileCount: progress.totalFileCount }),

      'done');

      this.terminal.log(msg);
      this._activeBundles.delete(buildID);
    }
  }

  _logBundleBuildFailed(buildID) {
    const progress = this._activeBundles.get(buildID);
    if (progress != null) {
      const msg = this._getBundleStatusMessage(progress, 'failed');
      this.terminal.log(msg);
    }
  }

  _logInitializing(port, projectRoots) {
    if (port) {
      this.terminal.log(
      formatBanner(
      'Running Metro Bundler on port ' +
      port +
      '.\n\n' +
      'Keep Metro running while developing on any JS projects. Feel ' +
      'free to close this tab and run your own Metro instance ' +
      'if you prefer.\n\n' +
      'https://github.com/facebook/react-native',
      {
        paddingTop: 1,
        paddingBottom: 1 }) +

      '\n');

    }

    this.terminal.log(
    'Looking for JS files in\n  ',
    chalk.dim(projectRoots.join('\n   ')),
    '\n');

  }

  _logInitializingFailed(port, error) {
    if (error.code === 'EADDRINUSE') {
      this.terminal.log(
      chalk.bgRed.bold(' ERROR '),
      chalk.red("Metro Bundler can't listen on port", chalk.bold(port)));

      this.terminal.log(
      'Most likely another process is already using this port');

      this.terminal.log('Run the following command to find out which process:');
      this.terminal.log('\n  ', chalk.bold('lsof -i :' + port), '\n');
      this.terminal.log('Then, you can either shut down the other process:');
      this.terminal.log('\n  ', chalk.bold('kill -9 <PID>'), '\n');
      this.terminal.log('or run Metro Bundler on different port.');
    } else {
      this.terminal.log(chalk.bgRed.bold(' ERROR '), chalk.red(error.message));
      const errorAttributes = JSON.stringify(error);
      if (errorAttributes !== '{}') {
        this.terminal.log(chalk.red(errorAttributes));
      }
      this.terminal.log(chalk.red(error.stack));
    }
  }

  /**
     * This function is only concerned with logging and should not do state
     * or terminal status updates.
     */
  _log(event) {
    switch (event.type) {
      case 'initialize_started':
        this._logInitializing(event.port, event.projectRoots);
        break;
      case 'initialize_done':
        this.terminal.log('\nMetro Bundler ready.\n');
        break;
      case 'initialize_failed':
        this._logInitializingFailed(event.port, event.error);
        break;
      case 'bundle_build_done':
        this._logBundleBuildDone(event.buildID);
        break;
      case 'bundle_build_failed':
        this._logBundleBuildFailed(event.buildID);
        break;
      case 'bundling_error':
        this._logBundlingError(event.error);
        break;
      case 'dep_graph_loaded':
        this.terminal.log(`${DEP_GRAPH_MESSAGE}, done.`);
        break;
      case 'global_cache_disabled':
        this._logCacheDisabled(event.reason);
        break;
      case 'transform_cache_reset':
        reporting.logWarning(this.terminal, 'the transform cache was reset.');
        break;
      case 'worker_stdout_chunk':
        this._logWorkerChunk('stdout', event.chunk);
        break;
      case 'worker_stderr_chunk':
        this._logWorkerChunk('stderr', event.chunk);
        break;
      case 'hmr_client_error':
        this._logHmrClientError(event.error);
        break;}

  }

  /**
     * We do not want to log the whole stacktrace for bundling error, because
     * these are operational errors, not programming errors, and the stacktrace
     * is not actionable to end users.
     */
  _logBundlingError(error) {
    if (error instanceof AmbiguousModuleResolutionError) {
      const he = error.hasteError;
      const message =
      'ambiguous resolution: module `' +
      `${error.fromModulePath}\` tries to require \`${he.hasteName}\`, ` +
      `but there are several files providing this module. You can delete ` +
      'or fix them: \n\n' +
      Object.keys(he.duplicatesSet).
      sort().
      map(dupFilePath => `  * \`${dupFilePath}\`\n`).
      join('');
      this._logBundlingErrorMessage(message);
      return;
    }

    let message =
    error.snippet == null && error.stack != null ?
    error.stack :
    error.message;
    //$FlowFixMe T19379628
    if (error.filename && !message.includes(error.filename)) {
      //$FlowFixMe T19379628
      message += ` [${error.filename}]`;
    }

    if (error.snippet != null) {
      //$FlowFixMe T19379628
      message += '\n' + error.snippet;
    }
    this._logBundlingErrorMessage(message);
  }

  _logBundlingErrorMessage(message) {
    reporting.logError(this.terminal, 'bundling failed: %s', message);
  }

  _logWorkerChunk(origin, chunk) {
    const lines = chunk.split('\n');
    if (lines.length >= 1 && lines[lines.length - 1] === '') {
      lines.splice(lines.length - 1, 1);
    }
    lines.forEach(line => {
      this.terminal.log(`transform[${origin}]: ${line}`);
    });
  }

  /**
     * We use Math.pow(ratio, 2) to as a conservative measure of progress because
     * we know the `totalCount` is going to progressively increase as well. We
     * also prevent the ratio from going backwards.
     */
  _updateBundleProgress(_ref2)







  {let buildID = _ref2.buildID,transformedFileCount = _ref2.transformedFileCount,totalFileCount = _ref2.totalFileCount;
    const currentProgress = this._activeBundles.get(buildID);
    if (currentProgress == null) {
      return;
    }
    const rawRatio = transformedFileCount / totalFileCount;
    const conservativeRatio = Math.pow(rawRatio, 2);
    const ratio = Math.max(conservativeRatio, currentProgress.ratio);
    Object.assign(currentProgress, {
      ratio,
      transformedFileCount,
      totalFileCount });

  }

  /**
     * This function is exclusively concerned with updating the internal state.
     * No logging or status updates should be done at this point.
     */
  _updateState(event) {
    switch (event.type) {
      case 'bundle_build_done':
      case 'bundle_build_failed':
        this._activeBundles.delete(event.buildID);
        break;
      case 'bundle_build_started':
        const bundleProgress = {
          bundleDetails: event.bundleDetails,
          transformedFileCount: 0,
          totalFileCount: 1,
          ratio: 0 };

        this._activeBundles.set(event.buildID, bundleProgress);
        break;
      case 'bundle_transform_progressed':
        if (event.totalFileCount === event.transformedFileCount) {
          this._scheduleUpdateBundleProgress.cancel();
          this._updateBundleProgress(event);
        } else {
          this._scheduleUpdateBundleProgress(event);
        }
        break;
      case 'bundle_transform_progressed_throttled':
        this._updateBundleProgress(event);
        break;
      case 'dep_graph_loading':
        this._dependencyGraphHasLoaded = false;
        break;
      case 'dep_graph_loaded':
        this._dependencyGraphHasLoaded = true;
        break;}

  }

  _getDepGraphStatusMessage() {
    if (!this._dependencyGraphHasLoaded) {
      return `${DEP_GRAPH_MESSAGE}...`;
    }
    return null;
  }

  /**
     * Return a status message that is always consistent with the current state
     * of the application. Having this single function ensures we don't have
     * different callsites overriding each other status messages.
     */
  _getStatusMessage() {
    return [this._getDepGraphStatusMessage()].
    concat(
    Array.from(this._activeBundles.entries()).map((_ref3) => {var _ref4 = _slicedToArray(_ref3, 2);let _ = _ref4[0],progress = _ref4[1];return (
        this._getBundleStatusMessage(progress, 'in_progress'));})).


    filter(str => str != null).
    join('\n');
  }

  _logHmrClientError(e) {
    reporting.logError(
    this.terminal,
    'A WebSocket client got a connection error. Please reload your device ' +
    'to get HMR working again: %s',
    e);

  }

  /**
     * Single entry point for reporting events. That allows us to implement the
     * corresponding JSON reporter easily and have a consistent reporting.
     */
  update(event) {
    this._log(event);
    this._updateState(event);
    this.terminal.status(this._getStatusMessage());
  }}


module.exports = TerminalReporter;