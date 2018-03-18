import * as React from 'react'
import PinCodeChoose from './src/PinCodeChoose'
import {PinStatus} from './src/PinCode'
import PinCodeEnter from './src/PinCodeEnter'
import {View} from 'react-native'

type IProps = {
  status: PinStatus
  storePin?: any
  titleEnter?: string
  subtitleEnter?: string
  titleChoose?: string
  subtitleChoose?: string
  titleConfirm?: string
  subtitleConfirm?: string
}

type IState = {}

class PINCode extends React.PureComponent<IProps, IState> {

  render() {
    const {status} = this.props
    return (
      <View>
        {status === PinStatus.choose &&
        <PinCodeChoose
          storePin={this.props.storePin || null}
          titleEnter={this.props.titleChoose || "1 - Enter a PIN Code"}
          subtitleEnter={this.props.subtitleChoose || "to keep your information secure"}
          titleConfirm={this.props.titleConfirm || "2 - Confirm your PIN Code"}
          subtitleConfirm={this.props.subtitleConfirm || ""}/>}
        {status === PinStatus.enter &&
        <PinCodeEnter
          title={this.props.titleEnter || "Enter your PIN Code"}
          subtitle={}
          allowedTries={}
          handleResult={}
          maxAttempts={}
          openError={}
          pinStatusExternal={}
          storedPin={}
          touchIDSentence={}/>}
      </View>
    )
  }
}

export default PINCode

