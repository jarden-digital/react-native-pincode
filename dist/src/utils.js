"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetInternalStates = exports.deletePinCode = exports.hasPinCode = exports.PinResultStatus = void 0;
const async_storage_1 = require("@react-native-community/async-storage");
const Keychain = require("react-native-keychain");
var PinResultStatus;
(function (PinResultStatus) {
    PinResultStatus["initial"] = "initial";
    PinResultStatus["success"] = "success";
    PinResultStatus["failure"] = "failure";
    PinResultStatus["locked"] = "locked";
})(PinResultStatus = exports.PinResultStatus || (exports.PinResultStatus = {}));
exports.hasPinCode = async (serviceName) => {
    return await Keychain.getInternetCredentials(serviceName).then(res => {
        return !!res && !!res.password;
    });
};
exports.deletePinCode = async (serviceName) => {
    return await Keychain.resetInternetCredentials(serviceName);
};
exports.resetInternalStates = async (asyncStorageKeys) => {
    return await async_storage_1.default.multiRemove(asyncStorageKeys);
};
