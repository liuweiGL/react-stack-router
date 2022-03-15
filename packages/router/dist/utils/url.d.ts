import { Path } from 'history';
export declare const containBasename: (basename: string, pathname: string) => boolean;
export declare const stripBasename: (basename: string, pathname: string) => string | null;
export declare const joinPaths: (...paths: string[]) => string;
export declare const normalizePath: (pathname: string) => string;
export declare const parseParams: (url?: string | undefined) => Record<string, string>;
export declare const stringifyParams: (params: Record<any, any>) => string;
export declare const getPageKey: ({ search }: Partial<Path>) => string | undefined;
export declare const setPageKey: (location: Partial<Path>) => {
    search: string;
    pathname?: string | undefined;
    hash?: string | undefined;
};
