/// <reference path='./src/types.d.ts'/>
import * as React from 'react'
import PinCodeChoose from './src/PinCodeChoose'
import {PinStatus} from './src/PinCode'
import PinCodeEnter from './src/PinCodeEnter'
import {View, StyleSheet, AsyncStorage, StyleProp, ViewStyle, TextStyle} from 'react-native'
import ApplicationLocked from './src/ApplicationLocked'

export type IProps = {
  buttonComponentLockedPage?: any
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  colorPassword?: string
  colorPasswordError?: string
  finishProcess?: any
  handleResultEnterPin?: any
  iconComponentLockedPage?: any
  iconButtonDeleteDisabled?: boolean
  lockedPage?: any
  maxAttempts?: number
  numbersButtonOverlayColor?: string
  onClickButtonLockedPage?: any
  passwordComponent?: any
  passwordLength?: number
  pinAttemptsAsyncStorageName?: string
  pinCodeKeychainName?: string
  pinStatus?: PinResultStatus
  status: 'choose' | 'enter' | 'locked'
  storedPin?: string
  storePin?: any
  styleMainContainer?: StyleProp<ViewStyle>
  stylePinCodeChooseContainer?: StyleProp<ViewStyle>
  stylePinCodeEnterContainer?: StyleProp<ViewStyle>
  styleLockScreenButton?: StyleProp<ViewStyle>
  styleLockScreenColorIcon?: string
  styleLockScreenMainContainer?: StyleProp<ViewStyle>
  styleLockScreenNameIcon?: string
  styleLockScreenSizeIcon?: number
  styleLockScreenText?: StyleProp<TextStyle>
  styleLockScreenTextButton?: StyleProp<TextStyle>
  styleLockScreenTextTimer?: StyleProp<TextStyle>
  styleLockScreenTitle?: StyleProp<TextStyle>
  styleLockScreenViewCloseButton?: StyleProp<ViewStyle>
  styleLockScreenViewIcon?: StyleProp<ViewStyle>
  styleLockScreenViewTextLock?: StyleProp<ViewStyle>
  styleLockScreenViewTimer?: StyleProp<ViewStyle>
  stylePinCodeButtonCircle?: StyleProp<ViewStyle>
  stylePinCodeButtonNumber?: string
  stylePinCodeButtonNumberPressed?: string
  stylePinCodeColorSubtitle?: string
  stylePinCodeColorSubtitleError?: string
  stylePinCodeColorTitle?: string
  stylePinCodeColorTitleError?: string
  stylePinCodeColumnButtons?: StyleProp<ViewStyle>
  stylePinCodeColumnDeleteButton?: StyleProp<ViewStyle>
  stylePinCodeDeleteButtonColorHideUnderlay?: string
  stylePinCodeDeleteButtonColorShowUnderlay?: string
  stylePinCodeDeleteButtonIcon?: string
  stylePinCodeDeleteButtonSize?: number
  stylePinCodeDeleteButtonText?: StyleProp<TextStyle>
  stylePinCodeEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeHiddenPasswordCircle?: StyleProp<ViewStyle>
  stylePinCodeMainContainer?: StyleProp<ViewStyle>
  stylePinCodeRowButtons?: StyleProp<ViewStyle>
  stylePinCodeTextButtonCircle?: StyleProp<TextStyle>
  stylePinCodeTextSubtitle?: StyleProp<TextStyle>
  stylePinCodeTextTitle?: StyleProp<TextStyle>
  stylePinCodeViewTitle?: StyleProp<TextStyle>
  subtitleChoose?: string
  subtitleComponent?: any
  subtitleConfirm?: string
  subtitleEnter?: string
  subtitleError?: string
  textButtonLockedPage?: string
  textDescriptionLockedPage?: string
  textTitleLockedPage?: string
  timeLocked?: number
  timePinLockedAsyncStorageName?: string
  timerComponentLockedPage?: any
  titleAttemptFailed?: string
  titleChoose?: string
  titleComponent?: any
  titleComponentLockedPage?: any
  titleConfirm?: string
  titleConfirmFailed?: string
  titleEnter?: string
  touchIDDisabled?: boolean
  touchIDSentence?: string
}

export type IState = {
  internalPinStatus: PinResultStatus
  pinLocked: boolean
}

export enum PinResultStatus {
  initial = 'initial',
  success = 'success',
  failure = 'failure',
  locked = 'locked'
}

const timePinLockedAsyncStorageNameDefault = 'timePinLockedRNPin'
const pinAttemptsAsyncStorageNameDefault = 'pinAttemptsRNPin'
const touchIDDisabledDefault = false

class PINCode extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {internalPinStatus: PinResultStatus.initial, pinLocked: false}
    this.changeInternalStatus = this.changeInternalStatus.bind(this)
    this.renderLockedPage = this.renderLockedPage.bind(this)
  }

  async componentWillMount() {
    await AsyncStorage.getItem(this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault).then((val) => {
      this.setState({pinLocked: !!val})
    })
  }

  changeInternalStatus = (status: PinResultStatus) => {
    if (status === PinResultStatus.initial) this.setState({pinLocked: false})
    this.setState({internalPinStatus: status})
  }

  renderLockedPage = () => {
    return (
      <ApplicationLocked
        timeToLock={this.props.timeLocked || 300000}
        textButton={this.props.textButtonLockedPage || 'Quit'}
        changeStatus={this.changeInternalStatus}
        textDescription={this.props.textDescriptionLockedPage || undefined}
        buttonComponent={this.props.buttonComponentLockedPage || null}
        timerComponent={this.props.timerComponentLockedPage || null}
        textTitle={this.props.textTitleLockedPage || undefined}
        titleComponent={this.props.titleComponentLockedPage || undefined}
        iconComponent={this.props.iconComponentLockedPage || null}
        timePinLockedAsyncStorageName={this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault}
        pinAttemptsAsyncStorageName={this.props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault}
        onClickButton={this.props.onClickButtonLockedPage || (() => {
          throw ('Quit application')
        })}
        styleButton={this.props.styleLockScreenButton}
        styleTextButton={this.props.styleLockScreenTextButton}
        styleViewTimer={this.props.styleLockScreenViewTimer}
        styleTextTimer={this.props.styleLockScreenTextTimer}
        styleTitle={this.props.styleLockScreenTitle}
        styleViewTextLock={this.props.styleLockScreenViewTextLock}
        styleViewIcon={this.props.styleLockScreenViewIcon}
        colorIcon={this.props.styleLockScreenColorIcon}
        nameIcon={this.props.styleLockScreenNameIcon}
        sizeIcon={this.props.styleLockScreenSizeIcon}
        styleMainContainer={this.props.styleLockScreenMainContainer}
        styleText={this.props.styleLockScreenText}
        styleViewButton={this.props.styleLockScreenViewCloseButton}/>
    )
  }

  render() {
    const {status, pinStatus, styleMainContainer} = this.props
    return (
      <View style={styleMainContainer ? styleMainContainer : styles.container}>
        {status === PinStatus.choose &&
        <PinCodeChoose
          storePin={this.props.storePin || null}
          titleChoose={this.props.titleChoose || '1 - Enter a PIN Code'}
          subtitleChoose={this.props.subtitleChoose || 'to keep your information secure'}
          titleConfirm={this.props.titleConfirm || '2 - Confirm your PIN Code'}
          subtitleConfirm={this.props.subtitleConfirm || ''}
          passwordComponent={this.props.passwordComponent}
          finishProcess={this.props.finishProcess || null}
          buttonNumberComponent={this.props.buttonNumberComponent}
          passwordLength={this.props.passwordLength}
          iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
          titleAttemptFailed={this.props.titleAttemptFailed}
          titleConfirmFailed={this.props.titleConfirmFailed}
          subtitleError={this.props.subtitleError}
          colorPassword={this.props.colorPassword}
          colorPasswordError={this.props.colorPasswordError}
          numbersButtonOverlayColor={this.props.numbersButtonOverlayColor}
          buttonDeleteComponent={this.props.buttonDeleteComponent}
          titleComponent={this.props.titleComponent}
          buttonDeleteText={this.props.buttonDeleteText}
          subtitleComponent={this.props.subtitleComponent}
          pinCodeKeychainName={this.props.pinCodeKeychainName || 'reactNativePinCode'}
          styleContainer={this.props.stylePinCodeChooseContainer}
          styleButtonCircle={this.props.stylePinCodeButtonCircle}
          styleTextButton={this.props.stylePinCodeTextButtonCircle}
          styleCircleHiddenPassword={this.props.stylePinCodeHiddenPasswordCircle}
          styleRowButtons={this.props.stylePinCodeRowButtons}
          styleColumnButtons={this.props.stylePinCodeColumnButtons}
          styleEmptyColumn={this.props.stylePinCodeEmptyColumn}
          styleViewTitle={this.props.stylePinCodeViewTitle}
          styleTextTitle={this.props.stylePinCodeTextTitle}
          styleTextSubtitle={this.props.stylePinCodeTextSubtitle}
          styleContainerPinCode={this.props.stylePinCodeMainContainer}
          styleColumnDeleteButton={this.props.stylePinCodeColumnDeleteButton}
          styleDeleteButtonColorShowUnderlay={this.props.stylePinCodeDeleteButtonColorShowUnderlay}
          styleDeleteButtonColorHideUnderlay={this.props.stylePinCodeDeleteButtonColorHideUnderlay}
          styleDeleteButtonIcon={this.props.stylePinCodeDeleteButtonIcon}
          styleDeleteButtonSize={this.props.stylePinCodeDeleteButtonSize}
          styleDeleteButtonText={this.props.stylePinCodeDeleteButtonText}
          styleColorTitle={this.props.stylePinCodeColorTitle}
          styleColorTitleError={this.props.stylePinCodeColorTitleError}
          styleColorSubtitle={this.props.stylePinCodeColorSubtitle}
          styleColorSubtitleError={this.props.stylePinCodeColorSubtitleError}
          styleColorButtonTitle={this.props.stylePinCodeButtonNumber}
          styleColorButtonTitleSelected={this.props.stylePinCodeButtonNumberPressed}
        />}
        {status === PinStatus.enter &&
        <PinCodeEnter
          title={this.props.titleEnter || 'Enter your PIN Code'}
          subtitle={this.props.subtitleEnter || ''}
          handleResult={this.props.handleResultEnterPin || null}
          maxAttempts={this.props.maxAttempts || 3}
          changeInternalStatus={this.changeInternalStatus}
          buttonDeleteText={this.props.buttonDeleteText}
          pinStatusExternal={this.props.pinStatus || PinResultStatus.initial}
          storedPin={this.props.storedPin || null}
          touchIDSentence={this.props.touchIDSentence || 'To unlock your application'}
          status={PinStatus.enter}
          finishProcess={this.props.finishProcess || null}
          buttonNumberComponent={this.props.buttonNumberComponent}
          passwordLength={this.props.passwordLength}
          passwordComponent={this.props.passwordComponent}
          titleAttemptFailed={this.props.titleAttemptFailed}
          titleConfirmFailed={this.props.titleConfirmFailed}
          iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
          subtitleError={this.props.subtitleError}
          touchIDDisabled={this.props.touchIDDisabled || touchIDDisabledDefault}
          colorPassword={this.props.colorPassword}
          colorPasswordError={this.props.colorPasswordError}
          numbersButtonOverlayColor={this.props.numbersButtonOverlayColor}
          buttonDeleteComponent={this.props.buttonDeleteComponent}
          titleComponent={this.props.titleComponent}
          subtitleComponent={this.props.subtitleComponent}
          timePinLockedAsyncStorageName={this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault}
          pinAttemptsAsyncStorageName={this.props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault}
          styleContainer={this.props.stylePinCodeEnterContainer}
          styleButtonCircle={this.props.stylePinCodeButtonCircle}
          styleTextButton={this.props.stylePinCodeTextButtonCircle}
          styleCircleHiddenPassword={this.props.stylePinCodeHiddenPasswordCircle}
          styleRowButtons={this.props.stylePinCodeRowButtons}
          styleColumnButtons={this.props.stylePinCodeColumnButtons}
          styleEmptyColumn={this.props.stylePinCodeEmptyColumn}
          styleViewTitle={this.props.stylePinCodeViewTitle}
          styleTextTitle={this.props.stylePinCodeTextTitle}
          styleTextSubtitle={this.props.stylePinCodeTextSubtitle}
          styleContainerPinCode={this.props.stylePinCodeMainContainer}
          styleColumnDeleteButton={this.props.stylePinCodeColumnDeleteButton}
          styleDeleteButtonColorShowUnderlay={this.props.stylePinCodeDeleteButtonColorShowUnderlay}
          styleDeleteButtonColorHideUnderlay={this.props.stylePinCodeDeleteButtonColorHideUnderlay}
          styleDeleteButtonIcon={this.props.stylePinCodeDeleteButtonIcon}
          styleDeleteButtonSize={this.props.stylePinCodeDeleteButtonSize}
          styleDeleteButtonText={this.props.stylePinCodeDeleteButtonText}
          styleColorTitle={this.props.stylePinCodeColorTitle}
          styleColorTitleError={this.props.stylePinCodeColorTitleError}
          styleColorSubtitle={this.props.stylePinCodeColorSubtitle}
          styleColorSubtitleError={this.props.stylePinCodeColorSubtitleError}
          styleColorButtonTitle={this.props.stylePinCodeButtonNumber}
          styleColorButtonTitleSelected={this.props.stylePinCodeButtonNumberPressed}
        />}
        {(pinStatus === PinResultStatus.locked ||
          this.state.internalPinStatus === PinResultStatus.locked ||
          this.state.pinLocked) &&
        (this.props.lockedPage ? this.props.lockedPage() : this.renderLockedPage())}
      </View>
    )
  }
}

export default PINCode

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
