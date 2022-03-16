import { RouteRecord } from './route';
declare type Scheduler = () => void;
export declare type StackRoute = RouteRecord & {
    pageKey?: string;
    url: string;
};
export declare class Stack {
    private tabs;
    private pages;
    constructor(scheduler: Scheduler);
    get current(): StackRoute;
    get items(): StackRoute[];
    private containsTab;
    private findPageIndex;
    /**
     * 从右往左取值，下标从 0 开始
     */
    getLastItem(delta: number): StackRoute;
    switchTab(item: StackRoute): void;
    jumpPage(item: StackRoute): void;
    pop(): void;
    clear(): void;
}
export {};
