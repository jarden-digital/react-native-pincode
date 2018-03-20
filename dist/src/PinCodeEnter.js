"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const PinCode_1 = require("./PinCode");
const TouchID = require("react-native-touch-id");
const Keychain = require("react-native-keychain");
var PinResultStatus;
(function (PinResultStatus) {
    PinResultStatus["initial"] = "initial";
    PinResultStatus["success"] = "success";
    PinResultStatus["failure"] = "failure";
    PinResultStatus["locked"] = "locked";
})(PinResultStatus = exports.PinResultStatus || (exports.PinResultStatus = {}));
class PinCodeEnter extends React.PureComponent {
    constructor(props) {
        super(props);
        this.endProcess = async (pinCode) => {
            if (this.props.handleResult) {
                this.props.handleResult(pinCode);
                return;
            }
            let pinAttempts = await +react_native_1.AsyncStorage.getItem('pinAttemptsRNPin') || 0;
            const pin = this.props.storedPin || this.keyChainResult.password;
            if (pin === pinCode) {
                this.setState({ pinCodeStatus: PinResultStatus.success });
                this.props.changeInternalStatus(PinResultStatus.success);
                react_native_1.AsyncStorage.multiRemove(['pinAttemptsRNPin', 'timePinLocked']);
            }
            else {
                pinAttempts++;
                if (pinAttempts >= this.props.maxAttempts) {
                    await react_native_1.AsyncStorage.setItem('timePinLocked', new Date().toISOString());
                    this.setState({ locked: true, pinCodeStatus: PinResultStatus.locked });
                    this.props.changeInternalStatus(PinResultStatus.locked);
                }
                else {
                    react_native_1.AsyncStorage.setItem('reactNativePinCode', pinAttempts.toString());
                    this.setState({ pinCodeStatus: PinResultStatus.failure });
                    this.props.changeInternalStatus(PinResultStatus.failure);
                }
            }
        };
        this.state = { pinCodeStatus: PinResultStatus.initial, locked: false };
        this.endProcess = this.endProcess.bind(this);
        this.launchTouchID = this.launchTouchID.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.pinStatusExternal !== this.props.pinStatusExternal) {
            this.setState({ pinCodeStatus: nextProps.pinStatusExternal });
        }
    }
    async componentWillMount() {
        this.keyChainResult = await Keychain.getGenericPassword();
    }
    componentDidMount() {
        TouchID.isSupported()
            .then(() => {
            setTimeout(() => {
                this.launchTouchID();
            });
        })
            .catch((error) => {
            console.warn('TouchID error', error);
        });
    }
    async launchTouchID() {
        try {
            await TouchID.authenticate(this.props.touchIDSentence);
            this.endProcess(this.props.storedPin || this.keyChainResult.password);
        }
        catch (e) {
            console.warn('TouchID error', e);
        }
    }
    render() {
        const pin = this.props.storedPin || this.keyChainResult.password;
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(PinCode_1.default, { endProcess: this.endProcess, sentenceTitle: this.props.title, subtitle: this.props.subtitle, status: PinCode_1.PinStatus.enter, previousPin: pin, pinCodeStatus: this.state.pinCodeStatus })));
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
