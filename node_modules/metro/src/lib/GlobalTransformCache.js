/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';

/* global Buffer: true */function _objectWithoutProperties(obj, keys) {var target = {};for (var i in obj) {if (keys.indexOf(i) >= 0) continue;if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;target[i] = obj[i];}return target;}function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}

const BatchProcessor = require('./BatchProcessor');
const FetchError = require('node-fetch/lib/fetch-error');

const crypto = require('crypto');
const fetch = require('node-fetch');
const jsonStableStringify = require('json-stable-stringify');
const path = require('path');
const throat = require('throat');













/**
                                   * The API that a global transform cache must comply with. To implement a
                                   * custom cache, implement this interface and pass it as argument to the
                                   * application's top-level `Server` class.
                                   */








































/**
                                       * We aggregate the requests to do a single request for many keys. It also
                                       * ensures we do a single request at a time to avoid pressuring the I/O.
                                       */
class KeyURIFetcher {



  /**
                      * When a batch request fails for some reason, we process the error locally
                      * and we proceed as if there were no result for these keys instead. That way
                      * a build will not fail just because of the cache.
                      */
  _processKeys(keys) {var _this = this;return _asyncToGenerator(function* () {
      const URIsByKey = yield _this._fetchResultURIs(keys);
      return keys.map(function (key) {return URIsByKey.get(key);});})();
  }

  fetch(key) {var _this2 = this;return _asyncToGenerator(function* () {
      return yield _this2._batchProcessor.queue(key);})();
  }

  constructor(fetchResultURIs) {
    this._fetchResultURIs = fetchResultURIs;
    this._batchProcessor = new BatchProcessor(
    {
      maximumDelayMs: 10,
      maximumItems: 500,
      concurrency: 2 },

    this._processKeys.bind(this));

  }}




class KeyResultStore {




  _processResults(keyResults) {var _this3 = this;return _asyncToGenerator(function* () {
      const resultsByKey = new Map(
      keyResults.map(function (pair) {return [pair.key, pair.result];}));

      yield _this3._storeResults(resultsByKey);
      return new Array(keyResults.length);})();
  }

  store(key, result) {var _this4 = this;return _asyncToGenerator(function* () {
      yield _this4._batchProcessor.queue({ key, result });})();
  }

  constructor(storeResults) {
    this._storeResults = storeResults;
    this._batchProcessor = new BatchProcessor(
    {
      maximumDelayMs: 1000,
      maximumItems: 100,
      concurrency: 10 },

    this._processResults.bind(this));

    this._promises = [];
  }}








function profileKey(_ref) {let dev = _ref.dev,platform = _ref.platform;
  return jsonStableStringify({ dev, platform });
}

/**
   * We avoid doing any request to the server if we know the server is not
   * going to have any key at all for a particular set of transform options.
   */
class TransformProfileSet {

  constructor(profiles) {
    this._profileKeys = new Set();
    for (const profile of profiles) {
      this._profileKeys.add(profileKey(profile));
    }
  }
  has(profile) {
    return this._profileKeys.has(profileKey(profile));
  }}












class FetchFailedError extends Error {



  constructor(details) {
    super(FetchFailedError._getMessage(details));
    this.details = details;
  } /** Separate object for details allows us to have a type union. */

  static _getMessage(details) {
    if (details.type === 'unhandled_http_status') {
      return (
        `Unexpected HTTP status: ${details.statusCode} ` +
        JSON.stringify(details.statusText) +
        ` while fetching \`${details.uri}\``);

    }
    if (details.type === 'invalid_key_data') {
      return `Invalid data was returned for key \`${details.key}\``;
    }
    return `Invalid or empty data was returned.`;
  }}


/**
      * For some reason the result stored by the server for a key might mismatch what
      * we expect a result to be. So we need to verify carefully the data.
      */
function validateCachedResult(cachedResult) {
  if (
  cachedResult != null &&
  typeof cachedResult === 'object' &&
  typeof cachedResult.code === 'string' &&
  Array.isArray(cachedResult.dependencies) &&
  cachedResult.dependencies.every(dep => typeof dep === 'string'))
  {
    return cachedResult;
  }
  return null;
}

class URIBasedGlobalTransformCache {








  /**
                                     * For using the global cache one needs to have some kind of central key-value
                                     * store that gets prefilled using keyOf() and the transformed results. The
                                     * fetching function should provide a mapping of keys to URIs. The files
                                     * referred by these URIs contains the transform results. Using URIs instead
                                     * of returning the content directly allows for independent and parallel
                                     * fetching of each result, that may be arbitrarily large JSON blobs.
                                     */
  constructor(props)





  {
    this._fetcher = new KeyURIFetcher(props.fetchResultURIs);
    this._profileSet = new TransformProfileSet(props.profiles);
    this._fetchResultFromURI = props.fetchResultFromURI;
    this._optionsHasher = new OptionsHasher(props.rootPath);
    if (props.storeResults != null) {
      this._store = new KeyResultStore(props.storeResults);
    }
  }

  /**
     * Return a key for identifying uniquely a source file.
     */
  keyOf(props) {
    const hash = crypto.createHash('sha1');const
    sourceCode = props.sourceCode,localPath = props.localPath,transformOptions = props.transformOptions;
    hash.update(
    this._optionsHasher.getTransformWorkerOptionsDigest(transformOptions));

    const cacheKey = props.getTransformCacheKey(transformOptions);
    hash.update(JSON.stringify(cacheKey));
    hash.update(JSON.stringify(localPath));
    hash.update(
    crypto.
    createHash('sha1').
    update(sourceCode).
    digest('hex'));

    const digest = hash.digest('hex');
    return `${digest}-${path.basename(localPath)}`;
  }

  /**
     * We may want to improve that logic to return a stream instead of the whole
     * blob of transformed results. However the results are generally only a few
     * megabytes each.
     */
  static _fetchResultFromURI(
  uri,
  options)
  {return _asyncToGenerator(function* () {
      const response = yield fetch(uri, {
        agent: options.agent,
        method: 'GET',
        timeout: 8000 });


      if (response.status !== 200) {
        throw new FetchFailedError({
          statusCode: response.status,
          statusText: response.statusText,
          type: 'unhandled_http_status',
          uri });

      }
      const unvalidatedResult = yield response.json();
      const result = validateCachedResult(unvalidatedResult);
      if (result == null) {
        throw new FetchFailedError({ type: 'invalid_data' });
      }
      return result;})();
  }

  /**
     * It happens from time to time that a fetch fails, we want to try these again
     * a second time if we expect them to be transient. We might even consider
     * waiting a little time before retring if experience shows it's useful.
     */
  static _fetchResultFromURIWithRetry(
  uri)

  {let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return URIBasedGlobalTransformCache._fetchResultFromURI(uri, options).catch(
    error => {
      if (!URIBasedGlobalTransformCache.shouldRetryAfterThatError(error)) {
        throw error;
      }
      return URIBasedGlobalTransformCache._fetchResultFromURI(uri, options);
    });

  }

  /**
     * The exposed version uses throat() to limit concurrency, as making too many parallel requests
     * is more likely to trigger server-side throttling and cause timeouts.
     */





  /**
         * We want to retry timeouts as they're likely temporary. We retry 503
         * (Service Unavailable) and 502 (Bad Gateway) because they may be caused by a
         * some rogue server, or because of throttling.
         *
         * There may be other types of error we'd want to retry for, but these are
         * the ones we experienced the most in practice.
         */
  static shouldRetryAfterThatError(error) {
    return (
      error instanceof FetchError && error.type === 'request-timeout' ||
      error instanceof FetchFailedError &&
      error.details.type === 'unhandled_http_status' && (
      error.details.statusCode === 503 || error.details.statusCode === 502));

  }

  shouldFetch(props) {
    return this._profileSet.has(props.transformOptions);
  }

  /**
     * This may return `null` if either the cache doesn't have a value for that
     * key yet, or an error happened, processed separately.
     */
  fetch(key) {var _this5 = this;return _asyncToGenerator(function* () {
      const uri = yield _this5._fetcher.fetch(key);
      if (uri == null) {
        return null;
      }
      return yield _this5._fetchResultFromURI(uri);})();
  }

  store(key, result) {var _this6 = this;return _asyncToGenerator(function* () {
      if (_this6._store != null) {
        yield _this6._store.store(key, result);
      }})();
  }}


URIBasedGlobalTransformCache.fetchResultFromURI = throat(
500,
URIBasedGlobalTransformCache._fetchResultFromURIWithRetry);


class OptionsHasher {



  constructor(rootPath) {
    this._rootPath = rootPath;
    this._cache = new WeakMap();
  }

  getTransformWorkerOptionsDigest(options) {
    const digest = this._cache.get(options);
    if (digest != null) {
      return digest;
    }
    const hash = crypto.createHash('sha1');
    this.hashTransformWorkerOptions(hash, options);
    const newDigest = hash.digest('hex');
    this._cache.set(options, newDigest);
    return newDigest;
  }

  /**
     * This function is extra-conservative with how it hashes the transform
     * options. In particular:
     *
     *     * we need to hash paths as local paths, i.e. relative to the root, not
     *       the absolute paths, otherwise everyone would have a different cache,
     *       defeating the purpose of global cache;
     *     * we need to reject any additional field we do not know of, because
     *       they could contain absolute path, and we absolutely want to process
     *       these.
     *
     * Theorically, Flow could help us prevent any other field from being here by
     * using *exact* object type. In practice, the transform options are a mix of
     * many different fields including the optional Babel fields, and some serious
     * cleanup will be necessary to enable rock-solid typing.
     */
  hashTransformWorkerOptions(
  hash,
  transform)
  {
    return this.hashTransformOptions(hash, transform);
  }

  /**
     * The transform options contain absolute paths. This can contain, for
     * example, the username if someone works their home directory (very likely).
     * We get rid of this local data for the global cache, otherwise nobody would
     * share the same cache keys. The project roots should not be needed as part
     * of the cache key as they should not affect the transformation of a single
     * particular file.
     */
  hashTransformOptions(
  hash,
  options)
  {const

    assetDataPlugins =









    options.assetDataPlugins,customTransformOptions = options.customTransformOptions,enableBabelRCLookup = options.enableBabelRCLookup,dev = options.dev,hot = options.hot,inlineRequires = options.inlineRequires,minify = options.minify,platform = options.platform,projectRoot = options.projectRoot,unknowns = _objectWithoutProperties(options, ['assetDataPlugins', 'customTransformOptions', 'enableBabelRCLookup', 'dev', 'hot', 'inlineRequires', 'minify', 'platform', 'projectRoot']);
    const unknownKeys = Object.keys(unknowns);
    if (unknownKeys.length > 0) {
      const message = `these transform option fields are unknown: ${JSON.stringify(
      unknownKeys)
      }`;
      throw new CannotHashOptionsError(message);
    }

    /* eslint-disable no-bitwise */
    hash.update(
    new Buffer([
    +dev |
    +hot << 2 |
    +inlineRequires << 3 |
    +enableBabelRCLookup << 4 |
    +minify << 5]));



    /* eslint-enable no-bitwise */
    hash.update(JSON.stringify(assetDataPlugins));
    hash.update(JSON.stringify(platform));
    hash.update(JSON.stringify(this.toLocalPath(projectRoot)));
    hash.update(
    JSON.stringify(this.sortTransformOptions(customTransformOptions || {})));


    return hash;
  }

  pathsToLocal(filePaths) {
    return filePaths.map(this.toLocalPath, this);
  }

  toLocalPath(filePath) {
    return path.relative(this._rootPath, filePath);
  }

  sortTransformOptions(
  options)
  {
    return Object.keys(options).
    sort().
    map(key => [key, options[key]]);
  }}


class CannotHashOptionsError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }}


URIBasedGlobalTransformCache.FetchFailedError = FetchFailedError;

module.exports = { URIBasedGlobalTransformCache, CannotHashOptionsError };