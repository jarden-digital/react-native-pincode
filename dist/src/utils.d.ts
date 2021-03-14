export declare enum PinResultStatus {
    initial = "initial",
    success = "success",
    failure = "failure",
    locked = "locked"
}
export declare const hasPinCode: (serviceName: string) => Promise<any>;
export declare const deletePinCode: (serviceName: string) => Promise<any>;
export declare const resetInternalStates: (asyncStorageKeys: string[]) => Promise<any>;
export declare const noBiometricsConfig: any;
