"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keychain = require("react-native-keychain");
exports.hasPinCode = async () => {
    return await Keychain.getGenericPassword().then((res) => {
        return (!!res &&
            !!res
                .password);
    });
};
