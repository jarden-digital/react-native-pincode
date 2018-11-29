import * as React from "react";
import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import PinCode, { PinStatus } from "./PinCode";
import * as Keychain from "react-native-keychain";

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
  finishProcess?: any
  passwordLength?: number
  passwordComponent: any
  titleAttemptFailed?: string
  titleConfirmFailed?: string
  subtitleError?: string
  colorPassword?: string
  buttonDeleteText?: string
  colorPasswordError?: string
  iconButtonDeleteDisabled?: boolean
  numbersButtonOverlayColor?: string
  buttonDeleteComponent: any
  titleComponent: any
  subtitleComponent: any
  pinCodeKeychainName: string
  getCurrentLength?: (length: number) => void
  styleContainerPinCode?: StyleProp<ViewStyle>
  styleColorTitle?: string
  styleColorTitleError?: string
  styleColorSubtitle?: string
  emptyColumnComponent: any
  styleColorSubtitleError?: string
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
  titleValidationFailed?: string
  validationRegex?: RegExp
}

export type IState = {
  status: PinStatus
  pinCode: string
}

class PinCodeChoose extends React.PureComponent<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { status: PinStatus.choose, pinCode: "" };
    this.endProcessCreation = this.endProcessCreation.bind(this);
    this.endProcessConfirm = this.endProcessConfirm.bind(this);
  }

  endProcessCreation = (pinCode: string, isErrorValidation?: boolean) => {
    this.setState({
      pinCode: isErrorValidation ? "" : pinCode,
      status: isErrorValidation ? PinStatus.choose : PinStatus.confirm
    });
  };

  endProcessConfirm = async (pinCode: string) => {
    if (pinCode === this.state.pinCode) {
      if (this.props.storePin) {
        this.props.storePin(pinCode);
      } else {
        await Keychain.setInternetCredentials(
          this.props.pinCodeKeychainName,
          this.props.pinCodeKeychainName,
          pinCode);
      }
      if (this.props.finishProcess) this.props.finishProcess();
    } else {
      this.setState({ status: PinStatus.choose });
    }
  };

  cancelConfirm = () => {
    this.setState({ status: PinStatus.choose });
  };

  render() {
    return (
      <View
        style={
          this.props.styleContainer
            ? this.props.styleContainer
            : styles.container
        }>
        {this.state.status === PinStatus.choose && (
          <PinCode
            endProcess={this.endProcessCreation}
            sentenceTitle={this.props.titleChoose}
            status={PinStatus.choose}
            subtitle={this.props.subtitleChoose}
            buttonNumberComponent={this.props.buttonNumberComponent || null}
            passwordLength={this.props.passwordLength || 4}
            passwordComponent={this.props.passwordComponent || null}
            validationRegex={this.props.validationRegex}
            emptyColumnComponent={this.props.emptyColumnComponent}
            titleValidationFailed={
              this.props.titleValidationFailed || "PIN code unsafe"
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
            styleButtonCircle={this.props.styleButtonCircle}
            iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
            getCurrentLength={this.props.getCurrentLength}
            styleTextButton={this.props.styleTextButton}
            styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
            styleCircleSizeEmpty={this.props.styleCircleSizeEmpty}
            styleCircleSizeFull={this.props.styleCircleSizeFull}
            styleRowButtons={this.props.styleRowButtons}
            buttonDeleteText={this.props.buttonDeleteText}
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
            styleColorTitle={this.props.styleColorTitle}
            styleColorTitleError={this.props.styleColorTitleError}
            styleColorSubtitle={this.props.styleColorSubtitle}
            styleColorSubtitleError={this.props.styleColorSubtitleError}
            styleDeleteButtonIcon={this.props.styleDeleteButtonIcon}
            styleDeleteButtonSize={this.props.styleDeleteButtonSize}
            styleDeleteButtonText={this.props.styleDeleteButtonText}
            styleColorButtonTitle={this.props.styleColorButtonTitle}
            styleColorButtonTitleSelected={
              this.props.styleColorButtonTitleSelected
            }
            pinCodeVisible={this.props.pinCodeVisible}
            textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
            textPasswordVisibleSize={this.props.textPasswordVisibleSize}
          />
        )}
        {this.state.status === PinStatus.confirm && (
          <PinCode
            endProcess={this.endProcessConfirm}
            sentenceTitle={this.props.titleConfirm}
            status={PinStatus.confirm}
            cancelFunction={this.cancelConfirm}
            subtitle={this.props.subtitleConfirm}
            previousPin={this.state.pinCode}
            buttonNumberComponent={this.props.buttonNumberComponent || null}
            emptyColumnComponent={this.props.emptyColumnComponent}
            passwordLength={this.props.passwordLength || 4}
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
            buttonDeleteText={this.props.buttonDeleteText}
            titleComponent={this.props.titleComponent || null}
            subtitleComponent={this.props.subtitleComponent || null}
            styleButtonCircle={this.props.styleButtonCircle}
            styleTextButton={this.props.styleTextButton}
            getCurrentLength={this.props.getCurrentLength}
            styleCircleHiddenPassword={this.props.styleCircleHiddenPassword}
            styleCircleSizeEmpty={this.props.styleCircleSizeEmpty}
            styleCircleSizeFull={this.props.styleCircleSizeFull}
            iconButtonDeleteDisabled={this.props.iconButtonDeleteDisabled}
            styleRowButtons={this.props.styleRowButtons}
            styleColumnButtons={this.props.styleColumnButtons}
            styleEmptyColumn={this.props.styleEmptyColumn}
            styleViewTitle={this.props.styleViewTitle}
            styleTextTitle={this.props.styleTextTitle}
            styleTextSubtitle={this.props.styleTextSubtitle}
            styleColorTitle={this.props.styleColorTitle}
            styleColorTitleError={this.props.styleColorTitleError}
            styleColorSubtitle={this.props.styleColorSubtitle}
            styleColorSubtitleError={this.props.styleColorSubtitleError}
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
            styleDeleteButtonText={this.props.styleDeleteButtonText}
            styleColorButtonTitle={this.props.styleColorButtonTitle}
            styleColorButtonTitleSelected={
              this.props.styleColorButtonTitleSelected
            }
            pinCodeVisible={this.props.pinCodeVisible}
            textPasswordVisibleFamily={this.props.textPasswordVisibleFamily}
            textPasswordVisibleSize={this.props.textPasswordVisibleSize}
          />
        )}
      </View>
    );
  }
}

export default PinCodeChoose;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
