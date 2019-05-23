import delay from './delay'
import { colors } from './design/colors'
import { grid } from './design/grid'

import { easeLinear } from 'd3-ease'
import * as _ from 'lodash'
import * as React from 'react'
import Animate from 'react-move/Animate'
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  Vibration,
  View,
  ViewStyle
} from 'react-native'
import { Col, Row, Grid } from 'react-native-easy-grid'
import Icon from 'react-native-vector-icons/MaterialIcons'

/**
 * Pin Code Component
 */

export type IProps = {
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  cancelFunction?: () => void
  colorCircleButtons?: string
  colorPassword?: string
  colorPasswordEmpty?: string
  colorPasswordError?: string
  emptyColumnComponent: any
  endProcess: (pinCode: string, isErrorValidation?: boolean) => void
  getCurrentLength?: (length: number) => void
  iconButtonDeleteDisabled?: boolean
  numbersButtonOverlayColor?: string
  passwordComponent?: any
  passwordLength: number
  pinCodeStatus?: 'initial' | 'success' | 'failure' | 'locked'
  pinCodeVisible?: boolean
  previousPin?: string
  sentenceTitle: string
  status: PinStatus
  styleButtonCircle?: StyleProp<ViewStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
  styleColorSubtitle?: string
  styleColorSubtitleError?: string
  styleColorTitle?: string
  styleColorTitleError?: string
  styleColumnButtons?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleContainer?: StyleProp<ViewStyle>
  styleDeleteButtonColorHideUnderlay?: string
  styleDeleteButtonColorShowUnderlay?: string
  styleDeleteButtonIcon?: string
  styleDeleteButtonSize?: number
  styleDeleteButtonText?: StyleProp<TextStyle>
  styleEmptyColumn?: StyleProp<ViewStyle>
  stylePinCodeCircle?: StyleProp<ViewStyle>
  styleRowButtons?: StyleProp<ViewStyle>
  styleTextButton?: StyleProp<TextStyle>
  styleTextSubtitle?: StyleProp<TextStyle>
  styleTextTitle?: StyleProp<TextStyle>
  styleViewTitle?: StyleProp<ViewStyle>
  subtitle: string
  subtitleComponent?: any
  subtitleError: string
  textPasswordVisibleFamily?: string
  textPasswordVisibleSize?: number
  titleAttemptFailed?: string
  titleComponent?: any
  titleConfirmFailed?: string
  titleValidationFailed?: string
  validationRegex?: RegExp
}

export type IState = {
  password: string
  moveData: { x: number; y: number }
  showError: boolean
  textButtonSelected: string
  colorDelete: string
  attemptFailed: boolean
  changeScreen: boolean
}

export enum PinStatus {
  choose = 'choose',
  confirm = 'confirm',
  enter = 'enter'
}

const textDeleteButtonDefault = 'delete'

class PinCode extends React.PureComponent<IProps, IState> {
  private readonly _circleSizeEmpty: number
  private readonly _circleSizeFull: number

  constructor(props: IProps) {
    super(props)
    this.state = {
      password: '',
      moveData: { x: 0, y: 0 },
      showError: false,
      textButtonSelected: '',
      colorDelete: this.props.styleDeleteButtonColorHideUnderlay
        ? this.props.styleDeleteButtonColorHideUnderlay
        : 'rgb(211, 213, 218)',
      attemptFailed: false,
      changeScreen: false
    }
    this._circleSizeEmpty = this.props.styleCircleSizeEmpty || 4
    this._circleSizeFull =
      this.props.styleCircleSizeFull || (this.props.pinCodeVisible ? 6 : 8)
  }

  componentDidMount() {
    if (this.props.getCurrentLength) this.props.getCurrentLength(0)
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    if (
      prevProps.pinCodeStatus !== 'failure' &&
      this.props.pinCodeStatus === 'failure'
    ) {
      this.failedAttempt()
    }
    if (
      prevProps.pinCodeStatus !== 'locked' &&
      this.props.pinCodeStatus === 'locked'
    ) {
      this.setState({ password: '' })
    }
  }

  failedAttempt = async () => {
    await delay(300)
    this.setState({
      showError: true,
      attemptFailed: true,
      changeScreen: false,
    })
    this.doShake()
    await delay(3000)
    this.newAttempt()
  }

  newAttempt = async () => {
    this.setState({ changeScreen: true })
    await delay(200)
    this.setState({
      changeScreen: false,
      showError: false,
      attemptFailed: false,
      password: ''
    })
  }

  onPressButtonNumber = async (text: string) => {
    const currentPassword = this.state.password + text
    this.setState({ password: currentPassword })
    if (this.props.getCurrentLength)
      this.props.getCurrentLength(currentPassword.length)
    if (currentPassword.length === this.props.passwordLength) {
      switch (this.props.status) {
        case PinStatus.choose:
          if (
            this.props.validationRegex &&
            this.props.validationRegex.test(currentPassword)
          ) {
            this.showError(true)
          } else {
            this.endProcess(currentPassword)
          }
          break
        case PinStatus.confirm:
          if (currentPassword !== this.props.previousPin) {
            this.showError()
          } else {
            this.endProcess(currentPassword)
          }
          break
        case PinStatus.enter:
          this.props.endProcess(currentPassword)
          await delay(300)
          break
        default:
          break
      }
    }
  }

  renderButtonNumber = (text: string) => {
    const disabled =
      (this.state.password.length === this.props.passwordLength ||
        this.state.showError) &&
      !this.state.attemptFailed
    return (
      <Animate
        show={true}
        start={{
          opacity: 1
        }}
        update={{
          opacity: [
            this.state.showError && !this.state.attemptFailed ? 0.5 : 1
          ],
          timing: { duration: 200, ease: easeLinear }
        }}>
        {({ opacity }: any) => (
          <TouchableHighlight
            style={[
              this.props.styleButtonCircle
                ? this.props.styleButtonCircle
                : styles.buttonCircle,
              {
                backgroundColor: this.props.colorCircleButtons
                  ? this.props.colorCircleButtons
                  : 'rgb(242, 245, 251)'
              }
            ]}
            underlayColor={
              this.props.numbersButtonOverlayColor
                ? this.props.numbersButtonOverlayColor
                : colors.turquoise
            }
            disabled={disabled}
            onShowUnderlay={() => this.setState({ textButtonSelected: text })}
            onHideUnderlay={() => this.setState({ textButtonSelected: '' })}
            onPress={() => {
              this.onPressButtonNumber(text)
            }}>
            <Text
              style={[
                this.props.styleTextButton
                  ? this.props.styleTextButton
                  : styles.text,
                {
                  opacity: opacity,
                  color:
                    this.state.textButtonSelected === text
                      ? this.props.styleColorButtonTitleSelected
                        ? this.props.styleColorButtonTitleSelected
                        : colors.white
                      : this.props.styleColorButtonTitle
                        ? this.props.styleColorButtonTitle
                        : colors.grey
                }
              ]}>
              {text}
            </Text>
          </TouchableHighlight>
        )}
      </Animate>
    )
  }

  endProcess = (pwd: string) => {
    setTimeout(() => {
      this.setState({ changeScreen: true })
      setTimeout(() => {
        this.props.endProcess(pwd)
      }, 500)
    }, 400)
  }

  async doShake() {
    const duration = 70
    Vibration.vibrate(500, false)
    const length = Dimensions.get('window').width / 3
    await delay(duration)
    this.setState({ moveData: { x: length, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: -length, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: length / 2, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: -length / 2, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: length / 4, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: -length / 4, y: 0 } })
    await delay(duration)
    this.setState({ moveData: { x: 0, y: 0 } })
    if (this.props.getCurrentLength) this.props.getCurrentLength(0)
  }

  async showError(isErrorValidation = false) {
    this.setState({ changeScreen: true })
    await delay(300)
    this.setState({ showError: true, changeScreen: false })
    this.doShake()
    await delay(3000)
    this.setState({ changeScreen: true })
    await delay(200)
    this.setState({ showError: false, password: '' })
    await delay(200)
    this.props.endProcess(this.state.password, isErrorValidation)
    if (isErrorValidation) this.setState({ changeScreen: false })
  }

  renderCirclePassword = () => {
    const {
      password,
      moveData,
      showError,
      changeScreen,
      attemptFailed
    } = this.state
    const colorPwdErr = this.props.colorPasswordError || colors.alert
    const colorPwd = this.props.colorPassword || colors.turquoise
    const colorPwdEmp = this.props.colorPasswordEmpty || colorPwd
    return (
      <View
        style={
          this.props.styleCircleHiddenPassword
            ? this.props.styleCircleHiddenPassword
            : styles.topViewCirclePassword
        }>
        {_.range(this.props.passwordLength).map((val: number) => {
          const lengthSup =
            ((password.length >= val + 1 && !changeScreen) || showError) &&
            !attemptFailed
          return (
            <Animate
              key={val}
              show={true}
              start={{
                opacity: 0.5,
                height: this._circleSizeEmpty,
                width: this._circleSizeEmpty,
                borderRadius: this._circleSizeEmpty / 2,
                color: this.props.colorPassword
                  ? this.props.colorPassword
                  : colors.turquoise,
                marginRight: 10,
                marginLeft: 10,
                x: 0,
                y: 0
              }}
              update={{
                x: [moveData.x],
                opacity: [lengthSup ? 1 : 0.5],
                height: [
                  lengthSup ? this._circleSizeFull : this._circleSizeEmpty
                ],
                width: [
                  lengthSup ? this._circleSizeFull : this._circleSizeEmpty
                ],
                color: [
                  showError
                    ? colorPwdErr
                    : lengthSup
                      ? colorPwd
                      : colorPwdEmp
                ],
                borderRadius: [
                  lengthSup
                    ? this._circleSizeFull / 2
                    : this._circleSizeEmpty / 2
                ],
                marginRight: [
                  lengthSup
                    ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                    : 10
                ],
                marginLeft: [
                  lengthSup
                    ? 10 - (this._circleSizeFull - this._circleSizeEmpty) / 2
                    : 10
                ],
                y: [moveData.y],
                timing: { duration: 200, ease: easeLinear }
              }}>
              {({
                opacity,
                x,
                height,
                width,
                color,
                borderRadius,
                marginRight,
                marginLeft
              }: any) => (
                <View style={styles.viewCircles}>
                  {((!this.props.pinCodeVisible ||
                    (this.props.pinCodeVisible && !lengthSup)) && (
                    <View
                      style={[{
                        left: x,
                        height: height,
                        width: width,
                        opacity: opacity,
                        borderRadius: borderRadius,
                        marginLeft: marginLeft,
                        marginRight: marginRight,
                        backgroundColor: color
                      }, this.props.stylePinCodeCircle]}
                    />
                  )) || (
                    <View
                      style={{
                        left: x,
                        opacity: opacity,
                        marginLeft: marginLeft,
                        marginRight: marginRight
                      }}>
                      <Text
                        style={{
                          color: color,
                          fontFamily:
                            this.props.textPasswordVisibleFamily ||
                            'system font',
                          fontSize: this.props.textPasswordVisibleSize || 22
                        }}>
                        {this.state.password[val]}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </Animate>
          )
        })}
      </View>
    )
  }

  renderButtonDelete = (opacity: number) => {
    return (
      <TouchableHighlight
        disabled={this.state.password.length === 0}
        underlayColor="transparent"
        onHideUnderlay={() =>
          this.setState({
            colorDelete: this.props.styleDeleteButtonColorHideUnderlay
              ? this.props.styleDeleteButtonColorHideUnderlay
              : 'rgb(211, 213, 218)'
          })
        }
        onShowUnderlay={() =>
          this.setState({
            colorDelete: this.props.styleDeleteButtonColorShowUnderlay
              ? this.props.styleDeleteButtonColorShowUnderlay
              : colors.turquoise
          })
        }
        onPress={() => {
          if (this.state.password.length > 0) {
            const newPass = this.state.password.slice(0, -1)
            this.setState({ password: newPass })
            if (this.props.getCurrentLength)
              this.props.getCurrentLength(newPass.length)
          }
        }}>
        <View
          style={
            this.props.styleColumnDeleteButton
              ? this.props.styleColumnDeleteButton
              : styles.colIcon
          }>
          {!this.props.iconButtonDeleteDisabled && (
            <Icon
              name={
                this.props.styleDeleteButtonIcon
                  ? this.props.styleDeleteButtonIcon
                  : 'backspace'
              }
              size={
                this.props.styleDeleteButtonSize
                  ? this.props.styleDeleteButtonSize
                  : 30
              }
              color={this.state.colorDelete}
              style={{ opacity: opacity }}
            />
          )}
          <Text
            style={[
              this.props.styleDeleteButtonText
                ? this.props.styleDeleteButtonText
                : styles.textDeleteButton,
              { color: this.state.colorDelete, opacity: opacity }
            ]}>
            {this.props.buttonDeleteText
              ? this.props.buttonDeleteText
              : textDeleteButtonDefault}
          </Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderTitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed: boolean,
    showError: boolean
  ) => {
    return (
      <Text
        style={[
          this.props.styleTextTitle
            ? this.props.styleTextTitle
            : styles.textTitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {(attemptFailed && this.props.titleAttemptFailed) ||
          (showError && this.props.titleConfirmFailed) ||
          (showError && this.props.titleValidationFailed) ||
          this.props.sentenceTitle}
      </Text>
    )
  }

  renderSubtitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed: boolean,
    showError: boolean
  ) => {
    return (
      <Text
        style={[
          this.props.styleTextSubtitle
            ? this.props.styleTextSubtitle
            : styles.textSubtitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {attemptFailed || showError
          ? this.props.subtitleError
          : this.props.subtitle}
      </Text>
    )
  }

  render() {
    const { password, showError, attemptFailed, changeScreen } = this.state
    return (
      <View
        style={
          this.props.styleContainer
            ? this.props.styleContainer
            : styles.container
        }>
        <Animate
          show={true}
          start={{
            opacity: 0,
            colorTitle: this.props.styleColorTitle
              ? this.props.styleColorTitle
              : colors.grey,
            colorSubtitle: this.props.styleColorSubtitle
              ? this.props.styleColorSubtitle
              : colors.grey,
            opacityTitle: 1
          }}
          enter={{
            opacity: [1],
            colorTitle: [
              this.props.styleColorTitle
                ? this.props.styleColorTitle
                : colors.grey
            ],
            colorSubtitle: [
              this.props.styleColorSubtitle
                ? this.props.styleColorSubtitle
                : colors.grey
            ],
            opacityTitle: [1],
            timing: { duration: 200, ease: easeLinear }
          }}
          update={{
            opacity: [changeScreen ? 0 : 1],
            colorTitle: [
              showError || attemptFailed
                ? this.props.styleColorTitleError
                  ? this.props.styleColorTitleError
                  : colors.alert
                : this.props.styleColorTitle
                  ? this.props.styleColorTitle
                  : colors.grey
            ],
            colorSubtitle: [
              showError || attemptFailed
                ? this.props.styleColorSubtitleError
                  ? this.props.styleColorSubtitleError
                  : colors.alert
                : this.props.styleColorSubtitle
                  ? this.props.styleColorSubtitle
                  : colors.grey
            ],
            opacityTitle: [showError || attemptFailed ? grid.highOpacity : 1],
            timing: { duration: 200, ease: easeLinear }
          }}>
          {({ opacity, colorTitle, colorSubtitle, opacityTitle }: any) => (
            <View
              style={[
                this.props.styleViewTitle
                  ? this.props.styleViewTitle
                  : styles.viewTitle,
                { opacity: opacity }
              ]}>
              {this.props.titleComponent
                ? this.props.titleComponent()
                : this.renderTitle(
                    colorTitle,
                    opacityTitle,
                    attemptFailed,
                    showError
                  )}
              {this.props.subtitleComponent
                ? this.props.subtitleComponent()
                : this.renderSubtitle(
                    colorSubtitle,
                    opacityTitle,
                    attemptFailed,
                    showError
                  )}
            </View>
          )}
        </Animate>
        <View style={styles.flexCirclePassword}>
          {this.props.passwordComponent
            ? this.props.passwordComponent()
            : this.renderCirclePassword()}
        </View>
        <Grid style={styles.grid}>
          <Row
            style={
              this.props.styleRowButtons
                ? this.props.styleRowButtons
                : styles.row
            }>
            {_.range(1, 4).map((i: number) => {
              return (
                <Col
                  key={i}
                  style={
                    this.props.styleColumnButtons
                      ? this.props.styleColumnButtons
                      : styles.colButtonCircle
                  }>
                  {this.props.buttonNumberComponent
                    ? this.props.buttonNumberComponent(
                        i,
                        this.onPressButtonNumber
                      )
                    : this.renderButtonNumber(i.toString())}
                </Col>
              )
            })}
          </Row>
          <Row
            style={
              this.props.styleRowButtons
                ? this.props.styleRowButtons
                : styles.row
            }>
            {_.range(4, 7).map((i: number) => {
              return (
                <Col
                  key={i}
                  style={
                    this.props.styleColumnButtons
                      ? this.props.styleColumnButtons
                      : styles.colButtonCircle
                  }>
                  {this.props.buttonNumberComponent
                    ? this.props.buttonNumberComponent(
                        i,
                        this.onPressButtonNumber
                      )
                    : this.renderButtonNumber(i.toString())}
                </Col>
              )
            })}
          </Row>
          <Row
            style={
              this.props.styleRowButtons
                ? this.props.styleRowButtons
                : styles.row
            }>
            {_.range(7, 10).map((i: number) => {
              return (
                <Col
                  key={i}
                  style={
                    this.props.styleColumnButtons
                      ? this.props.styleColumnButtons
                      : styles.colButtonCircle
                  }>
                  {this.props.buttonNumberComponent
                    ? this.props.buttonNumberComponent(
                        i,
                        this.onPressButtonNumber
                      )
                    : this.renderButtonNumber(i.toString())}
                </Col>
              )
            })}
          </Row>
          <Row
            style={
              this.props.styleRowButtons
                ? this.props.styleRowButtons
                : styles.row
            }>
            <Col
              style={
                this.props.styleEmptyColumn
                  ? this.props.styleEmptyColumn
                  : styles.colEmpty
              }>
              {this.props.emptyColumnComponent || null}
            </Col>
            <Col
              style={
                this.props.styleColumnButtons
                  ? this.props.styleColumnButtons
                  : styles.colButtonCircle
              }>
              {this.props.buttonNumberComponent
                ? this.props.buttonNumberComponent(
                    '0',
                    this.onPressButtonNumber
                  )
                : this.renderButtonNumber('0')}
            </Col>
            <Col
              style={
                this.props.styleColumnButtons
                  ? this.props.styleColumnButtons
                  : styles.colButtonCircle
              }>
              <Animate
                show={true}
                start={{
                  opacity: 0.5
                }}
                update={{
                  opacity: [
                    password.length === 0 ||
                    password.length === this.props.passwordLength
                      ? 0.5
                      : 1
                  ],
                  timing: { duration: 400, ease: easeLinear }
                }}>
                {({ opacity }: any) =>
                  this.props.buttonDeleteComponent
                    ? this.props.buttonDeleteComponent(() => {
                        if (this.state.password.length > 0) {
                          const newPass = this.state.password.slice(0, -1)
                          this.setState({ password: newPass })
                          if (this.props.getCurrentLength)
                            this.props.getCurrentLength(newPass.length)
                        }
                      })
                    : this.renderButtonDelete(opacity)
                }
              </Animate>
            </Col>
          </Row>
        </Grid>
      </View>
    )
  }
}

export default PinCode

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  viewTitle: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 2
  },
  row: {
    alignItems: 'center',
    height: grid.unit * 5.5
  },
  colButtonCircle: {
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    alignItems: 'center',
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colEmpty: {
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colIcon: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  text: {
    fontSize: grid.unit * 2,
    fontWeight: '200'
  },
  buttonCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: grid.unit * 4,
    height: grid.unit * 4,
    backgroundColor: 'rgb(242, 245, 251)',
    borderRadius: grid.unit * 2
  },
  textTitle: {
    fontSize: 20,
    fontWeight: '200',
    lineHeight: grid.unit * 2.5
  },
  textSubtitle: {
    fontSize: grid.unit,
    fontWeight: '200',
    textAlign: 'center'
  },
  flexCirclePassword: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topViewCirclePassword: {
    flexDirection: 'row',
    height: 'auto',
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewCircles: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textDeleteButton: {
    fontWeight: '200',
    marginTop: 5
  },
  grid: {
    width: '100%',
    flex: 7
  }
})
