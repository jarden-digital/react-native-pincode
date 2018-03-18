import * as React from 'react'
import {StyleSheet, View} from 'react-native'
import PinCode, {PinStatus} from './PinCode'
import * as Keychain from 'react-native-keychain'

/**
 * Pin Code Choose PIN Page
 */

type IProps = {
  storePin: any
  titleEnter: string
  subtitleEnter: string
  titleConfirm: string
  subtitleConfirm: string
}

type IState = {
  status: PinStatus
  pinCode: string
}

class PinCodeChoose extends React.PureComponent<IProps, IState> {

  constructor(props: IProps) {
    super(props)
    this.state = {status: PinStatus.choose, pinCode: ''}
    this.endProcessCreation = this.endProcessCreation.bind(this)
    this.endProcessConfirm = this.endProcessConfirm.bind(this)
  }

  endProcessCreation = (pinCode: string) => {
    this.setState({pinCode: pinCode, status: PinStatus.confirm})
  }

  endProcessConfirm = async (pinCode: string) => {
    if (pinCode === this.state.pinCode) {
      if (this.props.storePin) {
        this.props.storePin(pinCode)
      } else {
        await Keychain.setGenericPassword('reactNativePinCode', pinCode)
      }
    } else {
      this.setState({status: PinStatus.choose})
    }
  }

  cancelConfirm = () => {
    this.setState({status: PinStatus.choose})
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.status === PinStatus.choose &&
        <PinCode
          endProcess={this.endProcessCreation}
          sentenceTitle={this.props.titleEnter}
          status={PinStatus.choose}
          subtitle={this.props.subtitleEnter}/>}
        {this.state.status === PinStatus.confirm &&
        <PinCode
          endProcess={this.endProcessConfirm}
          sentenceTitle={this.props.titleConfirm}
          status={PinStatus.confirm}
          cancelFunction={this.cancelConfirm}
          previousPin={this.state.pinCode}
          subtitle={this.props.subtitleConfirm}/>}
      </View>
    )
  }
}

export default PinCodeChoose

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
