/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';var _require =

require('./babel-bridge');const transformSync = _require.transformSync;











module.exports.transform = (_ref) => {let filename = _ref.filename,options = _ref.options,plugins = _ref.plugins,src = _ref.src;
  const OLD_BABEL_ENV = process.env.BABEL_ENV;
  process.env.BABEL_ENV = options.dev ? 'development' : 'production';

  try {var _transformSync =
    transformSync(src, { filename, code: false, plugins });const ast = _transformSync.ast;

    return { ast };
  } finally {
    process.env.BABEL_ENV = OLD_BABEL_ENV;
  }
};