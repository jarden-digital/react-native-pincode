/**
 * Copyright (c) 2016-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';var _slicedToArray = function () {function sliceIterator(arr, i) {var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"]) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}return function (arr, i) {if (Array.isArray(arr)) {return arr;} else if (Symbol.iterator in Object(arr)) {return sliceIterator(arr, i);} else {throw new TypeError("Invalid attempt to destructure non-iterable instance");}};}();

const crypto = require('crypto');
const debugRead = require('debug')('Metro:TransformCache:Read');
const fs = require('fs');
const invariant = require('fbjs/lib/invariant');
const mkdirp = require('mkdirp');
const path = require('path');
const rimraf = require('rimraf');
const writeFileAtomicSync = require('write-file-atomic').sync;









const CACHE_SUB_DIR = 'cache';

































/**
                                * The API that should be exposed for a transform cache.
                                */





/* 1 day */
const GARBAGE_COLLECTION_PERIOD = 24 * 60 * 60 * 1000;
/* 4 days */
const CACHE_FILE_MAX_LAST_ACCESS_TIME = GARBAGE_COLLECTION_PERIOD * 4;

class FileBasedCache {




  /**
                       * The root path is where the data will be stored. It shouldn't contain
                       * other files other than the cache's own files, so it should start empty
                       * when Metro Bundler is first run. When doing a cache reset, it may be
                       * completely deleted.
                       */
  constructor(rootPath) {
    this._cacheWasReset = false;
    invariant(
    path.isAbsolute(rootPath),
    'root path of the transform cache must be absolute');

    require('debug')('Metro:TransformCache:Dir')(
    `transform cache directory: ${rootPath}`);

    this._rootPath = rootPath;
  }

  /**
     * We store the transformed JS because it is likely to be much bigger than the
     * rest of the data JSON. Probably the map should be stored separately as
     * well.
     *
     * We make the write operation as much atomic as possible: indeed, if another
     * process is reading the cache at the same time, there would be a risk it
     * reads new transformed code, but old metadata. This is avoided by removing
     * the files first.
     *
     * There is still a risk of conflincting writes, that is mitigated by hashing
     * the result code, that is verified at the end. In case of writes happening
     * close to each others, one of the workers is going to loose its results no
     * matter what.
     */
  writeSync(props)






  {
    const cacheFilePath = this._getCacheFilePaths(props);
    mkdirp.sync(path.dirname(cacheFilePath.transformedCode));const
    result = props.result;
    unlinkIfExistsSync(cacheFilePath.transformedCode);
    unlinkIfExistsSync(cacheFilePath.metadata);
    writeFileAtomicSync(cacheFilePath.transformedCode, result.code);
    writeFileAtomicSync(
    cacheFilePath.metadata,
    JSON.stringify([
    crypto.
    createHash('sha1').
    update(result.code).
    digest('hex'),
    hashSourceCode(props),
    result.dependencies,
    result.map]));


  }

  readSync(props) {
    const result = this._readSync(props);
    const msg = result ? 'Cache hit: ' : 'Cache miss: ';
    debugRead(msg + props.filePath);
    return result;
  }

  resetCache(reporter) {
    rimraf.sync(path.join(this._rootPath, 'last_collected'));
    rimraf.sync(path.join(this._rootPath, 'cache'));
    reporter.update({ type: 'transform_cache_reset' });
    this._cacheWasReset = true;
    this._lastCollected = Date.now();
  }

  /**
     * We verify the source hash matches to ensure we always favor rebuilding when
     * source change (rather than just using fs.mtime(), a bit less robust).
     *
     * That means when the source changes, we override the old transformed code
     * with the new one. This is, I believe, preferable, so as to avoid bloating
     * the cache during development cycles, where people changes files all the
     * time. If we implement a global cache ability at some point, we'll be able
     * to store old artifacts as well.
     *
     * Meanwhile we store transforms with different options in different files so
     * that it is fast to switch between ex. minified, or not.
     */
  _readSync(props) {
    this._collectIfNecessarySync(props.cacheOptions);
    try {
      return this._readFilesSync(props);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  _readFilesSync(props) {
    const cacheFilePaths = this._getCacheFilePaths(props);
    const metadata = readMetadataFileSync(cacheFilePaths.metadata);
    if (metadata == null) {
      return null;
    }
    const sourceHash = hashSourceCode(props);
    if (sourceHash !== metadata.cachedSourceHash) {
      return null;
    }
    const transformedCode = fs.readFileSync(
    cacheFilePaths.transformedCode,
    'utf8');

    const codeHash = crypto.
    createHash('sha1').
    update(transformedCode).
    digest('hex');
    if (metadata.cachedResultHash !== codeHash) {
      return null;
    }
    return {
      code: transformedCode,
      dependencies: metadata.dependencies,
      map: metadata.sourceMap };

  }

  /**
     * Temporary folder is never cleaned up automatically, we need to clean up old
     * stuff ourselves. This code should be safe even if two different React
     * Native projects are running at the same time.
     */
  _collectIfNecessarySync(options) {
    if (options.resetCache && !this._cacheWasReset) {
      this.resetCache(options.reporter);
      return;
    }
    const lastCollected = this._lastCollected;
    if (
    lastCollected == null ||
    Date.now() - lastCollected > GARBAGE_COLLECTION_PERIOD)
    {
      this._collectSyncNoThrow(options.reporter);
    }
  }

  /**
     * We want to avoid preventing tool use if the cleanup fails for some reason,
     * but still provide some chance for people to report/fix things.
     */
  _collectSyncNoThrow(reporter) {
    try {
      this._collectCacheIfOldSync();
    } catch (error) {
      // FIXME: $FlowFixMe: this is a hack, only works for TerminalReporter
      const terminal = reporter.terminal;
      if (terminal != null) {
        terminal.log(error.stack);
        terminal.log(
        'Error: Cleaning up the cache folder failed. Continuing anyway.');

        terminal.log('The cache folder is: %s', this._rootPath);
      }
    }
    this._lastCollected = Date.now();
  }

  /**
     * When restarting Metro Bundler we want to avoid running the collection over
     * again, so we store the last collection time in a file and we check that
     * first.
     */
  _collectCacheIfOldSync() {const
    _rootPath = this._rootPath;
    const cacheCollectionFilePath = path.join(_rootPath, 'last_collected');
    const lastCollected = Number.parseInt(
    tryReadFileSync(cacheCollectionFilePath) || '',
    10);

    if (
    Number.isInteger(lastCollected) &&
    Date.now() - lastCollected < GARBAGE_COLLECTION_PERIOD)
    {
      return;
    }
    const effectiveCacheDirPath = path.join(_rootPath, CACHE_SUB_DIR);
    mkdirp.sync(effectiveCacheDirPath);
    collectCacheSync(effectiveCacheDirPath);
    fs.writeFileSync(cacheCollectionFilePath, Date.now().toString());
  }

  /**
     * The path, built as a hash, does not take the source code itself into
     * account because it would generate lots of file during development. (The
     * source hash is stored in the metadata instead).
     */
  _getCacheFilePaths(props)


  {
    const hasher = crypto.
    createHash('sha1').
    update(props.filePath).
    update(props.transformOptionsKey);
    const hash = hasher.digest('hex');
    const prefix = hash.substr(0, 2);
    const fileName = `${hash.substr(2)}`;
    const base = path.join(this._rootPath, CACHE_SUB_DIR, prefix, fileName);
    return { transformedCode: base, metadata: base + '.meta' };
  }}


/**
      * Remove all the cache files from the specified folder that are older than a
      * certain duration.
      */
function collectCacheSync(dirPath) {
  const prefixDirs = fs.readdirSync(dirPath);
  for (let i = 0; i < prefixDirs.length; ++i) {
    const prefixDir = path.join(dirPath, prefixDirs[i]);
    const cacheFileNames = fs.readdirSync(prefixDir);
    for (let j = 0; j < cacheFileNames.length; ++j) {
      const cacheFilePath = path.join(prefixDir, cacheFileNames[j]);
      const stats = fs.lstatSync(cacheFilePath);
      const timeSinceLastAccess = Date.now() - stats.atime.getTime();
      if (
      stats.isFile() &&
      timeSinceLastAccess > CACHE_FILE_MAX_LAST_ACCESS_TIME)
      {
        fs.unlinkSync(cacheFilePath);
      }
    }
  }
}

function readMetadataFileSync(
metadataFilePath)





{
  const metadataStr = fs.readFileSync(metadataFilePath, 'utf8');
  const metadata = tryParseJSON(metadataStr);
  if (!Array.isArray(metadata)) {
    return null;
  }var _metadata = _slicedToArray(





  metadata, 4);const cachedResultHash = _metadata[0],cachedSourceHash = _metadata[1],dependencies = _metadata[2],sourceMap = _metadata[3];
  if (
  typeof cachedResultHash !== 'string' ||
  typeof cachedSourceHash !== 'string' ||
  !(
  Array.isArray(dependencies) &&
  dependencies.every(dep => typeof dep === 'string')) ||

  !(sourceMap == null || typeof sourceMap === 'object'))
  {
    return null;
  }
  return {
    cachedResultHash,
    cachedSourceHash,
    dependencies,
    sourceMap };

}

function tryParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null;
    }
    throw error;
  }
}

function hashSourceCode(props)





{
  return crypto.
  createHash('sha1').
  update(props.getTransformCacheKey(props.transformOptions)).
  update(props.sourceCode).
  digest('hex');
}

/**
   * We want to unlink all cache files before writing, so that it is as much
   * atomic as possible.
   */
function unlinkIfExistsSync(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return;
    }
    throw error;
  }
}

/**
   * In some context we want to build from scratch, that is what this cache
   * implementation allows.
   */
function none() {
  return {
    writeSync: () => {},
    readSync: () => null };

}

/**
   * If Metro Bundler is running for two different directories, we don't want the
   * caches to conflict with each other. `__dirname` carries that because
   * Metro Bundler will be, for example, installed in a different `node_modules/`
   * folder for different projects.
   */
function useTempDir() {
  const hash = crypto.createHash('sha1').update(__dirname);
  if (process.getuid != null) {
    hash.update(process.getuid().toString());
  }
  const tmpDir = tmpdir();
  const cacheName = 'metro-cache';
  const rootPath = path.join(tmpDir, cacheName + '-' + hash.digest('hex'));
  mkdirp.sync(rootPath);
  return new FileBasedCache(rootPath);
}

function tmpdir() {
  const tmpDirPath = require('os').tmpdir();
  invariant(
  tmpDirPath != null && tmpDirPath.length > 0,
  'os.tmpdir() returned nothing, a valid temp dir is required');

  return tmpDirPath;
}

function tryReadFileSync(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    if (error.code == 'ENOENT') {
      return null;
    }
    throw error;
  }
}

module.exports = { FileBasedCache, none, useTempDir };