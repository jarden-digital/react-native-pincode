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






















































// We'll be able to remove this to use the one provided by modern versions of
// fs-extra once https://github.com/jprichardson/node-fs-extra/pull/520 will
// have been merged (until then, they'll break on devservers/Sandcastle)
let asyncRealpath = (() => {var _ref = _asyncToGenerator(function* (path) {
    return new Promise(function (resolve, reject) {
      realpath(path, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  });return function asyncRealpath(_x) {return _ref.apply(this, arguments);};})();let runMetro = (() => {var _ref2 = _asyncToGenerator(

  function* (_ref3)










  {let config = _ref3.config,globalTransformCache = _ref3.globalTransformCache;var _ref3$resetCache = _ref3.resetCache;let resetCache = _ref3$resetCache === undefined ? false : _ref3$resetCache;var _ref3$maxWorkers = _ref3.maxWorkers;let maxWorkers = _ref3$maxWorkers === undefined ? getMaxWorkers() : _ref3$maxWorkers,minifierPath = _ref3.minifierPath;var _ref3$port = _ref3.port;let port = _ref3$port === undefined ? null : _ref3$port;var _ref3$reporter = _ref3.reporter;let reporter = _ref3$reporter === undefined ? new TerminalReporter(new Terminal(process.stdout)) : _ref3$reporter;var _ref3$transformCache = _ref3.transformCache;let transformCache = _ref3$transformCache === undefined ? TransformCaching.useTempDir() : _ref3$transformCache;var _ref3$watch = _ref3.watch;let watch = _ref3$watch === undefined ? false : _ref3$watch;
    const normalizedConfig = config ? Config.normalize(config) : Config.DEFAULT;

    const assetExts = defaults.assetExts.concat(
    normalizedConfig.getAssetExts && normalizedConfig.getAssetExts() || []);

    const sourceExts = defaults.sourceExts.concat(
    normalizedConfig.getSourceExts && normalizedConfig.getSourceExts() || []);

    const platforms =
    normalizedConfig.getPlatforms && normalizedConfig.getPlatforms() || [];

    const providesModuleNodeModules =
    typeof normalizedConfig.getProvidesModuleNodeModules === 'function' ?
    normalizedConfig.getProvidesModuleNodeModules() :
    defaults.providesModuleNodeModules;

    const finalProjectRoots = yield Promise.all(
    normalizedConfig.getProjectRoots().map(function (path) {return asyncRealpath(path);}));


    reporter.update({
      type: 'initialize_started',
      port,
      projectRoots: finalProjectRoots });

    const serverOptions = {
      assetExts: normalizedConfig.assetTransforms ? [] : assetExts,
      assetRegistryPath: normalizedConfig.assetRegistryPath,
      blacklistRE: normalizedConfig.getBlacklistRE(),
      cacheStores: normalizedConfig.cacheStores,
      cacheVersion: normalizedConfig.cacheVersion,
      createModuleIdFactory: normalizedConfig.createModuleIdFactory,
      dynamicDepsInPackages: normalizedConfig.dynamicDepsInPackages,
      enableBabelRCLookup: normalizedConfig.getEnableBabelRCLookup(),
      extraNodeModules: normalizedConfig.extraNodeModules,
      getPolyfills: normalizedConfig.getPolyfills,
      getModulesRunBeforeMainModule:
      normalizedConfig.getModulesRunBeforeMainModule,
      getTransformOptions: normalizedConfig.getTransformOptions,
      globalTransformCache,
      hasteImplModulePath: normalizedConfig.hasteImplModulePath,
      maxWorkers,
      minifierPath,
      platforms: defaults.platforms.concat(platforms),
      postMinifyProcess: normalizedConfig.postMinifyProcess,
      postProcessModules: normalizedConfig.postProcessModules,
      postProcessBundleSourcemap: normalizedConfig.postProcessBundleSourcemap,
      providesModuleNodeModules,
      resetCache,
      reporter,
      sourceExts: normalizedConfig.assetTransforms ?
      sourceExts.concat(assetExts) :
      sourceExts,
      transformCache,
      transformModulePath: normalizedConfig.getTransformModulePath(),
      watch,
      workerPath:
      normalizedConfig.getWorkerPath && normalizedConfig.getWorkerPath(),
      projectRoots: finalProjectRoots };


    return new MetroServer(serverOptions);
  });return function runMetro(_x2) {return _ref2.apply(this, arguments);};})();function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}const Config = require('./Config');const MetroHmrServer = require('./HmrServer');const MetroServer = require('./Server');const TerminalReporter = require('./lib/TerminalReporter');const TransformCaching = require('./lib/TransformCaching');const attachWebsocketServer = require('./lib/attachWebsocketServer');const defaults = require('./defaults');const fs = require('fs');const getMaxWorkers = require('./lib/getMaxWorkers');const http = require('http');const https = require('https');const makeBuildCommand = require('./commands/build');const makeServeCommand = require('./commands/serve');const outputBundle = require('./shared/output/bundle');const path = require('path');var _require = require('fs');const realpath = _require.realpath;var _require2 = require('fs-extra');const readFile = _require2.readFile;var _require3 = require('metro-core');const Terminal = _require3.Terminal;





exports.createConnectMiddleware = (() => {var _ref4 = _asyncToGenerator(function* (_ref5)


  {let config = _ref5.config,rest = _objectWithoutProperties(_ref5, ['config']);
    // $FlowFixMe Flow doesn't support object spread enough for the following line
    const metroServer = yield runMetro(_extends({},
    rest, {
      config,
      watch: true }));


    const normalizedConfig = config ? Config.normalize(config) : Config.DEFAULT;

    let enhancedMiddleware = metroServer.processRequest;

    // Enhance the resulting middleware using the config options
    if (normalizedConfig.enhanceMiddleware) {
      enhancedMiddleware = normalizedConfig.enhanceMiddleware(enhancedMiddleware);
    }

    return {
      attachHmrServer(httpServer) {
        attachWebsocketServer({
          httpServer,
          path: '/hot',
          websocketServer: new MetroHmrServer(metroServer) });

      },
      metroServer,
      middleware: enhancedMiddleware,
      end() {
        metroServer.end();
      } };

  });return function (_x3) {return _ref4.apply(this, arguments);};})();












exports.runServer = (() => {var _ref6 = _asyncToGenerator(function* (_ref7)











  {let host = _ref7.host,onReady = _ref7.onReady,minifierPath = _ref7.minifierPath;var _ref7$port = _ref7.port;let port = _ref7$port === undefined ? 8080 : _ref7$port;var _ref7$reporter = _ref7.reporter;let reporter = _ref7$reporter === undefined ? new TerminalReporter(new Terminal(process.stdout)) : _ref7$reporter;var _ref7$secure = _ref7.secure;let secure = _ref7$secure === undefined ? false : _ref7$secure,secureKey = _ref7.secureKey,secureCert = _ref7.secureCert;var _ref7$hmrEnabled = _ref7.hmrEnabled;let hmrEnabled = _ref7$hmrEnabled === undefined ? false : _ref7$hmrEnabled,rest = _objectWithoutProperties(_ref7, ['host', 'onReady', 'minifierPath', 'port', 'reporter', 'secure', 'secureKey', 'secureCert', 'hmrEnabled']);
    // Lazy require
    const connect = require('connect');

    const serverApp = connect();var _ref8 =






    yield exports.createConnectMiddleware(_extends({},
    rest, {
      port,
      reporter,
      minifierPath }));const attachHmrServer = _ref8.attachHmrServer,middleware = _ref8.middleware,end = _ref8.end;


    serverApp.use(middleware);

    let httpServer;

    if (secure) {
      httpServer = https.createServer(
      {
        key: yield readFile(secureKey),
        cert: yield readFile(secureCert) },

      serverApp);

    } else {
      httpServer = http.createServer(serverApp);
    }

    if (hmrEnabled) {
      attachHmrServer(httpServer);
    }

    httpServer.listen(port, host, function () {
      onReady && onReady(httpServer);
    });

    // Disable any kind of automatic timeout behavior for incoming
    // requests in case it takes the packager more than the default
    // timeout of 120 seconds to respond to a request.
    httpServer.timeout = 0;

    httpServer.on('error', function (error) {
      end();
    });

    httpServer.on('close', function () {
      end();
    });

    return httpServer;
  });return function (_x4) {return _ref6.apply(this, arguments);};})();


























exports.runBuild = (() => {var _ref9 = _asyncToGenerator(function* (_ref10)













  {let config = _ref10.config;var _ref10$dev = _ref10.dev;let dev = _ref10$dev === undefined ? false : _ref10$dev,entry = _ref10.entry,onBegin = _ref10.onBegin,onComplete = _ref10.onComplete,onProgress = _ref10.onProgress;var _ref10$optimize = _ref10.optimize;let optimize = _ref10$optimize === undefined ? false : _ref10$optimize;var _ref10$output = _ref10.output;let output = _ref10$output === undefined ? outputBundle : _ref10$output,out = _ref10.out;var _ref10$platform = _ref10.platform;let platform = _ref10$platform === undefined ? `web` : _ref10$platform;var _ref10$sourceMap = _ref10.sourceMap;let sourceMap = _ref10$sourceMap === undefined ? false : _ref10$sourceMap,sourceMapUrl = _ref10.sourceMapUrl,rest = _objectWithoutProperties(_ref10, ['config', 'dev', 'entry', 'onBegin', 'onComplete', 'onProgress', 'optimize', 'output', 'out', 'platform', 'sourceMap', 'sourceMapUrl']);
    // $FlowFixMe Flow doesn't support object spread enough for the following line
    const metroServer = yield runMetro(_extends({},
    rest, {
      config }));


    const requestOptions = {
      dev,
      entryFile: entry,
      inlineSourceMap: sourceMap && !!sourceMapUrl,
      minify: optimize,
      platform,
      sourceMapUrl: sourceMap === false ? undefined : sourceMapUrl,
      createModuleIdFactory: config ? config.createModuleIdFactory : undefined,
      onProgress };


    if (onBegin) {
      onBegin();
    }

    let metroBundle;

    try {
      metroBundle = yield output.build(metroServer, requestOptions);
    } catch (error) {
      yield metroServer.end();
      throw error;
    }

    if (onComplete) {
      onComplete();
    }

    const bundleOutput = out.replace(/(\.js)?$/, '.js');
    const sourcemapOutput =
    sourceMap === false ? undefined : out.replace(/(\.js)?$/, '.map');

    const outputOptions = {
      bundleOutput,
      sourcemapOutput,
      dev,
      platform };


    // eslint-disable-next-line no-console
    yield output.save(metroBundle, outputOptions, console.log);
    yield metroServer.end();

    return { metroServer, metroBundle };
  });return function (_x5) {return _ref9.apply(this, arguments);};})();







const METRO_CONFIG_FILENAME = 'metro.config.js';

exports.findMetroConfig = function (
filename)





{var _ref11 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},_ref11$cwd = _ref11.cwd;let cwd = _ref11$cwd === undefined ? process.cwd() : _ref11$cwd;var _ref11$basename = _ref11.basename;let basename = _ref11$basename === undefined ? METRO_CONFIG_FILENAME : _ref11$basename;var _ref11$strict = _ref11.strict;let strict = _ref11$strict === undefined ? false : _ref11$strict;
  if (filename) {
    return path.resolve(cwd, filename);
  } else {
    let previous;
    let current = cwd;

    do {
      const filename = path.join(current, basename);

      if (fs.existsSync(filename)) {
        return filename;
      }

      previous = current;
      current = path.dirname(current);
    } while (previous !== current);

    if (strict) {
      throw new Error(`Expected to find a Metro config file, found none`);
    } else {
      return null;
    }
  }
};

exports.loadMetroConfig = function (
filename)


{let searchOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const location = exports.findMetroConfig(filename, searchOptions);

  // $FlowFixMe: We want this require to be dynamic
  const config = location ? require(location) : null;

  return config ? Config.normalize(config) : Config.DEFAULT;
};




exports.attachMetroCli = function (
yargs)









{var _ref12 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},_ref12$build = _ref12.build;let build = _ref12$build === undefined ? {} : _ref12$build;var _ref12$serve = _ref12.serve;let serve = _ref12$serve === undefined ? {} : _ref12$serve;
  if (build) {var _makeBuildCommand =
    makeBuildCommand();const command = _makeBuildCommand.command,description = _makeBuildCommand.description,builder = _makeBuildCommand.builder,handler = _makeBuildCommand.handler;
    yargs.command(command, description, builder, handler);
  }
  if (serve) {var _makeServeCommand =
    makeServeCommand();const command = _makeServeCommand.command,description = _makeServeCommand.description,builder = _makeServeCommand.builder,handler = _makeServeCommand.handler;
    yargs.command(command, description, builder, handler);
  }
  return yargs;
};

exports.Config = Config;
exports.defaults = defaults;

// The symbols below belong to the legacy API and should not be relied upon
Object.assign(exports, require('./legacy'));