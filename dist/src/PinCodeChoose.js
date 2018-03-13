"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const PinCode_1 = require("./PinCode");
const constants_1 = require("../../../utils/constants");
const Keychain = require("react-native-keychain");
class PinCodeChoose extends React.PureComponent {
    constructor() {
        super();
        this.endProcessCreation = (pinCode) => {
            this.setState({ pinCode: pinCode });
            this.setState({ status: 'confirm' });
        };
        this.endProcessConfirm = async (pinCode) => {
            if (pinCode === this.state.pinCode) {
                constants_1.authPin.pin = pinCode;
                this.props.navigation.state.params.createPreAccount();
                await Keychain.setGenericPassword('onboarding', pinCode);
                this.props.navigation.navigate('pin-code-flow-end-pin', { changeProcess: this.props.navigation.state.params.changeProcess });
            }
            else {
                this.setState({ status: 'choose' });
            }
        };
        this.cancelConfirm = () => {
            this.setState({ status: 'choose' });
        };
        this.state = { status: 'choose', pinCode: '' };
        this.endProcessCreation = this.endProcessCreation.bind(this);
        this.endProcessConfirm = this.endProcessConfirm.bind(this);
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container },
            this.state.status === 'choose' &&
                React.createElement(PinCode_1.default, { endProcess: this.endProcessCreation, sentenceTitle: "1 - Enter a PIN Code", status: PinCode_1.PinStatus.choose, subtitle: "to keep your information secure" }),
            this.state.status === 'confirm' &&
                React.createElement(PinCode_1.default, { endProcess: this.endProcessConfirm, sentenceTitle: "2 - Confirm your PIN Code", status: PinCode_1.PinStatus.confirm, cancelFunction: this.cancelConfirm, previousPin: this.state.pinCode })));
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
