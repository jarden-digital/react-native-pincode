/// <reference path="../src/types.d.ts" />
/// <reference types="react" />
import * as React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
export declare type IProps = {
    buttonComponentLockedPage?: any;
    buttonDeleteComponent?: any;
    buttonDeleteText?: string;
    buttonNumberComponent?: any;
    colorPassword?: string;
    colorPasswordError?: string;
    finishProcess?: any;
    handleResultEnterPin?: any;
    iconComponentLockedPage?: any;
    iconButtonDeleteDisabled?: boolean;
    lockedPage?: any;
    maxAttempts?: number;
    numbersButtonOverlayColor?: string;
    onClickButtonLockedPage?: any;
    passwordComponent?: any;
    passwordLength?: number;
    pinAttemptsAsyncStorageName?: string;
    pinCodeKeychainName?: string;
    pinStatus?: PinResultStatus;
    status: 'choose' | 'enter' | 'locked';
    storedPin?: string;
    storePin?: any;
    styleMainContainer?: StyleProp<ViewStyle>;
    stylePinCodeChooseContainer?: StyleProp<ViewStyle>;
    stylePinCodeEnterContainer?: StyleProp<ViewStyle>;
    styleLockScreenButton?: StyleProp<ViewStyle>;
    styleLockScreenColorIcon?: string;
    styleLockScreenMainContainer?: StyleProp<ViewStyle>;
    styleLockScreenNameIcon?: string;
    styleLockScreenSizeIcon?: number;
    styleLockScreenText?: StyleProp<TextStyle>;
    styleLockScreenTextButton?: StyleProp<TextStyle>;
    styleLockScreenTextTimer?: StyleProp<TextStyle>;
    styleLockScreenTitle?: StyleProp<TextStyle>;
    styleLockScreenViewCloseButton?: StyleProp<ViewStyle>;
    styleLockScreenViewIcon?: StyleProp<ViewStyle>;
    styleLockScreenViewTextLock?: StyleProp<ViewStyle>;
    styleLockScreenViewTimer?: StyleProp<ViewStyle>;
    stylePinCodeButtonCircle?: StyleProp<ViewStyle>;
    stylePinCodeButtonNumber?: string;
    stylePinCodeButtonNumberPressed?: string;
    stylePinCodeColorSubtitle?: string;
    stylePinCodeColorSubtitleError?: string;
    stylePinCodeColorTitle?: string;
    stylePinCodeColorTitleError?: string;
    stylePinCodeColumnButtons?: StyleProp<ViewStyle>;
    stylePinCodeColumnDeleteButton?: StyleProp<ViewStyle>;
    stylePinCodeDeleteButtonColorHideUnderlay?: string;
    stylePinCodeDeleteButtonColorShowUnderlay?: string;
    stylePinCodeDeleteButtonIcon?: string;
    stylePinCodeDeleteButtonSize?: number;
    stylePinCodeDeleteButtonText?: StyleProp<TextStyle>;
    stylePinCodeEmptyColumn?: StyleProp<ViewStyle>;
    stylePinCodeHiddenPasswordCircle?: StyleProp<ViewStyle>;
    stylePinCodeMainContainer?: StyleProp<ViewStyle>;
    stylePinCodeRowButtons?: StyleProp<ViewStyle>;
    stylePinCodeTextButtonCircle?: StyleProp<TextStyle>;
    stylePinCodeTextSubtitle?: StyleProp<TextStyle>;
    stylePinCodeTextTitle?: StyleProp<TextStyle>;
    stylePinCodeViewTitle?: StyleProp<TextStyle>;
    subtitleChoose?: string;
    subtitleComponent?: any;
    subtitleConfirm?: string;
    subtitleEnter?: string;
    subtitleError?: string;
    textButtonLockedPage?: string;
    textDescriptionLockedPage?: string;
    textTitleLockedPage?: string;
    timeLocked?: number;
    timePinLockedAsyncStorageName?: string;
    timerComponentLockedPage?: any;
    titleAttemptFailed?: string;
    titleChoose?: string;
    titleComponent?: any;
    titleComponentLockedPage?: any;
    titleConfirm?: string;
    titleConfirmFailed?: string;
    titleEnter?: string;
    touchIDDisabled?: boolean;
    touchIDSentence?: string;
};
export declare type IState = {
    internalPinStatus: PinResultStatus;
    pinLocked: boolean;
};
export declare enum PinResultStatus {
    initial = "initial",
    success = "success",
    failure = "failure",
    locked = "locked",
}
declare class PINCode extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    componentWillMount(): Promise<void>;
    changeInternalStatus: (status: PinResultStatus) => void;
    renderLockedPage: () => JSX.Element;
    render(): JSX.Element;
}
export default PINCode;
