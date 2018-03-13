import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import PinCode, {PinStatus} from './PinCode'
import {authPin} from '../../../utils/constants'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Confirm PIN Page
 */

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<any>, NavigationAction>
}

type IState = {}

class PinCodeConfirm extends React.PureComponent<IProps, IState> {

  constructor() {
    super()
    this.endProcessConfirm = this.endProcessConfirm.bind(this)
  }

  endProcessConfirm = async (pinCode: string) => {
    if (pinCode === this.props.navigation.state.params.pinCode) {
      authPin.pin = pinCode
      await Keychain.setGenericPassword('onboarding', pinCode)
      setTimeout(() => {
        this.props.navigation.navigate('pin-code-flow-end-pin', {changeProcess: this.props.navigation.state.params.changeProcess})
      }, 700)
    } else {
      setTimeout(() => {
        this.props.navigation.navigate('pin-code-flow-choose-pin', {
          changeProcess: this.props.navigation.state.params.changeProcess,
          goBack: true
        })
      }, 1000)
    }
  }

  cancelConfirm = () => {
    this.props.navigation.navigate('pin-code-flow-choose-pin', {changeProcess: this.props.navigation.state.params.changeProcess})
  }

  render() {
    return (
      <View style={styles.container}>
        <PinCode endProcess={this.endProcessConfirm} sentenceTitle="2 - Confirm your PIN Code"
                 status={PinStatus.confirm} cancelFunction={this.cancelConfirm}
                 previousPin={this.props.navigation.state.params.pinCode}/>
      </View>
    )
  }
}

export default PinCodeConfirm

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
