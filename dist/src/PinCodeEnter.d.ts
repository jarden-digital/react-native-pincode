/// <reference types="react" />
import * as React from 'react';
/**
 * Pin Code Enter PIN Page
 */
export declare type IProps = {
    openError: (type: string) => void;
    storedPin: string | null;
    touchIDSentence: string;
    handleResult: any;
    title: string;
    subtitle: string;
    maxAttempts: number;
    pinStatusExternal: PinResultStatus;
    changeInternalStatus: (status: PinResultStatus) => void;
};
export declare type IState = {
    pinCodeStatus: PinResultStatus;
    locked: boolean;
};
export declare enum PinResultStatus {
    initial = "initial",
    success = "success",
    failure = "failure",
    locked = "locked",
}
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
