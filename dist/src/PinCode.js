"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PinStatus = void 0;
const delay_1 = require("./delay");
const colors_1 = require("./design/colors");
const grid_1 = require("./design/grid");
const d3_ease_1 = require("d3-ease");
const _ = require("lodash");
const React = require("react");
const Animate_1 = require("react-move/Animate");
const react_native_1 = require("react-native");
const react_native_easy_grid_1 = require("react-native-easy-grid");
var PinStatus;
(function (PinStatus) {
    PinStatus["choose"] = "choose";
    PinStatus["confirm"] = "confirm";
    PinStatus["enter"] = "enter";
})(PinStatus = exports.PinStatus || (exports.PinStatus = {}));
class PinCode extends React.PureComponent {
    constructor(props) {
        super(props);
        this.failedAttempt = async () => {
            await delay_1.default(300);
            this.setState({
                showError: true,
                attemptFailed: true,
                changeScreen: false,
            });
            this.doShake();
            await delay_1.default(this.props.delayBetweenAttempts);
            this.newAttempt();
        };
        this.newAttempt = async () => {
            this.setState({ changeScreen: true });
            await delay_1.default(200);
            this.setState({
                changeScreen: false,
                showError: false,
                attemptFailed: false,
                password: '',
            });
        };
        this.onPressButtonNumber = async (text) => {
            const currentPassword = this.state.password + text;
            this.setState({ password: currentPassword });
            if (this.props.getCurrentLength)
                this.props.getCurrentLength(currentPassword.length);
            if (currentPassword.length === this.props.passwordLength) {
                switch (this.props.status) {
                    case PinStatus.choose:
                        if (this.props.validationRegex &&
                            this.props.validationRegex.test(currentPassword)) {
                            this.showError(true);
                        }
                        else {
                            this.endProcess(currentPassword);
                        }
                        break;
                    case PinStatus.confirm:
                        if (currentPassword !== this.props.previousPin) {
                            this.showError();
                        }
                        // else {
                        //   this.endProcess(currentPassword);
                        // }
                        break;
                    case PinStatus.enter:
                        this.props.endProcess(currentPassword);
                        await delay_1.default(300);
                        break;
                    default:
                        break;
                }
            }
        };
        this.renderButtonNumber = (text) => {
            let alphanumericMap = new Map([
                ['1', ' '],
                ['2', 'ABC'],
                ['3', 'DEF'],
                ['4', 'GHI'],
                ['5', 'JKL'],
                ['6', 'MNO'],
                ['7', 'PQRS'],
                ['8', 'TUV'],
                ['9', 'WXYZ'],
                ['0', ' '],
            ]);
            const disabled = (this.state.password.length === this.props.passwordLength ||
                this.state.showError) &&
                !this.state.attemptFailed;
            return (React.createElement(Animate_1.default, { show: true, start: {
                    opacity: 1,
                }, update: {
                    opacity: [
                        this.state.showError && !this.state.attemptFailed ? 0.5 : 1,
                    ],
                    timing: { duration: 200, ease: d3_ease_1.easeLinear },
                } }, ({ opacity }) => (React.createElement(react_native_1.TouchableHighlight, { style: [
                    styles.buttonCircle,
                    { backgroundColor: this.props.colorCircleButtons },
                    this.props.styleButtonCircle,
                ], underlayColor: this.props.numbersButtonOverlayColor, disabled: disabled, onShowUnderlay: () => this.setState({ textButtonSelected: text }), onHideUnderlay: () => this.setState({ textButtonSelected: '' }), onPress: () => {
                    this.onPressButtonNumber(text);
                }, accessible: true, accessibilityLabel: text },
                React.createElement(react_native_1.View, null,
                    React.createElement(react_native_1.Text, { style: [
                            styles.text,
                            this.props.styleTextButton,
                            {
                                opacity: opacity,
                                color: this.state.textButtonSelected === text
                                    ? this.props.styleColorButtonTitleSelected
                                    : this.props.styleColorButtonTitle,
                            },
                            { fontFamily: this.props.fontFamily },
                        ] }, text),
                    this.props.alphabetCharsVisible && (React.createElement(react_native_1.Text, { style: [
                            styles.tinytext,
                            this.props.styleAlphabet,
                            {
                                opacity: opacity,
                                color: this.state.textButtonSelected === text
                                    ? this.props.styleColorButtonTitleSelected
                                    : this.props.styleColorButtonTitle,
                            },
                            { fontFamily: this.props.fontFamily },
                        ] }, alphanumericMap.get(text))))))));
        };
        this.endProcess = (pwd) => {
            setTimeout(() => {
                this.setState({ changeScreen: true });
                setTimeout(() => {
                    this.props.endProcess(pwd);
                }, 500);
            }, 400);
        };
        this.renderCirclePassword = () => {
            const { password, moveData, showError, changeScreen, attemptFailed } = this.state;
            const colorPwdErr = this.props.colorPasswordError;
            const colorPwd = this.props.colorPassword;
            const colorPwdEmp = this.props.colorPasswordEmpty || colorPwd;
            return (React.createElement(react_native_1.View, { style: [
                    styles.topViewCirclePassword,
                    this.props.styleCircleHiddenPassword,
                ] }, _.range(this.props.passwordLength).map((val) => {
                const lengthSup = ((password.length >= val + 1 && !changeScreen) || showError) &&
                    !attemptFailed;
                return (React.createElement(Animate_1.default, { key: val, show: true, start: {
                        opacity: 0.5,
                        height: this._circleSizeEmpty,
                        width: this._circleSizeEmpty,
                        borderRadius: this._circleSizeEmpty / 2,
                        color: colorPwdEmp,
                        marginRight: 15,
                        marginLeft: 15,
                        x: 0,
                        y: 0,
                    }, update: {
                        x: [moveData.x],
                        opacity: [lengthSup ? 1 : 0.5],
                        height: [
                            lengthSup ? this._circleSizeFull : this._circleSizeEmpty,
                        ],
                        width: [
                            lengthSup ? this._circleSizeFull : this._circleSizeEmpty,
                        ],
                        color: [
                            showError
                                ? colorPwdErr
                                : lengthSup && password.length > 0
                                    ? colorPwd
                                    : colorPwdEmp,
                        ],
                        borderRadius: [
                            lengthSup
                                ? this._circleSizeFull / 2
                                : this._circleSizeEmpty / 2,
                        ],
                        marginRight: [
                            lengthSup
                                ? 15 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                                : 15,
                        ],
                        marginLeft: [
                            lengthSup
                                ? 15 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                                : 15,
                        ],
                        y: [moveData.y],
                        timing: { duration: 200, ease: d3_ease_1.easeLinear },
                    } }, ({ opacity, x, height, width, color, borderRadius, marginRight, marginLeft, }) => (React.createElement(react_native_1.View, { style: styles.viewCircles }, ((!this.props.pinCodeVisible ||
                    (this.props.pinCodeVisible && !lengthSup)) && (React.createElement(react_native_1.View, { style: [
                        {
                            left: x,
                            height: height,
                            width: width,
                            opacity: opacity,
                            borderRadius: borderRadius,
                            marginLeft: marginLeft,
                            marginRight: marginRight,
                            backgroundColor: color,
                        },
                        this.props.stylePinCodeCircle,
                    ] }))) || (React.createElement(react_native_1.View, { style: {
                        left: x,
                        width: this._circleSizeFull,
                        opacity: opacity,
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                    } },
                    React.createElement(react_native_1.Text, { style: [
                            {
                                color: colorPwd,
                                fontFamily: this.props.fontFamily,
                                fontSize: this.props.textPasswordVisibleSize,
                            },
                            { fontFamily: this.props.fontFamily },
                        ] }, this.state.password[val])))))));
            })));
        };
        this.renderButtonDelete = (opacity) => {
            return (React.createElement(react_native_1.TouchableHighlight, { style: [
                    // styles.buttonCircle,
                    { backgroundColor: colors_1.colors.transparent },
                    this.props.styleButtonCircle,
                ], disabled: this.state.password.length === 0, underlayColor: this.props.numbersButtonOverlayColor, onHideUnderlay: () => this.setState({
                    colorDelete: this.props.styleDeleteButtonColorHideUnderlay,
                }), onShowUnderlay: () => this.setState({
                    colorDelete: this.props.styleDeleteButtonColorShowUnderlay,
                }), onPress: () => {
                    if (this.state.password.length > 0) {
                        const newPass = this.state.password.slice(0, -1);
                        this.setState({ password: newPass });
                        if (this.props.getCurrentLength)
                            this.props.getCurrentLength(newPass.length);
                    }
                }, accessible: true, accessibilityLabel: this.props.buttonDeleteText },
                React.createElement(react_native_1.View, { style: [styles.colIcon, this.props.styleColumnDeleteButton] }, this.props.customBackSpaceIcon ? (this.props.customBackSpaceIcon({
                    colorDelete: this.state.colorDelete,
                    opacity,
                })) : (React.createElement(React.Fragment, null,
                    !this.props.iconButtonDeleteDisabled && null,
                    React.createElement(react_native_1.Text, { style: [
                            styles.text,
                            // this.props.styleDeleteButtonText,
                            { opacity: opacity },
                            { fontFamily: this.props.fontFamily },
                        ] }, '<'))))));
        };
        this.renderTitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
            return (React.createElement(react_native_1.Text, { style: [
                    styles.textTitle,
                    this.props.styleTextTitle,
                    { color: colorTitle, opacity: opacityTitle },
                    { fontFamily: this.props.fontFamily },
                ] }, (attemptFailed && this.props.titleAttemptFailed) ||
                (showError && this.props.titleConfirmFailed) ||
                (showError && this.props.titleValidationFailed) ||
                this.props.sentenceTitle));
        };
        this.renderSubtitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
            return (React.createElement(react_native_1.Text, { style: [
                    styles.textSubtitle,
                    this.props.styleTextSubtitle,
                    { color: colorTitle, opacity: opacityTitle },
                    { fontFamily: this.props.fontFamily },
                ] }, attemptFailed || showError
                ? this.props.subtitleError
                : this.props.subtitle));
        };
        this.state = {
            password: '',
            moveData: { x: 0, y: 0 },
            showError: false,
            textButtonSelected: '',
            colorDelete: this.props.styleDeleteButtonColorHideUnderlay,
            attemptFailed: false,
            changeScreen: false,
        };
        this._circleSizeEmpty = this.props.styleCircleSizeEmpty || 14;
        this._circleSizeFull = this.props.styleCircleSizeFull + 2 || 14;
    }
    componentDidMount() {
        if (this.props.getCurrentLength)
            this.props.getCurrentLength(0);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.pinCodeStatus !== 'failure' &&
            this.props.pinCodeStatus === 'failure') {
            this.failedAttempt();
        }
        if (prevProps.pinCodeStatus !== 'locked' &&
            this.props.pinCodeStatus === 'locked') {
            this.setState({ password: '' });
        }
    }
    async doShake() {
        const duration = 70;
        if (this.props.vibrationEnabled)
            react_native_1.Vibration.vibrate(500, false);
        const length = react_native_1.Dimensions.get('window').width / 3;
        await delay_1.default(duration);
        this.setState({ moveData: { x: length, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: -length, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: length / 2, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: -length / 2, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: length / 4, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: -length / 4, y: 0 } });
        await delay_1.default(duration);
        this.setState({ moveData: { x: 0, y: 0 } });
        if (this.props.getCurrentLength)
            this.props.getCurrentLength(0);
    }
    async showError(isErrorValidation = false) {
        this.setState({ changeScreen: true });
        await delay_1.default(300);
        this.setState({ showError: true, changeScreen: false });
        this.doShake();
        await delay_1.default(3000);
        this.setState({ changeScreen: true });
        await delay_1.default(200);
        this.setState({ showError: false, password: '' });
        await delay_1.default(200);
        this.props.endProcess(this.state.password, isErrorValidation);
        if (isErrorValidation)
            this.setState({ changeScreen: false });
    }
    render() {
        const { password, showError, attemptFailed, changeScreen } = this.state;
        return (React.createElement(react_native_1.View, { style: [styles.container, this.props.styleContainer] },
            React.createElement(Animate_1.default, { show: true, start: {
                    opacity: 0,
                    colorTitle: this.props.styleColorTitle,
                    colorSubtitle: this.props.styleColorSubtitle,
                    opacityTitle: 1,
                }, enter: {
                    opacity: [1],
                    colorTitle: [this.props.styleColorTitle],
                    colorSubtitle: [this.props.styleColorSubtitle],
                    opacityTitle: [1],
                    timing: { duration: 200, ease: d3_ease_1.easeLinear },
                }, update: {
                    opacity: [changeScreen ? 0 : 1],
                    colorTitle: [
                        showError || attemptFailed
                            ? this.props.styleColorTitleError
                            : this.props.styleColorTitle,
                    ],
                    colorSubtitle: [
                        showError || attemptFailed
                            ? this.props.styleColorSubtitleError
                            : this.props.styleColorSubtitle,
                    ],
                    opacityTitle: [showError || attemptFailed ? grid_1.grid.highOpacity : 1],
                    timing: { duration: 200, ease: d3_ease_1.easeLinear },
                } }, ({ opacity, colorTitle, colorSubtitle, opacityTitle }) => (React.createElement(react_native_1.View, { style: [
                    styles.viewTitle,
                    this.props.styleViewTitle,
                    { opacity: opacity },
                ] },
                this.props.titleComponent
                    ? this.props.titleComponent()
                    : this.renderTitle(colorTitle, opacityTitle, attemptFailed, showError),
                this.props.subtitleComponent
                    ? this.props.subtitleComponent()
                    : this.renderSubtitle(colorSubtitle, opacityTitle, attemptFailed, showError)))),
            React.createElement(react_native_1.View, { style: styles.flexCirclePassword }, this.props.passwordComponent
                ? this.props.passwordComponent()
                : this.renderCirclePassword()),
            React.createElement(react_native_easy_grid_1.Grid, { style: styles.grid },
                React.createElement(react_native_easy_grid_1.Row, { style: [styles.row, this.props.styleRowButtons] }, _.range(1, 4).map((i) => {
                    return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: [
                            styles.colButtonCircle,
                            this.props.styleColumnButtons,
                        ] }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())));
                })),
                React.createElement(react_native_easy_grid_1.Row, { style: [styles.row, this.props.styleRowButtons] }, _.range(4, 7).map((i) => {
                    return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: [
                            styles.colButtonCircle,
                            this.props.styleColumnButtons,
                        ] }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())));
                })),
                React.createElement(react_native_easy_grid_1.Row, { style: [styles.row, this.props.styleRowButtons] }, _.range(7, 10).map((i) => {
                    return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: [
                            styles.colButtonCircle,
                            this.props.styleColumnButtons,
                        ] }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())));
                })),
                React.createElement(react_native_easy_grid_1.Row, { style: [
                        styles.row,
                        // styles.rowWithEmpty,
                        this.props.styleRowButtons,
                    ] },
                    React.createElement(react_native_easy_grid_1.Col, { style: [styles.colEmpty, this.props.styleEmptyColumn] }, this.props.emptyColumnComponent
                        ? this.props.emptyColumnComponent(this.props.launchTouchID)
                        : null),
                    React.createElement(react_native_easy_grid_1.Col, { style: [styles.colButtonCircle, this.props.styleColumnButtons] }, this.props.buttonNumberComponent
                        ? this.props.buttonNumberComponent('0', this.onPressButtonNumber)
                        : this.renderButtonNumber('0')),
                    React.createElement(react_native_easy_grid_1.Col, { style: [styles.colButtonCircle, this.props.styleColumnButtons] },
                        React.createElement(Animate_1.default, { show: true, start: {
                                opacity: 1,
                            }, update: {
                                opacity: [
                                    this.state.showError && !this.state.attemptFailed ? 0.5 : 1,
                                ],
                                timing: { duration: 400, ease: d3_ease_1.easeLinear },
                            } }, ({ opacity }) => this.props.buttonDeleteComponent
                            ? this.props.buttonDeleteComponent(() => {
                                if (this.state.password.length > 0) {
                                    const newPass = this.state.password.slice(0, -1);
                                    this.setState({ password: newPass });
                                    if (this.props.getCurrentLength)
                                        this.props.getCurrentLength(newPass.length);
                                }
                            })
                            : this.renderButtonDelete(opacity))))),
            this.props.footerComponent &&
                this.props.footerComponent(this.props, this.state)));
    }
}
PinCode.defaultProps = {
    alphabetCharsVisible: false,
    styleButtonCircle: null,
    colorCircleButtons: colors_1.colors.transparent,
    styleDeleteButtonColorHideUnderlay: colors_1.colors.transparent,
    numbersButtonOverlayColor: colors_1.colors.grey100,
    styleDeleteButtonColorShowUnderlay: colors_1.colors.grey100,
    styleTextButton: null,
    styleColorButtonTitleSelected: colors_1.colors.black,
    styleColorButtonTitle: colors_1.colors.black,
    colorPasswordError: colors_1.colors.black,
    colorPassword: colors_1.colors.black,
    styleCircleHiddenPassword: null,
    styleColumnDeleteButton: null,
    styleDeleteButtonIcon: 'backspace',
    styleDeleteButtonSize: 30,
    styleDeleteButtonText: null,
    buttonDeleteText: 'delete',
    styleTextTitle: null,
    styleTextSubtitle: null,
    styleContainer: null,
    styleColorTitle: colors_1.colors.black,
    styleColorSubtitle: colors_1.colors.black,
    styleColorTitleError: colors_1.colors.black,
    styleColorSubtitleError: colors_1.colors.black,
    styleViewTitle: null,
    styleRowButtons: null,
    styleColumnButtons: null,
    styleEmptyColumn: null,
    textPasswordVisibleFamily: 'system font',
    textPasswordVisibleSize: 26,
    vibrationEnabled: true,
    delayBetweenAttempts: 3000,
    fontFamily: 'system font',
};
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: grid_1.grid.unit * 2,
        width: '100%',
    },
    viewTitle: {
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        flex: 2,
    },
    row: {
        flex: 0,
        flexShrink: 1,
        alignItems: 'center',
        height: grid_1.grid.unit * 4,
        marginBottom: grid_1.grid.unit,
    },
    // rowWithEmpty: {
    //   flexShrink: 0,
    //   justifyContent: 'flex-end',
    //   backgroundColor: 'yellow',
    // },
    colButtonCircle: {
        flex: 0,
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4,
    },
    colEmpty: {
        flex: 0,
        marginLeft: grid_1.grid.unit / 2,
        marginRight: grid_1.grid.unit / 2,
        width: grid_1.grid.unit * 4,
        height: grid_1.grid.unit * 4,
    },
    colIcon: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    text: {
        color: 'rgb(0, 0, 0)',
        fontSize: 26,
        lineHeight: 32,
        fontWeight: '400',
        fontFamily: 'CircularStd-Book',
    },
    tinytext: {
        fontSize: grid_1.grid.unit / 2,
        fontWeight: '300',
    },
    buttonCircle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: grid_1.grid.unit * 3.5,
        height: grid_1.grid.unit * 3.5,
        backgroundColor: 'rgb(242, 245, 251)',
        borderRadius: grid_1.grid.unit * 2,
    },
    textTitle: {
        fontSize: 26,
        fontWeight: '400',
        lineHeight: 32,
    },
    textSubtitle: {
        fontSize: 16,
        lineHeight: 20,
        fontWeight: '400',
        textAlign: 'center',
        marginTop: 16,
    },
    flexCirclePassword: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topViewCirclePassword: {
        flexDirection: 'row',
        height: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewCircles: {
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textDeleteButton: {
        fontWeight: '200',
        marginTop: 5,
    },
    grid: {
        justifyContent: 'flex-start',
        width: '100%',
        flex: 5,
        paddingBottom: grid_1.grid.unit,
        paddingTop: grid_1.grid.unit,
    },
});
exports.default = PinCode;
