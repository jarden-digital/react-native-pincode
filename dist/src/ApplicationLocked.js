'use strict';
Object.defineProperty(exports, '__esModule', { value: true })
const React = require('react')
const react_native_1 = require('react-native')
const colors_1 = require('./design/colors')
const grid_1 = require('./design/grid')
const Animate_1 = require('react-move/Animate')
const d3_ease_1 = require('d3-ease')
const delay_1 = require('./delay')
const MaterialIcons_1 = require('react-native-vector-icons/MaterialIcons')
const index_1 = require('../index')
class ApplicationLocked extends React.PureComponent {
  constructor (props) {
      super(props)
        this.renderButton = () => {
          return (React.createElement(react_native_1.TouchableOpacity, { onPress: () => {
              if (this.props.onClickButton) {
                      this.props.onClickButton()
                    }                    else {
                      throw ('Quit application')
                    }
            },
style: styles.button },
                React.createElement(react_native_1.Text, { style: styles.closeButtonText }, this.props.textButton)))
        };
      this.renderTimer = (minutes, seconds) => {
          return (React.createElement(react_native_1.View, { style: styles.viewTimer },
                React.createElement(react_native_1.Text, { style: styles.textTimer }, `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`)))
        };
      this.renderTitle = () => {
          return (React.createElement(react_native_1.Text, { style: styles.title }, this.props.textTitle || 'Maximum attempts reached'))
        };
      this.renderIcon = () => {
          return (React.createElement(react_native_1.View, { style: styles.viewIcon },
                React.createElement(MaterialIcons_1.default, { name: 'lock', size: 24, color: colors_1.colors.white })))
        };
      this.renderErrorLocked = () => {
          const minutes = Math.floor(this.state.timeDiff / 1000 / 60)
            const seconds = Math.floor(this.state.timeDiff / 1000) % 60
            return (React.createElement(react_native_1.View, { style: styles.viewErrorLocked },
                React.createElement(react_native_1.View, { style: styles.viewTextErrorLock },
                    React.createElement(Animate_1.default, { show: true,
start: {
                      opacity: 0
                    },
enter: {
                          opacity: [1],
                          timing: { delay: 1000, duration: 1500, ease: d3_ease_1.easeLinear }
                        } }, (state) => (React.createElement(react_native_1.View, { style: [styles.viewTextLock, { opacity: state.opacity }] },
                        this.props.titleComponent ? this.props.titleComponent() : this.renderTitle(),
                        this.props.timerComponent ? this.props.timerComponent() : this.renderTimer(minutes, seconds),
                        this.props.iconComponent ? this.props.iconComponent() : this.renderIcon(),
                        React.createElement(react_native_1.Text, { style: styles.text }, this.props.textDescription ? this.props.textDescription
                            : `To protect your information, access has been locked for ${Math.ceil(this.props.timeToLock / 1000 / 60)} minutes.`)))),
                    React.createElement(Animate_1.default, { show: true,
start: {
                      opacity: 0
                    },
enter: {
                          opacity: [1],
                          timing: { delay: 2000, duration: 1500, ease: d3_ease_1.easeLinear }
                        } }, (state) => (React.createElement(react_native_1.View, { style: { opacity: state.opacity, flex: 1 } },
                        React.createElement(react_native_1.View, { style: styles.viewCloseButton }, this.props.buttonComponent ? this.props.buttonComponent() : this.renderButton())))))))
        };
      this.state = {
          timeDiff: 0
        }
        this.isUnmounted = false
        this.timeLocked = 0
        this.timer = this.timer.bind(this)
        this.renderButton = this.renderButton.bind(this)
        this.renderTitle = this.renderTitle.bind(this)
    }
  componentDidMount () {
      react_native_1.AsyncStorage.getItem(this.props.timePinLockedAsyncStorageName).then((val) => {
          this.timeLocked = new Date(val).getTime() + this.props.timeToLock
            this.timer()
        })
    }
  async timer () {
      const timeDiff = +new Date(this.timeLocked) - +new Date()
        this.setState({ timeDiff: timeDiff })
        await delay_1.default(1000)
        if (timeDiff < 1000) {
          this.props.changeStatus(index_1.PinResultStatus.initial)
            react_native_1.AsyncStorage.multiRemove([this.props.timePinLockedAsyncStorageName, this.props.pinAttemptsAsyncStorageName])
        }
      if (!this.isUnmounted) {
          this.timer()
        }
    }
  componentWillUnmount () {
      this.isUnmounted = true
    }
  render () {
      return (React.createElement(react_native_1.View, { style: styles.container }, this.renderErrorLocked()))
    }
}
exports.default = ApplicationLocked
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
      fontSize: 14,
      fontWeight: '400',
      color: '#3C3F43',
      lineHeight: 20,
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
      fontSize: 14,
      fontWeight: '400',
      color: '#3C3F43',
      lineHeight: 20,
      textAlign: 'center'
    },
  title: {
      fontSize: 14,
      fontWeight: '400',
      color: '#3C3F43',
      lineHeight: 20,
      textAlign: 'center',
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
  button: {
      backgroundColor: colors_1.colors.turquoise,
      borderRadius: grid_1.grid.border,
      paddingLeft: grid_1.grid.unit * 2,
      paddingRight: grid_1.grid.unit * 2,
      paddingBottom: grid_1.grid.unit,
      paddingTop: grid_1.grid.unit
    },
  closeButtonText: {
      color: colors_1.colors.base,
      fontWeight: 'bold',
      fontSize: 14
    }
})
