/// <reference types="react" />
import * as React from 'react';
import { PinResultStatus } from './src/PinCodeEnter';
export declare type IProps = {
    status: 'choose' | 'enter' | 'locked';
    storePin?: any;
    titleEnter?: string;
    subtitleEnter?: string;
    titleChoose?: string;
    subtitleChoose?: string;
    titleConfirm?: string;
    subtitleConfirm?: string;
    maxAttempts?: number;
    openAppLockedScreen?: any;
    pinStatus?: PinResultStatus;
    storedPin?: string;
    touchIDSentence?: string;
    handleResultEnterPin?: any;
    timeLocked?: number;
    textButtonLockedPage?: string;
    onClickButtonLockedPage?: any;
    pinStatusExternal?: PinResultStatus;
    changeInternalStatus?: (status: PinResultStatus) => void;
    previousPin?: string;
    pinCodeStatus?: 'initial' | 'success' | 'failure' | 'locked';
    buttonNumberComponent?: any;
    passwordLength?: number;
    passwordComponent?: any;
    titleAttemptFailed?: string;
    titleConfirmFailed?: string;
    subtitleError?: string;
    colorPassword?: string;
    numbersButtonOverlayColor?: string;
    buttonDeleteComponent?: any;
    titleComponent?: any;
    subtitleComponent?: any;
    textDescriptionLockedPage?: string;
    buttonComponentLockedPage?: any;
    timerComponentLockedPage?: any;
    textTitleLockedPage?: string;
    titleComponentLockedPage?: any;
    iconComponentLockedPage?: any;
    pinCodeKeychainName?: string;
    timePinLockedAsyncStorageName?: string;
    pinAttemptsAsyncStorageName?: string;
};
export declare type IState = {
    internalPinStatus: PinResultStatus;
    pinLocked: boolean;
};
declare class PINCode extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    changeInternalStatus: (status: PinResultStatus) => void;
    componentWillMount(): Promise<void>;
    render(): JSX.Element;
}
export default PINCode;
