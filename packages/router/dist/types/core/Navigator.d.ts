import { CSSProperties, MouseEvent, ReactNode } from 'react';
declare type ComponentProps = {
    className?: string;
    style?: CSSProperties;
    title?: ReactNode;
    children?: ReactNode;
    onClick?: (event: MouseEvent) => boolean | void;
};
export declare type NavigateForwardProps = {
    type?: 'navigateTo' | 'switchTab' | 'redirectTo';
    name?: string;
    url?: string;
};
export declare type NavigateBackProps = {
    type: 'navigateBack';
    delta?: number;
};
export declare type NavigatorProps = ComponentProps & (NavigateForwardProps | NavigateBackProps);
export declare const Navigator: ({ className, style, children, title, onClick, ...navigateOptions }: NavigatorProps) => JSX.Element;
export {};
