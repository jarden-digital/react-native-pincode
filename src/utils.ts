import * as Keychain from 'react-native-keychain'

export const hasPinCode = async() => {
  const keyChainResult = await Keychain.getGenericPassword()
  return keyChainResult && (keyChainResult as {service: string, username: string, password: string}).password
}
