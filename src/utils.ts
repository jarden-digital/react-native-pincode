import * as Keychain from 'react-native-keychain'

export const hasPinCode = async (serviceName: string) => {
  return await Keychain.getInternetCredentials(serviceName).then(res => {
    return !!res && !!res.password
  })
}

export const deletePinCode = async (serviceNmae: string) => {
  return await Keychain.resetInternetCredentials(serviceName)
}
