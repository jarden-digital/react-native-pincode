/// <reference types="react" />
import * as React from 'react';
import { PinStatus } from './PinCode';
/**
 * Pin Code Choose PIN Page
 */
export declare type IProps = {
    storePin: any;
    titleEnter: string;
    subtitleEnter: string;
    titleConfirm: string;
    subtitleConfirm: string;
};
export declare type IState = {
    status: PinStatus;
    pinCode: string;
};
declare class PinCodeChoose extends React.PureComponent<IProps, IState> {
    constructor(props: IProps);
    endProcessCreation: (pinCode: string) => void;
    endProcessConfirm: (pinCode: string) => Promise<void>;
    cancelConfirm: () => void;
    render(): JSX.Element;
}
export default PinCodeChoose;
