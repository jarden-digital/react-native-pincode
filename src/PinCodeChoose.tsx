import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Choose PIN Page
 */

export type IProps = {
  storePin: any
  titleChoose: string
  subtitleChoose: string
  titleConfirm: string
  subtitleConfirm: string
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
  pinCodeKeychainName: string
  styleContainer?: any
  styleButtonCircle?: any
  styleTextButton?: any
  styleCircleHiddenPassword?: any
  styleRowButtons?: any
  styleColumnButtons?: any
  styleEmptyColumn?: any
  styleViewTitle?: any
  styleTextTitle?: any
  styleTextSubtitle?: any
  styleContainerPinCode?: any
  styleColumnDeleteButton?: any
  styleDeleteButtonColorShowUnderlay?: string
  styleDeleteButtonColorHideUnderlay?: string
  styleDeleteButtonIcon?: string
  styleDeleteButtonSize?: number
  styleDeleteButtonText?: any
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
        await Keychain.setGenericPassword(this.props.pinCodeKeychainName, pinCode)
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
      <View style={this.props.styleContainer ? this.props.styleContainer : styles.container}>
        {this.state.status === PinStatus.choose &&
        <PinCode
          endProcess={this.endProcessCreation}
          sentenceTitle={this.props.titleChoose}
          status={PinStatus.choose}
          subtitle={this.props.subtitleChoose}
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
          subtitleComponent={this.props.subtitleComponent || null}
          styleButtonCircle={this.props.styleButtonCircle}
          styleTextButton={this.props.styleTextButton}
          styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
          styleRowButtons={this.props.styleRowButtons}
          styleColumnButtons={this.props.styleColumnButtons}
          styleEmptyColumn={this.props.styleEmptyColumn}
          styleViewTitle={this.props.styleViewTitle}
          styleTextTitle={this.props.styleTextTitle}
          styleTextSubtitle={this.props.styleTextSubtitle}
          styleContainer={this.props.styleContainerPinCode}
          styleColumnDeleteButton={this.props.styleColumnDeleteButton}
          styleDeleteButtonColorShowUnderlay={this.props.styleDeleteButtonColorShowUnderlay}
          styleDeleteButtonColorHideUnderlay={this.props.styleDeleteButtonColorHideUnderlay}
          styleDeleteButtonIcon={this.props.styleDeleteButtonIcon}
          styleDeleteButtonSize={this.props.styleDeleteButtonSize}
          styleDeleteButtonText={this.props.styleDeleteButtonText}/>}
        {this.state.status === PinStatus.confirm &&
        <PinCode
          endProcess={this.endProcessConfirm}
          sentenceTitle={this.props.titleConfirm}
          status={PinStatus.confirm}
          cancelFunction={this.cancelConfirm}
          subtitle={this.props.subtitleConfirm}
          previousPin={this.state.pinCode}
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
          subtitleComponent={this.props.subtitleComponent || null}
          styleButtonCircle={this.props.styleButtonCircle}
          styleTextButton={this.props.styleTextButton}
          styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
          styleRowButtons={this.props.styleRowButtons}
          styleColumnButtons={this.props.styleColumnButtons}
          styleEmptyColumn={this.props.styleEmptyColumn}
          styleViewTitle={this.props.styleViewTitle}
          styleTextTitle={this.props.styleTextTitle}
          styleTextSubtitle={this.props.styleTextSubtitle}
          styleContainer={this.props.styleContainerPinCode}
          styleColumnDeleteButton={this.props.styleColumnDeleteButton}
          styleDeleteButtonColorShowUnderlay={this.props.styleDeleteButtonColorShowUnderlay}
          styleDeleteButtonColorHideUnderlay={this.props.styleDeleteButtonColorHideUnderlay}
          styleDeleteButtonIcon={this.props.styleDeleteButtonIcon}
          styleDeleteButtonSize={this.props.styleDeleteButtonSize}
          styleDeleteButtonText={this.props.styleDeleteButtonText}/>}
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
