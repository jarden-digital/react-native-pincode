/// <reference types="react" />
import * as React from 'react';
import { PinResultStatus } from './PinCodeEnter';
export declare type IProps = {
    timeToLock: number;
    onClickButton: any;
    textButton: string;
    changeStatus: (status: PinResultStatus) => void;
    textDescription?: string;
    buttonComponent?: any;
    timerComponent?: any;
    textTitle?: string;
    titleComponent?: any;
    iconComponent?: any;
    timePinLockedAsyncStorageName: string;
    pinAttemptsAsyncStorageName: string;
};
export declare type IState = {
    timeDiff: number;
};
declare class ApplicationLocked extends React.PureComponent<IProps, IState> {
    timeLocked: number;
    isUnmounted: boolean;
    constructor(props: IProps);
    componentDidMount(): void;
    timer(): Promise<void>;
    componentWillUnmount(): void;
    renderButton: () => JSX.Element;
    renderTimer: (minutes: number, seconds: number) => JSX.Element;
    renderTitle: () => JSX.Element;
    renderIcon: () => JSX.Element;
    renderErrorLocked: () => JSX.Element;
    render(): JSX.Element;
}
export default ApplicationLocked;
