/// <reference types="react" />
import { History } from 'history';
import { Route } from './route';
export declare type RouterProps = {
    basename?: string;
    history: History;
    routes: Route[];
};
export declare const Router: ({ basename, history, routes }: RouterProps) => JSX.Element;
export declare type BrowserRouterProps = {
    basename?: string;
    routes: Route[];
};
export declare const BrowserRouter: ({ basename, routes }: BrowserRouterProps) => JSX.Element;
export declare type HashRouterProps = BrowserRouterProps;
export declare const HashRouter: ({ basename, routes }: HashRouterProps) => JSX.Element;
