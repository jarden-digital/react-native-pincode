/// <reference types="react" />
import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
/**
 * Pin Code Component
 */
export declare type IProps = {
    endProcess: (pinCode: string) => void;
    sentenceTitle: string;
    subtitle: string;
    status: PinStatus;
    buttonDeleteText?: string;
    cancelFunction?: () => void;
    previousPin?: string;
    pinCodeStatus?: 'initial' | 'success' | 'failure' | 'locked';
    buttonNumberComponent?: any;
    passwordLength: number;
    iconButtonDeleteDisabled?: boolean;
    passwordComponent?: any;
    titleAttemptFailed: string;
    titleConfirmFailed: string;
    subtitleError: string;
    colorPassword?: string;
    colorPasswordError?: string;
    numbersButtonOverlayColor?: string;
    buttonDeleteComponent?: any;
    titleComponent?: any;
    subtitleComponent?: any;
    styleButtonCircle?: StyleProp<ViewStyle>;
    styleTextButton?: StyleProp<TextStyle>;
    styleCircleHiddenPassword?: StyleProp<ViewStyle>;
    styleRowButtons?: StyleProp<ViewStyle>;
    styleColumnButtons?: StyleProp<ViewStyle>;
    styleEmptyColumn?: StyleProp<ViewStyle>;
    styleViewTitle?: StyleProp<ViewStyle>;
    styleTextTitle?: StyleProp<TextStyle>;
    styleTextSubtitle?: StyleProp<TextStyle>;
    styleContainer?: StyleProp<ViewStyle>;
    styleColumnDeleteButton?: StyleProp<ViewStyle>;
    styleDeleteButtonColorShowUnderlay?: string;
    styleDeleteButtonColorHideUnderlay?: string;
    styleDeleteButtonIcon?: string;
    styleDeleteButtonSize?: number;
    styleDeleteButtonText?: StyleProp<TextStyle>;
    styleColorTitle?: string;
    styleColorTitleError?: string;
    styleColorSubtitle?: string;
    styleColorSubtitleError?: string;
    styleColorButtonTitle?: string;
    styleColorButtonTitleSelected?: string;
};
export declare type IState = {
    password: string;
    moveData: {
        x: number;
        y: number;
    };
    showError: boolean;
    textButtonSelected: string;
    colorDelete: string;
    attemptFailed: boolean;
    changeScreen: boolean;
};
export declare enum PinStatus {
    choose = "choose",
    confirm = "confirm",
    enter = "enter",
}
declare class PinCode extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    componentWillUpdate(nextProps: IProps): void;
    failedAttempt: () => Promise<void>;
    newAttempt: () => Promise<void>;
    onPressButtonNumber: (text: string) => Promise<void>;
    renderButtonNumber: (text: string) => JSX.Element;
    endProcess: (pwd: string) => void;
    doShake(): Promise<void>;
    showError(): Promise<void>;
    renderCirclePassword: () => JSX.Element;
    renderButtonDelete: (opacity: number) => JSX.Element;
    renderTitle: (colorTitle: string, opacityTitle: number, attemptFailed: boolean, showError: boolean) => JSX.Element;
    renderSubtitle: (colorTitle: string, opacityTitle: number, attemptFailed: boolean, showError: boolean) => JSX.Element;
    render(): JSX.Element;
}
export default PinCode;
