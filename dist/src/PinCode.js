'use strict';
Object.defineProperty(exports, '__esModule', { value: true })
const React = require('react')
const react_native_1 = require('react-native')
const react_native_easy_grid_1 = require('react-native-easy-grid')
const grid_1 = require('./design/grid')
const colors_1 = require('./design/colors')
const MaterialIcons_1 = require('react-native-vector-icons/MaterialIcons')
const _ = require('lodash')
const Animate_1 = require('react-move/Animate')
const d3_ease_1 = require('d3-ease')
const delay_1 = require('./delay')
var PinStatus;
(function (PinStatus) {
  PinStatus['choose'] = 'choose';
  PinStatus['confirm'] = 'confirm';
  PinStatus['enter'] = 'enter';
})(PinStatus = exports.PinStatus || (exports.PinStatus = {}))
class PinCode extends React.PureComponent {
  constructor (props) {
      super(props)
        this.failedAttempt = async () => {
          this.setState({ changeScreen: true })
            await delay_1.default(300)
            this.setState({ showError: true, attemptFailed: true, changeScreen: false, password: '' })
            this.doShake()
        };
      this.newAttempt = async () => {
          this.setState({ changeScreen: true })
            await delay_1.default(200)
            this.setState({ changeScreen: false, showError: false, attemptFailed: false })
        };
      this.onPressButtonNumber = (text) => {
          if (this.state.showError && this.state.attemptFailed)
              {this.newAttempt();}
          const currentPassword = this.state.password + text
            this.setState({ password: currentPassword })
            if (currentPassword.length === this.props.passwordLength) {
              switch (this.props.status) {
                  case PinStatus.choose:
                    this.endProcess(currentPassword)
                        break;
                  case PinStatus.confirm:
                    if (currentPassword !== this.props.previousPin) {
                          this.showError()
                        }                        else {
                          this.endProcess(currentPassword)
                        }
                    break
                    case PinStatus.enter:
                    this.props.endProcess(currentPassword)
                        break;
                  default:
                    break
                }
            }
        }
        this.renderButtonNumber = (text) => {
          const disabled = (this.state.password.length === this.props.passwordLength || this.state.showError) && !this.state.attemptFailed
            return (React.createElement(Animate_1.default, { show: true,
start: {
              opacity: 1
            },
update: {
                  opacity: [this.state.showError && !this.state.attemptFailed ? 0.5 : 1],
                  timing: { duration: 200, ease: d3_ease_1.easeLinear }
                } }, ({ opacity }) => (React.createElement(react_native_1.TouchableHighlight, { style: styles.buttonCircle,
underlayColor: this.props.numbersButtonOverlayColor ? this.props.numbersButtonOverlayColor : colors_1.colors.turquoise,
disabled: disabled,
onShowUnderlay: () => this.setState({ textButtonSelected: text }),
onHideUnderlay: () => this.setState({ textButtonSelected: '' }),
onPress: () => {
                  this.onPressButtonNumber(text)
                } },
                React.createElement(react_native_1.Text, { style: [styles.text, {
                  opacity: opacity,
                  color: this.state.textButtonSelected === text ? colors_1.colors.white : colors_1.colors.grey
                }] }, text)))))
        };
      this.endProcess = (pwd) => {
          setTimeout(() => {
              this.setState({ changeScreen: true })
                setTimeout(() => {
                  this.props.endProcess(pwd)
                }, 500)
            }, 400)
        };
      this.renderCirclePassword = () => {
          const { password, moveData, showError, changeScreen, attemptFailed } = this.state
            return (React.createElement(react_native_1.View, { style: styles.viewCirclePassword }, _.range(this.props.passwordLength).map((val) => {
              const lengthSup = ((password.length >= val + 1 && !changeScreen) || showError) && !attemptFailed
                const marginSup = ((password.length > 0 && !changeScreen) || showError) && !attemptFailed
                return (React.createElement(Animate_1.default, { key: val,
show: true,
start: {
                  opacity: 0.5,
                  height: 4,
                  width: 4,
                  borderRadius: 2,
                  color: (this.props.colorPassword ? this.props.colorPassword : colors_1.colors.turquoise),
                  marginRight: 10,
                  marginLeft: 10,
                  marginBottom: grid_1.grid.unit * 2,
                  marginTop: grid_1.grid.unit * 4,
                  x: 0,
                  y: 0
                },
update: {
                      x: [moveData.x],
                      opacity: [lengthSup ? 1 : 0.5],
                      height: [lengthSup ? 8 : 4],
                      width: [lengthSup ? 8 : 4],
                      color: [showError ? colors_1.colors.alert : (this.props.colorPassword ? this.props.colorPassword : colors_1.colors.turquoise)],
                      borderRadius: [lengthSup ? 4 : 2],
                      marginRight: [lengthSup ? 8 : 10],
                      marginLeft: [lengthSup ? 8 : 10],
                      marginBottom: [marginSup ? 30 : grid_1.grid.unit * 2],
                      marginTop: [marginSup ? 62 : grid_1.grid.unit * 4],
                      y: [moveData.y],
                      timing: { duration: 200, ease: d3_ease_1.easeLinear }
                    } }, ({ opacity, x, height, width, color, borderRadius, marginRight, marginTop, marginLeft, marginBottom }) => (React.createElement(react_native_1.View, { style: {
                      left: x,
                      opacity: opacity,
                      height: height,
                      width: width,
                      borderRadius: borderRadius,
                      marginLeft: marginLeft,
                      marginRight: marginRight,
                      marginBottom: marginBottom,
                      marginTop: marginTop,
                      backgroundColor: color
                    } }))))
            })))
        };
      this.renderButtonDelete = (opacity) => {
          return (React.createElement(react_native_1.TouchableHighlight, { style: styles.colIcon, disabled: this.state.password.length === 0, underlayColor: 'transparent', onHideUnderlay: () => this.setState({ colorDelete: 'rgb(211, 213, 218)' }), onShowUnderlay: () => this.setState({ colorDelete: colors_1.colors.turquoise }), onPress: () => this.state.password.length > 0 && this.setState({ password: this.state.password.slice(0, -1) }) },
                React.createElement(react_native_1.View, null,
                    React.createElement(MaterialIcons_1.default, { name: 'backspace', size: 30, color: this.state.colorDelete, style: { opacity: opacity } }),
                    React.createElement(react_native_1.Text, { style: {
                      color: this.state.colorDelete,
                      fontWeight: '200',
                      marginTop: 5,
                      opacity: opacity
                    } }, 'delete'))))
        };
      this.renderTitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
          return (React.createElement(react_native_1.Text, { style: [styles.textTitle, { color: colorTitle, opacity: opacityTitle }] }, (attemptFailed && this.props.titleAttemptFailed) || (showError && this.props.titleConfirmFailed) || this.props.sentenceTitle))
        };
      this.renderSubtitle = (colorTitle, opacityTitle, attemptFailed, showError) => {
          return (React.createElement(react_native_1.Text, { style: [styles.textSubtitle, { color: colorTitle, opacity: opacityTitle }] }, attemptFailed || showError ? this.props.subtitleError : this.props.subtitle))
        };
      this.state = {
          password: '',
          moveData: { x: 0, y: 0 },
          showError: false,
          textButtonSelected: '',
          colorDelete: 'rgb(211, 213, 218)',
          attemptFailed: false,
          changeScreen: false
        }
        this.renderButtonNumber = this.renderButtonNumber.bind(this)
        this.renderCirclePassword = this.renderCirclePassword.bind(this)
        this.doShake = this.doShake.bind(this)
        this.showError = this.showError.bind(this)
        this.endProcess = this.endProcess.bind(this)
        this.failedAttempt = this.failedAttempt.bind(this)
        this.newAttempt = this.newAttempt.bind(this)
        this.renderButtonDelete = this.renderButtonDelete.bind(this)
        this.onPressButtonNumber = this.onPressButtonNumber.bind(this)
        this.renderTitle = this.renderTitle.bind(this)
    }
  componentWillUpdate (nextProps) {
      if (this.props.pinCodeStatus !== 'failure' && nextProps.pinCodeStatus === 'failure') {
          this.failedAttempt()
        }
    }
  async doShake () {
      const duration = 70
        react_native_1.Vibration.vibrate(500, false)
        const length = react_native_1.Dimensions.get('window').width / 3
        await delay_1.default(duration)
        this.setState({ moveData: { x: length, y: 0 } })
        await delay_1.default(duration)
        this.setState({ moveData: { x: -length, y: 0 } })
        await delay_1.default(duration)
        this.setState({ moveData: { x: length / 2, y: 0 } })
        await delay_1.default(duration)
        this.setState({ moveData: { x: -length / 2, y: 0 } })
        await delay_1.default(duration)
        this.setState({ moveData: { x: length / 4, y: 0 } })
        await delay_1.default(duration)
        this.setState({ moveData: { x: -length / 4, y: 0 } })
        await delay_1.default(duration)
        this.setState({ moveData: { x: 0, y: 0 }, password: '' })
    }
  async showError () {
      this.setState({ changeScreen: true })
        await delay_1.default(300)
        this.setState({ showError: true, changeScreen: false })
        this.doShake()
        await delay_1.default(3000)
        this.setState({ changeScreen: true })
        await delay_1.default(200)
        this.setState({ showError: false })
        await delay_1.default(200)
        this.props.endProcess(this.state.password)
    }
  render () {
      const { password, showError, attemptFailed, changeScreen } = this.state
        return (React.createElement(react_native_1.View, { style: styles.container },
            React.createElement(Animate_1.default, { show: true,
start: {
              opacity: 0,
              colorTitle: colors_1.colors.grey,
              opacityTitle: 1
            },
enter: {
                  opacity: [1],
                  colorTitle: [colors_1.colors.grey],
                  opacityTitle: [1],
                  timing: { duration: 200, ease: d3_ease_1.easeLinear }
                },
update: {
                  opacity: [changeScreen ? 0 : 1],
                  colorTitle: [showError || attemptFailed ? colors_1.colors.alert : colors_1.colors.grey],
                  opacityTitle: [showError || attemptFailed ? grid_1.grid.highOpacity : 1],
                  timing: { duration: 200, ease: d3_ease_1.easeLinear }
                } }, ({ opacity, colorTitle, opacityTitle, opacityError }) => (React.createElement(react_native_1.View, { style: [styles.viewTitle, { opacity: opacity }] },
                this.props.titleComponent ? this.props.titleComponent()
                    : this.renderTitle(colorTitle, opacityTitle, attemptFailed, showError),
                this.props.subtitleComponent ? this.props.subtitleComponent()
                    : this.renderSubtitle(colorTitle, opacityTitle, attemptFailed, showError)))),
            React.createElement(react_native_1.View, null, this.props.passwordComponent ? this.props.passwordComponent() : this.renderCirclePassword()),
            React.createElement(react_native_easy_grid_1.Grid, { style: { maxHeight: grid_1.grid.unit * 22, maxWidth: grid_1.grid.unit * 16.25 } },
                React.createElement(react_native_easy_grid_1.Row, { style: styles.row }, _.range(1, 4).map((i) => {
                  return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: styles.colButtonCircle }, this.props.buttonNumberComponent ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())))
                })),
                React.createElement(react_native_easy_grid_1.Row, { style: styles.row }, _.range(4, 7).map((i) => {
                  return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: styles.colButtonCircle }, this.props.buttonNumberComponent ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())))
                })),
                React.createElement(react_native_easy_grid_1.Row, { style: styles.row }, _.range(7, 10).map((i) => {
                  return (React.createElement(react_native_easy_grid_1.Col, { key: i, style: styles.colButtonCircle }, this.props.buttonNumberComponent ? this.props.buttonNumberComponent(i, this.onPressButtonNumber)
                        : this.renderButtonNumber(i.toString())))
                })),
                React.createElement(react_native_easy_grid_1.Row, { style: styles.row },
                    React.createElement(react_native_easy_grid_1.Col, { style: styles.colEmpty }),
                    React.createElement(react_native_easy_grid_1.Col, { style: styles.colButtonCircle }, this.props.buttonNumberComponent ? this.props.buttonNumberComponent('0', this.onPressButtonNumber)
                        : this.renderButtonNumber('0')),
                    React.createElement(react_native_easy_grid_1.Col, null,
                        React.createElement(Animate_1.default, { show: true,
start: {
                          opacity: 0.5
                        },
update: {
                              opacity: [password.length === 0 || password.length === this.props.passwordLength ? 0.5 : 1],
                              timing: { duration: 400, ease: d3_ease_1.easeLinear }
                            } }, ({ opacity }) => (this.props.buttonDeleteComponent
                            ? this.props.buttonDeleteComponent(() => this.state.password.length > 0 && this.setState({ password: this.state.password.slice(0, -1) }))
                            : this.renderButtonDelete(opacity))))))))
    }
}
exports.default = PinCode
let styles = react_native_1.StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
  viewTitle: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: grid_1.grid.unit * 4
    },
  row: {
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: grid_1.grid.unit * 5.5
    },
  colButtonCircle: {
      alignItems: 'center',
      width: 'auto'
    },
  colEmpty: {
      width: grid_1.grid.unit * 4,
      height: grid_1.grid.unit * 4
    },
  colIcon: {
      width: grid_1.grid.unit * 4,
      height: grid_1.grid.unit * 4,
      marginLeft: grid_1.grid.unit / 2,
      marginRight: grid_1.grid.unit / 2,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    },
  text: {
      fontSize: grid_1.grid.unit * 2,
      fontWeight: '200'
    },
  buttonCircle: {
      alignItems: 'center',
      justifyContent: 'center',
      width: grid_1.grid.unit * 4,
      height: grid_1.grid.unit * 4,
      backgroundColor: 'rgb(242, 245, 251)',
      borderRadius: grid_1.grid.unit * 2
    },
  textTitle: {
      fontSize: 14,
      fontWeight: '400',
      color: '#3C3F43',
      lineHeight: 20,
      textAlign: 'center'
    },
  textSubtitle: {
      fontSize: 14,
      fontWeight: '400',
      color: '#3C3F43',
      lineHeight: 20,
      textAlign: 'center'
    },
  viewCirclePassword: {
      flexDirection: 'row',
      height: 'auto',
      justifyContent: 'center',
      alignItems: 'center'
    }
})
