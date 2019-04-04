"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_storage_1 = require("@react-native-community/async-storage");
const Keychain = require("react-native-keychain");
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
