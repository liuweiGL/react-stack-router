import { ReactNode } from 'react';
export declare type RouterPageProps = {
    status: 'show' | 'hide';
    children?: ReactNode;
};
declare const RouterPage: ({ status, children }: RouterPageProps) => JSX.Element;
export default RouterPage;
