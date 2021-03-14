import { PinStatus } from './PinCode';
import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
/**
 * Pin Code Choose PIN Page
 */
export interface IProps {
    alphabetCharsVisible?: boolean;
    buttonDeleteComponent: any;
    buttonDeleteText?: string;
    buttonNumberComponent: any;
    colorCircleButtons?: string;
    colorPassword?: string;
    colorPasswordEmpty?: string;
    colorPasswordError?: string;
    customBackSpaceIcon?: any;
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
    styleAlphabet?: StyleProp<TextStyle>;
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
    styleContainer: StyleProp<ViewStyle>;
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
    vibrationEnabled?: boolean;
    delayBetweenAttempts?: number;
}
export declare type IState = {
    status: PinStatus;
    pinCode: string;
};
declare class PinCodeChoose extends React.PureComponent<IProps, IState> {
    static defaultProps: Partial<IProps>;
    constructor(props: IProps);
    endProcessCreation: (pinCode: string, isErrorValidation?: boolean) => void;
    endProcessConfirm: (pinCode: string) => Promise<void>;
    cancelConfirm: () => void;
    render(): any;
}
export default PinCodeChoose;
