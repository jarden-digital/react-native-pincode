"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const colors_1 = require("./design/colors");
const grid_1 = require("./design/grid");
const Animate_1 = require("react-move/Animate");
const d3_ease_1 = require("d3-ease");
const delay_1 = require("./delay");
const MaterialIcons_1 = require("react-native-vector-icons/MaterialIcons");
class ApplicationLocked extends React.PureComponent {
    constructor(props) {
        super(props);
        this.renderErrorLocked = () => {
            const minutes = Math.floor(this.state.timeDiff / 1000 / 60);
            const seconds = Math.floor(this.state.timeDiff / 1000) % 60;
            return (React.createElement(react_native_1.View, { style: styles.viewErrorLocked },
                React.createElement(react_native_1.View, { style: styles.viewTextErrorLock },
                    React.createElement(Animate_1.default, { show: true, start: {
                            opacity: 0
                        }, enter: {
                            opacity: [1],
                            timing: { delay: 1000, duration: 1500, ease: d3_ease_1.easeLinear }
                        } }, (state) => (React.createElement(react_native_1.View, { style: [styles.viewTextLock, { opacity: state.opacity }] },
                        React.createElement(react_native_1.Text, { style: styles.title }, "Maximum attempts reached"),
                        React.createElement(react_native_1.View, { style: styles.viewTimer },
                            React.createElement(react_native_1.Text, { style: styles.textTimer }, `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`)),
                        React.createElement(react_native_1.View, { style: styles.viewIcon },
                            React.createElement(MaterialIcons_1.default, { name: "lock", size: 24, color: colors_1.colors.white })),
                        React.createElement(react_native_1.Text, { style: styles.text }, `To protect your information, access has been locked for ${this.props.timeToLock / 1000 / 60} minutes.`),
                        React.createElement(react_native_1.Text, { style: styles.text }, "Come back later and try again.")))),
                    React.createElement(Animate_1.default, { show: true, start: {
                            opacity: 0
                        }, enter: {
                            opacity: [1],
                            timing: { delay: 2000, duration: 1500, ease: d3_ease_1.easeLinear }
                        } }, (state) => (React.createElement(react_native_1.View, { style: { opacity: state.opacity, flex: 1 } },
                        React.createElement(react_native_1.View, { style: styles.viewCloseButton },
                            React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
                                    if (this.props.onClickButton) {
                                        this.props.onClickButton();
                                    }
                                    else {
                                        throw ('quit application');
                                    }
                                }, style: styles.closeButton },
                                React.createElement(react_native_1.Text, { style: styles.closeButtonText }, this.props.textButton)))))))));
        };
        this.state = {
            timeDiff: 0
        };
        this.isUnmounted = false;
        this.timeLocked = new Date().getTime() + this.props.timeToLock;
        this.timer = this.timer.bind(this);
    }
    componentDidMount() {
        react_native_1.AsyncStorage.getItem('timePinLocked').then((val) => {
            this.timeLocked = new Date(val).getTime() + this.props.timeToLock;
            this.timer();
        });
    }
    async timer() {
        this.setState({ timeDiff: +new Date(this.timeLocked) - +new Date() });
        if (this.state.timeDiff <= 0) {
            react_native_1.AsyncStorage.removeItem('timePinLocked');
        }
        await delay_1.default(1000);
        if (!this.isUnmounted) {
            this.timer();
        }
    }
    componentWillUnmount() {
        this.isUnmounted = true;
    }
    render() {
        return (React.createElement(react_native_1.View, { style: styles.container }, this.renderErrorLocked()));
    }
}
exports.default = ApplicationLocked;
const styles = react_native_1.StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        flex: 1,
        flexBasis: 0,
        backgroundColor: colors_1.colors.background,
        justifyContent: 'center'
    },
    viewTextErrorLock: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: '100%',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center'
    },
    text: {
        fontSize: grid_1.grid.unit,
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.font,
        lineHeight: grid_1.grid.unit * grid_1.grid.lineHeight,
        textAlign: 'center'
    },
    viewErrorLocked: {
        flex: 1,
        width: react_native_1.Dimensions.get('window').width,
        height: react_native_1.Dimensions.get('window').height
    },
    viewTextLock: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: grid_1.grid.unit * 3,
        paddingRight: grid_1.grid.unit * 3,
        flex: 3
    },
    textTimer: {
        fontFamily: 'RobotoMono-Medium',
        fontSize: 20,
        color: colors_1.colors.base
    },
    title: {
        fontSize: grid_1.grid.navIcon,
        color: colors_1.colors.base,
        opacity: grid_1.grid.mediumOpacity,
        fontFamily: grid_1.grid.fontLight,
        marginBottom: grid_1.grid.unit * 4
    },
    viewIcon: {
        width: grid_1.grid.unit * 4,
        justifyContent: 'center',
        alignItems: 'center',
        height: grid_1.grid.unit * 4,
        borderRadius: grid_1.grid.unit * 2,
        opacity: grid_1.grid.mediumOpacity,
        backgroundColor: colors_1.colors.alert,
        overflow: 'hidden',
        marginBottom: grid_1.grid.unit * 4
    },
    viewTimer: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 10,
        paddingTop: 10,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'rgb(230, 231, 233)',
        marginBottom: grid_1.grid.unit * 4
    },
    viewCloseButton: {
        alignItems: 'center',
        opacity: grid_1.grid.mediumOpacity,
        justifyContent: 'center',
        marginTop: grid_1.grid.unit * 2
    },
    closeButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeButtonText: {
        color: colors_1.colors.base,
        fontFamily: grid_1.grid.fontBold,
        fontSize: 14
    }
});
