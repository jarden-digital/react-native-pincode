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
  storedPin: string | null
  disableLockScreen: boolean
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
  pinCodeKeychainName: string
  onFail?: any
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
  getCurrentLength?: (length: number) => void
  styleContainerPinCode?: StyleProp<ViewStyle>
  styleColorTitle?: string
  styleColorTitleError?: string
  styleColorSubtitle?: string
  styleColorSubtitleError?: string
  emptyColumnComponent: any
  styleButtonCircle?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
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
  pinCodeVisible?: boolean
  textPasswordVisibleSize?: number
  textPasswordVisibleFamily?: string
  endProcessFunction?: (pinCode: string) => void
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
    if (!this.props.touchIDDisabled) {
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
  }

  componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, prevContext: any): void {
    if (prevProps.pinStatusExternal !== this.props.pinStatusExternal) {
      this.setState({ pinCodeStatus: this.props.pinStatusExternal });
    }
  }

  endProcess = async (pinCode?: string) => {
    if (!!this.props.endProcessFunction) {
      this.props.endProcessFunction(pinCode as string)
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
        if (this.props.finishProcess) this.props.finishProcess();
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
    try {
      await TouchID.authenticate(this.props.touchIDSentence).then((success: any) => {
        this.endProcess(this.props.storedPin || this.keyChainResult);
      });
    } catch (e) {
      console.warn("TouchID error", e);
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
