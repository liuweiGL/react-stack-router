var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { createContext, useCallback, useState, useMemo, useEffect, useRef, useContext } from "react";
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
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
var readOnly = function(obj) {
  return obj;
};
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
const LocationContext = createContext({});
const LocationProvider = (props) => {
  return /* @__PURE__ */ React.createElement(LocationContext.Provider, __spreadValues({}, props));
};
const NavigationContext = createContext({});
const NavigationProvider = (props) => {
  return /* @__PURE__ */ React.createElement(NavigationContext.Provider, __spreadValues({}, props));
};
const isClassComponent = (component) => {
  var _a;
  return !!((_a = Object.getPrototypeOf(component)) == null ? void 0 : _a.isReactComponent);
};
const importRegexp = /import\s?\(/;
const isLazyComponent = (component) => {
  if (isClassComponent(component)) {
    return false;
  }
  const str = String(component).trim();
  return str.startsWith("(") && str.includes("=>") && importRegexp.test(str);
};
const loadLazyComponent = async (component) => {
  const res = await component();
  if (res && isESModule(res)) {
    return res.default;
  }
  return res;
};
const isESModule = (obj) => {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
};
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const PAGE_KEY = "_pageKey";
let IDX = 36, HEX = "";
while (IDX--)
  HEX += IDX.toString(36);
function uid(len) {
  let str = "", num = len || 11;
  while (num--)
    str += HEX[Math.random() * 36 | 0];
  return str;
}
const containBasename = (basename, pathname) => {
  return pathname.toLowerCase().startsWith(basename.toLowerCase());
};
const stripBasename = (basename, pathname) => {
  if (basename === "/")
    return pathname;
  if (!containBasename(basename, pathname)) {
    return null;
  }
  return pathname.slice(basename.length) || "/";
};
const joinPaths = (...paths) => {
  return paths.join("/").replace(/\/\/+/g, "/");
};
const normalizePath = (pathname) => {
  return pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
};
const parseParams = (url) => {
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
const stringifyParams = (params) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    searchParams.append(key, value);
  }
  return searchParams.toString();
};
const getPageKey = ({ search }) => {
  if (!search) {
    return void 0;
  }
  const params = parseParams(search);
  const pageKey = params[PAGE_KEY];
  return typeof pageKey === "string" ? pageKey : void 0;
};
const setPageKey = (location) => {
  const params = parseParams(location.search);
  const search = stringifyParams(__spreadProps(__spreadValues({}, params), {
    [PAGE_KEY]: uid()
  }));
  return __spreadProps(__spreadValues({}, location), {
    search
  });
};
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
function warning(cond, message) {
  log("warn", cond, message);
}
function error(cond, message) {
  log("error", cond, message);
}
const isTabRoute = (route) => {
  return route.type === "tab";
};
const isPageRoute = (route) => {
  return route.type === void 0 || route.type === "page";
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
  constructor({ basename, history, routes, stack }) {
    __publicField(this, "basename");
    __publicField(this, "history");
    __publicField(this, "routes");
    __publicField(this, "stack");
    __publicField(this, "routeRecordMap");
    __publicField(this, "blockerMap");
    __publicField(this, "listeners", []);
    __publicField(this, "unlisteners", []);
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
      routeRecord = __spreadProps(__spreadValues({}, route), {
        component: resolvedComponent
      });
    } else {
      routeRecord = __spreadProps(__spreadValues({}, route), {
        component
      });
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
      const proOptions = __spreadProps(__spreadValues({}, options), {
        route
      });
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
        const stackRoute = __spreadValues({
          pageKey,
          url
        }, route);
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
    if (path == null ? void 0 : path.pathname) {
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
  constructor(scheduler) {
    __publicField(this, "tabs");
    __publicField(this, "pages");
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
      this.tabs.push(__spreadValues({}, item));
    }
    this.clear();
  }
  jumpPage(item) {
    const pageIndex = this.findPageIndex(item);
    if (pageIndex > -1) {
      this.pages.splice(pageIndex + 1, this.pages.length - pageIndex - 1);
    } else {
      this.pages.push(__spreadValues({}, item));
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
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};
const useStack = () => {
  const scheduler = useForceUpdate();
  return useMemo(() => new Stack(scheduler), []);
};
const useUnmount = (cb) => {
  useEffect(() => {
    return cb;
  }, []);
};
const useWatch = ({ basename, history, routes }) => {
  const stack = useStack();
  const ref = useRef();
  if (!ref.current) {
    ref.current = new ProHistory({ basename, history, routes, stack });
  }
  const proHistory = ref.current;
  const [location, setLocation] = useState(history.location);
  useEffect(() => {
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
const hideStyle = {
  display: "none"
};
const RouterPage = ({ status, children }) => {
  return /* @__PURE__ */ React.createElement("div", {
    children,
    style: status === "hide" ? hideStyle : void 0
  });
};
const renderRoutes = (routes) => {
  return routes.map(({ pageKey, component: RouteComponent }, index) => {
    const status = index === routes.length - 1 ? "show" : "hide";
    return /* @__PURE__ */ React.createElement(RouterPage, {
      key: pageKey,
      status
    }, /* @__PURE__ */ React.createElement(RouteComponent, null));
  });
};
const Router = ({ basename = "/", history, routes }) => {
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
const BrowserRouter = ({ basename, routes }) => {
  const history = useMemo(() => createBrowserHistory({ window }), []);
  return /* @__PURE__ */ React.createElement(Router, {
    basename,
    history,
    routes
  });
};
const HashRouter = ({ basename, routes }) => {
  const history = useMemo(() => createHashHistory({ window }), []);
  return /* @__PURE__ */ React.createElement(Router, {
    basename,
    history,
    routes
  });
};
const useNavigation = () => {
  return useContext(NavigationContext);
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
const Navigator = (_a) => {
  var _b = _a, {
    className,
    style,
    children,
    title = children,
    onClick
  } = _b, navigateOptions = __objRest(_b, [
    "className",
    "style",
    "children",
    "title",
    "onClick"
  ]);
  const { navigator } = useNavigation();
  if (navigateOptions.type !== "navigateBack") {
    const { name, url } = navigateOptions;
    const to = name ? { name } : url;
    if (to) {
      navigator.createHref(to);
    }
  }
  const handleNavigate = (event) => {
    const keepGoing = onClick == null ? void 0 : onClick(event);
    if (keepGoing === false) {
      event.preventDefault();
      return;
    }
    if (event.button === 0 && !isModifiedEvent(event)) {
      event.preventDefault();
      navigate(__spreadValues({
        navigator,
        type: "navigateTo"
      }, navigateOptions));
    }
  };
  return /* @__PURE__ */ React.createElement("a", {
    className,
    style,
    target: "_self",
    onClick: handleNavigate
  }, title);
};
const useRouter = () => {
  const ref = useRef();
  const { navigator } = useNavigation();
  if (!ref.current) {
    ref.current = {
      navigateTo: (options) => {
        return navigate(__spreadValues({ navigator, type: "navigateTo" }, options));
      },
      redirectTo: (options) => {
        return navigate(__spreadValues({ navigator, type: "redirectTo" }, options));
      },
      switchTab: (options) => {
        return navigate(__spreadValues({ navigator, type: "switchTab" }, options));
      },
      navigateBack: (options) => {
        return navigate(__spreadValues({ navigator, type: "navigateBack" }, options));
      }
    };
  }
  return __spreadProps(__spreadValues({}, ref.current), {
    currentRoute: navigator.currentRoute,
    getSnapshoot() {
      return navigator.stackSnapshoot;
    }
  });
};
const useLocation = () => {
  return useContext(LocationContext);
};
export { BrowserRouter, HashRouter, Navigator, isPageRoute, isSameRoute, isTabRoute, matchRoute, useLocation, useRouter };
//# sourceMappingURL=react-mobile-router.es.js.map
