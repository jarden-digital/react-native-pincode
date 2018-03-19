import * as React from 'react'
import {StyleSheet, View, Dimensions, TouchableOpacity, Text, AsyncStorage} from 'react-native'
import {colors} from './design/colors'
import {grid} from './design/grid'
import Animate from 'react-move/Animate'
import {easeLinear} from 'd3-ease'
import delay from './delay'
import Icon from 'react-native-vector-icons/MaterialIcons'

type IProps = {
  errorType: string
  closeError?: typeof closeErrorPage
  errorInfo?: string
  startNewApplication?: () => void // and this
}

type IState = {
  timeDiff: number
}

class ApplicationLocked extends React.PureComponent<IProps, IState> {
  timeLocked: string
  isUnmounted: boolean

  constructor() {
    super()
    this.state = {
      timeDiff: 0
    }
    this.timer = this.timer.bind(this)
  }

  componentDidMount() {
    this.isUnmounted = false
    if (this.props.errorType === errorPage.errorPageTypes.pinLocked) {
      AsyncStorage.getItem(STORAGE_KEYS.timePinLocked).then((val) => {
        this.timeLocked = val
        this.timer()
      })
    }
  }

  async timer() {
    this.setState({timeDiff: +new Date(this.timeLocked) - +new Date()})
    if (this.state.timeDiff <= 0) {
      AsyncStorage.removeItem(STORAGE_KEYS.timePinLocked)
      this.props.closeError({type: errorPageTypes.pinLocked})
    }
    await delay(1000)
    if (!this.isUnmounted) {
      this.timer()
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true
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
                <Text style={styles.title}>Maximum attempts reached</Text>
                <View style={styles.viewTimer}>
                  <Text style={styles.textTimer}>
                    {`${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`}
                  </Text>
                </View>
                <View style={styles.viewIcon}>
                  <Icon name="lock" size={24} color={colors.white}/>
                </View>
                <Text style={styles.text}>To protect your information, access has been locked for 60 minutes.</Text>
                <Text style={styles.text}>Come back later and try again.</Text>
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
                  <TouchableOpacity onPress={() => {
                    throw('fatal error')
                  }} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Quit</Text>
                  </TouchableOpacity>
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
  animation: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
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
  button: {
    backgroundColor: colors.turquoise,
    borderRadius: grid.border,
    paddingLeft: grid.unit * 2,
    paddingRight: grid.unit * 2,
    paddingBottom: grid.unit,
    paddingTop: grid.unit
  },
  textButton: {
    color: colors.white,
    fontFamily: 'Roboto-Bold',
    fontSize: 16
  },
  text: {
    fontSize: grid.unit,
    color: colors.base,
    fontFamily: grid.font,
    lineHeight: grid.unit * grid.lineHeight,
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
    fontFamily: 'RobotoMono-Medium',
    fontSize: 20,
    color: colors.base
  },
  title: {
    fontSize: grid.navIcon,
    color: colors.base,
    opacity: grid.mediumOpacity,
    fontFamily: grid.fontLight,
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
  viewButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    alignItems: 'center'
  },
  viewCloseButton: {
    alignItems: 'center',
    opacity: grid.mediumOpacity,
    justifyContent: 'center',
    marginTop: grid.unit * 2
  },
  closeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closeButtonText: {
    color: colors.base,
    fontFamily: grid.fontBold,
    fontSize: 14
  }
})
