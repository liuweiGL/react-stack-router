export declare type Noop<T = any> = (...args: T[]) => any;
export declare const debounce: (fn: Noop, wait: number) => void;
