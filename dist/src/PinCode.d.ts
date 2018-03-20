/// <reference types="react" />
import * as React from 'react';
/**
 * Pin Code Component
 */
export declare type IProps = {
    endProcess: (pinCode: string) => void;
    sentenceTitle: string;
    subtitle?: string;
    status: PinStatus;
    cancelFunction?: () => void;
    previousPin?: string;
    pinCodeStatus?: 'initial' | 'success' | 'failure' | 'locked';
    error?: boolean;
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
    renderButtonNumber: (text: string) => JSX.Element;
    endProcess: (pwd: string) => void;
    doShake(): Promise<void>;
    showError(): Promise<void>;
    renderCirclePassword: () => JSX.Element;
    render(): JSX.Element;
}
export default PinCode;
