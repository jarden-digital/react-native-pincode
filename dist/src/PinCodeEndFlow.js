"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const colors_1 = require("../../design/colors");
const grid_1 = require("../../design/grid");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const delay_1 = require("../../../utils/delay");
class PinCodeEndFlow extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.closePage = async () => {
            await delay_1.default(20000);
            this.props.navigation.state.params.changeProcess(true, false, false, false);
        };
    }
    componentWillMount() {
        this.closePage();
    }
    render() {
        const textStyle = { paragraph: styles.text, strong: styles.textBold };
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(react_native_1.Text, { style: styles.title }, "Thank you"),
            React.createElement(react_native_1.View, { style: styles.iconView },
                React.createElement(MaterialIcons_1.default, { name: "check", size: 24, color: colors_1.colors.white })),
            React.createElement(react_native_1.Text, { style: { marginBottom: grid_1.grid.unit } },
                React.createElement(react_native_1.Text, { style: styles.text }, "Your "),
                React.createElement(react_native_1.Text, { style: styles.textBold }, "PIN Code"),
                React.createElement(react_native_1.Text, { style: styles.text }, " has been saved.")),
            React.createElement(react_native_1.Text, { style: styles.text }, "Let's start your application now.")));
    }
}
exports.default = PinCodeEndFlow;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: grid_1.grid.unit * 3
    },
    viewElements: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: grid_1.grid.navIcon,
        color: colors_1.colors.base,
        opacity: grid_1.grid.mediumOpacity,
        fontFamily: grid_1.grid.fontLight,
        marginBottom: grid_1.grid.unit * 5
    },
    text: {
        fontSize: grid_1.grid.unit,
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.font,
        textAlign: 'center',
        lineHeight: grid_1.grid.unit
    },
    textBold: {
        fontSize: grid_1.grid.unit,
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.fontBold,
        textAlign: 'center',
        lineHeight: grid_1.grid.unit / 2
    },
    iconView: {
        width: grid_1.grid.unit * 4,
        marginBottom: grid_1.grid.unit * 5,
        justifyContent: 'center',
        alignItems: 'center',
        height: grid_1.grid.unit * 4,
        borderRadius: grid_1.grid.unit * 2,
        backgroundColor: colors_1.colors.turquoise,
        opacity: grid_1.grid.highOpacity,
        overflow: 'hidden'
    }
});
