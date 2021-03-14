import delay from './delay'
import PinCode, { PinStatus } from './PinCode'
import { PinResultStatus, noBiometricsConfig } from './utils'

import AsyncStorage from '@react-native-community/async-storage'
import * as React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from 'react-native'
import * as Keychain from 'react-native-keychain'
import TouchID from 'react-native-touch-id'

/**
 * Pin Code Enter PIN Page
 */

export interface IProps {
  alphabetCharsVisible?: boolean
  buttonDeleteComponent: any
  buttonDeleteText?: string
  buttonNumberComponent: any
  callbackErrorTouchId?: (e: Error) => void
  changeInternalStatus: (status: PinResultStatus) => void
  colorCircleButtons?: string
  colorPassword?: string
  colorPasswordEmpty?: string
  colorPasswordError?: string
  customBackSpaceIcon?: any
  disableLockScreen: boolean
  emptyColumnComponent: any
  endProcessFunction?: (pinCode: string) => void
  finishProcess?: (pinCode: string) => void
  getCurrentLength?: (length: number) => void
  handleResult: any
  iconButtonDeleteDisabled?: boolean
  maxAttempts: number
  numbersButtonOverlayColor?: string
  onFail?: any
  passwordComponent: any
  passwordLength?: number
  pinAttemptsAsyncStorageName: string
  pinCodeKeychainName: string
  pinCodeVisible?: boolean
  pinStatusExternal: PinResultStatus
  status: PinStatus
  storedPin: string | null
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
  styleContainer?: StyleProp<ViewStyle>
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
  subtitle: string
  subtitleComponent: any
  subtitleError?: string
  textCancelButtonTouchID?: string
  textPasswordVisibleFamily?: string
  textPasswordVisibleSize?: number
  timePinLockedAsyncStorageName: string
  title: string
  titleAttemptFailed?: string
  titleComponent: any
  titleConfirmFailed?: string
  touchIDDisabled: boolean
  touchIDSentence: string
  touchIDTitle?: string
  passcodeFallback?: boolean
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number
}

export interface IState {
  pinCodeStatus: PinResultStatus
  locked: boolean
}

class PinCodeEnter extends React.PureComponent<IProps, IState> {
  keyChainResult: string | undefined = undefined

  static defaultProps = {
    passcodeFallback: true,
    styleContainer: null
  }

  constructor(props: IProps) {
    super(props)
    this.state = { pinCodeStatus: PinResultStatus.initial, locked: false }
    this.endProcess = this.endProcess.bind(this)
    this.launchTouchID = this.launchTouchID.bind(this)
    if (!this.props.storedPin) {
      Keychain.getInternetCredentials(
        this.props.pinCodeKeychainName,
        noBiometricsConfig
      ).then(result => {
        this.keyChainResult = result && result.password || undefined
      }).catch(error => {
        console.log('PinCodeEnter: ', error)
      })
    }
  }

  componentDidMount() {
    if (!this.props.touchIDDisabled) this.triggerTouchID()
  }

  componentDidUpdate(
    prevProps: Readonly<IProps>,
    prevState: Readonly<IState>,
    prevContext: any
  ): void {
    if (prevProps.pinStatusExternal !== this.props.pinStatusExternal) {
      this.setState({ pinCodeStatus: this.props.pinStatusExternal })
    }
    if (prevProps.touchIDDisabled && !this.props.touchIDDisabled) {
      this.triggerTouchID()
    }
  }

  triggerTouchID() {
    !!TouchID && TouchID.isSupported()
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
    if (!!this.props.endProcessFunction) {
      this.props.endProcessFunction(pinCode as string)
    } else {
      let pinValidOverride = undefined;
      if (this.props.handleResult) {
        pinValidOverride = await Promise.resolve(this.props.handleResult(pinCode));
      }
      this.setState({ pinCodeStatus: PinResultStatus.initial })
      this.props.changeInternalStatus(PinResultStatus.initial)
      const pinAttemptsStr = await AsyncStorage.getItem(
        this.props.pinAttemptsAsyncStorageName
      )
      let pinAttempts = pinAttemptsStr ? +pinAttemptsStr : 0
      const pin = this.props.storedPin || this.keyChainResult
      if (pinValidOverride !== undefined ? pinValidOverride : pin === pinCode) {
        this.setState({ pinCodeStatus: PinResultStatus.success })
        AsyncStorage.multiRemove([
          this.props.pinAttemptsAsyncStorageName,
          this.props.timePinLockedAsyncStorageName
        ])
        this.props.changeInternalStatus(PinResultStatus.success)
        if (!!this.props.finishProcess)
          this.props.finishProcess(pinCode as string)
      } else {
        pinAttempts++
        if (
          +pinAttempts >= this.props.maxAttempts &&
          !this.props.disableLockScreen
        ) {
          await AsyncStorage.setItem(
            this.props.timePinLockedAsyncStorageName,
            new Date().toISOString()
          )
          this.setState({ locked: true, pinCodeStatus: PinResultStatus.locked })
          this.props.changeInternalStatus(PinResultStatus.locked)
        } else {
          await AsyncStorage.setItem(
            this.props.pinAttemptsAsyncStorageName,
            pinAttempts.toString()
          )
          this.setState({ pinCodeStatus: PinResultStatus.failure })
          this.props.changeInternalStatus(PinResultStatus.failure)
        }
        if (this.props.onFail) {
          await delay(1500)
          this.props.onFail(pinAttempts)
        }
      }
    }
  }

  async launchTouchID() {
    const optionalConfigObject = {
      imageColor: '#e00606',
      imageErrorColor: '#ff0000',
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      cancelText: this.props.textCancelButtonTouchID || 'Cancel',
      fallbackLabel: 'Show Passcode',
      unifiedErrors: false,
      passcodeFallback: this.props.passcodeFallback
    }
    try {
      await TouchID.authenticate(
        this.props.touchIDSentence,
        Object.assign({}, optionalConfigObject, {
          title: this.props.touchIDTitle
        })
      ).then((success: any) => {
        this.endProcess(this.props.storedPin || this.keyChainResult)
      })
    } catch (e) {
      if (!!this.props.callbackErrorTouchId) {
        this.props.callbackErrorTouchId(e)
      } else {
        console.log('TouchID error', e)
      }
    }
  }

  render() {
    const pin =
      this.props.storedPin || this.keyChainResult
    return (
      <View
        style={[
          styles.container,
          this.props.styleContainer
        ]}>
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
          endProcess={this.endProcess}
          launchTouchID={this.launchTouchID}
          getCurrentLength={this.props.getCurrentLength}
          iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
          numbersButtonOverlayColor={
            this.props.numbersButtonOverlayColor || undefined
          }
          passwordComponent={this.props.passwordComponent || null}
          passwordLength={this.props.passwordLength || 4}
          pinCodeStatus={this.state.pinCodeStatus}
          pinCodeVisible={this.props.pinCodeVisible}
          previousPin={pin}
          sentenceTitle={this.props.title}
          status={PinStatus.enter}
          styleAlphabet={this.props.styleAlphabet}
          styleButtonCircle={this.props.styleButtonCircle}
          styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
          styleCircleSizeEmpty={this.props.styleCircleSizeEmpty}
          styleCircleSizeFull={this.props.styleCircleSizeFull}
          styleColumnButtons={this.props.styleColumnButtons}
          styleColumnDeleteButton={this.props.styleColumnDeleteButton}
          styleColorButtonTitle={this.props.styleColorButtonTitle}
          styleColorButtonTitleSelected={
            this.props.styleColorButtonTitleSelected
          }
          styleColorSubtitle={this.props.styleColorSubtitle}
          styleColorSubtitleError={this.props.styleColorSubtitleError}
          styleColorTitle={this.props.styleColorTitle}
          styleColorTitleError={this.props.styleColorTitleError}
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
          subtitle={this.props.subtitle}
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
          vibrationEnabled={this.props.vibrationEnabled}
          delayBetweenAttempts={this.props.delayBetweenAttempts}
        />
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

export default PinCodeEnter
