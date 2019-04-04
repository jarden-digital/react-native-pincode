/// <reference types="react" />
import { PinStatus } from './PinCode';
import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
/**
 * Pin Code Choose PIN Page
 */
export declare type IProps = {
    buttonDeleteComponent: any;
    buttonDeleteText?: string;
    buttonNumberComponent: any;
    colorCircleButtons?: string;
    colorPassword?: string;
    colorPasswordEmpty?: string;
    colorPasswordError?: string;
    emptyColumnComponent: any;
    finishProcess?: (pinCode: string) => void;
    getCurrentLength?: (length: number) => void;
    iconButtonDeleteDisabled?: boolean;
    numbersButtonOverlayColor?: string;
    passwordComponent: any;
    passwordLength?: number;
    pinCodeKeychainName: string;
    pinCodeVisible?: boolean;
    storePin: any;
    styleButtonCircle?: StyleProp<ViewStyle>;
    styleCircleHiddenPassword?: StyleProp<ViewStyle>;
    styleCircleSizeEmpty?: number;
    styleCircleSizeFull?: number;
    styleColorButtonTitle?: string;
    styleColorButtonTitleSelected?: string;
    styleColorSubtitle?: string;
    styleColorSubtitleError?: string;
    styleColorTitle?: string;
    styleColorTitleError?: string;
    styleColumnButtons?: StyleProp<ViewStyle>;
    styleColumnDeleteButton?: StyleProp<ViewStyle>;
    styleContainer?: StyleProp<ViewStyle>;
    styleContainerPinCode?: StyleProp<ViewStyle>;
    styleDeleteButtonColorHideUnderlay?: string;
    styleDeleteButtonColorShowUnderlay?: string;
    styleDeleteButtonIcon?: string;
    styleDeleteButtonSize?: number;
    styleDeleteButtonText?: StyleProp<TextStyle>;
    styleEmptyColumn?: StyleProp<ViewStyle>;
    stylePinCodeCircle?: StyleProp<ViewStyle>;
    styleRowButtons?: StyleProp<ViewStyle>;
    styleTextButton?: StyleProp<TextStyle>;
    styleTextSubtitle?: StyleProp<TextStyle>;
    styleTextTitle?: StyleProp<TextStyle>;
    styleViewTitle?: StyleProp<ViewStyle>;
    subtitleChoose: string;
    subtitleComponent: any;
    subtitleConfirm: string;
    subtitleError?: string;
    textPasswordVisibleFamily?: string;
    textPasswordVisibleSize?: number;
    titleAttemptFailed?: string;
    titleChoose: string;
    titleComponent: any;
    titleConfirm: string;
    titleConfirmFailed?: string;
    titleValidationFailed?: string;
    validationRegex?: RegExp;
};
export declare type IState = {
    status: PinStatus;
    pinCode: string;
};
declare class PinCodeChoose extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    endProcessCreation: (pinCode: string, isErrorValidation?: boolean | undefined) => void;
    endProcessConfirm: (pinCode: string) => Promise<void>;
    cancelConfirm: () => void;
    render(): JSX.Element;
}
export default PinCodeChoose;
