import * as Keychain from 'react-native-keychain';
export declare enum PinResultStatus {
    initial = "initial",
    success = "success",
    failure = "failure",
    locked = "locked"
}
export declare const hasPinCode: (serviceName: string) => Promise<boolean>;
export declare const deletePinCode: (serviceName: string) => Promise<void>;
export declare const resetInternalStates: (asyncStorageKeys: string[]) => Promise<void>;
export declare const noBiometricsConfig: {
    accessControl: Keychain.ACCESS_CONTROL;
} | {
    accessControl?: undefined;
};
