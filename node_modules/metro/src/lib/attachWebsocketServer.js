/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */

'use strict';function _asyncToGenerator(fn) {return function () {var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {function step(key, arg) {try {var info = gen[key](arg);var value = info.value;} catch (error) {reject(error);return;}if (info.done) {resolve(value);} else {return Promise.resolve(value).then(function (value) {step("next", value);}, function (err) {step("throw", err);});}}return step("next");});};}




















/**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                * Attach a websocket server to an already existing HTTP[S] server, and forward
                                                                                                                                                                                                                                                                                                                                                                                                                                                                * the received events on the given "websocketServer" parameter. It must be an
                                                                                                                                                                                                                                                                                                                                                                                                                                                                * object with the following fields:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - onClientConnect
                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - onClientError
                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - onClientMessage
                                                                                                                                                                                                                                                                                                                                                                                                                                                                *   - onClientDisconnect
                                                                                                                                                                                                                                                                                                                                                                                                                                                                */

module.exports = function attachWebsocketServer(_ref)



{let httpServer = _ref.httpServer,websocketServer = _ref.websocketServer,path = _ref.path;
  const WebSocketServer = require('ws').Server;
  const wss = new WebSocketServer({
    server: httpServer,
    path });


  wss.on('connection', (() => {var _ref2 = _asyncToGenerator(function* (ws) {
      let connected = true;
      const url = ws.upgradeReq.url;

      const sendFn = function () {
        if (connected) {
          ws.send.apply(ws, arguments);
        }
      };

      const client = yield websocketServer.onClientConnect(url, sendFn);

      ws.on('error', function (e) {
        websocketServer.onClientError && websocketServer.onClientError(client, e);
      });

      ws.on('close', function () {
        websocketServer.onClientDisconnect &&
        websocketServer.onClientDisconnect(client);
        connected = false;
      });

      ws.on('message', function (message) {
        websocketServer.onClientMessage &&
        websocketServer.onClientMessage(client, message);
      });
    });return function (_x) {return _ref2.apply(this, arguments);};})());
};