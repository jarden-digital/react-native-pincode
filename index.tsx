import * as React from 'react'
import {View, Text} from 'react-native'
import PinCodeChoose from './src/PinCodeChoose'

type IProps = {}

type IState = {}

class PINCode extends React.PureComponent<IProps, IState> {

  render() {
    return (
      <PinCodeChoose />
    )
  }
}

export default PINCode

