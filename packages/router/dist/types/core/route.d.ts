import { ComponentClass, ComponentType, FunctionComponent, ReactNode } from 'react';
export declare type LazyComponent = () => Promise<{
    default: ComponentType<any>;
}>;
export declare type RouteComponent = FunctionComponent | ComponentClass | LazyComponent;
declare type BaseRoute<Meta> = {
    index?: boolean;
    name?: string;
    path: string;
    meta?: Meta;
};
export declare type PageRoute<Meta = any> = BaseRoute<Meta> & {
    type?: 'page';
};
export declare type TabRoute<Meta = any> = BaseRoute<Meta> & {
    type: 'tab';
    icon?: ReactNode;
};
export declare type RouteRaw<Meta = any> = PageRoute<Meta> | TabRoute<Meta>;
export declare type Route<Meta = any> = RouteRaw<Meta> & {
    component: RouteComponent;
};
export declare type RouteRecord<Meta = any> = RouteRaw<Meta> & {
    component: Exclude<RouteComponent, LazyComponent>;
};
export declare const isTabRoute: (route: RouteRaw) => route is TabRoute<any>;
export declare const isPageRoute: (route: RouteRaw) => route is PageRoute<any>;
export declare const isSameRoute: (route1: RouteRaw, route2: RouteRaw) => boolean;
export declare const matchRoute: (routes: Route[], nameOrPath?: string | undefined) => Route<any> | undefined;
export {};
