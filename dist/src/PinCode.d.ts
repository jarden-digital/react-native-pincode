import * as React from "react";
import { StyleProp, TextStyle, ViewStyle } from "react-native";
/**
 * Pin Code Component
 */
export interface IProps {
    alphabetCharsVisible?: boolean;
    buttonDeleteComponent?: any;
    buttonDeleteText?: string;
    buttonNumberComponent?: any;
    cancelFunction?: () => void;
    colorCircleButtons?: string;
    colorPassword: string;
    colorPasswordEmpty?: string;
    colorPasswordError: string;
    customBackSpaceIcon?: Function;
    emptyColumnComponent: any;
    endProcess: (pinCode: string, isErrorValidation?: boolean) => void;
    launchTouchID?: () => void;
    getCurrentLength?: (length: number) => void;
    iconButtonDeleteDisabled?: boolean;
    numbersButtonOverlayColor: string;
    passwordComponent?: any;
    passwordLength: number;
    pinCodeStatus?: "initial" | "success" | "failure" | "locked";
    pinCodeVisible?: boolean;
    previousPin?: string;
    sentenceTitle: string;
    status: PinStatus;
    styleAlphabet?: StyleProp<TextStyle>;
    styleButtonCircle?: StyleProp<ViewStyle>;
    styleCircleHiddenPassword?: StyleProp<ViewStyle>;
    styleCircleSizeEmpty?: number;
    styleCircleSizeFull?: number;
    styleColorButtonTitle?: string;
    styleColorButtonTitleSelected?: string;
    styleColorSubtitle: string;
    styleColorSubtitleError: string;
    styleColorTitle: string;
    styleColorTitleError: string;
    styleColumnButtons?: StyleProp<ViewStyle>;
    styleColumnDeleteButton?: StyleProp<ViewStyle>;
    styleContainer?: StyleProp<ViewStyle>;
    styleDeleteButtonColorHideUnderlay: string;
    styleDeleteButtonColorShowUnderlay: string;
    styleDeleteButtonIcon: string;
    styleDeleteButtonSize: number;
    styleDeleteButtonText?: StyleProp<TextStyle>;
    styleEmptyColumn?: StyleProp<ViewStyle>;
    stylePinCodeCircle?: StyleProp<ViewStyle>;
    styleRowButtons?: StyleProp<ViewStyle>;
    styleTextButton?: StyleProp<TextStyle>;
    styleTextSubtitle?: StyleProp<TextStyle>;
    styleTextTitle?: StyleProp<TextStyle>;
    styleViewTitle?: StyleProp<ViewStyle>;
    subtitle: string;
    subtitleComponent?: any;
    subtitleError: string;
    textPasswordVisibleFamily: string;
    textPasswordVisibleSize: number;
    titleAttemptFailed?: string;
    titleComponent?: any;
    titleConfirmFailed?: string;
    titleValidationFailed?: string;
    validationRegex?: RegExp;
    vibrationEnabled?: boolean;
    delayBetweenAttempts?: number;
}
export interface IState {
    password: string;
    moveData: {
        x: number;
        y: number;
    };
    showError?: boolean;
    textButtonSelected: string;
    colorDelete: string;
    attemptFailed?: boolean;
    changeScreen?: boolean;
}
export declare enum PinStatus {
    choose = "choose",
    confirm = "confirm",
    enter = "enter"
}
declare class PinCode extends React.PureComponent<IProps, IState> {
    static defaultProps: Partial<IProps>;
    private readonly _circleSizeEmpty;
    private readonly _circleSizeFull;
    constructor(props: IProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<IProps>): void;
    failedAttempt: () => Promise<void>;
    newAttempt: () => Promise<void>;
    onPressButtonNumber: (text: string) => Promise<void>;
    renderButtonNumber: (text: string) => any;
    endProcess: (pwd: string) => void;
    doShake(): Promise<void>;
    showError(isErrorValidation?: boolean): Promise<void>;
    renderCirclePassword: () => any;
    renderButtonDelete: (opacity: number) => any;
    renderTitle: (colorTitle: string, opacityTitle: number, attemptFailed?: boolean, showError?: boolean) => any;
    renderSubtitle: (colorTitle: string, opacityTitle: number, attemptFailed?: boolean, showError?: boolean) => any;
    render(): any;
}
export default PinCode;
