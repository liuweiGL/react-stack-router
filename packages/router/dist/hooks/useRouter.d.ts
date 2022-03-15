import { NavigateBackOptions, NavigateForwardOptions } from '../core/navigate';
export declare type NavigateToParams = Pick<NavigateForwardOptions, 'name' | 'url'>;
export declare type RedirectToParams = NavigateToParams;
export declare type SwitchTabParams = NavigateToParams;
export declare type NavigateBackParams = Pick<NavigateBackOptions, 'delta'>;
export declare type RouterNavigator = {
    navigateTo: (options: NavigateToParams) => Promise<void>;
    redirectTo: (options: RedirectToParams) => Promise<void>;
    switchTab: (options: SwitchTabParams) => Promise<void>;
    navigateBack: (options: NavigateBackParams) => Promise<void>;
};
export declare const useRouter: () => {
    currentRoute: import("../core/stack").StackRoute;
    getSnapshoot(): import("../core/stack").StackRoute[];
    navigateTo: (options: NavigateToParams) => Promise<void>;
    redirectTo: (options: RedirectToParams) => Promise<void>;
    switchTab: (options: SwitchTabParams) => Promise<void>;
    navigateBack: (options: NavigateBackParams) => Promise<void>;
};
