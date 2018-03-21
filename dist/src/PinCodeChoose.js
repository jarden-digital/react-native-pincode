"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const PinCode_1 = require("./PinCode");
const Keychain = require("react-native-keychain");
class PinCodeChoose extends React.PureComponent {
    constructor(props) {
        super(props);
        this.endProcessCreation = (pinCode) => {
            this.setState({ pinCode: pinCode, status: PinCode_1.PinStatus.confirm });
        };
        this.endProcessConfirm = async (pinCode) => {
            if (pinCode === this.state.pinCode) {
                if (this.props.storePin) {
                    this.props.storePin(pinCode);
                }
                else {
                    await Keychain.setGenericPassword('reactNativePinCode', pinCode);
                }
            }
            else {
                this.setState({ status: PinCode_1.PinStatus.choose });
            }
        };
        this.cancelConfirm = () => {
            this.setState({ status: PinCode_1.PinStatus.choose });
        };
        this.state = { status: PinCode_1.PinStatus.choose, pinCode: '' };
        this.endProcessCreation = this.endProcessCreation.bind(this);
        this.endProcessConfirm = this.endProcessConfirm.bind(this);
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container },
            this.state.status === PinCode_1.PinStatus.choose &&
                React.createElement(PinCode_1.default, { endProcess: this.endProcessCreation, sentenceTitle: this.props.titleEnter, status: PinCode_1.PinStatus.choose, subtitle: this.props.subtitleEnter, buttonNumberComponent: this.props.buttonNumberComponent || null, passwordLength: this.props.passwordLength || 4, passwordComponent: this.props.passwordComponent || null, titleAttemptFailed: this.props.titleAttemptFailed || 'Incorrect PIN Code', titleConfirmFailed: this.props.titleConfirmFailed || 'Your entries did not match', subtitleError: this.props.subtitleError || 'Please try again', colorPassword: this.props.colorPassword || undefined, numbersButtonOverlayColor: this.props.numbersButtonOverlayColor || undefined, buttonDeleteComponent: this.props.buttonDeleteComponent || null, titleComponent: this.props.titleComponent || null, subtitleComponent: this.props.subtitleComponent || null }),
            this.state.status === PinCode_1.PinStatus.confirm &&
                React.createElement(PinCode_1.default, { endProcess: this.endProcessConfirm, sentenceTitle: this.props.titleConfirm, status: PinCode_1.PinStatus.confirm, cancelFunction: this.cancelConfirm, subtitle: this.props.subtitleConfirm, buttonNumberComponent: this.props.buttonNumberComponent || null, passwordLength: this.props.passwordLength || 4, passwordComponent: this.props.passwordComponent || null, titleAttemptFailed: this.props.titleAttemptFailed || 'Incorrect PIN Code', titleConfirmFailed: this.props.titleConfirmFailed || 'Your entries did not match', subtitleError: this.props.subtitleError || 'Please try again', colorPassword: this.props.colorPassword || undefined, numbersButtonOverlayColor: this.props.numbersButtonOverlayColor || undefined, buttonDeleteComponent: this.props.buttonDeleteComponent || null, titleComponent: this.props.titleComponent || null, subtitleComponent: this.props.subtitleComponent || null })));
    }
}
exports.default = PinCodeChoose;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
