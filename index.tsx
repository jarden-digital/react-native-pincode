import * as React from 'react'
import PinCodeChoose from './src/PinCodeChoose'
import {PinStatus} from './src/PinCode'
import PinCodeEnter, {PinResultStatus} from './src/PinCodeEnter'
import {View, StyleSheet} from 'react-native'
import ApplicationLocked from './src/ApplicationLocked'

export type IProps = {
  status: 'choose' | 'enter' | 'locked'
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
  textButtonLockedPage?: string
  onClickButtonLockedPage?: any
  pinStatusExternal?: PinResultStatus
  changeInternalStatus?: (status: PinResultStatus) => void
  sentenceTitle?: string
  previousPin?: string
  pinCodeStatus?: 'initial' | 'success' | 'failure' | 'locked'
  buttonNumberComponent?: any
  passwordLength?: number
  passwordComponent?: any
  titleAttemptFailed?: string
  titleConfirmFailed?: string
  subtitleError?: string
  colorPassword?: string
  numbersButtonOverlayColor?: string
  buttonDeleteComponent?: any
  titleComponent?: any
  subtitleComponent?: any
}

export type IState = {
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
      <View style={styles.container}>
        {status === PinStatus.choose &&
        <PinCodeChoose
          storePin={this.props.storePin || null}
          titleEnter={this.props.titleChoose || '1 - Enter a PIN Code'}
          subtitleEnter={this.props.subtitleChoose || 'to keep your information secure'}
          titleConfirm={this.props.titleConfirm || '2 - Confirm your PIN Code'}
          subtitleConfirm={this.props.subtitleConfirm || ''}
          passwordComponent={this.props.passwordComponent}
          sentenceTitle={this.props.sentenceTitle}
          buttonNumberComponent={this.props.buttonNumberComponent}
          passwordLength={this.props.passwordLength}
          titleAttemptFailed={this.props.titleAttemptFailed}
          titleConfirmFailed={this.props.titleConfirmFailed}
          subtitleError={this.props.subtitleError}
          colorPassword={this.props.subtitleError}
          numbersButtonOverlayColor={this.props.subtitleError}
          buttonDeleteComponent={this.props.buttonDeleteComponent}
          titleComponent={this.props.titleComponent}
          subtitleComponent={this.props.subtitleComponent}
        />}
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
          touchIDSentence={this.props.touchIDSentence || 'To unlock your application'}
          sentenceTitle={this.props.sentenceTitle}
          status={PinStatus.enter}
          buttonNumberComponent={this.props.buttonNumberComponent}
          passwordLength={this.props.passwordLength}
          passwordComponent={this.props.passwordComponent}
          titleAttemptFailed={this.props.titleAttemptFailed}
          titleConfirmFailed={this.props.titleConfirmFailed}
          subtitleError={this.props.subtitleError}
          colorPassword={this.props.subtitleError}
          numbersButtonOverlayColor={this.props.subtitleError}
          buttonDeleteComponent={this.props.buttonDeleteComponent}
          titleComponent={this.props.titleComponent}
          subtitleComponent={this.props.subtitleComponent}
        />}
        {(pinStatus === PinResultStatus.locked || this.state.internalPinStatus === PinResultStatus.locked) &&
        <ApplicationLocked
          timeToLock={this.props.timeLocked || 300000}
          textButton={this.props.textButtonLockedPage || 'Quit'}
          onClickButton={this.props.onClickButtonLockedPage || (() => {throw ('Quit application')})}/>}
      </View>
    )
  }
}

export default PINCode

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
