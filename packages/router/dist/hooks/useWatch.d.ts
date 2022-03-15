import { History } from 'history';
import { ProHistory } from '../core/history';
import { Route } from '../core/route';
export declare type UseHistoryProps = {
    basename: string;
    history: History;
    routes: Route[];
};
export declare const useWatch: ({ basename, history, routes }: UseHistoryProps) => {
    location: import("history").Location;
    history: ProHistory;
    matches: import("../core/stack").StackRoute[];
};
