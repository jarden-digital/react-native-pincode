import { Platform } from 'react-native'
import * as Keychain from 'react-native-keychain'

export enum PinResultStatus {
  initial = 'initial',
  success = 'success',
  failure = 'failure',
  locked = 'locked'
}

export const hasPinCode = async (serviceName: string) => {
  return await Keychain.getInternetCredentials(serviceName).then(res => {
    return !!res && !!res.password
  })
}

export const deletePinCode = async (serviceName: string) => {
  return await Keychain.resetInternetCredentials(serviceName)
}

export const resetInternalStates = async (asyncStorageKeys: string[]) => {
  return  ''
}

export const noBiometricsConfig = Platform.select({
    android: {
        accessControl: Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD,
    },
    ios: {}
})
