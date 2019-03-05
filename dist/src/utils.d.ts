export declare const hasPinCode: (serviceName: string) => Promise<boolean>;
export declare const deletePinCode: (serviceName: string) => Promise<void>;
export declare const resetInternalStates: (asyncStorageKeys: string[]) => Promise<void>;
