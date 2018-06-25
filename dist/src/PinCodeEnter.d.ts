/// <reference types="react" />
import * as React from 'react';
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
    titleConfirmFailed?: string;
    subtitleError?: string;
    colorPassword?: string;
    numbersButtonOverlayColor?: string;
    buttonDeleteComponent: any;
    titleComponent: any;
    subtitleComponent: any;
    timePinLockedAsyncStorageName: string;
    pinAttemptsAsyncStorageName: string;
    styleContainer: any;
    styleButtonCircle: any;
    styleTextButton: any;
    styleCircleHiddenPassword: any;
    styleRowButtons: any;
    styleColumnButtons: any;
    styleEmptyColumn: any;
    styleViewTitle: any;
    styleTextTitle: any;
    styleTextSubtitle: any;
    styleContainerPinCode: any;
    styleColumnDeleteButton: any;
    styleDeleteButtonColorShowUnderlay: string;
    styleDeleteButtonColorHideUnderlay: string;
    styleDeleteButtonIcon: string;
    styleDeleteButtonSize: number;
    styleDeleteButtonText: any;
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
