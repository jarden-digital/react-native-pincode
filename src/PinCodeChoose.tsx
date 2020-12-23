import PinCode, { PinStatus } from './PinCode'
import { noBiometricsConfig } from './utils'

import * as React from 'react'
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Choose PIN Page
 */

export interface IProps {
  alphabetCharsVisible?: boolean
  buttonDeleteComponent: any
  buttonDeleteText?: string
  buttonNumberComponent: any
  colorCircleButtons?: string
  colorPassword?: string
  colorPasswordEmpty?: string
  colorPasswordError?: string
  customBackSpaceIcon?: any
  emptyColumnComponent: any
  finishProcess?: (pinCode: string) => void
  getCurrentLength?: (length: number) => void
  iconButtonDeleteDisabled?: boolean
  numbersButtonOverlayColor?: string
  passwordComponent: any
  passwordLength?: number
  pinCodeKeychainName: string
  pinCodeVisible?: boolean
  storePin: any
  styleAlphabet?: StyleProp<TextStyle>
  styleButtonCircle?: StyleProp<ViewStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
  styleColorSubtitle?: string
  styleColorSubtitleError?: string
  styleColorTitle?: string
  styleColorTitleError?: string
  styleColumnButtons?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleContainer: StyleProp<ViewStyle>
  styleContainerPinCode?: StyleProp<ViewStyle>
  styleDeleteButtonColorHideUnderlay?: string
  styleDeleteButtonColorShowUnderlay?: string
  styleDeleteButtonIcon?: string
  styleDeleteButtonSize?: number
  styleDeleteButtonText?: StyleProp<TextStyle>
  styleEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeCircle?: StyleProp<ViewStyle>
  styleRowButtons?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  subtitleChoose: string
  subtitleComponent: any
  subtitleConfirm: string
  subtitleError?: string
  textPasswordVisibleFamily?: string
  textPasswordVisibleSize?: number
  titleAttemptFailed?: string
  titleChoose: string
  titleComponent: any
  titleConfirm: string
  titleConfirmFailed?: string
  titleValidationFailed?: string
  validationRegex?: RegExp
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number
}

export type IState = {
  status: PinStatus
  pinCode: string
}

class PinCodeChoose extends React.PureComponent<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    styleContainer: null
  }
  constructor(props: IProps) {
    super(props)
    this.state = { status: PinStatus.choose, pinCode: '' }
    this.endProcessCreation = this.endProcessCreation.bind(this)
    this.endProcessConfirm = this.endProcessConfirm.bind(this)
  }

  endProcessCreation = (pinCode: string, isErrorValidation?: boolean) => {
    this.setState({
      pinCode: isErrorValidation ? '' : pinCode,
      status: isErrorValidation ? PinStatus.choose : PinStatus.confirm
    })
  }

  endProcessConfirm = async (pinCode: string) => {
    if (pinCode === this.state.pinCode) {
      if (this.props.storePin) {
        this.props.storePin(pinCode)
      } else {
        await Keychain.setInternetCredentials(
          this.props.pinCodeKeychainName,
          this.props.pinCodeKeychainName,
          pinCode,
          noBiometricsConfig
        )
      }
      if (!!this.props.finishProcess) this.props.finishProcess(pinCode)
    } else {
      this.setState({ status: PinStatus.choose })
    }
  }

  cancelConfirm = () => {
    this.setState({ status: PinStatus.choose })
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          this.props.styleContainer
        ]}>
        {this.state.status === PinStatus.choose && (
          <PinCode
            alphabetCharsVisible={this.props.alphabetCharsVisible}
            buttonDeleteComponent={this.props.buttonDeleteComponent || null}
            buttonDeleteText={this.props.buttonDeleteText}
            buttonNumberComponent={this.props.buttonNumberComponent || null}
            colorCircleButtons={this.props.colorCircleButtons}
            colorPassword={this.props.colorPassword || undefined}
            colorPasswordEmpty={this.props.colorPasswordEmpty}
            colorPasswordError={this.props.colorPasswordError || undefined}
            customBackSpaceIcon={this.props.customBackSpaceIcon}
            emptyColumnComponent={this.props.emptyColumnComponent}
            endProcess={this.endProcessCreation}
            getCurrentLength={this.props.getCurrentLength}
            iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
            numbersButtonOverlayColor={
              this.props.numbersButtonOverlayColor || undefined
            }
            passwordComponent={this.props.passwordComponent || null}
            passwordLength={this.props.passwordLength || 4}
            pinCodeVisible={this.props.pinCodeVisible}
            sentenceTitle={this.props.titleChoose}
            status={PinStatus.choose}
            styleAlphabet={this.props.styleAlphabet}
            styleButtonCircle={this.props.styleButtonCircle}
            styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
            styleCircleSizeEmpty={this.props.styleCircleSizeEmpty}
            styleCircleSizeFull={this.props.styleCircleSizeFull}
            styleColorButtonTitle={this.props.styleColorButtonTitle}
            styleColorButtonTitleSelected={
              this.props.styleColorButtonTitleSelected
            }
            styleColorSubtitle={this.props.styleColorSubtitle}
            styleColorSubtitleError={this.props.styleColorSubtitleError}
            styleColorTitle={this.props.styleColorTitle}
            styleColorTitleError={this.props.styleColorTitleError}
            styleColumnButtons={this.props.styleColumnButtons}
            styleColumnDeleteButton={this.props.styleColumnDeleteButton}
            styleContainer={this.props.styleContainerPinCode}
            styleDeleteButtonColorHideUnderlay={
              this.props.styleDeleteButtonColorHideUnderlay
            }
            styleDeleteButtonColorShowUnderlay={
              this.props.styleDeleteButtonColorShowUnderlay
            }
            styleDeleteButtonIcon={this.props.styleDeleteButtonIcon}
            styleDeleteButtonSize={this.props.styleDeleteButtonSize}
            styleDeleteButtonText={this.props.styleDeleteButtonText}
            styleEmptyColumn={this.props.styleEmptyColumn}
            stylePinCodeCircle={this.props.stylePinCodeCircle}
            styleRowButtons={this.props.styleRowButtons}
            styleTextButton={this.props.styleTextButton}
            styleTextSubtitle={this.props.styleTextSubtitle}
            styleTextTitle={this.props.styleTextTitle}
            styleViewTitle={this.props.styleViewTitle}
            subtitle={this.props.subtitleChoose}
            subtitleComponent={this.props.subtitleComponent || null}
            subtitleError={this.props.subtitleError || 'Please try again'}
            textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
            textPasswordVisibleSize={this.props.textPasswordVisibleSize}
            titleComponent={this.props.titleComponent || null}
            titleValidationFailed={
              this.props.titleValidationFailed || 'PIN code unsafe'
            }
            validationRegex={this.props.validationRegex}
            vibrationEnabled={this.props.vibrationEnabled}
          />
        )}
        {this.state.status === PinStatus.confirm && (
          <PinCode
            alphabetCharsVisible={this.props.alphabetCharsVisible}
            buttonDeleteComponent={this.props.buttonDeleteComponent || null}
            buttonDeleteText={this.props.buttonDeleteText}
            buttonNumberComponent={this.props.buttonNumberComponent || null}
            cancelFunction={this.cancelConfirm}
            colorCircleButtons={this.props.colorCircleButtons}
            colorPassword={this.props.colorPassword || undefined}
            colorPasswordEmpty={this.props.colorPasswordEmpty}
            colorPasswordError={this.props.colorPasswordError || undefined}
            customBackSpaceIcon={this.props.customBackSpaceIcon}
            emptyColumnComponent={this.props.emptyColumnComponent}
            endProcess={this.endProcessConfirm}
            getCurrentLength={this.props.getCurrentLength}
            iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
            numbersButtonOverlayColor={
              this.props.numbersButtonOverlayColor || undefined
            }
            passwordComponent={this.props.passwordComponent || null}
            passwordLength={this.props.passwordLength || 4}
            pinCodeVisible={this.props.pinCodeVisible}
            previousPin={this.state.pinCode}
            sentenceTitle={this.props.titleConfirm}
            status={PinStatus.confirm}
            subtitle={this.props.subtitleConfirm}
            subtitleComponent={this.props.subtitleComponent || null}
            subtitleError={this.props.subtitleError || 'Please try again'}
            textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
            textPasswordVisibleSize={this.props.textPasswordVisibleSize}
            titleAttemptFailed={
              this.props.titleAttemptFailed || 'Incorrect PIN Code'
            }
            titleComponent={this.props.titleComponent || null}
            titleConfirmFailed={
              this.props.titleConfirmFailed || 'Your entries did not match'
            }
            styleAlphabet={this.props.styleAlphabet}
            styleButtonCircle={this.props.styleButtonCircle}
            styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
            styleCircleSizeEmpty={this.props.styleCircleSizeEmpty}
            styleCircleSizeFull={this.props.styleCircleSizeFull}
            styleColorButtonTitle={this.props.styleColorButtonTitle}
            styleColorButtonTitleSelected={
              this.props.styleColorButtonTitleSelected
            }
            styleColorSubtitle={this.props.styleColorSubtitle}
            styleColorSubtitleError={this.props.styleColorSubtitleError}
            styleColorTitle={this.props.styleColorTitle}
            styleColorTitleError={this.props.styleColorTitleError}
            styleColumnButtons={this.props.styleColumnButtons}
            styleColumnDeleteButton={this.props.styleColumnDeleteButton}
            styleContainer={this.props.styleContainerPinCode}
            styleDeleteButtonColorHideUnderlay={
              this.props.styleDeleteButtonColorHideUnderlay
            }
            styleDeleteButtonColorShowUnderlay={
              this.props.styleDeleteButtonColorShowUnderlay
            }
            styleDeleteButtonIcon={this.props.styleDeleteButtonIcon}
            styleDeleteButtonSize={this.props.styleDeleteButtonSize}
            styleDeleteButtonText={this.props.styleDeleteButtonText}
            styleEmptyColumn={this.props.styleEmptyColumn}
            stylePinCodeCircle={this.props.stylePinCodeCircle}
            styleRowButtons={this.props.styleRowButtons}
            styleTextButton={this.props.styleTextButton}
            styleTextSubtitle={this.props.styleTextSubtitle}
            styleTextTitle={this.props.styleTextTitle}
            styleViewTitle={this.props.styleViewTitle}
            vibrationEnabled={this.props.vibrationEnabled}
            delayBetweenAttempts={this.props.delayBetweenAttempts}
          />
        )}
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default PinCodeChoose
