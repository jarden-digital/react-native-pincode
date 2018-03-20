import * as React from 'react'
import {AsyncStorage, StyleSheet, View} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import * as TouchID from 'react-native-touch-id'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Enter PIN Page
 */

export type IProps = {
  openError: (type: string) => void
  storedPin: string | null
  touchIDSentence: string
  handleResult: any
  title: string
  subtitle: string
  maxAttempts: number
  pinStatusExternal: PinResultStatus
  changeInternalStatus: (status: PinResultStatus) => void
}

export type IState = {
  pinCodeStatus: PinResultStatus
  locked: boolean
}

export enum PinResultStatus {
  initial = 'initial',
  success = 'success',
  failure = 'failure',
  locked = 'locked'
}

class PinCodeEnter extends React.PureComponent<IProps, IState> {
  keyChainResult: any

  constructor(props: IProps) {
    super(props)
    this.state = {pinCodeStatus: PinResultStatus.initial, locked: false}
    this.endProcess = this.endProcess.bind(this)
    this.launchTouchID = this.launchTouchID.bind(this)
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (nextProps.pinStatusExternal !== this.props.pinStatusExternal) {
      this.setState({pinCodeStatus: nextProps.pinStatusExternal})
    }
  }

  async componentWillMount() {
    this.keyChainResult = await Keychain.getGenericPassword()
  }

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

  endProcess = async (pinCode?: string) => {
    if (this.props.handleResult) {
      this.props.handleResult(pinCode)
      return
    }
    let pinAttempts = await +AsyncStorage.getItem('pinAttemptsRNPin') || 0
    const pin = this.props.storedPin || this.keyChainResult.password
    if (pin === pinCode) {
      this.setState({pinCodeStatus: PinResultStatus.success})
      this.props.changeInternalStatus(PinResultStatus.success)
      AsyncStorage.multiRemove(['pinAttemptsRNPin', 'timePinLocked'])
    } else {
      pinAttempts++
      if (pinAttempts >= this.props.maxAttempts) {
        await AsyncStorage.setItem('timePinLocked', new Date().toISOString())
        this.setState({locked: true, pinCodeStatus: PinResultStatus.locked})
        this.props.changeInternalStatus(PinResultStatus.locked)
      } else {
        AsyncStorage.setItem('reactNativePinCode', pinAttempts.toString())
        this.setState({pinCodeStatus: PinResultStatus.failure})
        this.props.changeInternalStatus(PinResultStatus.failure)
      }
    }
  }

  async launchTouchID() {
    try {
      await TouchID.authenticate(this.props.touchIDSentence)
      this.endProcess(this.props.storedPin || this.keyChainResult.password)
    } catch (e) {
      console.warn('TouchID error', e)
    }
  }

  render() {
    const pin = this.props.storedPin || this.keyChainResult.password
    return (
      <View style={styles.container}>
        <PinCode
          endProcess={this.endProcess}
          sentenceTitle={this.props.title}
          subtitle={this.props.subtitle}
          status={PinStatus.enter}
          previousPin={pin}
          pinCodeStatus={this.state.pinCodeStatus}/>
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
