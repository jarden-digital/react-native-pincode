"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationLocked_1 = require("./src/ApplicationLocked");
const PinCode_1 = require("./src/PinCode");
const PinCodeChoose_1 = require("./src/PinCodeChoose");
const PinCodeEnter_1 = require("./src/PinCodeEnter");
const utils_1 = require("./src/utils");
const async_storage_1 = require("@react-native-community/async-storage");
const React = require("react");
const react_native_1 = require("react-native");
const disableLockScreenDefault = false;
const timePinLockedAsyncStorageNameDefault = "timePinLockedRNPin";
const pinAttemptsAsyncStorageNameDefault = "pinAttemptsRNPin";
const pinCodeKeychainNameDefault = "reactNativePinCode";
const touchIDDisabledDefault = false;
const touchIDTitleDefault = 'Authentication Required';
class PINCode extends React.PureComponent {
    constructor(props) {
        super(props);
        this.changeInternalStatus = (status) => {
            if (status === utils_1.PinResultStatus.initial)
                this.setState({ pinLocked: false });
            this.setState({ internalPinStatus: status });
        };
        this.renderLockedPage = () => {
            return (React.createElement(ApplicationLocked_1.default, { buttonComponent: this.props.buttonComponentLockedPage || null, changeStatus: this.changeInternalStatus, colorIcon: this.props.styleLockScreenColorIcon, iconComponent: this.props.iconComponentLockedPage || null, lockedIconComponent: this.props.lockedIconComponent, nameIcon: this.props.styleLockScreenNameIcon, onClickButton: this.props.onClickButtonLockedPage || (() => {
                    throw ("Quit application");
                }), pinAttemptsAsyncStorageName: this.props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault, sizeIcon: this.props.styleLockScreenSizeIcon, styleButton: this.props.styleLockScreenButton, styleMainContainer: this.props.styleLockScreenMainContainer, styleText: this.props.styleLockScreenText, styleTextButton: this.props.styleLockScreenTextButton, styleTextTimer: this.props.styleLockScreenTextTimer, styleTitle: this.props.styleLockScreenTitle, styleViewButton: this.props.styleLockScreenViewCloseButton, styleViewIcon: this.props.styleLockScreenViewIcon, styleViewTextLock: this.props.styleLockScreenViewTextLock, styleViewTimer: this.props.styleLockScreenViewTimer, textButton: this.props.textButtonLockedPage || "Quit", textDescription: this.props.textDescriptionLockedPage || undefined, textSubDescription: this.props.textSubDescriptionLockedPage || undefined, textTitle: this.props.textTitleLockedPage || undefined, timePinLockedAsyncStorageName: this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault, timerComponent: this.props.timerComponentLockedPage || null, timeToLock: this.props.timeLocked || 300000, titleComponent: this.props.titleComponentLockedPage || undefined }));
        };
        this.state = { internalPinStatus: utils_1.PinResultStatus.initial, pinLocked: false };
        this.changeInternalStatus = this.changeInternalStatus.bind(this);
        this.renderLockedPage = this.renderLockedPage.bind(this);
        async_storage_1.default.getItem(this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault).then((val) => {
            this.setState({ pinLocked: !!val });
        }).catch(error => {
            console.log('PINCode: ', error);
        });
    }
    render() {
        const { status, pinStatus, styleMainContainer } = this.props;
        return (React.createElement(react_native_1.View, { style: [styles.container, styleMainContainer] },
            status === PinCode_1.PinStatus.choose &&
                React.createElement(PinCodeChoose_1.default, { alphabetCharsVisible: this.props.alphabetCharsVisible, buttonDeleteComponent: this.props.buttonDeleteComponent, buttonDeleteText: this.props.buttonDeleteText, buttonNumberComponent: this.props.buttonNumberComponent, colorCircleButtons: this.props.colorCircleButtons, colorPassword: this.props.colorPassword, colorPasswordEmpty: this.props.colorPasswordEmpty, colorPasswordError: this.props.colorPasswordError, customBackSpaceIcon: this.props.customBackSpaceIcon, emptyColumnComponent: this.props.bottomLeftComponent, finishProcess: this.props.finishProcess, getCurrentLength: this.props.getCurrentPinLength, iconButtonDeleteDisabled: this.props.iconButtonDeleteDisabled, numbersButtonOverlayColor: this.props.numbersButtonOverlayColor, passwordComponent: this.props.passwordComponent, passwordLength: this.props.passwordLength, pinCodeKeychainName: this.props.pinCodeKeychainName || pinCodeKeychainNameDefault, pinCodeVisible: this.props.pinCodeVisible, storePin: this.props.storePin || null, styleAlphabet: this.props.styleAlphabet, styleButtonCircle: this.props.stylePinCodeButtonCircle, styleCircleHiddenPassword: this.props.stylePinCodeHiddenPasswordCircle, styleCircleSizeEmpty: this.props.stylePinCodeHiddenPasswordSizeEmpty, styleCircleSizeFull: this.props.stylePinCodeHiddenPasswordSizeFull, styleColorButtonTitle: this.props.stylePinCodeButtonNumber, styleColorButtonTitleSelected: this.props.stylePinCodeButtonNumberPressed, styleColorSubtitle: this.props.stylePinCodeColorSubtitle, styleColorSubtitleError: this.props.stylePinCodeColorSubtitleError, styleColorTitle: this.props.stylePinCodeColorTitle, styleColorTitleError: this.props.stylePinCodeColorTitleError, styleColumnButtons: this.props.stylePinCodeColumnButtons, styleColumnDeleteButton: this.props.stylePinCodeColumnDeleteButton, styleContainer: this.props.stylePinCodeChooseContainer, styleContainerPinCode: this.props.stylePinCodeMainContainer, styleDeleteButtonColorHideUnderlay: this.props.stylePinCodeDeleteButtonColorHideUnderlay, styleDeleteButtonColorShowUnderlay: this.props.stylePinCodeDeleteButtonColorShowUnderlay, styleDeleteButtonIcon: this.props.stylePinCodeDeleteButtonIcon, styleDeleteButtonSize: this.props.stylePinCodeDeleteButtonSize, styleDeleteButtonText: this.props.stylePinCodeDeleteButtonText, styleEmptyColumn: this.props.stylePinCodeEmptyColumn, stylePinCodeCircle: this.props.stylePinCodeCircle, styleRowButtons: this.props.stylePinCodeRowButtons, styleTextButton: this.props.stylePinCodeTextButtonCircle, styleTextSubtitle: this.props.stylePinCodeTextSubtitle, styleTextTitle: this.props.stylePinCodeTextTitle, styleViewTitle: this.props.stylePinCodeViewTitle, subtitleChoose: this.props.subtitleChoose || "to keep your information secure", subtitleComponent: this.props.subtitleComponent, subtitleConfirm: this.props.subtitleConfirm || "", subtitleError: this.props.subtitleError, textPasswordVisibleFamily: this.props.textPasswordVisibleFamily, textPasswordVisibleSize: this.props.textPasswordVisibleSize, titleAttemptFailed: this.props.titleAttemptFailed, titleChoose: this.props.titleChoose || "1 - Enter a PIN Code", titleComponent: this.props.titleComponent, titleConfirm: this.props.titleConfirm || "2 - Confirm your PIN Code", titleConfirmFailed: this.props.titleConfirmFailed, titleValidationFailed: this.props.titleValidationFailed, validationRegex: this.props.validationRegex, vibrationEnabled: this.props.vibrationEnabled, delayBetweenAttempts: this.props.delayBetweenAttempts }),
            status === PinCode_1.PinStatus.enter &&
                React.createElement(PinCodeEnter_1.default, { alphabetCharsVisible: this.props.alphabetCharsVisible, passcodeFallback: this.props.passcodeFallback, buttonDeleteComponent: this.props.buttonDeleteComponent, buttonDeleteText: this.props.buttonDeleteText, buttonNumberComponent: this.props.buttonNumberComponent, callbackErrorTouchId: this.props.callbackErrorTouchId, changeInternalStatus: this.changeInternalStatus, colorCircleButtons: this.props.colorCircleButtons, colorPassword: this.props.colorPassword, colorPasswordEmpty: this.props.colorPasswordEmpty, colorPasswordError: this.props.colorPasswordError, customBackSpaceIcon: this.props.customBackSpaceIcon, disableLockScreen: this.props.disableLockScreen || disableLockScreenDefault, emptyColumnComponent: this.props.bottomLeftComponent, endProcessFunction: this.props.endProcessFunction, finishProcess: this.props.finishProcess, getCurrentLength: this.props.getCurrentPinLength, handleResult: this.props.handleResultEnterPin || null, iconButtonDeleteDisabled: this.props.iconButtonDeleteDisabled, maxAttempts: this.props.maxAttempts || 3, numbersButtonOverlayColor: this.props.numbersButtonOverlayColor, onFail: this.props.onFail || null, passwordComponent: this.props.passwordComponent, passwordLength: this.props.passwordLength, pinAttemptsAsyncStorageName: this.props.pinAttemptsAsyncStorageName || pinAttemptsAsyncStorageNameDefault, pinCodeKeychainName: this.props.pinCodeKeychainName || pinCodeKeychainNameDefault, pinCodeVisible: this.props.pinCodeVisible, pinStatusExternal: this.props.pinStatus || utils_1.PinResultStatus.initial, status: PinCode_1.PinStatus.enter, storedPin: this.props.storedPin || null, styleAlphabet: this.props.styleAlphabet, styleButtonCircle: this.props.stylePinCodeButtonCircle, styleCircleHiddenPassword: this.props.stylePinCodeHiddenPasswordCircle, styleCircleSizeEmpty: this.props.stylePinCodeHiddenPasswordSizeEmpty, styleCircleSizeFull: this.props.stylePinCodeHiddenPasswordSizeFull, styleColorButtonTitle: this.props.stylePinCodeButtonNumber, styleColorButtonTitleSelected: this.props.stylePinCodeButtonNumberPressed, styleColorSubtitle: this.props.stylePinCodeColorSubtitle, styleColorSubtitleError: this.props.stylePinCodeColorSubtitleError, styleColorTitle: this.props.stylePinCodeColorTitle, styleColorTitleError: this.props.stylePinCodeColorTitleError, styleColumnButtons: this.props.stylePinCodeColumnButtons, styleColumnDeleteButton: this.props.stylePinCodeColumnDeleteButton, styleContainer: this.props.stylePinCodeEnterContainer, styleContainerPinCode: this.props.stylePinCodeMainContainer, styleDeleteButtonColorHideUnderlay: this.props.stylePinCodeDeleteButtonColorHideUnderlay, styleDeleteButtonColorShowUnderlay: this.props.stylePinCodeDeleteButtonColorShowUnderlay, styleDeleteButtonIcon: this.props.stylePinCodeDeleteButtonIcon, styleDeleteButtonSize: this.props.stylePinCodeDeleteButtonSize, styleDeleteButtonText: this.props.stylePinCodeDeleteButtonText, styleEmptyColumn: this.props.stylePinCodeEmptyColumn, stylePinCodeCircle: this.props.stylePinCodeCircle, styleRowButtons: this.props.stylePinCodeRowButtons, styleTextButton: this.props.stylePinCodeTextButtonCircle, styleTextSubtitle: this.props.stylePinCodeTextSubtitle, styleTextTitle: this.props.stylePinCodeTextTitle, styleViewTitle: this.props.stylePinCodeViewTitle, subtitle: this.props.subtitleEnter || "", subtitleComponent: this.props.subtitleComponent, subtitleError: this.props.subtitleError, textCancelButtonTouchID: this.props.textCancelButtonTouchID, textPasswordVisibleFamily: this.props.textPasswordVisibleFamily, textPasswordVisibleSize: this.props.textPasswordVisibleSize, title: this.props.titleEnter || "Enter your PIN Code", titleAttemptFailed: this.props.titleAttemptFailed, titleComponent: this.props.titleComponent, titleConfirmFailed: this.props.titleConfirmFailed, timePinLockedAsyncStorageName: this.props.timePinLockedAsyncStorageName || timePinLockedAsyncStorageNameDefault, touchIDDisabled: this.props.touchIDDisabled || touchIDDisabledDefault, touchIDSentence: this.props.touchIDSentence || "To unlock your application", touchIDTitle: this.props.touchIDTitle || touchIDTitleDefault, vibrationEnabled: this.props.vibrationEnabled, delayBetweenAttempts: this.props.delayBetweenAttempts }),
            (pinStatus === utils_1.PinResultStatus.locked ||
                this.state.internalPinStatus === utils_1.PinResultStatus.locked ||
                this.state.pinLocked) &&
                (this.props.lockedPage ? this.props.lockedPage() : this.renderLockedPage())));
    }
}
PINCode.defaultProps = {
    styleMainContainer: null
};
function hasUserSetPinCode(serviceName) {
    return utils_1.hasPinCode(serviceName || pinCodeKeychainNameDefault);
}
exports.hasUserSetPinCode = hasUserSetPinCode;
function deleteUserPinCode(serviceName) {
    return utils_1.deletePinCode(serviceName || pinCodeKeychainNameDefault);
}
exports.deleteUserPinCode = deleteUserPinCode;
function resetPinCodeInternalStates(pinAttempsStorageName, timePinLockedStorageName) {
    return utils_1.resetInternalStates([
        pinAttempsStorageName || pinAttemptsAsyncStorageNameDefault,
        timePinLockedStorageName || timePinLockedAsyncStorageNameDefault
    ]);
}
exports.resetPinCodeInternalStates = resetPinCodeInternalStates;
exports.default = PINCode;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
