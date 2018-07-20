import * as React from 'react'
import {AsyncStorage, StyleProp, StyleSheet, TextStyle, View, ViewStyle} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import TouchID from 'react-native-touch-id'
import * as Keychain from 'react-native-keychain'
import {PinResultStatus} from '../index'

/**
 * Pin Code Enter PIN Page
 */

export type IProps = {
  storedPin: string | null
  touchIDSentence: string
  handleResult: any
  title: string
  subtitle: string
  maxAttempts: number
  pinStatusExternal: PinResultStatus
  changeInternalStatus: (status: PinResultStatus) => void
  status: PinStatus
  buttonNumberComponent: any
  passwordLength?: number
  passwordComponent: any
  titleAttemptFailed?: string
  finishProcess?: any
  iconButtonDeleteDisabled?: boolean
  titleConfirmFailed?: string
  subtitleError?: string
  buttonDeleteText?: string
  colorPassword?: string
  colorPasswordError?: string
  numbersButtonOverlayColor?: string
  buttonDeleteComponent: any
  titleComponent: any
  subtitleComponent: any
  timePinLockedAsyncStorageName: string
  pinAttemptsAsyncStorageName: string
  touchIDDisabled: boolean
  styleContainerPinCode?: StyleProp<ViewStyle>
  styleColorTitle?: string
  styleColorTitleError?: string
  styleColorSubtitle?: string
  styleColorSubtitleError?: string
  styleButtonCircle?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleRowButtons?: StyleProp<ViewStyle>
  styleColumnButtons?: StyleProp<ViewStyle>
  styleEmptyColumn?: StyleProp<ViewStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleContainer?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleDeleteButtonColorShowUnderlay?: string
  styleDeleteButtonColorHideUnderlay?: string
  styleDeleteButtonIcon?: string
  styleDeleteButtonSize?: number
  styleDeleteButtonText?: StyleProp<TextStyle>
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
}

export type IState = {
  pinCodeStatus: PinResultStatus
  locked: boolean
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
    if (!this.props.storedPin) {
      this.keyChainResult = await Keychain.getGenericPassword()
    }
  }

  componentDidMount() {
    if (!this.props.touchIDDisabled) {
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
  }

  endProcess = async (pinCode?: string) => {
    if (this.props.handleResult) {
      this.props.handleResult(pinCode)
      return
    }
    this.setState({pinCodeStatus: PinResultStatus.initial})
    this.props.changeInternalStatus(PinResultStatus.initial)
    const pinAttemptsStr = await AsyncStorage.getItem(this.props.pinAttemptsAsyncStorageName)
    let pinAttempts = +pinAttemptsStr
    const pin = this.props.storedPin || this.keyChainResult.password
    if (pin === pinCode) {
      this.setState({pinCodeStatus: PinResultStatus.success})
      AsyncStorage.multiRemove([this.props.pinAttemptsAsyncStorageName, this.props.timePinLockedAsyncStorageName])
      this.props.changeInternalStatus(PinResultStatus.success)
      if (this.props.finishProcess) this.props.finishProcess()
    } else {
      pinAttempts++
      if (+pinAttempts >= this.props.maxAttempts) {
        await AsyncStorage.setItem(this.props.timePinLockedAsyncStorageName, new Date().toISOString())
        this.setState({locked: true, pinCodeStatus: PinResultStatus.locked})
        this.props.changeInternalStatus(PinResultStatus.locked)
      } else {
        await AsyncStorage.setItem(this.props.pinAttemptsAsyncStorageName, pinAttempts.toString())
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
    const pin = this.props.storedPin || (this.keyChainResult && this.keyChainResult.password)
    return (
      <View style={this.props.styleContainer ? this.props.styleContainer : styles.container}>
        <PinCode
          endProcess={this.endProcess}
          sentenceTitle={this.props.title}
          subtitle={this.props.subtitle}
          status={PinStatus.enter}
          previousPin={pin}
          pinCodeStatus={this.state.pinCodeStatus}
          buttonNumberComponent={this.props.buttonNumberComponent || null}
          passwordLength={this.props.passwordLength || 4}
          iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
          passwordComponent={this.props.passwordComponent || null}
          titleAttemptFailed={this.props.titleAttemptFailed || 'Incorrect PIN Code'}
          titleConfirmFailed={this.props.titleConfirmFailed || 'Your entries did not match'}
          subtitleError={this.props.subtitleError || 'Please try again'}
          colorPassword={this.props.colorPassword || undefined}
          colorPasswordError={this.props.colorPasswordError || undefined}
          numbersButtonOverlayColor={this.props.numbersButtonOverlayColor || undefined}
          buttonDeleteComponent={this.props.buttonDeleteComponent || null}
          titleComponent={this.props.titleComponent || null}
          subtitleComponent={this.props.subtitleComponent || null}
          styleButtonCircle={this.props.styleButtonCircle}
          buttonDeleteText={this.props.buttonDeleteText}
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
          styleColorTitle={this.props.styleColorTitle}
          styleColorTitleError={this.props.styleColorTitleError}
          styleColorSubtitle={this.props.styleColorSubtitle}
          styleColorSubtitleError={this.props.styleColorSubtitleError}
          styleDeleteButtonText={this.props.styleDeleteButtonText}
          styleColorButtonTitle={this.props.styleColorButtonTitle}
          styleColorButtonTitleSelected={this.props.styleColorButtonTitleSelected}/>
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
