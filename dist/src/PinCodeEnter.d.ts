import { PinStatus } from './PinCode';
import { PinResultStatus } from './utils';
import * as React from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
/**
 * Pin Code Enter PIN Page
 */
export interface IProps {
    alphabetCharsVisible?: boolean;
    buttonDeleteComponent: any;
    buttonDeleteText?: string;
    buttonNumberComponent: any;
    callbackErrorTouchId?: (e: Error) => void;
    changeInternalStatus: (status: PinResultStatus) => void;
    colorCircleButtons?: string;
    colorPassword?: string;
    colorPasswordEmpty?: string;
    colorPasswordError?: string;
    customBackSpaceIcon?: any;
    disableLockScreen: boolean;
    emptyColumnComponent: any;
    endProcessFunction?: (pinCode: string) => void;
    finishProcess?: (pinCode: string) => void;
    getCurrentLength?: (length: number) => void;
    handleResult: any;
    iconButtonDeleteDisabled?: boolean;
    maxAttempts: number;
    numbersButtonOverlayColor?: string;
    onFail?: any;
    passwordComponent: any;
    passwordLength?: number;
    pinAttemptsAsyncStorageName: string;
    pinCodeKeychainName: string;
    pinCodeVisible?: boolean;
    pinStatusExternal: PinResultStatus;
    status: PinStatus;
    storedPin: string | null;
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
    subtitle: string;
    subtitleComponent: any;
    subtitleError?: string;
    textCancelButtonTouchID?: string;
    textPasswordVisibleFamily?: string;
    textPasswordVisibleSize?: number;
    timePinLockedAsyncStorageName: string;
    title: string;
    titleAttemptFailed?: string;
    titleComponent: any;
    titleConfirmFailed?: string;
    touchIDDisabled: boolean;
    touchIDSentence: string;
    touchIDTitle?: string;
    passcodeFallback?: boolean;
    vibrationEnabled?: boolean;
    delayBetweenAttempts?: number;
}
export interface IState {
    pinCodeStatus: PinResultStatus;
    locked: boolean;
}
declare class PinCodeEnter extends React.PureComponent<IProps, IState> {
    keyChainResult: string | undefined;
    static defaultProps: {
        passcodeFallback: boolean;
        styleContainer: any;
    };
    constructor(props: IProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: Readonly<IProps>, prevState: Readonly<IState>, prevContext: any): void;
    triggerTouchID(): void;
    endProcess: (pinCode?: string) => Promise<void>;
    launchTouchID(): Promise<void>;
    render(): any;
}
export default PinCodeEnter;
