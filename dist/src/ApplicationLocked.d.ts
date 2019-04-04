/// <reference types="react" />
import { PinResultStatus } from "./utils";
import * as React from 'react';
export declare type IProps = {
    timeToLock: number;
    onClickButton: any;
    textButton: string;
    changeStatus: (status: PinResultStatus) => void;
    textDescription?: string;
    textSubDescription?: string;
    buttonComponent?: any;
    timerComponent?: any;
    textTitle?: string;
    titleComponent?: any;
    iconComponent?: any;
    timePinLockedAsyncStorageName: string;
    pinAttemptsAsyncStorageName: string;
    styleButton?: any;
    styleTextButton?: any;
    styleViewTimer?: any;
    styleTextTimer?: any;
    styleTitle?: any;
    styleViewTextLock?: any;
    styleViewIcon?: any;
    colorIcon?: string;
    nameIcon?: string;
    sizeIcon?: number;
    styleMainContainer?: any;
    styleText?: any;
    styleViewButton?: any;
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
