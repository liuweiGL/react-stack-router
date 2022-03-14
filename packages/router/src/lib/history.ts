/**
 * Actions represent the type of change to a location value.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
 */
export enum Action {
  /**
   * A POP indicates a change to an arbitrary index in the history stack, such
   * as a back or forward navigation. It does not describe the direction of the
   * navigation, only that the current index changed.
   *
   * Note: This is the default action for newly created history objects.
   */
  Pop = 'POP',

  /**
   * A PUSH indicates a new entry being added to the history stack, such as when
   * a link is clicked and a new page loads. When this happens, all subsequent
   * entries in the stack are lost.
   */
  Push = 'PUSH',

  /**
   * A REPLACE indicates the entry at the current index in the history stack
   * being replaced by a new one.
   */
  Replace = 'REPLACE'
}

/**
 * A URL pathname, beginning with a /.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
 */
export type Pathname = string

/**
 * A URL search string, beginning with a ?.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
 */
export type Search = string

/**
 * A URL fragment identifier, beginning with a #.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
 */
export type Hash = string

/**
 * An object that is used to associate some arbitrary data with a location, but
 * that does not appear in the URL path.
 *
 * @deprecated
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.state
 */
export type State = unknown

/**
 * A unique string associated with a location. May be used to safely store
 * and retrieve data in some other storage API, like `localStorage`.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.key
 */
export type Key = string

/**
 * The pathname, search, and hash values of a URL.
 */
export interface Path {
  /**
   * A URL pathname, beginning with a /.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.pathname
   */
  pathname: Pathname

  /**
   * A URL search string, beginning with a ?.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.search
   */
  search: Search

  /**
   * A URL fragment identifier, beginning with a #.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.hash
   */
  hash: Hash
}

/**
 * An entry in a history stack. A location contains information about the
 * URL path, as well as possibly some arbitrary state and a key.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location
 */
export interface Location extends Path {
  /**
   * A value of arbitrary data associated with this location.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.state
   */
  state: unknown

  /**
   * A unique string associated with this location. May be used to safely store
   * and retrieve data in some other storage API, like `localStorage`.
   *
   * Note: This value is always "default" on the initial location.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#location.key
   */
  key: Key
}

/**
 * A partial Path object that may be missing some properties.
 *
 * @deprecated
 */
export type PartialPath = Partial<Path>

/**
 * A partial Location object that may be missing some properties.
 *
 * @deprecated
 */
export type PartialLocation = Partial<Location>

/**
 * A change to the current location.
 */
export interface Update {
  /**
   * The action that triggered the change.
   */
  action: Action

  /**
   * The new location.
   */
  location: Location
}

/**
 * A function that receives notifications about location changes.
 */
export interface Listener {
  (update: Update): void
}

/**
 * A change to the current location that was blocked. May be retried
 * after obtaining user confirmation.
 */
export interface Transition extends Update {
  /**
   * Retries the update to the current location.
   */
  retry(): void
}

/**
 * A function that receives transitions when navigation is blocked.
 */
export interface Blocker {
  (tx: Transition): void
}

/**
 * Describes a location that is the destination of some navigation, either via
 * `history.push` or `history.replace`. May be either a URL or the pieces of a
 * URL path.
 */
export type To = string | Partial<Path>

/**
 * A history is an interface to the navigation stack. The history serves as the
 * source of truth for the current location, as well as provides a set of
 * methods that may be used to change it.
 *
 * It is similar to the DOM's `window.history` object, but with a smaller, more
 * focused API.
 */
export interface History {
  /**
   * The last action that modified the current location. This will always be
   * Action.Pop when a history instance is first created. This value is mutable.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.action
   */
  readonly action: Action

  /**
   * The current location. This value is mutable.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.location
   */
  readonly location: Location

  /**
   * Returns a valid href for the given `to` value that may be used as
   * the value of an <a href> attribute.
   *
   * @param to - The destination URL
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.createHref
   */
  createHref(to: To): string

  /**
   * Pushes a new location onto the history stack, increasing its length by one.
   * If there were any entries in the stack after the current one, they are
   * lost.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.push
   */
  push(to: To, state?: any): void

  /**
   * Replaces the current location in the history stack with a new one.  The
   * location that was replaced will no longer be available.
   *
   * @param to - The new URL
   * @param state - Data to associate with the new location
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.replace
   */
  replace(to: To, state?: any): void

  /**
   * Navigates `n` entries backward/forward in the history stack relative to the
   * current index. For example, a "back" navigation would use go(-1).
   *
   * @param delta - The delta in the stack index
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.go
   */
  go(delta: number): void

  /**
   * Navigates to the previous entry in the stack. Identical to go(-1).
   *
   * Warning: if the current location is the first location in the stack, this
   * will unload the current document.
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.back
   */
  back(): void

  /**
   * Navigates to the next entry in the stack. Identical to go(1).
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.forward
   */
  forward(): void

  /**
   * Sets up a listener that will be called whenever the current location
   * changes.
   *
   * @param listener - A function that will be called when the location changes
   * @returns unlisten - A function that may be used to stop listening
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.listen
   */
  listen(listener: Listener): () => void

  /**
   * Prevents the current location from changing and sets up a listener that
   * will be called instead.
   *
   * @param blocker - A function that will be called when a transition is blocked
   * @returns unblock - A function that may be used to stop blocking
   *
   * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#history.block
   */
  block(blocker: Blocker): () => void
}

/**
 * A browser history stores the current location in regular URLs in a web
 * browser environment. This is the standard for most web apps and provides the
 * cleanest URLs the browser's address bar.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#browserhistory
 */
export interface BrowserHistory extends History {}

/**
 * A hash history stores the current location in the fragment identifier portion
 * of the URL in a web browser environment.
 *
 * This is ideal for apps that do not control the server for some reason
 * (because the fragment identifier is never sent to the server), including some
 * shared hosting environments that do not provide fine-grained controls over
 * which pages are served at which URLs.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#hashhistory
 */
export interface HashHistory extends History {}

const readOnly: <T>(obj: T) => Readonly<T> = obj => obj

type HistoryState = {
  usr: any
  key?: string
  idx: number
}

const HashChangeEventType = 'hashchange'
const PopStateEventType = 'popstate'

export type HashHistoryOptions = { window?: Window }

/**
 * Hash history stores the location in window.location.hash. This makes it ideal
 * for situations where you don't want to send the location to the server for
 * some reason, either because you do cannot configure it or the URL space is
 * reserved for something else.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
 */
export function createHashHistory(
  options: HashHistoryOptions = {}
): HashHistory {
  const { window = document.defaultView! } = options
  const globalHistory = window.history

  function getIndexAndLocation(): [number, Location] {
    const {
      pathname = '/',
      search = '',
      hash = ''
    } = parsePath(window.location.hash.substr(1))
    const state = globalHistory.state || {}
    return [
      state.idx,
      readOnly<Location>({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ]
  }

  function handlePop() {
    const nextAction = Action.Pop

    applyTx(nextAction)
  }

  window.addEventListener(PopStateEventType, handlePop)

  // popstate does not fire on hashchange in IE 11 and old (trident) Edge
  // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event
  window.addEventListener(HashChangeEventType, () => {
    const [, nextLocation] = getIndexAndLocation()

    // Ignore extraneous hashchange events.
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop()
    }
  })

  let action = Action.Pop
  let [index, location] = getIndexAndLocation()
  const listeners = createEvents<Listener>()

  if (index == null) {
    index = 0
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '')
  }

  function getBaseHref() {
    const base = document.querySelector('base')
    let href = ''

    if (base && base.getAttribute('href')) {
      const url = window.location.href
      const hashIndex = url.indexOf('#')
      href = hashIndex === -1 ? url : url.slice(0, hashIndex)
    }

    return href
  }

  function createHref(to: To) {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to))
  }

  function getNextLocation(to: To, state: any = null): Location {
    return readOnly<Location>({
      pathname: location.pathname,
      hash: '',
      search: '',
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    })
  }

  function getHistoryStateAndUrl(
    nextLocation: Location,
    index: number
  ): [HistoryState, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ]
  }

  function applyTx(nextAction: Action) {
    action = nextAction
    ;[index, location] = getIndexAndLocation()
    listeners.call({ action, location })
  }

  function push(to: To, state?: any) {
    const nextAction = Action.Push
    const nextLocation = getNextLocation(to, state)

    const [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1)

    try {
      globalHistory.pushState(historyState, '', url)
    } catch (error) {
      window.location.assign(url)
    }

    applyTx(nextAction)
  }

  function replace(to: To, state?: any) {
    const nextAction = Action.Replace
    const nextLocation = getNextLocation(to, state)

    const [historyState, url] = getHistoryStateAndUrl(nextLocation, index)

    // TODO: Support forced reloading
    globalHistory.replaceState(historyState, '', url)

    applyTx(nextAction)
  }

  function go(delta: number) {
    globalHistory.go(delta)
  }

  const history: HashHistory = {
    get action() {
      return action
    },
    get location() {
      return location
    },
    createHref,
    push,
    replace,
    go,
    back() {
      go(-1)
    },
    forward() {
      go(1)
    },
    listen(listener) {
      console.log(listener)
      return listeners.push(listener)
    },
    block(blocker) {
      return () => {
        //
      }
    }
  }

  return history
}

////////////////////////////////////////////////////////////////////////////////
// MEMORY
////////////////////////////////////////////////////////////////////////////////

/**
 * A user-supplied object that describes a location. Used when providing
 * entries to `createMemoryHistory` via its `initialEntries` option.
 */
export type InitialEntry = string | Partial<Location>

export type MemoryHistoryOptions = {
  initialEntries?: InitialEntry[]
  initialIndex?: number
}

type Events<F> = {
  length: number
  push: (fn: F) => () => void
  call: (arg: any) => void
}

function createEvents<F extends Function>(): Events<F> {
  let handlers: F[] = []

  return {
    get length() {
      return handlers.length
    },
    push(fn: F) {
      handlers.push(fn)
      console.log(handlers.map(item => item.name).toString(), handlers)
      return function () {
        handlers = handlers.filter(handler => handler !== fn)
      }
    },
    call(arg) {
      handlers.forEach(fn => fn && fn(arg))
    }
  }
}

function createKey() {
  return Math.random().toString(36).substr(2, 8)
}

/**
 * Creates a string URL path from the given pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createpath
 */
export function createPath({
  pathname = '/',
  search = '',
  hash = ''
}: Partial<Path>) {
  if (search && search !== '?')
    pathname += search.charAt(0) === '?' ? search : '?' + search
  if (hash && hash !== '#')
    pathname += hash.charAt(0) === '#' ? hash : '#' + hash
  return pathname
}

/**
 * Parses a string URL path into its separate pathname, search, and hash components.
 *
 * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#parsepath
 */
export function parsePath(path: string): Partial<Path> {
  const parsedPath: Partial<Path> = {}

  if (path) {
    const hashIndex = path.indexOf('#')
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex)
      path = path.substr(0, hashIndex)
    }

    const searchIndex = path.indexOf('?')
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex)
      path = path.substr(0, searchIndex)
    }

    if (path) {
      parsedPath.pathname = path
    }
  }

  return parsedPath
}
