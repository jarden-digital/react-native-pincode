import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import * as TouchID from 'react-native-touch-id'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Enter PIN Page
 */

type IProps = {
  openError: (type: string) => void
  storedPin: string
  pinCodeStatus: 'initial' | 'success' | 'failure' | 'locked'
  touchIDSentence: string
  title: string
  subtitle: string
}

type IState = {}

class PinCodeEnter extends React.PureComponent<IProps, IState> {

  componentDidMount() {
    TouchID.isSupported()
      .then(() => {
        setTimeout(() => {
          this.launchTouchID()
        })
      })
      .catch((error: any) => {
        console.warn('TouchID error', error)
      })
  }

  endProcess = (pinCode?: string) => {
    //this.props.renewAuthToken()
  }

  async launchTouchID() {
    try {
      await TouchID.authenticate('To unlock you application')
      const result: any = await Keychain.getGenericPassword()
      this.endProcess(result.password)
    } catch (e) {
      console.warn('TouchID error', e)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <PinCode
          endProcess={this.endProcess}
          sentenceTitle="Enter your PIN Code"
          subtitle={this.props.subtitle}
          status={PinStatus.enter}
          previousPin={this.props.storedPin}
          pinCodeStatus={this.props.pinCodeStatus}/>
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
