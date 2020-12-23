import ApplicationLocked from "./src/ApplicationLocked";
import { PinStatus } from "./src/PinCode";
import PinCodeChoose from "./src/PinCodeChoose";
import PinCodeEnter from "./src/PinCodeEnter";
import { hasPinCode, deletePinCode, resetInternalStates, PinResultStatus } from "./src/utils";

import AsyncStorage from '@react-native-community/async-storage'
import * as React from "react";
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle } from "react-native";

export type IProps = {
  alphabetCharsVisible?: boolean
  bottomLeftComponent?: any
  buttonComponentLockedPage?: any
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  callbackErrorTouchId?: (error: Error) => void
  colorCircleButtons?: string
  colorPassword?: string
  colorPasswordEmpty?: string
  colorPasswordError?: string
  customBackSpaceIcon?: any
  disableLockScreen?: boolean
  endProcessFunction?: (pinCode: string) => void
  finishProcess?: (pinCode?: string) => void
  getCurrentPinLength?: (length: number) => void
  handleResultEnterPin?: any
  iconComponentLockedPage?: any
  iconButtonDeleteDisabled?: boolean
  lockedIconComponent?: any
  lockedPage?: any
  maxAttempts?: number
  numbersButtonOverlayColor?: string
  onClickButtonLockedPage?: any
  onFail?: any
  passwordComponent?: any
  passwordLength?: number
  pinAttemptsAsyncStorageName?: string
  pinCodeKeychainName?: string
  pinCodeVisible?: boolean
  pinStatus?: PinResultStatus
  status: "choose" | "enter" | "locked"
  storedPin?: string
  storePin?: any
  styleAlphabet?: StyleProp<TextStyle>
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
  stylePinCodeCircle?: StyleProp<ViewStyle>
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
  stylePinCodeHiddenPasswordSizeEmpty?: number
  stylePinCodeHiddenPasswordSizeFull?: number
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
  textCancelButtonTouchID?: string
  textDescriptionLockedPage?: string
  textSubDescriptionLockedPage?: string
  textPasswordVisibleFamily?: string
  textPasswordVisibleSize?: number
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
  titleValidationFailed?: string
  touchIDDisabled?: boolean
  touchIDSentence?: string
  touchIDTitle?: string
  validationRegex?: RegExp
  passcodeFallback?: boolean
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number;
}

export type IState = {
  internalPinStatus: PinResultStatus
  pinLocked: boolean
}

const disableLockScreenDefault = false;
const timePinLockedAsyncStorageNameDefault = "timePinLockedRNPin";
const pinAttemptsAsyncStorageNameDefault = "pinAttemptsRNPin";
const pinCodeKeychainNameDefault = "reactNativePinCode";
const touchIDDisabledDefault = false;
const touchIDTitleDefault = 'Authentication Required';

class PINCode extends React.PureComponent<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    styleMainContainer: null
  }

  constructor(props: IProps) {
    super(props);
    this.state = { internalPinStatus: PinResultStatus.initial, pinLocked: false };
    this.changeInternalStatus = this.changeInternalStatus.bind(this);
    this.renderLockedPage = this.renderLockedPage.bind(this);
    AsyncStorage.getItem(this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault).then((val) => {
      this.setState({ pinLocked: !!val });
    }).catch(error => {
      console.log('PINCode: ', error)
    })
  }

  changeInternalStatus = (status: PinResultStatus) => {
    if (status === PinResultStatus.initial) this.setState({ pinLocked: false });
    this.setState({ internalPinStatus: status });
  };

  renderLockedPage = () => {
    return (
      <ApplicationLocked
        buttonComponent={this.props.buttonComponentLockedPage || null}
        changeStatus={this.changeInternalStatus}
        colorIcon={this.props.styleLockScreenColorIcon}
        iconComponent={this.props.iconComponentLockedPage || null}
        lockedIconComponent={this.props.lockedIconComponent}
        nameIcon={this.props.styleLockScreenNameIcon}
        onClickButton={this.props.onClickButtonLockedPage || (() => {
          throw ("Quit application");
        })}
        pinAttemptsAsyncStorageName={this.props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault}
        sizeIcon={this.props.styleLockScreenSizeIcon}
        styleButton={this.props.styleLockScreenButton}
        styleMainContainer={this.props.styleLockScreenMainContainer}
        styleText={this.props.styleLockScreenText}
        styleTextButton={this.props.styleLockScreenTextButton}
        styleTextTimer={this.props.styleLockScreenTextTimer}
        styleTitle={this.props.styleLockScreenTitle}
        styleViewButton={this.props.styleLockScreenViewCloseButton}
        styleViewIcon={this.props.styleLockScreenViewIcon}
        styleViewTextLock={this.props.styleLockScreenViewTextLock}
        styleViewTimer={this.props.styleLockScreenViewTimer}
        textButton={this.props.textButtonLockedPage || "Quit"}
        textDescription={this.props.textDescriptionLockedPage || undefined}
        textSubDescription={this.props.textSubDescriptionLockedPage || undefined}
        textTitle={this.props.textTitleLockedPage || undefined}
        timePinLockedAsyncStorageName={this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault}
        timerComponent={this.props.timerComponentLockedPage || null}
        timeToLock={this.props.timeLocked || 300000}
        titleComponent={this.props.titleComponentLockedPage || undefined}
      />
    );
  };

  render() {
    const { status, pinStatus, styleMainContainer } = this.props;
    return (
      <View style={[styles.container, styleMainContainer]}>
        {status === PinStatus.choose &&
          <PinCodeChoose
            alphabetCharsVisible={this.props.alphabetCharsVisible}
            buttonDeleteComponent={this.props.buttonDeleteComponent}
            buttonDeleteText={this.props.buttonDeleteText}
            buttonNumberComponent={this.props.buttonNumberComponent}
            colorCircleButtons={this.props.colorCircleButtons}
            colorPassword={this.props.colorPassword}
            colorPasswordEmpty={this.props.colorPasswordEmpty}
            colorPasswordError={this.props.colorPasswordError}
            customBackSpaceIcon={this.props.customBackSpaceIcon}
            emptyColumnComponent={this.props.bottomLeftComponent}
            finishProcess={this.props.finishProcess}
            getCurrentLength={this.props.getCurrentPinLength}
            iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
            numbersButtonOverlayColor={this.props.numbersButtonOverlayColor}
            passwordComponent={this.props.passwordComponent}
            passwordLength={this.props.passwordLength}
            pinCodeKeychainName={this.props.pinCodeKeychainName || pinCodeKeychainNameDefault}
            pinCodeVisible={this.props.pinCodeVisible}
            storePin={this.props.storePin || null}
            styleAlphabet={this.props.styleAlphabet}
            styleButtonCircle={this.props.stylePinCodeButtonCircle}
            styleCircleHiddenPassword={this.props.stylePinCodeHiddenPasswordCircle}
            styleCircleSizeEmpty={this.props.stylePinCodeHiddenPasswordSizeEmpty}
            styleCircleSizeFull={this.props.stylePinCodeHiddenPasswordSizeFull}
            styleColorButtonTitle={this.props.stylePinCodeButtonNumber}
            styleColorButtonTitleSelected={this.props.stylePinCodeButtonNumberPressed}
            styleColorSubtitle={this.props.stylePinCodeColorSubtitle}
            styleColorSubtitleError={this.props.stylePinCodeColorSubtitleError}
            styleColorTitle={this.props.stylePinCodeColorTitle}
            styleColorTitleError={this.props.stylePinCodeColorTitleError}
            styleColumnButtons={this.props.stylePinCodeColumnButtons}
            styleColumnDeleteButton={this.props.stylePinCodeColumnDeleteButton}
            styleContainer={this.props.stylePinCodeChooseContainer}
            styleContainerPinCode={this.props.stylePinCodeMainContainer}
            styleDeleteButtonColorHideUnderlay={this.props.stylePinCodeDeleteButtonColorHideUnderlay}
            styleDeleteButtonColorShowUnderlay={this.props.stylePinCodeDeleteButtonColorShowUnderlay}
            styleDeleteButtonIcon={this.props.stylePinCodeDeleteButtonIcon}
            styleDeleteButtonSize={this.props.stylePinCodeDeleteButtonSize}
            styleDeleteButtonText={this.props.stylePinCodeDeleteButtonText}
            styleEmptyColumn={this.props.stylePinCodeEmptyColumn}
            stylePinCodeCircle={this.props.stylePinCodeCircle}
            styleRowButtons={this.props.stylePinCodeRowButtons}
            styleTextButton={this.props.stylePinCodeTextButtonCircle}
            styleTextSubtitle={this.props.stylePinCodeTextSubtitle}
            styleTextTitle={this.props.stylePinCodeTextTitle}
            styleViewTitle={this.props.stylePinCodeViewTitle}
            subtitleChoose={this.props.subtitleChoose || "to keep your information secure"}
            subtitleComponent={this.props.subtitleComponent}
            subtitleConfirm={this.props.subtitleConfirm || ""}
            subtitleError={this.props.subtitleError}
            textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
            textPasswordVisibleSize={this.props.textPasswordVisibleSize}
            titleAttemptFailed={this.props.titleAttemptFailed}
            titleChoose={this.props.titleChoose || "1 - Enter a PIN Code"}
            titleComponent={this.props.titleComponent}
            titleConfirm={this.props.titleConfirm || "2 - Confirm your PIN Code"}
            titleConfirmFailed={this.props.titleConfirmFailed}
            titleValidationFailed={this.props.titleValidationFailed}
            validationRegex={this.props.validationRegex}
            vibrationEnabled={this.props.vibrationEnabled}
            delayBetweenAttempts={this.props.delayBetweenAttempts}
          />}
        {status === PinStatus.enter &&
          <PinCodeEnter
            alphabetCharsVisible={this.props.alphabetCharsVisible}
            passcodeFallback={this.props.passcodeFallback}
            buttonDeleteComponent={this.props.buttonDeleteComponent}
            buttonDeleteText={this.props.buttonDeleteText}
            buttonNumberComponent={this.props.buttonNumberComponent}
            callbackErrorTouchId={this.props.callbackErrorTouchId}
            changeInternalStatus={this.changeInternalStatus}
            colorCircleButtons={this.props.colorCircleButtons}
            colorPassword={this.props.colorPassword}
            colorPasswordEmpty={this.props.colorPasswordEmpty}
            colorPasswordError={this.props.colorPasswordError}
            customBackSpaceIcon={this.props.customBackSpaceIcon}
            disableLockScreen={this.props.disableLockScreen || disableLockScreenDefault}
            emptyColumnComponent={this.props.bottomLeftComponent}
            endProcessFunction={this.props.endProcessFunction}
            finishProcess={this.props.finishProcess}
            getCurrentLength={this.props.getCurrentPinLength}
            handleResult={this.props.handleResultEnterPin || null}
            iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
            maxAttempts={this.props.maxAttempts || 3}
            numbersButtonOverlayColor={this.props.numbersButtonOverlayColor}
            onFail={this.props.onFail || null}
            passwordComponent={this.props.passwordComponent}
            passwordLength={this.props.passwordLength}
            pinAttemptsAsyncStorageName={this.props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault}
            pinCodeKeychainName={this.props.pinCodeKeychainName || pinCodeKeychainNameDefault}
            pinCodeVisible={this.props.pinCodeVisible}
            pinStatusExternal={this.props.pinStatus || PinResultStatus.initial}
            status={PinStatus.enter}
            storedPin={this.props.storedPin || null}
            styleAlphabet={this.props.styleAlphabet}
            styleButtonCircle={this.props.stylePinCodeButtonCircle}
            styleCircleHiddenPassword={this.props.stylePinCodeHiddenPasswordCircle}
            styleCircleSizeEmpty={this.props.stylePinCodeHiddenPasswordSizeEmpty}
            styleCircleSizeFull={this.props.stylePinCodeHiddenPasswordSizeFull}
            styleColorButtonTitle={this.props.stylePinCodeButtonNumber}
            styleColorButtonTitleSelected={this.props.stylePinCodeButtonNumberPressed}
            styleColorSubtitle={this.props.stylePinCodeColorSubtitle}
            styleColorSubtitleError={this.props.stylePinCodeColorSubtitleError}
            styleColorTitle={this.props.stylePinCodeColorTitle}
            styleColorTitleError={this.props.stylePinCodeColorTitleError}
            styleColumnButtons={this.props.stylePinCodeColumnButtons}
            styleColumnDeleteButton={this.props.stylePinCodeColumnDeleteButton}
            styleContainer={this.props.stylePinCodeEnterContainer}
            styleContainerPinCode={this.props.stylePinCodeMainContainer}
            styleDeleteButtonColorHideUnderlay={this.props.stylePinCodeDeleteButtonColorHideUnderlay}
            styleDeleteButtonColorShowUnderlay={this.props.stylePinCodeDeleteButtonColorShowUnderlay}
            styleDeleteButtonIcon={this.props.stylePinCodeDeleteButtonIcon}
            styleDeleteButtonSize={this.props.stylePinCodeDeleteButtonSize}
            styleDeleteButtonText={this.props.stylePinCodeDeleteButtonText}
            styleEmptyColumn={this.props.stylePinCodeEmptyColumn}
            stylePinCodeCircle={this.props.stylePinCodeCircle}
            styleRowButtons={this.props.stylePinCodeRowButtons}
            styleTextButton={this.props.stylePinCodeTextButtonCircle}
            styleTextSubtitle={this.props.stylePinCodeTextSubtitle}
            styleTextTitle={this.props.stylePinCodeTextTitle}
            styleViewTitle={this.props.stylePinCodeViewTitle}
            subtitle={this.props.subtitleEnter || ""}
            subtitleComponent={this.props.subtitleComponent}
            subtitleError={this.props.subtitleError}
            textCancelButtonTouchID={this.props.textCancelButtonTouchID}
            textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
            textPasswordVisibleSize={this.props.textPasswordVisibleSize}
            title={this.props.titleEnter || "Enter your PIN Code"}
            titleAttemptFailed={this.props.titleAttemptFailed}
            titleComponent={this.props.titleComponent}
            titleConfirmFailed={this.props.titleConfirmFailed}
            timePinLockedAsyncStorageName={this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault}
            touchIDDisabled={this.props.touchIDDisabled || touchIDDisabledDefault}
            touchIDSentence={this.props.touchIDSentence || "To unlock your application"}
            touchIDTitle={this.props.touchIDTitle || touchIDTitleDefault}
            vibrationEnabled={this.props.vibrationEnabled}
            delayBetweenAttempts={this.props.delayBetweenAttempts}
          />}
        {(pinStatus === PinResultStatus.locked ||
          this.state.internalPinStatus === PinResultStatus.locked ||
          this.state.pinLocked) &&
          (this.props.lockedPage ? this.props.lockedPage() : this.renderLockedPage())}
      </View>
    );
  }
}

export function hasUserSetPinCode(serviceName?: string) {
  return hasPinCode(serviceName || pinCodeKeychainNameDefault);
}

export function deleteUserPinCode(serviceName?: string) {
  return deletePinCode(serviceName || pinCodeKeychainNameDefault);
}

export function resetPinCodeInternalStates(pinAttempsStorageName?: string,
  timePinLockedStorageName?: string) {
  return resetInternalStates([
    pinAttempsStorageName || pinAttemptsAsyncStorageNameDefault,
    timePinLockedStorageName || timePinLockedAsyncStorageNameDefault
  ]);
}

export default PINCode;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
