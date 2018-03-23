/// <reference types="react" />
import * as React from 'react';
export declare type IProps = {
    buttonComponentLockedPage?: any;
    buttonDeleteComponent?: any;
    buttonNumberComponent?: any;
    colorPassword?: string;
    finishProcess?: any;
    handleResultEnterPin?: any;
    iconComponentLockedPage?: any;
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
