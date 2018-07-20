/// <reference types="react" />
import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { PinStatus } from './PinCode';
/**
 * Pin Code Choose PIN Page
 */
export declare type IProps = {
    storePin: any;
    titleChoose: string;
    subtitleChoose: string;
    titleConfirm: string;
    subtitleConfirm: string;
    buttonNumberComponent: any;
    finishProcess?: any;
    passwordLength?: number;
    passwordComponent: any;
    titleAttemptFailed?: string;
    titleConfirmFailed?: string;
    subtitleError?: string;
    colorPassword?: string;
    buttonDeleteText?: string;
    colorPasswordError?: string;
    iconButtonDeleteDisabled?: boolean;
    numbersButtonOverlayColor?: string;
    buttonDeleteComponent: any;
    titleComponent: any;
    subtitleComponent: any;
    pinCodeKeychainName: string;
    styleContainerPinCode?: StyleProp<ViewStyle>;
    styleColorTitle?: string;
    styleColorTitleError?: string;
    styleColorSubtitle?: string;
    styleColorSubtitleError?: string;
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
    styleColorButtonTitle?: string;
    styleColorButtonTitleSelected?: string;
};
export declare type IState = {
    status: PinStatus;
    pinCode: string;
};
declare class PinCodeChoose extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    endProcessCreation: (pinCode: string) => void;
    endProcessConfirm: (pinCode: string) => Promise<void>;
    cancelConfirm: () => void;
    render(): JSX.Element;
}
export default PinCodeChoose;
