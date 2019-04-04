import { colors } from './design/colors'
import { grid } from './design/grid'
import delay from './delay'
import { PinResultStatus } from "./utils";

import AsyncStorage from '@react-native-community/async-storage'
import { easeLinear } from 'd3-ease'
import * as React from 'react'
import Animate from 'react-move/Animate'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'

export type IProps = {
  timeToLock: number
  onClickButton: any
  textButton: string
  changeStatus: (status: PinResultStatus) => void
  textDescription?: string
  textSubDescription?: string
  buttonComponent?: any
  timerComponent?: any
  textTitle?: string
  titleComponent?: any
  iconComponent?: any
  timePinLockedAsyncStorageName: string
  pinAttemptsAsyncStorageName: string
  styleButton?: any
  styleTextButton?: any
  styleViewTimer?: any
  styleTextTimer?: any
  styleTitle?: any
  styleViewTextLock?: any
  styleViewIcon?: any
  colorIcon?: string
  nameIcon?: string
  sizeIcon?: number
  styleMainContainer?: any
  styleText?: any
  styleViewButton?: any
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
    AsyncStorage.getItem(this.props.timePinLockedAsyncStorageName).then(val => {
      this.timeLocked = new Date(val ? val : '').getTime() + this.props.timeToLock
      this.timer()
    })
  }

  async timer() {
    const timeDiff = +new Date(this.timeLocked) - +new Date()
    this.setState({ timeDiff: Math.max(0, timeDiff) })
    await delay(1000)
    if (timeDiff < 1000) {
      this.props.changeStatus(PinResultStatus.initial)
      AsyncStorage.multiRemove([
        this.props.timePinLockedAsyncStorageName,
        this.props.pinAttemptsAsyncStorageName
      ])
    }
    if (!this.isUnmounted) {
      this.timer()
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true
  }

  renderButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (this.props.onClickButton) {
            this.props.onClickButton()
          } else {
            throw 'Quit application'
          }
        }}
        style={this.props.styleButton ? this.props.styleButton : styles.button}>
        <Text
          style={
            this.props.styleTextButton
              ? this.props.styleTextButton
              : styles.closeButtonText
          }>
          {this.props.textButton}
        </Text>
      </TouchableOpacity>
    )
  }

  renderTimer = (minutes: number, seconds: number) => {
    return (
      <View
        style={
          this.props.styleViewTimer
            ? this.props.styleViewTimer
            : styles.viewTimer
        }>
        <Text
          style={
            this.props.styleTextTimer
              ? this.props.styleTextTimer
              : styles.textTimer
          }>
          {`${minutes < 10 ? '0' + minutes : minutes}:${
            seconds < 10 ? '0' + seconds : seconds
          }`}
        </Text>
      </View>
    )
  }

  renderTitle = () => {
    return (
      <Text
        style={this.props.styleTitle ? this.props.styleTitle : styles.title}>
        {this.props.textTitle || 'Maximum attempts reached'}
      </Text>
    )
  }

  renderIcon = () => {
    return (
      <View
        style={
          this.props.styleViewIcon ? this.props.styleViewIcon : styles.viewIcon
        }>
        <Icon
          name={this.props.nameIcon ? this.props.nameIcon : 'lock'}
          size={this.props.sizeIcon ? this.props.sizeIcon : 24}
          color={this.props.colorIcon ? this.props.colorIcon : colors.white}
        />
      </View>
    )
  }

  renderErrorLocked = () => {
    const minutes = Math.floor(this.state.timeDiff / 1000 / 60)
    const seconds = Math.floor(this.state.timeDiff / 1000) % 60
    return (
      <View>
        <Animate
          show={true}
          start={{
            opacity: 0
          }}
          enter={{
            opacity: [1],
            timing: { delay: 1000, duration: 1500, ease: easeLinear }
          }}>
          {(state: any) => (
            <View
              style={[
                this.props.styleViewTextLock
                  ? this.props.styleViewTextLock
                  : styles.viewTextLock,
                { opacity: state.opacity }
              ]}>
              {this.props.titleComponent
                ? this.props.titleComponent()
                : this.renderTitle()}
              {this.props.timerComponent
                ? this.props.timerComponent()
                : this.renderTimer(minutes, seconds)}
              {this.props.iconComponent
                ? this.props.iconComponent()
                : this.renderIcon()}
              <Text
                style={
                  this.props.styleText ? this.props.styleText : styles.text
                }>
                {this.props.textDescription
                  ? this.props.textDescription
                  : `To protect your information, access has been locked for ${Math.ceil(
                      this.props.timeToLock / 1000 / 60
                    )} minutes.`}
              </Text>
              <Text
                style={
                  this.props.styleText ? this.props.styleText : styles.text
                }>
                {this.props.textSubDescription
                  ? this.props.textSubDescription
                  : 'Come back later and try again.'}
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
            timing: { delay: 2000, duration: 1500, ease: easeLinear }
          }}>
          {(state: any) => (
            <View style={{ opacity: state.opacity, flex: 1 }}>
              <View
                style={
                  this.props.styleViewButton
                    ? this.props.styleViewButton
                    : styles.viewCloseButton
                }>
                {this.props.buttonComponent
                  ? this.props.buttonComponent()
                  : this.renderButton()}
              </View>
            </View>
          )}
        </Animate>
      </View>
    )
  }

  render() {
    return (
      <View
        style={
          this.props.styleMainContainer
            ? this.props.styleMainContainer
            : styles.container
        }>
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
    backgroundColor: colors.background,
    flexBasis: 0,
    left: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: grid.unit,
    color: colors.base,
    lineHeight: grid.unit * grid.lineHeight,
    textAlign: 'center'
  },
  viewTextLock: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: grid.unit * 3,
    paddingRight: grid.unit * 3,
    flex: 3
  },
  textTimer: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 20,
    color: colors.base
  },
  title: {
    fontSize: grid.navIcon,
    color: colors.base,
    opacity: grid.mediumOpacity,
    fontWeight: '200',
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
    marginTop: grid.unit * 2
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
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14
  }
})
