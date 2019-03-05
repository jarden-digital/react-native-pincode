import * as React from "react";
import {
  AsyncStorage,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle
} from "react-native";
import PinCode, { PinStatus } from "./PinCode";
import TouchID from "react-native-touch-id";
import * as Keychain from "react-native-keychain";
import { PinResultStatus } from "../index";
import delay from "./delay";

/**
 * Pin Code Enter PIN Page
 */

export type IProps = {
  buttonDeleteComponent: any
  buttonDeleteText?: string
  buttonNumberComponent: any
  callbackErrorTouchId?: (e: Error) => void
  changeInternalStatus: (status: PinResultStatus) => void
  colorPassword?: string
  colorPasswordError?: string
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
  styleRowButtons?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  subtitle: string
  subtitleComponent: any
  subtitleError?: string
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
}

export type IState = {
  pinCodeStatus: PinResultStatus
  locked: boolean
}

class PinCodeEnter extends React.PureComponent<IProps, IState> {
  keyChainResult: string | undefined = undefined;

  constructor(props: IProps) {
    super(props);
    this.state = { pinCodeStatus: PinResultStatus.initial, locked: false };
    this.endProcess = this.endProcess.bind(this);
    this.launchTouchID = this.launchTouchID.bind(this);
  }

  async componentWillMount() {
    if (!this.props.storedPin) {
      const result = await Keychain.getInternetCredentials(this.props.pinCodeKeychainName);
      this.keyChainResult = result.password || undefined;
    }
  }

  componentDidMount() {
    if (!this.props.touchIDDisabled) this.triggerTouchID()
  }


  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, prevContext: any): void {
    if (prevProps.pinStatusExternal !== this.props.pinStatusExternal) {
      this.setState({ pinCodeStatus: this.props.pinStatusExternal });
    }
    if (prevProps.touchIDDisabled && !this.props.touchIDDisabled) {
      this.triggerTouchID()
    }
  }

  triggerTouchID() {
    TouchID.isSupported()
      .then(() => {
        setTimeout(() => {
          this.launchTouchID();
        });
      })
      .catch((error: any) => {
        console.warn("TouchID error", error);
      });
  }

  endProcess = async (pinCode?: string) => {
    if (!!this.props.endProcessFunction) {
      this.props.endProcessFunction(pinCode as string);
    } else {
      if (this.props.handleResult) {
        this.props.handleResult(pinCode);
      }
      this.setState({ pinCodeStatus: PinResultStatus.initial });
      this.props.changeInternalStatus(PinResultStatus.initial);
      const pinAttemptsStr = await AsyncStorage.getItem(
        this.props.pinAttemptsAsyncStorageName
      );
      let pinAttempts = +pinAttemptsStr;
      const pin = this.props.storedPin || this.keyChainResult;
      if (pin === pinCode) {
        this.setState({ pinCodeStatus: PinResultStatus.success });
        AsyncStorage.multiRemove([
          this.props.pinAttemptsAsyncStorageName,
          this.props.timePinLockedAsyncStorageName
        ]);
        this.props.changeInternalStatus(PinResultStatus.success);
        if (!!this.props.finishProcess) this.props.finishProcess(pinCode as string);
      } else {
        pinAttempts++;
        if (
          +pinAttempts >= this.props.maxAttempts &&
          !this.props.disableLockScreen
        ) {
          await AsyncStorage.setItem(
            this.props.timePinLockedAsyncStorageName,
            new Date().toISOString()
          );
          this.setState({ locked: true, pinCodeStatus: PinResultStatus.locked });
          this.props.changeInternalStatus(PinResultStatus.locked);
        } else {
          await AsyncStorage.setItem(
            this.props.pinAttemptsAsyncStorageName,
            pinAttempts.toString()
          );
          this.setState({ pinCodeStatus: PinResultStatus.failure });
          this.props.changeInternalStatus(PinResultStatus.failure);
        }
        if (this.props.onFail) {
          await delay(1500);
          this.props.onFail(pinAttempts);
        }
      }
    }
  };

  async launchTouchID() {
    const optionalConfigObject = {
      imageColor: '#e00606',
      imageErrorColor: '#ff0000',
      sensorDescription: 'Touch sensor',
      sensorErrorDescription: 'Failed',
      cancelText: 'Cancel',
      fallbackLabel: 'Show Passcode',
      unifiedErrors: false,
      passcodeFallback: false
    };
    try {
      await TouchID.authenticate(this.props.touchIDSentence,
        Object.assign({}, optionalConfigObject, {title: this.props.touchIDTitle})).then((success: any) => {
        this.endProcess(this.props.storedPin || this.keyChainResult);
      });
    } catch (e) {
      if (!!this.props.callbackErrorTouchId) {
        this.props.callbackErrorTouchId(e)
      } else {
        console.log("TouchID error", e);
      }
    }
  }

  render() {
    const pin =
      this.props.storedPin ||
      (this.keyChainResult && this.keyChainResult);
    return (
      <View
        style={
          this.props.styleContainer
            ? this.props.styleContainer
            : styles.container
        }>
        <PinCode
          endProcess={this.endProcess}
          sentenceTitle={this.props.title}
          subtitle={this.props.subtitle}
          status={PinStatus.enter}
          previousPin={pin}
          emptyColumnComponent={this.props.emptyColumnComponent}
          pinCodeStatus={this.state.pinCodeStatus}
          buttonNumberComponent={this.props.buttonNumberComponent || null}
          passwordLength={this.props.passwordLength || 4}
          iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
          passwordComponent={this.props.passwordComponent || null}
          titleAttemptFailed={
            this.props.titleAttemptFailed || "Incorrect PIN Code"
          }
          titleConfirmFailed={
            this.props.titleConfirmFailed || "Your entries did not match"
          }
          subtitleError={this.props.subtitleError || "Please try again"}
          colorPassword={this.props.colorPassword || undefined}
          colorPasswordError={this.props.colorPasswordError || undefined}
          numbersButtonOverlayColor={
            this.props.numbersButtonOverlayColor || undefined
          }
          buttonDeleteComponent={this.props.buttonDeleteComponent || null}
          titleComponent={this.props.titleComponent || null}
          subtitleComponent={this.props.subtitleComponent || null}
          getCurrentLength={this.props.getCurrentLength}
          styleButtonCircle={this.props.styleButtonCircle}
          buttonDeleteText={this.props.buttonDeleteText}
          styleTextButton={this.props.styleTextButton}
          styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
          styleCircleSizeEmpty={this.props.styleCircleSizeEmpty}
          styleCircleSizeFull={this.props.styleCircleSizeFull}
          styleRowButtons={this.props.styleRowButtons}
          styleColumnButtons={this.props.styleColumnButtons}
          styleEmptyColumn={this.props.styleEmptyColumn}
          styleViewTitle={this.props.styleViewTitle}
          styleTextTitle={this.props.styleTextTitle}
          styleTextSubtitle={this.props.styleTextSubtitle}
          styleContainer={this.props.styleContainerPinCode}
          styleColumnDeleteButton={this.props.styleColumnDeleteButton}
          styleDeleteButtonColorShowUnderlay={
            this.props.styleDeleteButtonColorShowUnderlay
          }
          styleDeleteButtonColorHideUnderlay={
            this.props.styleDeleteButtonColorHideUnderlay
          }
          styleDeleteButtonIcon={this.props.styleDeleteButtonIcon}
          styleDeleteButtonSize={this.props.styleDeleteButtonSize}
          styleColorTitle={this.props.styleColorTitle}
          styleColorTitleError={this.props.styleColorTitleError}
          styleColorSubtitle={this.props.styleColorSubtitle}
          styleColorSubtitleError={this.props.styleColorSubtitleError}
          styleDeleteButtonText={this.props.styleDeleteButtonText}
          styleColorButtonTitle={this.props.styleColorButtonTitle}
          styleColorButtonTitleSelected={
            this.props.styleColorButtonTitleSelected
          }
          pinCodeVisible={this.props.pinCodeVisible}
          textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
          textPasswordVisibleSize={this.props.textPasswordVisibleSize}
        />
      </View>
    );
  }
}

export default PinCodeEnter;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
