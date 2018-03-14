import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Choose PIN Page
 */

type IProps = {}

type IState = {
  status: PinStatus
  pinCode: string
}

class PinCodeChoose extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {status: PinStatus.choose, pinCode: ''}
    this.endProcessCreation = this.endProcessCreation.bind(this)
    this.endProcessConfirm = this.endProcessConfirm.bind(this)
  }

  endProcessCreation = (pinCode: string) => {
    this.setState({pinCode: pinCode, status: PinStatus.confirm})
  }

  endProcessConfirm = async (pinCode: string) => {
    if (pinCode === this.state.pinCode) {
      // authPin.pin = pinCode
      // this.props.navigation.state.params.createPreAccount()
      await Keychain.setGenericPassword('onboarding', pinCode)
      // this.props.navigation.navigate('pin-code-flow-end-pin', {changeProcess: this.props.navigation.state.params.changeProcess})
    } else {
      this.setState({status: PinStatus.choose})
    }
  }

  cancelConfirm = () => {
    this.setState({status: PinStatus.choose})
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.status === 'choose' &&
        <PinCode endProcess={this.endProcessCreation}
                 sentenceTitle="1 - Enter a PIN Code"
                 status={PinStatus.choose} subtitle="to keep your information secure"/>}
        {this.state.status === 'confirm' &&
        <PinCode endProcess={this.endProcessConfirm} sentenceTitle="2 - Confirm your PIN Code"
                 status={PinStatus.confirm} cancelFunction={this.cancelConfirm}
                 previousPin={this.state.pinCode}/>}
      </View>
    )
  }
}

export default PinCodeChoose

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
