import { CSSProperties, MouseEvent, ReactNode } from 'react';
import { NavigateBackOptions, NavigateForwardOptions } from './navigate';
declare type ComponentProps = {
    className?: string;
    style?: CSSProperties;
    title?: ReactNode;
    children?: ReactNode;
    onClick?: (event: MouseEvent) => boolean | void;
};
export declare type NavigatorProps = ComponentProps & (Partial<NavigateForwardOptions> | NavigateBackOptions);
export declare const Navigator: ({ className, style, children, title, onClick, ...navigateOptions }: NavigatorProps) => JSX.Element;
export {};
