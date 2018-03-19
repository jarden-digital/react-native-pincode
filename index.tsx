import * as React from 'react'
import PinCodeChoose from './src/PinCodeChoose'
import {PinStatus} from './src/PinCode'
import PinCodeEnter, {PinResultStatus} from './src/PinCodeEnter'
import {View} from 'react-native'
import ApplicationLocked from './src/ApplicationLocked'

type IProps = {
  status: PinStatus
  storePin?: any
  titleEnter?: string
  subtitleEnter?: string
  titleChoose?: string
  subtitleChoose?: string
  titleConfirm?: string
  subtitleConfirm?: string
  maxAttempts?: number
  openAppLockedScreen?: any
  pinStatus?: PinResultStatus
  storedPin?: string
  touchIDSentence?: string
  handleResultEnterPin?: any
  timeLocked?: number
}

type IState = {
  internalPinStatus: PinResultStatus
}

class PINCode extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {internalPinStatus: PinResultStatus.initial}
    this.changeInternalStatus = this.changeInternalStatus.bind(this)
  }

  changeInternalStatus = (status: PinResultStatus) => {
    this.setState({internalPinStatus: status})
  }

  render() {
    const {status, pinStatus} = this.props
    return (
      <View>
        {status === PinStatus.choose &&
        <PinCodeChoose
          storePin={this.props.storePin || null}
          titleEnter={this.props.titleChoose || '1 - Enter a PIN Code'}
          subtitleEnter={this.props.subtitleChoose || 'to keep your information secure'}
          titleConfirm={this.props.titleConfirm || '2 - Confirm your PIN Code'}
          subtitleConfirm={this.props.subtitleConfirm || ''}/>}
        {status === PinStatus.enter &&
        <PinCodeEnter
          title={this.props.titleEnter || 'Enter your PIN Code'}
          subtitle={this.props.subtitleEnter || ''}
          handleResult={this.props.handleResultEnterPin || null}
          maxAttempts={this.props.maxAttempts || 3}
          changeInternalStatus={this.changeInternalStatus}
          openError={this.props.openAppLockedScreen || null}
          pinStatusExternal={this.props.pinStatus || PinResultStatus.initial}
          storedPin={this.props.storedPin || null}
          touchIDSentence={this.props.touchIDSentence || 'To unlock your application'}/>}
        {(pinStatus === PinResultStatus.locked || this.state.internalPinStatus === PinResultStatus.locked) &&
        <ApplicationLocked
        timeLocked={this.props.timeLocked || 300000}/>}
      </View>
    )
  }
}

export default PINCode
