import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Choose PIN Page
 */

export type IProps = {
  storePin: any
  titleEnter: string
  subtitleEnter: string
  titleConfirm: string
  subtitleConfirm: string
  sentenceTitle?: string
  buttonNumberComponent: any
  passwordLength?: number
  passwordComponent: any
  titleAttemptFailed?: string
  titleConfirmFailed?: string
  subtitleError?: string
  colorPassword?: string
  numbersButtonOverlayColor?: string
  buttonDeleteComponent: any
  titleComponent: any
  subtitleComponent: any
}

export type IState = {
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
      if (this.props.storePin) {
        this.props.storePin(pinCode)
      } else {
        await Keychain.setGenericPassword('reactNativePinCode', pinCode)
      }
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
        {this.state.status === PinStatus.choose &&
        <PinCode
          endProcess={this.endProcessCreation}
          sentenceTitle={this.props.titleEnter}
          status={PinStatus.choose}
          subtitle={this.props.subtitleEnter}
          buttonNumberComponent={this.props.buttonNumberComponent || null}
          passwordLength={this.props.passwordLength || 4}
          passwordComponent={this.props.passwordComponent || null}
          titleAttemptFailed={this.props.titleAttemptFailed || 'Incorrect PIN Code'}
          titleConfirmFailed={this.props.titleConfirmFailed || 'Your entries did not match'}
          subtitleError={this.props.subtitleError || 'Please try again'}
          colorPassword={this.props.colorPassword || undefined}
          numbersButtonOverlayColor={this.props.numbersButtonOverlayColor || undefined}
          buttonDeleteComponent={this.props.buttonDeleteComponent || null}
          titleComponent={this.props.titleComponent || null}
          subtitleComponent={this.props.subtitleComponent || null}/>}
        {this.state.status === PinStatus.confirm &&
        <PinCode
          endProcess={this.endProcessConfirm}
          sentenceTitle={this.props.titleConfirm}
          status={PinStatus.confirm}
          cancelFunction={this.cancelConfirm}
          subtitle={this.props.subtitleConfirm}
          buttonNumberComponent={this.props.buttonNumberComponent || null}
          passwordLength={this.props.passwordLength || 4}
          passwordComponent={this.props.passwordComponent || null}
          titleAttemptFailed={this.props.titleAttemptFailed || 'Incorrect PIN Code'}
          titleConfirmFailed={this.props.titleConfirmFailed || 'Your entries did not match'}
          subtitleError={this.props.subtitleError || 'Please try again'}
          colorPassword={this.props.colorPassword || undefined}
          numbersButtonOverlayColor={this.props.numbersButtonOverlayColor || undefined}
          buttonDeleteComponent={this.props.buttonDeleteComponent || null}
          titleComponent={this.props.titleComponent || null}
          subtitleComponent={this.props.subtitleComponent || null}/>}
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
