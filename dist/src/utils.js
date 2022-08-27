"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noBiometricsConfig = exports.resetInternalStates = exports.deletePinCode = exports.hasPinCode = exports.PinResultStatus = void 0;
const react_native_1 = require("react-native");
const async_storage_1 = require("@react-native-async-storage/async-storage");
const Keychain = require("react-native-keychain");
var PinResultStatus;
(function (PinResultStatus) {
    PinResultStatus["initial"] = "initial";
    PinResultStatus["success"] = "success";
    PinResultStatus["failure"] = "failure";
    PinResultStatus["locked"] = "locked";
})(PinResultStatus = exports.PinResultStatus || (exports.PinResultStatus = {}));
const hasPinCode = async (serviceName) => {
    return await Keychain.getInternetCredentials(serviceName).then((res) => {
        return !!res && !!res.password;
    });
};
exports.hasPinCode = hasPinCode;
const deletePinCode = async (serviceName) => {
    return await Keychain.resetInternetCredentials(serviceName);
};
exports.deletePinCode = deletePinCode;
const resetInternalStates = async (asyncStorageKeys) => {
    return await async_storage_1.default.multiRemove(asyncStorageKeys);
};
exports.resetInternalStates = resetInternalStates;
exports.noBiometricsConfig = react_native_1.Platform.select({
    android: {
        accessControl: Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
    },
    ios: {},
});
