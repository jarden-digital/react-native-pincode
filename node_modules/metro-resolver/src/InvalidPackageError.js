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

const formatFileCandidates = require('./formatFileCandidates');



class InvalidPackageError extends Error {












  /**
                                          * The module path prefix we where trying to resolve. For example './beep'.
                                          */ /**
                                              * The file candidates we tried to find to resolve the `main` field of the
                                              * package. Ex. `/js/foo/beep(.js|.json)?` if `main` is specifying `./beep`
                                              * as the entry point.
                                              */



  constructor(opts)




  {
    super(
    `The package \`${opts.packageJsonPath}\` is invalid because it ` +
    `specifies a \`main\` module field that could not be resolved (` +
    `\`${opts.mainPrefixPath}\`. Indeed, none of these files exist:\n\n` +
    `  * \`${formatFileCandidates(opts.fileCandidates)}\`\n` +
    `  * \`${formatFileCandidates(opts.indexCandidates)}\``);

    Object.assign(this, opts);
  } /**
     * Full path the package we were trying to resolve.
     * Ex. `/js/foo/package.json`.
     */ /**
         * The 'index' file candidates we tried to find to resolve the `main` field of
         * the package. Ex. `/js/foo/beep/index(.js|.json)?` if `main` is specifying
         * `./beep` as the entry point.
         */}module.exports = InvalidPackageError;