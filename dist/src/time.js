"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const react_native_ntp_client_1 = require("react-native-ntp-client");
var TimeType;
(function (TimeType) {
    TimeType["device"] = "device";
    TimeType["ntp"] = "ntp";
    TimeType["ntpForce"] = "ntpForce";
})(TimeType = exports.TimeType || (exports.TimeType = {}));
const time = (type) => new Promise((resolve, reject) => {
    if (type === TimeType.device) {
        return resolve(new Date());
    }
    react_native_ntp_client_1.default.getNetworkTime('pool.ntp.org', 123, (err, date) => {
        if (err) {
            if (type === TimeType.ntpForce) {
                return reject(err);
            }
            return resolve(new Date());
        }
        return resolve(date);
    });
});
exports.default = time;
