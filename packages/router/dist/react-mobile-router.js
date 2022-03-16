// src/core/Router.tsx
import { useMemo as useMemo2 } from "react";

// ../../node_modules/.pnpm/@babel+runtime@7.17.7/node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  _extends = Object.assign || function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

// ../../node_modules/.pnpm/history@5.3.0/node_modules/history/index.js
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
var readOnly = true ? function(obj) {
  return Object.freeze(obj);
} : function(obj) {
  return obj;
};
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined")
      console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
var BeforeUnloadEventType = "beforeunload";
var HashChangeEventType = "hashchange";
var PopStateEventType = "popstate";
function createBrowserHistory(options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$window = _options.window, window2 = _options$window === void 0 ? document.defaultView : _options$window;
  var globalHistory = window2.history;
  function getIndexAndLocation() {
    var _window$location = window2.location, pathname = _window$location.pathname, search = _window$location.search, hash = _window$location.hash;
    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname,
      search,
      hash,
      state: state.usr || null,
      key: state.key || "default"
    })];
  }
  var blockedPopTx = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;
      var _getIndexAndLocation = getIndexAndLocation(), nextIndex = _getIndexAndLocation[0], nextLocation = _getIndexAndLocation[1];
      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;
          if (delta) {
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          true ? warning(false, "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.") : void 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }
  window2.addEventListener(PopStateEventType, handlePop);
  var action = Action.Pop;
  var _getIndexAndLocation2 = getIndexAndLocation(), index = _getIndexAndLocation2[0], location = _getIndexAndLocation2[1];
  var listeners = createEvents();
  var blockers = createEvents();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function createHref(to) {
    return typeof to === "string" ? to : createPath(to);
  }
  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }
    return readOnly(_extends({
      pathname: location.pathname,
      hash: "",
      search: ""
    }, typeof to === "string" ? parsePath(to) : to, {
      state,
      key: createKey()
    }));
  }
  function getHistoryStateAndUrl(nextLocation, index2) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index2
    }, createHref(nextLocation)];
  }
  function allowTx(action2, location2, retry) {
    return !blockers.length || (blockers.call({
      action: action2,
      location: location2,
      retry
    }), false);
  }
  function applyTx(nextAction) {
    action = nextAction;
    var _getIndexAndLocation3 = getIndexAndLocation();
    index = _getIndexAndLocation3[0];
    location = _getIndexAndLocation3[1];
    listeners.call({
      action,
      location
    });
  }
  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr = getHistoryStateAndUrl(nextLocation, index + 1), historyState = _getHistoryStateAndUr[0], url = _getHistoryStateAndUr[1];
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error2) {
        window2.location.assign(url);
      }
      applyTx(nextAction);
    }
  }
  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr2 = getHistoryStateAndUrl(nextLocation, index), historyState = _getHistoryStateAndUr2[0], url = _getHistoryStateAndUr2[1];
      globalHistory.replaceState(historyState, "", url);
      applyTx(nextAction);
    }
  }
  function go(delta) {
    globalHistory.go(delta);
  }
  var history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);
      if (blockers.length === 1) {
        window2.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }
      return function() {
        unblock();
        if (!blockers.length) {
          window2.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
  }
  var _options2 = options, _options2$window = _options2.window, window2 = _options2$window === void 0 ? document.defaultView : _options2$window;
  var globalHistory = window2.history;
  function getIndexAndLocation() {
    var _parsePath = parsePath(window2.location.hash.substr(1)), _parsePath$pathname = _parsePath.pathname, pathname = _parsePath$pathname === void 0 ? "/" : _parsePath$pathname, _parsePath$search = _parsePath.search, search = _parsePath$search === void 0 ? "" : _parsePath$search, _parsePath$hash = _parsePath.hash, hash = _parsePath$hash === void 0 ? "" : _parsePath$hash;
    var state = globalHistory.state || {};
    return [state.idx, readOnly({
      pathname,
      search,
      hash,
      state: state.usr || null,
      key: state.key || "default"
    })];
  }
  var blockedPopTx = null;
  function handlePop() {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      var nextAction = Action.Pop;
      var _getIndexAndLocation4 = getIndexAndLocation(), nextIndex = _getIndexAndLocation4[0], nextLocation = _getIndexAndLocation4[1];
      if (blockers.length) {
        if (nextIndex != null) {
          var delta = index - nextIndex;
          if (delta) {
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry: function retry() {
                go(delta * -1);
              }
            };
            go(delta);
          }
        } else {
          true ? warning(false, "You are trying to block a POP navigation to a location that was not created by the history library. The block will fail silently in production, but in general you should do all navigation with the history library (instead of using window.history.pushState directly) to avoid this situation.") : void 0;
        }
      } else {
        applyTx(nextAction);
      }
    }
  }
  window2.addEventListener(PopStateEventType, handlePop);
  window2.addEventListener(HashChangeEventType, function() {
    var _getIndexAndLocation5 = getIndexAndLocation(), nextLocation = _getIndexAndLocation5[1];
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });
  var action = Action.Pop;
  var _getIndexAndLocation6 = getIndexAndLocation(), index = _getIndexAndLocation6[0], location = _getIndexAndLocation6[1];
  var listeners = createEvents();
  var blockers = createEvents();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getBaseHref() {
    var base = document.querySelector("base");
    var href = "";
    if (base && base.getAttribute("href")) {
      var url = window2.location.href;
      var hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href;
  }
  function createHref(to) {
    return getBaseHref() + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function getNextLocation(to, state) {
    if (state === void 0) {
      state = null;
    }
    return readOnly(_extends({
      pathname: location.pathname,
      hash: "",
      search: ""
    }, typeof to === "string" ? parsePath(to) : to, {
      state,
      key: createKey()
    }));
  }
  function getHistoryStateAndUrl(nextLocation, index2) {
    return [{
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index2
    }, createHref(nextLocation)];
  }
  function allowTx(action2, location2, retry) {
    return !blockers.length || (blockers.call({
      action: action2,
      location: location2,
      retry
    }), false);
  }
  function applyTx(nextAction) {
    action = nextAction;
    var _getIndexAndLocation7 = getIndexAndLocation();
    index = _getIndexAndLocation7[0];
    location = _getIndexAndLocation7[1];
    listeners.call({
      action,
      location
    });
  }
  function push(to, state) {
    var nextAction = Action.Push;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }
    true ? warning(nextLocation.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")") : void 0;
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr3 = getHistoryStateAndUrl(nextLocation, index + 1), historyState = _getHistoryStateAndUr3[0], url = _getHistoryStateAndUr3[1];
      try {
        globalHistory.pushState(historyState, "", url);
      } catch (error2) {
        window2.location.assign(url);
      }
      applyTx(nextAction);
    }
  }
  function replace(to, state) {
    var nextAction = Action.Replace;
    var nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }
    true ? warning(nextLocation.pathname.charAt(0) === "/", "Relative pathnames are not supported in hash history.replace(" + JSON.stringify(to) + ")") : void 0;
    if (allowTx(nextAction, nextLocation, retry)) {
      var _getHistoryStateAndUr4 = getHistoryStateAndUrl(nextLocation, index), historyState = _getHistoryStateAndUr4[0], url = _getHistoryStateAndUr4[1];
      globalHistory.replaceState(historyState, "", url);
      applyTx(nextAction);
    }
  }
  function go(delta) {
    globalHistory.go(delta);
  }
  var history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back: function back() {
      go(-1);
    },
    forward: function forward() {
      go(1);
    },
    listen: function listen(listener) {
      return listeners.push(listener);
    },
    block: function block(blocker) {
      var unblock = blockers.push(blocker);
      if (blockers.length === 1) {
        window2.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }
      return function() {
        unblock();
        if (!blockers.length) {
          window2.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };
  return history;
}
function promptBeforeUnload(event) {
  event.preventDefault();
  event.returnValue = "";
}
function createEvents() {
  var handlers = [];
  return {
    get length() {
      return handlers.length;
    },
    push: function push(fn) {
      handlers.push(fn);
      return function() {
        handlers = handlers.filter(function(handler) {
          return handler !== fn;
        });
      };
    },
    call: function call(arg) {
      handlers.forEach(function(fn) {
        return fn && fn(arg);
      });
    }
  };
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function createPath(_ref) {
  var _ref$pathname = _ref.pathname, pathname = _ref$pathname === void 0 ? "/" : _ref$pathname, _ref$search = _ref.search, search = _ref$search === void 0 ? "" : _ref$search, _ref$hash = _ref.hash, hash = _ref$hash === void 0 ? "" : _ref$hash;
  if (search && search !== "?")
    pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#")
    pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  var parsedPath = {};
  if (path) {
    var hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    var searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}

// src/context/LocationContext.tsx
import { createContext } from "react";
var LocationContext = createContext({});
var LocationProvider = (props) => {
  return /* @__PURE__ */ React.createElement(LocationContext.Provider, {
    ...props
  });
};

// src/context/NavigationContext.tsx
import { createContext as createContext2 } from "react";
var NavigationContext = createContext2({});
var NavigationProvider = (props) => {
  return /* @__PURE__ */ React.createElement(NavigationContext.Provider, {
    ...props
  });
};

// src/hooks/useWatch.ts
import { useEffect as useEffect2, useRef, useState as useState2 } from "react";

// src/utils/component.ts
var isClassComponent = (component) => {
  return !!Object.getPrototypeOf(component)?.isReactComponent;
};
var importRegexp = /import\s?\(/;
var isLazyComponent = (component) => {
  if (isClassComponent(component)) {
    return false;
  }
  const str = String(component).trim();
  return str.startsWith("(") && str.includes("=>") && importRegexp.test(str);
};
var loadLazyComponent = async (component) => {
  const res = await component();
  if (res && isESModule(res)) {
    return res.default;
  }
  return res;
};
var isESModule = (obj) => {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
};
var hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";

// src/utils/constants.ts
var PAGE_KEY = "_pageKey";

// src/utils/uid.ts
var IDX = 36;
var HEX = "";
while (IDX--)
  HEX += IDX.toString(36);
function uid(len) {
  let str = "", num = len || 11;
  while (num--)
    str += HEX[Math.random() * 36 | 0];
  return str;
}

// src/utils/url.ts
var containBasename = (basename, pathname) => {
  return pathname.toLowerCase().startsWith(basename.toLowerCase());
};
var stripBasename = (basename, pathname) => {
  if (basename === "/")
    return pathname;
  if (!containBasename(basename, pathname)) {
    return null;
  }
  return pathname.slice(basename.length) || "/";
};
var joinPaths = (...paths) => {
  return paths.join("/").replace(/\/\/+/g, "/");
};
var normalizePath = (pathname) => {
  return pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
};
var parseParams = (url) => {
  const result = {};
  if (!url) {
    return result;
  }
  const { search } = parsePath(url);
  const searchParams = new URLSearchParams(search);
  for (const [key, value] of searchParams.entries()) {
    result[key] = value;
  }
  return result;
};
var stringifyParams = (params) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value);
  }
  return searchParams.toString();
};
var getPageKey = ({ search }) => {
  if (!search) {
    return void 0;
  }
  const params = parseParams(search);
  const pageKey = params[PAGE_KEY];
  return typeof pageKey === "string" ? pageKey : void 0;
};
var setPageKey = (location) => {
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

// src/utils/diagnosis.ts
function log(method, cond, message) {
  if (cond) {
    if (typeof console !== "undefined")
      console[method](message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function warning2(cond, message) {
  log("warn", cond, message);
}
function error(cond, message) {
  log("error", cond, message);
}

// src/core/route.ts
var isTabRoute = (route) => {
  return route.type === "tab";
};
var isPageRoute = (route) => {
  return route.type === void 0 || route.type === "page";
};
var isSameRoute = (route1, route2) => {
  return route1.name === route2.name || route1.path === route2.path;
};
var matchRoute = (routes, nameOrPath) => {
  let route;
  if (nameOrPath) {
    route = routes.find(({ name, path }) => name === nameOrPath || path === nameOrPath);
  }
  warning2(!route, `Can not find the route when name or path is  \`${nameOrPath}\` `);
  return route;
};

// src/core/history.ts
var ProHistory = class {
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
    this.routeRecordMap = /* @__PURE__ */ new Map();
    this.blockerMap = /* @__PURE__ */ new Map();
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
    return this.routes.find((item) => item.index) || this.routes[0];
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
    } else {
      routeRecord = {
        ...route,
        component
      };
    }
    this.routeRecordMap.set(path, routeRecord);
    return routeRecord;
  }
  initSubscriber() {
    const unlistener = this.history.listen(async (options) => {
      const {
        location: { pathname, state }
      } = options;
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
      this.listeners.forEach((listen) => {
        listen(proOptions);
      });
    });
    this.unlisteners.push(unlistener);
  }
  initWatcher() {
    this.listen(({ route, location }) => {
      const url = createPath(location);
      const pageKey = getPageKey(location);
      if (pageKey) {
        const stackRoute = {
          pageKey,
          url,
          ...route
        };
        if (isTabRoute(route)) {
          this.stack.switchTab(stackRoute);
        } else {
          this.stack.jumpPage(stackRoute);
        }
      } else {
        this.history.replace(setPageKey(location));
      }
    });
  }
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
    if (typeof to === "string") {
      path = parsePath(to);
    } else if ("pathname" in to) {
      path = to;
    } else if ("name" in to) {
      const route = matchRoute(this.routes, to.name);
      path = route ? {
        pathname: route.path
      } : void 0;
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
    return void 0;
  }
  destroy() {
    this.unlisteners.forEach((item) => item());
  }
};

// src/hooks/useStack.ts
import { useMemo } from "react";

// src/utils/function.ts
var timer;
var debounce = (fn, wait) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = setTimeout(fn, wait);
};

// src/core/stack.ts
var createReactiveArray = (scheduler) => {
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
var Stack = class {
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
    return this.tabs.some((tab) => isSameRoute(tab, item));
  }
  findPageIndex(item) {
    if (!item.pageKey) {
      return -1;
    }
    return this.pages.findIndex((page) => page.pageKey === item.pageKey);
  }
  getLastItem(delta) {
    return this.items[this.items.length - delta - 1];
  }
  switchTab(item) {
    if (this.containsTab(item)) {
      this.tabs.sort((tab) => isSameRoute(tab, item) ? -1 : 0);
    } else {
      this.tabs.push({ ...item });
    }
    this.clear();
  }
  jumpPage(item) {
    const pageIndex = this.findPageIndex(item);
    if (pageIndex > -1) {
      this.pages.splice(pageIndex + 1, this.pages.length - pageIndex - 1);
    } else {
      this.pages.push({ ...item });
    }
  }
  pop() {
    this.pages.pop();
  }
  clear() {
    this.pages.splice(0, this.pages.length);
  }
};

// src/hooks/useForceUpdate.ts
import { useCallback, useState } from "react";
var useForceUpdate = () => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};

// src/hooks/useStack.ts
var useStack = () => {
  const scheduler = useForceUpdate();
  return useMemo(() => new Stack(scheduler), []);
};

// src/hooks/useUnmount.ts
import { useEffect } from "react";
var useUnmount = (cb) => {
  useEffect(() => {
    return cb;
  }, []);
};

// src/hooks/useWatch.ts
var useWatch = ({ basename, history, routes }) => {
  const stack = useStack();
  const ref = useRef();
  if (!ref.current) {
    ref.current = new ProHistory({ basename, history, routes, stack });
  }
  const proHistory = ref.current;
  const [location, setLocation] = useState2(history.location);
  useEffect2(() => {
    proHistory.listen(function c({ location: location2 }) {
      setLocation(location2);
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

// src/core/RouterPage.tsx
var hideStyle = {
  display: "none"
};
var RouterPage = ({ status, children }) => {
  return /* @__PURE__ */ React.createElement("div", {
    children,
    style: status === "hide" ? hideStyle : void 0
  });
};
var RouterPage_default = RouterPage;

// src/core/Router.tsx
var renderRoutes = (routes) => {
  return routes.map(({ pageKey, component: RouteComponent }, index) => {
    const status = index === routes.length - 1 ? "show" : "hide";
    return /* @__PURE__ */ React.createElement(RouterPage_default, {
      key: pageKey,
      status
    }, /* @__PURE__ */ React.createElement(RouteComponent, null));
  });
};
var Router = ({ basename = "/", history, routes }) => {
  const {
    matches,
    location,
    history: proHistory
  } = useWatch({ basename, history, routes });
  const children = renderRoutes(matches);
  return /* @__PURE__ */ React.createElement(NavigationProvider, {
    value: { navigator: proHistory }
  }, /* @__PURE__ */ React.createElement(LocationProvider, {
    children,
    value: { location }
  }));
};
var BrowserRouter = ({ basename, routes }) => {
  const history = useMemo2(() => createBrowserHistory({ window }), []);
  return /* @__PURE__ */ React.createElement(Router, {
    basename,
    history,
    routes
  });
};
var HashRouter = ({ basename, routes }) => {
  const history = useMemo2(() => createHashHistory({ window }), []);
  return /* @__PURE__ */ React.createElement(Router, {
    basename,
    history,
    routes
  });
};

// src/hooks/useNavigation.ts
import { useContext } from "react";
var useNavigation = () => {
  return useContext(NavigationContext);
};

// src/utils/event.ts
var isModifiedEvent = (event) => {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

// src/core/navigate.ts
var navigate = async (options) => {
  return new Promise((resolve, reject) => {
    const { navigator, type } = options;
    const unListen = navigator.listen(() => {
      resolve();
      unListen();
    });
    try {
      if (type === "navigateBack") {
        const { delta } = options;
        navigator.back(delta);
      } else {
        const { name, url } = options;
        const to = name ? { name } : url;
        if (!to) {
          return;
        }
        if (type === "navigateTo" || type === "switchTab") {
          navigator.push(to, ({ route }) => {
            if (type === "navigateTo" && isTabRoute(route)) {
              error(true, `Use \`switchTo\` instead of \`navigateTo\` to switch the tabbar page\uFF1A${route.path}`);
              return false;
            }
          });
        } else if (type === "redirectTo") {
          navigator.replace(to);
        } else if (type === "reLaunch") {
          navigator.reset();
          navigator.push(to);
        }
      }
    } catch (error2) {
      reject(`${type}:fail ${error2.message || error2}`);
    }
  });
};

// src/core/Navigator.tsx
var Navigator = ({
  className,
  style,
  children,
  title = children,
  onClick,
  ...navigateOptions
}) => {
  const { navigator } = useNavigation();
  let href;
  if (navigateOptions.type !== "navigateBack") {
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
        type: "navigateTo",
        ...navigateOptions
      });
    }
  };
  return /* @__PURE__ */ React.createElement("a", {
    className,
    style,
    target: "_self",
    onClick: handleNavigate
  }, title);
};

// src/hooks/useRouter.ts
import { useRef as useRef2 } from "react";
var useRouter = () => {
  const ref = useRef2();
  const { navigator } = useNavigation();
  if (!ref.current) {
    ref.current = {
      navigateTo: (options) => {
        return navigate({ navigator, type: "navigateTo", ...options });
      },
      redirectTo: (options) => {
        return navigate({ navigator, type: "redirectTo", ...options });
      },
      switchTab: (options) => {
        return navigate({ navigator, type: "switchTab", ...options });
      },
      navigateBack: (options) => {
        return navigate({ navigator, type: "navigateBack", ...options });
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

// src/hooks/useLocation.ts
import { useContext as useContext2 } from "react";
var useLocation = () => {
  return useContext2(LocationContext);
};
export {
  BrowserRouter,
  HashRouter,
  Navigator,
  isPageRoute,
  isSameRoute,
  isTabRoute,
  matchRoute,
  useLocation,
  useRouter
};
//# sourceMappingURL=react-mobile-router.js.map
