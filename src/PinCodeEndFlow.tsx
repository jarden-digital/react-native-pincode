import * as React from 'react'
import {StyleSheet, View, Text} from 'react-native'
import {NavigationAction, NavigationRoute, NavigationScreenProp} from 'react-navigation'
import {colors} from '../../design/colors'
import {grid} from '../../design/grid'
import Icon from 'react-native-vector-icons/MaterialIcons'
import delay from '../../../utils/delay'

/**
 * Pin Code End Flow PIN Page
 */

type IProps = {
  navigation: NavigationScreenProp<NavigationRoute<any>, NavigationAction>
}

type IState = {}

class PinCodeEndFlow extends React.PureComponent<IProps, IState> {

  componentWillMount() {
    this.closePage()
  }

  closePage = async () => {
    await delay(20000)
    this.props.navigation.state.params.changeProcess(true, false, false, false)
  }

  render() {
    const textStyle = {paragraph: styles.text, strong: styles.textBold} // todo Markdown broken on android for things like the pin code sentence
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Thank you</Text>
        <View
          style={styles.iconView}>
          <Icon name="check" size={24} color={colors.white}/>
        </View>
        <Text style={{marginBottom: grid.unit}}>
          <Text style={styles.text}>Your </Text>
          <Text style={styles.textBold}>PIN Code</Text>
          <Text style={styles.text}> has been saved.</Text>
        </Text>
        <Text style={styles.text}>Let's start your application now.</Text>
      </View>
    )
  }
}

export default PinCodeEndFlow

let styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: grid.unit * 3
  },
  viewElements: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: grid.navIcon,
    color: colors.base,
    opacity: grid.mediumOpacity,
    fontFamily: grid.fontLight,
    marginBottom: grid.unit * 5
  },
  text: {
    fontSize: grid.unit,
    color: colors.base,
    fontFamily: grid.font,
    textAlign: 'center',
    lineHeight: grid.unit
  },
  textBold: {
    fontSize: grid.unit,
    color: colors.base,
    fontFamily: grid.fontBold,
    textAlign: 'center',
    lineHeight: grid.unit / 2
  },
  iconView: {
    width: grid.unit * 4,
    marginBottom: grid.unit * 5,
    justifyContent: 'center',
    alignItems: 'center',
    height: grid.unit * 4,
    borderRadius: grid.unit * 2,
    backgroundColor: colors.turquoise,
    opacity: grid.highOpacity,
    overflow: 'hidden'
  }
})
