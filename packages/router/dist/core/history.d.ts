import { History, To, Update } from 'history';
import { Route, RouteRecord } from './route';
import { Stack } from './stack';
export declare type ProTo = To | {
    name: string;
};
export declare type ProUpdate = Update & {
    route: RouteRecord;
};
export declare type ProListener = (options: ProUpdate) => void;
export declare type ProBlocker = (options: ProUpdate) => boolean | undefined;
export declare type HistoryProps = {
    basename: string;
    history: History;
    routes: Route[];
    stack: Stack;
};
export declare class ProHistory {
    basename: string;
    private history;
    private routes;
    private stack;
    private routeRecordMap;
    private blockerMap;
    private listeners;
    private unlisteners;
    constructor({ basename, history, routes, stack }: HistoryProps);
    get location(): import("history").Location;
    get currentRoute(): import("./stack").StackRoute;
    get stackSnapshoot(): import("./stack").StackRoute[];
    private get indexRoute();
    private resolveRouteRecord;
    /**
     * 包装 history 的 listen 事件，处理 basename
     */
    private initSubscriber;
    /**
     * 当 history 变化时维护路由
     */
    private initWatcher;
    /**
     * 加载首页
     */
    private loadIndexPage;
    listen(listener: ProListener): () => void;
    private resolveTo;
    push(to: ProTo, blocker?: ProBlocker): void;
    replace(to: ProTo): void;
    reset(): void;
    back(delta?: number): void;
    createHref(to: ProTo): string | undefined;
    destroy(): void;
}
