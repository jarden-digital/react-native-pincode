import * as React from 'react'
import {View, StyleSheet, TouchableOpacity, Text} from 'react-native'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import Markdown from '../Markdown'
import Icon from 'react-native-vector-icons/MaterialIcons'
import {grid} from '../../design/grid'
import {colors} from '../../design/colors'

/**
 * Pin Code Flow Explanation Page
 */

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<any>, NavigationAction>
}

type IState = {}

class PinCodeExplanation extends React.PureComponent<IProps, IState> {

  render() {
    const textStyle = {paragraph: styles.text, strong: styles.textBold}
    const textSmallStyle = {paragraph: styles.textSmall, strong: styles.textSmallBold}
    return (
      <View style={styles.container}>
        <Icon name="fingerprint" size={50} color="#445878"/>
        <Markdown styles={textStyle}
                  text="To **protect your information** and allow you to continue your application if you have to leave before the end, we need you to create a **four digits PIN**."/>
        <Markdown styles={textSmallStyle}
                  text="If your device allows **fingerprint** or **face recognition** authentication, you will also be able to use it."/>
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.props.navigation.navigate('pin-code-flow-choose-pin', {changeProcess: this.props.navigation.state.params.changeProcess})}
        >
          <Text style={styles.textButton}>Choose PIN</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default PinCodeExplanation

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: grid.unit * 3
  },
  text: {
    fontSize: grid.unit,
    color: colors.base,
    fontFamily: grid.font,
    lineHeight: grid.unit * grid.lineHeight,
    textAlign: 'center',
    marginTop: grid.unit * 3,
    marginBottom: grid.unit * 3
  },
  textSmall: {
    fontSize: grid.body,
    marginTop: grid.unit / 4,
    color: colors.base,
    fontFamily: grid.font,
    lineHeight: grid.body * grid.lineHeight,
    textAlign: 'center',
    marginBottom: grid.unit * 4
  },
  textBold: {
    fontSize: grid.unit,
    color: colors.base,
    fontFamily: grid.fontBold,
    textAlign: 'center'
  },
  textSmallBold: {
    fontSize: grid.body,
    marginTop: grid.unit,
    marginBottom: grid.unit / 1.75,
    color: colors.base,
    fontFamily: grid.fontBold
  },
  button: {
    backgroundColor: 'rgb(159, 203, 206)',
    borderRadius: 2,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 15,
    paddingTop: 15
  },
  textButton: {
    color: colors.white,
    fontFamily: 'Roboto-Bold',
    fontSize: 16
  }
})
