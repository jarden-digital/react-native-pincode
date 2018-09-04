import * as Keychain from 'react-native-keychain'

export const hasPinCode = async () => {
  return await Keychain.getGenericPassword().then(
    (
      res: boolean | { service: string; username: string; password: string }
    ) => {
      return (
        !!res &&
        !!(res as { service: string; username: string; password: string })
          .password
      )
    }
  )
}
