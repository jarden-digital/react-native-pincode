/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const MetroApi = require('../index');
const TerminalReporter = require('../lib/TerminalReporter');var _require =

require('../cli-utils');const makeAsyncCommand = _require.makeAsyncCommand;var _require2 =
require('metro-core');const Terminal = _require2.Terminal;



const term = new Terminal(process.stdout);
const updateReporter = new TerminalReporter(term);

module.exports = () => ({
  command: 'build <entry>',

  description:
  'Generates a JavaScript bundle containing the specified entrypoint and its descendants',

  builder: yargs => {
    yargs.option('project-roots', {
      alias: 'P',
      type: 'string',
      array: true });

    yargs.option('out', { alias: 'O', type: 'string', demandOption: true });

    yargs.option('platform', { alias: 'p', type: 'string' });
    yargs.option('output-type', { alias: 't', type: 'string' });

    yargs.option('max-workers', { alias: 'j', type: 'number' });

    yargs.option('optimize', { alias: 'z', type: 'boolean' });
    yargs.option('dev', { alias: 'g', type: 'boolean' });

    yargs.option('source-map', { type: 'boolean' });
    yargs.option('source-map-url', { type: 'string' });

    yargs.option('legacy-bundler', { type: 'boolean' });

    yargs.option('config', { alias: 'c', type: 'string' });

    // Deprecated
    yargs.option('reset-cache', { type: 'boolean', describe: null });
  },

  // eslint-disable-next-line lint/no-unclear-flowtypes
  handler: makeAsyncCommand((() => {var _ref = _asyncToGenerator(function* (argv) {
      // $FlowFixMe: Flow + Promises don't work consistently https://fb.facebook.com/groups/flow/permalink/1772334656148475/
      const config = yield MetroApi.loadMetroConfig(argv.config);

      if (argv.projectRoots) {
        config.getProjectRoots = function () {return argv.projectRoots;};
      }

      yield MetroApi.runBuild(_extends({},
      argv, {
        config,
        onBegin: function () {
          updateReporter.update({
            buildID: '$',
            type: 'bundle_build_started',
            bundleDetails: {
              entryFile: argv.entry,
              platform: argv.platform,
              dev: !!argv.dev,
              minify: !!argv.optimize,
              bundleType: 'Bundle' } });


        },
        onProgress: function (transformedFileCount, totalFileCount) {
          updateReporter.update({
            buildID: '$',
            type: 'bundle_transform_progressed_throttled',
            transformedFileCount,
            totalFileCount });

        },
        onComplete: function () {
          updateReporter.update({
            buildID: '$',
            type: 'bundle_build_done' });

        } }));

    });return function (_x) {return _ref.apply(this, arguments);};})()) });