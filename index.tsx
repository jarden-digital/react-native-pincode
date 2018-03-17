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
          titleEnter={this.props.titleEnter || "1 - Enter a PIN Code"}
          subtitleEnter={this.props.subtitleEnter || "to keep your information secure"}
          titleConfirm={this.props.titleConfirm || "2 - Confirm your PIN Code"}
          subtitleConfirm={this.props.subtitleConfirm || ""}/>}
        {status === PinStatus.enter && <PinCodeEnter/>}
      </View>
    )
  }
}

export default PINCode

