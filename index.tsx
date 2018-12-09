/// <reference path='./src/types.d.ts'/>
import * as React from "react";
import PinCodeChoose from "./src/PinCodeChoose";
import { PinStatus } from "./src/PinCode";
import PinCodeEnter from "./src/PinCodeEnter";
import { View, StyleSheet, AsyncStorage, StyleProp, ViewStyle, TextStyle } from "react-native";
import ApplicationLocked from "./src/ApplicationLocked";
import { hasPinCode, deletePinCode } from "./src/utils";

export type IProps = {
  bottomLeftComponent?: any
  buttonComponentLockedPage?: any
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  colorPassword?: string
  colorPasswordError?: string
  disableLockScreen?: boolean
  endProcessFunction?: (pinCode: string) => void
  finishProcess?: any
  getCurrentPinLength?: (length: number) => void
  handleResultEnterPin?: any
  iconComponentLockedPage?: any
  iconButtonDeleteDisabled?: boolean
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
  validationRegex?: RegExp
}

export type IState = {
  internalPinStatus: PinResultStatus
  pinLocked: boolean
}

export enum PinResultStatus {
  initial = "initial",
  success = "success",
  failure = "failure",
  locked = "locked"
}

const disableLockScreenDefault = false;
const timePinLockedAsyncStorageNameDefault = "timePinLockedRNPin";
const pinAttemptsAsyncStorageNameDefault = "pinAttemptsRNPin";
const pinCodeKeychainNameDefault = "reactNativePinCode";
const touchIDDisabledDefault = false;

class PINCode extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = { internalPinStatus: PinResultStatus.initial, pinLocked: false };
    this.changeInternalStatus = this.changeInternalStatus.bind(this);
    this.renderLockedPage = this.renderLockedPage.bind(this);
  }

  async componentWillMount() {
    await AsyncStorage.getItem(this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault).then((val) => {
      this.setState({ pinLocked: !!val });
    });
  }

  changeInternalStatus = (status: PinResultStatus) => {
    if (status === PinResultStatus.initial) this.setState({ pinLocked: false });
    this.setState({ internalPinStatus: status });
  };

  renderLockedPage = () => {
    return (
      <ApplicationLocked
        timeToLock={this.props.timeLocked || 300000}
        textButton={this.props.textButtonLockedPage || "Quit"}
        changeStatus={this.changeInternalStatus}
        textDescription={this.props.textDescriptionLockedPage || undefined}
        textSubDescription={this.props.textSubDescriptionLockedPage || undefined}
        buttonComponent={this.props.buttonComponentLockedPage || null}
        timerComponent={this.props.timerComponentLockedPage || null}
        textTitle={this.props.textTitleLockedPage || undefined}
        titleComponent={this.props.titleComponentLockedPage || undefined}
        iconComponent={this.props.iconComponentLockedPage || null}
        timePinLockedAsyncStorageName={this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault}
        pinAttemptsAsyncStorageName={this.props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault}
        onClickButton={this.props.onClickButtonLockedPage || (() => {
          throw ("Quit application");
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
    );
  };

  render() {
    const { status, pinStatus, styleMainContainer } = this.props;
    return (
      <View style={styleMainContainer ? styleMainContainer : styles.container}>
        {status === PinStatus.choose &&
        <PinCodeChoose
          storePin={this.props.storePin || null}
          titleChoose={this.props.titleChoose || "1 - Enter a PIN Code"}
          subtitleChoose={this.props.subtitleChoose || "to keep your information secure"}
          titleConfirm={this.props.titleConfirm || "2 - Confirm your PIN Code"}
          subtitleConfirm={this.props.subtitleConfirm || ""}
          emptyColumnComponent={this.props.bottomLeftComponent}
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
          getCurrentLength={this.props.getCurrentPinLength}
          pinCodeKeychainName={this.props.pinCodeKeychainName || pinCodeKeychainNameDefault}
          styleContainer={this.props.stylePinCodeChooseContainer}
          styleButtonCircle={this.props.stylePinCodeButtonCircle}
          styleTextButton={this.props.stylePinCodeTextButtonCircle}
          styleCircleHiddenPassword={this.props.stylePinCodeHiddenPasswordCircle}
          styleCircleSizeEmpty={this.props.stylePinCodeHiddenPasswordSizeEmpty}
          styleCircleSizeFull={this.props.stylePinCodeHiddenPasswordSizeFull}
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
          pinCodeVisible={this.props.pinCodeVisible}
          textPasswordVisibleSize={this.props.textPasswordVisibleSize}
          textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
          titleValidationFailed={this.props.titleValidationFailed}
          validationRegex={this.props.validationRegex}
        />}
        {status === PinStatus.enter &&
        <PinCodeEnter
          disableLockScreen={this.props.disableLockScreen || disableLockScreenDefault}
          title={this.props.titleEnter || "Enter your PIN Code"}
          subtitle={this.props.subtitleEnter || ""}
          handleResult={this.props.handleResultEnterPin || null}
          maxAttempts={this.props.maxAttempts || 3}
          changeInternalStatus={this.changeInternalStatus}
          buttonDeleteText={this.props.buttonDeleteText}
          emptyColumnComponent={this.props.bottomLeftComponent}
          pinStatusExternal={this.props.pinStatus || PinResultStatus.initial}
          storedPin={this.props.storedPin || null}
          touchIDSentence={this.props.touchIDSentence || "To unlock your application"}
          status={PinStatus.enter}
          finishProcess={this.props.finishProcess || null}
          onFail={this.props.onFail || null}
          buttonNumberComponent={this.props.buttonNumberComponent}
          passwordLength={this.props.passwordLength}
          passwordComponent={this.props.passwordComponent}
          titleAttemptFailed={this.props.titleAttemptFailed}
          titleConfirmFailed={this.props.titleConfirmFailed}
          iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
          getCurrentLength={this.props.getCurrentPinLength}
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
          pinCodeKeychainName={this.props.pinCodeKeychainName || pinCodeKeychainNameDefault}
          styleContainer={this.props.stylePinCodeEnterContainer}
          styleButtonCircle={this.props.stylePinCodeButtonCircle}
          styleTextButton={this.props.stylePinCodeTextButtonCircle}
          styleCircleHiddenPassword={this.props.stylePinCodeHiddenPasswordCircle}
          styleCircleSizeEmpty={this.props.stylePinCodeHiddenPasswordSizeEmpty}
          styleCircleSizeFull={this.props.stylePinCodeHiddenPasswordSizeFull}
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
          pinCodeVisible={this.props.pinCodeVisible}
          textPasswordVisibleSize={this.props.textPasswordVisibleSize}
          textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
          endProcessFunction={this.props.endProcessFunction}
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

export default PINCode;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
