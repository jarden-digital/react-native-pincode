"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("./design/colors");
const grid_1 = require("./design/grid");
const delay_1 = require("./delay");
const utils_1 = require("./utils");
const async_storage_1 = require("@react-native-community/async-storage");
const d3_ease_1 = require("d3-ease");
const React = require("react");
const Animate_1 = require("react-move/Animate");
const react_native_1 = require("react-native");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
class ApplicationLocked extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderButton = () => {
            return (React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                    if (this.props.onClickButton) {
                        this.props.onClickButton();
                    }
                    else {
                        throw "Quit application";
                    }
                }, style: [styles.button, this.props.styleButton], accessible: true, accessibilityLabel: this.props.textButton },
                React.createElement(react_native_1.Text, { style: [
                        styles.closeButtonText,
                        this.props.styleTextButton
                    ] }, this.props.textButton)));
        };
        this.renderTimer = (minutes, seconds) => {
            return (React.createElement(react_native_1.View, { style: [
                    styles.viewTimer,
                    this.props.styleViewTimer
                ] },
                React.createElement(react_native_1.Text, { style: [
                        styles.textTimer,
                        this.props.styleTextTimer
                    ] }, `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds}`)));
        };
        this.renderTitle = () => {
            return (React.createElement(react_native_1.Text, { style: [styles.title, this.props.styleTitle] }, this.props.textTitle || "Maximum attempts reached"));
        };
        this.renderIcon = () => {
            return (React.createElement(react_native_1.View, { style: [styles.viewIcon, this.props.styleViewIcon] }, this.props.lockedIconComponent ?
                this.props.lockedIconComponent :
                React.createElement(MaterialIcons_1.default, { name: this.props.nameIcon, size: this.props.sizeIcon, color: this.props.colorIcon })));
        };
        this.renderErrorLocked = () => {
            const minutes = Math.floor(this.state.timeDiff / 1000 / 60);
            const seconds = Math.floor(this.state.timeDiff / 1000) % 60;
            return (React.createElement(react_native_1.View, null,
                React.createElement(Animate_1.default, { show: true, start: {
                        opacity: 0
                    }, enter: {
                        opacity: [1],
                        timing: { delay: 1000, duration: 1500, ease: d3_ease_1.easeLinear }
                    } }, (state) => (React.createElement(react_native_1.View, { style: [
                        styles.viewTextLock,
                        this.props.styleViewTextLock,
                        { opacity: state.opacity }
                    ] },
                    this.props.titleComponent
                        ? this.props.titleComponent()
                        : this.renderTitle(),
                    this.props.timerComponent
                        ? this.props.timerComponent()
                        : this.renderTimer(minutes, seconds),
                    this.props.iconComponent
                        ? this.props.iconComponent()
                        : this.renderIcon(),
                    React.createElement(react_native_1.Text, { style: [
                            styles.text,
                            this.props.styleText
                        ] }, this.props.textDescription
                        ? this.props.textDescription
                        : `To protect your information, access has been locked for ${Math.ceil(this.props.timeToLock / 1000 / 60)} minutes.`),
                    React.createElement(react_native_1.Text, { style: [
                            styles.text,
                            this.props.styleText
                        ] }, this.props.textSubDescription
                        ? this.props.textSubDescription
                        : "Come back later and try again.")))),
                React.createElement(Animate_1.default, { show: true, start: {
                        opacity: 0
                    }, enter: {
                        opacity: [1],
                        timing: { delay: 2000, duration: 1500, ease: d3_ease_1.easeLinear }
                    } }, (state) => (React.createElement(react_native_1.View, { style: { opacity: state.opacity, flex: 1 } },
                    React.createElement(react_native_1.View, { style: [
                            styles.viewCloseButton,
                            this.props.styleViewButton
                        ] }, this.props.buttonComponent
                        ? this.props.buttonComponent()
                        : this.renderButton()))))));
        };
        this.state = {
            timeDiff: 0
        };
        this.isUnmounted = false;
        this.timeLocked = 0;
        this.timer = this.timer.bind(this);
        this.renderButton = this.renderButton.bind(this);
        this.renderTitle = this.renderTitle.bind(this);
    }
    componentDidMount() {
        async_storage_1.default.getItem(this.props.timePinLockedAsyncStorageName).then(val => {
            this.timeLocked = new Date(val ? val : "").getTime() + this.props.timeToLock;
            this.timer();
        });
    }
    async timer() {
        const timeDiff = +new Date(this.timeLocked) - +new Date();
        this.setState({ timeDiff: Math.max(0, timeDiff) });
        await delay_1.default(1000);
        if (timeDiff < 1000) {
            this.props.changeStatus(utils_1.PinResultStatus.initial);
            async_storage_1.default.multiRemove([
                this.props.timePinLockedAsyncStorageName,
                this.props.pinAttemptsAsyncStorageName
            ]);
        }
        if (!this.isUnmounted) {
            this.timer();
        }
    }
    componentWillUnmount() {
        this.isUnmounted = true;
    }
    render() {
        return (React.createElement(react_native_1.View, { style: [
                styles.container,
                this.props.styleMainContainer
            ] }, this.renderErrorLocked()));
    }
}
ApplicationLocked.defaultProps = {
    styleButton: null,
    styleTextButton: null,
    styleViewTimer: null,
    styleTextTimer: null,
    styleTitle: null,
    styleViewIcon: null,
    nameIcon: "lock",
    sizeIcon: 24,
    colorIcon: colors_1.colors.white,
    styleViewTextLock: null,
    styleText: null,
    styleViewButton: null,
    styleMainContainer: null,
};
const styles = react_native_1.StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        backgroundColor: colors_1.colors.background,
        flexBasis: 0,
        left: 0,
        height: "100%",
        width: "100%",
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    text: {
        fontSize: grid_1.grid.unit,
        color: colors_1.colors.base,
        lineHeight: grid_1.grid.unit * grid_1.grid.lineHeight,
        textAlign: "center"
    },
    viewTextLock: {
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: grid_1.grid.unit * 3,
        paddingRight: grid_1.grid.unit * 3,
        flex: 3
    },
    textTimer: {
        fontFamily: react_native_1.Platform.OS === "ios" ? "Courier" : "monospace",
        fontSize: 20,
        color: colors_1.colors.base
    },
    title: {
        fontSize: grid_1.grid.navIcon,
        color: colors_1.colors.base,
        opacity: grid_1.grid.mediumOpacity,
        fontWeight: "200",
        marginBottom: grid_1.grid.unit * 4
    },
    viewIcon: {
        width: grid_1.grid.unit * 4,
        justifyContent: "center",
        alignItems: "center",
        height: grid_1.grid.unit * 4,
        borderRadius: grid_1.grid.unit * 2,
        opacity: grid_1.grid.mediumOpacity,
        backgroundColor: colors_1.colors.alert,
        overflow: "hidden",
        marginBottom: grid_1.grid.unit * 4
    },
    viewTimer: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "rgb(230, 231, 233)",
        marginBottom: grid_1.grid.unit * 4
    },
    viewCloseButton: {
        alignItems: "center",
        opacity: grid_1.grid.mediumOpacity,
        justifyContent: "center",
        marginTop: grid_1.grid.unit * 2
    },
    button: {
        backgroundColor: colors_1.colors.turquoise,
        borderRadius: grid_1.grid.border,
        paddingLeft: grid_1.grid.unit * 2,
        paddingRight: grid_1.grid.unit * 2,
        paddingBottom: grid_1.grid.unit,
        paddingTop: grid_1.grid.unit
    },
    closeButtonText: {
        color: colors_1.colors.white,
        fontWeight: "bold",
        fontSize: 14
    }
});
exports.default = ApplicationLocked;
