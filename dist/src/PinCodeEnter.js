"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const PinCode_1 = require("./PinCode");
const constants_1 = require("../../../utils/constants");
const react_native_touch_id_1 = require("react-native-touch-id");
const Keychain = require("react-native-keychain");
class PinCodeEnter extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.endProcess = (pinCode) => {
            constants_1.authPin.pin = pinCode;
            this.props.renewAuthToken();
        };
    }
    componentDidMount() {
        react_native_touch_id_1.default.isSupported()
            .then((biometryType) => {
            setTimeout(() => {
                this.launchTouchID();
            });
        })
            .catch((error) => {
            console.warn(error);
        });
    }
    async launchTouchID() {
        try {
            await react_native_touch_id_1.default.authenticate('');
            const result = await Keychain.getGenericPassword();
            this.endProcess(result.password);
        }
        catch (e) {
            console.log('touch id fail');
        }
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(PinCode_1.default, { endProcess: this.endProcess, sentenceTitle: "Enter your PIN Code", status: PinCode_1.PinStatus.enter, previousPin: this.props.previousPin, pinCodeStatus: this.props.pinCodeStatus })));
    }
}
exports.default = PinCodeEnter;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
