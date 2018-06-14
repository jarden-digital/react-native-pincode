import * as React from 'react'
import {StyleSheet, View, Dimensions, TouchableOpacity, Text, AsyncStorage, Platform} from 'react-native'
import {colors} from './design/colors'
import {grid} from './design/grid'
import Animate from 'react-move/Animate'
import {easeLinear} from 'd3-ease'
import delay from './delay'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {PinResultStatus} from '../index'

export type IProps = {
  timeToLock: number
  onClickButton: any
  textButton: string
  changeStatus: (status: PinResultStatus) => void
  textDescription?: string
  buttonComponent?: any
  timerComponent?: any
  textTitle?: string
  titleComponent?: any
  iconComponent?: any
  timePinLockedAsyncStorageName: string
  pinAttemptsAsyncStorageName: string
}

export type IState = {
  timeDiff: number
}

class ApplicationLocked extends React.PureComponent<IProps, IState> {
  timeLocked: number
  isUnmounted: boolean

  constructor(props: IProps) {
    super(props)
    this.state = {
      timeDiff: 0
    }
    this.isUnmounted = false
    this.timeLocked = 0
    this.timer = this.timer.bind(this)
    this.renderButton = this.renderButton.bind(this)
    this.renderTitle = this.renderTitle.bind(this)
  }

  componentDidMount() {
    AsyncStorage.getItem(this.props.timePinLockedAsyncStorageName).then((val) => {
      this.timeLocked = new Date(val).getTime() + this.props.timeToLock
      this.timer()
    })
  }

  async timer() {
    const timeDiff = +new Date(this.timeLocked) - +new Date()
    this.setState({timeDiff: timeDiff})
    await delay(1000)
    if (timeDiff < 1000) {
      this.props.changeStatus(PinResultStatus.initial)
      AsyncStorage.multiRemove([this.props.timePinLockedAsyncStorageName, this.props.pinAttemptsAsyncStorageName])
    }
    if (!this.isUnmounted) {
      this.timer()
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  renderButton = () => {
    return (<TouchableOpacity onPress={() => {
      if (this.props.onClickButton) {
        this.props.onClickButton()
      } else {
        throw('Quit application')
      }
    }} style={styles.button}>
      <Text style={styles.closeButtonText}>{this.props.textButton}</Text>
    </TouchableOpacity>)
  }

  renderTimer = (minutes: number, seconds: number) => {
    return (<View style={styles.viewTimer}>
      <Text style={styles.textTimer}>
        {`${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
      </Text>
    </View>)
  }

  renderTitle = () => {
    return (
      <Text style={styles.title}>{this.props.textTitle || 'Maximum attempts reached'}</Text>
    )
  }

  renderIcon = () => {
    return (<View style={styles.viewIcon}>
      <Icon name="lock" size={24} color={colors.white}/>
    </View>)
  }

  renderErrorLocked = () => {
    const minutes = Math.floor(this.state.timeDiff / 1000 / 60)
    const seconds = Math.floor(this.state.timeDiff / 1000) % 60
    return (
      <View style={styles.viewErrorLocked}>
        <View style={styles.viewTextErrorLock}>
          <Animate
            show={true}
            start={{
              opacity: 0
            }}
            enter={{
              opacity: [1],
              timing: {delay: 1000, duration: 1500, ease: easeLinear}
            }}>
            {(state: any) => (
              <View style={[styles.viewTextLock, {opacity: state.opacity}]}>
                {this.props.titleComponent ? this.props.titleComponent() : this.renderTitle()}
                {this.props.timerComponent ? this.props.timerComponent() : this.renderTimer(minutes, seconds)}
                {this.props.iconComponent ? this.props.iconComponent() : this.renderIcon()}
                <Text style={styles.text}>
                  {this.props.textDescription ? this.props.textDescription :
                    `To protect your information, access has been locked for ${Math.ceil(this.props.timeToLock / 1000 / 60)} minutes.`}
                </Text>
              </View>
            )}
          </Animate>
          <Animate
            show={true}
            start={{
              opacity: 0
            }}
            enter={{
              opacity: [1],
              timing: {delay: 2000, duration: 1500, ease: easeLinear}
            }}>
            {(state: any) => (
              <View style={{opacity: state.opacity, flex: 1}}>
                <View style={styles.viewCloseButton}>
                  {this.props.buttonComponent ? this.props.buttonComponent() : this.renderButton()}
                </View>
              </View>
            )}
          </Animate>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderErrorLocked()}
      </View>
    )
  }
}

export default ApplicationLocked

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    flex: 1,
    flexBasis: 0,
    backgroundColor: colors.background,
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
    fontWeight: 400,
    color: '#3C3F43',
    lineHeight: 20,
    textAlign: 'center'
  },
  viewErrorLocked: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  viewTextLock: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: grid.unit * 3,
    paddingRight: grid.unit * 3,
    flex: 3
  },
  textTimer: {
    fontSize: 14,
    fontWeight: 400,
    color: '#3C3F43',
    lineHeight: 20,
    textAlign: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 400,
    color: '#3C3F43',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: grid.unit * 4
  },
  viewIcon: {
    width: grid.unit * 4,
    justifyContent: 'center',
    alignItems: 'center',
    height: grid.unit * 4,
    borderRadius: grid.unit * 2,
    opacity: grid.mediumOpacity,
    backgroundColor: colors.alert,
    overflow: 'hidden',
    marginBottom: grid.unit * 4
  },
  viewTimer: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 10,
    paddingTop: 10,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgb(230, 231, 233)',
    marginBottom: grid.unit * 4
  },
  viewCloseButton: {
    alignItems: 'center',
    opacity: grid.mediumOpacity,
    justifyContent: 'center',
    marginTop: grid.unit,
    marginBottom: grid.unit,
    paddingBottom: grid.unit
  },
  button: {
    backgroundColor: colors.turquoise,
    borderRadius: grid.border,
    paddingLeft: grid.unit * 2,
    paddingRight: grid.unit * 2,
    paddingBottom: grid.unit,
    paddingTop: grid.unit
  },
  closeButtonText: {
    color: colors.base,
    fontWeight: 'bold',
    fontSize: 14
  }
})
