import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import {authPin} from '../../../utils/constants'
import TouchID from 'react-native-touch-id'
import * as AppDuck from '../../../core/modules/container/App'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Enter PIN Page
 */

type IProps = {
  openError: (type: string) => void
  previousPin: string
  renewAuthToken: typeof AppDuck.renewAuthToken
  pinCodeStatus: 'initial' | 'success' | 'failure' | 'locked'
}

type IState = {}

class PinCodeEnter extends React.PureComponent<IProps, IState> {

  componentDidMount() {
    TouchID.isSupported()
      .then((biometryType: any) => {
        setTimeout(() => {
          this.launchTouchID()
        })
      })
      .catch((error: any) => {
        console.warn(error)
      })
  }

  endProcess = (pinCode?: string) => {
    authPin.pin = pinCode
    this.props.renewAuthToken()
  }

  async launchTouchID() {
    try {
      await TouchID.authenticate('')
      const result: any = await Keychain.getGenericPassword()
      this.endProcess(result.password)
    } catch (e) {
      console.log('touch id fail')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <PinCode 
          endProcess={this.endProcess}
          sentenceTitle="Enter your PIN Code"
          status={PinStatus.enter}
          previousPin={this.props.previousPin}
          pinCodeStatus={this.props.pinCodeStatus} />
      </View>
    )
  }
}

export default PinCodeEnter

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
