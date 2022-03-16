import { LazyComponent } from 'src/core/route';
export declare const isClassComponent: (component: any) => boolean;
export declare const isLazyComponent: (component: any) => component is LazyComponent;
export declare const loadLazyComponent: (component: () => Promise<any>) => Promise<any>;
export declare const isESModule: (obj: any) => obj is {
    default: any;
};
export declare const hasSymbol: boolean;
