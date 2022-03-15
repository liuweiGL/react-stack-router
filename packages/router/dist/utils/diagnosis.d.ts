/**
 * 为变量添加断言
 *
 * 注意：不要使用箭头函数声明
 * @see https://github.com/microsoft/TypeScript/issues/34523
 *  */
export declare function assert(cond: any, message: string): asserts cond;
export declare function warning(cond: any, message: string): void;
export declare function error(cond: any, message: string): void;
