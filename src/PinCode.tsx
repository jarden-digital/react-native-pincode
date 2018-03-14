import * as React from 'react'
import {Dimensions, StyleSheet, Text, TouchableHighlight, Vibration, View} from 'react-native'
import {Col, Row, Grid} from 'react-native-easy-grid'
import {grid} from './design/grid'
import {colors} from './design/colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import * as _ from 'lodash'
import Animate from 'react-move/Animate'
import {easeLinear} from 'd3-ease'
import delay from './delay'

/**
 * Pin Code Component
 */

type IProps = {
  endProcess: (pinCode: string) => void
  sentenceTitle: string
  subtitle?: string
  status: PinStatus
  cancelFunction?: () => void
  previousPin?: string
  pinCodeStatus?: 'initial' | 'success' | 'failure' | 'locked'
  error?: boolean
}

type IState = {
  password: string,
  moveData: { x: number, y: number }
  showError: boolean
  textButtonSelected: string
  colorDelete: string
  attemptFailed: boolean
  changeScreen: boolean
}

export enum PinStatus {
  choose = 'choose',
  confirm = 'confirm',
  enter = 'enter'
}

class PinCode extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {
      password: '',
      moveData: {x: 0, y: 0},
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
  }

  componentWillUpdate(nextProps: IProps) {
    if (this.props.pinCodeStatus !== 'failure' && nextProps.pinCodeStatus === 'failure') {
      this.failedAttempt()
    }
  }

  failedAttempt = async() => {
    this.setState({changeScreen: true})
    await delay(300)
    this.setState({showError: true, attemptFailed: true, changeScreen: false, password: ''})
    this.doShake()
  }

  newAttempt = async() => {
    this.setState({changeScreen: true})
    await delay(200)
    this.setState({changeScreen: false, showError: false, attemptFailed: false})
  }

  renderButtonNumber = (text: string) => {
    const disabled = (this.state.password.length === 4 || this.state.showError) && !this.state.attemptFailed
    return (
      <Animate
        show={true}
        start={{
          opacity: 1
        }}
        update={{
          opacity: [this.state.showError && !this.state.attemptFailed ? 0.5 : 1],
          timing: {duration: 200, ease: easeLinear}
        }}>
        {({opacity}: any) => (
          <TouchableHighlight
            style={styles.buttonCircle}
            underlayColor={colors.turquoise} disabled={disabled}
            onShowUnderlay={() => this.setState({textButtonSelected: text})}
            onHideUnderlay={() => this.setState({textButtonSelected: ''})}
            onPress={() => {
              if (this.state.showError && this.state.attemptFailed) this.newAttempt()
              const currentPassword = this.state.password + text
              this.setState({password: currentPassword})
              if (currentPassword.length === 4) {
                switch (this.props.status) {
                  case PinStatus.choose:
                    this.endProcess(currentPassword)
                    break
                  case PinStatus.confirm:
                    if (currentPassword !== this.props.previousPin) {
                      this.showError()
                    } else {
                      this.endProcess(currentPassword)
                    }
                    break
                  case PinStatus.enter:
                    this.props.endProcess(currentPassword)
                    break
                  default:
                    break
                }
              }
            }}>
            <Text style={[styles.text, {
              opacity: opacity,
              color: this.state.textButtonSelected === text ? colors.white : colors.grey
            }]}>{text}</Text>
          </TouchableHighlight>
        )}
      </Animate>)
  }

  endProcess = (pwd: string) => {
    setTimeout(() => {
      this.setState({changeScreen: true})
      setTimeout(() => {
        this.props.endProcess(pwd)
      }, 500)
    }, 400)
  }

  async doShake() {
    const duration = 70
    Vibration.vibrate(500, false)
    const length = Dimensions.get('window').width / 3
    await delay(duration)
    this.setState({moveData: {x: length, y: 0}})
    await delay(duration)
    this.setState({moveData: {x: -length, y: 0}})
    await delay(duration)
    this.setState({moveData: {x: length / 2, y: 0}})
    await delay(duration)
    this.setState({moveData: {x: -length / 2, y: 0}})
    await delay(duration)
    this.setState({moveData: {x: length / 4, y: 0}})
    await delay(duration)
    this.setState({moveData: {x: -length / 4, y: 0}})
    await delay(duration)
    this.setState({moveData: {x: 0, y: 0}, password: ''})
  }

  async showError() {
    this.setState({changeScreen: true})
    await delay(300)
    this.setState({showError: true, changeScreen: false})
    this.doShake()
    await delay(3000)
    this.setState({changeScreen: true})
    await delay(200)
    this.setState({showError: false})
    await delay(200)
    this.props.endProcess(this.state.password)
  }

  renderCirclePassword = () => {
    const {password, moveData, showError, changeScreen, attemptFailed} = this.state
    return (
      <View style={styles.viewCirclePassword}>
        {_.range(4).map((val: number) => {
          const lengthSup = ((password.length >= val + 1 && !changeScreen) || showError) && !attemptFailed
          const marginSup = ((password.length > 0 && !changeScreen) || showError) && !attemptFailed
          return (
            <Animate
              key={val}
              show={true}
              start={{
                opacity: 0.5, height: 4, width: 4, borderRadius: 2, color: colors.turquoise, marginRight: 10,
                marginLeft: 10, marginBottom: grid.unit * 2, marginTop: grid.unit * 4, x: 0, y: 0
              }}
              update={{
                x: [moveData.x], opacity: [lengthSup ? 1 : 0.5], height: [lengthSup ? 8 : 4],
                width: [lengthSup ? 8 : 4], color: [showError ? colors.alert : colors.turquoise],
                borderRadius: [lengthSup ? 4 : 2], marginRight: [lengthSup ? 8 : 10],
                marginLeft: [lengthSup ? 8 : 10], marginBottom: [marginSup ? 30 : grid.unit * 2],
                marginTop: [marginSup ? 62 : grid.unit * 4], y: [moveData.y],
                timing: {duration: 200, ease: easeLinear}
              }}>
              {({opacity, x, height, width, color, borderRadius, marginRight, marginTop, marginLeft, marginBottom}: any) => (
                <View style={{
                  left: x, opacity: opacity, height: height, width: width, borderRadius: borderRadius,
                  marginLeft: marginLeft, marginRight: marginRight, marginBottom: marginBottom, marginTop: marginTop,
                  backgroundColor: color
                }}/>
              )}
            </Animate>
          )
        })}
      </View>
    )
  }

  render() {
    const {password, showError, attemptFailed, changeScreen} = this.state
    return (
      <View style={styles.container}>
        <Animate
          show={true}
          start={{
            opacity: 0,
            colorTitle: colors.grey,
            opacityTitle: 1
          }}
          enter={{
            opacity: [1],
            colorTitle: [colors.grey],
            opacityTitle: [1],
            timing: {duration: 200, ease: easeLinear}
          }}
          update={{
            opacity: [changeScreen ? 0 : 1],
            colorTitle: [showError || attemptFailed ? colors.alert : colors.grey],
            opacityTitle: [showError || attemptFailed ? grid.highOpacity : 1],
            timing: {duration: 200, ease: easeLinear}
          }}>
          {({opacity, colorTitle, opacityTitle, opacityError}: any) => (
            <View style={[styles.viewTitle, {opacity: opacity}]}>
              <Text style={[styles.textTitle, {color: colorTitle, opacity: opacityTitle}]}>
                {(attemptFailed && 'Incorrect PIN Code') || (showError && 'Your entries did not match') || this.props.sentenceTitle}
              </Text>
              <Text style={[styles.textSubtitle, {color: colorTitle, opacity: opacityTitle}]}>
                {attemptFailed || showError ? 'Please try again' : this.props.subtitle}
              </Text>
            </View>
          )}
        </Animate>
        <View>{this.renderCirclePassword()}</View>
        <Grid style={{maxHeight: grid.unit * 22, maxWidth: grid.unit * 16.25}}>
          <Row style={styles.row}>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('1')}</Col>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('2')}</Col>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('3')}</Col>
          </Row>
          <Row style={styles.row}>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('4')}</Col>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('5')}</Col>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('6')}</Col>
          </Row>
          <Row style={styles.row}>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('7')}</Col>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('8')}</Col>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('9')}</Col>
          </Row>
          <Row style={styles.row}>
            <Col style={styles.colEmpty}/>
            <Col style={styles.colButtonCircle}>{this.renderButtonNumber('0')}</Col>
            <Col>
              <Animate
                show={true}
                start={{
                  opacity: 0.5
                }}
                update={{
                  opacity: [password.length === 0 || password.length === 4 ? 0.5 : 1],
                  timing: {duration: 400, ease: easeLinear}
                }}>
                {({opacity}: any) => (
                  <TouchableHighlight style={styles.colIcon} disabled={this.state.password.length === 0}
                                      underlayColor="transparent"
                                      onHideUnderlay={() => this.setState({colorDelete: 'rgb(211, 213, 218)'})}
                                      onShowUnderlay={() => this.setState({colorDelete: colors.turquoise})}
                                      onPress={() => this.state.password.length > 0 && this.setState({password: this.state.password.slice(0, -1)})}>
                    <View>
                      <Icon name="backspace" size={30} color={this.state.colorDelete} style={{opacity: opacity}}/>
                      <Text style={{
                        color: this.state.colorDelete,
                        fontFamily: grid.fontLight,
                        marginTop: 5,
                        opacity: opacity
                      }}>delete</Text>
                    </View>
                  </TouchableHighlight>
                )}
              </Animate>
            </Col>
          </Row>
        </Grid>
      </View>
    )
  }
}

export default PinCode

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewTitle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: grid.unit * 4
  },
  row: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: grid.unit * 5.5
  },
  colButtonCircle: {
    alignItems: 'center',
    width: 'auto'
  },
  colEmpty: {
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colIcon: {
    width: grid.unit * 4,
    height: grid.unit * 4,
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  text: {
    fontSize: grid.unit * 2,
    fontFamily: grid.fontLight
  },
  buttonCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: grid.unit * 4,
    height: grid.unit * 4,
    backgroundColor: 'rgb(242, 245, 251)',
    borderRadius: grid.unit * 2
  },
  textTitle: {
    fontSize: 20,
    fontFamily: grid.fontLight,
    lineHeight: grid.unit * 2.5
  },
  textSubtitle: {
    fontSize: grid.unit,
    fontFamily: grid.fontLight,
    textAlign: 'center'
  },
  viewCirclePassword: {
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
