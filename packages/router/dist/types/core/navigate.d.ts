import { ProHistory } from '../core/history';
export declare type NavigateForwardOptions = {
    type: 'navigateTo' | 'switchTab' | 'redirectTo' | 'reLaunch';
    name?: string;
    url?: string;
};
export declare type NavigateBackOptions = {
    type: 'navigateBack';
    delta?: number;
};
export declare type NavigateOptions = {
    navigator: ProHistory;
} & (NavigateForwardOptions | NavigateBackOptions);
export declare const navigate: (options: NavigateOptions) => Promise<void>;
