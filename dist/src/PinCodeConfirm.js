"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const PinCode_1 = require("./PinCode");
const constants_1 = require("../../../utils/constants");
const Keychain = require("react-native-keychain");
class PinCodeConfirm extends React.PureComponent {
    constructor() {
        super();
        this.endProcessConfirm = async (pinCode) => {
            if (pinCode === this.props.navigation.state.params.pinCode) {
                constants_1.authPin.pin = pinCode;
                await Keychain.setGenericPassword('onboarding', pinCode);
                setTimeout(() => {
                    this.props.navigation.navigate('pin-code-flow-end-pin', { changeProcess: this.props.navigation.state.params.changeProcess });
                }, 700);
            }
            else {
                setTimeout(() => {
                    this.props.navigation.navigate('pin-code-flow-choose-pin', {
                        changeProcess: this.props.navigation.state.params.changeProcess,
                        goBack: true
                    });
                }, 1000);
            }
        };
        this.cancelConfirm = () => {
            this.props.navigation.navigate('pin-code-flow-choose-pin', { changeProcess: this.props.navigation.state.params.changeProcess });
        };
        this.endProcessConfirm = this.endProcessConfirm.bind(this);
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(PinCode_1.default, { endProcess: this.endProcessConfirm, sentenceTitle: "2 - Confirm your PIN Code", status: PinCode_1.PinStatus.confirm, cancelFunction: this.cancelConfirm, previousPin: this.props.navigation.state.params.pinCode })));
    }
}
exports.default = PinCodeConfirm;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
