"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const Markdown_1 = require("../Markdown");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
const grid_1 = require("../../design/grid");
const colors_1 = require("../../design/colors");
class PinCodeExplanation extends React.PureComponent {
    render() {
        const textStyle = { paragraph: styles.text, strong: styles.textBold };
        const textSmallStyle = { paragraph: styles.textSmall, strong: styles.textSmallBold };
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(MaterialIcons_1.default, { name: "fingerprint", size: 50, color: "#445878" }),
            React.createElement(Markdown_1.default, { styles: textStyle, text: "To **protect your information** and allow you to continue your application if you have to leave before the end, we need you to create a **four digits PIN**." }),
            React.createElement(Markdown_1.default, { styles: textSmallStyle, text: "If your device allows **fingerprint** or **face recognition** authentication, you will also be able to use it." }),
            React.createElement(react_native_1.TouchableOpacity, { style: styles.button, onPress: () => this.props.navigation.navigate('pin-code-flow-choose-pin', { changeProcess: this.props.navigation.state.params.changeProcess }) },
                React.createElement(react_native_1.Text, { style: styles.textButton }, "Choose PIN"))));
    }
}
exports.default = PinCodeExplanation;
let styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: grid_1.grid.unit * 3
    },
    text: {
        fontSize: grid_1.grid.unit,
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.font,
        lineHeight: grid_1.grid.unit * grid_1.grid.lineHeight,
        textAlign: 'center',
        marginTop: grid_1.grid.unit * 3,
        marginBottom: grid_1.grid.unit * 3
    },
    textSmall: {
        fontSize: grid_1.grid.body,
        marginTop: grid_1.grid.unit / 4,
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.font,
        lineHeight: grid_1.grid.body * grid_1.grid.lineHeight,
        textAlign: 'center',
        marginBottom: grid_1.grid.unit * 4
    },
    textBold: {
        fontSize: grid_1.grid.unit,
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.fontBold,
        textAlign: 'center'
    },
    textSmallBold: {
        fontSize: grid_1.grid.body,
        marginTop: grid_1.grid.unit,
        marginBottom: grid_1.grid.unit / 1.75,
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.fontBold
    },
    button: {
        backgroundColor: 'rgb(159, 203, 206)',
        borderRadius: 2,
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 15,
        paddingTop: 15
    },
    textButton: {
        color: colors_1.colors.white,
        fontFamily: 'Roboto-Bold',
        fontSize: 16
    }
});
