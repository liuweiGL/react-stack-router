'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsxRuntime = require('react/jsx-runtime');
var react = require('react');
var history = require('history');

const LocationContext = react.createContext({});
const LocationProvider = (props) => {
    return jsxRuntime.jsx(LocationContext.Provider, { ...props });
};

const NavigationContext = react.createContext({});
const NavigationProvider = (props) => {
    return jsxRuntime.jsx(NavigationContext.Provider, { ...props });
};

const isClassComponent = (component) => {
    return !!Object.getPrototypeOf(component)?.isReactComponent;
};
const importRegexp = /import\s?\(/;
const isLazyComponent = (component) => {
    if (isClassComponent(component)) {
        return false;
    }
    const str = String(component).trim();
    return str.startsWith('(') && str.includes('=>') && importRegexp.test(str);
};
const loadLazyComponent = async (component) => {
    const res = await component();
    if (res && isESModule(res)) {
        return res.default;
    }
    return res;
};
const isESModule = (obj) => {
    return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module');
};
const hasSymbol = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';

const PAGE_KEY = '_pageKey';

let IDX = 36, HEX = '';
while (IDX--)
    HEX += IDX.toString(36);
function uid(len) {
    let str = '', num = len || 11;
    while (num--)
        str += HEX[(Math.random() * 36) | 0];
    return str;
}

const containBasename = (basename, pathname) => {
    return pathname.toLowerCase().startsWith(basename.toLowerCase());
};
const stripBasename = (basename, pathname) => {
    if (basename === '/')
        return pathname;
    if (!containBasename(basename, pathname)) {
        return null;
    }
    return pathname.slice(basename.length) || '/';
};
const joinPaths = (...paths) => {
    return paths.join('/').replace(/\/\/+/g, '/');
};
const normalizePath = (pathname) => {
    return pathname.replace(/\/+$/, '').replace(/^\/*/, '/');
};
const parseParams = (url) => {
    const result = {};
    if (!url) {
        return result;
    }
    const { search } = history.parsePath(url);
    const searchParams = new URLSearchParams(search);
    for (const [key, value] of searchParams.entries()) {
        result[key] = value;
    }
    return result;
};
const stringifyParams = (params) => {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value);
    }
    return searchParams.toString();
};
const getPageKey = ({ search }) => {
    if (!search) {
        return undefined;
    }
    const params = parseParams(search);
    const pageKey = params[PAGE_KEY];
    return typeof pageKey === 'string' ? pageKey : undefined;
};
const setPageKey = (location) => {
    const params = parseParams(location.search);
    const search = stringifyParams({
        ...params,
        [PAGE_KEY]: uid()
    });
    return {
        ...location,
        search
    };
};

/**
 * 为变量添加断言
 *
 * 注意：不要使用箭头函数声明
 * @see https://github.com/microsoft/TypeScript/issues/34523
 *  */
function log(method, cond, message) {
    if (cond) {
        // eslint-disable-next-line no-console
        if (typeof console !== 'undefined')
            console[method](message);
        try {
            // Welcome to debugging React Router!
            //
            // This error is thrown as a convenience so you can more easily
            // find the source for a warning that appears in the console by
            // enabling "pause on exceptions" in your JavaScript debugger.
            throw new Error(message);
            // eslint-disable-next-line no-empty
        }
        catch (e) { }
    }
}
function warning(cond, message) {
    log('warn', cond, message);
}
function error(cond, message) {
    log('error', cond, message);
}

const isTabRoute = (route) => {
    return route.type === 'tab';
};
const isPageRoute = (route) => {
    return route.type === undefined || route.type === 'page';
};
const isSameRoute = (route1, route2) => {
    return route1.name === route2.name || route1.path === route2.path;
};
const matchRoute = (routes, nameOrPath) => {
    let route;
    if (nameOrPath) {
        route = routes.find(({ name, path }) => name === nameOrPath || path === nameOrPath);
    }
    warning(!route, `Can not find the route when name or path is  \`${nameOrPath}\` `);
    return route;
};

class ProHistory {
    basename;
    history;
    routes;
    stack;
    routeRecordMap;
    blockerMap;
    listeners = [];
    unlisteners = [];
    constructor({ basename, history, routes, stack }) {
        this.basename = normalizePath(basename);
        this.routes = routes;
        this.stack = stack;
        this.history = history;
        this.routeRecordMap = new Map();
        this.blockerMap = new Map();
        this.initSubscriber();
        this.initWatcher();
        this.loadIndexPage();
    }
    get location() {
        return this.history.location;
    }
    get currentRoute() {
        return this.stack.current;
    }
    get stackSnapshoot() {
        return this.stack.items.slice();
    }
    get indexRoute() {
        return this.routes.find(item => item.index) || this.routes[0];
    }
    async resolveRouteRecord(pathname) {
        const route = matchRoute(this.routes, pathname);
        if (!route) {
            return;
        }
        const { path, component } = route;
        if (this.routeRecordMap.has(path)) {
            return this.routeRecordMap.get(path);
        }
        let routeRecord;
        if (isLazyComponent(component)) {
            const resolvedComponent = await loadLazyComponent(component);
            if (!resolvedComponent) {
                throw new Error(`Couldn't resolve component  at "${path}"`);
            }
            routeRecord = {
                ...route,
                component: resolvedComponent
            };
        }
        else {
            routeRecord = {
                ...route,
                component
            };
        }
        this.routeRecordMap.set(path, routeRecord);
        return routeRecord;
    }
    /**
     * 包装 history 的 listen 事件，处理 basename
     */
    initSubscriber() {
        const unlistener = this.history.listen(async (options) => {
            const { location: { pathname, state } } = options;
            const path = stripBasename(this.basename, pathname);
            if (!path) {
                return;
            }
            const route = await this.resolveRouteRecord(path);
            if (!route) {
                return;
            }
            const proOptions = {
                ...options,
                route
            };
            if (state) {
                const { blockerId } = state;
                const blocker = this.blockerMap.get(blockerId);
                if (blocker && blocker(proOptions) === false) {
                    this.blockerMap.delete(blockerId);
                    return;
                }
            }
            this.listeners.forEach(listen => {
                listen(proOptions);
            });
        });
        this.unlisteners.push(unlistener);
    }
    /**
     * 当 history 变化时维护路由
     */
    initWatcher() {
        this.listen(({ route, location }) => {
            const url = history.createPath(location);
            const pageKey = getPageKey(location);
            if (pageKey) {
                const stackRoute = {
                    pageKey,
                    url,
                    ...route
                };
                if (isTabRoute(route)) {
                    this.stack.switchTab(stackRoute);
                }
                else {
                    this.stack.jumpPage(stackRoute);
                }
            }
            else {
                this.history.replace(setPageKey(location));
            }
        });
    }
    /**
     * 加载首页
     */
    loadIndexPage() {
        this.replace(this.indexRoute.path);
    }
    listen(listener) {
        this.listeners.push(listener);
        const index = this.listeners.length - 1;
        return () => {
            this.listeners.splice(index, 1);
        };
    }
    resolveTo(to) {
        let path;
        if (typeof to === 'string') {
            path = history.parsePath(to);
        }
        else if ('pathname' in to) {
            path = to;
        }
        else if ('name' in to) {
            const route = matchRoute(this.routes, to.name);
            path = route
                ? {
                    pathname: route.path
                }
                : undefined;
        }
        if (path?.pathname) {
            path.pathname = joinPaths(this.basename, path.pathname);
            path = setPageKey(path);
        }
        return path;
    }
    push(to, blocker) {
        const result = this.resolveTo(to);
        if (result) {
            let state;
            if (blocker) {
                const blockerId = Date.now();
                state = { blockerId };
                this.blockerMap.set(blockerId, blocker);
            }
            this.history.push(result, state);
        }
    }
    replace(to) {
        const result = this.resolveTo(to);
        if (result) {
            this.stack.pop();
            this.history.replace(result);
        }
    }
    reset() {
        this.stack.clear();
    }
    back(delta = 1) {
        const prePage = this.stack.getLastItem(delta);
        this.history.replace(prePage.url);
    }
    createHref(to) {
        const result = this.resolveTo(to);
        if (result) {
            return this.history.createHref(result);
        }
        return undefined;
    }
    destroy() {
        this.unlisteners.forEach(item => item());
    }
}

let timer;
const debounce = (fn, wait) => {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(fn, wait);
};

const createReactiveArray = (scheduler) => {
    const initial = [];
    return new Proxy(initial, {
        get(target, key) {
            return target[key];
        },
        set(target, key, value) {
            target[key] = value;
            debounce(scheduler, 50);
            return true;
        }
    });
};
class Stack {
    tabs;
    pages;
    constructor(scheduler) {
        this.tabs = createReactiveArray(scheduler);
        this.pages = createReactiveArray(scheduler);
    }
    get current() {
        return this.items[this.items.length - 1];
    }
    get items() {
        return [...this.tabs, ...this.pages];
    }
    containsTab(item) {
        return this.tabs.some(tab => isSameRoute(tab, item));
    }
    findPageIndex(item) {
        if (!item.pageKey) {
            return -1;
        }
        return this.pages.findIndex(page => page.pageKey === item.pageKey);
    }
    /**
     * 从右往左取值，下标从 0 开始
     */
    getLastItem(delta) {
        return this.items[this.items.length - delta - 1];
    }
    switchTab(item) {
        if (this.containsTab(item)) {
            this.tabs.sort(tab => (isSameRoute(tab, item) ? -1 : 0));
        }
        else {
            this.tabs.push({ ...item });
        }
        this.clear();
    }
    jumpPage(item) {
        const pageIndex = this.findPageIndex(item);
        if (pageIndex > -1) {
            this.pages.splice(pageIndex + 1, this.pages.length - pageIndex - 1);
        }
        else {
            this.pages.push({ ...item });
        }
    }
    pop() {
        this.pages.pop();
    }
    clear() {
        this.pages.splice(0, this.pages.length);
    }
}

const useForceUpdate = () => {
    const [, setState] = react.useState({});
    return react.useCallback(() => setState({}), []);
};

const useStack = () => {
    const scheduler = useForceUpdate();
    return react.useMemo(() => new Stack(scheduler), []);
};

const useUnmount = (cb) => {
    react.useEffect(() => {
        return cb;
    }, []);
};

const useWatch = ({ basename, history, routes }) => {
    const stack = useStack();
    // 不要使用 useMemo 不然有可能导致多个 history 实例操作同一个 stack
    const ref = react.useRef();
    if (!ref.current) {
        ref.current = new ProHistory({ basename, history, routes, stack });
    }
    const proHistory = ref.current;
    const [location, setLocation] = react.useState(history.location);
    react.useEffect(() => {
        proHistory.listen(function c({ location }) {
            setLocation(location);
        });
    }, [proHistory]);
    useUnmount(() => {
        proHistory.destroy();
    });
    return {
        location,
        history: proHistory,
        matches: stack.items
    };
};

const PageContext = react.createContext({});

const hideStyle = Object.freeze({
    display: 'none'
});
const RouterPage = ({ status, children }) => {
    return (jsxRuntime.jsx(PageContext.Provider, { value: { status }, children: jsxRuntime.jsx("div", { children: children, style: status === 'hide' ? hideStyle : undefined }) }));
};

const renderRoutes = (routes) => {
    return routes.map(({ pageKey, component: RouteComponent }, index) => {
        const status = index === routes.length - 1 ? 'show' : 'hide';
        return (jsxRuntime.jsx(RouterPage, { status: status, children: jsxRuntime.jsx(RouteComponent, {}) }, pageKey));
    });
};
const Router = ({ basename = '/', history, routes }) => {
    const { matches, location, history: proHistory } = useWatch({ basename, history, routes });
    const children = renderRoutes(matches);
    return (jsxRuntime.jsx(NavigationProvider, { value: { navigator: proHistory }, children: jsxRuntime.jsx(LocationProvider, { children: children, value: { location } }) }));
};
const BrowserRouter = ({ basename, routes }) => {
    const history$1 = react.useMemo(() => history.createBrowserHistory({ window }), []);
    return jsxRuntime.jsx(Router, { basename: basename, history: history$1, routes: routes });
};
const HashRouter = ({ basename, routes }) => {
    const history$1 = react.useMemo(() => history.createHashHistory({ window }), []);
    return jsxRuntime.jsx(Router, { basename: basename, history: history$1, routes: routes });
};

const useNavigation = () => {
    return react.useContext(NavigationContext);
};

const isModifiedEvent = (event) => {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

const navigate = async (options) => {
    return new Promise((resolve, reject) => {
        const { navigator, type } = options;
        const unListen = navigator.listen(() => {
            resolve();
            unListen();
        });
        try {
            if (type === 'navigateBack') {
                const { delta } = options;
                navigator.back(delta);
            }
            else {
                const { name, url } = options;
                const to = name ? { name } : url;
                if (!to) {
                    return;
                }
                if (type === 'navigateTo' || type === 'switchTab') {
                    navigator.push(to, ({ route }) => {
                        if (type === 'navigateTo' && isTabRoute(route)) {
                            error(true, `Use \`switchTo\` instead of \`navigateTo\` to switch the tabbar page：${route.path}`);
                            return false;
                        }
                    });
                }
                else if (type === 'redirectTo') {
                    navigator.replace(to);
                }
                else if (type === 'reLaunch') {
                    navigator.reset();
                    navigator.push(to);
                }
            }
        }
        catch (error) {
            reject(`${type}:fail ${error.message || error}`);
        }
    });
};

const Navigator = ({ className, style, children, title = children, onClick, ...navigateOptions }) => {
    const { navigator } = useNavigation();
    let href;
    if (navigateOptions.type !== 'navigateBack') {
        const { name, url } = navigateOptions;
        const to = name ? { name } : url;
        if (to) {
            href = navigator.createHref(to);
        }
    }
    const handleNavigate = (event) => {
        const keepGoing = onClick?.(event);
        if (keepGoing === false) {
            event.preventDefault();
            return;
        }
        if (event.button === 0 && !isModifiedEvent(event)) {
            event.preventDefault();
            navigate({
                navigator,
                type: 'navigateTo',
                ...navigateOptions
            });
        }
    };
    return (jsxRuntime.jsx("a", { className: className, href: href, style: style, target: '_self', onClick: handleNavigate, children: title }));
};

const useRouter = () => {
    const ref = react.useRef();
    const { navigator } = useNavigation();
    if (!ref.current) {
        ref.current = {
            navigateTo: (options) => {
                return navigate({ navigator, type: 'navigateTo', ...options });
            },
            redirectTo: (options) => {
                return navigate({ navigator, type: 'redirectTo', ...options });
            },
            switchTab: (options) => {
                return navigate({ navigator, type: 'switchTab', ...options });
            },
            navigateBack: (options) => {
                return navigate({ navigator, type: 'navigateBack', ...options });
            }
        };
    }
    return {
        ...ref.current,
        currentRoute: navigator.currentRoute,
        getSnapshoot() {
            return navigator.stackSnapshoot;
        }
    };
};

const useLocation = () => {
    return react.useContext(LocationContext);
};

const usePage = () => {
    return react.useContext(PageContext);
};

const useDidHide = (cb) => {
    const { status } = usePage();
    const ref = react.useRef();
    if (status === 'hide' && ref.current !== 'hide') {
        cb();
    }
    ref.current = status;
};

const useDidShow = (cb) => {
    const { status } = usePage();
    const ref = react.useRef();
    if (status === 'show' && ref.current !== 'show') {
        cb();
    }
    ref.current = status;
};

const defineRoutes = (routes) => routes;

exports.BrowserRouter = BrowserRouter;
exports.HashRouter = HashRouter;
exports.Navigator = Navigator;
exports.defineRoutes = defineRoutes;
exports.isPageRoute = isPageRoute;
exports.isSameRoute = isSameRoute;
exports.isTabRoute = isTabRoute;
exports.matchRoute = matchRoute;
exports.useDidHide = useDidHide;
exports.useDidShow = useDidShow;
exports.useLocation = useLocation;
exports.useRouter = useRouter;
//# sourceMappingURL=react-mobile-router.cjs.js.map
