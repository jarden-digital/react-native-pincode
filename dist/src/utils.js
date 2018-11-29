"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keychain = require("react-native-keychain");
exports.hasPinCode = async (serviceName) => {
    return await Keychain.getInternetCredentials(serviceName).then(res => {
        return !!res && !!res.password;
    });
};
exports.deletePinCode = () => {
    Keychain.resetGenericPassword();
};
