import { ProviderProps } from 'react';
import { ProHistory } from '../core/history';
declare type NavigationContextState = {
    navigator: ProHistory;
};
export declare const NavigationContext: import("react").Context<NavigationContextState>;
export declare const NavigationProvider: (props: ProviderProps<NavigationContextState>) => JSX.Element;
export {};
