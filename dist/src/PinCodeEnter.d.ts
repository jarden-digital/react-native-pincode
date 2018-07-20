/// <reference types="react" />
import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { PinStatus } from './PinCode';
import { PinResultStatus } from '../index';
/**
 * Pin Code Enter PIN Page
 */
export declare type IProps = {
    storedPin: string | null;
    touchIDSentence: string;
    handleResult: any;
    title: string;
    subtitle: string;
    maxAttempts: number;
    pinStatusExternal: PinResultStatus;
    changeInternalStatus: (status: PinResultStatus) => void;
    status: PinStatus;
    buttonNumberComponent: any;
    passwordLength?: number;
    passwordComponent: any;
    titleAttemptFailed?: string;
    finishProcess?: any;
    iconButtonDeleteDisabled?: boolean;
    titleConfirmFailed?: string;
    subtitleError?: string;
    buttonDeleteText?: string;
    colorPassword?: string;
    colorPasswordError?: string;
    numbersButtonOverlayColor?: string;
    buttonDeleteComponent: any;
    titleComponent: any;
    subtitleComponent: any;
    timePinLockedAsyncStorageName: string;
    pinAttemptsAsyncStorageName: string;
    touchIDDisabled: boolean;
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
    pinCodeStatus: PinResultStatus;
    locked: boolean;
};
declare class PinCodeEnter extends React.PureComponent<IProps, IState> {
    keyChainResult: any;
    constructor(props: IProps);
    componentWillReceiveProps(nextProps: IProps): void;
    componentWillMount(): Promise<void>;
    componentDidMount(): void;
    endProcess: (pinCode?: string | undefined) => Promise<void>;
    launchTouchID(): Promise<void>;
    render(): JSX.Element;
}
export default PinCodeEnter;
