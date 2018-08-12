"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keychain = require("react-native-keychain");
exports.hasPinCode = async () => {
    const keyChainResult = await Keychain.getGenericPassword();
    return keyChainResult && keyChainResult.password;
};
