/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}

const Bundler = require('../Bundler');
const DeltaBundler = require('../DeltaBundler');
const MultipartResponse = require('./MultipartResponse');
const Serializers = require('../DeltaBundler/Serializers');
const debug = require('debug')('Metro:Server');
const defaults = require('../defaults');
const formatBundlingError = require('../lib/formatBundlingError');
const getMaxWorkers = require('../lib/getMaxWorkers');
const getOrderedDependencyPaths = require('../lib/getOrderedDependencyPaths');
const mime = require('mime-types');
const nullthrows = require('fbjs/lib/nullthrows');
const parseCustomTransformOptions = require('../lib/parseCustomTransformOptions');
const parsePlatformFilePath = require('../node-haste/lib/parsePlatformFilePath');
const path = require('path');
const symbolicate = require('./symbolicate');
const url = require('url');var _require =

require('../Assets');const getAsset = _require.getAsset;
const resolveSync = require('resolve').sync;var _require2 =





















require('metro-core'),_require2$Logger = _require2.Logger;const createActionStartEntry = _require2$Logger.createActionStartEntry,createActionEndEntry = _require2$Logger.createActionEndEntry,log = _require2$Logger.log;



function debounceAndBatch(fn, delay) {
  let timeout;
  return () => {
    clearTimeout(timeout);
    timeout = setTimeout(fn, delay);
  };
}

const FILES_CHANGED_COUNT_HEADER = 'X-Metro-Files-Changed-Count';

class Server {












































  constructor(options) {_initialiseProps.call(this);
    const reporter =
    options.reporter || require('../lib/reporting').nullReporter;
    const maxWorkers = getMaxWorkers(options.maxWorkers);
    const assetExts = options.assetExts || defaults.assetExts;
    const sourceExts = options.sourceExts || defaults.sourceExts;

    this._opts = {
      assetExts: options.assetTransforms ? [] : assetExts,
      assetRegistryPath: options.assetRegistryPath,
      blacklistRE: options.blacklistRE,
      cacheStores: options.cacheStores || [],
      cacheVersion: options.cacheVersion,
      dynamicDepsInPackages: options.dynamicDepsInPackages || 'throwAtRuntime',
      createModuleIdFactory: options.createModuleIdFactory,
      enableBabelRCLookup:
      options.enableBabelRCLookup != null ?
      options.enableBabelRCLookup :
      true,
      extraNodeModules: options.extraNodeModules || {},
      getModulesRunBeforeMainModule: options.getModulesRunBeforeMainModule,
      getPolyfills: options.getPolyfills,
      getTransformOptions: options.getTransformOptions,
      globalTransformCache: options.globalTransformCache,
      hasteImplModulePath: options.hasteImplModulePath,
      maxWorkers,
      minifierPath:
      options.minifierPath == null ?
      defaults.DEFAULT_METRO_MINIFIER_PATH :
      resolveSync(options.minifierPath, { basedir: process.cwd() }),
      moduleFormat:
      options.moduleFormat != null ? options.moduleFormat : 'haste',
      platforms: options.platforms || defaults.platforms,
      polyfillModuleNames: options.polyfillModuleNames || [],
      postProcessModules: options.postProcessModules,
      postMinifyProcess: options.postMinifyProcess,
      postProcessBundleSourcemap: options.postProcessBundleSourcemap,
      projectRoots: options.projectRoots,
      providesModuleNodeModules: options.providesModuleNodeModules,
      reporter,
      resetCache: options.resetCache || false,
      silent: options.silent || false,
      sourceExts: options.assetTransforms ?
      sourceExts.concat(assetExts) :
      sourceExts,
      transformCache: options.transformCache,
      transformModulePath:
      options.transformModulePath || defaults.transformModulePath,
      watch: options.watch || false,
      workerPath: options.workerPath };


    const processFileChange = (_ref) => {let type = _ref.type,filePath = _ref.filePath;return (
        this.onFileChange(type, filePath));};

    this._reporter = reporter;
    this._changeWatchers = [];
    this._fileChangeListeners = [];
    this._platforms = new Set(this._opts.platforms);

    // This slices out options that are not part of the strict BundlerOptions
    /* eslint-disable no-unused-vars */var _opts =






    this._opts;const createModuleIdFactory = _opts.createModuleIdFactory,getModulesRunBeforeMainModule = _opts.getModulesRunBeforeMainModule,moduleFormat = _opts.moduleFormat,silent = _opts.silent,bundlerOptionsFromServerOptions = _objectWithoutProperties(_opts, ['createModuleIdFactory', 'getModulesRunBeforeMainModule', 'moduleFormat', 'silent']);
    /* eslint-enable no-unused-vars */

    this._bundler = new Bundler(_extends({},
    bundlerOptionsFromServerOptions, {
      asyncRequireModulePath:
      options.asyncRequireModulePath ||
      'metro/src/lib/bundle-modules/asyncRequire' }));


    // changes to the haste map can affect resolution of files in the bundle
    this._bundler.getDependencyGraph().then(dependencyGraph => {
      dependencyGraph.
      getWatcher().
      on('change', (_ref2) => {let eventsQueue = _ref2.eventsQueue;return (
          eventsQueue.forEach(processFileChange));});

    });

    this._debouncedFileChangeHandler = debounceAndBatch(
    () => this._informChangeWatchers(),
    50);


    this._symbolicateInWorker = symbolicate.createWorker();
    this._nextBundleBuildID = 1;

    this._deltaBundler = new DeltaBundler(this._bundler, {
      getPolyfills: this._opts.getPolyfills,
      polyfillModuleNames: this._opts.polyfillModuleNames,
      postProcessModules: this._opts.postProcessModules });

  }

  end() {
    this._deltaBundler.end();
    this._bundler.end();
  }

  addFileChangeListener(listener) {
    if (this._fileChangeListeners.indexOf(listener) === -1) {
      this._fileChangeListeners.push(listener);
    }
  }

  getDeltaBundler() {
    return this._deltaBundler;
  }

  build(options) {var _this = this;return _asyncToGenerator(function* () {
      options = _extends({},
      options, {
        runBeforeMainModule: _this._opts.getModulesRunBeforeMainModule(
        options.entryFile) });



      const fullBundle = yield Serializers.fullBundle(
      _this._deltaBundler,
      options);


      const fullMap = yield Serializers.fullSourceMap(
      _this._deltaBundler,
      options);


      return {
        code: fullBundle.bundle,
        map: fullMap };})();

  }

  getRamBundleInfo(options) {var _this2 = this;return _asyncToGenerator(function* () {
      return yield Serializers.getRamBundleInfo(_this2._deltaBundler, options);})();
  }

  getAssets(options) {var _this3 = this;return _asyncToGenerator(function* () {
      return yield Serializers.getAssets(_this3._deltaBundler, options);})();
  }

  getOrderedDependencyPaths(options)




  {var _this4 = this;return _asyncToGenerator(function* () {
      const bundleOptions = _extends({},
      Server.DEFAULT_BUNDLE_OPTIONS,
      options, {
        bundleType: 'delta' });


      if (!bundleOptions.platform) {
        bundleOptions.platform = parsePlatformFilePath(
        bundleOptions.entryFile,
        _this4._platforms).
        platform;
      }

      return yield getOrderedDependencyPaths(_this4._deltaBundler, bundleOptions);})();
  }

  onFileChange(type, filePath) {
    Promise.all(
    this._fileChangeListeners.map(listener => listener(filePath))).
    then(
    () => this._onFileChangeComplete(filePath),
    () => this._onFileChangeComplete(filePath));

  }

  _onFileChangeComplete(filePath) {
    // Make sure the file watcher event runs through the system before
    // we rebuild the bundles.
    this._debouncedFileChangeHandler(filePath);
  }

  _informChangeWatchers() {
    const watchers = this._changeWatchers;
    const headers = {
      'Content-Type': 'application/json; charset=UTF-8' };


    watchers.forEach(function (w) {
      w.res.writeHead(205, headers);
      w.res.end(JSON.stringify({ changed: true }));
    });

    this._changeWatchers = [];
  }

  _processOnChangeRequest(req, res) {
    const watchers = this._changeWatchers;

    watchers.push({
      req,
      res });


    req.on('close', () => {
      for (let i = 0; i < watchers.length; i++) {
        if (watchers[i] && watchers[i].req === req) {
          watchers.splice(i, 1);
          break;
        }
      }
    });
  }

  _rangeRequestMiddleware(
  req,
  res,
  data,
  assetPath)
  {
    if (req.headers && req.headers.range) {var _req$headers$range$re =
      req.headers.range.
      replace(/bytes=/, '').
      split('-'),_req$headers$range$re2 = _slicedToArray(_req$headers$range$re, 2);const rangeStart = _req$headers$range$re2[0],rangeEnd = _req$headers$range$re2[1];
      const dataStart = parseInt(rangeStart, 10);
      const dataEnd = rangeEnd ? parseInt(rangeEnd, 10) : data.length - 1;
      const chunksize = dataEnd - dataStart + 1;

      res.writeHead(206, {
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Range': `bytes ${dataStart}-${dataEnd}/${data.length}`,
        'Content-Type': mime.lookup(path.basename(assetPath[1])) });


      return data.slice(dataStart, dataEnd + 1);
    }

    return data;
  }

  _processSingleAssetRequest(req, res) {var _this5 = this;return _asyncToGenerator(function* () {
      const urlObj = url.parse(decodeURI(req.url), true);
      /* $FlowFixMe: could be empty if the url is invalid */
      const assetPath = urlObj.pathname.match(/^\/assets\/(.+)$/);

      const processingAssetRequestLogEntry = log(
      createActionStartEntry({
        action_name: 'Processing asset request',
        asset: assetPath[1] }));



      try {
        const data = yield getAsset(
        assetPath[1],
        _this5._opts.projectRoots,
        /* $FlowFixMe: query may be empty for invalid URLs */
        urlObj.query.platform);

        // Tell clients to cache this for 1 year.
        // This is safe as the asset url contains a hash of the asset.
        if (process.env.REACT_NATIVE_ENABLE_ASSET_CACHING === true) {
          res.setHeader('Cache-Control', 'max-age=31536000');
        }
        res.end(_this5._rangeRequestMiddleware(req, res, data, assetPath));
        process.nextTick(function () {
          log(createActionEndEntry(processingAssetRequestLogEntry));
        });
      } catch (error) {
        console.error(error.stack);
        res.writeHead(404);
        res.end('Asset not found');
      }})();
  }

  _optionsHash(options) {
    // List of option parameters that won't affect the build result, so they
    // can be ignored to calculate the options hash.
    const ignoredParams = {
      onProgress: null,
      deltaBundleId: null,
      excludeSource: null,
      sourceMapUrl: null };


    return JSON.stringify(Object.assign({}, options, ignoredParams));
  }


































  _prepareDeltaBundler(
  req,
  mres)
  {
    const options = this._getOptionsFromUrl(
    url.format(_extends({},
    url.parse(req.url), {
      protocol: 'http',
      host: req.headers.host })));



    const buildID = this.getNewBuildID();

    if (!this._opts.silent) {
      options.onProgress = (transformedFileCount, totalFileCount) => {
        mres.writeChunk(
        { 'Content-Type': 'application/json' },
        JSON.stringify({ done: transformedFileCount, total: totalFileCount }));


        this._reporter.update({
          buildID,
          type: 'bundle_transform_progressed',
          transformedFileCount,
          totalFileCount });

      };
    }

    /* $FlowFixMe(>=0.63.0 site=react_native_fb) This comment suppresses an
       * error found when Flow v0.63 was deployed. To see the error delete this
       * comment and run Flow. */
    this._reporter.update({
      buildID,
      bundleDetails: {
        entryFile: options.entryFile,
        platform: options.platform,
        dev: options.dev,
        minify: options.minify,
        bundleType: options.bundleType },

      type: 'bundle_build_started' });


    return { options, buildID };
  }

  _processDeltaRequest(req, res) {var _this6 = this;return _asyncToGenerator(function* () {
      const mres = MultipartResponse.wrap(req, res);var _prepareDeltaBundler =
      _this6._prepareDeltaBundler(req, mres);const options = _prepareDeltaBundler.options,buildID = _prepareDeltaBundler.buildID;

      const requestingBundleLogEntry = log(
      createActionStartEntry({
        action_name: 'Requesting delta',
        bundle_url: req.url,
        entry_point: options.entryFile }));



      let output;

      const clientId = _this6._optionsHash(options);

      try {
        output = yield Serializers.deltaBundle(
        _this6._deltaBundler,
        clientId,
        options);

      } catch (error) {
        _this6._handleError(mres, _this6._optionsHash(options), error);

        _this6._reporter.update({
          buildID,
          type: 'bundle_build_failed' });


        return;
      }

      mres.setHeader(FILES_CHANGED_COUNT_HEADER, String(output.numModifiedFiles));
      mres.setHeader('Content-Type', 'application/javascript');
      mres.setHeader('Content-Length', String(Buffer.byteLength(output.bundle)));
      mres.end(output.bundle);

      _this6._reporter.update({
        buildID,
        type: 'bundle_build_done' });


      debug('Finished response');
      log(_extends({},
      createActionEndEntry(requestingBundleLogEntry), {
        outdated_modules: output.numModifiedFiles }));})();

  }

  _processBundleRequest(req, res) {var _this7 = this;return _asyncToGenerator(function* () {
      const mres = MultipartResponse.wrap(req, res);var _prepareDeltaBundler2 =
      _this7._prepareDeltaBundler(req, mres);const options = _prepareDeltaBundler2.options,buildID = _prepareDeltaBundler2.buildID;

      const requestingBundleLogEntry = log(
      createActionStartEntry({
        action_name: 'Requesting bundle',
        bundle_url: req.url,
        entry_point: options.entryFile,
        bundler: 'delta' }));



      let result;

      try {
        result = yield Serializers.fullBundle(_this7._deltaBundler, options);
      } catch (error) {
        _this7._handleError(mres, _this7._optionsHash(options), error);

        _this7._reporter.update({
          buildID,
          type: 'bundle_build_failed' });


        return;
      }

      if (
      // We avoid parsing the dates since the client should never send a more
      // recent date than the one returned by the Delta Bundler (if that's the
      // case it's fine to return the whole bundle).
      req.headers['if-modified-since'] === result.lastModified.toUTCString())
      {
        debug('Responding with 304');
        mres.writeHead(304);
        mres.end();
      } else {
        mres.setHeader(
        FILES_CHANGED_COUNT_HEADER,
        String(result.numModifiedFiles));

        mres.setHeader('Content-Type', 'application/javascript');
        mres.setHeader('Last-Modified', result.lastModified.toUTCString());
        mres.setHeader(
        'Content-Length',
        String(Buffer.byteLength(result.bundle)));

        mres.end(result.bundle);
      }

      _this7._reporter.update({
        buildID,
        type: 'bundle_build_done' });


      debug('Finished response');
      log(_extends({},
      createActionEndEntry(requestingBundleLogEntry), {
        outdated_modules: result.numModifiedFiles,
        bundler: 'delta' }));})();

  }

  _processSourceMapRequest(req, res) {var _this8 = this;return _asyncToGenerator(function* () {
      const mres = MultipartResponse.wrap(req, res);var _prepareDeltaBundler3 =
      _this8._prepareDeltaBundler(req, mres);const options = _prepareDeltaBundler3.options,buildID = _prepareDeltaBundler3.buildID;

      const requestingBundleLogEntry = log(
      createActionStartEntry({
        action_name: 'Requesting sourcemap',
        bundle_url: req.url,
        entry_point: options.entryFile,
        bundler: 'delta' }));



      let sourceMap;

      try {
        sourceMap = yield Serializers.fullSourceMap(_this8._deltaBundler, options);
      } catch (error) {
        _this8._handleError(mres, _this8._optionsHash(options), error);

        _this8._reporter.update({
          buildID,
          type: 'bundle_build_failed' });


        return;
      }

      mres.setHeader('Content-Type', 'application/json');
      mres.end(sourceMap.toString());

      _this8._reporter.update({
        buildID,
        type: 'bundle_build_done' });


      log(
      createActionEndEntry(_extends({},
      requestingBundleLogEntry, {
        bundler: 'delta' })));})();


  }

  _processAssetsRequest(req, res) {var _this9 = this;return _asyncToGenerator(function* () {
      const mres = MultipartResponse.wrap(req, res);var _prepareDeltaBundler4 =
      _this9._prepareDeltaBundler(req, mres);const options = _prepareDeltaBundler4.options,buildID = _prepareDeltaBundler4.buildID;

      const requestingAssetsLogEntry = log(
      createActionStartEntry({
        action_name: 'Requesting assets',
        bundle_url: req.url,
        entry_point: options.entryFile,
        bundler: 'delta' }));



      let assets;

      try {
        assets = yield _this9.getAssets(options);
      } catch (error) {
        _this9._handleError(mres, _this9._optionsHash(options), error);

        _this9._reporter.update({
          buildID,
          type: 'bundle_build_failed' });


        return;
      }

      mres.setHeader('Content-Type', 'application/json');
      mres.end(JSON.stringify(assets));

      _this9._reporter.update({
        buildID,
        type: 'bundle_build_done' });


      log(
      createActionEndEntry(_extends({},
      requestingAssetsLogEntry, {
        bundler: 'delta' })));})();


  }

  _symbolicate(req, res) {
    const symbolicatingLogEntry = log(createActionStartEntry('Symbolicating'));

    debug('Start symbolication');

    /* $FlowFixMe: where is `rowBody` defined? Is it added by
                                   * the `connect` framework? */
    Promise.resolve(req.rawBody).
    then(body => {
      const stack = JSON.parse(body).stack;

      // In case of multiple bundles / HMR, some stack frames can have
      // different URLs from others
      const urls = new Set();
      stack.forEach(frame => {
        const sourceUrl = frame.file;
        // Skip `/debuggerWorker.js` which drives remote debugging because it
        // does not need to symbolication.
        // Skip anything except http(s), because there is no support for that yet
        if (
        !urls.has(sourceUrl) &&
        !sourceUrl.endsWith('/debuggerWorker.js') &&
        sourceUrl.startsWith('http'))
        {
          urls.add(sourceUrl);
        }
      });

      const mapPromises = Array.from(urls.values()).map(
      this._sourceMapForURL,
      this);


      debug('Getting source maps for symbolication');
      return Promise.all(mapPromises).then(maps => {
        debug('Sending stacks and maps to symbolication worker');
        const urlsToMaps = zip(urls.values(), maps);
        return this._symbolicateInWorker(stack, urlsToMaps);
      });
    }).
    then(
    stack => {
      debug('Symbolication done');
      res.end(JSON.stringify({ stack }));
      process.nextTick(() => {
        log(createActionEndEntry(symbolicatingLogEntry));
      });
    },
    error => {
      console.error(error.stack || error);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: error.message }));
    });

  }

  _sourceMapForURL(reqUrl) {var _this10 = this;return _asyncToGenerator(function* () {
      const options = _this10._getOptionsFromUrl(reqUrl);

      return yield Serializers.fullSourceMapObject(_this10._deltaBundler, options);})();
  }

  _handleError(res, bundleID, error) {
    const formattedError = formatBundlingError(error);

    res.writeHead(error.status || 500, {
      'Content-Type': 'application/json; charset=UTF-8' });

    res.end(JSON.stringify(formattedError));
    this._reporter.update({ error, type: 'bundling_error' });

    log({
      action_name: 'bundling_error',
      error_type: formattedError.type,
      log_entry_label: 'bundling_error',
      stack: formattedError.message });

  }

  _getOptionsFromUrl(reqUrl) {
    // `true` to parse the query param as an object.
    const urlObj = nullthrows(url.parse(reqUrl, true));
    const urlQuery = nullthrows(urlObj.query);

    const pathname = urlObj.pathname ? decodeURIComponent(urlObj.pathname) : '';

    let isMap = false;

    // Backwards compatibility. Options used to be as added as '.' to the
    // entry module name. We can safely remove these options.
    const entryFile =
    pathname.
    replace(/^\//, '').
    split('.').
    filter(part => {
      if (part === 'map') {
        isMap = true;
        return false;
      }
      if (
      part === 'includeRequire' ||
      part === 'runModule' ||
      part === 'bundle' ||
      part === 'delta' ||
      part === 'assets')
      {
        return false;
      }
      return true;
    }).
    join('.') + '.js';

    // try to get the platform from the url
    const platform =
    urlQuery.platform ||
    parsePlatformFilePath(pathname, this._platforms).platform;

    const deltaBundleId = urlQuery.deltaBundleId;

    const assetPlugin = urlQuery.assetPlugin;
    const assetPlugins = Array.isArray(assetPlugin) ?
    assetPlugin :
    typeof assetPlugin === 'string' ? [assetPlugin] : [];

    const dev = this._getBoolOptionFromQuery(urlQuery, 'dev', true);
    const minify = this._getBoolOptionFromQuery(urlQuery, 'minify', false);
    const excludeSource = this._getBoolOptionFromQuery(
    urlQuery,
    'excludeSource',
    false);

    const includeSource = this._getBoolOptionFromQuery(
    urlQuery,
    'inlineSourceMap',
    false);


    const customTransformOptions = parseCustomTransformOptions(urlObj);

    return {
      sourceMapUrl: url.format(_extends({},
      urlObj, {
        pathname: pathname.replace(/\.(bundle|delta)$/, '.map') })),

      bundleType: isMap ? 'map' : deltaBundleId ? 'delta' : 'bundle',
      customTransformOptions,
      entryFile,
      deltaBundleId,
      dev,
      minify,
      excludeSource,
      hot: true,
      runBeforeMainModule: this._opts.getModulesRunBeforeMainModule(entryFile),
      runModule: this._getBoolOptionFromQuery(urlObj.query, 'runModule', true),
      inlineSourceMap: includeSource,
      isolateModuleIDs: false,
      platform,
      resolutionResponse: null,
      entryModuleOnly: this._getBoolOptionFromQuery(
      urlObj.query,
      'entryModuleOnly',
      false),

      assetPlugins,
      onProgress: null,
      unbundle: false };

  }

  _getBoolOptionFromQuery(
  query,
  opt,
  defaultVal)
  {
    /* $FlowFixMe: `query` could be empty when it comes from an invalid URL */
    if (query[opt] == null) {
      return defaultVal;
    }

    return query[opt] === 'true' || query[opt] === '1';
  }

  getNewBuildID() {
    return (this._nextBundleBuildID++).toString(36);
  }

  getReporter() {
    return this._reporter;
  }}Server.

DEFAULT_BUNDLE_OPTIONS = {
  assetPlugins: [],
  customTransformOptions: Object.create(null),
  dev: true,
  entryModuleOnly: false,
  excludeSource: false,
  hot: false,
  inlineSourceMap: false,
  isolateModuleIDs: false,
  minify: false,
  onProgress: null,
  resolutionResponse: null,
  runBeforeMainModule: [],
  runModule: true,
  sourceMapUrl: null,
  unbundle: false };var _initialiseProps = function () {var _this11 = this;this.processRequest = (() => {var _ref3 = _asyncToGenerator(function* (req, res, next) {const urlObj = url.parse(req.url, true);const host = req.headers.host;debug(`Handling request: ${host ? 'http://' + host : ''}${req.url}`); /* $FlowFixMe: Could be empty if the URL is invalid. */const pathname = urlObj.pathname;if (pathname.match(/\.bundle$/)) {yield _this11._processBundleRequest(req, res);} else if (pathname.match(/\.map$/)) {yield _this11._processSourceMapRequest(req, res);} else if (pathname.match(/\.assets$/)) {yield _this11._processAssetsRequest(req, res);} else if (pathname.match(/\.delta$/)) {yield _this11._processDeltaRequest(req, res);} else if (pathname.match(/^\/onchange\/?$/)) {_this11._processOnChangeRequest(req, res);} else if (pathname.match(/^\/assets\//)) {yield _this11._processSingleAssetRequest(req, res);} else if (pathname === '/symbolicate') {_this11._symbolicate(req, res);} else if (next) {next();} else {res.writeHead(404);res.end();}});return function (_x, _x2, _x3) {return _ref3.apply(this, arguments);};})();};



function* zip(xs, ys) {
  //$FlowIssue #9324959
  const ysIter = ys[Symbol.iterator]();
  for (const x of xs) {
    const y = ysIter.next();
    if (y.done) {
      return;
    }
    yield [x, y.value];
  }
}

module.exports = Server;