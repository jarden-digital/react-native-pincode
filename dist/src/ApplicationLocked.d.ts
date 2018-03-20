/// <reference types="react" />
import * as React from 'react';
export declare type IProps = {
    timeToLock: number;
    onClickButton: any;
    textButton: string;
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
    renderErrorLocked: () => JSX.Element;
    render(): JSX.Element;
}
export default ApplicationLocked;
