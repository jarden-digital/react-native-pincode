import delay from "./delay";
import { colors } from "./design/colors";
import { grid } from "./design/grid";

import { easeLinear } from "d3-ease";
import * as _ from "lodash";
import * as React from "react";
import Animate from "react-move/Animate";
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
} from "react-native";
import { Col, Row, Grid } from "react-native-easy-grid";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * Pin Code Component
 */

export interface IProps {
  alphabetCharsVisible?: boolean
  buttonDeleteComponent?: any
  buttonDeleteText?: string
  buttonNumberComponent?: any
  cancelFunction?: () => void
  colorCircleButtons?: string
  colorPassword: string
  colorPasswordEmpty?: string
  colorPasswordError: string
  customBackSpaceIcon?: Function
  emptyColumnComponent: any
  endProcess: (pinCode: string, isErrorValidation?: boolean) => void
  launchTouchID?: () => void 
  getCurrentLength?: (length: number) => void
  iconButtonDeleteDisabled?: boolean
  numbersButtonOverlayColor: string
  passwordComponent?: any
  passwordLength: number
  pinCodeStatus?: "initial" | "success" | "failure" | "locked"
  pinCodeVisible?: boolean
  previousPin?: string
  sentenceTitle: string
  status: PinStatus
  styleAlphabet?: StyleProp<TextStyle>
  styleButtonCircle?: StyleProp<ViewStyle>
  styleCircleHiddenPassword?: StyleProp<ViewStyle>
  styleCircleSizeEmpty?: number
  styleCircleSizeFull?: number
  styleColorButtonTitle?: string
  styleColorButtonTitleSelected?: string
  styleColorSubtitle: string
  styleColorSubtitleError: string
  styleColorTitle: string
  styleColorTitleError: string
  styleColumnButtons?: StyleProp<ViewStyle>
  styleColumnDeleteButton?: StyleProp<ViewStyle>
  styleContainer?: StyleProp<ViewStyle>
  styleDeleteButtonColorHideUnderlay: string
  styleDeleteButtonColorShowUnderlay: string
  styleDeleteButtonIcon: string
  styleDeleteButtonSize: number
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
  textPasswordVisibleFamily: string
  textPasswordVisibleSize: number
  titleAttemptFailed?: string
  titleComponent?: any
  titleConfirmFailed?: string
  titleValidationFailed?: string
  validationRegex?: RegExp
  vibrationEnabled?: boolean
  delayBetweenAttempts?: number;
}

export interface IState {
  password: string
  moveData: { x: number; y: number }
  showError?: boolean
  textButtonSelected: string
  colorDelete: string
  attemptFailed?: boolean
  changeScreen?: boolean
}

export enum PinStatus {
  choose = "choose",
  confirm = "confirm",
  enter = "enter"
}

class PinCode extends React.PureComponent<IProps, IState> {
  static defaultProps: Partial<IProps> = {
    alphabetCharsVisible: false,
    styleButtonCircle: null,
    colorCircleButtons: "rgb(242, 245, 251)",
    styleDeleteButtonColorHideUnderlay: "rgb(211, 213, 218)",
    numbersButtonOverlayColor: colors.turquoise,
    styleDeleteButtonColorShowUnderlay: colors.turquoise,
    styleTextButton: null,
    styleColorButtonTitleSelected: colors.white,
    styleColorButtonTitle: colors.grey,
    colorPasswordError: colors.alert,
    colorPassword: colors.turquoise,
    styleCircleHiddenPassword: null,
    styleColumnDeleteButton: null,
    styleDeleteButtonIcon: "backspace",
    styleDeleteButtonSize: 30,
    styleDeleteButtonText: null,
    buttonDeleteText: "delete",
    styleTextTitle: null,
    styleTextSubtitle: null,
    styleContainer: null,
    styleColorTitle: colors.grey,
    styleColorSubtitle: colors.grey,
    styleColorTitleError: colors.alert,
    styleColorSubtitleError: colors.alert,
    styleViewTitle: null,
    styleRowButtons: null,
    styleColumnButtons: null,
    styleEmptyColumn: null,
    textPasswordVisibleFamily: "system font",
    textPasswordVisibleSize: 22,
    vibrationEnabled: true,
    delayBetweenAttempts: 3000,
  }

  private readonly _circleSizeEmpty: number;
  private readonly _circleSizeFull: number;

  constructor(props: IProps) {
    super(props);
    this.state = {
      password: "",
      moveData: { x: 0, y: 0 },
      showError: false,
      textButtonSelected: "",
      colorDelete: this.props.styleDeleteButtonColorHideUnderlay,
      attemptFailed: false,
      changeScreen: false
    };
    this._circleSizeEmpty = this.props.styleCircleSizeEmpty || 4;
    this._circleSizeFull =
      this.props.styleCircleSizeFull || (this.props.pinCodeVisible ? 6 : 8);
  }

  componentDidMount() {
    if (this.props.getCurrentLength) this.props.getCurrentLength(0);
  }

  componentDidUpdate(prevProps: Readonly<IProps>): void {
    if (
      prevProps.pinCodeStatus !== "failure" &&
      this.props.pinCodeStatus === "failure"
    ) {
      this.failedAttempt();
    }
    if (
      prevProps.pinCodeStatus !== "locked" &&
      this.props.pinCodeStatus === "locked"
    ) {
      this.setState({ password: "" });
    }
  }

  failedAttempt = async () => {
    await delay(300);
    this.setState({
      showError: true,
      attemptFailed: true,
      changeScreen: false
    });
    this.doShake();
    await delay(this.props.delayBetweenAttempts);
    this.newAttempt();
  };

  newAttempt = async () => {
    this.setState({ changeScreen: true });
    await delay(200);
    this.setState({
      changeScreen: false,
      showError: false,
      attemptFailed: false,
      password: ""
    });
  };

  onPressButtonNumber = async (text: string) => {
    const currentPassword = this.state.password + text;
    this.setState({ password: currentPassword });
    if (this.props.getCurrentLength)
      this.props.getCurrentLength(currentPassword.length);
    if (currentPassword.length === this.props.passwordLength) {
      switch (this.props.status) {
        case PinStatus.choose:
          if (
            this.props.validationRegex &&
            this.props.validationRegex.test(currentPassword)
          ) {
            this.showError(true);
          } else {
            this.endProcess(currentPassword);
          }
          break;
        case PinStatus.confirm:
          if (currentPassword !== this.props.previousPin) {
            this.showError();
          } else {
            this.endProcess(currentPassword);
          }
          break;
        case PinStatus.enter:
          this.props.endProcess(currentPassword);
          await delay(300);
          break;
        default:
          break;
      }
    }
  };

  renderButtonNumber = (text: string) => {
    let alphanumericMap = new Map([
      ["1", " "],
      ["2", "ABC"],
      ["3", "DEF"],
      ["4", "GHI"],
      ["5", "JKL"],
      ["6", "MNO"],
      ["7", "PQRS"],
      ["8", "TUV"],
      ["9", "WXYZ"],
      ["0", " "]
  ]); 
    const disabled =
      (this.state.password.length === this.props.passwordLength ||
        this.state.showError) &&
      !this.state.attemptFailed;
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
              styles.buttonCircle,
              { backgroundColor: this.props.colorCircleButtons },
              this.props.styleButtonCircle,
            ]}
            underlayColor={this.props.numbersButtonOverlayColor}
            disabled={disabled}
            onShowUnderlay={() => this.setState({ textButtonSelected: text })}
            onHideUnderlay={() => this.setState({ textButtonSelected: "" })}
            onPress={() => {
              this.onPressButtonNumber(text);
            }}
            accessible
            accessibilityLabel={text}>
            <View>
            <Text
              style={[
                styles.text,
                this.props.styleTextButton,
                {
                  opacity: opacity,
                  color: this.state.textButtonSelected === text
                    ? this.props.styleColorButtonTitleSelected
                    : this.props.styleColorButtonTitle
                }
              ]}>
              {text}
            </Text>
            {((this.props.alphabetCharsVisible) &&
              <Text
                style={[
                  styles.tinytext,
                  this.props.styleAlphabet,
                {
                  opacity: opacity,
                  color: this.state.textButtonSelected === text
                    ? this.props.styleColorButtonTitleSelected
                    : this.props.styleColorButtonTitle
                }
                ]}>
                {alphanumericMap.get(text)}
              </Text>
            )}
            </View>
          </TouchableHighlight>
        )}
      </Animate>
    );
  };

  endProcess = (pwd: string) => {
    setTimeout(() => {
      this.setState({ changeScreen: true });
      setTimeout(() => {
        this.props.endProcess(pwd);
      }, 500);
    }, 400);
  };

  async doShake() {
    const duration = 70;
    if (this.props.vibrationEnabled) Vibration.vibrate(500, false);
    const length = Dimensions.get("window").width / 3;
    await delay(duration);
    this.setState({ moveData: { x: length, y: 0 } });
    await delay(duration);
    this.setState({ moveData: { x: -length, y: 0 } });
    await delay(duration);
    this.setState({ moveData: { x: length / 2, y: 0 } });
    await delay(duration);
    this.setState({ moveData: { x: -length / 2, y: 0 } });
    await delay(duration);
    this.setState({ moveData: { x: length / 4, y: 0 } });
    await delay(duration);
    this.setState({ moveData: { x: -length / 4, y: 0 } });
    await delay(duration);
    this.setState({ moveData: { x: 0, y: 0 } });
    if (this.props.getCurrentLength) this.props.getCurrentLength(0);
  }

  async showError(isErrorValidation = false) {
    this.setState({ changeScreen: true });
    await delay(300);
    this.setState({ showError: true, changeScreen: false });
    this.doShake();
    await delay(3000);
    this.setState({ changeScreen: true });
    await delay(200);
    this.setState({ showError: false, password: "" });
    await delay(200);
    this.props.endProcess(this.state.password, isErrorValidation);
    if (isErrorValidation) this.setState({ changeScreen: false });
  }

  renderCirclePassword = () => {
    const {
      password,
      moveData,
      showError,
      changeScreen,
      attemptFailed
    } = this.state;
    const colorPwdErr = this.props.colorPasswordError;
    const colorPwd = this.props.colorPassword;
    const colorPwdEmp = this.props.colorPasswordEmpty || colorPwd;
    return (
      <View
        style={[styles.topViewCirclePassword, this.props.styleCircleHiddenPassword]}>
        {_.range(this.props.passwordLength).map((val: number) => {
          const lengthSup =
            ((password.length >= val + 1 && !changeScreen) || showError) &&
            !attemptFailed;
          return (
            <Animate
              key={val}
              show={true}
              start={{
                opacity: 0.5,
                height: this._circleSizeEmpty,
                width: this._circleSizeEmpty,
                borderRadius: this._circleSizeEmpty / 2,
                color: colorPwdEmp,
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
                    : (lengthSup && password.length > 0)
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
                              fontFamily: this.props.textPasswordVisibleFamily,
                              fontSize: this.props.textPasswordVisibleSize
                            }}>
                            {this.state.password[val]}
                          </Text>
                        </View>
                      )}
                  </View>
                )}
            </Animate>
          );
        })}
      </View>
    );
  };

  renderButtonDelete = (opacity: number) => {
    return (
      <TouchableHighlight
        activeOpacity={1}
        disabled={this.state.password.length === 0}
        underlayColor="transparent"
        onHideUnderlay={() =>
          this.setState({
            colorDelete: this.props.styleDeleteButtonColorHideUnderlay
          })
        }
        onShowUnderlay={() =>
          this.setState({
            colorDelete: this.props.styleDeleteButtonColorShowUnderlay
          })
        }
        onPress={() => {
          if (this.state.password.length > 0) {
            const newPass = this.state.password.slice(0, -1);
            this.setState({ password: newPass });
            if (this.props.getCurrentLength)
              this.props.getCurrentLength(newPass.length);
          }
        }}
        accessible
        accessibilityLabel={this.props.buttonDeleteText}>
        <View
          style={[styles.colIcon, this.props.styleColumnDeleteButton]}>
          {this.props.customBackSpaceIcon ?
            this.props.customBackSpaceIcon({ colorDelete: this.state.colorDelete, opacity })
            :
            <>
              {!this.props.iconButtonDeleteDisabled && (
                <Icon
                  name={this.props.styleDeleteButtonIcon}
                  size={this.props.styleDeleteButtonSize}
                  color={this.state.colorDelete}
                  style={{ opacity: opacity }}
                />
              )}
              <Text
                style={[
                  styles.textDeleteButton,
                  this.props.styleDeleteButtonText,
                  { color: this.state.colorDelete, opacity: opacity }
                ]}>
                {this.props.buttonDeleteText}
              </Text>
            </>
          }
        </View>
      </TouchableHighlight>
    );
  };

  renderTitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed?: boolean,
    showError?: boolean
  ) => {
    return (
      <Text
        style={[
          styles.textTitle,
          this.props.styleTextTitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {(attemptFailed && this.props.titleAttemptFailed) ||
          (showError && this.props.titleConfirmFailed) ||
          (showError && this.props.titleValidationFailed) ||
          this.props.sentenceTitle}
      </Text>
    );
  };

  renderSubtitle = (
    colorTitle: string,
    opacityTitle: number,
    attemptFailed?: boolean,
    showError?: boolean
  ) => {
    return (
      <Text
        style={[
          styles.textSubtitle,
          this.props.styleTextSubtitle,
          { color: colorTitle, opacity: opacityTitle }
        ]}>
        {attemptFailed || showError
          ? this.props.subtitleError
          : this.props.subtitle}
      </Text>
    );
  };

  render() {
    const { password, showError, attemptFailed, changeScreen } = this.state;
    return (
      <View
        style={[
          styles.container,
          this.props.styleContainer
        ]}>
        <Animate
          show={true}
          start={{
            opacity: 0,
            colorTitle: this.props.styleColorTitle,
            colorSubtitle: this.props.styleColorSubtitle,
            opacityTitle: 1
          }}
          enter={{
            opacity: [1],
            colorTitle: [
              this.props.styleColorTitle
            ],
            colorSubtitle: [
              this.props.styleColorSubtitle
            ],
            opacityTitle: [1],
            timing: { duration: 200, ease: easeLinear }
          }}
          update={{
            opacity: [changeScreen ? 0 : 1],
            colorTitle: [
              showError || attemptFailed
                ? this.props.styleColorTitleError
                : this.props.styleColorTitle
            ],
            colorSubtitle: [
              showError || attemptFailed
                ? this.props.styleColorSubtitleError
                : this.props.styleColorSubtitle
            ],
            opacityTitle: [showError || attemptFailed ? grid.highOpacity : 1],
            timing: { duration: 200, ease: easeLinear }
          }}>
          {({ opacity, colorTitle, colorSubtitle, opacityTitle }: any) => (
            <View
              style={[
                styles.viewTitle,
                this.props.styleViewTitle,
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
            style={[
              styles.row,
              this.props.styleRowButtons
            ]}>
            {_.range(1, 4).map((i: number) => {
              return (
                <Col
                  key={i}
                  style={[
                    styles.colButtonCircle,
                    this.props.styleColumnButtons
                  ]}>
                  {this.props.buttonNumberComponent
                    ? this.props.buttonNumberComponent(
                      i,
                      this.onPressButtonNumber
                    )
                    : this.renderButtonNumber(i.toString())}
                </Col>
              );
            })}
          </Row>
          <Row
            style={[
              styles.row,
              this.props.styleRowButtons
            ]}>
            {_.range(4, 7).map((i: number) => {
              return (
                <Col
                  key={i}
                  style={[
                    styles.colButtonCircle,
                    this.props.styleColumnButtons
                  ]}>
                  {this.props.buttonNumberComponent
                    ? this.props.buttonNumberComponent(
                      i,
                      this.onPressButtonNumber
                    )
                    : this.renderButtonNumber(i.toString())}
                </Col>
              );
            })}
          </Row>
          <Row
            style={[
              styles.row,
              this.props.styleRowButtons
            ]}>
            {_.range(7, 10).map((i: number) => {
              return (
                <Col
                  key={i}
                  style={[
                    styles.colButtonCircle,
                    this.props.styleColumnButtons
                  ]}>
                  {this.props.buttonNumberComponent
                    ? this.props.buttonNumberComponent(
                      i,
                      this.onPressButtonNumber
                    )
                    : this.renderButtonNumber(i.toString())}
                </Col>
              );
            })}
          </Row>
          <Row
            style={[
              styles.row,
              styles.rowWithEmpty,
              this.props.styleRowButtons
            ]}>
            <Col
              style={[
                styles.colEmpty,
                this.props.styleEmptyColumn
              ]}>
              {this.props.emptyColumnComponent 
                ? this.props.emptyColumnComponent(this.props.launchTouchID)
                : null
              }
            </Col>
            <Col
              style={[
                styles.colButtonCircle,
                this.props.styleColumnButtons
              ]}>
              {this.props.buttonNumberComponent
                ? this.props.buttonNumberComponent(
                  "0",
                  this.onPressButtonNumber
                )
                : this.renderButtonNumber("0")}
            </Col>
            <Col
              style={[
                styles.colButtonCircle,
                this.props.styleColumnButtons
              ]}>
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
                        const newPass = this.state.password.slice(0, -1);
                        this.setState({ password: newPass });
                        if (this.props.getCurrentLength)
                          this.props.getCurrentLength(newPass.length);
                      }
                    })
                    : this.renderButtonDelete(opacity)
                }
              </Animate>
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%"
  },
  viewTitle: {
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 2
  },
  row: {
    flex: 0,
    flexShrink: 1,
    alignItems: "center",
    height: grid.unit * 5.5
  },
  rowWithEmpty: {
    flexShrink: 0,
    justifyContent: 'flex-end',
  },
  colButtonCircle: {
    flex: 0,
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    alignItems: "center",
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colEmpty: {
    flex: 0,
    marginLeft: grid.unit / 2,
    marginRight: grid.unit / 2,
    width: grid.unit * 4,
    height: grid.unit * 4
  },
  colIcon: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  text: {
    fontSize: grid.unit * 2,
    fontWeight: "200"
  },
  tinytext: {
    fontSize: grid.unit/2,
    fontWeight: "300"
  },
  buttonCircle: {
    alignItems: "center",
    justifyContent: "center",
    width: grid.unit * 4,
    height: grid.unit * 4,
    backgroundColor: "rgb(242, 245, 251)",
    borderRadius: grid.unit * 2
  },
  textTitle: {
    fontSize: 20,
    fontWeight: "200",
    lineHeight: grid.unit * 2.5
  },
  textSubtitle: {
    fontSize: grid.unit,
    fontWeight: "200",
    textAlign: "center"
  },
  flexCirclePassword: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  topViewCirclePassword: {
    flexDirection: "row",
    height: "auto",
    justifyContent: "center",
    alignItems: "center"
  },
  viewCircles: {
    justifyContent: "center",
    alignItems: "center"
  },
  textDeleteButton: {
    fontWeight: "200",
    marginTop: 5
  },
  grid: {
    justifyContent: 'flex-start',
    width: "100%",
    flex: 7
  }
});

export default PinCode;
