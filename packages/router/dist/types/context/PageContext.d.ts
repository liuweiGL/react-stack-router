/// <reference types="react" />
export declare type PageStatus = 'show' | 'hide';
export declare type PageContextState = {
    status?: PageStatus;
};
export declare const PageContext: import("react").Context<PageContextState>;
