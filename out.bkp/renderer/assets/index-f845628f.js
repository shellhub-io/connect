function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn$1 = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject$1(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction((str) => {
  const s = str ? `on${capitalize(str)}` : ``;
  return s;
});
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
const toNumber = (val) => {
  const n = isString(val) ? Number(val) : NaN;
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v;
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this.effects = [];
    this.cleanups = [];
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    activeEffectScope = this;
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this._active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
      this._active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    const newLength = Number(newValue);
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || !isSymbol(key2) && key2 >= newLength) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray$1(dep) ? dep : [...dep];
  for (const effect2 of effects) {
    if (effect2.computed) {
      triggerEffect(effect2);
    }
  }
  for (const effect2 of effects) {
    if (!effect2.computed) {
      triggerEffect(effect2);
    }
  }
}
function triggerEffect(effect2, debuggerEventExtraInfo) {
  if (effect2 !== activeEffect || effect2.allowRecurse) {
    if (effect2.scheduler) {
      effect2.scheduler();
    } else {
      effect2.run();
    }
  }
}
function getDepFromReactive(object, key) {
  var _a;
  return (_a = targetMap.get(object)) == null ? void 0 : _a.get(key);
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function hasOwnProperty(key) {
  const obj = toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _shallow = false) {
    this._isReadonly = _isReadonly;
    this._shallow = _shallow;
  }
  get(target, key, receiver) {
    const isReadonly2 = this._isReadonly, shallow = this._shallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the reciever is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2) {
      if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(shallow = false) {
    super(false, shallow);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!this._shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray$1(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(shallow = false) {
    super(true, shallow);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(
  true
);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (hasChanged(key, rawKey)) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return {
      // iterator protocol
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      // iterable protocol
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(
      method,
      false,
      false
    );
    readonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      false
    );
    shallowInstrumentations2[method] = createIterableMethod(
      method,
      false,
      true
    );
    shallowReadonlyInstrumentations2[method] = createIterableMethod(
      method,
      true,
      true
    );
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [
  mutableInstrumentations,
  readonlyInstrumentations,
  shallowInstrumentations,
  shallowReadonlyInstrumentations
] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  const dep = ref2.dep;
  if (dep) {
    {
      triggerEffects(dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  const ret = isArray$1(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = propertyToRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
  get dep() {
    return getDepFromReactive(toRaw(this._object), this._key);
  }
}
class GetterRefImpl {
  constructor(_getter) {
    this._getter = _getter;
    this.__v_isRef = true;
    this.__v_isReadonly = true;
  }
  get value() {
    return this._getter();
  }
}
function toRef(source, key, defaultValue) {
  if (isRef(source)) {
    return source;
  } else if (isFunction(source)) {
    return new GetterRefImpl(source);
  } else if (isObject$1(source) && arguments.length > 1) {
    return propertyToRef(source, key, defaultValue);
  } else {
    return ref(source);
  }
}
function propertyToRef(source, key, defaultValue) {
  const val = source[key];
  return isRef(val) ? val : new ObjectRefImpl(source, key, defaultValue);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this["__v_isReadonly"] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function warn(msg, ...args) {
  return;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(
        appErrorHandler,
        null,
        10,
        [err, exposedInstance, errorInfo]
      );
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.pre) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(
    job,
    isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex
  )) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray$1(cb)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(
      cb,
      cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex
    )) {
      pendingPostFlushCbs.push(cb);
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen2, i = isFlushing ? flushIndex + 1 : 0) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.pre) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      cb();
    }
  }
}
function flushPostFlushCbs(seen2) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a, b) => {
  const diff = getId(a) - getId(b);
  if (diff === 0) {
    if (a.pre && !b.pre)
      return -1;
    if (b.pre && !a.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen2) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn$1(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    props,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return attrs;
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          props,
          null
          /* we know it doesn't need it */
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys2 = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys2.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys2.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn$1(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(
        Component,
        false
        /* do not include inferred name to avoid breaking existing code */
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function watchEffect(effect, options) {
  return doWatch(effect, null, options);
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  var _a;
  const instance = getCurrentScope() === ((_a = currentInstance) == null ? void 0 : _a.scope) ? currentInstance : null;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(
          source,
          instance,
          3,
          [onCleanup]
        );
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
      cleanup = effect.onStop = void 0;
    };
  };
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else {
      return NOOP;
    }
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          // pass undefined as the old value when it's changed for the first time
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(
      effect.run.bind(effect),
      instance && instance.suspense
    );
  } else {
    effect.run();
  }
  const unwatch = () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
  if (ssrCleanup)
    ssrCleanup.push(unwatch);
  return unwatch;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen2) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen2 = seen2 || /* @__PURE__ */ new Set();
  if (seen2.has(value)) {
    return value;
  }
  seen2.add(value);
  if (isRef(value)) {
    traverse(value.value, seen2);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen2);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen2);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], seen2);
    }
  }
  return value;
}
function withDirectives(vnode, directives2) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives2.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives2[i];
    if (dir) {
      if (isFunction(dir)) {
        dir = {
          mounted: dir,
          updated: dir
        };
      }
      if (dir.deep) {
        traverse(value);
      }
      bindings.push({
        dir,
        instance,
        value,
        oldValue: void 0,
        arg,
        modifiers
      });
    }
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const leaveCbKey = Symbol("_leaveCb");
const enterCbKey$1 = Symbol("_enterCb");
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionPropsValidators = {
  mode: String,
  appear: Boolean,
  persisted: Boolean,
  // enter
  onBeforeEnter: TransitionHookValidator,
  onEnter: TransitionHookValidator,
  onAfterEnter: TransitionHookValidator,
  onEnterCancelled: TransitionHookValidator,
  // leave
  onBeforeLeave: TransitionHookValidator,
  onLeave: TransitionHookValidator,
  onAfterLeave: TransitionHookValidator,
  onLeaveCancelled: TransitionHookValidator,
  // appear
  onBeforeAppear: TransitionHookValidator,
  onAppear: TransitionHookValidator,
  onAfterAppear: TransitionHookValidator,
  onAppearCancelled: TransitionHookValidator
};
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: BaseTransitionPropsValidators,
  setup(props, { slots }) {
    const instance = getCurrentInstance$1();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c of children) {
          if (c.type !== Comment) {
            child = c;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(
        innerChild,
        rawProps,
        state,
        instance
      );
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(
          oldInnerChild,
          rawProps,
          state,
          instance
        );
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            if (instance.update.active !== false) {
              instance.update();
            }
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(
              state,
              oldInnerChild
            );
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el[leaveCbKey] = () => {
              earlyRemove();
              el[leaveCbKey] = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const {
    appear,
    mode,
    persisted = false,
    onBeforeEnter,
    onEnter,
    onAfterEnter,
    onEnterCancelled,
    onBeforeLeave,
    onLeave,
    onAfterLeave,
    onLeaveCancelled,
    onBeforeAppear,
    onAppear,
    onAfterAppear,
    onAppearCancelled
  } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(
      hook,
      instance,
      9,
      args
    );
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray$1(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el[leaveCbKey]) {
        el[leaveCbKey](
          true
          /* cancelled */
        );
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el[leaveCbKey]) {
        leavingVNode.el[leaveCbKey]();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el[enterCbKey$1] = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el[enterCbKey$1] = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el[enterCbKey$1]) {
        el[enterCbKey$1](
          true
          /* cancelled */
        );
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el[leaveCbKey] = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el[leaveCbKey] = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? (
    // #7121 ensure get the child component subtree in case
    // it's been replaced during HMR
    vnode.children ? vnode.children[0] : void 0
  ) : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(
        getTransitionRawChildren(child.children, keepComment, key)
      );
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
/*! #__NO_SIDE_EFFECTS__ */
// @__NO_SIDE_EFFECTS__
function defineComponent$1(options, extraOptions) {
  return isFunction(options) ? (
    // #8326: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (
  // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
  (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook(
  "rtg"
);
const onRenderTracked = createHook(
  "rtc"
);
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
      ) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, propsOptions }
  }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray$1(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted: mounted2,
    beforeUpdate,
    updated: updated2,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted: unmounted2,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components: components2,
    directives: directives2,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted2);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated2);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted2);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components2)
    instance.components = components2;
  if (directives2)
    instance.directives = directives2;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject$1(
          opt.from || key,
          opt.default,
          true
          /* treat default function as factory */
        );
      } else {
        injected = inject$1(opt.from || key);
      }
    } else {
      injected = inject$1(opt);
    }
    if (isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions$1(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions$1(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray$1(to) && isArray$1(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version: version$1,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive2) {
        if (!directive2) {
          return context.directives[name];
        }
        context.directives[name] = directive2;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      },
      runWithContext(fn) {
        currentApp = app2;
        try {
          return fn();
        } finally {
          currentApp = null;
        }
      }
    };
    return app2;
  };
}
let currentApp = null;
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject$1(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance || currentApp) {
    const provides = instance ? instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : currentApp._context.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else
      ;
  }
}
function hasInjectionContext() {
  return !!(currentInstance || currentRenderingInstance || currentApp);
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
              /* isAbsent */
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
              /* isAbsent */
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys2] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys2)
        needCastKeys.push(...keys2);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[
            0
            /* shouldCast */
          ] = booleanIndex > -1;
          prop[
            1
            /* shouldCastTrue */
          ] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
  return match ? match[2] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false)
      ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(
        children,
        instance.slots = {}
      );
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized,
            internals
          );
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      isSVG,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      patchElement(
        n1,
        n2,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      isSVG,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        isSVG && type !== "foreignObject",
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(
            el,
            key,
            null,
            props[key],
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        areChildrenSVG,
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(
          el,
          n2,
          oldProps,
          newProps,
          parentComponent,
          parentSuspense,
          isSVG
        );
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(
                el,
                key,
                prev,
                next,
                isSVG,
                n1.children,
                parentComponent,
                parentSuspense,
                unmountChildren
              );
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(
        el,
        n2,
        oldProps,
        newProps,
        parentComponent,
        parentSuspense,
        isSVG
      );
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              isSVG,
              vnode.children,
              parentComponent,
              parentSuspense,
              unmountChildren
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(
            el,
            key,
            prev,
            next,
            isSVG,
            vnode.children,
            parentComponent,
            parentSuspense,
            unmountChildren
          );
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        n2.children,
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          isSVG,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(
      instance,
      initialVNode,
      container,
      anchor,
      parentSuspense,
      isSVG,
      optimized
    );
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(
              el,
              instance.subTree,
              instance,
              parentSuspense,
              null
            );
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              // note: we are moving the render call into an async callback,
              // which means it won't track dependencies - but it's ok because
              // a server-rendered async wrapper is already in resolved state
              // and it will never need to change.
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            isSVG
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
      // track it in component's effect scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref2,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs
    } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          optimized,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(
      internals
    );
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target = select(targetSelector);
      return target;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  name: "Teleport",
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const {
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      o: { insert, querySelector, createText, createComment }
    } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target) {
        insert(targetAnchor, target);
        isSVG = isSVG || isTargetSVG(target);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(
            children,
            container2,
            anchor2,
            parentComponent,
            parentSuspense,
            isSVG,
            slotScopeIds,
            optimized
          );
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target) {
        mount(target, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target);
      if (dynamicChildren) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          currentContainer,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds
        );
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(
          n1,
          n2,
          currentContainer,
          currentAnchor,
          parentComponent,
          parentSuspense,
          isSVG,
          slotScopeIds,
          false
        );
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(
            n2,
            container,
            mainAnchor,
            internals,
            1
          );
        } else {
          if (n2.props && n1.props && n2.props.to !== n1.props.to) {
            n2.props.to = n1.props.to;
          }
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(
            n2.props,
            querySelector
          );
          if (nextTarget) {
            moveTeleport(
              n2,
              nextTarget,
              null,
              internals,
              0
            );
          }
        } else if (wasDisabled) {
          moveTeleport(
            n2,
            target,
            targetAnchor,
            internals,
            1
          );
        }
      }
    }
    updateCssVars(n2);
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
    if (target) {
      hostRemove(targetAnchor);
    }
    doRemove && hostRemove(anchor);
    if (shapeFlag & 16) {
      const shouldRemove = doRemove || !isTeleportDisabled(props);
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        unmount(
          child,
          parentComponent,
          parentSuspense,
          shouldRemove,
          !!child.dynamicChildren
        );
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(
          children[i],
          container,
          parentAnchor,
          2
        );
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, {
  o: { nextSibling, parentNode, querySelector }
}, hydrateChildren) {
  const target = vnode.target = resolveTarget(
    vnode.props,
    querySelector
  );
  if (target) {
    const targetNode = target._lpa || target.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(
          nextSibling(node),
          vnode,
          parentNode(node),
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node);
        let targetAnchor = targetNode;
        while (targetAnchor) {
          targetAnchor = nextSibling(targetAnchor);
          if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
            vnode.targetAnchor = targetAnchor;
            target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
            break;
          }
        }
        hydrateChildren(
          targetNode,
          vnode,
          target,
          parentComponent,
          parentSuspense,
          slotScopeIds,
          optimized
        );
      }
    }
    updateCssVars(vnode);
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
function updateCssVars(vnode) {
  const ctx = vnode.ctx;
  if (ctx && ctx.ut) {
    let node = vnode.children[0].el;
    while (node && node !== vnode.targetAnchor) {
      if (node.nodeType === 1)
        node.setAttribute("data-v-owner", ctx.uid);
      node = node.nextSibling;
    }
    ctx.ut();
  }
}
const Fragment = Symbol.for("v-fgt");
const Text = Symbol.for("v-txt");
const Comment = Symbol.for("v-cmt");
const Static = Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
      /* isBlock */
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
      /* isBlock: prevent a block from tracking itself */
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref2,
  ref_key,
  ref_for
}) => {
  if (typeof ref2 === "number") {
    ref2 = "" + ref2;
  }
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref2 ? isArray$1(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn$1(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    attrsProxy: null,
    slotsProxy: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance$1 = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let globalCurrentInstanceSetters;
let settersKey = "__VUE_INSTANCE_SETTERS__";
{
  if (!(globalCurrentInstanceSetters = getGlobalThis()[settersKey])) {
    globalCurrentInstanceSetters = getGlobalThis()[settersKey] = [];
  }
  globalCurrentInstanceSetters.push((i) => currentInstance = i);
  internalSetCurrentInstance = (instance) => {
    if (globalCurrentInstanceSetters.length > 1) {
      globalCurrentInstanceSetters.forEach((s) => s(instance));
    } else {
      globalCurrentInstanceSetters[0](instance);
    }
  };
}
const setCurrentInstance = (instance) => {
  internalSetCurrentInstance(instance);
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [instance.props, setupContext]
    );
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template || resolveMergedOptions(instance).template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(
          extend(
            {
              isCustomElement,
              delimiters
            },
            compilerOptions
          ),
          componentCompilerOptions
        );
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      unsetCurrentInstance();
    }
  }
}
function getAttrsProxy(instance) {
  return instance.attrsProxy || (instance.attrsProxy = new Proxy(
    instance.attrs,
    {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    }
  ));
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      get attrs() {
        return getAttrsProxy(instance);
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const ssrContextKey = Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject$1(ssrContextKey);
    return ctx;
  }
};
const version$1 = "3.3.11";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const TRANSITION = "transition";
const ANIMATION = "animation";
const vtcKey = Symbol("_vtc");
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend(
  {},
  BaseTransitionPropsValidators,
  DOMTransitionPropsValidators
);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const {
    name = "v",
    type,
    duration,
    enterFromClass = `${name}-enter-from`,
    enterActiveClass = `${name}-enter-active`,
    enterToClass = `${name}-enter-to`,
    appearFromClass = enterFromClass,
    appearActiveClass = enterActiveClass,
    appearToClass = enterToClass,
    leaveFromClass = `${name}-leave-from`,
    leaveActiveClass = `${name}-leave-active`,
    leaveToClass = `${name}-leave-to`
  } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const {
    onBeforeEnter,
    onEnter,
    onEnterCancelled,
    onLeave,
    onLeaveCancelled,
    onBeforeAppear = onBeforeEnter,
    onAppear = onEnter,
    onAppearCancelled = onEnterCancelled
  } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.add(c));
  (el[vtcKey] || (el[vtcKey] = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c) => c && el.classList.remove(c));
  const _vtc = el[vtcKey];
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el[vtcKey] = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(`${TRANSITION}Delay`);
  const transitionDurations = getStyleProperties(`${TRANSITION}Duration`);
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(`${ANIMATION}Delay`);
  const animationDurations = getStyleProperties(`${ANIMATION}Duration`);
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(
    getStyleProperties(`${TRANSITION}Property`).toString()
  );
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  if (s === "auto")
    return 0;
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOldKey = Symbol("_vod");
const vShow = {
  beforeMount(el, { value }, { transition }) {
    el[vShowOldKey] = el.style.display === "none" ? "" : el.style.display;
    if (transition && value) {
      transition.beforeEnter(el);
    } else {
      setDisplay(el, value);
    }
  },
  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el);
    }
  },
  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el);
        setDisplay(el, true);
        transition.enter(el);
      } else {
        transition.leave(el, () => {
          setDisplay(el, false);
        });
      }
    } else {
      setDisplay(el, value);
    }
  },
  beforeUnmount(el, { value }) {
    setDisplay(el, value);
  }
};
function setDisplay(el, value) {
  el.style.display = value ? el[vShowOldKey] : "none";
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if (vShowOldKey in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    el._value = value;
    const oldValue = tag === "OPTION" ? el.getAttribute("value") : el.value;
    const newValue = value == null ? "" : value;
    if (oldValue !== newValue) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn$1(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(
      el,
      key,
      nextValue,
      prevChildren,
      parentComponent,
      parentSuspense,
      unmountChildren
    );
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
const positionMap = /* @__PURE__ */ new WeakMap();
const newPositionMap = /* @__PURE__ */ new WeakMap();
const moveCbKey = Symbol("_moveCb");
const enterCbKey = Symbol("_enterCb");
const TransitionGroupImpl = {
  name: "TransitionGroup",
  props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, { slots }) {
    const instance = getCurrentInstance$1();
    const state = useTransitionState();
    let prevChildren;
    let children;
    onUpdated(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(
        prevChildren[0].el,
        instance.vnode.el,
        moveClass
      )) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el = c.el;
        const style = el.style;
        addTransitionClass(el, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = "";
        const cb = el[moveCbKey] = (e) => {
          if (e && e.target !== el) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener("transitionend", cb);
            el[moveCbKey] = null;
            removeTransitionClass(el, moveClass);
          }
        };
        el.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = toRaw(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || Fragment;
      prevChildren = children;
      children = slots.default ? getTransitionRawChildren(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          setTransitionHooks(
            child,
            resolveTransitionHooks(child, cssTransitionProps, state, instance)
          );
        }
      }
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          setTransitionHooks(
            child,
            resolveTransitionHooks(child, cssTransitionProps, state, instance)
          );
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }
      return createVNode(tag, null, children);
    };
  }
};
const removeMode = (props) => delete props.mode;
/* @__PURE__ */ removeMode(TransitionGroupImpl.props);
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el = c.el;
  if (el[moveCbKey]) {
    el[moveCbKey]();
  }
  if (el[enterCbKey]) {
    el[enterCbKey]();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el, root, moveClass) {
  const clone = el.cloneNode();
  const _vtc = el[vtcKey];
  if (_vtc) {
    _vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone.classList.add(c));
  clone.style.display = "none";
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone);
  const { hasTransform } = getTransitionInfo(clone);
  container.removeChild(clone);
  return hasTransform;
}
const getModelAssigner = (vnode) => {
  const fn = vnode.props["onUpdate:modelValue"] || false;
  return isArray$1(fn) ? (value) => invokeArrayFns(fn, value) : fn;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target = e.target;
  if (target.composing) {
    target.composing = false;
    target.dispatchEvent(new Event("input"));
  }
}
const assignKey = Symbol("_assign");
const vModelText = {
  created(el, { modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    const castToNumber = number || vnode.props && vnode.props.type === "number";
    addEventListener(el, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el.value;
      if (trim) {
        domValue = domValue.trim();
      }
      if (castToNumber) {
        domValue = looseToNumber(domValue);
      }
      el[assignKey](domValue);
    });
    if (trim) {
      addEventListener(el, "change", () => {
        el.value = el.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el, "compositionstart", onCompositionStart);
      addEventListener(el, "compositionend", onCompositionEnd);
      addEventListener(el, "change", onCompositionEnd);
    }
  },
  // set value on mounted so it's after min/max for type="range"
  mounted(el, { value }) {
    el.value = value == null ? "" : value;
  },
  beforeUpdate(el, { value, modifiers: { lazy, trim, number } }, vnode) {
    el[assignKey] = getModelAssigner(vnode);
    if (el.composing)
      return;
    const elValue = number || el.type === "number" ? looseToNumber(el.value) : el.value;
    const newValue = value == null ? "" : value;
    if (elValue === newValue) {
      return;
    }
    if (document.activeElement === el && el.type !== "range") {
      if (lazy) {
        return;
      }
      if (trim && el.value.trim() === newValue) {
        return;
      }
    }
    el.value = newValue;
  }
};
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn, modifiers) => {
  return fn._withMods || (fn._withMods = (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn(event, ...args);
  });
};
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const scriptRel = function detectScriptRel() {
  const relList = typeof document !== "undefined" && document.createElement("link").relList;
  return relList && relList.supports && relList.supports("modulepreload") ? "modulepreload" : "preload";
}();
const assetsURL = function(dep, importerUrl) {
  return new URL(dep, importerUrl).href;
};
const seen = {};
const __vitePreload = function preload(baseModule, deps, importerUrl) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  const links = document.getElementsByTagName("link");
  return Promise.all(deps.map((dep) => {
    dep = assetsURL(dep, importerUrl);
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    const isBaseRelative = !!importerUrl;
    if (isBaseRelative) {
      for (let i = links.length - 1; i >= 0; i--) {
        const link2 = links[i];
        if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
          return;
        }
      }
    } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link = document.createElement("link");
    link.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link.as = "script";
      link.crossOrigin = "";
    }
    link.href = dep;
    document.head.appendChild(link);
    if (isCss) {
      return new Promise((res, rej) => {
        link.addEventListener("load", res);
        link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
      });
    }
  })).then(() => baseModule()).catch((err) => {
    const e = new Event("vite:preloadError", { cancelable: true });
    e.payload = err;
    window.dispatchEvent(e);
    if (!e.defaultPrevented) {
      throw err;
    }
  });
};
/*!
  * vue-router v4.2.5
  * (c) 2023 Eduardo San Martin Morote
  * @license MIT
  */
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || obj[Symbol.toStringTag] === "Module";
}
const assign$1 = Object.assign;
function applyToParams(fn, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = isArray(value) ? value.map(fn) : fn(value);
  }
  return newParams;
}
const noop$2 = () => {
};
const isArray = Array.isArray;
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash = "";
  const hashPos = location2.indexOf("#");
  let searchPos = location2.indexOf("?");
  if (hashPos < searchPos && hashPos >= 0) {
    searchPos = -1;
  }
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash,
    path,
    query,
    hash
  };
}
function stringifyURL(stringifyQuery2, location2) {
  const query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  const aLastIndex = a.matched.length - 1;
  const bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (const key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return isArray(a) ? isEquivalentArray(a, b) : isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  const lastToSegment = toSegments[toSegments.length - 1];
  if (lastToSegment === ".." || lastToSegment === ".") {
    toSegments.push("");
  }
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (segment === ".")
      continue;
    if (segment === "..") {
      if (position > 1)
        position--;
    } else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el, offset) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();
  return {
    behavior: offset.behavior,
    left: elRect.left - docRect.left - (offset.left || 0),
    top: elRect.top - docRect.top - (offset.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    const positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el) {
      return;
    }
    scrollToOptions = getElementPosition(el, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta2) {
  const position = history.state ? history.state.position - delta2 : -1;
  return position + path;
}
const scrollPositions = /* @__PURE__ */ new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash;
}
function useHistoryListeners(base, historyState, currentLocation, replace2) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta2 = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta2 = fromState ? state.position - fromState.position : 0;
    } else {
      replace2(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta: delta2,
        type: NavigationType.pop,
        direction: delta2 ? delta2 > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index = listeners.indexOf(callback);
      if (index > -1)
        listeners.splice(index, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign$1({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener, {
    passive: true
  });
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back, current, forward, replaced = false, computeScroll = false) {
  return {
    back,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  const currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  const historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      // the length is off by one, we need to decrease it
      position: history2.length - 1,
      replaced: true,
      // don't add a scroll as the user may have an anchor, and we want
      // scrollBehavior to be triggered without a saved position
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace3) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace3 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace3 ? "replace" : "assign"](url);
    }
  }
  function replace2(to, data) {
    const state = assign$1({}, history2.state, buildState(
      historyState.value.back,
      // keep back and forward entries but override current position
      to,
      historyState.value.forward,
      true
    ), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign$1(
      {},
      // use current history state to gracefully handle a wrong call to
      // history.replaceState
      // https://github.com/vuejs/router/issues/366
      historyState.value,
      history2.state,
      {
        forward: to,
        scroll: computeScrollPosition()
      }
    );
    changeLocation(currentState.current, currentState, true);
    const state = assign$1({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace: replace2
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta2, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta2);
  }
  const routerHistory = assign$1({
    // it's overridden right after
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = Symbol("");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type, params) {
  {
    return assign$1(new Error(), {
      type,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type) {
  return error instanceof Error && NavigationFailureSymbol in error && (type == null || !!(error.type & type));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign$1({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  const score = [];
  let pattern = options.start ? "^" : "";
  const keys2 = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [
      90
      /* PathScore.Root */
    ];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys2.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = // avoid an optional / if there are more segments e.g. /:p?-static
          // or /:p?-:p2
          optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse2(path) {
    const match = path.match(re);
    const params = {};
    if (!match)
      return null;
    for (let i = 1; i < match.length; i++) {
      const value = match[i] || "";
      const key = keys2[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (isArray(param) && !repeatable) {
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          }
          const text = isArray(param) ? param.join("/") : param;
          if (!text) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text;
        }
      }
    }
    return path || "/";
  }
  return {
    re,
    score,
    keys: keys2,
    parse: parse2,
    stringify
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp = compareScoreArray(aScore[i], bScore[i]);
    if (comp)
      return comp;
    i++;
  }
  if (Math.abs(bScore.length - aScore.length) === 1) {
    if (isLastScoreNegative(aScore))
      return 1;
    if (isLastScoreNegative(bScore))
      return -1;
  }
  return bScore.length - aScore.length;
}
function isLastScoreNegative(score) {
  const last = score[score.length - 1];
  return score.length > 0 && last[last.length - 1] < 0;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer = "";
  }
  function addCharToBuffer() {
    buffer += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher = assign$1(parser, {
    record,
    parent,
    // these needs to be populated by the parent
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher);
  }
  return matcher;
}
function createRouterMatcher(routes2, globalOptions) {
  const matchers = [];
  const matcherMap = /* @__PURE__ */ new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    const isRootAdd = !originalRecord;
    const mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases2 = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases2) {
        normalizedRecords.push(assign$1({}, mainNormalizedRecord, {
          // this allows us to hold a copy of the `components` option
          // so that async components cache is hold on the original record
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          // we might be the child of an alias
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
          // the aliases are always of the same kind as the original since they
          // are defined on the same record
        }));
      }
    }
    let matcher;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      const { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        const parentPath = parent.record.path;
        const connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher);
      } else {
        originalMatcher = originalMatcher || matcher;
        if (originalMatcher !== matcher)
          originalMatcher.alias.push(matcher);
        if (isRootAdd && record.name && !isAliasRecord(matcher))
          removeRoute(record.name);
      }
      if (mainNormalizedRecord.children) {
        const children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher;
      if (matcher.record.components && Object.keys(matcher.record.components).length || matcher.record.name || matcher.record.redirect) {
        insertMatcher(matcher);
      }
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop$2;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher = matcherMap.get(matcherRef);
      if (matcher) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher), 1);
        matcher.children.forEach(removeRoute);
        matcher.alias.forEach(removeRoute);
      }
    } else {
      const index = matchers.indexOf(matcherRef);
      if (index > -1) {
        matchers.splice(index, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes() {
    return matchers;
  }
  function insertMatcher(matcher) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher, matchers[i]) >= 0 && // Adding children with empty path should still appear before the parent
    // https://github.com/vuejs/router/issues/1124
    (matcher.record.path !== matchers[i].record.path || !isRecordChildOf(matcher, matchers[i])))
      i++;
    matchers.splice(i, 0, matcher);
    if (matcher.record.name && !isAliasRecord(matcher))
      matcherMap.set(matcher.record.name, matcher);
  }
  function resolve2(location2, currentLocation) {
    let matcher;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher = matcherMap.get(location2.name);
      if (!matcher)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher.record.name;
      params = assign$1(
        // paramsFromLocation is a new object
        paramsFromLocation(
          currentLocation.params,
          // only keep params that exist in the resolved location
          // TODO: only keep optional params coming from a parent record
          matcher.keys.filter((k) => !k.optional).map((k) => k.name)
        ),
        // discard any existing params in the current location that do not exist here
        // #1497 this ensures better active/exact matching
        location2.params && paramsFromLocation(location2.params, matcher.keys.map((k) => k.name))
      );
      path = matcher.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher = matchers.find((m) => m.re.test(path));
      if (matcher) {
        params = matcher.parse(path);
        name = matcher.record.name;
      }
    } else {
      matcher = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher.record.name;
      params = assign$1({}, currentLocation.params, location2.params);
      path = matcher.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes2.forEach((route) => addRoute(route));
  return { addRoute, resolve: resolve2, removeRoute, getRoutes, getRecordMatcher };
}
function paramsFromLocation(params, keys2) {
  const newParams = {};
  for (const key of keys2) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: /* @__PURE__ */ new Set(),
    updateGuards: /* @__PURE__ */ new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || null : record.component && { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (const name in record.components)
      propsObject[name] = typeof props === "object" ? props[name] : props;
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign$1(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  const options = {};
  for (const key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
function isRecordChildOf(record, parent) {
  return parent.children.some((child) => child === record || isRecordChildOf(record, child));
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text) {
  return commonEncode(text).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text) {
  return commonEncode(text).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function encodePath(text) {
  return commonEncode(text).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text) {
  return text == null ? "" : encodePath(text).replace(SLASH_RE, "%2F");
}
function decode(text) {
  try {
    return decodeURIComponent("" + text);
  } catch (err) {
  }
  return "" + text;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    const eqPos = searchParam.indexOf("=");
    const key = decode(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    const value = eqPos < 0 ? null : decode(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    const values = isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (const key in query) {
    const value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
const matchedRouteKey = Symbol("");
const viewDepthKey = Symbol("");
const routerKey = Symbol("");
const routeLocationKey = Symbol("");
const routerViewLocationKey = Symbol("");
function useCallbacks() {
  let handlers2 = [];
  function add2(handler) {
    handlers2.push(handler);
    return () => {
      const i = handlers2.indexOf(handler);
      if (i > -1)
        handlers2.splice(i, 1);
    };
  }
  function reset() {
    handlers2 = [];
  }
  return {
    add: add2,
    list: () => handlers2.slice(),
    reset
  };
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && // name is defined if record is because of the function overload
  (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid) => {
      if (valid === false) {
        reject(createRouterError(4, {
          from,
          to
        }));
      } else if (valid instanceof Error) {
        reject(valid);
      } else if (isRouteLocation(valid)) {
        reject(createRouterError(2, {
          from: to,
          to: valid
        }));
      } else {
        if (enterCallbackArray && // since enterCallbackArray is truthy, both record and name also are
        record.enterCallbacks[name] === enterCallbackArray && typeof valid === "function") {
          enterCallbackArray.push(valid);
        }
        resolve2();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        const options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          const options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink$1(props) {
  const router2 = inject$1(routerKey);
  const currentRoute = inject$1(routeLocationKey);
  const route = computed(() => router2.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    const { matched } = route.value;
    const { length } = matched;
    const routeMatched = matched[length - 1];
    const currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    const index = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index > -1)
      return index;
    const parentRecordPath = getOriginalPath(matched[length - 2]);
    return (
      // we are dealing with nested routes
      length > 1 && // if the parent and matched route have the same path, this link is
      // referring to the empty child. Or we currently are on a different
      // child of the same parent
      getOriginalPath(routeMatched) === parentRecordPath && // avoid comparing the child with its parent
      currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index
    );
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router2[unref(props.replace) ? "replace" : "push"](
        unref(props.to)
        // avoid uncaught errors are they are logged anyway
      ).catch(noop$2);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent$1({
  name: "RouterLink",
  compatConfig: { MODE: 3 },
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    // inactiveClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink: useLink$1,
  setup(props, { slots }) {
    const link = reactive(useLink$1(props));
    const { options } = inject$1(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      // [getLinkClass(
      //   props.inactiveClass,
      //   options.linkInactiveClass,
      //   'router-link-inactive'
      // )]: !link.isExactActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        // this would override user added attrs but Vue will still add
        // the listener, so we end up triggering both
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (const key in inner) {
    const innerValue = inner[key];
    const outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent$1({
  name: "RouterView",
  // #674 we manually inherit them
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  // Better compat for @vue/compat users
  // https://github.com/vuejs/router/issues/1315
  compatConfig: { MODE: 3 },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject$1(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const injectedDepth = inject$1(viewDepthKey, 0);
    const depth = computed(() => {
      let initialDepth = unref(injectedDepth);
      const { matched } = routeToDisplay.value;
      let matchedRoute;
      while ((matchedRoute = matched[initialDepth]) && !matchedRoute.components) {
        initialDepth++;
      }
      return initialDepth;
    });
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth.value]);
    provide(viewDepthKey, computed(() => depth.value + 1));
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && // if there is no instance but to and from are the same this might be
      // the first visit
      (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const currentName = props.name;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[currentName];
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[currentName];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign$1({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return (
        // pass the vnode to the slot as a prop.
        // h and <component :is="..."> both accept vnodes
        normalizeSlot(slots.default, { Component: component, route }) || component
      );
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher = createRouterMatcher(options.routes, options);
  const parseQuery$1 = options.parseQuery || parseQuery;
  const stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  const routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = (
    // @ts-expect-error: intentionally avoid the type check
    applyToParams.bind(null, decode)
  );
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher.addRoute(record, parent);
  }
  function removeRoute(name) {
    const recordMatcher = matcher.getRecordMatcher(name);
    if (recordMatcher) {
      matcher.removeRoute(recordMatcher);
    }
  }
  function getRoutes() {
    return matcher.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign$1({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      const locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      const matchedRoute2 = matcher.resolve({ path: locationNormalized.path }, currentLocation);
      const href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign$1(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign$1({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      const targetParams = assign$1({}, rawLocation.params);
      for (const key in targetParams) {
        if (targetParams[key] == null) {
          delete targetParams[key];
        }
      }
      matcherLocation = assign$1({}, rawLocation, {
        params: encodeParams(targetParams)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    const matchedRoute = matcher.resolve(matcherLocation, currentLocation);
    const hash = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign$1({}, rawLocation, {
      hash: encodeHash(hash),
      path: matchedRoute.path
    }));
    const href = routerHistory.createHref(fullPath);
    return assign$1({
      fullPath,
      // keep the hash encoded so fullPath is effectively path + encodedQuery +
      // hash
      hash,
      query: (
        // if the user is using a custom query lib like qs, we might have
        // nested objects, so we keep the query as is, meaning it can contain
        // numbers at `$route.query`, but at the point, the user will have to
        // use their own type anyway.
        // https://github.com/vuejs/router/issues/328#issuecomment-649481567
        stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query || {}
      )
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign$1({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace2(to) {
    return push(assign$1(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : (
          // force empty params
          { path: newTargetLocation }
        );
        newTargetLocation.params = {};
      }
      return assign$1({
        query: to.query,
        hash: to.hash,
        // avoid transferring params if the redirect has a path
        params: "path" in newTargetLocation ? {} : to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace3 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(
        assign$1(locationAsObject(shouldRedirect), {
          state: typeof shouldRedirect === "object" ? assign$1({}, data, shouldRedirect.state) : data,
          force,
          replace: replace3
        }),
        // keep original redirectedFrom if it exists
        redirectedFrom || targetLocation
      );
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(
        from,
        from,
        // this is a push, the only way for it to be triggered from a
        // history.listen is with a redirect, which makes it become a push
        true,
        // This cannot be the first navigation because the initial location
        // cannot be manually navigated to
        false
      );
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? (
      // navigation redirects still mark the router as ready
      isNavigationFailure(
        error,
        2
        /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
      ) ? error : markAsReady(error)
    ) : (
      // reject any unknown error
      triggerError(error, toLocation, from)
    )).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(
          failure2,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          return pushWithRedirect(
            // keep options
            assign$1({
              // preserve an existing replacement but allow the redirect to override it
              replace: replace3
            }, locationAsObject(failure2.to), {
              state: typeof failure2.to === "object" ? assign$1({}, data, failure2.to.state) : data,
              force
            }),
            // preserve the original redirectedFrom if any
            redirectedFrom || toLocation
          );
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace3, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function runWithContext(fn) {
    const app2 = installedApps.values().next().value;
    return app2 && typeof app2.runWithContext === "function" ? app2.runWithContext(fn) : fn();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of enteringRecords) {
        if (record.beforeEnter) {
          if (isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(
      err,
      8
      /* ErrorTypes.NAVIGATION_CANCELLED */
    ) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    afterGuards.list().forEach((guard) => runWithContext(() => guard(to, from, failure)));
  }
  function finalizeNavigation(toLocation, from, isPush, replace3, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace3 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign$1({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    if (removeHistoryListener)
      return;
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      if (!router2.listening)
        return;
      const toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign$1(shouldRedirect, { replace: true }), toLocation).catch(noop$2);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(
          error,
          4 | 8
          /* ErrorTypes.NAVIGATION_CANCELLED */
        )) {
          return error;
        }
        if (isNavigationFailure(
          error,
          2
          /* ErrorTypes.NAVIGATION_GUARD_REDIRECT */
        )) {
          pushWithRedirect(
            error.to,
            toLocation
            // avoid an uncaught rejection, let push call triggerError
          ).then((failure) => {
            if (isNavigationFailure(
              failure,
              4 | 16
              /* ErrorTypes.NAVIGATION_DUPLICATED */
            ) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop$2);
          return Promise.reject();
        }
        if (info.delta) {
          routerHistory.go(-info.delta, false);
        }
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(
          // after navigation, all matched components are resolved
          toLocation,
          from,
          false
        );
        if (failure) {
          if (info.delta && // a new navigation has been triggered, so we do not want to revert, that will change the current history
          // entry while a different route is displayed
          !isNavigationFailure(
            failure,
            8
            /* ErrorTypes.NAVIGATION_CANCELLED */
          )) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(
            failure,
            4 | 16
            /* ErrorTypes.NAVIGATION_DUPLICATED */
          )) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop$2);
    });
  }
  let readyHandlers = useCallbacks();
  let errorListeners = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorListeners.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve3, reject) => {
      readyHandlers.add([resolve3, reject]);
    });
  }
  function markAsReady(err) {
    if (!ready) {
      ready = !err;
      setupListeners();
      readyHandlers.list().forEach(([resolve3, reject]) => err ? reject(err) : resolve3());
      readyHandlers.reset();
    }
    return err;
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    const scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta2) => routerHistory.go(delta2);
  let started;
  const installedApps = /* @__PURE__ */ new Set();
  const router2 = {
    currentRoute,
    listening: true,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes,
    resolve: resolve2,
    options,
    push,
    replace: replace2,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorListeners.add,
    isReady,
    install(app2) {
      const router3 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router3;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && // used for the initial navigation client side to avoid pushing
      // multiple times when the router is used in multiple apps
      !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (const key in START_LOCATION_NORMALIZED) {
        Object.defineProperty(reactiveRoute, key, {
          get: () => currentRoute.value[key],
          enumerable: true
        });
      }
      app2.provide(routerKey, router3);
      app2.provide(routeLocationKey, shallowReactive(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      const unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          pendingLocation = START_LOCATION_NORMALIZED;
          removeHistoryListener && removeHistoryListener();
          removeHistoryListener = null;
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  function runGuardQueue(guards) {
    return guards.reduce((promise, guard) => promise.then(() => runWithContext(guard)), Promise.resolve());
  }
  return router2;
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function useRouter$1() {
  return inject$1(routerKey);
}
const Login = () => __vitePreload(() => import("./Login-1a5b08b1.js"), true ? ["./Login-1a5b08b1.js","./index-ae98ff50.js"] : void 0, import.meta.url);
const WebView = () => __vitePreload(() => import("./WebView-8b428303.js"), true ? ["./WebView-8b428303.js","./index-ae98ff50.js"] : void 0, import.meta.url);
const routes = [
  {
    path: "/",
    name: "Login",
    component: Login
  },
  {
    path: "/webview",
    name: "WebView",
    component: WebView
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes
});
const materialdesignicons = "";
const all = "";
const main = "";
const _variables = "";
const aliases$1 = {
  collapse: "mdi-chevron-up",
  complete: "mdi-check",
  cancel: "mdi-close-circle",
  close: "mdi-close",
  delete: "mdi-close-circle",
  // delete (e.g. v-chip close)
  clear: "mdi-close-circle",
  success: "mdi-check-circle",
  info: "mdi-information",
  warning: "mdi-alert-circle",
  error: "mdi-close-circle",
  prev: "mdi-chevron-left",
  next: "mdi-chevron-right",
  checkboxOn: "mdi-checkbox-marked",
  checkboxOff: "mdi-checkbox-blank-outline",
  checkboxIndeterminate: "mdi-minus-box",
  delimiter: "mdi-circle",
  // for carousel
  sortAsc: "mdi-arrow-up",
  sortDesc: "mdi-arrow-down",
  expand: "mdi-chevron-down",
  menu: "mdi-menu",
  subgroup: "mdi-menu-down",
  dropdown: "mdi-menu-down",
  radioOn: "mdi-radiobox-marked",
  radioOff: "mdi-radiobox-blank",
  edit: "mdi-pencil",
  ratingEmpty: "mdi-star-outline",
  ratingFull: "mdi-star",
  ratingHalf: "mdi-star-half-full",
  loading: "mdi-cached",
  first: "mdi-page-first",
  last: "mdi-page-last",
  unfold: "mdi-unfold-more-horizontal",
  file: "mdi-paperclip",
  plus: "mdi-plus",
  minus: "mdi-minus",
  calendar: "mdi-calendar",
  eyeDropper: "mdi-eyedropper"
};
const mdi = {
  // Not using mergeProps here, functional components merge props by default (?)
  component: (props) => h(VClassIcon, {
    ...props,
    class: "mdi"
  })
};
const IN_BROWSER = typeof window !== "undefined";
const SUPPORTS_INTERSECTION = IN_BROWSER && "IntersectionObserver" in window;
const SUPPORTS_TOUCH = IN_BROWSER && ("ontouchstart" in window || window.navigator.maxTouchPoints > 0);
const SUPPORTS_EYE_DROPPER = IN_BROWSER && "EyeDropper" in window;
function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);
  privateMap.set(obj, value);
}
function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}
function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");
  _classApplyDescriptorSet(receiver, descriptor, value);
  return value;
}
function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }
    descriptor.value = value;
  }
}
function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");
  return _classApplyDescriptorGet(receiver, descriptor);
}
function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }
  return privateMap.get(receiver);
}
function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }
  return descriptor.value;
}
function getNestedValue(obj, path, fallback) {
  const last = path.length - 1;
  if (last < 0)
    return obj === void 0 ? fallback : obj;
  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback;
    }
    obj = obj[path[i]];
  }
  if (obj == null)
    return fallback;
  return obj[path[last]] === void 0 ? fallback : obj[path[last]];
}
function deepEqual(a, b) {
  if (a === b)
    return true;
  if (a instanceof Date && b instanceof Date && a.getTime() !== b.getTime()) {
    return false;
  }
  if (a !== Object(a) || b !== Object(b)) {
    return false;
  }
  const props = Object.keys(a);
  if (props.length !== Object.keys(b).length) {
    return false;
  }
  return props.every((p2) => deepEqual(a[p2], b[p2]));
}
function getObjectValueByPath(obj, path, fallback) {
  if (obj == null || !path || typeof path !== "string")
    return fallback;
  if (obj[path] !== void 0)
    return obj[path];
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");
  return getNestedValue(obj, path.split("."), fallback);
}
function getPropertyFromItem(item, property, fallback) {
  if (property === true)
    return item === void 0 ? fallback : item;
  if (property == null || typeof property === "boolean")
    return fallback;
  if (item !== Object(item)) {
    if (typeof property !== "function")
      return fallback;
    const value2 = property(item, fallback);
    return typeof value2 === "undefined" ? fallback : value2;
  }
  if (typeof property === "string")
    return getObjectValueByPath(item, property, fallback);
  if (Array.isArray(property))
    return getNestedValue(item, property, fallback);
  if (typeof property !== "function")
    return fallback;
  const value = property(item, fallback);
  return typeof value === "undefined" ? fallback : value;
}
function createRange(length) {
  let start = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  return Array.from({
    length
  }, (v, k) => start + k);
}
function convertToUnit(str) {
  let unit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "px";
  if (str == null || str === "") {
    return void 0;
  } else if (isNaN(+str)) {
    return String(str);
  } else if (!isFinite(+str)) {
    return void 0;
  } else {
    return `${Number(str)}${unit}`;
  }
}
function isObject(obj) {
  return obj !== null && typeof obj === "object" && !Array.isArray(obj);
}
function refElement(obj) {
  if (obj && "$el" in obj) {
    const el = obj.$el;
    if (el?.nodeType === Node.TEXT_NODE) {
      return el.nextElementSibling;
    }
    return el;
  }
  return obj;
}
const keyCodes = Object.freeze({
  enter: 13,
  tab: 9,
  delete: 46,
  esc: 27,
  space: 32,
  up: 38,
  down: 40,
  left: 37,
  right: 39,
  end: 35,
  home: 36,
  del: 46,
  backspace: 8,
  insert: 45,
  pageup: 33,
  pagedown: 34,
  shift: 16
});
const keyValues = Object.freeze({
  enter: "Enter",
  tab: "Tab",
  delete: "Delete",
  esc: "Escape",
  space: "Space",
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  end: "End",
  home: "Home",
  del: "Delete",
  backspace: "Backspace",
  insert: "Insert",
  pageup: "PageUp",
  pagedown: "PageDown",
  shift: "Shift"
});
function keys(o) {
  return Object.keys(o);
}
function has(obj, key) {
  return key.every((k) => obj.hasOwnProperty(k));
}
function pick(obj, paths) {
  const found = {};
  const keys2 = new Set(Object.keys(obj));
  for (const path of paths) {
    if (keys2.has(path)) {
      found[path] = obj[path];
    }
  }
  return found;
}
function pickWithRest(obj, paths, exclude) {
  const found = /* @__PURE__ */ Object.create(null);
  const rest = /* @__PURE__ */ Object.create(null);
  for (const key in obj) {
    if (paths.some((path) => path instanceof RegExp ? path.test(key) : path === key) && !exclude?.some((path) => path === key)) {
      found[key] = obj[key];
    } else {
      rest[key] = obj[key];
    }
  }
  return [found, rest];
}
function omit(obj, exclude) {
  const clone = {
    ...obj
  };
  exclude.forEach((prop) => delete clone[prop]);
  return clone;
}
function only(obj, include) {
  const clone = {};
  include.forEach((prop) => clone[prop] = obj[prop]);
  return clone;
}
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const bubblingEvents = ["onAfterscriptexecute", "onAnimationcancel", "onAnimationend", "onAnimationiteration", "onAnimationstart", "onAuxclick", "onBeforeinput", "onBeforescriptexecute", "onChange", "onClick", "onCompositionend", "onCompositionstart", "onCompositionupdate", "onContextmenu", "onCopy", "onCut", "onDblclick", "onFocusin", "onFocusout", "onFullscreenchange", "onFullscreenerror", "onGesturechange", "onGestureend", "onGesturestart", "onGotpointercapture", "onInput", "onKeydown", "onKeypress", "onKeyup", "onLostpointercapture", "onMousedown", "onMousemove", "onMouseout", "onMouseover", "onMouseup", "onMousewheel", "onPaste", "onPointercancel", "onPointerdown", "onPointerenter", "onPointerleave", "onPointermove", "onPointerout", "onPointerover", "onPointerup", "onReset", "onSelect", "onSubmit", "onTouchcancel", "onTouchend", "onTouchmove", "onTouchstart", "onTransitioncancel", "onTransitionend", "onTransitionrun", "onTransitionstart", "onWheel"];
const compositionIgnoreKeys = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft", "Enter", "Escape", "Tab", " "];
function isComposingIgnoreKey(e) {
  return e.isComposing && compositionIgnoreKeys.includes(e.key);
}
function filterInputAttrs(attrs) {
  const [events, props] = pickWithRest(attrs, [onRE]);
  const inputEvents = omit(events, bubblingEvents);
  const [rootAttrs, inputAttrs] = pickWithRest(props, ["class", "style", "id", /^data-/]);
  Object.assign(rootAttrs, events);
  Object.assign(inputAttrs, inputEvents);
  return [rootAttrs, inputAttrs];
}
function wrapInArray(v) {
  return v == null ? [] : Array.isArray(v) ? v : [v];
}
function debounce(fn, delay) {
  let timeoutId = 0;
  const wrap = function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), unref(delay));
  };
  wrap.clear = () => {
    clearTimeout(timeoutId);
  };
  wrap.immediate = fn;
  return wrap;
}
function clamp(value) {
  let min = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  let max = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 1;
  return Math.max(min, Math.min(max, value));
}
function getDecimals(value) {
  const trimmedStr = value.toString().trim();
  return trimmedStr.includes(".") ? trimmedStr.length - trimmedStr.indexOf(".") - 1 : 0;
}
function padEnd(str, length) {
  let char = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  return str + char.repeat(Math.max(0, length - str.length));
}
function padStart(str, length) {
  let char = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "0";
  return char.repeat(Math.max(0, length - str.length)) + str;
}
function chunk(str) {
  let size2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1;
  const chunked = [];
  let index = 0;
  while (index < str.length) {
    chunked.push(str.substr(index, size2));
    index += size2;
  }
  return chunked;
}
function humanReadableFileSize(bytes) {
  let base = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 1e3;
  if (bytes < base) {
    return `${bytes} B`;
  }
  const prefix = base === 1024 ? ["Ki", "Mi", "Gi"] : ["k", "M", "G"];
  let unit = -1;
  while (Math.abs(bytes) >= base && unit < prefix.length - 1) {
    bytes /= base;
    ++unit;
  }
  return `${bytes.toFixed(1)} ${prefix[unit]}B`;
}
function mergeDeep() {
  let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  let target = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  let arrayFn = arguments.length > 2 ? arguments[2] : void 0;
  const out = {};
  for (const key in source) {
    out[key] = source[key];
  }
  for (const key in target) {
    const sourceProperty = source[key];
    const targetProperty = target[key];
    if (isObject(sourceProperty) && isObject(targetProperty)) {
      out[key] = mergeDeep(sourceProperty, targetProperty, arrayFn);
      continue;
    }
    if (Array.isArray(sourceProperty) && Array.isArray(targetProperty) && arrayFn) {
      out[key] = arrayFn(sourceProperty, targetProperty);
      continue;
    }
    out[key] = targetProperty;
  }
  return out;
}
function flattenFragments(nodes) {
  return nodes.map((node) => {
    if (node.type === Fragment) {
      return flattenFragments(node.children);
    } else {
      return node;
    }
  }).flat();
}
function toKebabCase() {
  let str = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  if (toKebabCase.cache.has(str))
    return toKebabCase.cache.get(str);
  const kebab = str.replace(/[^a-z]/gi, "-").replace(/\B([A-Z])/g, "-$1").toLowerCase();
  toKebabCase.cache.set(str, kebab);
  return kebab;
}
toKebabCase.cache = /* @__PURE__ */ new Map();
function findChildrenWithProvide(key, vnode) {
  if (!vnode || typeof vnode !== "object")
    return [];
  if (Array.isArray(vnode)) {
    return vnode.map((child) => findChildrenWithProvide(key, child)).flat(1);
  } else if (Array.isArray(vnode.children)) {
    return vnode.children.map((child) => findChildrenWithProvide(key, child)).flat(1);
  } else if (vnode.component) {
    if (Object.getOwnPropertySymbols(vnode.component.provides).includes(key)) {
      return [vnode.component];
    } else if (vnode.component.subTree) {
      return findChildrenWithProvide(key, vnode.component.subTree).flat(1);
    }
  }
  return [];
}
var _arr = /* @__PURE__ */ new WeakMap();
var _pointer = /* @__PURE__ */ new WeakMap();
class CircularBuffer {
  constructor(size2) {
    _classPrivateFieldInitSpec(this, _arr, {
      writable: true,
      value: []
    });
    _classPrivateFieldInitSpec(this, _pointer, {
      writable: true,
      value: 0
    });
    this.size = size2;
  }
  push(val) {
    _classPrivateFieldGet(this, _arr)[_classPrivateFieldGet(this, _pointer)] = val;
    _classPrivateFieldSet(this, _pointer, (_classPrivateFieldGet(this, _pointer) + 1) % this.size);
  }
  values() {
    return _classPrivateFieldGet(this, _arr).slice(_classPrivateFieldGet(this, _pointer)).concat(_classPrivateFieldGet(this, _arr).slice(0, _classPrivateFieldGet(this, _pointer)));
  }
}
function getEventCoordinates(e) {
  if ("touches" in e) {
    return {
      clientX: e.touches[0].clientX,
      clientY: e.touches[0].clientY
    };
  }
  return {
    clientX: e.clientX,
    clientY: e.clientY
  };
}
function destructComputed(getter) {
  const refs = reactive({});
  const base = computed(getter);
  watchEffect(() => {
    for (const key in base.value) {
      refs[key] = base.value[key];
    }
  }, {
    flush: "sync"
  });
  return toRefs(refs);
}
function includes(arr, val) {
  return arr.includes(val);
}
function eventName(propName) {
  return propName[2].toLowerCase() + propName.slice(3);
}
const EventProp = () => [Function, Array];
function hasEvent(props, name) {
  name = "on" + capitalize(name);
  return !!(props[name] || props[`${name}Once`] || props[`${name}Capture`] || props[`${name}OnceCapture`] || props[`${name}CaptureOnce`]);
}
function callEvent(handler) {
  for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }
  if (Array.isArray(handler)) {
    for (const h2 of handler) {
      h2(...args);
    }
  } else if (typeof handler === "function") {
    handler(...args);
  }
}
function focusableChildren(el) {
  let filterByTabIndex = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  const targets = ["button", "[href]", 'input:not([type="hidden"])', "select", "textarea", "[tabindex]"].map((s) => `${s}${filterByTabIndex ? ':not([tabindex="-1"])' : ""}:not([disabled])`).join(", ");
  return [...el.querySelectorAll(targets)];
}
function getNextElement(elements, location2, condition) {
  let _el;
  let idx = elements.indexOf(document.activeElement);
  const inc = location2 === "next" ? 1 : -1;
  do {
    idx += inc;
    _el = elements[idx];
  } while ((!_el || _el.offsetParent == null || !(condition?.(_el) ?? true)) && idx < elements.length && idx >= 0);
  return _el;
}
function focusChild(el, location2) {
  const focusable = focusableChildren(el);
  if (!location2) {
    if (el === document.activeElement || !el.contains(document.activeElement)) {
      focusable[0]?.focus();
    }
  } else if (location2 === "first") {
    focusable[0]?.focus();
  } else if (location2 === "last") {
    focusable.at(-1)?.focus();
  } else if (typeof location2 === "number") {
    focusable[location2]?.focus();
  } else {
    const _el = getNextElement(focusable, location2);
    if (_el)
      _el.focus();
    else
      focusChild(el, location2 === "next" ? "first" : "last");
  }
}
function isEmpty(val) {
  return val === null || val === void 0 || typeof val === "string" && val.trim() === "";
}
function noop$1() {
}
function matchesSelector(el, selector) {
  const supportsSelector = IN_BROWSER && typeof CSS !== "undefined" && typeof CSS.supports !== "undefined" && CSS.supports(`selector(${selector})`);
  if (!supportsSelector)
    return null;
  try {
    return !!el && el.matches(selector);
  } catch (err) {
    return null;
  }
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment)
      return false;
    return child.type !== Fragment || ensureValidVNode(child.children);
  }) ? vnodes : null;
}
const block = ["top", "bottom"];
const inline = ["start", "end", "left", "right"];
function parseAnchor(anchor, isRtl) {
  let [side, align] = anchor.split(" ");
  if (!align) {
    align = includes(block, side) ? "start" : includes(inline, side) ? "top" : "center";
  }
  return {
    side: toPhysical(side, isRtl),
    align: toPhysical(align, isRtl)
  };
}
function toPhysical(str, isRtl) {
  if (str === "start")
    return isRtl ? "right" : "left";
  if (str === "end")
    return isRtl ? "left" : "right";
  return str;
}
function flipSide(anchor) {
  return {
    side: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[anchor.side],
    align: anchor.align
  };
}
function flipAlign(anchor) {
  return {
    side: anchor.side,
    align: {
      center: "center",
      top: "bottom",
      bottom: "top",
      left: "right",
      right: "left"
    }[anchor.align]
  };
}
function flipCorner(anchor) {
  return {
    side: anchor.align,
    align: anchor.side
  };
}
function getAxis(anchor) {
  return includes(block, anchor.side) ? "y" : "x";
}
class Box {
  constructor(_ref) {
    let {
      x,
      y,
      width,
      height
    } = _ref;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
}
function getOverflow(a, b) {
  return {
    x: {
      before: Math.max(0, b.left - a.left),
      after: Math.max(0, a.right - b.right)
    },
    y: {
      before: Math.max(0, b.top - a.top),
      after: Math.max(0, a.bottom - b.bottom)
    }
  };
}
function getTargetBox(target) {
  if (Array.isArray(target)) {
    return new Box({
      x: target[0],
      y: target[1],
      width: 0,
      height: 0
    });
  } else {
    return target.getBoundingClientRect();
  }
}
function nullifyTransforms(el) {
  const rect = el.getBoundingClientRect();
  const style = getComputedStyle(el);
  const tx = style.transform;
  if (tx) {
    let ta, sx, sy, dx, dy;
    if (tx.startsWith("matrix3d(")) {
      ta = tx.slice(9, -1).split(/, /);
      sx = +ta[0];
      sy = +ta[5];
      dx = +ta[12];
      dy = +ta[13];
    } else if (tx.startsWith("matrix(")) {
      ta = tx.slice(7, -1).split(/, /);
      sx = +ta[0];
      sy = +ta[3];
      dx = +ta[4];
      dy = +ta[5];
    } else {
      return new Box(rect);
    }
    const to = style.transformOrigin;
    const x = rect.x - dx - (1 - sx) * parseFloat(to);
    const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
    const w = sx ? rect.width / sx : el.offsetWidth + 1;
    const h2 = sy ? rect.height / sy : el.offsetHeight + 1;
    return new Box({
      x,
      y,
      width: w,
      height: h2
    });
  } else {
    return new Box(rect);
  }
}
function animate(el, keyframes, options) {
  if (typeof el.animate === "undefined")
    return {
      finished: Promise.resolve()
    };
  let animation;
  try {
    animation = el.animate(keyframes, options);
  } catch (err) {
    return {
      finished: Promise.resolve()
    };
  }
  if (typeof animation.finished === "undefined") {
    animation.finished = new Promise((resolve2) => {
      animation.onfinish = () => {
        resolve2(animation);
      };
    });
  }
  return animation;
}
const handlers = /* @__PURE__ */ new WeakMap();
function bindProps(el, props) {
  Object.keys(props).forEach((k) => {
    if (isOn(k)) {
      const name = eventName(k);
      const handler = handlers.get(el);
      if (props[k] == null) {
        handler?.forEach((v) => {
          const [n, fn] = v;
          if (n === name) {
            el.removeEventListener(name, fn);
            handler.delete(v);
          }
        });
      } else if (!handler || ![...handler]?.some((v) => v[0] === name && v[1] === props[k])) {
        el.addEventListener(name, props[k]);
        const _handler = handler || /* @__PURE__ */ new Set();
        _handler.add([name, props[k]]);
        if (!handlers.has(el))
          handlers.set(el, _handler);
      }
    } else {
      if (props[k] == null) {
        el.removeAttribute(k);
      } else {
        el.setAttribute(k, props[k]);
      }
    }
  });
}
function unbindProps(el, props) {
  Object.keys(props).forEach((k) => {
    if (isOn(k)) {
      const name = eventName(k);
      const handler = handlers.get(el);
      handler?.forEach((v) => {
        const [n, fn] = v;
        if (n === name) {
          el.removeEventListener(name, fn);
          handler.delete(v);
        }
      });
    } else {
      el.removeAttribute(k);
    }
  });
}
const mainTRC = 2.4;
const Rco = 0.2126729;
const Gco = 0.7151522;
const Bco = 0.072175;
const normBG = 0.55;
const normTXT = 0.58;
const revTXT = 0.57;
const revBG = 0.62;
const blkThrs = 0.03;
const blkClmp = 1.45;
const deltaYmin = 5e-4;
const scaleBoW = 1.25;
const scaleWoB = 1.25;
const loConThresh = 0.078;
const loConFactor = 12.82051282051282;
const loConOffset = 0.06;
const loClip = 1e-3;
function APCAcontrast(text, background) {
  const Rtxt = (text.r / 255) ** mainTRC;
  const Gtxt = (text.g / 255) ** mainTRC;
  const Btxt = (text.b / 255) ** mainTRC;
  const Rbg = (background.r / 255) ** mainTRC;
  const Gbg = (background.g / 255) ** mainTRC;
  const Bbg = (background.b / 255) ** mainTRC;
  let Ytxt = Rtxt * Rco + Gtxt * Gco + Btxt * Bco;
  let Ybg = Rbg * Rco + Gbg * Gco + Bbg * Bco;
  if (Ytxt <= blkThrs)
    Ytxt += (blkThrs - Ytxt) ** blkClmp;
  if (Ybg <= blkThrs)
    Ybg += (blkThrs - Ybg) ** blkClmp;
  if (Math.abs(Ybg - Ytxt) < deltaYmin)
    return 0;
  let outputContrast;
  if (Ybg > Ytxt) {
    const SAPC = (Ybg ** normBG - Ytxt ** normTXT) * scaleBoW;
    outputContrast = SAPC < loClip ? 0 : SAPC < loConThresh ? SAPC - SAPC * loConFactor * loConOffset : SAPC - loConOffset;
  } else {
    const SAPC = (Ybg ** revBG - Ytxt ** revTXT) * scaleWoB;
    outputContrast = SAPC > -loClip ? 0 : SAPC > -loConThresh ? SAPC - SAPC * loConFactor * loConOffset : SAPC + loConOffset;
  }
  return outputContrast * 100;
}
function consoleWarn(message) {
}
function consoleError(message) {
}
function deprecate(original, replacement) {
  replacement = Array.isArray(replacement) ? replacement.slice(0, -1).map((s) => `'${s}'`).join(", ") + ` or '${replacement.at(-1)}'` : `'${replacement}'`;
}
const delta = 0.20689655172413793;
const cielabForwardTransform = (t) => t > delta ** 3 ? Math.cbrt(t) : t / (3 * delta ** 2) + 4 / 29;
const cielabReverseTransform = (t) => t > delta ? t ** 3 : 3 * delta ** 2 * (t - 4 / 29);
function fromXYZ$1(xyz) {
  const transform2 = cielabForwardTransform;
  const transformedY = transform2(xyz[1]);
  return [116 * transformedY - 16, 500 * (transform2(xyz[0] / 0.95047) - transformedY), 200 * (transformedY - transform2(xyz[2] / 1.08883))];
}
function toXYZ$1(lab) {
  const transform2 = cielabReverseTransform;
  const Ln = (lab[0] + 16) / 116;
  return [transform2(Ln + lab[1] / 500) * 0.95047, transform2(Ln), transform2(Ln - lab[2] / 200) * 1.08883];
}
const srgbForwardMatrix = [[3.2406, -1.5372, -0.4986], [-0.9689, 1.8758, 0.0415], [0.0557, -0.204, 1.057]];
const srgbForwardTransform = (C) => C <= 31308e-7 ? C * 12.92 : 1.055 * C ** (1 / 2.4) - 0.055;
const srgbReverseMatrix = [[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]];
const srgbReverseTransform = (C) => C <= 0.04045 ? C / 12.92 : ((C + 0.055) / 1.055) ** 2.4;
function fromXYZ(xyz) {
  const rgb2 = Array(3);
  const transform2 = srgbForwardTransform;
  const matrix = srgbForwardMatrix;
  for (let i = 0; i < 3; ++i) {
    rgb2[i] = Math.round(clamp(transform2(matrix[i][0] * xyz[0] + matrix[i][1] * xyz[1] + matrix[i][2] * xyz[2])) * 255);
  }
  return {
    r: rgb2[0],
    g: rgb2[1],
    b: rgb2[2]
  };
}
function toXYZ(_ref) {
  let {
    r,
    g,
    b
  } = _ref;
  const xyz = [0, 0, 0];
  const transform2 = srgbReverseTransform;
  const matrix = srgbReverseMatrix;
  r = transform2(r / 255);
  g = transform2(g / 255);
  b = transform2(b / 255);
  for (let i = 0; i < 3; ++i) {
    xyz[i] = matrix[i][0] * r + matrix[i][1] * g + matrix[i][2] * b;
  }
  return xyz;
}
function isCssColor(color) {
  return !!color && /^(#|var\(--|(rgb|hsl)a?\()/.test(color);
}
function isParsableColor(color) {
  return isCssColor(color) && !/^((rgb|hsl)a?\()?var\(--/.test(color);
}
const cssColorRe = /^(?<fn>(?:rgb|hsl)a?)\((?<values>.+)\)/;
const mappers = {
  rgb: (r, g, b, a) => ({
    r,
    g,
    b,
    a
  }),
  rgba: (r, g, b, a) => ({
    r,
    g,
    b,
    a
  }),
  hsl: (h2, s, l, a) => HSLtoRGB({
    h: h2,
    s,
    l,
    a
  }),
  hsla: (h2, s, l, a) => HSLtoRGB({
    h: h2,
    s,
    l,
    a
  }),
  hsv: (h2, s, v, a) => HSVtoRGB({
    h: h2,
    s,
    v,
    a
  }),
  hsva: (h2, s, v, a) => HSVtoRGB({
    h: h2,
    s,
    v,
    a
  })
};
function parseColor(color) {
  if (typeof color === "number") {
    return {
      r: (color & 16711680) >> 16,
      g: (color & 65280) >> 8,
      b: color & 255
    };
  } else if (typeof color === "string" && cssColorRe.test(color)) {
    const {
      groups
    } = color.match(cssColorRe);
    const {
      fn,
      values
    } = groups;
    const realValues = values.split(/,\s*/).map((v) => {
      if (v.endsWith("%") && ["hsl", "hsla", "hsv", "hsva"].includes(fn)) {
        return parseFloat(v) / 100;
      } else {
        return parseFloat(v);
      }
    });
    return mappers[fn](...realValues);
  } else if (typeof color === "string") {
    let hex2 = color.startsWith("#") ? color.slice(1) : color;
    if ([3, 4].includes(hex2.length)) {
      hex2 = hex2.split("").map((char) => char + char).join("");
    } else if (![6, 8].includes(hex2.length))
      ;
    return HexToRGB(hex2);
  } else if (typeof color === "object") {
    if (has(color, ["r", "g", "b"])) {
      return color;
    } else if (has(color, ["h", "s", "l"])) {
      return HSVtoRGB(HSLtoHSV(color));
    } else if (has(color, ["h", "s", "v"])) {
      return HSVtoRGB(color);
    }
  }
  throw new TypeError(`Invalid color: ${color == null ? color : String(color) || color.constructor.name}
Expected #hex, #hexa, rgb(), rgba(), hsl(), hsla(), object or number`);
}
function HSVtoRGB(hsva) {
  const {
    h: h2,
    s,
    v,
    a
  } = hsva;
  const f = (n) => {
    const k = (n + h2 / 60) % 6;
    return v - v * s * Math.max(Math.min(k, 4 - k, 1), 0);
  };
  const rgb2 = [f(5), f(3), f(1)].map((v2) => Math.round(v2 * 255));
  return {
    r: rgb2[0],
    g: rgb2[1],
    b: rgb2[2],
    a
  };
}
function HSLtoRGB(hsla2) {
  return HSVtoRGB(HSLtoHSV(hsla2));
}
function RGBtoHSV(rgba2) {
  if (!rgba2)
    return {
      h: 0,
      s: 1,
      v: 1,
      a: 1
    };
  const r = rgba2.r / 255;
  const g = rgba2.g / 255;
  const b = rgba2.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h2 = 0;
  if (max !== min) {
    if (max === r) {
      h2 = 60 * (0 + (g - b) / (max - min));
    } else if (max === g) {
      h2 = 60 * (2 + (b - r) / (max - min));
    } else if (max === b) {
      h2 = 60 * (4 + (r - g) / (max - min));
    }
  }
  if (h2 < 0)
    h2 = h2 + 360;
  const s = max === 0 ? 0 : (max - min) / max;
  const hsv = [h2, s, max];
  return {
    h: hsv[0],
    s: hsv[1],
    v: hsv[2],
    a: rgba2.a
  };
}
function HSVtoHSL(hsva) {
  const {
    h: h2,
    s,
    v,
    a
  } = hsva;
  const l = v - v * s / 2;
  const sprime = l === 1 || l === 0 ? 0 : (v - l) / Math.min(l, 1 - l);
  return {
    h: h2,
    s: sprime,
    l,
    a
  };
}
function HSLtoHSV(hsl2) {
  const {
    h: h2,
    s,
    l,
    a
  } = hsl2;
  const v = l + s * Math.min(l, 1 - l);
  const sprime = v === 0 ? 0 : 2 - 2 * l / v;
  return {
    h: h2,
    s: sprime,
    v,
    a
  };
}
function RGBtoCSS(_ref) {
  let {
    r,
    g,
    b,
    a
  } = _ref;
  return a === void 0 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${a})`;
}
function HSVtoCSS(hsva) {
  return RGBtoCSS(HSVtoRGB(hsva));
}
function toHex(v) {
  const h2 = Math.round(v).toString(16);
  return ("00".substr(0, 2 - h2.length) + h2).toUpperCase();
}
function RGBtoHex(_ref2) {
  let {
    r,
    g,
    b,
    a
  } = _ref2;
  return `#${[toHex(r), toHex(g), toHex(b), a !== void 0 ? toHex(Math.round(a * 255)) : ""].join("")}`;
}
function HexToRGB(hex2) {
  hex2 = parseHex(hex2);
  let [r, g, b, a] = chunk(hex2, 2).map((c) => parseInt(c, 16));
  a = a === void 0 ? a : a / 255;
  return {
    r,
    g,
    b,
    a
  };
}
function HexToHSV(hex2) {
  const rgb2 = HexToRGB(hex2);
  return RGBtoHSV(rgb2);
}
function HSVtoHex(hsva) {
  return RGBtoHex(HSVtoRGB(hsva));
}
function parseHex(hex2) {
  if (hex2.startsWith("#")) {
    hex2 = hex2.slice(1);
  }
  hex2 = hex2.replace(/([^0-9a-f])/gi, "F");
  if (hex2.length === 3 || hex2.length === 4) {
    hex2 = hex2.split("").map((x) => x + x).join("");
  }
  if (hex2.length !== 6) {
    hex2 = padEnd(padEnd(hex2, 6), 8, "F");
  }
  return hex2;
}
function lighten(value, amount) {
  const lab = fromXYZ$1(toXYZ(value));
  lab[0] = lab[0] + amount * 10;
  return fromXYZ(toXYZ$1(lab));
}
function darken(value, amount) {
  const lab = fromXYZ$1(toXYZ(value));
  lab[0] = lab[0] - amount * 10;
  return fromXYZ(toXYZ$1(lab));
}
function getLuma(color) {
  const rgb2 = parseColor(color);
  return toXYZ(rgb2)[1];
}
function getContrast(first, second) {
  const l1 = getLuma(first);
  const l2 = getLuma(second);
  const light2 = Math.max(l1, l2);
  const dark2 = Math.min(l1, l2);
  return (light2 + 0.05) / (dark2 + 0.05);
}
function getForeground(color) {
  const blackContrast = Math.abs(APCAcontrast(parseColor(0), parseColor(color)));
  const whiteContrast = Math.abs(APCAcontrast(parseColor(16777215), parseColor(color)));
  return whiteContrast > Math.min(blackContrast, 50) ? "#fff" : "#000";
}
function propsFactory(props, source) {
  return (defaults) => {
    return Object.keys(props).reduce((obj, prop) => {
      const isObjectDefinition = typeof props[prop] === "object" && props[prop] != null && !Array.isArray(props[prop]);
      const definition = isObjectDefinition ? props[prop] : {
        type: props[prop]
      };
      if (defaults && prop in defaults) {
        obj[prop] = {
          ...definition,
          default: defaults[prop]
        };
      } else {
        obj[prop] = definition;
      }
      if (source && !obj[prop].source) {
        obj[prop].source = source;
      }
      return obj;
    }, {});
  };
}
const makeComponentProps = propsFactory({
  class: [String, Array],
  style: {
    type: [String, Array, Object],
    default: null
  }
}, "component");
const DefaultsSymbol = Symbol.for("vuetify:defaults");
function createDefaults(options) {
  return ref(options);
}
function injectDefaults() {
  const defaults = inject$1(DefaultsSymbol);
  if (!defaults)
    throw new Error("[Vuetify] Could not find defaults instance");
  return defaults;
}
function provideDefaults(defaults, options) {
  const injectedDefaults = injectDefaults();
  const providedDefaults = ref(defaults);
  const newDefaults = computed(() => {
    const disabled = unref(options?.disabled);
    if (disabled)
      return injectedDefaults.value;
    const scoped = unref(options?.scoped);
    const reset = unref(options?.reset);
    const root = unref(options?.root);
    if (providedDefaults.value == null && !(scoped || reset || root))
      return injectedDefaults.value;
    let properties = mergeDeep(providedDefaults.value, {
      prev: injectedDefaults.value
    });
    if (scoped)
      return properties;
    if (reset || root) {
      const len = Number(reset || Infinity);
      for (let i = 0; i <= len; i++) {
        if (!properties || !("prev" in properties)) {
          break;
        }
        properties = properties.prev;
      }
      if (properties && typeof root === "string" && root in properties) {
        properties = mergeDeep(mergeDeep(properties, {
          prev: properties
        }), properties[root]);
      }
      return properties;
    }
    return properties.prev ? mergeDeep(properties.prev, properties) : properties;
  });
  provide(DefaultsSymbol, newDefaults);
  return newDefaults;
}
function propIsDefined(vnode, prop) {
  return typeof vnode.props?.[prop] !== "undefined" || typeof vnode.props?.[toKebabCase(prop)] !== "undefined";
}
function internalUseDefaults() {
  let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  let name = arguments.length > 1 ? arguments[1] : void 0;
  let defaults = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : injectDefaults();
  const vm = getCurrentInstance("useDefaults");
  name = name ?? vm.type.name ?? vm.type.__name;
  if (!name) {
    throw new Error("[Vuetify] Could not determine component name");
  }
  const componentDefaults = computed(() => defaults.value?.[props._as ?? name]);
  const _props = new Proxy(props, {
    get(target, prop) {
      const propValue = Reflect.get(target, prop);
      if (prop === "class" || prop === "style") {
        return [componentDefaults.value?.[prop], propValue].filter((v) => v != null);
      } else if (typeof prop === "string" && !propIsDefined(vm.vnode, prop)) {
        return componentDefaults.value?.[prop] ?? defaults.value?.global?.[prop] ?? propValue;
      }
      return propValue;
    }
  });
  const _subcomponentDefaults = shallowRef();
  watchEffect(() => {
    if (componentDefaults.value) {
      const subComponents = Object.entries(componentDefaults.value).filter((_ref) => {
        let [key] = _ref;
        return key.startsWith(key[0].toUpperCase());
      });
      _subcomponentDefaults.value = subComponents.length ? Object.fromEntries(subComponents) : void 0;
    } else {
      _subcomponentDefaults.value = void 0;
    }
  });
  function provideSubDefaults() {
    const injected = injectSelf(DefaultsSymbol, vm);
    provide(DefaultsSymbol, computed(() => {
      return _subcomponentDefaults.value ? mergeDeep(injected?.value ?? {}, _subcomponentDefaults.value) : injected?.value;
    }));
  }
  return {
    props: _props,
    provideSubDefaults
  };
}
function defineComponent(options) {
  options._setup = options._setup ?? options.setup;
  if (!options.name) {
    return options;
  }
  if (options._setup) {
    options.props = propsFactory(options.props ?? {}, options.name)();
    const propKeys = Object.keys(options.props).filter((key) => key !== "class" && key !== "style");
    options.filterProps = function filterProps(props) {
      return pick(props, propKeys);
    };
    options.props._as = String;
    options.setup = function setup(props, ctx) {
      const defaults = injectDefaults();
      if (!defaults.value)
        return options._setup(props, ctx);
      const {
        props: _props,
        provideSubDefaults
      } = internalUseDefaults(props, props._as ?? options.name, defaults);
      const setupBindings = options._setup(_props, ctx);
      provideSubDefaults();
      return setupBindings;
    };
  }
  return options;
}
function genericComponent() {
  let exposeDefaults = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
  return (options) => (exposeDefaults ? defineComponent : defineComponent$1)(options);
}
function defineFunctionalComponent(props, render) {
  render.props = props;
  return render;
}
function createSimpleFunctional(klass) {
  let tag = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "div";
  let name = arguments.length > 2 ? arguments[2] : void 0;
  return genericComponent()({
    name: name ?? capitalize(camelize(klass.replace(/__/g, "-"))),
    props: {
      tag: {
        type: String,
        default: tag
      },
      ...makeComponentProps()
    },
    setup(props, _ref) {
      let {
        slots
      } = _ref;
      return () => {
        return h(props.tag, {
          class: [klass, props.class],
          style: props.style
        }, slots.default?.());
      };
    }
  });
}
function attachedRoot(node) {
  if (typeof node.getRootNode !== "function") {
    while (node.parentNode)
      node = node.parentNode;
    if (node !== document)
      return null;
    return document;
  }
  const root = node.getRootNode();
  if (root !== document && root.getRootNode({
    composed: true
  }) !== document)
    return null;
  return root;
}
const standardEasing = "cubic-bezier(0.4, 0, 0.2, 1)";
const deceleratedEasing = "cubic-bezier(0.0, 0, 0.2, 1)";
const acceleratedEasing = "cubic-bezier(0.4, 0, 1, 1)";
function getPrefixedEventHandlers(attrs, suffix, getData) {
  return Object.keys(attrs).filter((key) => isOn(key) && key.endsWith(suffix)).reduce((acc, key) => {
    acc[key.slice(0, -suffix.length)] = (event) => attrs[key](event, getData(event));
    return acc;
  }, {});
}
function getCurrentInstance(name, message) {
  const vm = getCurrentInstance$1();
  if (!vm) {
    throw new Error(`[Vuetify] ${name} ${message || "must be called from inside a setup function"}`);
  }
  return vm;
}
function getCurrentInstanceName() {
  let name = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "composables";
  const vm = getCurrentInstance(name).type;
  return toKebabCase(vm?.aliasName || vm?.name);
}
let _uid = 0;
let _map = /* @__PURE__ */ new WeakMap();
function getUid() {
  const vm = getCurrentInstance("getUid");
  if (_map.has(vm))
    return _map.get(vm);
  else {
    const uid2 = _uid++;
    _map.set(vm, uid2);
    return uid2;
  }
}
getUid.reset = () => {
  _uid = 0;
  _map = /* @__PURE__ */ new WeakMap();
};
function getScrollParent(el) {
  let includeHidden = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  while (el) {
    if (includeHidden ? isPotentiallyScrollable(el) : hasScrollbar(el))
      return el;
    el = el.parentElement;
  }
  return document.scrollingElement;
}
function getScrollParents(el, stopAt) {
  const elements = [];
  if (stopAt && el && !stopAt.contains(el))
    return elements;
  while (el) {
    if (hasScrollbar(el))
      elements.push(el);
    if (el === stopAt)
      break;
    el = el.parentElement;
  }
  return elements;
}
function hasScrollbar(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE)
    return false;
  const style = window.getComputedStyle(el);
  return style.overflowY === "scroll" || style.overflowY === "auto" && el.scrollHeight > el.clientHeight;
}
function isPotentiallyScrollable(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE)
    return false;
  const style = window.getComputedStyle(el);
  return ["scroll", "auto"].includes(style.overflowY);
}
function injectSelf(key) {
  let vm = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstance("injectSelf");
  const {
    provides
  } = vm;
  if (provides && key in provides) {
    return provides[key];
  }
  return void 0;
}
function isFixedPosition(el) {
  while (el) {
    if (window.getComputedStyle(el).position === "fixed") {
      return true;
    }
    el = el.offsetParent;
  }
  return false;
}
function useRender(render) {
  const vm = getCurrentInstance("useRender");
  vm.render = render;
}
const IconValue = [String, Function, Object, Array];
const IconSymbol = Symbol.for("vuetify:icons");
const makeIconProps = propsFactory({
  icon: {
    type: IconValue
  },
  // Could not remove this and use makeTagProps, types complained because it is not required
  tag: {
    type: String,
    required: true
  }
}, "icon");
const VComponentIcon = genericComponent()({
  name: "VComponentIcon",
  props: makeIconProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      const Icon = props.icon;
      return createVNode(props.tag, null, {
        default: () => [props.icon ? createVNode(Icon, null, null) : slots.default?.()]
      });
    };
  }
});
const VSvgIcon = defineComponent({
  name: "VSvgIcon",
  inheritAttrs: false,
  props: makeIconProps(),
  setup(props, _ref2) {
    let {
      attrs
    } = _ref2;
    return () => {
      return createVNode(props.tag, mergeProps(attrs, {
        "style": null
      }), {
        default: () => [createVNode("svg", {
          "class": "v-icon__svg",
          "xmlns": "http://www.w3.org/2000/svg",
          "viewBox": "0 0 24 24",
          "role": "img",
          "aria-hidden": "true"
        }, [Array.isArray(props.icon) ? props.icon.map((path) => Array.isArray(path) ? createVNode("path", {
          "d": path[0],
          "fill-opacity": path[1]
        }, null) : createVNode("path", {
          "d": path
        }, null)) : createVNode("path", {
          "d": props.icon
        }, null)])]
      });
    };
  }
});
const VLigatureIcon = defineComponent({
  name: "VLigatureIcon",
  props: makeIconProps(),
  setup(props) {
    return () => {
      return createVNode(props.tag, null, {
        default: () => [props.icon]
      });
    };
  }
});
const VClassIcon = defineComponent({
  name: "VClassIcon",
  props: makeIconProps(),
  setup(props) {
    return () => {
      return createVNode(props.tag, {
        "class": props.icon
      }, null);
    };
  }
});
const defaultSets = {
  svg: {
    component: VSvgIcon
  },
  class: {
    component: VClassIcon
  }
};
function createIcons(options) {
  return mergeDeep({
    defaultSet: "mdi",
    sets: {
      ...defaultSets,
      mdi
    },
    aliases: {
      ...aliases$1,
      /* eslint-disable max-len */
      vuetify: ["M8.2241 14.2009L12 21L22 3H14.4459L8.2241 14.2009Z", ["M7.26303 12.4733L7.00113 12L2 3H12.5261C12.5261 3 12.5261 3 12.5261 3L7.26303 12.4733Z", 0.6]],
      "vuetify-outline": "svg:M7.26 12.47 12.53 3H2L7.26 12.47ZM14.45 3 8.22 14.2 12 21 22 3H14.45ZM18.6 5 12 16.88 10.51 14.2 15.62 5ZM7.26 8.35 5.4 5H9.13L7.26 8.35Z"
      /* eslint-enable max-len */
    }
  }, options);
}
const useIcon = (props) => {
  const icons = inject$1(IconSymbol);
  if (!icons)
    throw new Error("Missing Vuetify Icons provide!");
  const iconData = computed(() => {
    const iconAlias = unref(props);
    if (!iconAlias)
      return {
        component: VComponentIcon
      };
    let icon = iconAlias;
    if (typeof icon === "string") {
      icon = icon.trim();
      if (icon.startsWith("$")) {
        icon = icons.aliases?.[icon.slice(1)];
      }
    }
    if (!icon)
      throw new Error(`Could not find aliased icon "${iconAlias}"`);
    if (Array.isArray(icon)) {
      return {
        component: VSvgIcon,
        icon
      };
    } else if (typeof icon !== "string") {
      return {
        component: VComponentIcon,
        icon
      };
    }
    const iconSetName = Object.keys(icons.sets).find((setName) => typeof icon === "string" && icon.startsWith(`${setName}:`));
    const iconName = iconSetName ? icon.slice(iconSetName.length + 1) : icon;
    const iconSet = icons.sets[iconSetName ?? icons.defaultSet];
    return {
      component: iconSet.component,
      icon: iconName
    };
  });
  return {
    iconData
  };
};
const aliases = {
  collapse: "fas fa-chevron-up",
  complete: "fas fa-check",
  cancel: "fas fa-times-circle",
  close: "fas fa-times",
  delete: "fas fa-times-circle",
  // delete (e.g. v-chip close)
  clear: "fas fa-times-circle",
  // delete (e.g. v-chip close)
  success: "fas fa-check-circle",
  info: "fas fa-info-circle",
  warning: "fas fa-exclamation",
  error: "fas fa-exclamation-triangle",
  prev: "fas fa-chevron-left",
  next: "fas fa-chevron-right",
  checkboxOn: "fas fa-check-square",
  checkboxOff: "far fa-square",
  // note 'far'
  checkboxIndeterminate: "fas fa-minus-square",
  delimiter: "fas fa-circle",
  // for carousel
  sortAsc: "fas fa-arrow-up",
  sortDesc: "fas fa-arrow-down",
  expand: "fas fa-chevron-down",
  menu: "fas fa-bars",
  subgroup: "fas fa-caret-down",
  dropdown: "fas fa-caret-down",
  radioOn: "far fa-dot-circle",
  radioOff: "far fa-circle",
  edit: "fas fa-edit",
  ratingEmpty: "far fa-star",
  ratingFull: "fas fa-star",
  ratingHalf: "fas fa-star-half",
  loading: "fas fa-sync",
  first: "fas fa-step-backward",
  last: "fas fa-step-forward",
  unfold: "fas fa-arrows-alt-v",
  file: "fas fa-paperclip",
  plus: "fas fa-plus",
  minus: "fas fa-minus",
  calendar: "fas fa-calendar",
  eyeDropper: "fas fa-eye-dropper"
};
const fa = {
  component: VClassIcon
};
const en = {
  badge: "Badge",
  open: "Open",
  close: "Close",
  confirmEdit: {
    ok: "OK",
    cancel: "Cancel"
  },
  dataIterator: {
    noResultsText: "No matching records found",
    loadingText: "Loading items..."
  },
  dataTable: {
    itemsPerPageText: "Rows per page:",
    ariaLabel: {
      sortDescending: "Sorted descending.",
      sortAscending: "Sorted ascending.",
      sortNone: "Not sorted.",
      activateNone: "Activate to remove sorting.",
      activateDescending: "Activate to sort descending.",
      activateAscending: "Activate to sort ascending."
    },
    sortBy: "Sort by"
  },
  dataFooter: {
    itemsPerPageText: "Items per page:",
    itemsPerPageAll: "All",
    nextPage: "Next page",
    prevPage: "Previous page",
    firstPage: "First page",
    lastPage: "Last page",
    pageText: "{0}-{1} of {2}"
  },
  dateRangeInput: {
    divider: "to"
  },
  datePicker: {
    itemsSelected: "{0} selected",
    range: {
      title: "Select dates",
      header: "Enter dates"
    },
    title: "Select date",
    header: "Enter date",
    input: {
      placeholder: "Enter date"
    }
  },
  noDataText: "No data available",
  carousel: {
    prev: "Previous visual",
    next: "Next visual",
    ariaLabel: {
      delimiter: "Carousel slide {0} of {1}"
    }
  },
  calendar: {
    moreEvents: "{0} more"
  },
  input: {
    clear: "Clear {0}",
    prependAction: "{0} prepended action",
    appendAction: "{0} appended action",
    otp: "Please enter OTP character {0}"
  },
  fileInput: {
    counter: "{0} files",
    counterSize: "{0} files ({1} in total)"
  },
  timePicker: {
    am: "AM",
    pm: "PM"
  },
  pagination: {
    ariaLabel: {
      root: "Pagination Navigation",
      next: "Next page",
      previous: "Previous page",
      page: "Go to page {0}",
      currentPage: "Page {0}, Current page",
      first: "First page",
      last: "Last page"
    }
  },
  stepper: {
    next: "Next",
    prev: "Previous"
  },
  rating: {
    ariaLabel: {
      item: "Rating {0} of {1}"
    }
  },
  loading: "Loading...",
  infiniteScroll: {
    loadMore: "Load more",
    empty: "No more"
  }
};
const defaultRtl = {
  af: false,
  ar: true,
  bg: false,
  ca: false,
  ckb: false,
  cs: false,
  de: false,
  el: false,
  en: false,
  es: false,
  et: false,
  fa: true,
  fi: false,
  fr: false,
  hr: false,
  hu: false,
  he: true,
  id: false,
  it: false,
  ja: false,
  ko: false,
  lv: false,
  lt: false,
  nl: false,
  no: false,
  pl: false,
  pt: false,
  ro: false,
  ru: false,
  sk: false,
  sl: false,
  srCyrl: false,
  srLatn: false,
  sv: false,
  th: false,
  tr: false,
  az: false,
  uk: false,
  vi: false,
  zhHans: false,
  zhHant: false
};
function useToggleScope(source, fn) {
  let scope;
  function start() {
    scope = effectScope();
    scope.run(() => fn.length ? fn(() => {
      scope?.stop();
      start();
    }) : fn());
  }
  watch(source, (active) => {
    if (active && !scope) {
      start();
    } else if (!active) {
      scope?.stop();
      scope = void 0;
    }
  }, {
    immediate: true
  });
  onScopeDispose(() => {
    scope?.stop();
  });
}
function useProxiedModel(props, prop, defaultValue) {
  let transformIn = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : (v) => v;
  let transformOut = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : (v) => v;
  const vm = getCurrentInstance("useProxiedModel");
  const internal = ref(props[prop] !== void 0 ? props[prop] : defaultValue);
  const kebabProp = toKebabCase(prop);
  const checkKebab = kebabProp !== prop;
  const isControlled = checkKebab ? computed(() => {
    void props[prop];
    return !!((vm.vnode.props?.hasOwnProperty(prop) || vm.vnode.props?.hasOwnProperty(kebabProp)) && (vm.vnode.props?.hasOwnProperty(`onUpdate:${prop}`) || vm.vnode.props?.hasOwnProperty(`onUpdate:${kebabProp}`)));
  }) : computed(() => {
    void props[prop];
    return !!(vm.vnode.props?.hasOwnProperty(prop) && vm.vnode.props?.hasOwnProperty(`onUpdate:${prop}`));
  });
  useToggleScope(() => !isControlled.value, () => {
    watch(() => props[prop], (val) => {
      internal.value = val;
    });
  });
  const model = computed({
    get() {
      const externalValue = props[prop];
      return transformIn(isControlled.value ? externalValue : internal.value);
    },
    set(internalValue) {
      const newValue = transformOut(internalValue);
      const value = toRaw(isControlled.value ? props[prop] : internal.value);
      if (value === newValue || transformIn(value) === internalValue) {
        return;
      }
      internal.value = newValue;
      vm?.emit(`update:${prop}`, newValue);
    }
  });
  Object.defineProperty(model, "externalValue", {
    get: () => isControlled.value ? props[prop] : internal.value
  });
  return model;
}
const LANG_PREFIX = "$vuetify.";
const replace = (str, params) => {
  return str.replace(/\{(\d+)\}/g, (match, index) => {
    return String(params[+index]);
  });
};
const createTranslateFunction = (current, fallback, messages) => {
  return function(key) {
    for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      params[_key - 1] = arguments[_key];
    }
    if (!key.startsWith(LANG_PREFIX)) {
      return replace(key, params);
    }
    const shortKey = key.replace(LANG_PREFIX, "");
    const currentLocale = current.value && messages.value[current.value];
    const fallbackLocale = fallback.value && messages.value[fallback.value];
    let str = getObjectValueByPath(currentLocale, shortKey, null);
    if (!str) {
      consoleWarn(`Translation key "${key}" not found in "${current.value}", trying fallback locale`);
      str = getObjectValueByPath(fallbackLocale, shortKey, null);
    }
    if (!str) {
      str = key;
    }
    if (typeof str !== "string") {
      str = key;
    }
    return replace(str, params);
  };
};
function createNumberFunction(current, fallback) {
  return (value, options) => {
    const numberFormat = new Intl.NumberFormat([current.value, fallback.value], options);
    return numberFormat.format(value);
  };
}
function useProvided(props, prop, provided) {
  const internal = useProxiedModel(props, prop, props[prop] ?? provided.value);
  internal.value = props[prop] ?? provided.value;
  watch(provided, (v) => {
    if (props[prop] == null) {
      internal.value = provided.value;
    }
  });
  return internal;
}
function createProvideFunction(state) {
  return (props) => {
    const current = useProvided(props, "locale", state.current);
    const fallback = useProvided(props, "fallback", state.fallback);
    const messages = useProvided(props, "messages", state.messages);
    return {
      name: "vuetify",
      current,
      fallback,
      messages,
      t: createTranslateFunction(current, fallback, messages),
      n: createNumberFunction(current, fallback),
      provide: createProvideFunction({
        current,
        fallback,
        messages
      })
    };
  };
}
function createVuetifyAdapter(options) {
  const current = shallowRef(options?.locale ?? "en");
  const fallback = shallowRef(options?.fallback ?? "en");
  const messages = ref({
    en,
    ...options?.messages
  });
  return {
    name: "vuetify",
    current,
    fallback,
    messages,
    t: createTranslateFunction(current, fallback, messages),
    n: createNumberFunction(current, fallback),
    provide: createProvideFunction({
      current,
      fallback,
      messages
    })
  };
}
const LocaleSymbol = Symbol.for("vuetify:locale");
function isLocaleInstance(obj) {
  return obj.name != null;
}
function createLocale(options) {
  const i18n = options?.adapter && isLocaleInstance(options?.adapter) ? options?.adapter : createVuetifyAdapter(options);
  const rtl = createRtl(i18n, options);
  return {
    ...i18n,
    ...rtl
  };
}
function useLocale() {
  const locale = inject$1(LocaleSymbol);
  if (!locale)
    throw new Error("[Vuetify] Could not find injected locale instance");
  return locale;
}
function provideLocale(props) {
  const locale = inject$1(LocaleSymbol);
  if (!locale)
    throw new Error("[Vuetify] Could not find injected locale instance");
  const i18n = locale.provide(props);
  const rtl = provideRtl(i18n, locale.rtl, props);
  const data = {
    ...i18n,
    ...rtl
  };
  provide(LocaleSymbol, data);
  return data;
}
function createRtl(i18n, options) {
  const rtl = ref(options?.rtl ?? defaultRtl);
  const isRtl = computed(() => rtl.value[i18n.current.value] ?? false);
  return {
    isRtl,
    rtl,
    rtlClasses: computed(() => `v-locale--is-${isRtl.value ? "rtl" : "ltr"}`)
  };
}
function provideRtl(locale, rtl, props) {
  const isRtl = computed(() => props.rtl ?? rtl.value[locale.current.value] ?? false);
  return {
    isRtl,
    rtl,
    rtlClasses: computed(() => `v-locale--is-${isRtl.value ? "rtl" : "ltr"}`)
  };
}
function useRtl() {
  const locale = inject$1(LocaleSymbol);
  if (!locale)
    throw new Error("[Vuetify] Could not find injected rtl instance");
  return {
    isRtl: locale.isRtl,
    rtlClasses: locale.rtlClasses
  };
}
const firstDay = {
  "001": 1,
  AD: 1,
  AE: 6,
  AF: 6,
  AG: 0,
  AI: 1,
  AL: 1,
  AM: 1,
  AN: 1,
  AR: 1,
  AS: 0,
  AT: 1,
  AU: 1,
  AX: 1,
  AZ: 1,
  BA: 1,
  BD: 0,
  BE: 1,
  BG: 1,
  BH: 6,
  BM: 1,
  BN: 1,
  BR: 0,
  BS: 0,
  BT: 0,
  BW: 0,
  BY: 1,
  BZ: 0,
  CA: 0,
  CH: 1,
  CL: 1,
  CM: 1,
  CN: 1,
  CO: 0,
  CR: 1,
  CY: 1,
  CZ: 1,
  DE: 1,
  DJ: 6,
  DK: 1,
  DM: 0,
  DO: 0,
  DZ: 6,
  EC: 1,
  EE: 1,
  EG: 6,
  ES: 1,
  ET: 0,
  FI: 1,
  FJ: 1,
  FO: 1,
  FR: 1,
  GB: 1,
  "GB-alt-variant": 0,
  GE: 1,
  GF: 1,
  GP: 1,
  GR: 1,
  GT: 0,
  GU: 0,
  HK: 0,
  HN: 0,
  HR: 1,
  HU: 1,
  ID: 0,
  IE: 1,
  IL: 0,
  IN: 0,
  IQ: 6,
  IR: 6,
  IS: 1,
  IT: 1,
  JM: 0,
  JO: 6,
  JP: 0,
  KE: 0,
  KG: 1,
  KH: 0,
  KR: 0,
  KW: 6,
  KZ: 1,
  LA: 0,
  LB: 1,
  LI: 1,
  LK: 1,
  LT: 1,
  LU: 1,
  LV: 1,
  LY: 6,
  MC: 1,
  MD: 1,
  ME: 1,
  MH: 0,
  MK: 1,
  MM: 0,
  MN: 1,
  MO: 0,
  MQ: 1,
  MT: 0,
  MV: 5,
  MX: 0,
  MY: 1,
  MZ: 0,
  NI: 0,
  NL: 1,
  NO: 1,
  NP: 0,
  NZ: 1,
  OM: 6,
  PA: 0,
  PE: 0,
  PH: 0,
  PK: 0,
  PL: 1,
  PR: 0,
  PT: 0,
  PY: 0,
  QA: 6,
  RE: 1,
  RO: 1,
  RS: 1,
  RU: 1,
  SA: 0,
  SD: 6,
  SE: 1,
  SG: 0,
  SI: 1,
  SK: 1,
  SM: 1,
  SV: 0,
  SY: 6,
  TH: 0,
  TJ: 1,
  TM: 1,
  TR: 1,
  TT: 0,
  TW: 0,
  UA: 1,
  UM: 0,
  US: 0,
  UY: 1,
  UZ: 1,
  VA: 1,
  VE: 0,
  VI: 0,
  VN: 1,
  WS: 0,
  XK: 1,
  YE: 0,
  ZA: 0,
  ZW: 0
};
function getWeekArray(date2, locale) {
  const weeks = [];
  let currentWeek = [];
  const firstDayOfMonth = startOfMonth(date2);
  const lastDayOfMonth = endOfMonth(date2);
  const firstDayWeekIndex = (firstDayOfMonth.getDay() - firstDay[locale.slice(-2).toUpperCase()] + 7) % 7;
  const lastDayWeekIndex = (lastDayOfMonth.getDay() - firstDay[locale.slice(-2).toUpperCase()] + 7) % 7;
  for (let i = 0; i < firstDayWeekIndex; i++) {
    const adjacentDay = new Date(firstDayOfMonth);
    adjacentDay.setDate(adjacentDay.getDate() - (firstDayWeekIndex - i));
    currentWeek.push(adjacentDay);
  }
  for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
    const day = new Date(date2.getFullYear(), date2.getMonth(), i);
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  for (let i = 1; i < 7 - lastDayWeekIndex; i++) {
    const adjacentDay = new Date(lastDayOfMonth);
    adjacentDay.setDate(adjacentDay.getDate() + i);
    currentWeek.push(adjacentDay);
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }
  return weeks;
}
function startOfMonth(date2) {
  return new Date(date2.getFullYear(), date2.getMonth(), 1);
}
function endOfMonth(date2) {
  return new Date(date2.getFullYear(), date2.getMonth() + 1, 0);
}
function parseLocalDate(value) {
  const parts = value.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}
const _YYYMMDD = /^([12]\d{3}-([1-9]|0[1-9]|1[0-2])-([1-9]|0[1-9]|[12]\d|3[01]))$/;
function date(value) {
  if (value == null)
    return /* @__PURE__ */ new Date();
  if (value instanceof Date)
    return value;
  if (typeof value === "string") {
    let parsed;
    if (_YYYMMDD.test(value)) {
      return parseLocalDate(value);
    } else {
      parsed = Date.parse(value);
    }
    if (!isNaN(parsed))
      return new Date(parsed);
  }
  return null;
}
const sundayJanuarySecond2000 = new Date(2e3, 0, 2);
function getWeekdays(locale) {
  const daysFromSunday = firstDay[locale.slice(-2).toUpperCase()];
  return createRange(7).map((i) => {
    const weekday = new Date(sundayJanuarySecond2000);
    weekday.setDate(sundayJanuarySecond2000.getDate() + daysFromSunday + i);
    return new Intl.DateTimeFormat(locale, {
      weekday: "narrow"
    }).format(weekday);
  });
}
function format(value, formatString, locale, formats) {
  const newDate = date(value) ?? /* @__PURE__ */ new Date();
  const customFormat = formats?.[formatString];
  if (typeof customFormat === "function") {
    return customFormat(newDate, formatString, locale);
  }
  let options = {};
  switch (formatString) {
    case "fullDateWithWeekday":
      options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      };
      break;
    case "normalDateWithWeekday":
      options = {
        weekday: "short",
        day: "numeric",
        month: "short"
      };
      break;
    case "keyboardDate":
      options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      };
      break;
    case "monthAndDate":
      options = {
        month: "long",
        day: "numeric"
      };
      break;
    case "monthAndYear":
      options = {
        month: "long",
        year: "numeric"
      };
      break;
    case "month":
      options = {
        month: "long"
      };
      break;
    case "monthShort":
      options = {
        month: "short"
      };
      break;
    case "dayOfMonth":
      options = {
        day: "numeric"
      };
      break;
    case "shortDate":
      options = {
        year: "2-digit",
        month: "numeric",
        day: "numeric"
      };
      break;
    case "year":
      options = {
        year: "numeric"
      };
      break;
    default:
      options = customFormat ?? {
        timeZone: "UTC",
        timeZoneName: "short"
      };
  }
  return new Intl.DateTimeFormat(locale, options).format(newDate);
}
function toISO(adapter, value) {
  const date2 = adapter.toJsDate(value);
  const year = date2.getFullYear();
  const month = padStart(String(date2.getMonth() + 1), 2, "0");
  const day = padStart(String(date2.getDate()), 2, "0");
  return `${year}-${month}-${day}`;
}
function parseISO(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function addDays(date2, amount) {
  const d = new Date(date2);
  d.setDate(d.getDate() + amount);
  return d;
}
function addMonths(date2, amount) {
  const d = new Date(date2);
  d.setMonth(d.getMonth() + amount);
  return d;
}
function getYear(date2) {
  return date2.getFullYear();
}
function getMonth(date2) {
  return date2.getMonth();
}
function getNextMonth(date2) {
  return new Date(date2.getFullYear(), date2.getMonth() + 1, 1);
}
function startOfYear(date2) {
  return new Date(date2.getFullYear(), 0, 1);
}
function endOfYear(date2) {
  return new Date(date2.getFullYear(), 11, 31);
}
function isWithinRange(date2, range) {
  return isAfter(date2, range[0]) && isBefore(date2, range[1]);
}
function isValid(date2) {
  const d = new Date(date2);
  return d instanceof Date && !isNaN(d.getTime());
}
function isAfter(date2, comparing) {
  return date2.getTime() > comparing.getTime();
}
function isBefore(date2, comparing) {
  return date2.getTime() < comparing.getTime();
}
function isEqual(date2, comparing) {
  return date2.getTime() === comparing.getTime();
}
function isSameDay(date2, comparing) {
  return date2.getDate() === comparing.getDate() && date2.getMonth() === comparing.getMonth() && date2.getFullYear() === comparing.getFullYear();
}
function isSameMonth(date2, comparing) {
  return date2.getMonth() === comparing.getMonth() && date2.getFullYear() === comparing.getFullYear();
}
function getDiff(date2, comparing, unit) {
  const d = new Date(date2);
  const c = new Date(comparing);
  if (unit === "month") {
    return d.getMonth() - c.getMonth() + (d.getFullYear() - c.getFullYear()) * 12;
  }
  return Math.floor((d.getTime() - c.getTime()) / (1e3 * 60 * 60 * 24));
}
function setMonth(date2, count) {
  const d = new Date(date2);
  d.setMonth(count);
  return d;
}
function setYear(date2, year) {
  const d = new Date(date2);
  d.setFullYear(year);
  return d;
}
function startOfDay(date2) {
  return new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
}
function endOfDay(date2) {
  return new Date(date2.getFullYear(), date2.getMonth(), date2.getDate(), 23, 59, 59, 999);
}
class VuetifyDateAdapter {
  constructor(options) {
    this.locale = options.locale;
    this.formats = options.formats;
  }
  date(value) {
    return date(value);
  }
  toJsDate(date2) {
    return date2;
  }
  toISO(date2) {
    return toISO(this, date2);
  }
  parseISO(date2) {
    return parseISO(date2);
  }
  addDays(date2, amount) {
    return addDays(date2, amount);
  }
  addMonths(date2, amount) {
    return addMonths(date2, amount);
  }
  getWeekArray(date2) {
    return getWeekArray(date2, this.locale);
  }
  startOfMonth(date2) {
    return startOfMonth(date2);
  }
  endOfMonth(date2) {
    return endOfMonth(date2);
  }
  format(date2, formatString) {
    return format(date2, formatString, this.locale, this.formats);
  }
  isEqual(date2, comparing) {
    return isEqual(date2, comparing);
  }
  isValid(date2) {
    return isValid(date2);
  }
  isWithinRange(date2, range) {
    return isWithinRange(date2, range);
  }
  isAfter(date2, comparing) {
    return isAfter(date2, comparing);
  }
  isBefore(date2, comparing) {
    return !isAfter(date2, comparing) && !isEqual(date2, comparing);
  }
  isSameDay(date2, comparing) {
    return isSameDay(date2, comparing);
  }
  isSameMonth(date2, comparing) {
    return isSameMonth(date2, comparing);
  }
  setMonth(date2, count) {
    return setMonth(date2, count);
  }
  setYear(date2, year) {
    return setYear(date2, year);
  }
  getDiff(date2, comparing, unit) {
    return getDiff(date2, comparing, unit);
  }
  getWeekdays() {
    return getWeekdays(this.locale);
  }
  getYear(date2) {
    return getYear(date2);
  }
  getMonth(date2) {
    return getMonth(date2);
  }
  getNextMonth(date2) {
    return getNextMonth(date2);
  }
  startOfDay(date2) {
    return startOfDay(date2);
  }
  endOfDay(date2) {
    return endOfDay(date2);
  }
  startOfYear(date2) {
    return startOfYear(date2);
  }
  endOfYear(date2) {
    return endOfYear(date2);
  }
}
const DateOptionsSymbol = Symbol.for("vuetify:date-options");
const DateAdapterSymbol = Symbol.for("vuetify:date-adapter");
function createDate(options, locale) {
  const _options = mergeDeep({
    adapter: VuetifyDateAdapter,
    locale: {
      af: "af-ZA",
      // ar: '', # not the same value for all variants
      bg: "bg-BG",
      ca: "ca-ES",
      ckb: "",
      cs: "cs-CZ",
      de: "de-DE",
      el: "el-GR",
      en: "en-US",
      // es: '', # not the same value for all variants
      et: "et-EE",
      fa: "fa-IR",
      fi: "fi-FI",
      // fr: '', #not the same value for all variants
      hr: "hr-HR",
      hu: "hu-HU",
      he: "he-IL",
      id: "id-ID",
      it: "it-IT",
      ja: "ja-JP",
      ko: "ko-KR",
      lv: "lv-LV",
      lt: "lt-LT",
      nl: "nl-NL",
      no: "no-NO",
      pl: "pl-PL",
      pt: "pt-PT",
      ro: "ro-RO",
      ru: "ru-RU",
      sk: "sk-SK",
      sl: "sl-SI",
      srCyrl: "sr-SP",
      srLatn: "sr-SP",
      sv: "sv-SE",
      th: "th-TH",
      tr: "tr-TR",
      az: "az-AZ",
      uk: "uk-UA",
      vi: "vi-VN",
      zhHans: "zh-CN",
      zhHant: "zh-TW"
    }
  }, options);
  return {
    options: _options,
    instance: createInstance(_options, locale)
  };
}
function createInstance(options, locale) {
  const instance = reactive(typeof options.adapter === "function" ? new options.adapter({
    locale: options.locale[locale.current.value] ?? locale.current.value,
    formats: options.formats
  }) : options.adapter);
  watch(locale.current, (value) => {
    instance.locale = options.locale[value] ?? value ?? instance.locale;
  });
  return instance;
}
function useDate() {
  const options = inject$1(DateOptionsSymbol);
  if (!options)
    throw new Error("[Vuetify] Could not find injected date options");
  const locale = useLocale();
  return createInstance(options, locale);
}
function getWeek(adapter, value) {
  const date2 = adapter.toJsDate(value);
  let year = adapter.getYear(date2);
  let d1w1 = adapter.startOfYear(date2);
  if (date2 < d1w1) {
    year = year - 1;
    d1w1 = adapter.startOfYear(adapter.setYear(date2, year));
  } else {
    const tv = adapter.startOfYear(adapter.setYear(date2, year + 1));
    if (date2 >= tv) {
      year = year + 1;
      d1w1 = tv;
    }
  }
  const diffTime = Math.abs(date2.getTime() - d1w1.getTime());
  const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
  return Math.floor(diffDays / 7) + 1;
}
const breakpoints = ["sm", "md", "lg", "xl", "xxl"];
const DisplaySymbol = Symbol.for("vuetify:display");
const defaultDisplayOptions = {
  mobileBreakpoint: "lg",
  thresholds: {
    xs: 0,
    sm: 600,
    md: 960,
    lg: 1280,
    xl: 1920,
    xxl: 2560
  }
};
const parseDisplayOptions = function() {
  let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : defaultDisplayOptions;
  return mergeDeep(defaultDisplayOptions, options);
};
function getClientWidth(ssr) {
  return IN_BROWSER && !ssr ? window.innerWidth : typeof ssr === "object" && ssr.clientWidth || 0;
}
function getClientHeight(ssr) {
  return IN_BROWSER && !ssr ? window.innerHeight : typeof ssr === "object" && ssr.clientHeight || 0;
}
function getPlatform(ssr) {
  const userAgent = IN_BROWSER && !ssr ? window.navigator.userAgent : "ssr";
  function match(regexp) {
    return Boolean(userAgent.match(regexp));
  }
  const android = match(/android/i);
  const ios = match(/iphone|ipad|ipod/i);
  const cordova = match(/cordova/i);
  const electron = match(/electron/i);
  const chrome = match(/chrome/i);
  const edge = match(/edge/i);
  const firefox = match(/firefox/i);
  const opera = match(/opera/i);
  const win = match(/win/i);
  const mac = match(/mac/i);
  const linux = match(/linux/i);
  return {
    android,
    ios,
    cordova,
    electron,
    chrome,
    edge,
    firefox,
    opera,
    win,
    mac,
    linux,
    touch: SUPPORTS_TOUCH,
    ssr: userAgent === "ssr"
  };
}
function createDisplay(options, ssr) {
  const {
    thresholds,
    mobileBreakpoint
  } = parseDisplayOptions(options);
  const height = shallowRef(getClientHeight(ssr));
  const platform = shallowRef(getPlatform(ssr));
  const state = reactive({});
  const width = shallowRef(getClientWidth(ssr));
  function updateSize() {
    height.value = getClientHeight();
    width.value = getClientWidth();
  }
  function update() {
    updateSize();
    platform.value = getPlatform();
  }
  watchEffect(() => {
    const xs = width.value < thresholds.sm;
    const sm = width.value < thresholds.md && !xs;
    const md = width.value < thresholds.lg && !(sm || xs);
    const lg = width.value < thresholds.xl && !(md || sm || xs);
    const xl = width.value < thresholds.xxl && !(lg || md || sm || xs);
    const xxl = width.value >= thresholds.xxl;
    const name = xs ? "xs" : sm ? "sm" : md ? "md" : lg ? "lg" : xl ? "xl" : "xxl";
    const breakpointValue = typeof mobileBreakpoint === "number" ? mobileBreakpoint : thresholds[mobileBreakpoint];
    const mobile = width.value < breakpointValue;
    state.xs = xs;
    state.sm = sm;
    state.md = md;
    state.lg = lg;
    state.xl = xl;
    state.xxl = xxl;
    state.smAndUp = !xs;
    state.mdAndUp = !(xs || sm);
    state.lgAndUp = !(xs || sm || md);
    state.xlAndUp = !(xs || sm || md || lg);
    state.smAndDown = !(md || lg || xl || xxl);
    state.mdAndDown = !(lg || xl || xxl);
    state.lgAndDown = !(xl || xxl);
    state.xlAndDown = !xxl;
    state.name = name;
    state.height = height.value;
    state.width = width.value;
    state.mobile = mobile;
    state.mobileBreakpoint = mobileBreakpoint;
    state.platform = platform.value;
    state.thresholds = thresholds;
  });
  if (IN_BROWSER) {
    window.addEventListener("resize", updateSize, {
      passive: true
    });
  }
  return {
    ...toRefs(state),
    update,
    ssr: !!ssr
  };
}
const makeDisplayProps = propsFactory({
  mobileBreakpoint: [Number, String]
}, "display");
function useDisplay() {
  let props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const display = inject$1(DisplaySymbol);
  if (!display)
    throw new Error("Could not find Vuetify display injection");
  const mobile = computed(() => {
    if (!props.mobileBreakpoint)
      return display.mobile.value;
    const breakpointValue = typeof props.mobileBreakpoint === "number" ? props.mobileBreakpoint : display.thresholds.value[props.mobileBreakpoint];
    return display.width.value < breakpointValue;
  });
  const displayClasses = computed(() => {
    if (!name)
      return {};
    return {
      [`${name}--mobile`]: mobile.value
    };
  });
  return {
    ...display,
    displayClasses,
    mobile
  };
}
const ThemeSymbol = Symbol.for("vuetify:theme");
const makeThemeProps = propsFactory({
  theme: String
}, "theme");
function genDefaults() {
  return {
    defaultTheme: "light",
    variations: {
      colors: [],
      lighten: 0,
      darken: 0
    },
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#FFFFFF",
          surface: "#FFFFFF",
          "surface-bright": "#FFFFFF",
          "surface-variant": "#424242",
          "on-surface-variant": "#EEEEEE",
          primary: "#1867C0",
          "primary-darken-1": "#1F5592",
          secondary: "#48A9A6",
          "secondary-darken-1": "#018786",
          error: "#B00020",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00"
        },
        variables: {
          "border-color": "#000000",
          "border-opacity": 0.12,
          "high-emphasis-opacity": 0.87,
          "medium-emphasis-opacity": 0.6,
          "disabled-opacity": 0.38,
          "idle-opacity": 0.04,
          "hover-opacity": 0.04,
          "focus-opacity": 0.12,
          "selected-opacity": 0.08,
          "activated-opacity": 0.12,
          "pressed-opacity": 0.12,
          "dragged-opacity": 0.08,
          "theme-kbd": "#212529",
          "theme-on-kbd": "#FFFFFF",
          "theme-code": "#F5F5F5",
          "theme-on-code": "#000000"
        }
      },
      dark: {
        dark: true,
        colors: {
          background: "#121212",
          surface: "#212121",
          "surface-bright": "#ccbfd6",
          "surface-variant": "#a3a3a3",
          "on-surface-variant": "#424242",
          primary: "#2196F3",
          "primary-darken-1": "#277CC1",
          secondary: "#54B6B2",
          "secondary-darken-1": "#48A9A6",
          error: "#CF6679",
          info: "#2196F3",
          success: "#4CAF50",
          warning: "#FB8C00"
        },
        variables: {
          "border-color": "#FFFFFF",
          "border-opacity": 0.12,
          "high-emphasis-opacity": 1,
          "medium-emphasis-opacity": 0.7,
          "disabled-opacity": 0.5,
          "idle-opacity": 0.1,
          "hover-opacity": 0.04,
          "focus-opacity": 0.12,
          "selected-opacity": 0.08,
          "activated-opacity": 0.12,
          "pressed-opacity": 0.16,
          "dragged-opacity": 0.08,
          "theme-kbd": "#212529",
          "theme-on-kbd": "#FFFFFF",
          "theme-code": "#343434",
          "theme-on-code": "#CCCCCC"
        }
      }
    }
  };
}
function parseThemeOptions() {
  let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : genDefaults();
  const defaults = genDefaults();
  if (!options)
    return {
      ...defaults,
      isDisabled: true
    };
  const themes = {};
  for (const [key, theme] of Object.entries(options.themes ?? {})) {
    const defaultTheme = theme.dark || key === "dark" ? defaults.themes?.dark : defaults.themes?.light;
    themes[key] = mergeDeep(defaultTheme, theme);
  }
  return mergeDeep(defaults, {
    ...options,
    themes
  });
}
function createTheme(options) {
  const parsedOptions = parseThemeOptions(options);
  const name = ref(parsedOptions.defaultTheme);
  const themes = ref(parsedOptions.themes);
  const computedThemes = computed(() => {
    const acc = {};
    for (const [name2, original] of Object.entries(themes.value)) {
      const theme = acc[name2] = {
        ...original,
        colors: {
          ...original.colors
        }
      };
      if (parsedOptions.variations) {
        for (const name3 of parsedOptions.variations.colors) {
          const color = theme.colors[name3];
          if (!color)
            continue;
          for (const variation of ["lighten", "darken"]) {
            const fn = variation === "lighten" ? lighten : darken;
            for (const amount of createRange(parsedOptions.variations[variation], 1)) {
              theme.colors[`${name3}-${variation}-${amount}`] = RGBtoHex(fn(parseColor(color), amount));
            }
          }
        }
      }
      for (const color of Object.keys(theme.colors)) {
        if (/^on-[a-z]/.test(color) || theme.colors[`on-${color}`])
          continue;
        const onColor = `on-${color}`;
        const colorVal = parseColor(theme.colors[color]);
        theme.colors[onColor] = getForeground(colorVal);
      }
    }
    return acc;
  });
  const current = computed(() => computedThemes.value[name.value]);
  const styles = computed(() => {
    const lines = [];
    if (current.value.dark) {
      createCssClass(lines, ":root", ["color-scheme: dark"]);
    }
    createCssClass(lines, ":root", genCssVariables(current.value));
    for (const [themeName, theme] of Object.entries(computedThemes.value)) {
      createCssClass(lines, `.v-theme--${themeName}`, [`color-scheme: ${theme.dark ? "dark" : "normal"}`, ...genCssVariables(theme)]);
    }
    const bgLines = [];
    const fgLines = [];
    const colors2 = new Set(Object.values(computedThemes.value).flatMap((theme) => Object.keys(theme.colors)));
    for (const key of colors2) {
      if (/^on-[a-z]/.test(key)) {
        createCssClass(fgLines, `.${key}`, [`color: rgb(var(--v-theme-${key})) !important`]);
      } else {
        createCssClass(bgLines, `.bg-${key}`, [`--v-theme-overlay-multiplier: var(--v-theme-${key}-overlay-multiplier)`, `background-color: rgb(var(--v-theme-${key})) !important`, `color: rgb(var(--v-theme-on-${key})) !important`]);
        createCssClass(fgLines, `.text-${key}`, [`color: rgb(var(--v-theme-${key})) !important`]);
        createCssClass(fgLines, `.border-${key}`, [`--v-border-color: var(--v-theme-${key})`]);
      }
    }
    lines.push(...bgLines, ...fgLines);
    return lines.map((str, i) => i === 0 ? str : `    ${str}`).join("");
  });
  function getHead() {
    return {
      style: [{
        children: styles.value,
        id: "vuetify-theme-stylesheet",
        nonce: parsedOptions.cspNonce || false
      }]
    };
  }
  function install(app2) {
    if (parsedOptions.isDisabled)
      return;
    const head = app2._context.provides.usehead;
    if (head) {
      if (head.push) {
        const entry = head.push(getHead);
        if (IN_BROWSER) {
          watch(styles, () => {
            entry.patch(getHead);
          });
        }
      } else {
        if (IN_BROWSER) {
          head.addHeadObjs(computed(getHead));
          watchEffect(() => head.updateDOM());
        } else {
          head.addHeadObjs(getHead());
        }
      }
    } else {
      let updateStyles = function() {
        if (typeof document !== "undefined" && !styleEl) {
          const el = document.createElement("style");
          el.type = "text/css";
          el.id = "vuetify-theme-stylesheet";
          if (parsedOptions.cspNonce)
            el.setAttribute("nonce", parsedOptions.cspNonce);
          styleEl = el;
          document.head.appendChild(styleEl);
        }
        if (styleEl)
          styleEl.innerHTML = styles.value;
      };
      let styleEl = IN_BROWSER ? document.getElementById("vuetify-theme-stylesheet") : null;
      if (IN_BROWSER) {
        watch(styles, updateStyles, {
          immediate: true
        });
      } else {
        updateStyles();
      }
    }
  }
  const themeClasses = computed(() => parsedOptions.isDisabled ? void 0 : `v-theme--${name.value}`);
  return {
    install,
    isDisabled: parsedOptions.isDisabled,
    name,
    themes,
    current,
    computedThemes,
    themeClasses,
    styles,
    global: {
      name,
      current
    }
  };
}
function provideTheme(props) {
  getCurrentInstance("provideTheme");
  const theme = inject$1(ThemeSymbol, null);
  if (!theme)
    throw new Error("Could not find Vuetify theme injection");
  const name = computed(() => {
    return props.theme ?? theme.name.value;
  });
  const current = computed(() => theme.themes.value[name.value]);
  const themeClasses = computed(() => theme.isDisabled ? void 0 : `v-theme--${name.value}`);
  const newTheme = {
    ...theme,
    name,
    current,
    themeClasses
  };
  provide(ThemeSymbol, newTheme);
  return newTheme;
}
function useTheme() {
  getCurrentInstance("useTheme");
  const theme = inject$1(ThemeSymbol, null);
  if (!theme)
    throw new Error("Could not find Vuetify theme injection");
  return theme;
}
function createCssClass(lines, selector, content) {
  lines.push(`${selector} {
`, ...content.map((line) => `  ${line};
`), "}\n");
}
function genCssVariables(theme) {
  const lightOverlay = theme.dark ? 2 : 1;
  const darkOverlay = theme.dark ? 1 : 2;
  const variables = [];
  for (const [key, value] of Object.entries(theme.colors)) {
    const rgb2 = parseColor(value);
    variables.push(`--v-theme-${key}: ${rgb2.r},${rgb2.g},${rgb2.b}`);
    if (!key.startsWith("on-")) {
      variables.push(`--v-theme-${key}-overlay-multiplier: ${getLuma(value) > 0.18 ? lightOverlay : darkOverlay}`);
    }
  }
  for (const [key, value] of Object.entries(theme.variables)) {
    const color = typeof value === "string" && value.startsWith("#") ? parseColor(value) : void 0;
    const rgb2 = color ? `${color.r}, ${color.g}, ${color.b}` : void 0;
    variables.push(`--v-${key}: ${rgb2 ?? value}`);
  }
  return variables;
}
function useResizeObserver(callback) {
  let box = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
  const resizeRef = ref();
  const contentRect = ref();
  if (IN_BROWSER) {
    const observer = new ResizeObserver((entries) => {
      callback?.(entries, observer);
      if (!entries.length)
        return;
      if (box === "content") {
        contentRect.value = entries[0].contentRect;
      } else {
        contentRect.value = entries[0].target.getBoundingClientRect();
      }
    });
    onBeforeUnmount(() => {
      observer.disconnect();
    });
    watch(resizeRef, (newValue, oldValue) => {
      if (oldValue) {
        observer.unobserve(refElement(oldValue));
        contentRect.value = void 0;
      }
      if (newValue)
        observer.observe(refElement(newValue));
    }, {
      flush: "post"
    });
  }
  return {
    resizeRef,
    contentRect: readonly(contentRect)
  };
}
const VuetifyLayoutKey = Symbol.for("vuetify:layout");
const VuetifyLayoutItemKey = Symbol.for("vuetify:layout-item");
const ROOT_ZINDEX = 1e3;
const makeLayoutProps = propsFactory({
  overlaps: {
    type: Array,
    default: () => []
  },
  fullHeight: Boolean
}, "layout");
const makeLayoutItemProps = propsFactory({
  name: {
    type: String
  },
  order: {
    type: [Number, String],
    default: 0
  },
  absolute: Boolean
}, "layout-item");
function useLayout() {
  const layout = inject$1(VuetifyLayoutKey);
  if (!layout)
    throw new Error("[Vuetify] Could not find injected layout");
  return {
    getLayoutItem: layout.getLayoutItem,
    mainRect: layout.mainRect,
    mainStyles: layout.mainStyles
  };
}
function useLayoutItem(options) {
  const layout = inject$1(VuetifyLayoutKey);
  if (!layout)
    throw new Error("[Vuetify] Could not find injected layout");
  const id = options.id ?? `layout-item-${getUid()}`;
  const vm = getCurrentInstance("useLayoutItem");
  provide(VuetifyLayoutItemKey, {
    id
  });
  const isKeptAlive = shallowRef(false);
  onDeactivated(() => isKeptAlive.value = true);
  onActivated(() => isKeptAlive.value = false);
  const {
    layoutItemStyles,
    layoutItemScrimStyles
  } = layout.register(vm, {
    ...options,
    active: computed(() => isKeptAlive.value ? false : options.active.value),
    id
  });
  onBeforeUnmount(() => layout.unregister(id));
  return {
    layoutItemStyles,
    layoutRect: layout.layoutRect,
    layoutItemScrimStyles
  };
}
const generateLayers = (layout, positions, layoutSizes, activeItems) => {
  let previousLayer = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  const layers = [{
    id: "",
    layer: {
      ...previousLayer
    }
  }];
  for (const id of layout) {
    const position = positions.get(id);
    const amount = layoutSizes.get(id);
    const active = activeItems.get(id);
    if (!position || !amount || !active)
      continue;
    const layer = {
      ...previousLayer,
      [position.value]: parseInt(previousLayer[position.value], 10) + (active.value ? parseInt(amount.value, 10) : 0)
    };
    layers.push({
      id,
      layer
    });
    previousLayer = layer;
  }
  return layers;
};
function createLayout(props) {
  const parentLayout = inject$1(VuetifyLayoutKey, null);
  const rootZIndex = computed(() => parentLayout ? parentLayout.rootZIndex.value - 100 : ROOT_ZINDEX);
  const registered = ref([]);
  const positions = reactive(/* @__PURE__ */ new Map());
  const layoutSizes = reactive(/* @__PURE__ */ new Map());
  const priorities = reactive(/* @__PURE__ */ new Map());
  const activeItems = reactive(/* @__PURE__ */ new Map());
  const disabledTransitions = reactive(/* @__PURE__ */ new Map());
  const {
    resizeRef,
    contentRect: layoutRect
  } = useResizeObserver();
  const computedOverlaps = computed(() => {
    const map = /* @__PURE__ */ new Map();
    const overlaps = props.overlaps ?? [];
    for (const overlap of overlaps.filter((item) => item.includes(":"))) {
      const [top, bottom] = overlap.split(":");
      if (!registered.value.includes(top) || !registered.value.includes(bottom))
        continue;
      const topPosition = positions.get(top);
      const bottomPosition = positions.get(bottom);
      const topAmount = layoutSizes.get(top);
      const bottomAmount = layoutSizes.get(bottom);
      if (!topPosition || !bottomPosition || !topAmount || !bottomAmount)
        continue;
      map.set(bottom, {
        position: topPosition.value,
        amount: parseInt(topAmount.value, 10)
      });
      map.set(top, {
        position: bottomPosition.value,
        amount: -parseInt(bottomAmount.value, 10)
      });
    }
    return map;
  });
  const layers = computed(() => {
    const uniquePriorities = [...new Set([...priorities.values()].map((p2) => p2.value))].sort((a, b) => a - b);
    const layout = [];
    for (const p2 of uniquePriorities) {
      const items2 = registered.value.filter((id) => priorities.get(id)?.value === p2);
      layout.push(...items2);
    }
    return generateLayers(layout, positions, layoutSizes, activeItems);
  });
  const transitionsEnabled = computed(() => {
    return !Array.from(disabledTransitions.values()).some((ref2) => ref2.value);
  });
  const mainRect = computed(() => {
    return layers.value[layers.value.length - 1].layer;
  });
  const mainStyles = computed(() => {
    return {
      "--v-layout-left": convertToUnit(mainRect.value.left),
      "--v-layout-right": convertToUnit(mainRect.value.right),
      "--v-layout-top": convertToUnit(mainRect.value.top),
      "--v-layout-bottom": convertToUnit(mainRect.value.bottom),
      ...transitionsEnabled.value ? void 0 : {
        transition: "none"
      }
    };
  });
  const items = computed(() => {
    return layers.value.slice(1).map((_ref, index) => {
      let {
        id
      } = _ref;
      const {
        layer
      } = layers.value[index];
      const size2 = layoutSizes.get(id);
      const position = positions.get(id);
      return {
        id,
        ...layer,
        size: Number(size2.value),
        position: position.value
      };
    });
  });
  const getLayoutItem = (id) => {
    return items.value.find((item) => item.id === id);
  };
  const rootVm = getCurrentInstance("createLayout");
  const isMounted = shallowRef(false);
  onMounted(() => {
    isMounted.value = true;
  });
  provide(VuetifyLayoutKey, {
    register: (vm, _ref2) => {
      let {
        id,
        order,
        position,
        layoutSize,
        elementSize,
        active,
        disableTransitions,
        absolute
      } = _ref2;
      priorities.set(id, order);
      positions.set(id, position);
      layoutSizes.set(id, layoutSize);
      activeItems.set(id, active);
      disableTransitions && disabledTransitions.set(id, disableTransitions);
      const instances = findChildrenWithProvide(VuetifyLayoutItemKey, rootVm?.vnode);
      const instanceIndex = instances.indexOf(vm);
      if (instanceIndex > -1)
        registered.value.splice(instanceIndex, 0, id);
      else
        registered.value.push(id);
      const index = computed(() => items.value.findIndex((i) => i.id === id));
      const zIndex = computed(() => rootZIndex.value + layers.value.length * 2 - index.value * 2);
      const layoutItemStyles = computed(() => {
        const isHorizontal = position.value === "left" || position.value === "right";
        const isOppositeHorizontal = position.value === "right";
        const isOppositeVertical = position.value === "bottom";
        const styles = {
          [position.value]: 0,
          zIndex: zIndex.value,
          transform: `translate${isHorizontal ? "X" : "Y"}(${(active.value ? 0 : -110) * (isOppositeHorizontal || isOppositeVertical ? -1 : 1)}%)`,
          position: absolute.value || rootZIndex.value !== ROOT_ZINDEX ? "absolute" : "fixed",
          ...transitionsEnabled.value ? void 0 : {
            transition: "none"
          }
        };
        if (!isMounted.value)
          return styles;
        const item = items.value[index.value];
        if (!item)
          throw new Error(`[Vuetify] Could not find layout item "${id}"`);
        const overlap = computedOverlaps.value.get(id);
        if (overlap) {
          item[overlap.position] += overlap.amount;
        }
        return {
          ...styles,
          height: isHorizontal ? `calc(100% - ${item.top}px - ${item.bottom}px)` : elementSize.value ? `${elementSize.value}px` : void 0,
          left: isOppositeHorizontal ? void 0 : `${item.left}px`,
          right: isOppositeHorizontal ? `${item.right}px` : void 0,
          top: position.value !== "bottom" ? `${item.top}px` : void 0,
          bottom: position.value !== "top" ? `${item.bottom}px` : void 0,
          width: !isHorizontal ? `calc(100% - ${item.left}px - ${item.right}px)` : elementSize.value ? `${elementSize.value}px` : void 0
        };
      });
      const layoutItemScrimStyles = computed(() => ({
        zIndex: zIndex.value - 1
      }));
      return {
        layoutItemStyles,
        layoutItemScrimStyles,
        zIndex
      };
    },
    unregister: (id) => {
      priorities.delete(id);
      positions.delete(id);
      layoutSizes.delete(id);
      activeItems.delete(id);
      disabledTransitions.delete(id);
      registered.value = registered.value.filter((v) => v !== id);
    },
    mainRect,
    mainStyles,
    getLayoutItem,
    items,
    layoutRect,
    rootZIndex
  });
  const layoutClasses = computed(() => ["v-layout", {
    "v-layout--full-height": props.fullHeight
  }]);
  const layoutStyles = computed(() => ({
    zIndex: parentLayout ? rootZIndex.value : void 0,
    position: parentLayout ? "relative" : void 0,
    overflow: parentLayout ? "hidden" : void 0
  }));
  return {
    layoutClasses,
    layoutStyles,
    getLayoutItem,
    items,
    layoutRect,
    layoutRef: resizeRef
  };
}
function createVuetify() {
  let vuetify2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const {
    blueprint,
    ...rest
  } = vuetify2;
  const options = mergeDeep(blueprint, rest);
  const {
    aliases: aliases2 = {},
    components: components2 = {},
    directives: directives2 = {}
  } = options;
  const defaults = createDefaults(options.defaults);
  const display = createDisplay(options.display, options.ssr);
  const theme = createTheme(options.theme);
  const icons = createIcons(options.icons);
  const locale = createLocale(options.locale);
  const date2 = createDate(options.date, locale);
  const install = (app2) => {
    for (const key in directives2) {
      app2.directive(key, directives2[key]);
    }
    for (const key in components2) {
      app2.component(key, components2[key]);
    }
    for (const key in aliases2) {
      app2.component(key, defineComponent({
        ...aliases2[key],
        name: key,
        aliasName: aliases2[key].name
      }));
    }
    theme.install(app2);
    app2.provide(DefaultsSymbol, defaults);
    app2.provide(DisplaySymbol, display);
    app2.provide(ThemeSymbol, theme);
    app2.provide(IconSymbol, icons);
    app2.provide(LocaleSymbol, locale);
    app2.provide(DateOptionsSymbol, date2.options);
    app2.provide(DateAdapterSymbol, date2.instance);
    if (IN_BROWSER && options.ssr) {
      if (app2.$nuxt) {
        app2.$nuxt.hook("app:suspense:resolve", () => {
          display.update();
        });
      } else {
        const {
          mount
        } = app2;
        app2.mount = function() {
          const vm = mount(...arguments);
          nextTick(() => display.update());
          app2.mount = mount;
          return vm;
        };
      }
    }
    getUid.reset();
    {
      app2.mixin({
        computed: {
          $vuetify() {
            return reactive({
              defaults: inject.call(this, DefaultsSymbol),
              display: inject.call(this, DisplaySymbol),
              theme: inject.call(this, ThemeSymbol),
              icons: inject.call(this, IconSymbol),
              locale: inject.call(this, LocaleSymbol),
              date: inject.call(this, DateAdapterSymbol)
            });
          }
        }
      });
    }
  };
  return {
    install,
    defaults,
    display,
    theme,
    icons,
    locale,
    date: date2
  };
}
const version = "3.4.6";
createVuetify.version = version;
function inject(key) {
  const vm = this.$;
  const provides = vm.parent?.provides ?? vm.vnode.appContext?.provides;
  if (provides && key in provides) {
    return provides[key];
  }
}
const VApp$1 = "";
const makeVAppProps = propsFactory({
  ...makeComponentProps(),
  ...makeLayoutProps({
    fullHeight: true
  }),
  ...makeThemeProps()
}, "VApp");
const VApp = genericComponent()({
  name: "VApp",
  props: makeVAppProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const theme = provideTheme(props);
    const {
      layoutClasses,
      getLayoutItem,
      items,
      layoutRef
    } = createLayout(props);
    const {
      rtlClasses
    } = useRtl();
    useRender(() => createVNode("div", {
      "ref": layoutRef,
      "class": ["v-application", theme.themeClasses.value, layoutClasses.value, rtlClasses.value, props.class],
      "style": [props.style]
    }, [createVNode("div", {
      "class": "v-application__wrap"
    }, [slots.default?.()])]));
    return {
      getLayoutItem,
      items,
      theme
    };
  }
});
const VAppBar$1 = "";
const VToolbar$1 = "";
const makeTagProps = propsFactory({
  tag: {
    type: String,
    default: "div"
  }
}, "tag");
const makeVToolbarTitleProps = propsFactory({
  text: String,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VToolbarTitle");
const VToolbarTitle = genericComponent()({
  name: "VToolbarTitle",
  props: makeVToolbarTitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => {
      const hasText = !!(slots.default || slots.text || props.text);
      return createVNode(props.tag, {
        "class": ["v-toolbar-title", props.class],
        "style": props.style
      }, {
        default: () => [hasText && createVNode("div", {
          "class": "v-toolbar-title__placeholder"
        }, [slots.text ? slots.text() : props.text, slots.default?.()])]
      });
    });
    return {};
  }
});
const makeTransitionProps$1 = propsFactory({
  disabled: Boolean,
  group: Boolean,
  hideOnLeave: Boolean,
  leaveAbsolute: Boolean,
  mode: String,
  origin: String
}, "transition");
function createCssTransition(name, origin, mode) {
  return genericComponent()({
    name,
    props: makeTransitionProps$1({
      mode,
      origin
    }),
    setup(props, _ref) {
      let {
        slots
      } = _ref;
      const functions = {
        onBeforeEnter(el) {
          if (props.origin) {
            el.style.transformOrigin = props.origin;
          }
        },
        onLeave(el) {
          if (props.leaveAbsolute) {
            const {
              offsetTop,
              offsetLeft,
              offsetWidth,
              offsetHeight
            } = el;
            el._transitionInitialStyles = {
              position: el.style.position,
              top: el.style.top,
              left: el.style.left,
              width: el.style.width,
              height: el.style.height
            };
            el.style.position = "absolute";
            el.style.top = `${offsetTop}px`;
            el.style.left = `${offsetLeft}px`;
            el.style.width = `${offsetWidth}px`;
            el.style.height = `${offsetHeight}px`;
          }
          if (props.hideOnLeave) {
            el.style.setProperty("display", "none", "important");
          }
        },
        onAfterLeave(el) {
          if (props.leaveAbsolute && el?._transitionInitialStyles) {
            const {
              position,
              top,
              left,
              width,
              height
            } = el._transitionInitialStyles;
            delete el._transitionInitialStyles;
            el.style.position = position || "";
            el.style.top = top || "";
            el.style.left = left || "";
            el.style.width = width || "";
            el.style.height = height || "";
          }
        }
      };
      return () => {
        const tag = props.group ? TransitionGroup : Transition;
        return h(tag, {
          name: props.disabled ? "" : name,
          css: !props.disabled,
          ...props.group ? void 0 : {
            mode: props.mode
          },
          ...props.disabled ? {} : functions
        }, slots.default);
      };
    }
  });
}
function createJavascriptTransition(name, functions) {
  let mode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "in-out";
  return genericComponent()({
    name,
    props: {
      mode: {
        type: String,
        default: mode
      },
      disabled: Boolean
    },
    setup(props, _ref2) {
      let {
        slots
      } = _ref2;
      return () => {
        return h(Transition, {
          name: props.disabled ? "" : name,
          css: !props.disabled,
          // mode: props.mode, // TODO: vuejs/vue-next#3104
          ...props.disabled ? {} : functions
        }, slots.default);
      };
    }
  });
}
function ExpandTransitionGenerator() {
  let expandedParentClass = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
  let x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  const sizeProperty = x ? "width" : "height";
  const offsetProperty = camelize(`offset-${sizeProperty}`);
  return {
    onBeforeEnter(el) {
      el._parent = el.parentNode;
      el._initialStyle = {
        transition: el.style.transition,
        overflow: el.style.overflow,
        [sizeProperty]: el.style[sizeProperty]
      };
    },
    onEnter(el) {
      const initialStyle = el._initialStyle;
      el.style.setProperty("transition", "none", "important");
      el.style.overflow = "hidden";
      const offset = `${el[offsetProperty]}px`;
      el.style[sizeProperty] = "0";
      void el.offsetHeight;
      el.style.transition = initialStyle.transition;
      if (expandedParentClass && el._parent) {
        el._parent.classList.add(expandedParentClass);
      }
      requestAnimationFrame(() => {
        el.style[sizeProperty] = offset;
      });
    },
    onAfterEnter: resetStyles,
    onEnterCancelled: resetStyles,
    onLeave(el) {
      el._initialStyle = {
        transition: "",
        overflow: el.style.overflow,
        [sizeProperty]: el.style[sizeProperty]
      };
      el.style.overflow = "hidden";
      el.style[sizeProperty] = `${el[offsetProperty]}px`;
      void el.offsetHeight;
      requestAnimationFrame(() => el.style[sizeProperty] = "0");
    },
    onAfterLeave,
    onLeaveCancelled: onAfterLeave
  };
  function onAfterLeave(el) {
    if (expandedParentClass && el._parent) {
      el._parent.classList.remove(expandedParentClass);
    }
    resetStyles(el);
  }
  function resetStyles(el) {
    const size2 = el._initialStyle[sizeProperty];
    el.style.overflow = el._initialStyle.overflow;
    if (size2 != null)
      el.style[sizeProperty] = size2;
    delete el._initialStyle;
  }
}
const makeVDialogTransitionProps = propsFactory({
  target: [Object, Array]
}, "v-dialog-transition");
const VDialogTransition = genericComponent()({
  name: "VDialogTransition",
  props: makeVDialogTransitionProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const functions = {
      onBeforeEnter(el) {
        el.style.pointerEvents = "none";
        el.style.visibility = "hidden";
      },
      async onEnter(el, done) {
        await new Promise((resolve2) => requestAnimationFrame(resolve2));
        await new Promise((resolve2) => requestAnimationFrame(resolve2));
        el.style.visibility = "";
        const {
          x,
          y,
          sx,
          sy,
          speed
        } = getDimensions(props.target, el);
        const animation = animate(el, [{
          transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
          opacity: 0
        }, {}], {
          duration: 225 * speed,
          easing: deceleratedEasing
        });
        getChildren(el)?.forEach((el2) => {
          animate(el2, [{
            opacity: 0
          }, {
            opacity: 0,
            offset: 0.33
          }, {}], {
            duration: 225 * 2 * speed,
            easing: standardEasing
          });
        });
        animation.finished.then(() => done());
      },
      onAfterEnter(el) {
        el.style.removeProperty("pointer-events");
      },
      onBeforeLeave(el) {
        el.style.pointerEvents = "none";
      },
      async onLeave(el, done) {
        await new Promise((resolve2) => requestAnimationFrame(resolve2));
        const {
          x,
          y,
          sx,
          sy,
          speed
        } = getDimensions(props.target, el);
        const animation = animate(el, [{}, {
          transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
          opacity: 0
        }], {
          duration: 125 * speed,
          easing: acceleratedEasing
        });
        animation.finished.then(() => done());
        getChildren(el)?.forEach((el2) => {
          animate(el2, [{}, {
            opacity: 0,
            offset: 0.2
          }, {
            opacity: 0
          }], {
            duration: 125 * 2 * speed,
            easing: standardEasing
          });
        });
      },
      onAfterLeave(el) {
        el.style.removeProperty("pointer-events");
      }
    };
    return () => {
      return props.target ? createVNode(Transition, mergeProps({
        "name": "dialog-transition"
      }, functions, {
        "css": false
      }), slots) : createVNode(Transition, {
        "name": "dialog-transition"
      }, slots);
    };
  }
});
function getChildren(el) {
  const els = el.querySelector(":scope > .v-card, :scope > .v-sheet, :scope > .v-list")?.children;
  return els && [...els];
}
function getDimensions(target, el) {
  const targetBox = getTargetBox(target);
  const elBox = nullifyTransforms(el);
  const [originX, originY] = getComputedStyle(el).transformOrigin.split(" ").map((v) => parseFloat(v));
  const [anchorSide, anchorOffset] = getComputedStyle(el).getPropertyValue("--v-overlay-anchor-origin").split(" ");
  let offsetX = targetBox.left + targetBox.width / 2;
  if (anchorSide === "left" || anchorOffset === "left") {
    offsetX -= targetBox.width / 2;
  } else if (anchorSide === "right" || anchorOffset === "right") {
    offsetX += targetBox.width / 2;
  }
  let offsetY = targetBox.top + targetBox.height / 2;
  if (anchorSide === "top" || anchorOffset === "top") {
    offsetY -= targetBox.height / 2;
  } else if (anchorSide === "bottom" || anchorOffset === "bottom") {
    offsetY += targetBox.height / 2;
  }
  const tsx = targetBox.width / elBox.width;
  const tsy = targetBox.height / elBox.height;
  const maxs = Math.max(1, tsx, tsy);
  const sx = tsx / maxs || 0;
  const sy = tsy / maxs || 0;
  const asa = elBox.width * elBox.height / (window.innerWidth * window.innerHeight);
  const speed = asa > 0.12 ? Math.min(1.5, (asa - 0.12) * 10 + 1) : 1;
  return {
    x: offsetX - (originX + elBox.left),
    y: offsetY - (originY + elBox.top),
    sx,
    sy,
    speed
  };
}
const VFabTransition = createCssTransition("fab-transition", "center center", "out-in");
const VDialogBottomTransition = createCssTransition("dialog-bottom-transition");
const VDialogTopTransition = createCssTransition("dialog-top-transition");
const VFadeTransition = createCssTransition("fade-transition");
const VScaleTransition = createCssTransition("scale-transition");
const VScrollXTransition = createCssTransition("scroll-x-transition");
const VScrollXReverseTransition = createCssTransition("scroll-x-reverse-transition");
const VScrollYTransition = createCssTransition("scroll-y-transition");
const VScrollYReverseTransition = createCssTransition("scroll-y-reverse-transition");
const VSlideXTransition = createCssTransition("slide-x-transition");
const VSlideXReverseTransition = createCssTransition("slide-x-reverse-transition");
const VSlideYTransition = createCssTransition("slide-y-transition");
const VSlideYReverseTransition = createCssTransition("slide-y-reverse-transition");
const VExpandTransition = createJavascriptTransition("expand-transition", ExpandTransitionGenerator());
const VExpandXTransition = createJavascriptTransition("expand-x-transition", ExpandTransitionGenerator("", true));
const makeVDefaultsProviderProps = propsFactory({
  defaults: Object,
  disabled: Boolean,
  reset: [Number, String],
  root: [Boolean, String],
  scoped: Boolean
}, "VDefaultsProvider");
const VDefaultsProvider = genericComponent(false)({
  name: "VDefaultsProvider",
  props: makeVDefaultsProviderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      defaults,
      disabled,
      reset,
      root,
      scoped
    } = toRefs(props);
    provideDefaults(defaults, {
      reset,
      root,
      scoped,
      disabled
    });
    return () => slots.default?.();
  }
});
const VImg$1 = "";
const VResponsive$1 = "";
const makeDimensionProps = propsFactory({
  height: [Number, String],
  maxHeight: [Number, String],
  maxWidth: [Number, String],
  minHeight: [Number, String],
  minWidth: [Number, String],
  width: [Number, String]
}, "dimension");
function useDimension(props) {
  const dimensionStyles = computed(() => ({
    height: convertToUnit(props.height),
    maxHeight: convertToUnit(props.maxHeight),
    maxWidth: convertToUnit(props.maxWidth),
    minHeight: convertToUnit(props.minHeight),
    minWidth: convertToUnit(props.minWidth),
    width: convertToUnit(props.width)
  }));
  return {
    dimensionStyles
  };
}
function useAspectStyles(props) {
  return {
    aspectStyles: computed(() => {
      const ratio = Number(props.aspectRatio);
      return ratio ? {
        paddingBottom: String(1 / ratio * 100) + "%"
      } : void 0;
    })
  };
}
const makeVResponsiveProps = propsFactory({
  aspectRatio: [String, Number],
  contentClass: String,
  inline: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps()
}, "VResponsive");
const VResponsive = genericComponent()({
  name: "VResponsive",
  props: makeVResponsiveProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      aspectStyles
    } = useAspectStyles(props);
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => createVNode("div", {
      "class": ["v-responsive", {
        "v-responsive--inline": props.inline
      }, props.class],
      "style": [dimensionStyles.value, props.style]
    }, [createVNode("div", {
      "class": "v-responsive__sizer",
      "style": aspectStyles.value
    }, null), slots.additional?.(), slots.default && createVNode("div", {
      "class": ["v-responsive__content", props.contentClass]
    }, [slots.default()])]));
    return {};
  }
});
const makeTransitionProps = propsFactory({
  transition: {
    type: [Boolean, String, Object],
    default: "fade-transition",
    validator: (val) => val !== true
  }
}, "transition");
const MaybeTransition = (props, _ref) => {
  let {
    slots
  } = _ref;
  const {
    transition,
    disabled,
    ...rest
  } = props;
  const {
    component = Transition,
    ...customProps
  } = typeof transition === "object" ? transition : {};
  return h(component, mergeProps(typeof transition === "string" ? {
    name: disabled ? "" : transition
  } : customProps, rest, {
    disabled
  }), slots);
};
function mounted$5(el, binding) {
  if (!SUPPORTS_INTERSECTION)
    return;
  const modifiers = binding.modifiers || {};
  const value = binding.value;
  const {
    handler,
    options
  } = typeof value === "object" ? value : {
    handler: value,
    options: {}
  };
  const observer = new IntersectionObserver(function() {
    let entries = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let observer2 = arguments.length > 1 ? arguments[1] : void 0;
    const _observe = el._observe?.[binding.instance.$.uid];
    if (!_observe)
      return;
    const isIntersecting = entries.some((entry) => entry.isIntersecting);
    if (handler && (!modifiers.quiet || _observe.init) && (!modifiers.once || isIntersecting || _observe.init)) {
      handler(isIntersecting, entries, observer2);
    }
    if (isIntersecting && modifiers.once)
      unmounted$5(el, binding);
    else
      _observe.init = true;
  }, options);
  el._observe = Object(el._observe);
  el._observe[binding.instance.$.uid] = {
    init: false,
    observer
  };
  observer.observe(el);
}
function unmounted$5(el, binding) {
  const observe = el._observe?.[binding.instance.$.uid];
  if (!observe)
    return;
  observe.observer.unobserve(el);
  delete el._observe[binding.instance.$.uid];
}
const Intersect = {
  mounted: mounted$5,
  unmounted: unmounted$5
};
const makeVImgProps = propsFactory({
  alt: String,
  cover: Boolean,
  draggable: {
    type: [Boolean, String],
    default: void 0
  },
  eager: Boolean,
  gradient: String,
  lazySrc: String,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  sizes: String,
  src: {
    type: [String, Object],
    default: ""
  },
  crossorigin: String,
  referrerpolicy: String,
  srcset: String,
  position: String,
  ...makeVResponsiveProps(),
  ...makeComponentProps(),
  ...makeTransitionProps()
}, "VImg");
const VImg = genericComponent()({
  name: "VImg",
  directives: {
    intersect: Intersect
  },
  props: makeVImgProps(),
  emits: {
    loadstart: (value) => true,
    load: (value) => true,
    error: (value) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2,
      slots
    } = _ref;
    const vm = getCurrentInstance("VImg");
    const currentSrc = shallowRef("");
    const image = ref();
    const state = shallowRef(props.eager ? "loading" : "idle");
    const naturalWidth = shallowRef();
    const naturalHeight = shallowRef();
    const normalisedSrc = computed(() => {
      return props.src && typeof props.src === "object" ? {
        src: props.src.src,
        srcset: props.srcset || props.src.srcset,
        lazySrc: props.lazySrc || props.src.lazySrc,
        aspect: Number(props.aspectRatio || props.src.aspect || 0)
      } : {
        src: props.src,
        srcset: props.srcset,
        lazySrc: props.lazySrc,
        aspect: Number(props.aspectRatio || 0)
      };
    });
    const aspectRatio = computed(() => {
      return normalisedSrc.value.aspect || naturalWidth.value / naturalHeight.value || 0;
    });
    watch(() => props.src, () => {
      init(state.value !== "idle");
    });
    watch(aspectRatio, (val, oldVal) => {
      if (!val && oldVal && image.value) {
        pollForSize(image.value);
      }
    });
    onBeforeMount(() => init());
    function init(isIntersecting) {
      if (props.eager && isIntersecting)
        return;
      if (SUPPORTS_INTERSECTION && !isIntersecting && !props.eager)
        return;
      state.value = "loading";
      if (normalisedSrc.value.lazySrc) {
        const lazyImg = new Image();
        lazyImg.src = normalisedSrc.value.lazySrc;
        pollForSize(lazyImg, null);
      }
      if (!normalisedSrc.value.src)
        return;
      nextTick(() => {
        emit2("loadstart", image.value?.currentSrc || normalisedSrc.value.src);
        setTimeout(() => {
          if (vm.isUnmounted)
            return;
          if (image.value?.complete) {
            if (!image.value.naturalWidth) {
              onError();
            }
            if (state.value === "error")
              return;
            if (!aspectRatio.value)
              pollForSize(image.value, null);
            if (state.value === "loading")
              onLoad();
          } else {
            if (!aspectRatio.value)
              pollForSize(image.value);
            getSrc();
          }
        });
      });
    }
    function onLoad() {
      if (vm.isUnmounted)
        return;
      getSrc();
      pollForSize(image.value);
      state.value = "loaded";
      emit2("load", image.value?.currentSrc || normalisedSrc.value.src);
    }
    function onError() {
      if (vm.isUnmounted)
        return;
      state.value = "error";
      emit2("error", image.value?.currentSrc || normalisedSrc.value.src);
    }
    function getSrc() {
      const img = image.value;
      if (img)
        currentSrc.value = img.currentSrc || img.src;
    }
    let timer = -1;
    onBeforeUnmount(() => {
      clearTimeout(timer);
    });
    function pollForSize(img) {
      let timeout = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 100;
      const poll = () => {
        clearTimeout(timer);
        if (vm.isUnmounted)
          return;
        const {
          naturalHeight: imgHeight,
          naturalWidth: imgWidth
        } = img;
        if (imgHeight || imgWidth) {
          naturalWidth.value = imgWidth;
          naturalHeight.value = imgHeight;
        } else if (!img.complete && state.value === "loading" && timeout != null) {
          timer = window.setTimeout(poll, timeout);
        } else if (img.currentSrc.endsWith(".svg") || img.currentSrc.startsWith("data:image/svg+xml")) {
          naturalWidth.value = 1;
          naturalHeight.value = 1;
        }
      };
      poll();
    }
    const containClasses = computed(() => ({
      "v-img__img--cover": props.cover,
      "v-img__img--contain": !props.cover
    }));
    const __image = () => {
      if (!normalisedSrc.value.src || state.value === "idle")
        return null;
      const img = createVNode("img", {
        "class": ["v-img__img", containClasses.value],
        "style": {
          objectPosition: props.position
        },
        "src": normalisedSrc.value.src,
        "srcset": normalisedSrc.value.srcset,
        "alt": props.alt,
        "crossorigin": props.crossorigin,
        "referrerpolicy": props.referrerpolicy,
        "draggable": props.draggable,
        "sizes": props.sizes,
        "ref": image,
        "onLoad": onLoad,
        "onError": onError
      }, null);
      const sources = slots.sources?.();
      return createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => [withDirectives(sources ? createVNode("picture", {
          "class": "v-img__picture"
        }, [sources, img]) : img, [[vShow, state.value === "loaded"]])]
      });
    };
    const __preloadImage = () => createVNode(MaybeTransition, {
      "transition": props.transition
    }, {
      default: () => [normalisedSrc.value.lazySrc && state.value !== "loaded" && createVNode("img", {
        "class": ["v-img__img", "v-img__img--preload", containClasses.value],
        "style": {
          objectPosition: props.position
        },
        "src": normalisedSrc.value.lazySrc,
        "alt": props.alt,
        "crossorigin": props.crossorigin,
        "referrerpolicy": props.referrerpolicy,
        "draggable": props.draggable
      }, null)]
    });
    const __placeholder = () => {
      if (!slots.placeholder)
        return null;
      return createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => [(state.value === "loading" || state.value === "error" && !slots.error) && createVNode("div", {
          "class": "v-img__placeholder"
        }, [slots.placeholder()])]
      });
    };
    const __error = () => {
      if (!slots.error)
        return null;
      return createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => [state.value === "error" && createVNode("div", {
          "class": "v-img__error"
        }, [slots.error()])]
      });
    };
    const __gradient = () => {
      if (!props.gradient)
        return null;
      return createVNode("div", {
        "class": "v-img__gradient",
        "style": {
          backgroundImage: `linear-gradient(${props.gradient})`
        }
      }, null);
    };
    const isBooted = shallowRef(false);
    {
      const stop = watch(aspectRatio, (val) => {
        if (val) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isBooted.value = true;
            });
          });
          stop();
        }
      });
    }
    useRender(() => {
      const responsiveProps = VResponsive.filterProps(props);
      return withDirectives(createVNode(VResponsive, mergeProps({
        "class": ["v-img", {
          "v-img--booting": !isBooted.value
        }, props.class],
        "style": [{
          width: convertToUnit(props.width === "auto" ? naturalWidth.value : props.width)
        }, props.style]
      }, responsiveProps, {
        "aspectRatio": aspectRatio.value,
        "aria-label": props.alt,
        "role": props.alt ? "img" : void 0
      }), {
        additional: () => createVNode(Fragment, null, [createVNode(__image, null, null), createVNode(__preloadImage, null, null), createVNode(__gradient, null, null), createVNode(__placeholder, null, null), createVNode(__error, null, null)]),
        default: slots.default
      }), [[resolveDirective("intersect"), {
        handler: init,
        options: props.options
      }, null, {
        once: true
      }]]);
    });
    return {
      currentSrc,
      image,
      state,
      naturalWidth,
      naturalHeight
    };
  }
});
const makeBorderProps = propsFactory({
  border: [Boolean, Number, String]
}, "border");
function useBorder(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const borderClasses = computed(() => {
    const border = isRef(props) ? props.value : props.border;
    const classes = [];
    if (border === true || border === "") {
      classes.push(`${name}--border`);
    } else if (typeof border === "string" || border === 0) {
      for (const value of String(border).split(" ")) {
        classes.push(`border-${value}`);
      }
    }
    return classes;
  });
  return {
    borderClasses
  };
}
function useColor(colors2) {
  return destructComputed(() => {
    const classes = [];
    const styles = {};
    if (colors2.value.background) {
      if (isCssColor(colors2.value.background)) {
        styles.backgroundColor = colors2.value.background;
        if (!colors2.value.text && isParsableColor(colors2.value.background)) {
          const backgroundColor = parseColor(colors2.value.background);
          if (backgroundColor.a == null || backgroundColor.a === 1) {
            const textColor = getForeground(backgroundColor);
            styles.color = textColor;
            styles.caretColor = textColor;
          }
        }
      } else {
        classes.push(`bg-${colors2.value.background}`);
      }
    }
    if (colors2.value.text) {
      if (isCssColor(colors2.value.text)) {
        styles.color = colors2.value.text;
        styles.caretColor = colors2.value.text;
      } else {
        classes.push(`text-${colors2.value.text}`);
      }
    }
    return {
      colorClasses: classes,
      colorStyles: styles
    };
  });
}
function useTextColor(props, name) {
  const colors2 = computed(() => ({
    text: isRef(props) ? props.value : name ? props[name] : null
  }));
  const {
    colorClasses: textColorClasses,
    colorStyles: textColorStyles
  } = useColor(colors2);
  return {
    textColorClasses,
    textColorStyles
  };
}
function useBackgroundColor(props, name) {
  const colors2 = computed(() => ({
    background: isRef(props) ? props.value : name ? props[name] : null
  }));
  const {
    colorClasses: backgroundColorClasses,
    colorStyles: backgroundColorStyles
  } = useColor(colors2);
  return {
    backgroundColorClasses,
    backgroundColorStyles
  };
}
const makeElevationProps = propsFactory({
  elevation: {
    type: [Number, String],
    validator(v) {
      const value = parseInt(v);
      return !isNaN(value) && value >= 0 && // Material Design has a maximum elevation of 24
      // https://material.io/design/environment/elevation.html#default-elevations
      value <= 24;
    }
  }
}, "elevation");
function useElevation(props) {
  const elevationClasses = computed(() => {
    const elevation = isRef(props) ? props.value : props.elevation;
    const classes = [];
    if (elevation == null)
      return classes;
    classes.push(`elevation-${elevation}`);
    return classes;
  });
  return {
    elevationClasses
  };
}
const makeRoundedProps = propsFactory({
  rounded: {
    type: [Boolean, Number, String],
    default: void 0
  }
}, "rounded");
function useRounded(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const roundedClasses = computed(() => {
    const rounded = isRef(props) ? props.value : props.rounded;
    const classes = [];
    if (rounded === true || rounded === "") {
      classes.push(`${name}--rounded`);
    } else if (typeof rounded === "string" || rounded === 0) {
      for (const value of String(rounded).split(" ")) {
        classes.push(`rounded-${value}`);
      }
    }
    return classes;
  });
  return {
    roundedClasses
  };
}
const allowedDensities$1 = [null, "prominent", "default", "comfortable", "compact"];
const makeVToolbarProps = propsFactory({
  absolute: Boolean,
  collapse: Boolean,
  color: String,
  density: {
    type: String,
    default: "default",
    validator: (v) => allowedDensities$1.includes(v)
  },
  extended: Boolean,
  extensionHeight: {
    type: [Number, String],
    default: 48
  },
  flat: Boolean,
  floating: Boolean,
  height: {
    type: [Number, String],
    default: 64
  },
  image: String,
  title: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "header"
  }),
  ...makeThemeProps()
}, "VToolbar");
const VToolbar = genericComponent()({
  name: "VToolbar",
  props: makeVToolbarProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      rtlClasses
    } = useRtl();
    const isExtended = shallowRef(!!(props.extended || slots.extension?.()));
    const contentHeight = computed(() => parseInt(Number(props.height) + (props.density === "prominent" ? Number(props.height) : 0) - (props.density === "comfortable" ? 8 : 0) - (props.density === "compact" ? 16 : 0), 10));
    const extensionHeight = computed(() => isExtended.value ? parseInt(Number(props.extensionHeight) + (props.density === "prominent" ? Number(props.extensionHeight) : 0) - (props.density === "comfortable" ? 4 : 0) - (props.density === "compact" ? 8 : 0), 10) : 0);
    provideDefaults({
      VBtn: {
        variant: "text"
      }
    });
    useRender(() => {
      const hasTitle = !!(props.title || slots.title);
      const hasImage = !!(slots.image || props.image);
      const extension = slots.extension?.();
      isExtended.value = !!(props.extended || extension);
      return createVNode(props.tag, {
        "class": ["v-toolbar", {
          "v-toolbar--absolute": props.absolute,
          "v-toolbar--collapse": props.collapse,
          "v-toolbar--flat": props.flat,
          "v-toolbar--floating": props.floating,
          [`v-toolbar--density-${props.density}`]: true
        }, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value, themeClasses.value, rtlClasses.value, props.class],
        "style": [backgroundColorStyles.value, props.style]
      }, {
        default: () => [hasImage && createVNode("div", {
          "key": "image",
          "class": "v-toolbar__image"
        }, [!slots.image ? createVNode(VImg, {
          "key": "image-img",
          "cover": true,
          "src": props.image
        }, null) : createVNode(VDefaultsProvider, {
          "key": "image-defaults",
          "disabled": !props.image,
          "defaults": {
            VImg: {
              cover: true,
              src: props.image
            }
          }
        }, slots.image)]), createVNode(VDefaultsProvider, {
          "defaults": {
            VTabs: {
              height: convertToUnit(contentHeight.value)
            }
          }
        }, {
          default: () => [createVNode("div", {
            "class": "v-toolbar__content",
            "style": {
              height: convertToUnit(contentHeight.value)
            }
          }, [slots.prepend && createVNode("div", {
            "class": "v-toolbar__prepend"
          }, [slots.prepend?.()]), hasTitle && createVNode(VToolbarTitle, {
            "key": "title",
            "text": props.title
          }, {
            text: slots.title
          }), slots.default?.(), slots.append && createVNode("div", {
            "class": "v-toolbar__append"
          }, [slots.append?.()])])]
        }), createVNode(VDefaultsProvider, {
          "defaults": {
            VTabs: {
              height: convertToUnit(extensionHeight.value)
            }
          }
        }, {
          default: () => [createVNode(VExpandTransition, null, {
            default: () => [isExtended.value && createVNode("div", {
              "class": "v-toolbar__extension",
              "style": {
                height: convertToUnit(extensionHeight.value)
              }
            }, [extension])]
          })]
        })]
      });
    });
    return {
      contentHeight,
      extensionHeight
    };
  }
});
const makeScrollProps = propsFactory({
  scrollTarget: {
    type: String
  },
  scrollThreshold: {
    type: [String, Number],
    default: 300
  }
}, "scroll");
function useScroll(props) {
  let args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    canScroll
  } = args;
  let previousScroll = 0;
  const target = ref(null);
  const currentScroll = shallowRef(0);
  const savedScroll = shallowRef(0);
  const currentThreshold = shallowRef(0);
  const isScrollActive = shallowRef(false);
  const isScrollingUp = shallowRef(false);
  const scrollThreshold = computed(() => {
    return Number(props.scrollThreshold);
  });
  const scrollRatio = computed(() => {
    return clamp((scrollThreshold.value - currentScroll.value) / scrollThreshold.value || 0);
  });
  const onScroll = () => {
    const targetEl = target.value;
    if (!targetEl || canScroll && !canScroll.value)
      return;
    previousScroll = currentScroll.value;
    currentScroll.value = "window" in targetEl ? targetEl.pageYOffset : targetEl.scrollTop;
    isScrollingUp.value = currentScroll.value < previousScroll;
    currentThreshold.value = Math.abs(currentScroll.value - scrollThreshold.value);
  };
  watch(isScrollingUp, () => {
    savedScroll.value = savedScroll.value || currentScroll.value;
  });
  watch(isScrollActive, () => {
    savedScroll.value = 0;
  });
  onMounted(() => {
    watch(() => props.scrollTarget, (scrollTarget) => {
      const newTarget = scrollTarget ? document.querySelector(scrollTarget) : window;
      if (!newTarget) {
        return;
      }
      if (newTarget === target.value)
        return;
      target.value?.removeEventListener("scroll", onScroll);
      target.value = newTarget;
      target.value.addEventListener("scroll", onScroll, {
        passive: true
      });
    }, {
      immediate: true
    });
  });
  onBeforeUnmount(() => {
    target.value?.removeEventListener("scroll", onScroll);
  });
  canScroll && watch(canScroll, onScroll, {
    immediate: true
  });
  return {
    scrollThreshold,
    currentScroll,
    currentThreshold,
    isScrollActive,
    scrollRatio,
    // required only for testing
    // probably can be removed
    // later (2 chars chlng)
    isScrollingUp,
    savedScroll
  };
}
function useSsrBoot() {
  const isBooted = shallowRef(false);
  onMounted(() => {
    window.requestAnimationFrame(() => {
      isBooted.value = true;
    });
  });
  const ssrBootStyles = computed(() => !isBooted.value ? {
    transition: "none !important"
  } : void 0);
  return {
    ssrBootStyles,
    isBooted: readonly(isBooted)
  };
}
const makeVAppBarProps = propsFactory({
  scrollBehavior: String,
  modelValue: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom"].includes(value)
  },
  ...makeVToolbarProps(),
  ...makeLayoutItemProps(),
  ...makeScrollProps(),
  height: {
    type: [Number, String],
    default: 64
  }
}, "VAppBar");
const VAppBar = genericComponent()({
  name: "VAppBar",
  props: makeVAppBarProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const vToolbarRef = ref();
    const isActive = useProxiedModel(props, "modelValue");
    const scrollBehavior = computed(() => {
      const behavior = new Set(props.scrollBehavior?.split(" ") ?? []);
      return {
        hide: behavior.has("hide"),
        // fullyHide: behavior.has('fully-hide'),
        inverted: behavior.has("inverted"),
        collapse: behavior.has("collapse"),
        elevate: behavior.has("elevate"),
        fadeImage: behavior.has("fade-image")
        // shrink: behavior.has('shrink'),
      };
    });
    const canScroll = computed(() => {
      const behavior = scrollBehavior.value;
      return behavior.hide || // behavior.fullyHide ||
      behavior.inverted || behavior.collapse || behavior.elevate || behavior.fadeImage || // behavior.shrink ||
      !isActive.value;
    });
    const {
      currentScroll,
      scrollThreshold,
      isScrollingUp,
      scrollRatio
    } = useScroll(props, {
      canScroll
    });
    const isCollapsed = computed(() => props.collapse || scrollBehavior.value.collapse && (scrollBehavior.value.inverted ? scrollRatio.value > 0 : scrollRatio.value === 0));
    const isFlat = computed(() => props.flat || scrollBehavior.value.elevate && (scrollBehavior.value.inverted ? currentScroll.value > 0 : currentScroll.value === 0));
    const opacity = computed(() => scrollBehavior.value.fadeImage ? scrollBehavior.value.inverted ? 1 - scrollRatio.value : scrollRatio.value : void 0);
    const height = computed(() => {
      if (scrollBehavior.value.hide && scrollBehavior.value.inverted)
        return 0;
      const height2 = vToolbarRef.value?.contentHeight ?? 0;
      const extensionHeight = vToolbarRef.value?.extensionHeight ?? 0;
      return height2 + extensionHeight;
    });
    useToggleScope(computed(() => !!props.scrollBehavior), () => {
      watchEffect(() => {
        if (scrollBehavior.value.hide) {
          if (scrollBehavior.value.inverted) {
            isActive.value = currentScroll.value > scrollThreshold.value;
          } else {
            isActive.value = isScrollingUp.value || currentScroll.value < scrollThreshold.value;
          }
        } else {
          isActive.value = true;
        }
      });
    });
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: toRef(props, "location"),
      layoutSize: height,
      elementSize: shallowRef(void 0),
      active: isActive,
      absolute: toRef(props, "absolute")
    });
    useRender(() => {
      const toolbarProps = VToolbar.filterProps(props);
      return createVNode(VToolbar, mergeProps({
        "ref": vToolbarRef,
        "class": ["v-app-bar", {
          "v-app-bar--bottom": props.location === "bottom"
        }, props.class],
        "style": [{
          ...layoutItemStyles.value,
          "--v-toolbar-image-opacity": opacity.value,
          height: void 0,
          ...ssrBootStyles.value
        }, props.style]
      }, toolbarProps, {
        "collapse": isCollapsed.value,
        "flat": isFlat.value
      }), slots);
    });
    return {};
  }
});
const VBtn$1 = "";
const VBtnToggle$1 = "";
const VBtnGroup$1 = "";
const allowedDensities = [null, "default", "comfortable", "compact"];
const makeDensityProps = propsFactory({
  density: {
    type: String,
    default: "default",
    validator: (v) => allowedDensities.includes(v)
  }
}, "density");
function useDensity(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const densityClasses = computed(() => {
    return `${name}--density-${props.density}`;
  });
  return {
    densityClasses
  };
}
const allowedVariants$2 = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
function genOverlays(isClickable, name) {
  return createVNode(Fragment, null, [isClickable && createVNode("span", {
    "key": "overlay",
    "class": `${name}__overlay`
  }, null), createVNode("span", {
    "key": "underlay",
    "class": `${name}__underlay`
  }, null)]);
}
const makeVariantProps = propsFactory({
  color: String,
  variant: {
    type: String,
    default: "elevated",
    validator: (v) => allowedVariants$2.includes(v)
  }
}, "variant");
function useVariant(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const variantClasses = computed(() => {
    const {
      variant
    } = unref(props);
    return `${name}--variant-${variant}`;
  });
  const {
    colorClasses,
    colorStyles
  } = useColor(computed(() => {
    const {
      variant,
      color
    } = unref(props);
    return {
      [["elevated", "flat"].includes(variant) ? "background" : "text"]: color
    };
  }));
  return {
    colorClasses,
    colorStyles,
    variantClasses
  };
}
const makeVBtnGroupProps = propsFactory({
  divided: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps()
}, "VBtnGroup");
const VBtnGroup = genericComponent()({
  name: "VBtnGroup",
  props: makeVBtnGroupProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    provideDefaults({
      VBtn: {
        height: "auto",
        color: toRef(props, "color"),
        density: toRef(props, "density"),
        flat: true,
        variant: toRef(props, "variant")
      }
    });
    useRender(() => {
      return createVNode(props.tag, {
        "class": ["v-btn-group", {
          "v-btn-group--divided": props.divided
        }, themeClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, roundedClasses.value, props.class],
        "style": props.style
      }, slots);
    });
  }
});
const makeGroupProps = propsFactory({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group");
const makeGroupItemProps = propsFactory({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function useGroupItem(props, injectKey) {
  let required = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
  const vm = getCurrentInstance("useGroupItem");
  if (!vm) {
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  }
  const id = getUid();
  provide(Symbol.for(`${injectKey.description}:id`), id);
  const group = inject$1(injectKey, null);
  if (!group) {
    if (!required)
      return group;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${injectKey.description}`);
  }
  const value = toRef(props, "value");
  const disabled = computed(() => !!(group.disabled.value || props.disabled));
  group.register({
    id,
    value,
    disabled
  }, vm);
  onBeforeUnmount(() => {
    group.unregister(id);
  });
  const isSelected = computed(() => {
    return group.isSelected(id);
  });
  const selectedClass = computed(() => isSelected.value && [group.selectedClass.value, props.selectedClass]);
  watch(isSelected, (value2) => {
    vm.emit("group:selected", {
      value: value2
    });
  });
  return {
    id,
    isSelected,
    toggle: () => group.select(id, !isSelected.value),
    select: (value2) => group.select(id, value2),
    selectedClass,
    value,
    disabled,
    group
  };
}
function useGroup(props, injectKey) {
  let isUnmounted = false;
  const items = reactive([]);
  const selected = useProxiedModel(props, "modelValue", [], (v) => {
    if (v == null)
      return [];
    return getIds(items, wrapInArray(v));
  }, (v) => {
    const arr = getValues(items, v);
    return props.multiple ? arr : arr[0];
  });
  const groupVm = getCurrentInstance("useGroup");
  function register(item, vm) {
    const unwrapped = item;
    const key = Symbol.for(`${injectKey.description}:id`);
    const children = findChildrenWithProvide(key, groupVm?.vnode);
    const index = children.indexOf(vm);
    if (index > -1) {
      items.splice(index, 0, unwrapped);
    } else {
      items.push(unwrapped);
    }
  }
  function unregister(id) {
    if (isUnmounted)
      return;
    forceMandatoryValue();
    const index = items.findIndex((item) => item.id === id);
    items.splice(index, 1);
  }
  function forceMandatoryValue() {
    const item = items.find((item2) => !item2.disabled);
    if (item && props.mandatory === "force" && !selected.value.length) {
      selected.value = [item.id];
    }
  }
  onMounted(() => {
    forceMandatoryValue();
  });
  onBeforeUnmount(() => {
    isUnmounted = true;
  });
  function select(id, value) {
    const item = items.find((item2) => item2.id === id);
    if (value && item?.disabled)
      return;
    if (props.multiple) {
      const internalValue = selected.value.slice();
      const index = internalValue.findIndex((v) => v === id);
      const isSelected = ~index;
      value = value ?? !isSelected;
      if (isSelected && props.mandatory && internalValue.length <= 1)
        return;
      if (!isSelected && props.max != null && internalValue.length + 1 > props.max)
        return;
      if (index < 0 && value)
        internalValue.push(id);
      else if (index >= 0 && !value)
        internalValue.splice(index, 1);
      selected.value = internalValue;
    } else {
      const isSelected = selected.value.includes(id);
      if (props.mandatory && isSelected)
        return;
      selected.value = value ?? !isSelected ? [id] : [];
    }
  }
  function step(offset) {
    if (props.multiple)
      ;
    if (!selected.value.length) {
      const item = items.find((item2) => !item2.disabled);
      item && (selected.value = [item.id]);
    } else {
      const currentId = selected.value[0];
      const currentIndex = items.findIndex((i) => i.id === currentId);
      let newIndex = (currentIndex + offset) % items.length;
      let newItem = items[newIndex];
      while (newItem.disabled && newIndex !== currentIndex) {
        newIndex = (newIndex + offset) % items.length;
        newItem = items[newIndex];
      }
      if (newItem.disabled)
        return;
      selected.value = [items[newIndex].id];
    }
  }
  const state = {
    register,
    unregister,
    selected,
    select,
    disabled: toRef(props, "disabled"),
    prev: () => step(items.length - 1),
    next: () => step(1),
    isSelected: (id) => selected.value.includes(id),
    selectedClass: computed(() => props.selectedClass),
    items: computed(() => items),
    getItemIndex: (value) => getItemIndex(items, value)
  };
  provide(injectKey, state);
  return state;
}
function getItemIndex(items, value) {
  const ids = getIds(items, [value]);
  if (!ids.length)
    return -1;
  return items.findIndex((item) => item.id === ids[0]);
}
function getIds(items, modelValue) {
  const ids = [];
  modelValue.forEach((value) => {
    const item = items.find((item2) => deepEqual(value, item2.value));
    const itemByIndex = items[value];
    if (item?.value != null) {
      ids.push(item.id);
    } else if (itemByIndex != null) {
      ids.push(itemByIndex.id);
    }
  });
  return ids;
}
function getValues(items, ids) {
  const values = [];
  ids.forEach((id) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (~itemIndex) {
      const item = items[itemIndex];
      values.push(item.value != null ? item.value : itemIndex);
    }
  });
  return values;
}
const VBtnToggleSymbol = Symbol.for("vuetify:v-btn-toggle");
const makeVBtnToggleProps = propsFactory({
  ...makeVBtnGroupProps(),
  ...makeGroupProps()
}, "VBtnToggle");
const VBtnToggle = genericComponent()({
  name: "VBtnToggle",
  props: makeVBtnToggleProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isSelected,
      next,
      prev,
      select,
      selected
    } = useGroup(props, VBtnToggleSymbol);
    useRender(() => {
      const btnGroupProps = VBtnGroup.filterProps(props);
      return createVNode(VBtnGroup, mergeProps({
        "class": ["v-btn-toggle", props.class]
      }, btnGroupProps, {
        "style": props.style
      }), {
        default: () => [slots.default?.({
          isSelected,
          next,
          prev,
          select,
          selected
        })]
      });
    });
    return {
      next,
      prev,
      select
    };
  }
});
const VIcon$1 = "";
const predefinedSizes = ["x-small", "small", "default", "large", "x-large"];
const makeSizeProps = propsFactory({
  size: {
    type: [String, Number],
    default: "default"
  }
}, "size");
function useSize(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  return destructComputed(() => {
    let sizeClasses;
    let sizeStyles;
    if (includes(predefinedSizes, props.size)) {
      sizeClasses = `${name}--size-${props.size}`;
    } else if (props.size) {
      sizeStyles = {
        width: convertToUnit(props.size),
        height: convertToUnit(props.size)
      };
    }
    return {
      sizeClasses,
      sizeStyles
    };
  });
}
const makeVIconProps = propsFactory({
  color: String,
  start: Boolean,
  end: Boolean,
  icon: IconValue,
  ...makeComponentProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "i"
  }),
  ...makeThemeProps()
}, "VIcon");
const VIcon = genericComponent()({
  name: "VIcon",
  props: makeVIconProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const slotIcon = ref();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      iconData
    } = useIcon(computed(() => slotIcon.value || props.icon));
    const {
      sizeClasses
    } = useSize(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "color"));
    useRender(() => {
      const slotValue = slots.default?.();
      if (slotValue) {
        slotIcon.value = flattenFragments(slotValue).filter((node) => node.type === Text && node.children && typeof node.children === "string")[0]?.children;
      }
      return createVNode(iconData.value.component, {
        "tag": props.tag,
        "icon": iconData.value.icon,
        "class": ["v-icon", "notranslate", themeClasses.value, sizeClasses.value, textColorClasses.value, {
          "v-icon--clickable": !!attrs.onClick,
          "v-icon--start": props.start,
          "v-icon--end": props.end
        }, props.class],
        "style": [!sizeClasses.value ? {
          fontSize: convertToUnit(props.size),
          height: convertToUnit(props.size),
          width: convertToUnit(props.size)
        } : void 0, textColorStyles.value, props.style],
        "role": attrs.onClick ? "button" : void 0,
        "aria-hidden": !attrs.onClick
      }, {
        default: () => [slotValue]
      });
    });
    return {};
  }
});
const VProgressCircular$1 = "";
function useIntersectionObserver(callback, options) {
  const intersectionRef = ref();
  const isIntersecting = shallowRef(false);
  if (SUPPORTS_INTERSECTION) {
    const observer = new IntersectionObserver((entries) => {
      callback?.(entries, observer);
      isIntersecting.value = !!entries.find((entry) => entry.isIntersecting);
    }, options);
    onBeforeUnmount(() => {
      observer.disconnect();
    });
    watch(intersectionRef, (newValue, oldValue) => {
      if (oldValue) {
        observer.unobserve(oldValue);
        isIntersecting.value = false;
      }
      if (newValue)
        observer.observe(newValue);
    }, {
      flush: "post"
    });
  }
  return {
    intersectionRef,
    isIntersecting
  };
}
const makeVProgressCircularProps = propsFactory({
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String],
  modelValue: {
    type: [Number, String],
    default: 0
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  width: {
    type: [Number, String],
    default: 4
  },
  ...makeComponentProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "div"
  }),
  ...makeThemeProps()
}, "VProgressCircular");
const VProgressCircular = genericComponent()({
  name: "VProgressCircular",
  props: makeVProgressCircularProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const MAGIC_RADIUS_CONSTANT = 20;
    const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT;
    const root = ref();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "color"));
    const {
      textColorClasses: underlayColorClasses,
      textColorStyles: underlayColorStyles
    } = useTextColor(toRef(props, "bgColor"));
    const {
      intersectionRef,
      isIntersecting
    } = useIntersectionObserver();
    const {
      resizeRef,
      contentRect
    } = useResizeObserver();
    const normalizedValue = computed(() => Math.max(0, Math.min(100, parseFloat(props.modelValue))));
    const width = computed(() => Number(props.width));
    const size2 = computed(() => {
      return sizeStyles.value ? Number(props.size) : contentRect.value ? contentRect.value.width : Math.max(width.value, 32);
    });
    const diameter = computed(() => MAGIC_RADIUS_CONSTANT / (1 - width.value / size2.value) * 2);
    const strokeWidth = computed(() => width.value / size2.value * diameter.value);
    const strokeDashOffset = computed(() => convertToUnit((100 - normalizedValue.value) / 100 * CIRCUMFERENCE));
    watchEffect(() => {
      intersectionRef.value = root.value;
      resizeRef.value = root.value;
    });
    useRender(() => createVNode(props.tag, {
      "ref": root,
      "class": ["v-progress-circular", {
        "v-progress-circular--indeterminate": !!props.indeterminate,
        "v-progress-circular--visible": isIntersecting.value,
        "v-progress-circular--disable-shrink": props.indeterminate === "disable-shrink"
      }, themeClasses.value, sizeClasses.value, textColorClasses.value, props.class],
      "style": [sizeStyles.value, textColorStyles.value, props.style],
      "role": "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": props.indeterminate ? void 0 : normalizedValue.value
    }, {
      default: () => [createVNode("svg", {
        "style": {
          transform: `rotate(calc(-90deg + ${Number(props.rotate)}deg))`
        },
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": `0 0 ${diameter.value} ${diameter.value}`
      }, [createVNode("circle", {
        "class": ["v-progress-circular__underlay", underlayColorClasses.value],
        "style": underlayColorStyles.value,
        "fill": "transparent",
        "cx": "50%",
        "cy": "50%",
        "r": MAGIC_RADIUS_CONSTANT,
        "stroke-width": strokeWidth.value,
        "stroke-dasharray": CIRCUMFERENCE,
        "stroke-dashoffset": 0
      }, null), createVNode("circle", {
        "class": "v-progress-circular__overlay",
        "fill": "transparent",
        "cx": "50%",
        "cy": "50%",
        "r": MAGIC_RADIUS_CONSTANT,
        "stroke-width": strokeWidth.value,
        "stroke-dasharray": CIRCUMFERENCE,
        "stroke-dashoffset": strokeDashOffset.value
      }, null)]), slots.default && createVNode("div", {
        "class": "v-progress-circular__content"
      }, [slots.default({
        value: normalizedValue.value
      })])]
    }));
    return {};
  }
});
const VProgressLinear$1 = "";
const oppositeMap = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
};
const makeLocationProps = propsFactory({
  location: String
}, "location");
function useLocation(props) {
  let opposite = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  let offset = arguments.length > 2 ? arguments[2] : void 0;
  const {
    isRtl
  } = useRtl();
  const locationStyles = computed(() => {
    if (!props.location)
      return {};
    const {
      side,
      align
    } = parseAnchor(props.location.split(" ").length > 1 ? props.location : `${props.location} center`, isRtl.value);
    function getOffset2(side2) {
      return offset ? offset(side2) : 0;
    }
    const styles = {};
    if (side !== "center") {
      if (opposite)
        styles[oppositeMap[side]] = `calc(100% - ${getOffset2(side)}px)`;
      else
        styles[side] = 0;
    }
    if (align !== "center") {
      if (opposite)
        styles[oppositeMap[align]] = `calc(100% - ${getOffset2(align)}px)`;
      else
        styles[align] = 0;
    } else {
      if (side === "center")
        styles.top = styles.left = "50%";
      else {
        styles[{
          top: "left",
          bottom: "left",
          left: "top",
          right: "top"
        }[side]] = "50%";
      }
      styles.transform = {
        top: "translateX(-50%)",
        bottom: "translateX(-50%)",
        left: "translateY(-50%)",
        right: "translateY(-50%)",
        center: "translate(-50%, -50%)"
      }[side];
    }
    return styles;
  });
  return {
    locationStyles
  };
}
const makeVProgressLinearProps = propsFactory({
  absolute: Boolean,
  active: {
    type: Boolean,
    default: true
  },
  bgColor: String,
  bgOpacity: [Number, String],
  bufferValue: {
    type: [Number, String],
    default: 0
  },
  clickable: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: 4
  },
  indeterminate: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  modelValue: {
    type: [Number, String],
    default: 0
  },
  reverse: Boolean,
  stream: Boolean,
  striped: Boolean,
  roundedBar: Boolean,
  ...makeComponentProps(),
  ...makeLocationProps({
    location: "top"
  }),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VProgressLinear");
const VProgressLinear = genericComponent()({
  name: "VProgressLinear",
  props: makeVProgressLinearProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const progress = useProxiedModel(props, "modelValue");
    const {
      isRtl,
      rtlClasses
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(props, "color");
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(computed(() => props.bgColor || props.color));
    const {
      backgroundColorClasses: barColorClasses,
      backgroundColorStyles: barColorStyles
    } = useBackgroundColor(props, "color");
    const {
      roundedClasses
    } = useRounded(props);
    const {
      intersectionRef,
      isIntersecting
    } = useIntersectionObserver();
    const max = computed(() => parseInt(props.max, 10));
    const height = computed(() => parseInt(props.height, 10));
    const normalizedBuffer = computed(() => parseFloat(props.bufferValue) / max.value * 100);
    const normalizedValue = computed(() => parseFloat(progress.value) / max.value * 100);
    const isReversed = computed(() => isRtl.value !== props.reverse);
    const transition = computed(() => props.indeterminate ? "fade-transition" : "slide-x-transition");
    const opacity = computed(() => {
      return props.bgOpacity == null ? props.bgOpacity : parseFloat(props.bgOpacity);
    });
    function handleClick(e) {
      if (!intersectionRef.value)
        return;
      const {
        left,
        right,
        width
      } = intersectionRef.value.getBoundingClientRect();
      const value = isReversed.value ? width - e.clientX + (right - width) : e.clientX - left;
      progress.value = Math.round(value / width * max.value);
    }
    useRender(() => createVNode(props.tag, {
      "ref": intersectionRef,
      "class": ["v-progress-linear", {
        "v-progress-linear--absolute": props.absolute,
        "v-progress-linear--active": props.active && isIntersecting.value,
        "v-progress-linear--reverse": isReversed.value,
        "v-progress-linear--rounded": props.rounded,
        "v-progress-linear--rounded-bar": props.roundedBar,
        "v-progress-linear--striped": props.striped
      }, roundedClasses.value, themeClasses.value, rtlClasses.value, props.class],
      "style": [{
        bottom: props.location === "bottom" ? 0 : void 0,
        top: props.location === "top" ? 0 : void 0,
        height: props.active ? convertToUnit(height.value) : 0,
        "--v-progress-linear-height": convertToUnit(height.value),
        ...locationStyles.value
      }, props.style],
      "role": "progressbar",
      "aria-hidden": props.active ? "false" : "true",
      "aria-valuemin": "0",
      "aria-valuemax": props.max,
      "aria-valuenow": props.indeterminate ? void 0 : normalizedValue.value,
      "onClick": props.clickable && handleClick
    }, {
      default: () => [props.stream && createVNode("div", {
        "key": "stream",
        "class": ["v-progress-linear__stream", textColorClasses.value],
        "style": {
          ...textColorStyles.value,
          [isReversed.value ? "left" : "right"]: convertToUnit(-height.value),
          borderTop: `${convertToUnit(height.value / 2)} dotted`,
          opacity: opacity.value,
          top: `calc(50% - ${convertToUnit(height.value / 4)})`,
          width: convertToUnit(100 - normalizedBuffer.value, "%"),
          "--v-progress-linear-stream-to": convertToUnit(height.value * (isReversed.value ? 1 : -1))
        }
      }, null), createVNode("div", {
        "class": ["v-progress-linear__background", backgroundColorClasses.value],
        "style": [backgroundColorStyles.value, {
          opacity: opacity.value,
          width: convertToUnit(!props.stream ? 100 : normalizedBuffer.value, "%")
        }]
      }, null), createVNode(Transition, {
        "name": transition.value
      }, {
        default: () => [!props.indeterminate ? createVNode("div", {
          "class": ["v-progress-linear__determinate", barColorClasses.value],
          "style": [barColorStyles.value, {
            width: convertToUnit(normalizedValue.value, "%")
          }]
        }, null) : createVNode("div", {
          "class": "v-progress-linear__indeterminate"
        }, [["long", "short"].map((bar) => createVNode("div", {
          "key": bar,
          "class": ["v-progress-linear__indeterminate", bar, barColorClasses.value],
          "style": barColorStyles.value
        }, null))])]
      }), slots.default && createVNode("div", {
        "class": "v-progress-linear__content"
      }, [slots.default({
        value: normalizedValue.value,
        buffer: normalizedBuffer.value
      })])]
    }));
    return {};
  }
});
const makeLoaderProps = propsFactory({
  loading: [Boolean, String]
}, "loader");
function useLoader(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const loaderClasses = computed(() => ({
    [`${name}--loading`]: props.loading
  }));
  return {
    loaderClasses
  };
}
function LoaderSlot(props, _ref) {
  let {
    slots
  } = _ref;
  return createVNode("div", {
    "class": `${props.name}__loader`
  }, [slots.default?.({
    color: props.color,
    isActive: props.active
  }) || createVNode(VProgressLinear, {
    "absolute": props.absolute,
    "active": props.active,
    "color": props.color,
    "height": "2",
    "indeterminate": true
  }, null)]);
}
const positionValues = ["static", "relative", "fixed", "absolute", "sticky"];
const makePositionProps = propsFactory({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (v) => positionValues.includes(v)
    )
  }
}, "position");
function usePosition(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const positionClasses = computed(() => {
    return props.position ? `${name}--${props.position}` : void 0;
  });
  return {
    positionClasses
  };
}
function useRoute() {
  const vm = getCurrentInstance("useRoute");
  return computed(() => vm?.proxy?.$route);
}
function useRouter() {
  return getCurrentInstance("useRouter")?.proxy?.$router;
}
function useLink(props, attrs) {
  const RouterLink2 = resolveDynamicComponent("RouterLink");
  const isLink = computed(() => !!(props.href || props.to));
  const isClickable = computed(() => {
    return isLink?.value || hasEvent(attrs, "click") || hasEvent(props, "click");
  });
  if (typeof RouterLink2 === "string") {
    return {
      isLink,
      isClickable,
      href: toRef(props, "href")
    };
  }
  const link = props.to ? RouterLink2.useLink(props) : void 0;
  const route = useRoute();
  return {
    isLink,
    isClickable,
    route: link?.route,
    navigate: link?.navigate,
    isActive: link && computed(() => {
      if (!props.exact)
        return link.isActive?.value;
      if (!route.value)
        return link.isExactActive?.value;
      return link.isExactActive?.value && deepEqual(link.route.value.query, route.value.query);
    }),
    href: computed(() => props.to ? link?.route.value.href : props.href)
  };
}
const makeRouterProps = propsFactory({
  href: String,
  replace: Boolean,
  to: [String, Object],
  exact: Boolean
}, "router");
let inTransition = false;
function useBackButton(router2, cb) {
  let popped = false;
  let removeBefore;
  let removeAfter;
  if (IN_BROWSER) {
    nextTick(() => {
      window.addEventListener("popstate", onPopstate);
      removeBefore = router2?.beforeEach((to, from, next) => {
        if (!inTransition) {
          setTimeout(() => popped ? cb(next) : next());
        } else {
          popped ? cb(next) : next();
        }
        inTransition = true;
      });
      removeAfter = router2?.afterEach(() => {
        inTransition = false;
      });
    });
    onScopeDispose(() => {
      window.removeEventListener("popstate", onPopstate);
      removeBefore?.();
      removeAfter?.();
    });
  }
  function onPopstate(e) {
    if (e.state?.replaced)
      return;
    popped = true;
    setTimeout(() => popped = false);
  }
}
function useSelectLink(link, select) {
  watch(() => link.isActive?.value, (isActive) => {
    if (link.isLink.value && isActive && select) {
      nextTick(() => {
        select(true);
      });
    }
  }, {
    immediate: true
  });
}
const VRipple = "";
const stopSymbol = Symbol("rippleStop");
const DELAY_RIPPLE = 80;
function transform(el, value) {
  el.style.transform = value;
  el.style.webkitTransform = value;
}
function isTouchEvent(e) {
  return e.constructor.name === "TouchEvent";
}
function isKeyboardEvent(e) {
  return e.constructor.name === "KeyboardEvent";
}
const calculate = function(e, el) {
  let value = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
  let localX = 0;
  let localY = 0;
  if (!isKeyboardEvent(e)) {
    const offset = el.getBoundingClientRect();
    const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
    localX = target.clientX - offset.left;
    localY = target.clientY - offset.top;
  }
  let radius = 0;
  let scale = 0.3;
  if (el._ripple?.circle) {
    scale = 0.15;
    radius = el.clientWidth / 2;
    radius = value.center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
  } else {
    radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
  }
  const centerX = `${(el.clientWidth - radius * 2) / 2}px`;
  const centerY = `${(el.clientHeight - radius * 2) / 2}px`;
  const x = value.center ? centerX : `${localX - radius}px`;
  const y = value.center ? centerY : `${localY - radius}px`;
  return {
    radius,
    scale,
    x,
    y,
    centerX,
    centerY
  };
};
const ripples = {
  /* eslint-disable max-statements */
  show(e, el) {
    let value = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    if (!el?._ripple?.enabled) {
      return;
    }
    const container = document.createElement("span");
    const animation = document.createElement("span");
    container.appendChild(animation);
    container.className = "v-ripple__container";
    if (value.class) {
      container.className += ` ${value.class}`;
    }
    const {
      radius,
      scale,
      x,
      y,
      centerX,
      centerY
    } = calculate(e, el, value);
    const size2 = `${radius * 2}px`;
    animation.className = "v-ripple__animation";
    animation.style.width = size2;
    animation.style.height = size2;
    el.appendChild(container);
    const computed2 = window.getComputedStyle(el);
    if (computed2 && computed2.position === "static") {
      el.style.position = "relative";
      el.dataset.previousPosition = "static";
    }
    animation.classList.add("v-ripple__animation--enter");
    animation.classList.add("v-ripple__animation--visible");
    transform(animation, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
    animation.dataset.activated = String(performance.now());
    setTimeout(() => {
      animation.classList.remove("v-ripple__animation--enter");
      animation.classList.add("v-ripple__animation--in");
      transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
    }, 0);
  },
  hide(el) {
    if (!el?._ripple?.enabled)
      return;
    const ripples2 = el.getElementsByClassName("v-ripple__animation");
    if (ripples2.length === 0)
      return;
    const animation = ripples2[ripples2.length - 1];
    if (animation.dataset.isHiding)
      return;
    else
      animation.dataset.isHiding = "true";
    const diff = performance.now() - Number(animation.dataset.activated);
    const delay = Math.max(250 - diff, 0);
    setTimeout(() => {
      animation.classList.remove("v-ripple__animation--in");
      animation.classList.add("v-ripple__animation--out");
      setTimeout(() => {
        const ripples3 = el.getElementsByClassName("v-ripple__animation");
        if (ripples3.length === 1 && el.dataset.previousPosition) {
          el.style.position = el.dataset.previousPosition;
          delete el.dataset.previousPosition;
        }
        if (animation.parentNode?.parentNode === el)
          el.removeChild(animation.parentNode);
      }, 300);
    }, delay);
  }
};
function isRippleEnabled(value) {
  return typeof value === "undefined" || !!value;
}
function rippleShow(e) {
  const value = {};
  const element = e.currentTarget;
  if (!element?._ripple || element._ripple.touched || e[stopSymbol])
    return;
  e[stopSymbol] = true;
  if (isTouchEvent(e)) {
    element._ripple.touched = true;
    element._ripple.isTouch = true;
  } else {
    if (element._ripple.isTouch)
      return;
  }
  value.center = element._ripple.centered || isKeyboardEvent(e);
  if (element._ripple.class) {
    value.class = element._ripple.class;
  }
  if (isTouchEvent(e)) {
    if (element._ripple.showTimerCommit)
      return;
    element._ripple.showTimerCommit = () => {
      ripples.show(e, element, value);
    };
    element._ripple.showTimer = window.setTimeout(() => {
      if (element?._ripple?.showTimerCommit) {
        element._ripple.showTimerCommit();
        element._ripple.showTimerCommit = null;
      }
    }, DELAY_RIPPLE);
  } else {
    ripples.show(e, element, value);
  }
}
function rippleStop(e) {
  e[stopSymbol] = true;
}
function rippleHide(e) {
  const element = e.currentTarget;
  if (!element?._ripple)
    return;
  window.clearTimeout(element._ripple.showTimer);
  if (e.type === "touchend" && element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit();
    element._ripple.showTimerCommit = null;
    element._ripple.showTimer = window.setTimeout(() => {
      rippleHide(e);
    });
    return;
  }
  window.setTimeout(() => {
    if (element._ripple) {
      element._ripple.touched = false;
    }
  });
  ripples.hide(element);
}
function rippleCancelShow(e) {
  const element = e.currentTarget;
  if (!element?._ripple)
    return;
  if (element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit = null;
  }
  window.clearTimeout(element._ripple.showTimer);
}
let keyboardRipple = false;
function keyboardRippleShow(e) {
  if (!keyboardRipple && (e.keyCode === keyCodes.enter || e.keyCode === keyCodes.space)) {
    keyboardRipple = true;
    rippleShow(e);
  }
}
function keyboardRippleHide(e) {
  keyboardRipple = false;
  rippleHide(e);
}
function focusRippleHide(e) {
  if (keyboardRipple) {
    keyboardRipple = false;
    rippleHide(e);
  }
}
function updateRipple(el, binding, wasEnabled) {
  const {
    value,
    modifiers
  } = binding;
  const enabled = isRippleEnabled(value);
  if (!enabled) {
    ripples.hide(el);
  }
  el._ripple = el._ripple ?? {};
  el._ripple.enabled = enabled;
  el._ripple.centered = modifiers.center;
  el._ripple.circle = modifiers.circle;
  if (isObject(value) && value.class) {
    el._ripple.class = value.class;
  }
  if (enabled && !wasEnabled) {
    if (modifiers.stop) {
      el.addEventListener("touchstart", rippleStop, {
        passive: true
      });
      el.addEventListener("mousedown", rippleStop);
      return;
    }
    el.addEventListener("touchstart", rippleShow, {
      passive: true
    });
    el.addEventListener("touchend", rippleHide, {
      passive: true
    });
    el.addEventListener("touchmove", rippleCancelShow, {
      passive: true
    });
    el.addEventListener("touchcancel", rippleHide);
    el.addEventListener("mousedown", rippleShow);
    el.addEventListener("mouseup", rippleHide);
    el.addEventListener("mouseleave", rippleHide);
    el.addEventListener("keydown", keyboardRippleShow);
    el.addEventListener("keyup", keyboardRippleHide);
    el.addEventListener("blur", focusRippleHide);
    el.addEventListener("dragstart", rippleHide, {
      passive: true
    });
  } else if (!enabled && wasEnabled) {
    removeListeners(el);
  }
}
function removeListeners(el) {
  el.removeEventListener("mousedown", rippleShow);
  el.removeEventListener("touchstart", rippleShow);
  el.removeEventListener("touchend", rippleHide);
  el.removeEventListener("touchmove", rippleCancelShow);
  el.removeEventListener("touchcancel", rippleHide);
  el.removeEventListener("mouseup", rippleHide);
  el.removeEventListener("mouseleave", rippleHide);
  el.removeEventListener("keydown", keyboardRippleShow);
  el.removeEventListener("keyup", keyboardRippleHide);
  el.removeEventListener("dragstart", rippleHide);
  el.removeEventListener("blur", focusRippleHide);
}
function mounted$4(el, binding) {
  updateRipple(el, binding, false);
}
function unmounted$4(el) {
  delete el._ripple;
  removeListeners(el);
}
function updated$1(el, binding) {
  if (binding.value === binding.oldValue) {
    return;
  }
  const wasEnabled = isRippleEnabled(binding.oldValue);
  updateRipple(el, binding, wasEnabled);
}
const Ripple = {
  mounted: mounted$4,
  unmounted: unmounted$4,
  updated: updated$1
};
const makeVBtnProps = propsFactory({
  active: {
    type: Boolean,
    default: void 0
  },
  symbol: {
    type: null,
    default: VBtnToggleSymbol
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: IconValue,
  appendIcon: IconValue,
  block: Boolean,
  slim: Boolean,
  stacked: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  text: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makeLoaderProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "button"
  }),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "elevated"
  })
}, "VBtn");
const VBtn = genericComponent()({
  name: "VBtn",
  directives: {
    Ripple
  },
  props: makeVBtnProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      loaderClasses
    } = useLoader(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    const group = useGroupItem(props, props.symbol, false);
    const link = useLink(props, attrs);
    const isActive = computed(() => {
      if (props.active !== void 0) {
        return props.active;
      }
      if (link.isLink.value) {
        return link.isActive?.value;
      }
      return group?.isSelected.value;
    });
    const isDisabled = computed(() => group?.disabled.value || props.disabled);
    const isElevated = computed(() => {
      return props.variant === "elevated" && !(props.disabled || props.flat || props.border);
    });
    const valueAttr = computed(() => {
      if (props.value === void 0 || typeof props.value === "symbol")
        return void 0;
      return Object(props.value) === props.value ? JSON.stringify(props.value, null, 0) : props.value;
    });
    function onClick(e) {
      if (isDisabled.value || link.isLink.value && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || attrs.target === "_blank"))
        return;
      link.navigate?.(e);
      group?.toggle();
    }
    useSelectLink(link, group?.select);
    useRender(() => {
      const Tag = link.isLink.value ? "a" : props.tag;
      const hasPrepend = !!(props.prependIcon || slots.prepend);
      const hasAppend = !!(props.appendIcon || slots.append);
      const hasIcon = !!(props.icon && props.icon !== true);
      const hasColor = group?.isSelected.value && (!link.isLink.value || link.isActive?.value) || !group || link.isActive?.value;
      return withDirectives(createVNode(Tag, {
        "type": Tag === "a" ? void 0 : "button",
        "class": ["v-btn", group?.selectedClass.value, {
          "v-btn--active": isActive.value,
          "v-btn--block": props.block,
          "v-btn--disabled": isDisabled.value,
          "v-btn--elevated": isElevated.value,
          "v-btn--flat": props.flat,
          "v-btn--icon": !!props.icon,
          "v-btn--loading": props.loading,
          "v-btn--slim": props.slim,
          "v-btn--stacked": props.stacked
        }, themeClasses.value, borderClasses.value, hasColor ? colorClasses.value : void 0, densityClasses.value, elevationClasses.value, loaderClasses.value, positionClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, props.class],
        "style": [hasColor ? colorStyles.value : void 0, dimensionStyles.value, locationStyles.value, sizeStyles.value, props.style],
        "disabled": isDisabled.value || void 0,
        "href": link.href.value,
        "onClick": onClick,
        "value": valueAttr.value
      }, {
        default: () => [genOverlays(true, "v-btn"), !props.icon && hasPrepend && createVNode("span", {
          "key": "prepend",
          "class": "v-btn__prepend"
        }, [!slots.prepend ? createVNode(VIcon, {
          "key": "prepend-icon",
          "icon": props.prependIcon
        }, null) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !props.prependIcon,
          "defaults": {
            VIcon: {
              icon: props.prependIcon
            }
          }
        }, slots.prepend)]), createVNode("span", {
          "class": "v-btn__content",
          "data-no-activator": ""
        }, [!slots.default && hasIcon ? createVNode(VIcon, {
          "key": "content-icon",
          "icon": props.icon
        }, null) : createVNode(VDefaultsProvider, {
          "key": "content-defaults",
          "disabled": !hasIcon,
          "defaults": {
            VIcon: {
              icon: props.icon
            }
          }
        }, {
          default: () => [slots.default?.() ?? props.text]
        })]), !props.icon && hasAppend && createVNode("span", {
          "key": "append",
          "class": "v-btn__append"
        }, [!slots.append ? createVNode(VIcon, {
          "key": "append-icon",
          "icon": props.appendIcon
        }, null) : createVNode(VDefaultsProvider, {
          "key": "append-defaults",
          "disabled": !props.appendIcon,
          "defaults": {
            VIcon: {
              icon: props.appendIcon
            }
          }
        }, slots.append)]), !!props.loading && createVNode("span", {
          "key": "loader",
          "class": "v-btn__loader"
        }, [slots.loader?.() ?? createVNode(VProgressCircular, {
          "color": typeof props.loading === "boolean" ? void 0 : props.loading,
          "indeterminate": true,
          "size": "23",
          "width": "2"
        }, null)])]
      }), [[resolveDirective("ripple"), !isDisabled.value && props.ripple, null]]);
    });
    return {};
  }
});
const makeVAppBarNavIconProps = propsFactory({
  ...makeVBtnProps({
    icon: "$menu",
    variant: "text"
  })
}, "VAppBarNavIcon");
const VAppBarNavIcon = genericComponent()({
  name: "VAppBarNavIcon",
  props: makeVAppBarNavIconProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(VBtn, mergeProps(props, {
      "class": ["v-app-bar-nav-icon"]
    }), slots));
    return {};
  }
});
const VAppBarTitle = genericComponent()({
  name: "VAppBarTitle",
  props: makeVToolbarTitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(VToolbarTitle, mergeProps(props, {
      "class": "v-app-bar-title"
    }), slots));
    return {};
  }
});
const VAlert$1 = "";
const VAlertTitle = createSimpleFunctional("v-alert-title");
const allowedTypes = ["success", "info", "warning", "error"];
const makeVAlertProps = propsFactory({
  border: {
    type: [Boolean, String],
    validator: (val) => {
      return typeof val === "boolean" || ["top", "end", "bottom", "start"].includes(val);
    }
  },
  borderColor: String,
  closable: Boolean,
  closeIcon: {
    type: IconValue,
    default: "$close"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  icon: {
    type: [Boolean, String, Function, Object],
    default: null
  },
  modelValue: {
    type: Boolean,
    default: true
  },
  prominent: Boolean,
  title: String,
  text: String,
  type: {
    type: String,
    validator: (val) => allowedTypes.includes(val)
  },
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "flat"
  })
}, "VAlert");
const VAlert = genericComponent()({
  name: "VAlert",
  props: makeVAlertProps(),
  emits: {
    "click:close": (e) => true,
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2,
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const icon = computed(() => {
      if (props.icon === false)
        return void 0;
      if (!props.type)
        return props.icon;
      return props.icon ?? `$${props.type}`;
    });
    const variantProps = computed(() => ({
      color: props.color ?? props.type,
      variant: props.variant
    }));
    const {
      themeClasses
    } = provideTheme(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(variantProps);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "borderColor"));
    const {
      t
    } = useLocale();
    const closeProps = computed(() => ({
      "aria-label": t(props.closeLabel),
      onClick(e) {
        isActive.value = false;
        emit2("click:close", e);
      }
    }));
    return () => {
      const hasPrepend = !!(slots.prepend || icon.value);
      const hasTitle = !!(slots.title || props.title);
      const hasClose = !!(slots.close || props.closable);
      return isActive.value && createVNode(props.tag, {
        "class": ["v-alert", props.border && {
          "v-alert--border": !!props.border,
          [`v-alert--border-${props.border === true ? "start" : props.border}`]: true
        }, {
          "v-alert--prominent": props.prominent
        }, themeClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, positionClasses.value, roundedClasses.value, variantClasses.value, props.class],
        "style": [colorStyles.value, dimensionStyles.value, locationStyles.value, props.style],
        "role": "alert"
      }, {
        default: () => [genOverlays(false, "v-alert"), props.border && createVNode("div", {
          "key": "border",
          "class": ["v-alert__border", textColorClasses.value],
          "style": textColorStyles.value
        }, null), hasPrepend && createVNode("div", {
          "key": "prepend",
          "class": "v-alert__prepend"
        }, [!slots.prepend ? createVNode(VIcon, {
          "key": "prepend-icon",
          "density": props.density,
          "icon": icon.value,
          "size": props.prominent ? 44 : 28
        }, null) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !icon.value,
          "defaults": {
            VIcon: {
              density: props.density,
              icon: icon.value,
              size: props.prominent ? 44 : 28
            }
          }
        }, slots.prepend)]), createVNode("div", {
          "class": "v-alert__content"
        }, [hasTitle && createVNode(VAlertTitle, {
          "key": "title"
        }, {
          default: () => [slots.title?.() ?? props.title]
        }), slots.text?.() ?? props.text, slots.default?.()]), slots.append && createVNode("div", {
          "key": "append",
          "class": "v-alert__append"
        }, [slots.append()]), hasClose && createVNode("div", {
          "key": "close",
          "class": "v-alert__close"
        }, [!slots.close ? createVNode(VBtn, mergeProps({
          "key": "close-btn",
          "icon": props.closeIcon,
          "size": "x-small",
          "variant": "text"
        }, closeProps.value), null) : createVNode(VDefaultsProvider, {
          "key": "close-defaults",
          "defaults": {
            VBtn: {
              icon: props.closeIcon,
              size: "x-small",
              variant: "text"
            }
          }
        }, {
          default: () => [slots.close?.({
            props: closeProps.value
          })]
        })])]
      });
    };
  }
});
const VAutocomplete$1 = "";
const VCheckbox$1 = "";
const VSelectionControl$1 = "";
const VLabel$1 = "";
const makeVLabelProps = propsFactory({
  text: String,
  clickable: Boolean,
  ...makeComponentProps(),
  ...makeThemeProps()
}, "VLabel");
const VLabel = genericComponent()({
  name: "VLabel",
  props: makeVLabelProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode("label", {
      "class": ["v-label", {
        "v-label--clickable": props.clickable
      }, props.class],
      "style": props.style
    }, [props.text, slots.default?.()]));
    return {};
  }
});
const VSelectionControlGroup$1 = "";
const VSelectionControlGroupSymbol = Symbol.for("vuetify:selection-control-group");
const makeSelectionControlGroupProps = propsFactory({
  color: String,
  disabled: {
    type: Boolean,
    default: null
  },
  defaultsTarget: String,
  error: Boolean,
  id: String,
  inline: Boolean,
  falseIcon: IconValue,
  trueIcon: IconValue,
  ripple: {
    type: Boolean,
    default: true
  },
  multiple: {
    type: Boolean,
    default: null
  },
  name: String,
  readonly: {
    type: Boolean,
    default: null
  },
  modelValue: null,
  type: String,
  valueComparator: {
    type: Function,
    default: deepEqual
  },
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeThemeProps()
}, "SelectionControlGroup");
const makeVSelectionControlGroupProps = propsFactory({
  ...makeSelectionControlGroupProps({
    defaultsTarget: "VSelectionControl"
  })
}, "VSelectionControlGroup");
const VSelectionControlGroup = genericComponent()({
  name: "VSelectionControlGroup",
  props: makeVSelectionControlGroupProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const modelValue = useProxiedModel(props, "modelValue");
    const uid2 = getUid();
    const id = computed(() => props.id || `v-selection-control-group-${uid2}`);
    const name = computed(() => props.name || id.value);
    const updateHandlers = /* @__PURE__ */ new Set();
    provide(VSelectionControlGroupSymbol, {
      modelValue,
      forceUpdate: () => {
        updateHandlers.forEach((fn) => fn());
      },
      onForceUpdate: (cb) => {
        updateHandlers.add(cb);
        onScopeDispose(() => {
          updateHandlers.delete(cb);
        });
      }
    });
    provideDefaults({
      [props.defaultsTarget]: {
        color: toRef(props, "color"),
        disabled: toRef(props, "disabled"),
        density: toRef(props, "density"),
        error: toRef(props, "error"),
        inline: toRef(props, "inline"),
        modelValue,
        multiple: computed(() => !!props.multiple || props.multiple == null && Array.isArray(modelValue.value)),
        name,
        falseIcon: toRef(props, "falseIcon"),
        trueIcon: toRef(props, "trueIcon"),
        readonly: toRef(props, "readonly"),
        ripple: toRef(props, "ripple"),
        type: toRef(props, "type"),
        valueComparator: toRef(props, "valueComparator")
      }
    });
    useRender(() => createVNode("div", {
      "class": ["v-selection-control-group", {
        "v-selection-control-group--inline": props.inline
      }, props.class],
      "style": props.style,
      "role": props.type === "radio" ? "radiogroup" : void 0
    }, [slots.default?.()]));
    return {};
  }
});
const makeVSelectionControlProps = propsFactory({
  label: String,
  baseColor: String,
  trueValue: null,
  falseValue: null,
  value: null,
  ...makeComponentProps(),
  ...makeSelectionControlGroupProps()
}, "VSelectionControl");
function useSelectionControl(props) {
  const group = inject$1(VSelectionControlGroupSymbol, void 0);
  const {
    densityClasses
  } = useDensity(props);
  const modelValue = useProxiedModel(props, "modelValue");
  const trueValue = computed(() => props.trueValue !== void 0 ? props.trueValue : props.value !== void 0 ? props.value : true);
  const falseValue = computed(() => props.falseValue !== void 0 ? props.falseValue : false);
  const isMultiple = computed(() => !!props.multiple || props.multiple == null && Array.isArray(modelValue.value));
  const model = computed({
    get() {
      const val = group ? group.modelValue.value : modelValue.value;
      return isMultiple.value ? wrapInArray(val).some((v) => props.valueComparator(v, trueValue.value)) : props.valueComparator(val, trueValue.value);
    },
    set(val) {
      if (props.readonly)
        return;
      const currentValue = val ? trueValue.value : falseValue.value;
      let newVal = currentValue;
      if (isMultiple.value) {
        newVal = val ? [...wrapInArray(modelValue.value), currentValue] : wrapInArray(modelValue.value).filter((item) => !props.valueComparator(item, trueValue.value));
      }
      if (group) {
        group.modelValue.value = newVal;
      } else {
        modelValue.value = newVal;
      }
    }
  });
  const {
    textColorClasses,
    textColorStyles
  } = useTextColor(computed(() => {
    if (props.error || props.disabled)
      return void 0;
    return model.value ? props.color : props.baseColor;
  }));
  const {
    backgroundColorClasses,
    backgroundColorStyles
  } = useBackgroundColor(computed(() => {
    return model.value && !props.error && !props.disabled ? props.color : void 0;
  }));
  const icon = computed(() => model.value ? props.trueIcon : props.falseIcon);
  return {
    group,
    densityClasses,
    trueValue,
    falseValue,
    model,
    textColorClasses,
    textColorStyles,
    backgroundColorClasses,
    backgroundColorStyles,
    icon
  };
}
const VSelectionControl = genericComponent()({
  name: "VSelectionControl",
  directives: {
    Ripple
  },
  inheritAttrs: false,
  props: makeVSelectionControlProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      group,
      densityClasses,
      icon,
      model,
      textColorClasses,
      textColorStyles,
      backgroundColorClasses,
      backgroundColorStyles,
      trueValue
    } = useSelectionControl(props);
    const uid2 = getUid();
    const id = computed(() => props.id || `input-${uid2}`);
    const isFocused = shallowRef(false);
    const isFocusVisible = shallowRef(false);
    const input = ref();
    group?.onForceUpdate(() => {
      if (input.value) {
        input.value.checked = model.value;
      }
    });
    function onFocus(e) {
      isFocused.value = true;
      if (matchesSelector(e.target, ":focus-visible") !== false) {
        isFocusVisible.value = true;
      }
    }
    function onBlur() {
      isFocused.value = false;
      isFocusVisible.value = false;
    }
    function onInput(e) {
      if (props.readonly && group) {
        nextTick(() => group.forceUpdate());
      }
      model.value = e.target.checked;
    }
    useRender(() => {
      const label = slots.label ? slots.label({
        label: props.label,
        props: {
          for: id.value
        }
      }) : props.label;
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const inputNode = createVNode("input", mergeProps({
        "ref": input,
        "checked": model.value,
        "disabled": !!(props.readonly || props.disabled),
        "id": id.value,
        "onBlur": onBlur,
        "onFocus": onFocus,
        "onInput": onInput,
        "aria-disabled": !!(props.readonly || props.disabled),
        "type": props.type,
        "value": trueValue.value,
        "name": props.name,
        "aria-checked": props.type === "checkbox" ? model.value : void 0
      }, inputAttrs), null);
      return createVNode("div", mergeProps({
        "class": ["v-selection-control", {
          "v-selection-control--dirty": model.value,
          "v-selection-control--disabled": props.disabled,
          "v-selection-control--error": props.error,
          "v-selection-control--focused": isFocused.value,
          "v-selection-control--focus-visible": isFocusVisible.value,
          "v-selection-control--inline": props.inline
        }, densityClasses.value, props.class]
      }, rootAttrs, {
        "style": props.style
      }), [createVNode("div", {
        "class": ["v-selection-control__wrapper", textColorClasses.value],
        "style": textColorStyles.value
      }, [slots.default?.({
        backgroundColorClasses,
        backgroundColorStyles
      }), withDirectives(createVNode("div", {
        "class": ["v-selection-control__input"]
      }, [slots.input?.({
        model,
        textColorClasses,
        textColorStyles,
        backgroundColorClasses,
        backgroundColorStyles,
        inputNode,
        icon: icon.value,
        props: {
          onFocus,
          onBlur,
          id: id.value
        }
      }) ?? createVNode(Fragment, null, [icon.value && createVNode(VIcon, {
        "key": "icon",
        "icon": icon.value
      }, null), inputNode])]), [[resolveDirective("ripple"), props.ripple && [!props.disabled && !props.readonly, null, ["center", "circle"]]]])]), label && createVNode(VLabel, {
        "for": id.value,
        "clickable": true,
        "onClick": (e) => e.stopPropagation()
      }, {
        default: () => [label]
      })]);
    });
    return {
      isFocused,
      input
    };
  }
});
const makeVCheckboxBtnProps = propsFactory({
  indeterminate: Boolean,
  indeterminateIcon: {
    type: IconValue,
    default: "$checkboxIndeterminate"
  },
  ...makeVSelectionControlProps({
    falseIcon: "$checkboxOff",
    trueIcon: "$checkboxOn"
  })
}, "VCheckboxBtn");
const VCheckboxBtn = genericComponent()({
  name: "VCheckboxBtn",
  props: makeVCheckboxBtnProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:indeterminate": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const indeterminate = useProxiedModel(props, "indeterminate");
    const model = useProxiedModel(props, "modelValue");
    function onChange(v) {
      if (indeterminate.value) {
        indeterminate.value = false;
      }
    }
    const falseIcon = computed(() => {
      return indeterminate.value ? props.indeterminateIcon : props.falseIcon;
    });
    const trueIcon = computed(() => {
      return indeterminate.value ? props.indeterminateIcon : props.trueIcon;
    });
    useRender(() => {
      const controlProps = omit(VSelectionControl.filterProps(props), ["modelValue"]);
      return createVNode(VSelectionControl, mergeProps(controlProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": [($event) => model.value = $event, onChange],
        "class": ["v-checkbox-btn", props.class],
        "style": props.style,
        "type": "checkbox",
        "falseIcon": falseIcon.value,
        "trueIcon": trueIcon.value,
        "aria-checked": indeterminate.value ? "mixed" : void 0
      }), slots);
    });
    return {};
  }
});
const VInput$1 = "";
function useInputIcon(props) {
  const {
    t
  } = useLocale();
  function InputIcon(_ref) {
    let {
      name
    } = _ref;
    const localeKey = {
      prepend: "prependAction",
      prependInner: "prependAction",
      append: "appendAction",
      appendInner: "appendAction",
      clear: "clear"
    }[name];
    const listener = props[`onClick:${name}`];
    const label = listener && localeKey ? t(`$vuetify.input.${localeKey}`, props.label ?? "") : void 0;
    return createVNode(VIcon, {
      "icon": props[`${name}Icon`],
      "aria-label": label,
      "onClick": listener
    }, null);
  }
  return {
    InputIcon
  };
}
const VMessages$1 = "";
const makeVMessagesProps = propsFactory({
  active: Boolean,
  color: String,
  messages: {
    type: [Array, String],
    default: () => []
  },
  ...makeComponentProps(),
  ...makeTransitionProps({
    transition: {
      component: VSlideYTransition,
      leaveAbsolute: true,
      group: true
    }
  })
}, "VMessages");
const VMessages = genericComponent()({
  name: "VMessages",
  props: makeVMessagesProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const messages = computed(() => wrapInArray(props.messages));
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(computed(() => props.color));
    useRender(() => createVNode(MaybeTransition, {
      "transition": props.transition,
      "tag": "div",
      "class": ["v-messages", textColorClasses.value, props.class],
      "style": [textColorStyles.value, props.style],
      "role": "alert",
      "aria-live": "polite"
    }, {
      default: () => [props.active && messages.value.map((message, i) => createVNode("div", {
        "class": "v-messages__message",
        "key": `${i}-${messages.value}`
      }, [slots.message ? slots.message({
        message
      }) : message]))]
    }));
    return {};
  }
});
const makeFocusProps = propsFactory({
  focused: Boolean,
  "onUpdate:focused": EventProp()
}, "focus");
function useFocus(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const isFocused = useProxiedModel(props, "focused");
  const focusClasses = computed(() => {
    return {
      [`${name}--focused`]: isFocused.value
    };
  });
  function focus() {
    isFocused.value = true;
  }
  function blur() {
    isFocused.value = false;
  }
  return {
    focusClasses,
    isFocused,
    focus,
    blur
  };
}
const FormKey = Symbol.for("vuetify:form");
const makeFormProps = propsFactory({
  disabled: Boolean,
  fastFail: Boolean,
  readonly: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  validateOn: {
    type: String,
    default: "input"
  }
}, "form");
function createForm(props) {
  const model = useProxiedModel(props, "modelValue");
  const isDisabled = computed(() => props.disabled);
  const isReadonly2 = computed(() => props.readonly);
  const isValidating = shallowRef(false);
  const items = ref([]);
  const errors = ref([]);
  async function validate() {
    const results = [];
    let valid = true;
    errors.value = [];
    isValidating.value = true;
    for (const item of items.value) {
      const itemErrorMessages = await item.validate();
      if (itemErrorMessages.length > 0) {
        valid = false;
        results.push({
          id: item.id,
          errorMessages: itemErrorMessages
        });
      }
      if (!valid && props.fastFail)
        break;
    }
    errors.value = results;
    isValidating.value = false;
    return {
      valid,
      errors: errors.value
    };
  }
  function reset() {
    items.value.forEach((item) => item.reset());
  }
  function resetValidation() {
    items.value.forEach((item) => item.resetValidation());
  }
  watch(items, () => {
    let valid = 0;
    let invalid = 0;
    const results = [];
    for (const item of items.value) {
      if (item.isValid === false) {
        invalid++;
        results.push({
          id: item.id,
          errorMessages: item.errorMessages
        });
      } else if (item.isValid === true)
        valid++;
    }
    errors.value = results;
    model.value = invalid > 0 ? false : valid === items.value.length ? true : null;
  }, {
    deep: true
  });
  provide(FormKey, {
    register: (_ref) => {
      let {
        id,
        validate: validate2,
        reset: reset2,
        resetValidation: resetValidation2
      } = _ref;
      if (items.value.some((item) => item.id === id))
        ;
      items.value.push({
        id,
        validate: validate2,
        reset: reset2,
        resetValidation: resetValidation2,
        isValid: null,
        errorMessages: []
      });
    },
    unregister: (id) => {
      items.value = items.value.filter((item) => {
        return item.id !== id;
      });
    },
    update: (id, isValid2, errorMessages) => {
      const found = items.value.find((item) => item.id === id);
      if (!found)
        return;
      found.isValid = isValid2;
      found.errorMessages = errorMessages;
    },
    isDisabled,
    isReadonly: isReadonly2,
    isValidating,
    isValid: model,
    items,
    validateOn: toRef(props, "validateOn")
  });
  return {
    errors,
    isDisabled,
    isReadonly: isReadonly2,
    isValidating,
    isValid: model,
    items,
    validate,
    reset,
    resetValidation
  };
}
function useForm() {
  return inject$1(FormKey, null);
}
const makeValidationProps = propsFactory({
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  errorMessages: {
    type: [Array, String],
    default: () => []
  },
  maxErrors: {
    type: [Number, String],
    default: 1
  },
  name: String,
  label: String,
  readonly: {
    type: Boolean,
    default: null
  },
  rules: {
    type: Array,
    default: () => []
  },
  modelValue: null,
  validateOn: String,
  validationValue: null,
  ...makeFocusProps()
}, "validation");
function useValidation(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  let id = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : getUid();
  const model = useProxiedModel(props, "modelValue");
  const validationModel = computed(() => props.validationValue === void 0 ? model.value : props.validationValue);
  const form = useForm();
  const internalErrorMessages = ref([]);
  const isPristine = shallowRef(true);
  const isDirty = computed(() => !!(wrapInArray(model.value === "" ? null : model.value).length || wrapInArray(validationModel.value === "" ? null : validationModel.value).length));
  const isDisabled = computed(() => !!(props.disabled ?? form?.isDisabled.value));
  const isReadonly2 = computed(() => !!(props.readonly ?? form?.isReadonly.value));
  const errorMessages = computed(() => {
    return props.errorMessages?.length ? wrapInArray(props.errorMessages).concat(internalErrorMessages.value).slice(0, Math.max(0, +props.maxErrors)) : internalErrorMessages.value;
  });
  const validateOn = computed(() => {
    let value = (props.validateOn ?? form?.validateOn.value) || "input";
    if (value === "lazy")
      value = "input lazy";
    const set2 = new Set(value?.split(" ") ?? []);
    return {
      blur: set2.has("blur") || set2.has("input"),
      input: set2.has("input"),
      submit: set2.has("submit"),
      lazy: set2.has("lazy")
    };
  });
  const isValid2 = computed(() => {
    if (props.error || props.errorMessages?.length)
      return false;
    if (!props.rules.length)
      return true;
    if (isPristine.value) {
      return internalErrorMessages.value.length || validateOn.value.lazy ? null : true;
    } else {
      return !internalErrorMessages.value.length;
    }
  });
  const isValidating = shallowRef(false);
  const validationClasses = computed(() => {
    return {
      [`${name}--error`]: isValid2.value === false,
      [`${name}--dirty`]: isDirty.value,
      [`${name}--disabled`]: isDisabled.value,
      [`${name}--readonly`]: isReadonly2.value
    };
  });
  const uid2 = computed(() => props.name ?? unref(id));
  onBeforeMount(() => {
    form?.register({
      id: uid2.value,
      validate,
      reset,
      resetValidation
    });
  });
  onBeforeUnmount(() => {
    form?.unregister(uid2.value);
  });
  onMounted(async () => {
    if (!validateOn.value.lazy) {
      await validate(true);
    }
    form?.update(uid2.value, isValid2.value, errorMessages.value);
  });
  useToggleScope(() => validateOn.value.input, () => {
    watch(validationModel, () => {
      if (validationModel.value != null) {
        validate();
      } else if (props.focused) {
        const unwatch = watch(() => props.focused, (val) => {
          if (!val)
            validate();
          unwatch();
        });
      }
    });
  });
  useToggleScope(() => validateOn.value.blur, () => {
    watch(() => props.focused, (val) => {
      if (!val)
        validate();
    });
  });
  watch(isValid2, () => {
    form?.update(uid2.value, isValid2.value, errorMessages.value);
  });
  function reset() {
    model.value = null;
    nextTick(resetValidation);
  }
  function resetValidation() {
    isPristine.value = true;
    if (!validateOn.value.lazy) {
      validate(true);
    } else {
      internalErrorMessages.value = [];
    }
  }
  async function validate() {
    let silent = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    const results = [];
    isValidating.value = true;
    for (const rule of props.rules) {
      if (results.length >= +(props.maxErrors ?? 1)) {
        break;
      }
      const handler = typeof rule === "function" ? rule : () => rule;
      const result = await handler(validationModel.value);
      if (result === true)
        continue;
      if (result !== false && typeof result !== "string") {
        console.warn(`${result} is not a valid value. Rule functions must return boolean true or a string.`);
        continue;
      }
      results.push(result || "");
    }
    internalErrorMessages.value = results;
    isValidating.value = false;
    isPristine.value = silent;
    return internalErrorMessages.value;
  }
  return {
    errorMessages,
    isDirty,
    isDisabled,
    isReadonly: isReadonly2,
    isPristine,
    isValid: isValid2,
    isValidating,
    reset,
    resetValidation,
    validate,
    validationClasses
  };
}
const makeVInputProps = propsFactory({
  id: String,
  appendIcon: IconValue,
  centerAffix: {
    type: Boolean,
    default: true
  },
  prependIcon: IconValue,
  hideDetails: [Boolean, String],
  hideSpinButtons: Boolean,
  hint: String,
  persistentHint: Boolean,
  messages: {
    type: [Array, String],
    default: () => []
  },
  direction: {
    type: String,
    default: "horizontal",
    validator: (v) => ["horizontal", "vertical"].includes(v)
  },
  "onClick:prepend": EventProp(),
  "onClick:append": EventProp(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeValidationProps()
}, "VInput");
const VInput = genericComponent()({
  name: "VInput",
  props: {
    ...makeVInputProps()
  },
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit: emit2
    } = _ref;
    const {
      densityClasses
    } = useDensity(props);
    const {
      rtlClasses
    } = useRtl();
    const {
      InputIcon
    } = useInputIcon(props);
    const uid2 = getUid();
    const id = computed(() => props.id || `input-${uid2}`);
    const messagesId = computed(() => `${id.value}-messages`);
    const {
      errorMessages,
      isDirty,
      isDisabled,
      isReadonly: isReadonly2,
      isPristine,
      isValid: isValid2,
      isValidating,
      reset,
      resetValidation,
      validate,
      validationClasses
    } = useValidation(props, "v-input", id);
    const slotProps = computed(() => ({
      id,
      messagesId,
      isDirty,
      isDisabled,
      isReadonly: isReadonly2,
      isPristine,
      isValid: isValid2,
      isValidating,
      reset,
      resetValidation,
      validate
    }));
    const messages = computed(() => {
      if (props.errorMessages?.length || !isPristine.value && errorMessages.value.length) {
        return errorMessages.value;
      } else if (props.hint && (props.persistentHint || props.focused)) {
        return props.hint;
      } else {
        return props.messages;
      }
    });
    useRender(() => {
      const hasPrepend = !!(slots.prepend || props.prependIcon);
      const hasAppend = !!(slots.append || props.appendIcon);
      const hasMessages = messages.value.length > 0;
      const hasDetails = !props.hideDetails || props.hideDetails === "auto" && (hasMessages || !!slots.details);
      return createVNode("div", {
        "class": ["v-input", `v-input--${props.direction}`, {
          "v-input--center-affix": props.centerAffix,
          "v-input--hide-spin-buttons": props.hideSpinButtons
        }, densityClasses.value, rtlClasses.value, validationClasses.value, props.class],
        "style": props.style
      }, [hasPrepend && createVNode("div", {
        "key": "prepend",
        "class": "v-input__prepend"
      }, [slots.prepend?.(slotProps.value), props.prependIcon && createVNode(InputIcon, {
        "key": "prepend-icon",
        "name": "prepend"
      }, null)]), slots.default && createVNode("div", {
        "class": "v-input__control"
      }, [slots.default?.(slotProps.value)]), hasAppend && createVNode("div", {
        "key": "append",
        "class": "v-input__append"
      }, [props.appendIcon && createVNode(InputIcon, {
        "key": "append-icon",
        "name": "append"
      }, null), slots.append?.(slotProps.value)]), hasDetails && createVNode("div", {
        "class": "v-input__details"
      }, [createVNode(VMessages, {
        "id": messagesId.value,
        "active": hasMessages,
        "messages": messages.value
      }, {
        message: slots.message
      }), slots.details?.(slotProps.value)])]);
    });
    return {
      reset,
      resetValidation,
      validate,
      isValid: isValid2,
      errorMessages
    };
  }
});
const makeVCheckboxProps = propsFactory({
  ...makeVInputProps(),
  ...omit(makeVCheckboxBtnProps(), ["inline"])
}, "VCheckbox");
const VCheckbox = genericComponent()({
  name: "VCheckbox",
  inheritAttrs: false,
  props: makeVCheckboxProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:focused": (focused) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const uid2 = getUid();
    const id = computed(() => props.id || `checkbox-${uid2}`);
    useRender(() => {
      const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
      const inputProps = VInput.filterProps(props);
      const checkboxProps = VCheckboxBtn.filterProps(props);
      return createVNode(VInput, mergeProps({
        "class": ["v-checkbox", props.class]
      }, rootAttrs, inputProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "id": id.value,
        "focused": isFocused.value,
        "style": props.style
      }), {
        ...slots,
        default: (_ref2) => {
          let {
            id: id2,
            messagesId,
            isDisabled,
            isReadonly: isReadonly2
          } = _ref2;
          return createVNode(VCheckboxBtn, mergeProps(checkboxProps, {
            "id": id2.value,
            "aria-describedby": messagesId.value,
            "disabled": isDisabled.value,
            "readonly": isReadonly2.value
          }, controlAttrs, {
            "modelValue": model.value,
            "onUpdate:modelValue": ($event) => model.value = $event,
            "onFocus": focus,
            "onBlur": blur
          }), slots);
        }
      });
    });
    return {};
  }
});
const VChip$1 = "";
const VAvatar$1 = "";
const makeVAvatarProps = propsFactory({
  start: Boolean,
  end: Boolean,
  icon: IconValue,
  image: String,
  text: String,
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "flat"
  })
}, "VAvatar");
const VAvatar = genericComponent()({
  name: "VAvatar",
  props: makeVAvatarProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-avatar", {
        "v-avatar--start": props.start,
        "v-avatar--end": props.end
      }, themeClasses.value, colorClasses.value, densityClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, props.class],
      "style": [colorStyles.value, sizeStyles.value, props.style]
    }, {
      default: () => [props.image ? createVNode(VImg, {
        "key": "image",
        "src": props.image,
        "alt": "",
        "cover": true
      }, null) : props.icon ? createVNode(VIcon, {
        "key": "icon",
        "icon": props.icon
      }, null) : slots.default?.() ?? props.text, genOverlays(false, "v-avatar")]
    }));
    return {};
  }
});
const VChipGroup$1 = "";
const VChipGroupSymbol = Symbol.for("vuetify:v-chip-group");
const makeVChipGroupProps = propsFactory({
  column: Boolean,
  filter: Boolean,
  valueComparator: {
    type: Function,
    default: deepEqual
  },
  ...makeComponentProps(),
  ...makeGroupProps({
    selectedClass: "v-chip--selected"
  }),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "tonal"
  })
}, "VChipGroup");
const VChipGroup = genericComponent()({
  name: "VChipGroup",
  props: makeVChipGroupProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      isSelected,
      select,
      next,
      prev,
      selected
    } = useGroup(props, VChipGroupSymbol);
    provideDefaults({
      VChip: {
        color: toRef(props, "color"),
        disabled: toRef(props, "disabled"),
        filter: toRef(props, "filter"),
        variant: toRef(props, "variant")
      }
    });
    useRender(() => createVNode(props.tag, {
      "class": ["v-chip-group", {
        "v-chip-group--column": props.column
      }, themeClasses.value, props.class],
      "style": props.style
    }, {
      default: () => [slots.default?.({
        isSelected,
        select,
        next,
        prev,
        selected: selected.value
      })]
    }));
    return {};
  }
});
const makeVChipProps = propsFactory({
  activeClass: String,
  appendAvatar: String,
  appendIcon: IconValue,
  closable: Boolean,
  closeIcon: {
    type: IconValue,
    default: "$delete"
  },
  closeLabel: {
    type: String,
    default: "$vuetify.close"
  },
  draggable: Boolean,
  filter: Boolean,
  filterIcon: {
    type: String,
    default: "$complete"
  },
  label: Boolean,
  link: {
    type: Boolean,
    default: void 0
  },
  pill: Boolean,
  prependAvatar: String,
  prependIcon: IconValue,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  text: String,
  modelValue: {
    type: Boolean,
    default: true
  },
  onClick: EventProp(),
  onClickOnce: EventProp(),
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "span"
  }),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "tonal"
  })
}, "VChip");
const VChip = genericComponent()({
  name: "VChip",
  directives: {
    Ripple
  },
  props: makeVChipProps(),
  emits: {
    "click:close": (e) => true,
    "update:modelValue": (value) => true,
    "group:selected": (val) => true,
    click: (e) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses
    } = useSize(props);
    const {
      themeClasses
    } = provideTheme(props);
    const isActive = useProxiedModel(props, "modelValue");
    const group = useGroupItem(props, VChipGroupSymbol, false);
    const link = useLink(props, attrs);
    const isLink = computed(() => props.link !== false && link.isLink.value);
    const isClickable = computed(() => !props.disabled && props.link !== false && (!!group || props.link || link.isClickable.value));
    const closeProps = computed(() => ({
      "aria-label": t(props.closeLabel),
      onClick(e) {
        e.stopPropagation();
        isActive.value = false;
        emit2("click:close", e);
      }
    }));
    function onClick(e) {
      emit2("click", e);
      if (!isClickable.value)
        return;
      link.navigate?.(e);
      group?.toggle();
    }
    function onKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e);
      }
    }
    return () => {
      const Tag = link.isLink.value ? "a" : props.tag;
      const hasAppendMedia = !!(props.appendIcon || props.appendAvatar);
      const hasAppend = !!(hasAppendMedia || slots.append);
      const hasClose = !!(slots.close || props.closable);
      const hasFilter = !!(slots.filter || props.filter) && group;
      const hasPrependMedia = !!(props.prependIcon || props.prependAvatar);
      const hasPrepend = !!(hasPrependMedia || slots.prepend);
      const hasColor = !group || group.isSelected.value;
      return isActive.value && withDirectives(createVNode(Tag, {
        "class": ["v-chip", {
          "v-chip--disabled": props.disabled,
          "v-chip--label": props.label,
          "v-chip--link": isClickable.value,
          "v-chip--filter": hasFilter,
          "v-chip--pill": props.pill
        }, themeClasses.value, borderClasses.value, hasColor ? colorClasses.value : void 0, densityClasses.value, elevationClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, group?.selectedClass.value, props.class],
        "style": [hasColor ? colorStyles.value : void 0, props.style],
        "disabled": props.disabled || void 0,
        "draggable": props.draggable,
        "href": link.href.value,
        "tabindex": isClickable.value ? 0 : void 0,
        "onClick": onClick,
        "onKeydown": isClickable.value && !isLink.value && onKeyDown
      }, {
        default: () => [genOverlays(isClickable.value, "v-chip"), hasFilter && createVNode(VExpandXTransition, {
          "key": "filter"
        }, {
          default: () => [withDirectives(createVNode("div", {
            "class": "v-chip__filter"
          }, [!slots.filter ? createVNode(VIcon, {
            "key": "filter-icon",
            "icon": props.filterIcon
          }, null) : createVNode(VDefaultsProvider, {
            "key": "filter-defaults",
            "disabled": !props.filterIcon,
            "defaults": {
              VIcon: {
                icon: props.filterIcon
              }
            }
          }, slots.filter)]), [[vShow, group.isSelected.value]])]
        }), hasPrepend && createVNode("div", {
          "key": "prepend",
          "class": "v-chip__prepend"
        }, [!slots.prepend ? createVNode(Fragment, null, [props.prependIcon && createVNode(VIcon, {
          "key": "prepend-icon",
          "icon": props.prependIcon,
          "start": true
        }, null), props.prependAvatar && createVNode(VAvatar, {
          "key": "prepend-avatar",
          "image": props.prependAvatar,
          "start": true
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !hasPrependMedia,
          "defaults": {
            VAvatar: {
              image: props.prependAvatar,
              start: true
            },
            VIcon: {
              icon: props.prependIcon,
              start: true
            }
          }
        }, slots.prepend)]), createVNode("div", {
          "class": "v-chip__content"
        }, [slots.default?.({
          isSelected: group?.isSelected.value,
          selectedClass: group?.selectedClass.value,
          select: group?.select,
          toggle: group?.toggle,
          value: group?.value.value,
          disabled: props.disabled
        }) ?? props.text]), hasAppend && createVNode("div", {
          "key": "append",
          "class": "v-chip__append"
        }, [!slots.append ? createVNode(Fragment, null, [props.appendIcon && createVNode(VIcon, {
          "key": "append-icon",
          "end": true,
          "icon": props.appendIcon
        }, null), props.appendAvatar && createVNode(VAvatar, {
          "key": "append-avatar",
          "end": true,
          "image": props.appendAvatar
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "append-defaults",
          "disabled": !hasAppendMedia,
          "defaults": {
            VAvatar: {
              end: true,
              image: props.appendAvatar
            },
            VIcon: {
              end: true,
              icon: props.appendIcon
            }
          }
        }, slots.append)]), hasClose && createVNode("div", mergeProps({
          "key": "close",
          "class": "v-chip__close"
        }, closeProps.value), [!slots.close ? createVNode(VIcon, {
          "key": "close-icon",
          "icon": props.closeIcon,
          "size": "x-small"
        }, null) : createVNode(VDefaultsProvider, {
          "key": "close-defaults",
          "defaults": {
            VIcon: {
              icon: props.closeIcon,
              size: "x-small"
            }
          }
        }, slots.close)])]
      }), [[resolveDirective("ripple"), isClickable.value && props.ripple, null]]);
    };
  }
});
const VList$1 = "";
const ListKey = Symbol.for("vuetify:list");
function createList() {
  const parent = inject$1(ListKey, {
    hasPrepend: shallowRef(false),
    updateHasPrepend: () => null
  });
  const data = {
    hasPrepend: shallowRef(false),
    updateHasPrepend: (value) => {
      if (value)
        data.hasPrepend.value = value;
    }
  };
  provide(ListKey, data);
  return parent;
}
function useList() {
  return inject$1(ListKey, null);
}
const singleOpenStrategy = {
  open: (_ref) => {
    let {
      id,
      value,
      opened,
      parents
    } = _ref;
    if (value) {
      const newOpened = /* @__PURE__ */ new Set();
      newOpened.add(id);
      let parent = parents.get(id);
      while (parent != null) {
        newOpened.add(parent);
        parent = parents.get(parent);
      }
      return newOpened;
    } else {
      opened.delete(id);
      return opened;
    }
  },
  select: () => null
};
const multipleOpenStrategy = {
  open: (_ref2) => {
    let {
      id,
      value,
      opened,
      parents
    } = _ref2;
    if (value) {
      let parent = parents.get(id);
      opened.add(id);
      while (parent != null && parent !== id) {
        opened.add(parent);
        parent = parents.get(parent);
      }
      return opened;
    } else {
      opened.delete(id);
    }
    return opened;
  },
  select: () => null
};
const listOpenStrategy = {
  open: multipleOpenStrategy.open,
  select: (_ref3) => {
    let {
      id,
      value,
      opened,
      parents
    } = _ref3;
    if (!value)
      return opened;
    const path = [];
    let parent = parents.get(id);
    while (parent != null) {
      path.push(parent);
      parent = parents.get(parent);
    }
    return new Set(path);
  }
};
const independentSelectStrategy = (mandatory) => {
  const strategy = {
    select: (_ref) => {
      let {
        id,
        value,
        selected
      } = _ref;
      id = toRaw(id);
      if (mandatory && !value) {
        const on = Array.from(selected.entries()).reduce((arr, _ref2) => {
          let [key, value2] = _ref2;
          return value2 === "on" ? [...arr, key] : arr;
        }, []);
        if (on.length === 1 && on[0] === id)
          return selected;
      }
      selected.set(id, value ? "on" : "off");
      return selected;
    },
    in: (v, children, parents) => {
      let map = /* @__PURE__ */ new Map();
      for (const id of v || []) {
        map = strategy.select({
          id,
          value: true,
          selected: new Map(map),
          children,
          parents
        });
      }
      return map;
    },
    out: (v) => {
      const arr = [];
      for (const [key, value] of v.entries()) {
        if (value === "on")
          arr.push(key);
      }
      return arr;
    }
  };
  return strategy;
};
const independentSingleSelectStrategy = (mandatory) => {
  const parentStrategy = independentSelectStrategy(mandatory);
  const strategy = {
    select: (_ref3) => {
      let {
        selected,
        id,
        ...rest
      } = _ref3;
      id = toRaw(id);
      const singleSelected = selected.has(id) ? /* @__PURE__ */ new Map([[id, selected.get(id)]]) : /* @__PURE__ */ new Map();
      return parentStrategy.select({
        ...rest,
        id,
        selected: singleSelected
      });
    },
    in: (v, children, parents) => {
      let map = /* @__PURE__ */ new Map();
      if (v?.length) {
        map = parentStrategy.in(v.slice(0, 1), children, parents);
      }
      return map;
    },
    out: (v, children, parents) => {
      return parentStrategy.out(v, children, parents);
    }
  };
  return strategy;
};
const leafSelectStrategy = (mandatory) => {
  const parentStrategy = independentSelectStrategy(mandatory);
  const strategy = {
    select: (_ref4) => {
      let {
        id,
        selected,
        children,
        ...rest
      } = _ref4;
      id = toRaw(id);
      if (children.has(id))
        return selected;
      return parentStrategy.select({
        id,
        selected,
        children,
        ...rest
      });
    },
    in: parentStrategy.in,
    out: parentStrategy.out
  };
  return strategy;
};
const leafSingleSelectStrategy = (mandatory) => {
  const parentStrategy = independentSingleSelectStrategy(mandatory);
  const strategy = {
    select: (_ref5) => {
      let {
        id,
        selected,
        children,
        ...rest
      } = _ref5;
      id = toRaw(id);
      if (children.has(id))
        return selected;
      return parentStrategy.select({
        id,
        selected,
        children,
        ...rest
      });
    },
    in: parentStrategy.in,
    out: parentStrategy.out
  };
  return strategy;
};
const classicSelectStrategy = (mandatory) => {
  const strategy = {
    select: (_ref6) => {
      let {
        id,
        value,
        selected,
        children,
        parents
      } = _ref6;
      id = toRaw(id);
      const original = new Map(selected);
      const items = [id];
      while (items.length) {
        const item = items.shift();
        selected.set(item, value ? "on" : "off");
        if (children.has(item)) {
          items.push(...children.get(item));
        }
      }
      let parent = parents.get(id);
      while (parent) {
        const childrenIds = children.get(parent);
        const everySelected = childrenIds.every((cid) => selected.get(cid) === "on");
        const noneSelected = childrenIds.every((cid) => !selected.has(cid) || selected.get(cid) === "off");
        selected.set(parent, everySelected ? "on" : noneSelected ? "off" : "indeterminate");
        parent = parents.get(parent);
      }
      if (mandatory && !value) {
        const on = Array.from(selected.entries()).reduce((arr, _ref7) => {
          let [key, value2] = _ref7;
          return value2 === "on" ? [...arr, key] : arr;
        }, []);
        if (on.length === 0)
          return original;
      }
      return selected;
    },
    in: (v, children, parents) => {
      let map = /* @__PURE__ */ new Map();
      for (const id of v || []) {
        map = strategy.select({
          id,
          value: true,
          selected: new Map(map),
          children,
          parents
        });
      }
      return map;
    },
    out: (v, children) => {
      const arr = [];
      for (const [key, value] of v.entries()) {
        if (value === "on" && !children.has(key))
          arr.push(key);
      }
      return arr;
    }
  };
  return strategy;
};
const VNestedSymbol = Symbol.for("vuetify:nested");
const emptyNested = {
  id: shallowRef(),
  root: {
    register: () => null,
    unregister: () => null,
    parents: ref(/* @__PURE__ */ new Map()),
    children: ref(/* @__PURE__ */ new Map()),
    open: () => null,
    openOnSelect: () => null,
    select: () => null,
    opened: ref(/* @__PURE__ */ new Set()),
    selected: ref(/* @__PURE__ */ new Map()),
    selectedValues: ref([])
  }
};
const makeNestedProps = propsFactory({
  selectStrategy: [String, Function],
  openStrategy: [String, Object],
  opened: Array,
  selected: Array,
  mandatory: Boolean
}, "nested");
const useNested = (props) => {
  let isUnmounted = false;
  const children = ref(/* @__PURE__ */ new Map());
  const parents = ref(/* @__PURE__ */ new Map());
  const opened = useProxiedModel(props, "opened", props.opened, (v) => new Set(v), (v) => [...v.values()]);
  const selectStrategy = computed(() => {
    if (typeof props.selectStrategy === "object")
      return props.selectStrategy;
    switch (props.selectStrategy) {
      case "single-leaf":
        return leafSingleSelectStrategy(props.mandatory);
      case "leaf":
        return leafSelectStrategy(props.mandatory);
      case "independent":
        return independentSelectStrategy(props.mandatory);
      case "single-independent":
        return independentSingleSelectStrategy(props.mandatory);
      case "classic":
      default:
        return classicSelectStrategy(props.mandatory);
    }
  });
  const openStrategy = computed(() => {
    if (typeof props.openStrategy === "object")
      return props.openStrategy;
    switch (props.openStrategy) {
      case "list":
        return listOpenStrategy;
      case "single":
        return singleOpenStrategy;
      case "multiple":
      default:
        return multipleOpenStrategy;
    }
  });
  const selected = useProxiedModel(props, "selected", props.selected, (v) => selectStrategy.value.in(v, children.value, parents.value), (v) => selectStrategy.value.out(v, children.value, parents.value));
  onBeforeUnmount(() => {
    isUnmounted = true;
  });
  function getPath(id) {
    const path = [];
    let parent = id;
    while (parent != null) {
      path.unshift(parent);
      parent = parents.value.get(parent);
    }
    return path;
  }
  const vm = getCurrentInstance("nested");
  const nested = {
    id: shallowRef(),
    root: {
      opened,
      selected,
      selectedValues: computed(() => {
        const arr = [];
        for (const [key, value] of selected.value.entries()) {
          if (value === "on")
            arr.push(key);
        }
        return arr;
      }),
      register: (id, parentId, isGroup) => {
        parentId && id !== parentId && parents.value.set(id, parentId);
        isGroup && children.value.set(id, []);
        if (parentId != null) {
          children.value.set(parentId, [...children.value.get(parentId) || [], id]);
        }
      },
      unregister: (id) => {
        if (isUnmounted)
          return;
        children.value.delete(id);
        const parent = parents.value.get(id);
        if (parent) {
          const list = children.value.get(parent) ?? [];
          children.value.set(parent, list.filter((child) => child !== id));
        }
        parents.value.delete(id);
        opened.value.delete(id);
      },
      open: (id, value, event) => {
        vm.emit("click:open", {
          id,
          value,
          path: getPath(id),
          event
        });
        const newOpened = openStrategy.value.open({
          id,
          value,
          opened: new Set(opened.value),
          children: children.value,
          parents: parents.value,
          event
        });
        newOpened && (opened.value = newOpened);
      },
      openOnSelect: (id, value, event) => {
        const newOpened = openStrategy.value.select({
          id,
          value,
          selected: new Map(selected.value),
          opened: new Set(opened.value),
          children: children.value,
          parents: parents.value,
          event
        });
        newOpened && (opened.value = newOpened);
      },
      select: (id, value, event) => {
        vm.emit("click:select", {
          id,
          value,
          path: getPath(id),
          event
        });
        const newSelected = selectStrategy.value.select({
          id,
          value,
          selected: new Map(selected.value),
          children: children.value,
          parents: parents.value,
          event
        });
        newSelected && (selected.value = newSelected);
        nested.root.openOnSelect(id, value, event);
      },
      children,
      parents
    }
  };
  provide(VNestedSymbol, nested);
  return nested.root;
};
const useNestedItem = (id, isGroup) => {
  const parent = inject$1(VNestedSymbol, emptyNested);
  const uidSymbol = Symbol(getUid());
  const computedId = computed(() => id.value !== void 0 ? id.value : uidSymbol);
  const item = {
    ...parent,
    id: computedId,
    open: (open, e) => parent.root.open(computedId.value, open, e),
    openOnSelect: (open, e) => parent.root.openOnSelect(computedId.value, open, e),
    isOpen: computed(() => parent.root.opened.value.has(computedId.value)),
    parent: computed(() => parent.root.parents.value.get(computedId.value)),
    select: (selected, e) => parent.root.select(computedId.value, selected, e),
    isSelected: computed(() => parent.root.selected.value.get(toRaw(computedId.value)) === "on"),
    isIndeterminate: computed(() => parent.root.selected.value.get(computedId.value) === "indeterminate"),
    isLeaf: computed(() => !parent.root.children.value.get(computedId.value)),
    isGroupActivator: parent.isGroupActivator
  };
  !parent.isGroupActivator && parent.root.register(computedId.value, parent.id.value, isGroup);
  onBeforeUnmount(() => {
    !parent.isGroupActivator && parent.root.unregister(computedId.value);
  });
  isGroup && provide(VNestedSymbol, item);
  return item;
};
const useNestedGroupActivator = () => {
  const parent = inject$1(VNestedSymbol, emptyNested);
  provide(VNestedSymbol, {
    ...parent,
    isGroupActivator: true
  });
};
const VListGroupActivator = defineComponent({
  name: "VListGroupActivator",
  setup(_, _ref) {
    let {
      slots
    } = _ref;
    useNestedGroupActivator();
    return () => slots.default?.();
  }
});
const makeVListGroupProps = propsFactory({
  /* @deprecated */
  activeColor: String,
  baseColor: String,
  color: String,
  collapseIcon: {
    type: IconValue,
    default: "$collapse"
  },
  expandIcon: {
    type: IconValue,
    default: "$expand"
  },
  prependIcon: IconValue,
  appendIcon: IconValue,
  fluid: Boolean,
  subgroup: Boolean,
  title: String,
  value: null,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListGroup");
const VListGroup = genericComponent()({
  name: "VListGroup",
  props: makeVListGroupProps(),
  setup(props, _ref2) {
    let {
      slots
    } = _ref2;
    const {
      isOpen,
      open,
      id: _id
    } = useNestedItem(toRef(props, "value"), true);
    const id = computed(() => `v-list-group--id-${String(_id.value)}`);
    const list = useList();
    const {
      isBooted
    } = useSsrBoot();
    function onClick(e) {
      open(!isOpen.value, e);
    }
    const activatorProps = computed(() => ({
      onClick,
      class: "v-list-group__header",
      id: id.value
    }));
    const toggleIcon = computed(() => isOpen.value ? props.collapseIcon : props.expandIcon);
    const activatorDefaults = computed(() => ({
      VListItem: {
        active: isOpen.value,
        activeColor: props.activeColor,
        baseColor: props.baseColor,
        color: props.color,
        prependIcon: props.prependIcon || props.subgroup && toggleIcon.value,
        appendIcon: props.appendIcon || !props.subgroup && toggleIcon.value,
        title: props.title,
        value: props.value
      }
    }));
    useRender(() => createVNode(props.tag, {
      "class": ["v-list-group", {
        "v-list-group--prepend": list?.hasPrepend.value,
        "v-list-group--fluid": props.fluid,
        "v-list-group--subgroup": props.subgroup,
        "v-list-group--open": isOpen.value
      }, props.class],
      "style": props.style
    }, {
      default: () => [slots.activator && createVNode(VDefaultsProvider, {
        "defaults": activatorDefaults.value
      }, {
        default: () => [createVNode(VListGroupActivator, null, {
          default: () => [slots.activator({
            props: activatorProps.value,
            isOpen: isOpen.value
          })]
        })]
      }), createVNode(MaybeTransition, {
        "transition": {
          component: VExpandTransition
        },
        "disabled": !isBooted.value
      }, {
        default: () => [withDirectives(createVNode("div", {
          "class": "v-list-group__items",
          "role": "group",
          "aria-labelledby": id.value
        }, [slots.default?.()]), [[vShow, isOpen.value]])]
      })]
    }));
    return {};
  }
});
const VListItem$1 = "";
const VListItemSubtitle = createSimpleFunctional("v-list-item-subtitle");
const VListItemTitle = createSimpleFunctional("v-list-item-title");
const makeVListItemProps = propsFactory({
  active: {
    type: Boolean,
    default: void 0
  },
  activeClass: String,
  /* @deprecated */
  activeColor: String,
  appendAvatar: String,
  appendIcon: IconValue,
  baseColor: String,
  disabled: Boolean,
  lines: String,
  link: {
    type: Boolean,
    default: void 0
  },
  nav: Boolean,
  prependAvatar: String,
  prependIcon: IconValue,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  slim: Boolean,
  subtitle: [String, Number],
  title: [String, Number],
  value: null,
  onClick: EventProp(),
  onClickOnce: EventProp(),
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VListItem");
const VListItem = genericComponent()({
  name: "VListItem",
  directives: {
    Ripple
  },
  props: makeVListItemProps(),
  emits: {
    click: (e) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit: emit2
    } = _ref;
    const link = useLink(props, attrs);
    const id = computed(() => props.value === void 0 ? link.href.value : props.value);
    const {
      select,
      isSelected,
      isIndeterminate,
      isGroupActivator,
      root,
      parent,
      openOnSelect
    } = useNestedItem(id, false);
    const list = useList();
    const isActive = computed(() => props.active !== false && (props.active || link.isActive?.value || isSelected.value));
    const isLink = computed(() => props.link !== false && link.isLink.value);
    const isClickable = computed(() => !props.disabled && props.link !== false && (props.link || link.isClickable.value || props.value != null && !!list));
    const roundedProps = computed(() => props.rounded || props.nav);
    const color = computed(() => props.color ?? props.activeColor);
    const variantProps = computed(() => ({
      color: isActive.value ? color.value ?? props.baseColor : props.baseColor,
      variant: props.variant
    }));
    watch(() => link.isActive?.value, (val) => {
      if (val && parent.value != null) {
        root.open(parent.value, true);
      }
      if (val) {
        openOnSelect(val);
      }
    }, {
      immediate: true
    });
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(variantProps);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(roundedProps);
    const lineClasses = computed(() => props.lines ? `v-list-item--${props.lines}-line` : void 0);
    const slotProps = computed(() => ({
      isActive: isActive.value,
      select,
      isSelected: isSelected.value,
      isIndeterminate: isIndeterminate.value
    }));
    function onClick(e) {
      emit2("click", e);
      if (isGroupActivator || !isClickable.value)
        return;
      link.navigate?.(e);
      props.value != null && select(!isSelected.value, e);
    }
    function onKeyDown(e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick(e);
      }
    }
    useRender(() => {
      const Tag = isLink.value ? "a" : props.tag;
      const hasTitle = slots.title || props.title != null;
      const hasSubtitle = slots.subtitle || props.subtitle != null;
      const hasAppendMedia = !!(props.appendAvatar || props.appendIcon);
      const hasAppend = !!(hasAppendMedia || slots.append);
      const hasPrependMedia = !!(props.prependAvatar || props.prependIcon);
      const hasPrepend = !!(hasPrependMedia || slots.prepend);
      list?.updateHasPrepend(hasPrepend);
      if (props.activeColor) {
        deprecate("active-color", ["color", "base-color"]);
      }
      return withDirectives(createVNode(Tag, {
        "class": ["v-list-item", {
          "v-list-item--active": isActive.value,
          "v-list-item--disabled": props.disabled,
          "v-list-item--link": isClickable.value,
          "v-list-item--nav": props.nav,
          "v-list-item--prepend": !hasPrepend && list?.hasPrepend.value,
          "v-list-item--slim": props.slim,
          [`${props.activeClass}`]: props.activeClass && isActive.value
        }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, lineClasses.value, roundedClasses.value, variantClasses.value, props.class],
        "style": [colorStyles.value, dimensionStyles.value, props.style],
        "href": link.href.value,
        "tabindex": isClickable.value ? list ? -2 : 0 : void 0,
        "onClick": onClick,
        "onKeydown": isClickable.value && !isLink.value && onKeyDown
      }, {
        default: () => [genOverlays(isClickable.value || isActive.value, "v-list-item"), hasPrepend && createVNode("div", {
          "key": "prepend",
          "class": "v-list-item__prepend"
        }, [!slots.prepend ? createVNode(Fragment, null, [props.prependAvatar && createVNode(VAvatar, {
          "key": "prepend-avatar",
          "density": props.density,
          "image": props.prependAvatar
        }, null), props.prependIcon && createVNode(VIcon, {
          "key": "prepend-icon",
          "density": props.density,
          "icon": props.prependIcon
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !hasPrependMedia,
          "defaults": {
            VAvatar: {
              density: props.density,
              image: props.prependAvatar
            },
            VIcon: {
              density: props.density,
              icon: props.prependIcon
            },
            VListItemAction: {
              start: true
            }
          }
        }, {
          default: () => [slots.prepend?.(slotProps.value)]
        }), createVNode("div", {
          "class": "v-list-item__spacer"
        }, null)]), createVNode("div", {
          "class": "v-list-item__content",
          "data-no-activator": ""
        }, [hasTitle && createVNode(VListItemTitle, {
          "key": "title"
        }, {
          default: () => [slots.title?.({
            title: props.title
          }) ?? props.title]
        }), hasSubtitle && createVNode(VListItemSubtitle, {
          "key": "subtitle"
        }, {
          default: () => [slots.subtitle?.({
            subtitle: props.subtitle
          }) ?? props.subtitle]
        }), slots.default?.(slotProps.value)]), hasAppend && createVNode("div", {
          "key": "append",
          "class": "v-list-item__append"
        }, [!slots.append ? createVNode(Fragment, null, [props.appendIcon && createVNode(VIcon, {
          "key": "append-icon",
          "density": props.density,
          "icon": props.appendIcon
        }, null), props.appendAvatar && createVNode(VAvatar, {
          "key": "append-avatar",
          "density": props.density,
          "image": props.appendAvatar
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "append-defaults",
          "disabled": !hasAppendMedia,
          "defaults": {
            VAvatar: {
              density: props.density,
              image: props.appendAvatar
            },
            VIcon: {
              density: props.density,
              icon: props.appendIcon
            },
            VListItemAction: {
              end: true
            }
          }
        }, {
          default: () => [slots.append?.(slotProps.value)]
        }), createVNode("div", {
          "class": "v-list-item__spacer"
        }, null)])]
      }), [[resolveDirective("ripple"), isClickable.value && props.ripple]]);
    });
    return {};
  }
});
const makeVListSubheaderProps = propsFactory({
  color: String,
  inset: Boolean,
  sticky: Boolean,
  title: String,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListSubheader");
const VListSubheader = genericComponent()({
  name: "VListSubheader",
  props: makeVListSubheaderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "color"));
    useRender(() => {
      const hasText = !!(slots.default || props.title);
      return createVNode(props.tag, {
        "class": ["v-list-subheader", {
          "v-list-subheader--inset": props.inset,
          "v-list-subheader--sticky": props.sticky
        }, textColorClasses.value, props.class],
        "style": [{
          textColorStyles
        }, props.style]
      }, {
        default: () => [hasText && createVNode("div", {
          "class": "v-list-subheader__text"
        }, [slots.default?.() ?? props.title])]
      });
    });
    return {};
  }
});
const VDivider$1 = "";
const makeVDividerProps = propsFactory({
  color: String,
  inset: Boolean,
  length: [Number, String],
  thickness: [Number, String],
  vertical: Boolean,
  ...makeComponentProps(),
  ...makeThemeProps()
}, "VDivider");
const VDivider = genericComponent()({
  name: "VDivider",
  props: makeVDividerProps(),
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "color"));
    const dividerStyles = computed(() => {
      const styles = {};
      if (props.length) {
        styles[props.vertical ? "maxHeight" : "maxWidth"] = convertToUnit(props.length);
      }
      if (props.thickness) {
        styles[props.vertical ? "borderRightWidth" : "borderTopWidth"] = convertToUnit(props.thickness);
      }
      return styles;
    });
    useRender(() => createVNode("hr", {
      "class": [{
        "v-divider": true,
        "v-divider--inset": props.inset,
        "v-divider--vertical": props.vertical
      }, themeClasses.value, textColorClasses.value, props.class],
      "style": [dividerStyles.value, textColorStyles.value, props.style],
      "aria-orientation": !attrs.role || attrs.role === "separator" ? props.vertical ? "vertical" : "horizontal" : void 0,
      "role": `${attrs.role || "separator"}`
    }, null));
    return {};
  }
});
const makeVListChildrenProps = propsFactory({
  items: Array,
  returnObject: Boolean
}, "VListChildren");
const VListChildren = genericComponent()({
  name: "VListChildren",
  props: makeVListChildrenProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    createList();
    return () => slots.default?.() ?? props.items?.map((_ref2) => {
      let {
        children,
        props: itemProps,
        type,
        raw: item
      } = _ref2;
      if (type === "divider") {
        return slots.divider?.({
          props: itemProps
        }) ?? createVNode(VDivider, itemProps, null);
      }
      if (type === "subheader") {
        return slots.subheader?.({
          props: itemProps
        }) ?? createVNode(VListSubheader, itemProps, null);
      }
      const slotsWithItem = {
        subtitle: slots.subtitle ? (slotProps) => slots.subtitle?.({
          ...slotProps,
          item
        }) : void 0,
        prepend: slots.prepend ? (slotProps) => slots.prepend?.({
          ...slotProps,
          item
        }) : void 0,
        append: slots.append ? (slotProps) => slots.append?.({
          ...slotProps,
          item
        }) : void 0,
        title: slots.title ? (slotProps) => slots.title?.({
          ...slotProps,
          item
        }) : void 0
      };
      const listGroupProps = VListGroup.filterProps(itemProps);
      return children ? createVNode(VListGroup, mergeProps({
        "value": itemProps?.value
      }, listGroupProps), {
        activator: (_ref3) => {
          let {
            props: activatorProps
          } = _ref3;
          const listItemProps = {
            ...itemProps,
            ...activatorProps,
            value: props.returnObject ? item : itemProps.value
          };
          return slots.header ? slots.header({
            props: listItemProps
          }) : createVNode(VListItem, listItemProps, slotsWithItem);
        },
        default: () => createVNode(VListChildren, {
          "items": children
        }, slots)
      }) : slots.item ? slots.item({
        props: itemProps
      }) : createVNode(VListItem, mergeProps(itemProps, {
        "value": props.returnObject ? item : itemProps.value
      }), slotsWithItem);
    });
  }
});
const makeItemsProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: [String, Array, Function],
    default: "title"
  },
  itemValue: {
    type: [String, Array, Function],
    default: "value"
  },
  itemChildren: {
    type: [Boolean, String, Array, Function],
    default: "children"
  },
  itemProps: {
    type: [Boolean, String, Array, Function],
    default: "props"
  },
  returnObject: Boolean,
  valueComparator: {
    type: Function,
    default: deepEqual
  }
}, "list-items");
function transformItem$3(props, item) {
  const title = getPropertyFromItem(item, props.itemTitle, item);
  const value = getPropertyFromItem(item, props.itemValue, title);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps = props.itemProps === true ? typeof item === "object" && item != null && !Array.isArray(item) ? "children" in item ? omit(item, ["children"]) : item : void 0 : getPropertyFromItem(item, props.itemProps);
  const _props = {
    title,
    value,
    ...itemProps
  };
  return {
    title: String(_props.title ?? ""),
    value: _props.value,
    props: _props,
    children: Array.isArray(children) ? transformItems$3(props, children) : void 0,
    raw: item
  };
}
function transformItems$3(props, items) {
  const array = [];
  for (const item of items) {
    array.push(transformItem$3(props, item));
  }
  return array;
}
function useItems(props) {
  const items = computed(() => transformItems$3(props, props.items));
  const hasNullItem = computed(() => items.value.some((item) => item.value === null));
  function transformIn(value) {
    if (!hasNullItem.value) {
      value = value.filter((v) => v !== null);
    }
    return value.map((v) => {
      if (props.returnObject && typeof v === "string") {
        return transformItem$3(props, v);
      }
      return items.value.find((item) => props.valueComparator(v, item.value)) || transformItem$3(props, v);
    });
  }
  function transformOut(value) {
    return props.returnObject ? value.map((_ref) => {
      let {
        raw
      } = _ref;
      return raw;
    }) : value.map((_ref2) => {
      let {
        value: value2
      } = _ref2;
      return value2;
    });
  }
  return {
    items,
    transformIn,
    transformOut
  };
}
function isPrimitive(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}
function transformItem$2(props, item) {
  const type = getPropertyFromItem(item, props.itemType, "item");
  const title = isPrimitive(item) ? item : getPropertyFromItem(item, props.itemTitle);
  const value = getPropertyFromItem(item, props.itemValue, void 0);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps = props.itemProps === true ? omit(item, ["children"]) : getPropertyFromItem(item, props.itemProps);
  const _props = {
    title,
    value,
    ...itemProps
  };
  return {
    type,
    title: _props.title,
    value: _props.value,
    props: _props,
    children: type === "item" && children ? transformItems$2(props, children) : void 0,
    raw: item
  };
}
function transformItems$2(props, items) {
  const array = [];
  for (const item of items) {
    array.push(transformItem$2(props, item));
  }
  return array;
}
function useListItems(props) {
  const items = computed(() => transformItems$2(props, props.items));
  return {
    items
  };
}
const makeVListProps = propsFactory({
  baseColor: String,
  /* @deprecated */
  activeColor: String,
  activeClass: String,
  bgColor: String,
  disabled: Boolean,
  lines: {
    type: [Boolean, String],
    default: "one"
  },
  slim: Boolean,
  nav: Boolean,
  ...makeNestedProps({
    selectStrategy: "single-leaf",
    openStrategy: "list"
  }),
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  itemType: {
    type: String,
    default: "type"
  },
  ...makeItemsProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VList");
const VList = genericComponent()({
  name: "VList",
  props: makeVListProps(),
  emits: {
    "update:selected": (value) => true,
    "update:opened": (value) => true,
    "click:open": (value) => true,
    "click:select": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      items
    } = useListItems(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "bgColor"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      open,
      select
    } = useNested(props);
    const lineClasses = computed(() => props.lines ? `v-list--${props.lines}-line` : void 0);
    const activeColor = toRef(props, "activeColor");
    const baseColor = toRef(props, "baseColor");
    const color = toRef(props, "color");
    createList();
    provideDefaults({
      VListGroup: {
        activeColor,
        baseColor,
        color
      },
      VListItem: {
        activeClass: toRef(props, "activeClass"),
        activeColor,
        baseColor,
        color,
        density: toRef(props, "density"),
        disabled: toRef(props, "disabled"),
        lines: toRef(props, "lines"),
        nav: toRef(props, "nav"),
        slim: toRef(props, "slim"),
        variant: toRef(props, "variant")
      }
    });
    const isFocused = shallowRef(false);
    const contentRef = ref();
    function onFocusin(e) {
      isFocused.value = true;
    }
    function onFocusout(e) {
      isFocused.value = false;
    }
    function onFocus(e) {
      if (!isFocused.value && !(e.relatedTarget && contentRef.value?.contains(e.relatedTarget)))
        focus();
    }
    function onKeydown(e) {
      if (!contentRef.value)
        return;
      if (e.key === "ArrowDown") {
        focus("next");
      } else if (e.key === "ArrowUp") {
        focus("prev");
      } else if (e.key === "Home") {
        focus("first");
      } else if (e.key === "End") {
        focus("last");
      } else {
        return;
      }
      e.preventDefault();
    }
    function focus(location2) {
      if (contentRef.value) {
        return focusChild(contentRef.value, location2);
      }
    }
    useRender(() => {
      return createVNode(props.tag, {
        "ref": contentRef,
        "class": ["v-list", {
          "v-list--disabled": props.disabled,
          "v-list--nav": props.nav
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, lineClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, dimensionStyles.value, props.style],
        "tabindex": props.disabled || isFocused.value ? -1 : 0,
        "role": "listbox",
        "aria-activedescendant": void 0,
        "onFocusin": onFocusin,
        "onFocusout": onFocusout,
        "onFocus": onFocus,
        "onKeydown": onKeydown
      }, {
        default: () => [createVNode(VListChildren, {
          "items": items.value,
          "returnObject": props.returnObject
        }, slots)]
      });
    });
    return {
      open,
      select,
      focus
    };
  }
});
const VListImg = createSimpleFunctional("v-list-img");
const makeVListItemActionProps = propsFactory({
  start: Boolean,
  end: Boolean,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListItemAction");
const VListItemAction = genericComponent()({
  name: "VListItemAction",
  props: makeVListItemActionProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(props.tag, {
      "class": ["v-list-item-action", {
        "v-list-item-action--start": props.start,
        "v-list-item-action--end": props.end
      }, props.class],
      "style": props.style
    }, slots));
    return {};
  }
});
const makeVListItemMediaProps = propsFactory({
  start: Boolean,
  end: Boolean,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListItemMedia");
const VListItemMedia = genericComponent()({
  name: "VListItemMedia",
  props: makeVListItemMediaProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => {
      return createVNode(props.tag, {
        "class": ["v-list-item-media", {
          "v-list-item-media--start": props.start,
          "v-list-item-media--end": props.end
        }, props.class],
        "style": props.style
      }, slots);
    });
    return {};
  }
});
const VMenu$1 = "";
const VOverlay$1 = "";
function elementToViewport(point, offset) {
  return {
    x: point.x + offset.x,
    y: point.y + offset.y
  };
}
function getOffset$1(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}
function anchorToPoint(anchor, box) {
  if (anchor.side === "top" || anchor.side === "bottom") {
    const {
      side,
      align
    } = anchor;
    const x = align === "left" ? 0 : align === "center" ? box.width / 2 : align === "right" ? box.width : align;
    const y = side === "top" ? 0 : side === "bottom" ? box.height : side;
    return elementToViewport({
      x,
      y
    }, box);
  } else if (anchor.side === "left" || anchor.side === "right") {
    const {
      side,
      align
    } = anchor;
    const x = side === "left" ? 0 : side === "right" ? box.width : side;
    const y = align === "top" ? 0 : align === "center" ? box.height / 2 : align === "bottom" ? box.height : align;
    return elementToViewport({
      x,
      y
    }, box);
  }
  return elementToViewport({
    x: box.width / 2,
    y: box.height / 2
  }, box);
}
const locationStrategies = {
  static: staticLocationStrategy,
  // specific viewport position, usually centered
  connected: connectedLocationStrategy
  // connected to a certain element
};
const makeLocationStrategyProps = propsFactory({
  locationStrategy: {
    type: [String, Function],
    default: "static",
    validator: (val) => typeof val === "function" || val in locationStrategies
  },
  location: {
    type: String,
    default: "bottom"
  },
  origin: {
    type: String,
    default: "auto"
  },
  offset: [Number, String, Array]
}, "VOverlay-location-strategies");
function useLocationStrategies(props, data) {
  const contentStyles = ref({});
  const updateLocation = ref();
  if (IN_BROWSER) {
    useToggleScope(() => !!(data.isActive.value && props.locationStrategy), (reset) => {
      watch(() => props.locationStrategy, reset);
      onScopeDispose(() => {
        window.removeEventListener("resize", onResize);
        updateLocation.value = void 0;
      });
      window.addEventListener("resize", onResize, {
        passive: true
      });
      if (typeof props.locationStrategy === "function") {
        updateLocation.value = props.locationStrategy(data, props, contentStyles)?.updateLocation;
      } else {
        updateLocation.value = locationStrategies[props.locationStrategy](data, props, contentStyles)?.updateLocation;
      }
    });
  }
  function onResize(e) {
    updateLocation.value?.(e);
  }
  return {
    contentStyles,
    updateLocation
  };
}
function staticLocationStrategy() {
}
function getIntrinsicSize(el, isRtl) {
  if (isRtl) {
    el.style.removeProperty("left");
  } else {
    el.style.removeProperty("right");
  }
  const contentBox = nullifyTransforms(el);
  if (isRtl) {
    contentBox.x += parseFloat(el.style.right || 0);
  } else {
    contentBox.x -= parseFloat(el.style.left || 0);
  }
  contentBox.y -= parseFloat(el.style.top || 0);
  return contentBox;
}
function connectedLocationStrategy(data, props, contentStyles) {
  const activatorFixed = Array.isArray(data.target.value) || isFixedPosition(data.target.value);
  if (activatorFixed) {
    Object.assign(contentStyles.value, {
      position: "fixed",
      top: 0,
      [data.isRtl.value ? "right" : "left"]: 0
    });
  }
  const {
    preferredAnchor,
    preferredOrigin
  } = destructComputed(() => {
    const parsedAnchor = parseAnchor(props.location, data.isRtl.value);
    const parsedOrigin = props.origin === "overlap" ? parsedAnchor : props.origin === "auto" ? flipSide(parsedAnchor) : parseAnchor(props.origin, data.isRtl.value);
    if (parsedAnchor.side === parsedOrigin.side && parsedAnchor.align === flipAlign(parsedOrigin).align) {
      return {
        preferredAnchor: flipCorner(parsedAnchor),
        preferredOrigin: flipCorner(parsedOrigin)
      };
    } else {
      return {
        preferredAnchor: parsedAnchor,
        preferredOrigin: parsedOrigin
      };
    }
  });
  const [minWidth, minHeight, maxWidth, maxHeight] = ["minWidth", "minHeight", "maxWidth", "maxHeight"].map((key) => {
    return computed(() => {
      const val = parseFloat(props[key]);
      return isNaN(val) ? Infinity : val;
    });
  });
  const offset = computed(() => {
    if (Array.isArray(props.offset)) {
      return props.offset;
    }
    if (typeof props.offset === "string") {
      const offset2 = props.offset.split(" ").map(parseFloat);
      if (offset2.length < 2)
        offset2.push(0);
      return offset2;
    }
    return typeof props.offset === "number" ? [props.offset, 0] : [0, 0];
  });
  let observe = false;
  const observer = new ResizeObserver(() => {
    if (observe)
      updateLocation();
  });
  watch([data.target, data.contentEl], (_ref, _ref2) => {
    let [newTarget, newContentEl] = _ref;
    let [oldTarget, oldContentEl] = _ref2;
    if (oldTarget && !Array.isArray(oldTarget))
      observer.unobserve(oldTarget);
    if (newTarget && !Array.isArray(newTarget))
      observer.observe(newTarget);
    if (oldContentEl)
      observer.unobserve(oldContentEl);
    if (newContentEl)
      observer.observe(newContentEl);
  }, {
    immediate: true
  });
  onScopeDispose(() => {
    observer.disconnect();
  });
  function updateLocation() {
    observe = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => observe = true);
    });
    if (!data.target.value || !data.contentEl.value)
      return;
    const targetBox = getTargetBox(data.target.value);
    const contentBox = getIntrinsicSize(data.contentEl.value, data.isRtl.value);
    const scrollParents = getScrollParents(data.contentEl.value);
    const viewportMargin = 12;
    if (!scrollParents.length) {
      scrollParents.push(document.documentElement);
      if (!(data.contentEl.value.style.top && data.contentEl.value.style.left)) {
        contentBox.x -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-x") || 0);
        contentBox.y -= parseFloat(document.documentElement.style.getPropertyValue("--v-body-scroll-y") || 0);
      }
    }
    const viewport = scrollParents.reduce((box, el) => {
      const rect = el.getBoundingClientRect();
      const scrollBox = new Box({
        x: el === document.documentElement ? 0 : rect.x,
        y: el === document.documentElement ? 0 : rect.y,
        width: el.clientWidth,
        height: el.clientHeight
      });
      if (box) {
        return new Box({
          x: Math.max(box.left, scrollBox.left),
          y: Math.max(box.top, scrollBox.top),
          width: Math.min(box.right, scrollBox.right) - Math.max(box.left, scrollBox.left),
          height: Math.min(box.bottom, scrollBox.bottom) - Math.max(box.top, scrollBox.top)
        });
      }
      return scrollBox;
    }, void 0);
    viewport.x += viewportMargin;
    viewport.y += viewportMargin;
    viewport.width -= viewportMargin * 2;
    viewport.height -= viewportMargin * 2;
    let placement = {
      anchor: preferredAnchor.value,
      origin: preferredOrigin.value
    };
    function checkOverflow(_placement) {
      const box = new Box(contentBox);
      const targetPoint = anchorToPoint(_placement.anchor, targetBox);
      const contentPoint = anchorToPoint(_placement.origin, box);
      let {
        x: x2,
        y: y2
      } = getOffset$1(targetPoint, contentPoint);
      switch (_placement.anchor.side) {
        case "top":
          y2 -= offset.value[0];
          break;
        case "bottom":
          y2 += offset.value[0];
          break;
        case "left":
          x2 -= offset.value[0];
          break;
        case "right":
          x2 += offset.value[0];
          break;
      }
      switch (_placement.anchor.align) {
        case "top":
          y2 -= offset.value[1];
          break;
        case "bottom":
          y2 += offset.value[1];
          break;
        case "left":
          x2 -= offset.value[1];
          break;
        case "right":
          x2 += offset.value[1];
          break;
      }
      box.x += x2;
      box.y += y2;
      box.width = Math.min(box.width, maxWidth.value);
      box.height = Math.min(box.height, maxHeight.value);
      const overflows = getOverflow(box, viewport);
      return {
        overflows,
        x: x2,
        y: y2
      };
    }
    let x = 0;
    let y = 0;
    const available = {
      x: 0,
      y: 0
    };
    const flipped = {
      x: false,
      y: false
    };
    let resets = -1;
    while (true) {
      if (resets++ > 10) {
        break;
      }
      const {
        x: _x,
        y: _y,
        overflows
      } = checkOverflow(placement);
      x += _x;
      y += _y;
      contentBox.x += _x;
      contentBox.y += _y;
      {
        const axis2 = getAxis(placement.anchor);
        const hasOverflowX = overflows.x.before || overflows.x.after;
        const hasOverflowY = overflows.y.before || overflows.y.after;
        let reset = false;
        ["x", "y"].forEach((key) => {
          if (key === "x" && hasOverflowX && !flipped.x || key === "y" && hasOverflowY && !flipped.y) {
            const newPlacement = {
              anchor: {
                ...placement.anchor
              },
              origin: {
                ...placement.origin
              }
            };
            const flip = key === "x" ? axis2 === "y" ? flipAlign : flipSide : axis2 === "y" ? flipSide : flipAlign;
            newPlacement.anchor = flip(newPlacement.anchor);
            newPlacement.origin = flip(newPlacement.origin);
            const {
              overflows: newOverflows
            } = checkOverflow(newPlacement);
            if (newOverflows[key].before <= overflows[key].before && newOverflows[key].after <= overflows[key].after || newOverflows[key].before + newOverflows[key].after < (overflows[key].before + overflows[key].after) / 2) {
              placement = newPlacement;
              reset = flipped[key] = true;
            }
          }
        });
        if (reset)
          continue;
      }
      if (overflows.x.before) {
        x += overflows.x.before;
        contentBox.x += overflows.x.before;
      }
      if (overflows.x.after) {
        x -= overflows.x.after;
        contentBox.x -= overflows.x.after;
      }
      if (overflows.y.before) {
        y += overflows.y.before;
        contentBox.y += overflows.y.before;
      }
      if (overflows.y.after) {
        y -= overflows.y.after;
        contentBox.y -= overflows.y.after;
      }
      {
        const overflows2 = getOverflow(contentBox, viewport);
        available.x = viewport.width - overflows2.x.before - overflows2.x.after;
        available.y = viewport.height - overflows2.y.before - overflows2.y.after;
        x += overflows2.x.before;
        contentBox.x += overflows2.x.before;
        y += overflows2.y.before;
        contentBox.y += overflows2.y.before;
      }
      break;
    }
    const axis = getAxis(placement.anchor);
    Object.assign(contentStyles.value, {
      "--v-overlay-anchor-origin": `${placement.anchor.side} ${placement.anchor.align}`,
      transformOrigin: `${placement.origin.side} ${placement.origin.align}`,
      // transform: `translate(${pixelRound(x)}px, ${pixelRound(y)}px)`,
      top: convertToUnit(pixelRound(y)),
      left: data.isRtl.value ? void 0 : convertToUnit(pixelRound(x)),
      right: data.isRtl.value ? convertToUnit(pixelRound(-x)) : void 0,
      minWidth: convertToUnit(axis === "y" ? Math.min(minWidth.value, targetBox.width) : minWidth.value),
      maxWidth: convertToUnit(pixelCeil(clamp(available.x, minWidth.value === Infinity ? 0 : minWidth.value, maxWidth.value))),
      maxHeight: convertToUnit(pixelCeil(clamp(available.y, minHeight.value === Infinity ? 0 : minHeight.value, maxHeight.value)))
    });
    return {
      available,
      contentBox
    };
  }
  watch(() => [preferredAnchor.value, preferredOrigin.value, props.offset, props.minWidth, props.minHeight, props.maxWidth, props.maxHeight], () => updateLocation());
  nextTick(() => {
    const result = updateLocation();
    if (!result)
      return;
    const {
      available,
      contentBox
    } = result;
    if (contentBox.height > available.y) {
      requestAnimationFrame(() => {
        updateLocation();
        requestAnimationFrame(() => {
          updateLocation();
        });
      });
    }
  });
  return {
    updateLocation
  };
}
function pixelRound(val) {
  return Math.round(val * devicePixelRatio) / devicePixelRatio;
}
function pixelCeil(val) {
  return Math.ceil(val * devicePixelRatio) / devicePixelRatio;
}
let clean = true;
const frames = [];
function requestNewFrame(cb) {
  if (!clean || frames.length) {
    frames.push(cb);
    run();
  } else {
    clean = false;
    cb();
    run();
  }
}
let raf = -1;
function run() {
  cancelAnimationFrame(raf);
  raf = requestAnimationFrame(() => {
    const frame = frames.shift();
    if (frame)
      frame();
    if (frames.length)
      run();
    else
      clean = true;
  });
}
const scrollStrategies = {
  none: null,
  close: closeScrollStrategy,
  block: blockScrollStrategy,
  reposition: repositionScrollStrategy
};
const makeScrollStrategyProps = propsFactory({
  scrollStrategy: {
    type: [String, Function],
    default: "block",
    validator: (val) => typeof val === "function" || val in scrollStrategies
  }
}, "VOverlay-scroll-strategies");
function useScrollStrategies(props, data) {
  if (!IN_BROWSER)
    return;
  let scope;
  watchEffect(async () => {
    scope?.stop();
    if (!(data.isActive.value && props.scrollStrategy))
      return;
    scope = effectScope();
    await nextTick();
    scope.active && scope.run(() => {
      if (typeof props.scrollStrategy === "function") {
        props.scrollStrategy(data, props, scope);
      } else {
        scrollStrategies[props.scrollStrategy]?.(data, props, scope);
      }
    });
  });
  onScopeDispose(() => {
    scope?.stop();
  });
}
function closeScrollStrategy(data) {
  function onScroll(e) {
    data.isActive.value = false;
  }
  bindScroll(data.targetEl.value ?? data.contentEl.value, onScroll);
}
function blockScrollStrategy(data, props) {
  const offsetParent = data.root.value?.offsetParent;
  const scrollElements = [.../* @__PURE__ */ new Set([...getScrollParents(data.targetEl.value, props.contained ? offsetParent : void 0), ...getScrollParents(data.contentEl.value, props.contained ? offsetParent : void 0)])].filter((el) => !el.classList.contains("v-overlay-scroll-blocked"));
  const scrollbarWidth = window.innerWidth - document.documentElement.offsetWidth;
  const scrollableParent = ((el) => hasScrollbar(el) && el)(offsetParent || document.documentElement);
  if (scrollableParent) {
    data.root.value.classList.add("v-overlay--scroll-blocked");
  }
  scrollElements.forEach((el, i) => {
    el.style.setProperty("--v-body-scroll-x", convertToUnit(-el.scrollLeft));
    el.style.setProperty("--v-body-scroll-y", convertToUnit(-el.scrollTop));
    if (el !== document.documentElement) {
      el.style.setProperty("--v-scrollbar-offset", convertToUnit(scrollbarWidth));
    }
    el.classList.add("v-overlay-scroll-blocked");
  });
  onScopeDispose(() => {
    scrollElements.forEach((el, i) => {
      const x = parseFloat(el.style.getPropertyValue("--v-body-scroll-x"));
      const y = parseFloat(el.style.getPropertyValue("--v-body-scroll-y"));
      el.style.removeProperty("--v-body-scroll-x");
      el.style.removeProperty("--v-body-scroll-y");
      el.style.removeProperty("--v-scrollbar-offset");
      el.classList.remove("v-overlay-scroll-blocked");
      el.scrollLeft = -x;
      el.scrollTop = -y;
    });
    if (scrollableParent) {
      data.root.value.classList.remove("v-overlay--scroll-blocked");
    }
  });
}
function repositionScrollStrategy(data, props, scope) {
  let slow = false;
  let raf2 = -1;
  let ric = -1;
  function update(e) {
    requestNewFrame(() => {
      const start = performance.now();
      data.updateLocation.value?.(e);
      const time = performance.now() - start;
      slow = time / (1e3 / 60) > 2;
    });
  }
  ric = (typeof requestIdleCallback === "undefined" ? (cb) => cb() : requestIdleCallback)(() => {
    scope.run(() => {
      bindScroll(data.targetEl.value ?? data.contentEl.value, (e) => {
        if (slow) {
          cancelAnimationFrame(raf2);
          raf2 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => {
              update(e);
            });
          });
        } else {
          update(e);
        }
      });
    });
  });
  onScopeDispose(() => {
    typeof cancelIdleCallback !== "undefined" && cancelIdleCallback(ric);
    cancelAnimationFrame(raf2);
  });
}
function bindScroll(el, onScroll) {
  const scrollElements = [document, ...getScrollParents(el)];
  scrollElements.forEach((el2) => {
    el2.addEventListener("scroll", onScroll, {
      passive: true
    });
  });
  onScopeDispose(() => {
    scrollElements.forEach((el2) => {
      el2.removeEventListener("scroll", onScroll);
    });
  });
}
const VMenuSymbol = Symbol.for("vuetify:v-menu");
const makeDelayProps = propsFactory({
  closeDelay: [Number, String],
  openDelay: [Number, String]
}, "delay");
function useDelay(props, cb) {
  const delays = {};
  const runDelayFactory = (prop) => () => {
    if (!IN_BROWSER)
      return Promise.resolve(true);
    const active = prop === "openDelay";
    delays.closeDelay && window.clearTimeout(delays.closeDelay);
    delete delays.closeDelay;
    delays.openDelay && window.clearTimeout(delays.openDelay);
    delete delays.openDelay;
    return new Promise((resolve2) => {
      const delay = parseInt(props[prop] ?? 0, 10);
      delays[prop] = window.setTimeout(() => {
        cb?.(active);
        resolve2(active);
      }, delay);
    });
  };
  return {
    runCloseDelay: runDelayFactory("closeDelay"),
    runOpenDelay: runDelayFactory("openDelay")
  };
}
const makeActivatorProps = propsFactory({
  target: [String, Object],
  activator: [String, Object],
  activatorProps: {
    type: Object,
    default: () => ({})
  },
  openOnClick: {
    type: Boolean,
    default: void 0
  },
  openOnHover: Boolean,
  openOnFocus: {
    type: Boolean,
    default: void 0
  },
  closeOnContentClick: Boolean,
  ...makeDelayProps()
}, "VOverlay-activator");
function useActivator(props, _ref) {
  let {
    isActive,
    isTop
  } = _ref;
  const vm = getCurrentInstance("useActivator");
  const activatorEl = ref();
  let isHovered = false;
  let isFocused = false;
  let firstEnter = true;
  const openOnFocus = computed(() => props.openOnFocus || props.openOnFocus == null && props.openOnHover);
  const openOnClick = computed(() => props.openOnClick || props.openOnClick == null && !props.openOnHover && !openOnFocus.value);
  const {
    runOpenDelay,
    runCloseDelay
  } = useDelay(props, (value) => {
    if (value === (props.openOnHover && isHovered || openOnFocus.value && isFocused) && !(props.openOnHover && isActive.value && !isTop.value)) {
      if (isActive.value !== value) {
        firstEnter = true;
      }
      isActive.value = value;
    }
  });
  const cursorTarget = ref();
  const availableEvents = {
    onClick: (e) => {
      e.stopPropagation();
      activatorEl.value = e.currentTarget || e.target;
      if (!isActive.value) {
        cursorTarget.value = [e.clientX, e.clientY];
      }
      isActive.value = !isActive.value;
    },
    onMouseenter: (e) => {
      if (e.sourceCapabilities?.firesTouchEvents)
        return;
      isHovered = true;
      activatorEl.value = e.currentTarget || e.target;
      runOpenDelay();
    },
    onMouseleave: (e) => {
      isHovered = false;
      runCloseDelay();
    },
    onFocus: (e) => {
      if (matchesSelector(e.target, ":focus-visible") === false)
        return;
      isFocused = true;
      e.stopPropagation();
      activatorEl.value = e.currentTarget || e.target;
      runOpenDelay();
    },
    onBlur: (e) => {
      isFocused = false;
      e.stopPropagation();
      runCloseDelay();
    }
  };
  const activatorEvents = computed(() => {
    const events = {};
    if (openOnClick.value) {
      events.onClick = availableEvents.onClick;
    }
    if (props.openOnHover) {
      events.onMouseenter = availableEvents.onMouseenter;
      events.onMouseleave = availableEvents.onMouseleave;
    }
    if (openOnFocus.value) {
      events.onFocus = availableEvents.onFocus;
      events.onBlur = availableEvents.onBlur;
    }
    return events;
  });
  const contentEvents = computed(() => {
    const events = {};
    if (props.openOnHover) {
      events.onMouseenter = () => {
        isHovered = true;
        runOpenDelay();
      };
      events.onMouseleave = () => {
        isHovered = false;
        runCloseDelay();
      };
    }
    if (openOnFocus.value) {
      events.onFocusin = () => {
        isFocused = true;
        runOpenDelay();
      };
      events.onFocusout = () => {
        isFocused = false;
        runCloseDelay();
      };
    }
    if (props.closeOnContentClick) {
      const menu = inject$1(VMenuSymbol, null);
      events.onClick = () => {
        isActive.value = false;
        menu?.closeParents();
      };
    }
    return events;
  });
  const scrimEvents = computed(() => {
    const events = {};
    if (props.openOnHover) {
      events.onMouseenter = () => {
        if (firstEnter) {
          isHovered = true;
          firstEnter = false;
          runOpenDelay();
        }
      };
      events.onMouseleave = () => {
        isHovered = false;
        runCloseDelay();
      };
    }
    return events;
  });
  watch(isTop, (val) => {
    if (val && (props.openOnHover && !isHovered && (!openOnFocus.value || !isFocused) || openOnFocus.value && !isFocused && (!props.openOnHover || !isHovered))) {
      isActive.value = false;
    }
  });
  watch(isActive, (val) => {
    if (!val) {
      setTimeout(() => {
        cursorTarget.value = void 0;
      });
    }
  }, {
    flush: "post"
  });
  const activatorRef = ref();
  watchEffect(() => {
    if (!activatorRef.value)
      return;
    nextTick(() => {
      activatorEl.value = refElement(activatorRef.value);
    });
  });
  const targetRef = ref();
  const target = computed(() => {
    if (props.target === "cursor" && cursorTarget.value)
      return cursorTarget.value;
    if (targetRef.value)
      return refElement(targetRef.value);
    return getTarget(props.target, vm) || activatorEl.value;
  });
  const targetEl = computed(() => {
    return Array.isArray(target.value) ? void 0 : target.value;
  });
  let scope;
  watch(() => !!props.activator, (val) => {
    if (val && IN_BROWSER) {
      scope = effectScope();
      scope.run(() => {
        _useActivator(props, vm, {
          activatorEl,
          activatorEvents
        });
      });
    } else if (scope) {
      scope.stop();
    }
  }, {
    flush: "post",
    immediate: true
  });
  onScopeDispose(() => {
    scope?.stop();
  });
  return {
    activatorEl,
    activatorRef,
    target,
    targetEl,
    targetRef,
    activatorEvents,
    contentEvents,
    scrimEvents
  };
}
function _useActivator(props, vm, _ref2) {
  let {
    activatorEl,
    activatorEvents
  } = _ref2;
  watch(() => props.activator, (val, oldVal) => {
    if (oldVal && val !== oldVal) {
      const activator = getActivator(oldVal);
      activator && unbindActivatorProps(activator);
    }
    if (val) {
      nextTick(() => bindActivatorProps());
    }
  }, {
    immediate: true
  });
  watch(() => props.activatorProps, () => {
    bindActivatorProps();
  });
  onScopeDispose(() => {
    unbindActivatorProps();
  });
  function bindActivatorProps() {
    let el = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getActivator();
    let _props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : props.activatorProps;
    if (!el)
      return;
    bindProps(el, mergeProps(activatorEvents.value, _props));
  }
  function unbindActivatorProps() {
    let el = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getActivator();
    let _props = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : props.activatorProps;
    if (!el)
      return;
    unbindProps(el, mergeProps(activatorEvents.value, _props));
  }
  function getActivator() {
    let selector = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : props.activator;
    const activator = getTarget(selector, vm);
    activatorEl.value = activator?.nodeType === Node.ELEMENT_NODE ? activator : void 0;
    return activatorEl.value;
  }
}
function getTarget(selector, vm) {
  if (!selector)
    return;
  let target;
  if (selector === "parent") {
    let el = vm?.proxy?.$el?.parentNode;
    while (el?.hasAttribute("data-no-activator")) {
      el = el.parentNode;
    }
    target = el;
  } else if (typeof selector === "string") {
    target = document.querySelector(selector);
  } else if ("$el" in selector) {
    target = selector.$el;
  } else {
    target = selector;
  }
  return target;
}
function useHydration() {
  if (!IN_BROWSER)
    return shallowRef(false);
  const {
    ssr
  } = useDisplay();
  if (ssr) {
    const isMounted = shallowRef(false);
    onMounted(() => {
      isMounted.value = true;
    });
    return isMounted;
  } else {
    return shallowRef(true);
  }
}
const makeLazyProps = propsFactory({
  eager: Boolean
}, "lazy");
function useLazy(props, active) {
  const isBooted = shallowRef(false);
  const hasContent = computed(() => isBooted.value || props.eager || active.value);
  watch(active, () => isBooted.value = true);
  function onAfterLeave() {
    if (!props.eager)
      isBooted.value = false;
  }
  return {
    isBooted,
    hasContent,
    onAfterLeave
  };
}
function useScopeId() {
  const vm = getCurrentInstance("useScopeId");
  const scopeId = vm.vnode.scopeId;
  return {
    scopeId: scopeId ? {
      [scopeId]: ""
    } : void 0
  };
}
const StackSymbol = Symbol.for("vuetify:stack");
const globalStack = reactive([]);
function useStack(isActive, zIndex, disableGlobalStack) {
  const vm = getCurrentInstance("useStack");
  const createStackEntry = !disableGlobalStack;
  const parent = inject$1(StackSymbol, void 0);
  const stack = reactive({
    activeChildren: /* @__PURE__ */ new Set()
  });
  provide(StackSymbol, stack);
  const _zIndex = shallowRef(+zIndex.value);
  useToggleScope(isActive, () => {
    const lastZIndex = globalStack.at(-1)?.[1];
    _zIndex.value = lastZIndex ? lastZIndex + 10 : +zIndex.value;
    if (createStackEntry) {
      globalStack.push([vm.uid, _zIndex.value]);
    }
    parent?.activeChildren.add(vm.uid);
    onScopeDispose(() => {
      if (createStackEntry) {
        const idx = toRaw(globalStack).findIndex((v) => v[0] === vm.uid);
        globalStack.splice(idx, 1);
      }
      parent?.activeChildren.delete(vm.uid);
    });
  });
  const globalTop = shallowRef(true);
  if (createStackEntry) {
    watchEffect(() => {
      const _isTop = globalStack.at(-1)?.[0] === vm.uid;
      setTimeout(() => globalTop.value = _isTop);
    });
  }
  const localTop = computed(() => !stack.activeChildren.size);
  return {
    globalTop: readonly(globalTop),
    localTop,
    stackStyles: computed(() => ({
      zIndex: _zIndex.value
    }))
  };
}
function useTeleport(target) {
  const teleportTarget = computed(() => {
    const _target = target.value;
    if (_target === true || !IN_BROWSER)
      return void 0;
    const targetElement = _target === false ? document.body : typeof _target === "string" ? document.querySelector(_target) : _target;
    if (targetElement == null) {
      return void 0;
    }
    let container = targetElement.querySelector(":scope > .v-overlay-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "v-overlay-container";
      targetElement.appendChild(container);
    }
    return container;
  });
  return {
    teleportTarget
  };
}
function defaultConditional() {
  return true;
}
function checkEvent(e, el, binding) {
  if (!e || checkIsActive(e, binding) === false)
    return false;
  const root = attachedRoot(el);
  if (typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot && root.host === e.target)
    return false;
  const elements = (typeof binding.value === "object" && binding.value.include || (() => []))();
  elements.push(el);
  return !elements.some((el2) => el2?.contains(e.target));
}
function checkIsActive(e, binding) {
  const isActive = typeof binding.value === "object" && binding.value.closeConditional || defaultConditional;
  return isActive(e);
}
function directive(e, el, binding) {
  const handler = typeof binding.value === "function" ? binding.value : binding.value.handler;
  el._clickOutside.lastMousedownWasOutside && checkEvent(e, el, binding) && setTimeout(() => {
    checkIsActive(e, binding) && handler && handler(e);
  }, 0);
}
function handleShadow(el, callback) {
  const root = attachedRoot(el);
  callback(document);
  if (typeof ShadowRoot !== "undefined" && root instanceof ShadowRoot) {
    callback(root);
  }
}
const ClickOutside = {
  // [data-app] may not be found
  // if using bind, inserted makes
  // sure that the root element is
  // available, iOS does not support
  // clicks on body
  mounted(el, binding) {
    const onClick = (e) => directive(e, el, binding);
    const onMousedown = (e) => {
      el._clickOutside.lastMousedownWasOutside = checkEvent(e, el, binding);
    };
    handleShadow(el, (app2) => {
      app2.addEventListener("click", onClick, true);
      app2.addEventListener("mousedown", onMousedown, true);
    });
    if (!el._clickOutside) {
      el._clickOutside = {
        lastMousedownWasOutside: false
      };
    }
    el._clickOutside[binding.instance.$.uid] = {
      onClick,
      onMousedown
    };
  },
  unmounted(el, binding) {
    if (!el._clickOutside)
      return;
    handleShadow(el, (app2) => {
      if (!app2 || !el._clickOutside?.[binding.instance.$.uid])
        return;
      const {
        onClick,
        onMousedown
      } = el._clickOutside[binding.instance.$.uid];
      app2.removeEventListener("click", onClick, true);
      app2.removeEventListener("mousedown", onMousedown, true);
    });
    delete el._clickOutside[binding.instance.$.uid];
  }
};
function Scrim(props) {
  const {
    modelValue,
    color,
    ...rest
  } = props;
  return createVNode(Transition, {
    "name": "fade-transition",
    "appear": true
  }, {
    default: () => [props.modelValue && createVNode("div", mergeProps({
      "class": ["v-overlay__scrim", props.color.backgroundColorClasses.value],
      "style": props.color.backgroundColorStyles.value
    }, rest), null)]
  });
}
const makeVOverlayProps = propsFactory({
  absolute: Boolean,
  attach: [Boolean, String, Object],
  closeOnBack: {
    type: Boolean,
    default: true
  },
  contained: Boolean,
  contentClass: null,
  contentProps: null,
  disabled: Boolean,
  noClickAnimation: Boolean,
  modelValue: Boolean,
  persistent: Boolean,
  scrim: {
    type: [Boolean, String],
    default: true
  },
  zIndex: {
    type: [Number, String],
    default: 2e3
  },
  ...makeActivatorProps(),
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeLazyProps(),
  ...makeLocationStrategyProps(),
  ...makeScrollStrategyProps(),
  ...makeThemeProps(),
  ...makeTransitionProps()
}, "VOverlay");
const VOverlay = genericComponent()({
  name: "VOverlay",
  directives: {
    ClickOutside
  },
  inheritAttrs: false,
  props: {
    _disableGlobalStack: Boolean,
    ...makeVOverlayProps()
  },
  emits: {
    "click:outside": (e) => true,
    "update:modelValue": (value) => true,
    afterLeave: () => true
  },
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit: emit2
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const isActive = computed({
      get: () => model.value,
      set: (v) => {
        if (!(v && props.disabled))
          model.value = v;
      }
    });
    const {
      teleportTarget
    } = useTeleport(computed(() => props.attach || props.contained));
    const {
      themeClasses
    } = provideTheme(props);
    const {
      rtlClasses,
      isRtl
    } = useRtl();
    const {
      hasContent,
      onAfterLeave
    } = useLazy(props, isActive);
    const scrimColor = useBackgroundColor(computed(() => {
      return typeof props.scrim === "string" ? props.scrim : null;
    }));
    const {
      globalTop,
      localTop,
      stackStyles
    } = useStack(isActive, toRef(props, "zIndex"), props._disableGlobalStack);
    const {
      activatorEl,
      activatorRef,
      target,
      targetEl,
      targetRef,
      activatorEvents,
      contentEvents,
      scrimEvents
    } = useActivator(props, {
      isActive,
      isTop: localTop
    });
    const {
      dimensionStyles
    } = useDimension(props);
    const isMounted = useHydration();
    const {
      scopeId
    } = useScopeId();
    watch(() => props.disabled, (v) => {
      if (v)
        isActive.value = false;
    });
    const root = ref();
    const contentEl = ref();
    const {
      contentStyles,
      updateLocation
    } = useLocationStrategies(props, {
      isRtl,
      contentEl,
      target,
      isActive
    });
    useScrollStrategies(props, {
      root,
      contentEl,
      targetEl,
      isActive,
      updateLocation
    });
    function onClickOutside(e) {
      emit2("click:outside", e);
      if (!props.persistent)
        isActive.value = false;
      else
        animateClick();
    }
    function closeConditional() {
      return isActive.value && globalTop.value;
    }
    IN_BROWSER && watch(isActive, (val) => {
      if (val) {
        window.addEventListener("keydown", onKeydown);
      } else {
        window.removeEventListener("keydown", onKeydown);
      }
    }, {
      immediate: true
    });
    function onKeydown(e) {
      if (e.key === "Escape" && globalTop.value) {
        if (!props.persistent) {
          isActive.value = false;
          if (contentEl.value?.contains(document.activeElement)) {
            activatorEl.value?.focus();
          }
        } else
          animateClick();
      }
    }
    const router2 = useRouter();
    useToggleScope(() => props.closeOnBack, () => {
      useBackButton(router2, (next) => {
        if (globalTop.value && isActive.value) {
          next(false);
          if (!props.persistent)
            isActive.value = false;
          else
            animateClick();
        } else {
          next();
        }
      });
    });
    const top = ref();
    watch(() => isActive.value && (props.absolute || props.contained) && teleportTarget.value == null, (val) => {
      if (val) {
        const scrollParent = getScrollParent(root.value);
        if (scrollParent && scrollParent !== document.scrollingElement) {
          top.value = scrollParent.scrollTop;
        }
      }
    });
    function animateClick() {
      if (props.noClickAnimation)
        return;
      contentEl.value && animate(contentEl.value, [{
        transformOrigin: "center"
      }, {
        transform: "scale(1.03)"
      }, {
        transformOrigin: "center"
      }], {
        duration: 150,
        easing: standardEasing
      });
    }
    useRender(() => createVNode(Fragment, null, [slots.activator?.({
      isActive: isActive.value,
      props: mergeProps({
        ref: activatorRef,
        targetRef
      }, activatorEvents.value, props.activatorProps)
    }), isMounted.value && hasContent.value && createVNode(Teleport, {
      "disabled": !teleportTarget.value,
      "to": teleportTarget.value
    }, {
      default: () => [createVNode("div", mergeProps({
        "class": ["v-overlay", {
          "v-overlay--absolute": props.absolute || props.contained,
          "v-overlay--active": isActive.value,
          "v-overlay--contained": props.contained
        }, themeClasses.value, rtlClasses.value, props.class],
        "style": [stackStyles.value, {
          top: convertToUnit(top.value)
        }, props.style],
        "ref": root
      }, scopeId, attrs), [createVNode(Scrim, mergeProps({
        "color": scrimColor,
        "modelValue": isActive.value && !!props.scrim
      }, scrimEvents.value), null), createVNode(MaybeTransition, {
        "appear": true,
        "persisted": true,
        "transition": props.transition,
        "target": target.value,
        "onAfterLeave": () => {
          onAfterLeave();
          emit2("afterLeave");
        }
      }, {
        default: () => [withDirectives(createVNode("div", mergeProps({
          "ref": contentEl,
          "class": ["v-overlay__content", props.contentClass],
          "style": [dimensionStyles.value, contentStyles.value]
        }, contentEvents.value, props.contentProps), [slots.default?.({
          isActive
        })]), [[vShow, isActive.value], [resolveDirective("click-outside"), {
          handler: onClickOutside,
          closeConditional,
          include: () => [activatorEl.value]
        }]])]
      })])]
    })]));
    return {
      activatorEl,
      target,
      animateClick,
      contentEl,
      globalTop,
      localTop,
      updateLocation
    };
  }
});
const Refs = Symbol("Forwarded refs");
function getDescriptor(obj, key) {
  let currentObj = obj;
  while (currentObj) {
    const descriptor = Reflect.getOwnPropertyDescriptor(currentObj, key);
    if (descriptor)
      return descriptor;
    currentObj = Object.getPrototypeOf(currentObj);
  }
  return void 0;
}
function forwardRefs(target) {
  for (var _len = arguments.length, refs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    refs[_key - 1] = arguments[_key];
  }
  target[Refs] = refs;
  return new Proxy(target, {
    get(target2, key) {
      if (Reflect.has(target2, key)) {
        return Reflect.get(target2, key);
      }
      if (typeof key === "symbol" || key.startsWith("$") || key.startsWith("__"))
        return;
      for (const ref2 of refs) {
        if (ref2.value && Reflect.has(ref2.value, key)) {
          const val = Reflect.get(ref2.value, key);
          return typeof val === "function" ? val.bind(ref2.value) : val;
        }
      }
    },
    has(target2, key) {
      if (Reflect.has(target2, key)) {
        return true;
      }
      if (typeof key === "symbol" || key.startsWith("$") || key.startsWith("__"))
        return false;
      for (const ref2 of refs) {
        if (ref2.value && Reflect.has(ref2.value, key)) {
          return true;
        }
      }
      return false;
    },
    set(target2, key, value) {
      if (Reflect.has(target2, key)) {
        return Reflect.set(target2, key, value);
      }
      if (typeof key === "symbol" || key.startsWith("$") || key.startsWith("__"))
        return false;
      for (const ref2 of refs) {
        if (ref2.value && Reflect.has(ref2.value, key)) {
          return Reflect.set(ref2.value, key, value);
        }
      }
      return false;
    },
    getOwnPropertyDescriptor(target2, key) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target2, key);
      if (descriptor)
        return descriptor;
      if (typeof key === "symbol" || key.startsWith("$") || key.startsWith("__"))
        return;
      for (const ref2 of refs) {
        if (!ref2.value)
          continue;
        const descriptor2 = getDescriptor(ref2.value, key) ?? ("_" in ref2.value ? getDescriptor(ref2.value._?.setupState, key) : void 0);
        if (descriptor2)
          return descriptor2;
      }
      for (const ref2 of refs) {
        const childRefs = ref2.value && ref2.value[Refs];
        if (!childRefs)
          continue;
        const queue2 = childRefs.slice();
        while (queue2.length) {
          const ref3 = queue2.shift();
          const descriptor2 = getDescriptor(ref3.value, key);
          if (descriptor2)
            return descriptor2;
          const childRefs2 = ref3.value && ref3.value[Refs];
          if (childRefs2)
            queue2.push(...childRefs2);
        }
      }
      return void 0;
    }
  });
}
const makeVMenuProps = propsFactory({
  // TODO
  // disableKeys: Boolean,
  id: String,
  ...omit(makeVOverlayProps({
    closeDelay: 250,
    closeOnContentClick: true,
    locationStrategy: "connected",
    openDelay: 300,
    scrim: false,
    scrollStrategy: "reposition",
    transition: {
      component: VDialogTransition
    }
  }), ["absolute"])
}, "VMenu");
const VMenu = genericComponent()({
  name: "VMenu",
  props: makeVMenuProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      scopeId
    } = useScopeId();
    const uid2 = getUid();
    const id = computed(() => props.id || `v-menu-${uid2}`);
    const overlay = ref();
    const parent = inject$1(VMenuSymbol, null);
    const openChildren = shallowRef(0);
    provide(VMenuSymbol, {
      register() {
        ++openChildren.value;
      },
      unregister() {
        --openChildren.value;
      },
      closeParents() {
        setTimeout(() => {
          if (!openChildren.value) {
            isActive.value = false;
            parent?.closeParents();
          }
        }, 40);
      }
    });
    async function onFocusIn(e) {
      const before = e.relatedTarget;
      const after = e.target;
      await nextTick();
      if (isActive.value && before !== after && overlay.value?.contentEl && // We're the topmost menu
      overlay.value?.globalTop && // It isn't the document or the menu body
      ![document, overlay.value.contentEl].includes(after) && // It isn't inside the menu body
      !overlay.value.contentEl.contains(after)) {
        const focusable = focusableChildren(overlay.value.contentEl);
        focusable[0]?.focus();
      }
    }
    watch(isActive, (val) => {
      if (val) {
        parent?.register();
        document.addEventListener("focusin", onFocusIn, {
          once: true
        });
      } else {
        parent?.unregister();
        document.removeEventListener("focusin", onFocusIn);
      }
    });
    function onClickOutside() {
      parent?.closeParents();
    }
    function onKeydown(e) {
      if (props.disabled)
        return;
      if (e.key === "Tab") {
        const nextElement = getNextElement(focusableChildren(overlay.value?.contentEl, false), e.shiftKey ? "prev" : "next", (el) => el.tabIndex >= 0);
        if (!nextElement) {
          isActive.value = false;
          overlay.value?.activatorEl?.focus();
        }
      }
    }
    function onActivatorKeydown(e) {
      if (props.disabled)
        return;
      const el = overlay.value?.contentEl;
      if (el && isActive.value) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          focusChild(el, "next");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          focusChild(el, "prev");
        }
      } else if (["ArrowDown", "ArrowUp"].includes(e.key)) {
        isActive.value = true;
        e.preventDefault();
        setTimeout(() => setTimeout(() => onActivatorKeydown(e)));
      }
    }
    const activatorProps = computed(() => mergeProps({
      "aria-haspopup": "menu",
      "aria-expanded": String(isActive.value),
      "aria-owns": id.value,
      onKeydown: onActivatorKeydown
    }, props.activatorProps));
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      return createVNode(VOverlay, mergeProps({
        "ref": overlay,
        "class": ["v-menu", props.class],
        "style": props.style
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "absolute": true,
        "activatorProps": activatorProps.value,
        "onClick:outside": onClickOutside,
        "onKeydown": onKeydown
      }, scopeId), {
        activator: slots.activator,
        default: function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return createVNode(VDefaultsProvider, {
            "root": "VMenu"
          }, {
            default: () => [slots.default?.(...args)]
          });
        }
      });
    });
    return forwardRefs({
      id,
      ΨopenChildren: openChildren
    }, overlay);
  }
});
const VSelect$1 = "";
const VTextField$1 = "";
const VCounter$1 = "";
const makeVCounterProps = propsFactory({
  active: Boolean,
  max: [Number, String],
  value: {
    type: [Number, String],
    default: 0
  },
  ...makeComponentProps(),
  ...makeTransitionProps({
    transition: {
      component: VSlideYTransition
    }
  })
}, "VCounter");
const VCounter = genericComponent()({
  name: "VCounter",
  functional: true,
  props: makeVCounterProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const counter = computed(() => {
      return props.max ? `${props.value} / ${props.max}` : String(props.value);
    });
    useRender(() => createVNode(MaybeTransition, {
      "transition": props.transition
    }, {
      default: () => [withDirectives(createVNode("div", {
        "class": ["v-counter", props.class],
        "style": props.style
      }, [slots.default ? slots.default({
        counter: counter.value,
        max: props.max,
        value: props.value
      }) : counter.value]), [[vShow, props.active]])]
    }));
    return {};
  }
});
const VField$1 = "";
const makeVFieldLabelProps = propsFactory({
  floating: Boolean,
  ...makeComponentProps()
}, "VFieldLabel");
const VFieldLabel = genericComponent()({
  name: "VFieldLabel",
  props: makeVFieldLabelProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(VLabel, {
      "class": ["v-field-label", {
        "v-field-label--floating": props.floating
      }, props.class],
      "style": props.style,
      "aria-hidden": props.floating || void 0
    }, slots));
    return {};
  }
});
const allowedVariants$1 = ["underlined", "outlined", "filled", "solo", "solo-inverted", "solo-filled", "plain"];
const makeVFieldProps = propsFactory({
  appendInnerIcon: IconValue,
  bgColor: String,
  clearable: Boolean,
  clearIcon: {
    type: IconValue,
    default: "$clear"
  },
  active: Boolean,
  centerAffix: {
    type: Boolean,
    default: void 0
  },
  color: String,
  baseColor: String,
  dirty: Boolean,
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  flat: Boolean,
  label: String,
  persistentClear: Boolean,
  prependInnerIcon: IconValue,
  reverse: Boolean,
  singleLine: Boolean,
  variant: {
    type: String,
    default: "filled",
    validator: (v) => allowedVariants$1.includes(v)
  },
  "onClick:clear": EventProp(),
  "onClick:appendInner": EventProp(),
  "onClick:prependInner": EventProp(),
  ...makeComponentProps(),
  ...makeLoaderProps(),
  ...makeRoundedProps(),
  ...makeThemeProps()
}, "VField");
const VField = genericComponent()({
  name: "VField",
  inheritAttrs: false,
  props: {
    id: String,
    ...makeFocusProps(),
    ...makeVFieldProps()
  },
  emits: {
    "update:focused": (focused) => true,
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      loaderClasses
    } = useLoader(props);
    const {
      focusClasses,
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const {
      InputIcon
    } = useInputIcon(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      rtlClasses
    } = useRtl();
    const isActive = computed(() => props.dirty || props.active);
    const hasLabel = computed(() => !props.singleLine && !!(props.label || slots.label));
    const uid2 = getUid();
    const id = computed(() => props.id || `input-${uid2}`);
    const messagesId = computed(() => `${id.value}-messages`);
    const labelRef = ref();
    const floatingLabelRef = ref();
    const controlRef = ref();
    const isPlainOrUnderlined = computed(() => ["plain", "underlined"].includes(props.variant));
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "bgColor"));
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(computed(() => {
      return props.error || props.disabled ? void 0 : isActive.value && isFocused.value ? props.color : props.baseColor;
    }));
    watch(isActive, (val) => {
      if (hasLabel.value) {
        const el = labelRef.value.$el;
        const targetEl = floatingLabelRef.value.$el;
        requestAnimationFrame(() => {
          const rect = nullifyTransforms(el);
          const targetRect = targetEl.getBoundingClientRect();
          const x = targetRect.x - rect.x;
          const y = targetRect.y - rect.y - (rect.height / 2 - targetRect.height / 2);
          const targetWidth = targetRect.width / 0.75;
          const width = Math.abs(targetWidth - rect.width) > 1 ? {
            maxWidth: convertToUnit(targetWidth)
          } : void 0;
          const style = getComputedStyle(el);
          const targetStyle = getComputedStyle(targetEl);
          const duration = parseFloat(style.transitionDuration) * 1e3 || 150;
          const scale = parseFloat(targetStyle.getPropertyValue("--v-field-label-scale"));
          const color = targetStyle.getPropertyValue("color");
          el.style.visibility = "visible";
          targetEl.style.visibility = "hidden";
          animate(el, {
            transform: `translate(${x}px, ${y}px) scale(${scale})`,
            color,
            ...width
          }, {
            duration,
            easing: standardEasing,
            direction: val ? "normal" : "reverse"
          }).finished.then(() => {
            el.style.removeProperty("visibility");
            targetEl.style.removeProperty("visibility");
          });
        });
      }
    }, {
      flush: "post"
    });
    const slotProps = computed(() => ({
      isActive,
      isFocused,
      controlRef,
      blur,
      focus
    }));
    function onClick(e) {
      if (e.target !== document.activeElement) {
        e.preventDefault();
      }
    }
    useRender(() => {
      const isOutlined = props.variant === "outlined";
      const hasPrepend = slots["prepend-inner"] || props.prependInnerIcon;
      const hasClear = !!(props.clearable || slots.clear);
      const hasAppend = !!(slots["append-inner"] || props.appendInnerIcon || hasClear);
      const label = () => slots.label ? slots.label({
        ...slotProps.value,
        label: props.label,
        props: {
          for: id.value
        }
      }) : props.label;
      return createVNode("div", mergeProps({
        "class": ["v-field", {
          "v-field--active": isActive.value,
          "v-field--appended": hasAppend,
          "v-field--center-affix": props.centerAffix ?? !isPlainOrUnderlined.value,
          "v-field--disabled": props.disabled,
          "v-field--dirty": props.dirty,
          "v-field--error": props.error,
          "v-field--flat": props.flat,
          "v-field--has-background": !!props.bgColor,
          "v-field--persistent-clear": props.persistentClear,
          "v-field--prepended": hasPrepend,
          "v-field--reverse": props.reverse,
          "v-field--single-line": props.singleLine,
          "v-field--no-label": !label(),
          [`v-field--variant-${props.variant}`]: true
        }, themeClasses.value, backgroundColorClasses.value, focusClasses.value, loaderClasses.value, roundedClasses.value, rtlClasses.value, props.class],
        "style": [backgroundColorStyles.value, props.style],
        "onClick": onClick
      }, attrs), [createVNode("div", {
        "class": "v-field__overlay"
      }, null), createVNode(LoaderSlot, {
        "name": "v-field",
        "active": !!props.loading,
        "color": props.error ? "error" : typeof props.loading === "string" ? props.loading : props.color
      }, {
        default: slots.loader
      }), hasPrepend && createVNode("div", {
        "key": "prepend",
        "class": "v-field__prepend-inner"
      }, [props.prependInnerIcon && createVNode(InputIcon, {
        "key": "prepend-icon",
        "name": "prependInner"
      }, null), slots["prepend-inner"]?.(slotProps.value)]), createVNode("div", {
        "class": "v-field__field",
        "data-no-activator": ""
      }, [["filled", "solo", "solo-inverted", "solo-filled"].includes(props.variant) && hasLabel.value && createVNode(VFieldLabel, {
        "key": "floating-label",
        "ref": floatingLabelRef,
        "class": [textColorClasses.value],
        "floating": true,
        "for": id.value,
        "style": textColorStyles.value
      }, {
        default: () => [label()]
      }), createVNode(VFieldLabel, {
        "ref": labelRef,
        "for": id.value
      }, {
        default: () => [label()]
      }), slots.default?.({
        ...slotProps.value,
        props: {
          id: id.value,
          class: "v-field__input",
          "aria-describedby": messagesId.value
        },
        focus,
        blur
      })]), hasClear && createVNode(VExpandXTransition, {
        "key": "clear"
      }, {
        default: () => [withDirectives(createVNode("div", {
          "class": "v-field__clearable",
          "onMousedown": (e) => {
            e.preventDefault();
            e.stopPropagation();
          }
        }, [slots.clear ? slots.clear() : createVNode(InputIcon, {
          "name": "clear"
        }, null)]), [[vShow, props.dirty]])]
      }), hasAppend && createVNode("div", {
        "key": "append",
        "class": "v-field__append-inner"
      }, [slots["append-inner"]?.(slotProps.value), props.appendInnerIcon && createVNode(InputIcon, {
        "key": "append-icon",
        "name": "appendInner"
      }, null)]), createVNode("div", {
        "class": ["v-field__outline", textColorClasses.value],
        "style": textColorStyles.value
      }, [isOutlined && createVNode(Fragment, null, [createVNode("div", {
        "class": "v-field__outline__start"
      }, null), hasLabel.value && createVNode("div", {
        "class": "v-field__outline__notch"
      }, [createVNode(VFieldLabel, {
        "ref": floatingLabelRef,
        "floating": true,
        "for": id.value
      }, {
        default: () => [label()]
      })]), createVNode("div", {
        "class": "v-field__outline__end"
      }, null)]), isPlainOrUnderlined.value && hasLabel.value && createVNode(VFieldLabel, {
        "ref": floatingLabelRef,
        "floating": true,
        "for": id.value
      }, {
        default: () => [label()]
      })])]);
    });
    return {
      controlRef
    };
  }
});
function filterFieldProps(attrs) {
  const keys2 = Object.keys(VField.props).filter((k) => !isOn(k) && k !== "class" && k !== "style");
  return pick(attrs, keys2);
}
const activeTypes = ["color", "file", "time", "date", "datetime-local", "week", "month"];
const makeVTextFieldProps = propsFactory({
  autofocus: Boolean,
  counter: [Boolean, Number, String],
  counterValue: [Number, Function],
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  suffix: String,
  role: String,
  type: {
    type: String,
    default: "text"
  },
  modelModifiers: Object,
  ...makeVInputProps(),
  ...makeVFieldProps()
}, "VTextField");
const VTextField = genericComponent()({
  name: "VTextField",
  directives: {
    Intersect
  },
  inheritAttrs: false,
  props: makeVTextFieldProps(),
  emits: {
    "click:control": (e) => true,
    "mousedown:control": (e) => true,
    "update:focused": (focused) => true,
    "update:modelValue": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const counterValue = computed(() => {
      return typeof props.counterValue === "function" ? props.counterValue(model.value) : typeof props.counterValue === "number" ? props.counterValue : (model.value ?? "").toString().length;
    });
    const max = computed(() => {
      if (attrs.maxlength)
        return attrs.maxlength;
      if (!props.counter || typeof props.counter !== "number" && typeof props.counter !== "string")
        return void 0;
      return props.counter;
    });
    const isPlainOrUnderlined = computed(() => ["plain", "underlined"].includes(props.variant));
    function onIntersect(isIntersecting, entries) {
      if (!props.autofocus || !isIntersecting)
        return;
      entries[0].target?.focus?.();
    }
    const vInputRef = ref();
    const vFieldRef = ref();
    const inputRef = ref();
    const isActive = computed(() => activeTypes.includes(props.type) || props.persistentPlaceholder || isFocused.value || props.active);
    function onFocus() {
      if (inputRef.value !== document.activeElement) {
        inputRef.value?.focus();
      }
      if (!isFocused.value)
        focus();
    }
    function onControlMousedown(e) {
      emit2("mousedown:control", e);
      if (e.target === inputRef.value)
        return;
      onFocus();
      e.preventDefault();
    }
    function onControlClick(e) {
      onFocus();
      emit2("click:control", e);
    }
    function onClear(e) {
      e.stopPropagation();
      onFocus();
      nextTick(() => {
        model.value = null;
        callEvent(props["onClick:clear"], e);
      });
    }
    function onInput(e) {
      const el = e.target;
      model.value = el.value;
      if (props.modelModifiers?.trim && ["text", "search", "password", "tel", "url"].includes(props.type)) {
        const caretPosition = [el.selectionStart, el.selectionEnd];
        nextTick(() => {
          el.selectionStart = caretPosition[0];
          el.selectionEnd = caretPosition[1];
        });
      }
    }
    useRender(() => {
      const hasCounter = !!(slots.counter || props.counter !== false && props.counter != null);
      const hasDetails = !!(hasCounter || slots.details);
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const {
        modelValue: _,
        ...inputProps
      } = VInput.filterProps(props);
      const fieldProps = filterFieldProps(props);
      return createVNode(VInput, mergeProps({
        "ref": vInputRef,
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": ["v-text-field", {
          "v-text-field--prefixed": props.prefix,
          "v-text-field--suffixed": props.suffix,
          "v-input--plain-underlined": isPlainOrUnderlined.value
        }, props.class],
        "style": props.style
      }, rootAttrs, inputProps, {
        "centerAffix": !isPlainOrUnderlined.value,
        "focused": isFocused.value
      }), {
        ...slots,
        default: (_ref2) => {
          let {
            id,
            isDisabled,
            isDirty,
            isReadonly: isReadonly2,
            isValid: isValid2
          } = _ref2;
          return createVNode(VField, mergeProps({
            "ref": vFieldRef,
            "onMousedown": onControlMousedown,
            "onClick": onControlClick,
            "onClick:clear": onClear,
            "onClick:prependInner": props["onClick:prependInner"],
            "onClick:appendInner": props["onClick:appendInner"],
            "role": props.role
          }, fieldProps, {
            "id": id.value,
            "active": isActive.value || isDirty.value,
            "dirty": isDirty.value || props.dirty,
            "disabled": isDisabled.value,
            "focused": isFocused.value,
            "error": isValid2.value === false
          }), {
            ...slots,
            default: (_ref3) => {
              let {
                props: {
                  class: fieldClass,
                  ...slotProps
                }
              } = _ref3;
              const inputNode = withDirectives(createVNode("input", mergeProps({
                "ref": inputRef,
                "value": model.value,
                "onInput": onInput,
                "autofocus": props.autofocus,
                "readonly": isReadonly2.value,
                "disabled": isDisabled.value,
                "name": props.name,
                "placeholder": props.placeholder,
                "size": 1,
                "type": props.type,
                "onFocus": onFocus,
                "onBlur": blur
              }, slotProps, inputAttrs), null), [[resolveDirective("intersect"), {
                handler: onIntersect
              }, null, {
                once: true
              }]]);
              return createVNode(Fragment, null, [props.prefix && createVNode("span", {
                "class": "v-text-field__prefix"
              }, [createVNode("span", {
                "class": "v-text-field__prefix__text"
              }, [props.prefix])]), slots.default ? createVNode("div", {
                "class": fieldClass,
                "data-no-activator": ""
              }, [slots.default(), inputNode]) : cloneVNode(inputNode, {
                class: fieldClass
              }), props.suffix && createVNode("span", {
                "class": "v-text-field__suffix"
              }, [createVNode("span", {
                "class": "v-text-field__suffix__text"
              }, [props.suffix])])]);
            }
          });
        },
        details: hasDetails ? (slotProps) => createVNode(Fragment, null, [slots.details?.(slotProps), hasCounter && createVNode(Fragment, null, [createVNode("span", null, null), createVNode(VCounter, {
          "active": props.persistentCounter || isFocused.value,
          "value": counterValue.value,
          "max": max.value
        }, slots.counter)])]) : void 0
      });
    });
    return forwardRefs({}, vInputRef, vFieldRef, inputRef);
  }
});
const VVirtualScroll$1 = "";
const makeVVirtualScrollItemProps = propsFactory({
  renderless: Boolean,
  ...makeComponentProps()
}, "VVirtualScrollItem");
const VVirtualScrollItem = genericComponent()({
  name: "VVirtualScrollItem",
  inheritAttrs: false,
  props: makeVVirtualScrollItemProps(),
  emits: {
    "update:height": (height) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const {
      resizeRef,
      contentRect
    } = useResizeObserver(void 0, "border");
    watch(() => contentRect.value?.height, (height) => {
      if (height != null)
        emit2("update:height", height);
    });
    useRender(() => props.renderless ? createVNode(Fragment, null, [slots.default?.({
      itemRef: resizeRef
    })]) : createVNode("div", mergeProps({
      "ref": resizeRef,
      "class": ["v-virtual-scroll__item", props.class],
      "style": props.style
    }, attrs), [slots.default?.()]));
  }
});
const UP = -1;
const DOWN = 1;
const BUFFER_PX = 100;
const makeVirtualProps = propsFactory({
  itemHeight: {
    type: [Number, String],
    default: null
  },
  height: [Number, String]
}, "virtual");
function useVirtual(props, items) {
  const display = useDisplay();
  const itemHeight = shallowRef(0);
  watchEffect(() => {
    itemHeight.value = parseFloat(props.itemHeight || 0);
  });
  const first = shallowRef(0);
  const last = shallowRef(Math.ceil(
    // Assume 16px items filling the entire screen height if
    // not provided. This is probably incorrect but it minimises
    // the chance of ending up with empty space at the bottom.
    // The default value is set here to avoid poisoning getSize()
    (parseInt(props.height) || display.height.value) / (itemHeight.value || 16)
  ) || 1);
  const paddingTop = shallowRef(0);
  const paddingBottom = shallowRef(0);
  const containerRef = ref();
  const markerRef = ref();
  let markerOffset = 0;
  const {
    resizeRef,
    contentRect
  } = useResizeObserver();
  watchEffect(() => {
    resizeRef.value = containerRef.value;
  });
  const viewportHeight = computed(() => {
    return containerRef.value === document.documentElement ? display.height.value : contentRect.value?.height || parseInt(props.height) || 0;
  });
  const hasInitialRender = computed(() => {
    return !!(containerRef.value && markerRef.value && viewportHeight.value && itemHeight.value);
  });
  let sizes = Array.from({
    length: items.value.length
  });
  let offsets = Array.from({
    length: items.value.length
  });
  const updateTime = shallowRef(0);
  let targetScrollIndex = -1;
  function getSize(index) {
    return sizes[index] || itemHeight.value;
  }
  const updateOffsets = debounce(() => {
    const start = performance.now();
    offsets[0] = 0;
    const length = items.value.length;
    for (let i = 1; i <= length - 1; i++) {
      offsets[i] = (offsets[i - 1] || 0) + getSize(i - 1);
    }
    updateTime.value = Math.max(updateTime.value, performance.now() - start);
  }, updateTime);
  const unwatch = watch(hasInitialRender, (v) => {
    if (!v)
      return;
    unwatch();
    markerOffset = markerRef.value.offsetTop;
    updateOffsets.immediate();
    calculateVisibleItems();
    if (!~targetScrollIndex)
      return;
    nextTick(() => {
      IN_BROWSER && window.requestAnimationFrame(() => {
        scrollToIndex(targetScrollIndex);
        targetScrollIndex = -1;
      });
    });
  });
  watch(viewportHeight, (val, oldVal) => {
    oldVal && calculateVisibleItems();
  });
  onScopeDispose(() => {
    updateOffsets.clear();
  });
  function handleItemResize(index, height) {
    const prevHeight = sizes[index];
    const prevMinHeight = itemHeight.value;
    itemHeight.value = prevMinHeight ? Math.min(itemHeight.value, height) : height;
    if (prevHeight !== height || prevMinHeight !== itemHeight.value) {
      sizes[index] = height;
      updateOffsets();
    }
  }
  function calculateOffset(index) {
    index = clamp(index, 0, items.value.length - 1);
    return offsets[index] || 0;
  }
  function calculateIndex(scrollTop) {
    return binaryClosest(offsets, scrollTop);
  }
  let lastScrollTop = 0;
  let scrollVelocity = 0;
  let lastScrollTime = 0;
  function handleScroll() {
    if (!containerRef.value || !markerRef.value)
      return;
    const scrollTop = containerRef.value.scrollTop;
    const scrollTime = performance.now();
    const scrollDeltaT = scrollTime - lastScrollTime;
    if (scrollDeltaT > 500) {
      scrollVelocity = Math.sign(scrollTop - lastScrollTop);
      markerOffset = markerRef.value.offsetTop;
    } else {
      scrollVelocity = scrollTop - lastScrollTop;
    }
    lastScrollTop = scrollTop;
    lastScrollTime = scrollTime;
    calculateVisibleItems();
  }
  function handleScrollend() {
    if (!containerRef.value || !markerRef.value)
      return;
    scrollVelocity = 0;
    lastScrollTime = 0;
    calculateVisibleItems();
  }
  let raf2 = -1;
  function calculateVisibleItems() {
    cancelAnimationFrame(raf2);
    raf2 = requestAnimationFrame(_calculateVisibleItems);
  }
  function _calculateVisibleItems() {
    if (!containerRef.value || !viewportHeight.value)
      return;
    const scrollTop = lastScrollTop - markerOffset;
    const direction = Math.sign(scrollVelocity);
    const startPx = Math.max(0, scrollTop - BUFFER_PX);
    const start = clamp(calculateIndex(startPx), 0, items.value.length);
    const endPx = scrollTop + viewportHeight.value + BUFFER_PX;
    const end = clamp(calculateIndex(endPx) + 1, start + 1, items.value.length);
    if (
      // Only update the side we're scrolling towards,
      // the other side will be updated incidentally
      (direction !== UP || start < first.value) && (direction !== DOWN || end > last.value)
    ) {
      const topOverflow = calculateOffset(first.value) - calculateOffset(start);
      const bottomOverflow = calculateOffset(end) - calculateOffset(last.value);
      const bufferOverflow = Math.max(topOverflow, bottomOverflow);
      if (bufferOverflow > BUFFER_PX) {
        first.value = start;
        last.value = end;
      } else {
        if (start <= 0)
          first.value = start;
        if (end >= items.value.length)
          last.value = end;
      }
    }
    paddingTop.value = calculateOffset(first.value);
    paddingBottom.value = calculateOffset(items.value.length) - calculateOffset(last.value);
  }
  function scrollToIndex(index) {
    const offset = calculateOffset(index);
    if (!containerRef.value || index && !offset) {
      targetScrollIndex = index;
    } else {
      containerRef.value.scrollTop = offset;
    }
  }
  const computedItems = computed(() => {
    return items.value.slice(first.value, last.value).map((item, index) => ({
      raw: item,
      index: index + first.value
    }));
  });
  watch(items, () => {
    sizes = Array.from({
      length: items.value.length
    });
    offsets = Array.from({
      length: items.value.length
    });
    updateOffsets.immediate();
    calculateVisibleItems();
  }, {
    deep: true
  });
  return {
    containerRef,
    markerRef,
    computedItems,
    paddingTop,
    paddingBottom,
    scrollToIndex,
    handleScroll,
    handleScrollend,
    handleItemResize
  };
}
function binaryClosest(arr, val) {
  let high = arr.length - 1;
  let low = 0;
  let mid = 0;
  let item = null;
  let target = -1;
  if (arr[high] < val) {
    return high;
  }
  while (low <= high) {
    mid = low + high >> 1;
    item = arr[mid];
    if (item > val) {
      high = mid - 1;
    } else if (item < val) {
      target = mid;
      low = mid + 1;
    } else if (item === val) {
      return mid;
    } else {
      return low;
    }
  }
  return target;
}
const makeVVirtualScrollProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  renderless: Boolean,
  ...makeVirtualProps(),
  ...makeComponentProps(),
  ...makeDimensionProps()
}, "VVirtualScroll");
const VVirtualScroll = genericComponent()({
  name: "VVirtualScroll",
  props: makeVVirtualScrollProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const vm = getCurrentInstance("VVirtualScroll");
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      containerRef,
      markerRef,
      handleScroll,
      handleScrollend,
      handleItemResize,
      scrollToIndex,
      paddingTop,
      paddingBottom,
      computedItems
    } = useVirtual(props, toRef(props, "items"));
    useToggleScope(() => props.renderless, () => {
      function handleListeners() {
        let add2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        const method = add2 ? "addEventListener" : "removeEventListener";
        if (containerRef.value === document.documentElement) {
          document[method]("scroll", handleScroll, {
            passive: true
          });
          document[method]("scrollend", handleScrollend);
        } else {
          containerRef.value?.[method]("scroll", handleScroll, {
            passive: true
          });
          containerRef.value?.[method]("scrollend", handleScrollend);
        }
      }
      onMounted(() => {
        containerRef.value = getScrollParent(vm.vnode.el, true);
        handleListeners(true);
      });
      onScopeDispose(handleListeners);
    });
    useRender(() => {
      const children = computedItems.value.map((item) => createVNode(VVirtualScrollItem, {
        "key": item.index,
        "renderless": props.renderless,
        "onUpdate:height": (height) => handleItemResize(item.index, height)
      }, {
        default: (slotProps) => slots.default?.({
          item: item.raw,
          index: item.index,
          ...slotProps
        })
      }));
      return props.renderless ? createVNode(Fragment, null, [createVNode("div", {
        "ref": markerRef,
        "class": "v-virtual-scroll__spacer",
        "style": {
          paddingTop: convertToUnit(paddingTop.value)
        }
      }, null), children, createVNode("div", {
        "class": "v-virtual-scroll__spacer",
        "style": {
          paddingBottom: convertToUnit(paddingBottom.value)
        }
      }, null)]) : createVNode("div", {
        "ref": containerRef,
        "class": ["v-virtual-scroll", props.class],
        "onScrollPassive": handleScroll,
        "onScrollend": handleScrollend,
        "style": [dimensionStyles.value, props.style]
      }, [createVNode("div", {
        "ref": markerRef,
        "class": "v-virtual-scroll__container",
        "style": {
          paddingTop: convertToUnit(paddingTop.value),
          paddingBottom: convertToUnit(paddingBottom.value)
        }
      }, [children])]);
    });
    return {
      scrollToIndex
    };
  }
});
function useScrolling(listRef, textFieldRef) {
  const isScrolling = shallowRef(false);
  let scrollTimeout;
  function onListScroll(e) {
    cancelAnimationFrame(scrollTimeout);
    isScrolling.value = true;
    scrollTimeout = requestAnimationFrame(() => {
      scrollTimeout = requestAnimationFrame(() => {
        isScrolling.value = false;
      });
    });
  }
  async function finishScrolling() {
    await new Promise((resolve2) => requestAnimationFrame(resolve2));
    await new Promise((resolve2) => requestAnimationFrame(resolve2));
    await new Promise((resolve2) => requestAnimationFrame(resolve2));
    await new Promise((resolve2) => {
      if (isScrolling.value) {
        const stop = watch(isScrolling, () => {
          stop();
          resolve2();
        });
      } else
        resolve2();
    });
  }
  async function onListKeydown(e) {
    if (e.key === "Tab") {
      textFieldRef.value?.focus();
    }
    if (!["PageDown", "PageUp", "Home", "End"].includes(e.key))
      return;
    const el = listRef.value?.$el;
    if (!el)
      return;
    if (e.key === "Home" || e.key === "End") {
      el.scrollTo({
        top: e.key === "Home" ? 0 : el.scrollHeight,
        behavior: "smooth"
      });
    }
    await finishScrolling();
    const children = el.querySelectorAll(":scope > :not(.v-virtual-scroll__spacer)");
    if (e.key === "PageDown" || e.key === "Home") {
      const top = el.getBoundingClientRect().top;
      for (const child of children) {
        if (child.getBoundingClientRect().top >= top) {
          child.focus();
          break;
        }
      }
    } else {
      const bottom = el.getBoundingClientRect().bottom;
      for (const child of [...children].reverse()) {
        if (child.getBoundingClientRect().bottom <= bottom) {
          child.focus();
          break;
        }
      }
    }
  }
  return {
    onListScroll,
    onListKeydown
  };
}
const makeSelectProps = propsFactory({
  chips: Boolean,
  closableChips: Boolean,
  closeText: {
    type: String,
    default: "$vuetify.close"
  },
  openText: {
    type: String,
    default: "$vuetify.open"
  },
  eager: Boolean,
  hideNoData: Boolean,
  hideSelected: Boolean,
  menu: Boolean,
  menuIcon: {
    type: IconValue,
    default: "$dropdown"
  },
  menuProps: {
    type: Object
  },
  multiple: Boolean,
  noDataText: {
    type: String,
    default: "$vuetify.noDataText"
  },
  openOnClear: Boolean,
  itemColor: String,
  ...makeItemsProps({
    itemChildren: false
  })
}, "Select");
const makeVSelectProps = propsFactory({
  ...makeSelectProps(),
  ...omit(makeVTextFieldProps({
    modelValue: null,
    role: "button"
  }), ["validationValue", "dirty", "appendInnerIcon"]),
  ...makeTransitionProps({
    transition: {
      component: VDialogTransition
    }
  })
}, "VSelect");
const VSelect = genericComponent()({
  name: "VSelect",
  props: makeVSelectProps(),
  emits: {
    "update:focused": (focused) => true,
    "update:modelValue": (value) => true,
    "update:menu": (ue) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const vTextFieldRef = ref();
    const vMenuRef = ref();
    const vVirtualScrollRef = ref();
    const _menu = useProxiedModel(props, "menu");
    const menu = computed({
      get: () => _menu.value,
      set: (v) => {
        if (_menu.value && !v && vMenuRef.value?.ΨopenChildren)
          return;
        _menu.value = v;
      }
    });
    const {
      items,
      transformIn,
      transformOut
    } = useItems(props);
    const model = useProxiedModel(props, "modelValue", [], (v) => transformIn(v === null ? [null] : wrapInArray(v)), (v) => {
      const transformed = transformOut(v);
      return props.multiple ? transformed : transformed[0] ?? null;
    });
    const counterValue = computed(() => {
      return typeof props.counterValue === "function" ? props.counterValue(model.value) : typeof props.counterValue === "number" ? props.counterValue : model.value.length;
    });
    const form = useForm();
    const selectedValues = computed(() => model.value.map((selection) => selection.value));
    const isFocused = shallowRef(false);
    const label = computed(() => menu.value ? props.closeText : props.openText);
    let keyboardLookupPrefix = "";
    let keyboardLookupLastTime;
    const displayItems = computed(() => {
      if (props.hideSelected) {
        return items.value.filter((item) => !model.value.some((s) => s === item));
      }
      return items.value;
    });
    const menuDisabled = computed(() => props.hideNoData && !items.value.length || props.readonly || form?.isReadonly.value);
    const listRef = ref();
    const {
      onListScroll,
      onListKeydown
    } = useScrolling(listRef, vTextFieldRef);
    function onClear(e) {
      if (props.openOnClear) {
        menu.value = true;
      }
    }
    function onMousedownControl() {
      if (menuDisabled.value)
        return;
      menu.value = !menu.value;
    }
    function onKeydown(e) {
      if (!e.key || props.readonly || form?.isReadonly.value)
        return;
      if (["Enter", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
        e.preventDefault();
      }
      if (["Enter", "ArrowDown", " "].includes(e.key)) {
        menu.value = true;
      }
      if (["Escape", "Tab"].includes(e.key)) {
        menu.value = false;
      }
      if (e.key === "Home") {
        listRef.value?.focus("first");
      } else if (e.key === "End") {
        listRef.value?.focus("last");
      }
      const KEYBOARD_LOOKUP_THRESHOLD = 1e3;
      function checkPrintable(e2) {
        const isPrintableChar = e2.key.length === 1;
        const noModifier = !e2.ctrlKey && !e2.metaKey && !e2.altKey;
        return isPrintableChar && noModifier;
      }
      if (props.multiple || !checkPrintable(e))
        return;
      const now = performance.now();
      if (now - keyboardLookupLastTime > KEYBOARD_LOOKUP_THRESHOLD) {
        keyboardLookupPrefix = "";
      }
      keyboardLookupPrefix += e.key.toLowerCase();
      keyboardLookupLastTime = now;
      const item = items.value.find((item2) => item2.title.toLowerCase().startsWith(keyboardLookupPrefix));
      if (item !== void 0) {
        model.value = [item];
      }
    }
    function select(item) {
      if (props.multiple) {
        const index = model.value.findIndex((selection) => props.valueComparator(selection.value, item.value));
        if (index === -1) {
          model.value = [...model.value, item];
        } else {
          const value = [...model.value];
          value.splice(index, 1);
          model.value = value;
        }
      } else {
        model.value = [item];
        menu.value = false;
      }
    }
    function onBlur(e) {
      if (!listRef.value?.$el.contains(e.relatedTarget)) {
        menu.value = false;
      }
    }
    function onAfterLeave() {
      if (isFocused.value) {
        vTextFieldRef.value?.focus();
      }
    }
    function onFocusin(e) {
      isFocused.value = true;
    }
    function onModelUpdate(v) {
      if (v == null)
        model.value = [];
      else if (matchesSelector(vTextFieldRef.value, ":autofill") || matchesSelector(vTextFieldRef.value, ":-webkit-autofill")) {
        const item = items.value.find((item2) => item2.title === v);
        if (item) {
          select(item);
        }
      } else if (vTextFieldRef.value) {
        vTextFieldRef.value.value = "";
      }
    }
    watch(menu, () => {
      if (!props.hideSelected && menu.value && model.value.length) {
        const index = displayItems.value.findIndex((item) => model.value.some((s) => props.valueComparator(s.value, item.value)));
        IN_BROWSER && window.requestAnimationFrame(() => {
          index >= 0 && vVirtualScrollRef.value?.scrollToIndex(index);
        });
      }
    });
    useRender(() => {
      const hasChips = !!(props.chips || slots.chip);
      const hasList = !!(!props.hideNoData || displayItems.value.length || slots["prepend-item"] || slots["append-item"] || slots["no-data"]);
      const isDirty = model.value.length > 0;
      const textFieldProps = VTextField.filterProps(props);
      const placeholder = isDirty || !isFocused.value && props.label && !props.persistentPlaceholder ? void 0 : props.placeholder;
      return createVNode(VTextField, mergeProps({
        "ref": vTextFieldRef
      }, textFieldProps, {
        "modelValue": model.value.map((v) => v.props.value).join(", "),
        "onUpdate:modelValue": onModelUpdate,
        "focused": isFocused.value,
        "onUpdate:focused": ($event) => isFocused.value = $event,
        "validationValue": model.externalValue,
        "counterValue": counterValue.value,
        "dirty": isDirty,
        "class": ["v-select", {
          "v-select--active-menu": menu.value,
          "v-select--chips": !!props.chips,
          [`v-select--${props.multiple ? "multiple" : "single"}`]: true,
          "v-select--selected": model.value.length,
          "v-select--selection-slot": !!slots.selection
        }, props.class],
        "style": props.style,
        "inputmode": "none",
        "placeholder": placeholder,
        "onClick:clear": onClear,
        "onMousedown:control": onMousedownControl,
        "onBlur": onBlur,
        "onKeydown": onKeydown,
        "aria-label": t(label.value),
        "title": t(label.value)
      }), {
        ...slots,
        default: () => createVNode(Fragment, null, [createVNode(VMenu, mergeProps({
          "ref": vMenuRef,
          "modelValue": menu.value,
          "onUpdate:modelValue": ($event) => menu.value = $event,
          "activator": "parent",
          "contentClass": "v-select__content",
          "disabled": menuDisabled.value,
          "eager": props.eager,
          "maxHeight": 310,
          "openOnClick": false,
          "closeOnContentClick": false,
          "transition": props.transition,
          "onAfterLeave": onAfterLeave
        }, props.menuProps), {
          default: () => [hasList && createVNode(VList, {
            "ref": listRef,
            "selected": selectedValues.value,
            "selectStrategy": props.multiple ? "independent" : "single-independent",
            "onMousedown": (e) => e.preventDefault(),
            "onKeydown": onListKeydown,
            "onFocusin": onFocusin,
            "onScrollPassive": onListScroll,
            "tabindex": "-1",
            "color": props.itemColor ?? props.color
          }, {
            default: () => [slots["prepend-item"]?.(), !displayItems.value.length && !props.hideNoData && (slots["no-data"]?.() ?? createVNode(VListItem, {
              "title": t(props.noDataText)
            }, null)), createVNode(VVirtualScroll, {
              "ref": vVirtualScrollRef,
              "renderless": true,
              "items": displayItems.value
            }, {
              default: (_ref2) => {
                let {
                  item,
                  index,
                  itemRef
                } = _ref2;
                const itemProps = mergeProps(item.props, {
                  ref: itemRef,
                  key: index,
                  onClick: () => select(item)
                });
                return slots.item?.({
                  item,
                  index,
                  props: itemProps
                }) ?? createVNode(VListItem, mergeProps(itemProps, {
                  "role": "option"
                }), {
                  prepend: (_ref3) => {
                    let {
                      isSelected
                    } = _ref3;
                    return createVNode(Fragment, null, [props.multiple && !props.hideSelected ? createVNode(VCheckboxBtn, {
                      "key": item.value,
                      "modelValue": isSelected,
                      "ripple": false,
                      "tabindex": "-1"
                    }, null) : void 0, item.props.prependIcon && createVNode(VIcon, {
                      "icon": item.props.prependIcon
                    }, null)]);
                  }
                });
              }
            }), slots["append-item"]?.()]
          })]
        }), model.value.map((item, index) => {
          function onChipClose(e) {
            e.stopPropagation();
            e.preventDefault();
            select(item);
          }
          const slotProps = {
            "onClick:close": onChipClose,
            onMousedown(e) {
              e.preventDefault();
              e.stopPropagation();
            },
            modelValue: true,
            "onUpdate:modelValue": void 0
          };
          const hasSlot = hasChips ? !!slots.chip : !!slots.selection;
          const slotContent = hasSlot ? ensureValidVNode(hasChips ? slots.chip({
            item,
            index,
            props: slotProps
          }) : slots.selection({
            item,
            index
          })) : void 0;
          if (hasSlot && !slotContent)
            return void 0;
          return createVNode("div", {
            "key": item.value,
            "class": "v-select__selection"
          }, [hasChips ? !slots.chip ? createVNode(VChip, mergeProps({
            "key": "chip",
            "closable": props.closableChips,
            "size": "small",
            "text": item.title,
            "disabled": item.props.disabled
          }, slotProps), null) : createVNode(VDefaultsProvider, {
            "key": "chip-defaults",
            "defaults": {
              VChip: {
                closable: props.closableChips,
                size: "small",
                text: item.title
              }
            }
          }, {
            default: () => [slotContent]
          }) : slotContent ?? createVNode("span", {
            "class": "v-select__selection-text"
          }, [item.title, props.multiple && index < model.value.length - 1 && createVNode("span", {
            "class": "v-select__selection-comma"
          }, [createTextVNode(",")])])]);
        })]),
        "append-inner": function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return createVNode(Fragment, null, [slots["append-inner"]?.(...args), props.menuIcon ? createVNode(VIcon, {
            "class": "v-select__menu-icon",
            "icon": props.menuIcon
          }, null) : void 0]);
        }
      });
    });
    return forwardRefs({
      isFocused,
      menu,
      select
    }, vTextFieldRef);
  }
});
const defaultFilter = (value, query, item) => {
  if (value == null || query == null)
    return -1;
  return value.toString().toLocaleLowerCase().indexOf(query.toString().toLocaleLowerCase());
};
const makeFilterProps = propsFactory({
  customFilter: Function,
  customKeyFilter: Object,
  filterKeys: [Array, String],
  filterMode: {
    type: String,
    default: "intersection"
  },
  noFilter: Boolean
}, "filter");
function filterItems(items, query, options) {
  const array = [];
  const filter = options?.default ?? defaultFilter;
  const keys2 = options?.filterKeys ? wrapInArray(options.filterKeys) : false;
  const customFiltersLength = Object.keys(options?.customKeyFilter ?? {}).length;
  if (!items?.length)
    return array;
  loop:
    for (let i = 0; i < items.length; i++) {
      const [item, transformed = item] = wrapInArray(items[i]);
      const customMatches = {};
      const defaultMatches = {};
      let match = -1;
      if (query && !options?.noFilter) {
        if (typeof item === "object") {
          const filterKeys = keys2 || Object.keys(transformed);
          for (const key of filterKeys) {
            const value = getPropertyFromItem(transformed, key, transformed);
            const keyFilter = options?.customKeyFilter?.[key];
            match = keyFilter ? keyFilter(value, query, item) : filter(value, query, item);
            if (match !== -1 && match !== false) {
              if (keyFilter)
                customMatches[key] = match;
              else
                defaultMatches[key] = match;
            } else if (options?.filterMode === "every") {
              continue loop;
            }
          }
        } else {
          match = filter(item, query, item);
          if (match !== -1 && match !== false) {
            defaultMatches.title = match;
          }
        }
        const defaultMatchesLength = Object.keys(defaultMatches).length;
        const customMatchesLength = Object.keys(customMatches).length;
        if (!defaultMatchesLength && !customMatchesLength)
          continue;
        if (options?.filterMode === "union" && customMatchesLength !== customFiltersLength && !defaultMatchesLength)
          continue;
        if (options?.filterMode === "intersection" && (customMatchesLength !== customFiltersLength || !defaultMatchesLength))
          continue;
      }
      array.push({
        index: i,
        matches: {
          ...defaultMatches,
          ...customMatches
        }
      });
    }
  return array;
}
function useFilter(props, items, query, options) {
  const filteredItems = ref([]);
  const filteredMatches = ref(/* @__PURE__ */ new Map());
  const transformedItems = computed(() => options?.transform ? unref(items).map((item) => [item, options.transform(item)]) : unref(items));
  watchEffect(() => {
    const _query = typeof query === "function" ? query() : unref(query);
    const strQuery = typeof _query !== "string" && typeof _query !== "number" ? "" : String(_query);
    const results = filterItems(transformedItems.value, strQuery, {
      customKeyFilter: {
        ...props.customKeyFilter,
        ...unref(options?.customKeyFilter)
      },
      default: props.customFilter,
      filterKeys: props.filterKeys,
      filterMode: props.filterMode,
      noFilter: props.noFilter
    });
    const originalItems = unref(items);
    const _filteredItems = [];
    const _filteredMatches = /* @__PURE__ */ new Map();
    results.forEach((_ref) => {
      let {
        index,
        matches
      } = _ref;
      const item = originalItems[index];
      _filteredItems.push(item);
      _filteredMatches.set(item.value, matches);
    });
    filteredItems.value = _filteredItems;
    filteredMatches.value = _filteredMatches;
  });
  function getMatches(item) {
    return filteredMatches.value.get(item.value);
  }
  return {
    filteredItems,
    filteredMatches,
    getMatches
  };
}
function highlightResult$1(text, matches, length) {
  if (matches == null)
    return text;
  if (Array.isArray(matches))
    throw new Error("Multiple matches is not implemented");
  return typeof matches === "number" && ~matches ? createVNode(Fragment, null, [createVNode("span", {
    "class": "v-autocomplete__unmask"
  }, [text.substr(0, matches)]), createVNode("span", {
    "class": "v-autocomplete__mask"
  }, [text.substr(matches, length)]), createVNode("span", {
    "class": "v-autocomplete__unmask"
  }, [text.substr(matches + length)])]) : text;
}
const makeVAutocompleteProps = propsFactory({
  autoSelectFirst: {
    type: [Boolean, String]
  },
  search: String,
  ...makeFilterProps({
    filterKeys: ["title"]
  }),
  ...makeSelectProps(),
  ...omit(makeVTextFieldProps({
    modelValue: null,
    role: "combobox"
  }), ["validationValue", "dirty", "appendInnerIcon"]),
  ...makeTransitionProps({
    transition: false
  })
}, "VAutocomplete");
const VAutocomplete = genericComponent()({
  name: "VAutocomplete",
  props: makeVAutocompleteProps(),
  emits: {
    "update:focused": (focused) => true,
    "update:search": (value) => true,
    "update:modelValue": (value) => true,
    "update:menu": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const vTextFieldRef = ref();
    const isFocused = shallowRef(false);
    const isPristine = shallowRef(true);
    const listHasFocus = shallowRef(false);
    const vMenuRef = ref();
    const vVirtualScrollRef = ref();
    const _menu = useProxiedModel(props, "menu");
    const menu = computed({
      get: () => _menu.value,
      set: (v) => {
        if (_menu.value && !v && vMenuRef.value?.ΨopenChildren)
          return;
        _menu.value = v;
      }
    });
    const selectionIndex = shallowRef(-1);
    const color = computed(() => vTextFieldRef.value?.color);
    const label = computed(() => menu.value ? props.closeText : props.openText);
    const {
      items,
      transformIn,
      transformOut
    } = useItems(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(color);
    const search = useProxiedModel(props, "search", "");
    const model = useProxiedModel(props, "modelValue", [], (v) => transformIn(v === null ? [null] : wrapInArray(v)), (v) => {
      const transformed = transformOut(v);
      return props.multiple ? transformed : transformed[0] ?? null;
    });
    const counterValue = computed(() => {
      return typeof props.counterValue === "function" ? props.counterValue(model.value) : typeof props.counterValue === "number" ? props.counterValue : model.value.length;
    });
    const form = useForm();
    const {
      filteredItems,
      getMatches
    } = useFilter(props, items, () => isPristine.value ? "" : search.value);
    const displayItems = computed(() => {
      if (props.hideSelected) {
        return filteredItems.value.filter((filteredItem) => !model.value.some((s) => s.value === filteredItem.value));
      }
      return filteredItems.value;
    });
    const selectedValues = computed(() => model.value.map((selection) => selection.props.value));
    const highlightFirst = computed(() => {
      const selectFirst = props.autoSelectFirst === true || props.autoSelectFirst === "exact" && search.value === displayItems.value[0]?.title;
      return selectFirst && displayItems.value.length > 0 && !isPristine.value && !listHasFocus.value;
    });
    const menuDisabled = computed(() => props.hideNoData && !items.value.length || props.readonly || form?.isReadonly.value);
    const listRef = ref();
    const {
      onListScroll,
      onListKeydown
    } = useScrolling(listRef, vTextFieldRef);
    function onClear(e) {
      if (props.openOnClear) {
        menu.value = true;
      }
      search.value = "";
    }
    function onMousedownControl() {
      if (menuDisabled.value)
        return;
      menu.value = true;
    }
    function onMousedownMenuIcon(e) {
      if (menuDisabled.value)
        return;
      if (isFocused.value) {
        e.preventDefault();
        e.stopPropagation();
      }
      menu.value = !menu.value;
    }
    function onKeydown(e) {
      if (props.readonly || form?.isReadonly.value)
        return;
      const selectionStart = vTextFieldRef.value.selectionStart;
      const length = model.value.length;
      if (selectionIndex.value > -1 || ["Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
      }
      if (["Enter", "ArrowDown"].includes(e.key)) {
        menu.value = true;
      }
      if (["Escape"].includes(e.key)) {
        menu.value = false;
      }
      if (highlightFirst.value && ["Enter", "Tab"].includes(e.key)) {
        select(displayItems.value[0]);
      }
      if (e.key === "ArrowDown" && highlightFirst.value) {
        listRef.value?.focus("next");
      }
      if (!props.multiple)
        return;
      if (["Backspace", "Delete"].includes(e.key)) {
        if (selectionIndex.value < 0) {
          if (e.key === "Backspace" && !search.value) {
            selectionIndex.value = length - 1;
          }
          return;
        }
        const originalSelectionIndex = selectionIndex.value;
        const selectedItem = model.value[selectionIndex.value];
        if (selectedItem && !selectedItem.props.disabled)
          select(selectedItem);
        selectionIndex.value = originalSelectionIndex >= length - 1 ? length - 2 : originalSelectionIndex;
      }
      if (e.key === "ArrowLeft") {
        if (selectionIndex.value < 0 && selectionStart > 0)
          return;
        const prev = selectionIndex.value > -1 ? selectionIndex.value - 1 : length - 1;
        if (model.value[prev]) {
          selectionIndex.value = prev;
        } else {
          selectionIndex.value = -1;
          vTextFieldRef.value.setSelectionRange(search.value?.length, search.value?.length);
        }
      }
      if (e.key === "ArrowRight") {
        if (selectionIndex.value < 0)
          return;
        const next = selectionIndex.value + 1;
        if (model.value[next]) {
          selectionIndex.value = next;
        } else {
          selectionIndex.value = -1;
          vTextFieldRef.value.setSelectionRange(0, 0);
        }
      }
    }
    function onInput(e) {
      search.value = e.target.value;
    }
    function onChange(e) {
      if (matchesSelector(vTextFieldRef.value, ":autofill") || matchesSelector(vTextFieldRef.value, ":-webkit-autofill")) {
        const item = items.value.find((item2) => item2.title === e.target.value);
        if (item) {
          select(item);
        }
      }
    }
    function onAfterLeave() {
      if (isFocused.value) {
        isPristine.value = true;
        vTextFieldRef.value?.focus();
      }
    }
    function onFocusin(e) {
      isFocused.value = true;
      setTimeout(() => {
        listHasFocus.value = true;
      });
    }
    function onFocusout(e) {
      listHasFocus.value = false;
    }
    function onUpdateModelValue(v) {
      if (v == null || v === "" && !props.multiple)
        model.value = [];
    }
    const isSelecting = shallowRef(false);
    function select(item) {
      if (props.multiple) {
        const index = model.value.findIndex((selection) => props.valueComparator(selection.value, item.value));
        if (index === -1) {
          model.value = [...model.value, item];
        } else {
          const value = [...model.value];
          value.splice(index, 1);
          model.value = value;
        }
      } else {
        model.value = [item];
        isSelecting.value = true;
        search.value = item.title;
        menu.value = false;
        isPristine.value = true;
        nextTick(() => isSelecting.value = false);
      }
    }
    watch(isFocused, (val, oldVal) => {
      if (val === oldVal)
        return;
      if (val) {
        isSelecting.value = true;
        search.value = props.multiple ? "" : String(model.value.at(-1)?.props.title ?? "");
        isPristine.value = true;
        nextTick(() => isSelecting.value = false);
      } else {
        if (!props.multiple && search.value == null)
          model.value = [];
        else if (highlightFirst.value && !listHasFocus.value && !model.value.some((_ref2) => {
          let {
            value
          } = _ref2;
          return value === displayItems.value[0].value;
        })) {
          select(displayItems.value[0]);
        }
        menu.value = false;
        search.value = "";
        selectionIndex.value = -1;
      }
    });
    watch(search, (val) => {
      if (!isFocused.value || isSelecting.value)
        return;
      if (val)
        menu.value = true;
      isPristine.value = !val;
    });
    watch(menu, () => {
      if (!props.hideSelected && menu.value && model.value.length) {
        const index = displayItems.value.findIndex((item) => model.value.some((s) => item.value === s.value));
        IN_BROWSER && window.requestAnimationFrame(() => {
          index >= 0 && vVirtualScrollRef.value?.scrollToIndex(index);
        });
      }
    });
    useRender(() => {
      const hasChips = !!(props.chips || slots.chip);
      const hasList = !!(!props.hideNoData || displayItems.value.length || slots["prepend-item"] || slots["append-item"] || slots["no-data"]);
      const isDirty = model.value.length > 0;
      const textFieldProps = VTextField.filterProps(props);
      return createVNode(VTextField, mergeProps({
        "ref": vTextFieldRef
      }, textFieldProps, {
        "modelValue": search.value,
        "onUpdate:modelValue": onUpdateModelValue,
        "focused": isFocused.value,
        "onUpdate:focused": ($event) => isFocused.value = $event,
        "validationValue": model.externalValue,
        "counterValue": counterValue.value,
        "dirty": isDirty,
        "onInput": onInput,
        "onChange": onChange,
        "class": ["v-autocomplete", `v-autocomplete--${props.multiple ? "multiple" : "single"}`, {
          "v-autocomplete--active-menu": menu.value,
          "v-autocomplete--chips": !!props.chips,
          "v-autocomplete--selection-slot": !!slots.selection,
          "v-autocomplete--selecting-index": selectionIndex.value > -1
        }, props.class],
        "style": props.style,
        "readonly": props.readonly,
        "placeholder": isDirty ? void 0 : props.placeholder,
        "onClick:clear": onClear,
        "onMousedown:control": onMousedownControl,
        "onKeydown": onKeydown
      }), {
        ...slots,
        default: () => createVNode(Fragment, null, [createVNode(VMenu, mergeProps({
          "ref": vMenuRef,
          "modelValue": menu.value,
          "onUpdate:modelValue": ($event) => menu.value = $event,
          "activator": "parent",
          "contentClass": "v-autocomplete__content",
          "disabled": menuDisabled.value,
          "eager": props.eager,
          "maxHeight": 310,
          "openOnClick": false,
          "closeOnContentClick": false,
          "transition": props.transition,
          "onAfterLeave": onAfterLeave
        }, props.menuProps), {
          default: () => [hasList && createVNode(VList, {
            "ref": listRef,
            "selected": selectedValues.value,
            "selectStrategy": props.multiple ? "independent" : "single-independent",
            "onMousedown": (e) => e.preventDefault(),
            "onKeydown": onListKeydown,
            "onFocusin": onFocusin,
            "onFocusout": onFocusout,
            "onScrollPassive": onListScroll,
            "tabindex": "-1",
            "color": props.itemColor ?? props.color
          }, {
            default: () => [slots["prepend-item"]?.(), !displayItems.value.length && !props.hideNoData && (slots["no-data"]?.() ?? createVNode(VListItem, {
              "title": t(props.noDataText)
            }, null)), createVNode(VVirtualScroll, {
              "ref": vVirtualScrollRef,
              "renderless": true,
              "items": displayItems.value
            }, {
              default: (_ref3) => {
                let {
                  item,
                  index,
                  itemRef
                } = _ref3;
                const itemProps = mergeProps(item.props, {
                  ref: itemRef,
                  key: index,
                  active: highlightFirst.value && index === 0 ? true : void 0,
                  onClick: () => select(item)
                });
                return slots.item?.({
                  item,
                  index,
                  props: itemProps
                }) ?? createVNode(VListItem, itemProps, {
                  prepend: (_ref4) => {
                    let {
                      isSelected
                    } = _ref4;
                    return createVNode(Fragment, null, [props.multiple && !props.hideSelected ? createVNode(VCheckboxBtn, {
                      "key": item.value,
                      "modelValue": isSelected,
                      "ripple": false,
                      "tabindex": "-1"
                    }, null) : void 0, item.props.prependIcon && createVNode(VIcon, {
                      "icon": item.props.prependIcon
                    }, null)]);
                  },
                  title: () => {
                    return isPristine.value ? item.title : highlightResult$1(item.title, getMatches(item)?.title, search.value?.length ?? 0);
                  }
                });
              }
            }), slots["append-item"]?.()]
          })]
        }), model.value.map((item, index) => {
          function onChipClose(e) {
            e.stopPropagation();
            e.preventDefault();
            select(item);
          }
          const slotProps = {
            "onClick:close": onChipClose,
            onMousedown(e) {
              e.preventDefault();
              e.stopPropagation();
            },
            modelValue: true,
            "onUpdate:modelValue": void 0
          };
          const hasSlot = hasChips ? !!slots.chip : !!slots.selection;
          const slotContent = hasSlot ? ensureValidVNode(hasChips ? slots.chip({
            item,
            index,
            props: slotProps
          }) : slots.selection({
            item,
            index
          })) : void 0;
          if (hasSlot && !slotContent)
            return void 0;
          return createVNode("div", {
            "key": item.value,
            "class": ["v-autocomplete__selection", index === selectionIndex.value && ["v-autocomplete__selection--selected", textColorClasses.value]],
            "style": index === selectionIndex.value ? textColorStyles.value : {}
          }, [hasChips ? !slots.chip ? createVNode(VChip, mergeProps({
            "key": "chip",
            "closable": props.closableChips,
            "size": "small",
            "text": item.title,
            "disabled": item.props.disabled
          }, slotProps), null) : createVNode(VDefaultsProvider, {
            "key": "chip-defaults",
            "defaults": {
              VChip: {
                closable: props.closableChips,
                size: "small",
                text: item.title
              }
            }
          }, {
            default: () => [slotContent]
          }) : slotContent ?? createVNode("span", {
            "class": "v-autocomplete__selection-text"
          }, [item.title, props.multiple && index < model.value.length - 1 && createVNode("span", {
            "class": "v-autocomplete__selection-comma"
          }, [createTextVNode(",")])])]);
        })]),
        "append-inner": function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return createVNode(Fragment, null, [slots["append-inner"]?.(...args), props.menuIcon ? createVNode(VIcon, {
            "class": "v-autocomplete__menu-icon",
            "icon": props.menuIcon,
            "onMousedown": onMousedownMenuIcon,
            "onClick": noop$1,
            "aria-label": t(label.value),
            "title": t(label.value)
          }, null) : void 0]);
        }
      });
    });
    return forwardRefs({
      isFocused,
      isPristine,
      menu,
      search,
      filteredItems,
      select
    }, vTextFieldRef);
  }
});
const VBadge$1 = "";
const makeVBadgeProps = propsFactory({
  bordered: Boolean,
  color: String,
  content: [Number, String],
  dot: Boolean,
  floating: Boolean,
  icon: IconValue,
  inline: Boolean,
  label: {
    type: String,
    default: "$vuetify.badge"
  },
  max: [Number, String],
  modelValue: {
    type: Boolean,
    default: true
  },
  offsetX: [Number, String],
  offsetY: [Number, String],
  textColor: String,
  ...makeComponentProps(),
  ...makeLocationProps({
    location: "top end"
  }),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeTransitionProps({
    transition: "scale-rotate-transition"
  })
}, "VBadge");
const VBadge = genericComponent()({
  name: "VBadge",
  inheritAttrs: false,
  props: makeVBadgeProps(),
  setup(props, ctx) {
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      roundedClasses
    } = useRounded(props);
    const {
      t
    } = useLocale();
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(toRef(props, "textColor"));
    const {
      themeClasses
    } = useTheme();
    const {
      locationStyles
    } = useLocation(props, true, (side) => {
      const base = props.floating ? props.dot ? 2 : 4 : props.dot ? 8 : 12;
      return base + (["top", "bottom"].includes(side) ? +(props.offsetY ?? 0) : ["left", "right"].includes(side) ? +(props.offsetX ?? 0) : 0);
    });
    useRender(() => {
      const value = Number(props.content);
      const content = !props.max || isNaN(value) ? props.content : value <= +props.max ? value : `${props.max}+`;
      const [badgeAttrs, attrs] = pickWithRest(ctx.attrs, ["aria-atomic", "aria-label", "aria-live", "role", "title"]);
      return createVNode(props.tag, mergeProps({
        "class": ["v-badge", {
          "v-badge--bordered": props.bordered,
          "v-badge--dot": props.dot,
          "v-badge--floating": props.floating,
          "v-badge--inline": props.inline
        }, props.class]
      }, attrs, {
        "style": props.style
      }), {
        default: () => [createVNode("div", {
          "class": "v-badge__wrapper"
        }, [ctx.slots.default?.(), createVNode(MaybeTransition, {
          "transition": props.transition
        }, {
          default: () => [withDirectives(createVNode("span", mergeProps({
            "class": ["v-badge__badge", themeClasses.value, backgroundColorClasses.value, roundedClasses.value, textColorClasses.value],
            "style": [backgroundColorStyles.value, textColorStyles.value, props.inline ? {} : locationStyles.value],
            "aria-atomic": "true",
            "aria-label": t(props.label, value),
            "aria-live": "polite",
            "role": "status"
          }, badgeAttrs), [props.dot ? void 0 : ctx.slots.badge ? ctx.slots.badge?.() : props.icon ? createVNode(VIcon, {
            "icon": props.icon
          }, null) : content]), [[vShow, props.modelValue]])]
        })])]
      });
    });
    return {};
  }
});
const VBanner$1 = "";
const makeVBannerActionsProps = propsFactory({
  color: String,
  density: String,
  ...makeComponentProps()
}, "VBannerActions");
const VBannerActions = genericComponent()({
  name: "VBannerActions",
  props: makeVBannerActionsProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    provideDefaults({
      VBtn: {
        color: props.color,
        density: props.density,
        slim: true,
        variant: "text"
      }
    });
    useRender(() => createVNode("div", {
      "class": ["v-banner-actions", props.class],
      "style": props.style
    }, [slots.default?.()]));
    return {};
  }
});
const VBannerText = createSimpleFunctional("v-banner-text");
const makeVBannerProps = propsFactory({
  avatar: String,
  bgColor: String,
  color: String,
  icon: IconValue,
  lines: String,
  stacked: Boolean,
  sticky: Boolean,
  text: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeDisplayProps(),
  ...makeElevationProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VBanner");
const VBanner = genericComponent()({
  name: "VBanner",
  props: makeVBannerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(props, "bgColor");
    const {
      borderClasses
    } = useBorder(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      themeClasses
    } = provideTheme(props);
    const color = toRef(props, "color");
    const density = toRef(props, "density");
    provideDefaults({
      VBannerActions: {
        color,
        density
      }
    });
    useRender(() => {
      const hasText = !!(props.text || slots.text);
      const hasPrependMedia = !!(props.avatar || props.icon);
      const hasPrepend = !!(hasPrependMedia || slots.prepend);
      return createVNode(props.tag, {
        "class": ["v-banner", {
          "v-banner--stacked": props.stacked || mobile.value,
          "v-banner--sticky": props.sticky,
          [`v-banner--${props.lines}-line`]: !!props.lines
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, densityClasses.value, displayClasses.value, elevationClasses.value, positionClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, dimensionStyles.value, locationStyles.value, props.style],
        "role": "banner"
      }, {
        default: () => [hasPrepend && createVNode("div", {
          "key": "prepend",
          "class": "v-banner__prepend"
        }, [!slots.prepend ? createVNode(VAvatar, {
          "key": "prepend-avatar",
          "color": color.value,
          "density": density.value,
          "icon": props.icon,
          "image": props.avatar
        }, null) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !hasPrependMedia,
          "defaults": {
            VAvatar: {
              color: color.value,
              density: density.value,
              icon: props.icon,
              image: props.avatar
            }
          }
        }, slots.prepend)]), createVNode("div", {
          "class": "v-banner__content"
        }, [hasText && createVNode(VBannerText, {
          "key": "text"
        }, {
          default: () => [slots.text?.() ?? props.text]
        }), slots.default?.()]), slots.actions && createVNode(VBannerActions, {
          "key": "actions"
        }, slots.actions)]
      });
    });
  }
});
const VBottomNavigation$1 = "";
const makeVBottomNavigationProps = propsFactory({
  bgColor: String,
  color: String,
  grow: Boolean,
  mode: {
    type: String,
    validator: (v) => !v || ["horizontal", "shift"].includes(v)
  },
  height: {
    type: [Number, String],
    default: 56
  },
  active: {
    type: Boolean,
    default: true
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeLayoutItemProps({
    name: "bottom-navigation"
  }),
  ...makeTagProps({
    tag: "header"
  }),
  ...makeGroupProps({
    modelValue: true,
    selectedClass: "v-btn--selected"
  }),
  ...makeThemeProps()
}, "VBottomNavigation");
const VBottomNavigation = genericComponent()({
  name: "VBottomNavigation",
  props: makeVBottomNavigationProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = useTheme();
    const {
      borderClasses
    } = useBorder(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "bgColor"));
    const {
      densityClasses
    } = useDensity(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      ssrBootStyles
    } = useSsrBoot();
    const height = computed(() => Number(props.height) - (props.density === "comfortable" ? 8 : 0) - (props.density === "compact" ? 16 : 0));
    const isActive = toRef(props, "active");
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: computed(() => "bottom"),
      layoutSize: computed(() => isActive.value ? height.value : 0),
      elementSize: height,
      active: isActive,
      absolute: toRef(props, "absolute")
    });
    useGroup(props, VBtnToggleSymbol);
    provideDefaults({
      VBtn: {
        color: toRef(props, "color"),
        density: toRef(props, "density"),
        stacked: computed(() => props.mode !== "horizontal"),
        variant: "text"
      }
    }, {
      scoped: true
    });
    useRender(() => {
      return createVNode(props.tag, {
        "class": ["v-bottom-navigation", {
          "v-bottom-navigation--active": isActive.value,
          "v-bottom-navigation--grow": props.grow,
          "v-bottom-navigation--shift": props.mode === "shift"
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, layoutItemStyles.value, {
          height: convertToUnit(height.value),
          transform: `translateY(${convertToUnit(!isActive.value ? 100 : 0, "%")})`
        }, ssrBootStyles.value, props.style]
      }, {
        default: () => [slots.default && createVNode("div", {
          "class": "v-bottom-navigation__content"
        }, [slots.default()])]
      });
    });
    return {};
  }
});
const VBottomSheet$1 = "";
const VDialog$1 = "";
const makeVDialogProps = propsFactory({
  fullscreen: Boolean,
  retainFocus: {
    type: Boolean,
    default: true
  },
  scrollable: Boolean,
  ...makeVOverlayProps({
    origin: "center center",
    scrollStrategy: "block",
    transition: {
      component: VDialogTransition
    },
    zIndex: 2400
  })
}, "VDialog");
const VDialog = genericComponent()({
  name: "VDialog",
  props: makeVDialogProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      scopeId
    } = useScopeId();
    const overlay = ref();
    function onFocusin(e) {
      const before = e.relatedTarget;
      const after = e.target;
      if (before !== after && overlay.value?.contentEl && // We're the topmost dialog
      overlay.value?.globalTop && // It isn't the document or the dialog body
      ![document, overlay.value.contentEl].includes(after) && // It isn't inside the dialog body
      !overlay.value.contentEl.contains(after)) {
        const focusable = focusableChildren(overlay.value.contentEl);
        if (!focusable.length)
          return;
        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];
        if (before === firstElement) {
          lastElement.focus();
        } else {
          firstElement.focus();
        }
      }
    }
    if (IN_BROWSER) {
      watch(() => isActive.value && props.retainFocus, (val) => {
        val ? document.addEventListener("focusin", onFocusin) : document.removeEventListener("focusin", onFocusin);
      }, {
        immediate: true
      });
    }
    watch(isActive, async (val) => {
      await nextTick();
      if (val) {
        overlay.value.contentEl?.focus({
          preventScroll: true
        });
      } else {
        overlay.value.activatorEl?.focus({
          preventScroll: true
        });
      }
    });
    const activatorProps = computed(() => mergeProps({
      "aria-haspopup": "dialog",
      "aria-expanded": String(isActive.value)
    }, props.activatorProps));
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      return createVNode(VOverlay, mergeProps({
        "ref": overlay,
        "class": ["v-dialog", {
          "v-dialog--fullscreen": props.fullscreen,
          "v-dialog--scrollable": props.scrollable
        }, props.class],
        "style": props.style
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "aria-modal": "true",
        "activatorProps": activatorProps.value,
        "role": "dialog"
      }, scopeId), {
        activator: slots.activator,
        default: function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return createVNode(VDefaultsProvider, {
            "root": "VDialog"
          }, {
            default: () => [slots.default?.(...args)]
          });
        }
      });
    });
    return forwardRefs({}, overlay);
  }
});
const makeVBottomSheetProps = propsFactory({
  inset: Boolean,
  ...makeVDialogProps({
    transition: "bottom-sheet-transition"
  })
}, "VBottomSheet");
const VBottomSheet = genericComponent()({
  name: "VBottomSheet",
  props: makeVBottomSheetProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    useRender(() => {
      const dialogProps = VDialog.filterProps(props);
      return createVNode(VDialog, mergeProps(dialogProps, {
        "contentClass": ["v-bottom-sheet__content", props.contentClass],
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "class": ["v-bottom-sheet", {
          "v-bottom-sheet--inset": props.inset
        }, props.class],
        "style": props.style
      }), slots);
    });
    return {};
  }
});
const VBreadcrumbs$1 = "";
const makeVBreadcrumbsDividerProps = propsFactory({
  divider: [Number, String],
  ...makeComponentProps()
}, "VBreadcrumbsDivider");
const VBreadcrumbsDivider = genericComponent()({
  name: "VBreadcrumbsDivider",
  props: makeVBreadcrumbsDividerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode("li", {
      "class": ["v-breadcrumbs-divider", props.class],
      "style": props.style
    }, [slots?.default?.() ?? props.divider]));
    return {};
  }
});
const makeVBreadcrumbsItemProps = propsFactory({
  active: Boolean,
  activeClass: String,
  activeColor: String,
  color: String,
  disabled: Boolean,
  title: String,
  ...makeComponentProps(),
  ...makeRouterProps(),
  ...makeTagProps({
    tag: "li"
  })
}, "VBreadcrumbsItem");
const VBreadcrumbsItem = genericComponent()({
  name: "VBreadcrumbsItem",
  props: makeVBreadcrumbsItemProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const link = useLink(props, attrs);
    const isActive = computed(() => props.active || link.isActive?.value);
    const color = computed(() => isActive.value ? props.activeColor : props.color);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(color);
    useRender(() => {
      return createVNode(props.tag, {
        "class": ["v-breadcrumbs-item", {
          "v-breadcrumbs-item--active": isActive.value,
          "v-breadcrumbs-item--disabled": props.disabled,
          [`${props.activeClass}`]: isActive.value && props.activeClass
        }, textColorClasses.value, props.class],
        "style": [textColorStyles.value, props.style],
        "aria-current": isActive.value ? "page" : void 0
      }, {
        default: () => [!link.isLink.value ? slots.default?.() ?? props.title : createVNode("a", {
          "class": "v-breadcrumbs-item--link",
          "href": link.href.value,
          "aria-current": isActive.value ? "page" : void 0,
          "onClick": link.navigate
        }, [slots.default?.() ?? props.title])]
      });
    });
    return {};
  }
});
const makeVBreadcrumbsProps = propsFactory({
  activeClass: String,
  activeColor: String,
  bgColor: String,
  color: String,
  disabled: Boolean,
  divider: {
    type: String,
    default: "/"
  },
  icon: IconValue,
  items: {
    type: Array,
    default: () => []
  },
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "ul"
  })
}, "VBreadcrumbs");
const VBreadcrumbs = genericComponent()({
  name: "VBreadcrumbs",
  props: makeVBreadcrumbsProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "bgColor"));
    const {
      densityClasses
    } = useDensity(props);
    const {
      roundedClasses
    } = useRounded(props);
    provideDefaults({
      VBreadcrumbsDivider: {
        divider: toRef(props, "divider")
      },
      VBreadcrumbsItem: {
        activeClass: toRef(props, "activeClass"),
        activeColor: toRef(props, "activeColor"),
        color: toRef(props, "color"),
        disabled: toRef(props, "disabled")
      }
    });
    const items = computed(() => props.items.map((item) => {
      return typeof item === "string" ? {
        item: {
          title: item
        },
        raw: item
      } : {
        item,
        raw: item
      };
    }));
    useRender(() => {
      const hasPrepend = !!(slots.prepend || props.icon);
      return createVNode(props.tag, {
        "class": ["v-breadcrumbs", backgroundColorClasses.value, densityClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, props.style]
      }, {
        default: () => [hasPrepend && createVNode("li", {
          "key": "prepend",
          "class": "v-breadcrumbs__prepend"
        }, [!slots.prepend ? createVNode(VIcon, {
          "key": "prepend-icon",
          "start": true,
          "icon": props.icon
        }, null) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !props.icon,
          "defaults": {
            VIcon: {
              icon: props.icon,
              start: true
            }
          }
        }, slots.prepend)]), items.value.map((_ref2, index, array) => {
          let {
            item,
            raw
          } = _ref2;
          return createVNode(Fragment, null, [slots.item?.({
            item,
            index
          }) ?? createVNode(VBreadcrumbsItem, mergeProps({
            "key": index,
            "disabled": index >= array.length - 1
          }, typeof item === "string" ? {
            title: item
          } : item), {
            default: slots.title ? () => slots.title?.({
              item,
              index
            }) : void 0
          }), index < array.length - 1 && createVNode(VBreadcrumbsDivider, null, {
            default: slots.divider ? () => slots.divider?.({
              item: raw,
              index
            }) : void 0
          })]);
        }), slots.default?.()]
      });
    });
    return {};
  }
});
const VCard$1 = "";
const VCardActions = genericComponent()({
  name: "VCardActions",
  props: makeComponentProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    provideDefaults({
      VBtn: {
        slim: true,
        variant: "text"
      }
    });
    useRender(() => createVNode("div", {
      "class": ["v-card-actions", props.class],
      "style": props.style
    }, [slots.default?.()]));
    return {};
  }
});
const VCardSubtitle = createSimpleFunctional("v-card-subtitle");
const VCardTitle = createSimpleFunctional("v-card-title");
const makeCardItemProps = propsFactory({
  appendAvatar: String,
  appendIcon: IconValue,
  prependAvatar: String,
  prependIcon: IconValue,
  subtitle: [String, Number],
  title: [String, Number],
  ...makeComponentProps(),
  ...makeDensityProps()
}, "VCardItem");
const VCardItem = genericComponent()({
  name: "VCardItem",
  props: makeCardItemProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => {
      const hasPrependMedia = !!(props.prependAvatar || props.prependIcon);
      const hasPrepend = !!(hasPrependMedia || slots.prepend);
      const hasAppendMedia = !!(props.appendAvatar || props.appendIcon);
      const hasAppend = !!(hasAppendMedia || slots.append);
      const hasTitle = !!(props.title != null || slots.title);
      const hasSubtitle = !!(props.subtitle != null || slots.subtitle);
      return createVNode("div", {
        "class": ["v-card-item", props.class],
        "style": props.style
      }, [hasPrepend && createVNode("div", {
        "key": "prepend",
        "class": "v-card-item__prepend"
      }, [!slots.prepend ? hasPrependMedia && createVNode(VAvatar, {
        "key": "prepend-avatar",
        "density": props.density,
        "icon": props.prependIcon,
        "image": props.prependAvatar
      }, null) : createVNode(VDefaultsProvider, {
        "key": "prepend-defaults",
        "disabled": !hasPrependMedia,
        "defaults": {
          VAvatar: {
            density: props.density,
            icon: props.prependIcon,
            image: props.prependAvatar
          }
        }
      }, slots.prepend)]), createVNode("div", {
        "class": "v-card-item__content"
      }, [hasTitle && createVNode(VCardTitle, {
        "key": "title"
      }, {
        default: () => [slots.title?.() ?? props.title]
      }), hasSubtitle && createVNode(VCardSubtitle, {
        "key": "subtitle"
      }, {
        default: () => [slots.subtitle?.() ?? props.subtitle]
      }), slots.default?.()]), hasAppend && createVNode("div", {
        "key": "append",
        "class": "v-card-item__append"
      }, [!slots.append ? hasAppendMedia && createVNode(VAvatar, {
        "key": "append-avatar",
        "density": props.density,
        "icon": props.appendIcon,
        "image": props.appendAvatar
      }, null) : createVNode(VDefaultsProvider, {
        "key": "append-defaults",
        "disabled": !hasAppendMedia,
        "defaults": {
          VAvatar: {
            density: props.density,
            icon: props.appendIcon,
            image: props.appendAvatar
          }
        }
      }, slots.append)])]);
    });
    return {};
  }
});
const VCardText = createSimpleFunctional("v-card-text");
const makeVCardProps = propsFactory({
  appendAvatar: String,
  appendIcon: IconValue,
  disabled: Boolean,
  flat: Boolean,
  hover: Boolean,
  image: String,
  link: {
    type: Boolean,
    default: void 0
  },
  prependAvatar: String,
  prependIcon: IconValue,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  subtitle: [String, Number],
  text: [String, Number],
  title: [String, Number],
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeLoaderProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "elevated"
  })
}, "VCard");
const VCard = genericComponent()({
  name: "VCard",
  directives: {
    Ripple
  },
  props: makeVCardProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      loaderClasses
    } = useLoader(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const link = useLink(props, attrs);
    const isLink = computed(() => props.link !== false && link.isLink.value);
    const isClickable = computed(() => !props.disabled && props.link !== false && (props.link || link.isClickable.value));
    useRender(() => {
      const Tag = isLink.value ? "a" : props.tag;
      const hasTitle = !!(slots.title || props.title != null);
      const hasSubtitle = !!(slots.subtitle || props.subtitle != null);
      const hasHeader = hasTitle || hasSubtitle;
      const hasAppend = !!(slots.append || props.appendAvatar || props.appendIcon);
      const hasPrepend = !!(slots.prepend || props.prependAvatar || props.prependIcon);
      const hasImage = !!(slots.image || props.image);
      const hasCardItem = hasHeader || hasPrepend || hasAppend;
      const hasText = !!(slots.text || props.text != null);
      return withDirectives(createVNode(Tag, {
        "class": ["v-card", {
          "v-card--disabled": props.disabled,
          "v-card--flat": props.flat,
          "v-card--hover": props.hover && !(props.disabled || props.flat),
          "v-card--link": isClickable.value
        }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, loaderClasses.value, positionClasses.value, roundedClasses.value, variantClasses.value, props.class],
        "style": [colorStyles.value, dimensionStyles.value, locationStyles.value, props.style],
        "href": link.href.value,
        "onClick": isClickable.value && link.navigate,
        "tabindex": props.disabled ? -1 : void 0
      }, {
        default: () => [hasImage && createVNode("div", {
          "key": "image",
          "class": "v-card__image"
        }, [!slots.image ? createVNode(VImg, {
          "key": "image-img",
          "cover": true,
          "src": props.image
        }, null) : createVNode(VDefaultsProvider, {
          "key": "image-defaults",
          "disabled": !props.image,
          "defaults": {
            VImg: {
              cover: true,
              src: props.image
            }
          }
        }, slots.image)]), createVNode(LoaderSlot, {
          "name": "v-card",
          "active": !!props.loading,
          "color": typeof props.loading === "boolean" ? void 0 : props.loading
        }, {
          default: slots.loader
        }), hasCardItem && createVNode(VCardItem, {
          "key": "item",
          "prependAvatar": props.prependAvatar,
          "prependIcon": props.prependIcon,
          "title": props.title,
          "subtitle": props.subtitle,
          "appendAvatar": props.appendAvatar,
          "appendIcon": props.appendIcon
        }, {
          default: slots.item,
          prepend: slots.prepend,
          title: slots.title,
          subtitle: slots.subtitle,
          append: slots.append
        }), hasText && createVNode(VCardText, {
          "key": "text"
        }, {
          default: () => [slots.text?.() ?? props.text]
        }), slots.default?.(), slots.actions && createVNode(VCardActions, null, {
          default: slots.actions
        }), genOverlays(isClickable.value, "v-card")]
      }), [[resolveDirective("ripple"), isClickable.value && props.ripple]]);
    });
    return {};
  }
});
const VCarousel$1 = "";
const VWindow$1 = "";
const handleGesture = (wrapper) => {
  const {
    touchstartX,
    touchendX,
    touchstartY,
    touchendY
  } = wrapper;
  const dirRatio = 0.5;
  const minDistance = 16;
  wrapper.offsetX = touchendX - touchstartX;
  wrapper.offsetY = touchendY - touchstartY;
  if (Math.abs(wrapper.offsetY) < dirRatio * Math.abs(wrapper.offsetX)) {
    wrapper.left && touchendX < touchstartX - minDistance && wrapper.left(wrapper);
    wrapper.right && touchendX > touchstartX + minDistance && wrapper.right(wrapper);
  }
  if (Math.abs(wrapper.offsetX) < dirRatio * Math.abs(wrapper.offsetY)) {
    wrapper.up && touchendY < touchstartY - minDistance && wrapper.up(wrapper);
    wrapper.down && touchendY > touchstartY + minDistance && wrapper.down(wrapper);
  }
};
function touchstart(event, wrapper) {
  const touch = event.changedTouches[0];
  wrapper.touchstartX = touch.clientX;
  wrapper.touchstartY = touch.clientY;
  wrapper.start?.({
    originalEvent: event,
    ...wrapper
  });
}
function touchend(event, wrapper) {
  const touch = event.changedTouches[0];
  wrapper.touchendX = touch.clientX;
  wrapper.touchendY = touch.clientY;
  wrapper.end?.({
    originalEvent: event,
    ...wrapper
  });
  handleGesture(wrapper);
}
function touchmove(event, wrapper) {
  const touch = event.changedTouches[0];
  wrapper.touchmoveX = touch.clientX;
  wrapper.touchmoveY = touch.clientY;
  wrapper.move?.({
    originalEvent: event,
    ...wrapper
  });
}
function createHandlers() {
  let value = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  const wrapper = {
    touchstartX: 0,
    touchstartY: 0,
    touchendX: 0,
    touchendY: 0,
    touchmoveX: 0,
    touchmoveY: 0,
    offsetX: 0,
    offsetY: 0,
    left: value.left,
    right: value.right,
    up: value.up,
    down: value.down,
    start: value.start,
    move: value.move,
    end: value.end
  };
  return {
    touchstart: (e) => touchstart(e, wrapper),
    touchend: (e) => touchend(e, wrapper),
    touchmove: (e) => touchmove(e, wrapper)
  };
}
function mounted$3(el, binding) {
  const value = binding.value;
  const target = value?.parent ? el.parentElement : el;
  const options = value?.options ?? {
    passive: true
  };
  const uid2 = binding.instance?.$.uid;
  if (!target || !uid2)
    return;
  const handlers2 = createHandlers(binding.value);
  target._touchHandlers = target._touchHandlers ?? /* @__PURE__ */ Object.create(null);
  target._touchHandlers[uid2] = handlers2;
  keys(handlers2).forEach((eventName2) => {
    target.addEventListener(eventName2, handlers2[eventName2], options);
  });
}
function unmounted$3(el, binding) {
  const target = binding.value?.parent ? el.parentElement : el;
  const uid2 = binding.instance?.$.uid;
  if (!target?._touchHandlers || !uid2)
    return;
  const handlers2 = target._touchHandlers[uid2];
  keys(handlers2).forEach((eventName2) => {
    target.removeEventListener(eventName2, handlers2[eventName2]);
  });
  delete target._touchHandlers[uid2];
}
const Touch = {
  mounted: mounted$3,
  unmounted: unmounted$3
};
const VWindowSymbol = Symbol.for("vuetify:v-window");
const VWindowGroupSymbol = Symbol.for("vuetify:v-window-group");
const makeVWindowProps = propsFactory({
  continuous: Boolean,
  nextIcon: {
    type: [Boolean, String, Function, Object],
    default: "$next"
  },
  prevIcon: {
    type: [Boolean, String, Function, Object],
    default: "$prev"
  },
  reverse: Boolean,
  showArrows: {
    type: [Boolean, String],
    validator: (v) => typeof v === "boolean" || v === "hover"
  },
  touch: {
    type: [Object, Boolean],
    default: void 0
  },
  direction: {
    type: String,
    default: "horizontal"
  },
  modelValue: null,
  disabled: Boolean,
  selectedClass: {
    type: String,
    default: "v-window-item--active"
  },
  // TODO: mandatory should probably not be exposed but do this for now
  mandatory: {
    type: [Boolean, String],
    default: "force"
  },
  ...makeComponentProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VWindow");
const VWindow = genericComponent()({
  name: "VWindow",
  directives: {
    Touch
  },
  props: makeVWindowProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      isRtl
    } = useRtl();
    const {
      t
    } = useLocale();
    const group = useGroup(props, VWindowGroupSymbol);
    const rootRef = ref();
    const isRtlReverse = computed(() => isRtl.value ? !props.reverse : props.reverse);
    const isReversed = shallowRef(false);
    const transition = computed(() => {
      const axis = props.direction === "vertical" ? "y" : "x";
      const reverse = isRtlReverse.value ? !isReversed.value : isReversed.value;
      const direction = reverse ? "-reverse" : "";
      return `v-window-${axis}${direction}-transition`;
    });
    const transitionCount = shallowRef(0);
    const transitionHeight = ref(void 0);
    const activeIndex = computed(() => {
      return group.items.value.findIndex((item) => group.selected.value.includes(item.id));
    });
    watch(activeIndex, (newVal, oldVal) => {
      const itemsLength = group.items.value.length;
      const lastIndex = itemsLength - 1;
      if (itemsLength <= 2) {
        isReversed.value = newVal < oldVal;
      } else if (newVal === lastIndex && oldVal === 0) {
        isReversed.value = true;
      } else if (newVal === 0 && oldVal === lastIndex) {
        isReversed.value = false;
      } else {
        isReversed.value = newVal < oldVal;
      }
    });
    provide(VWindowSymbol, {
      transition,
      isReversed,
      transitionCount,
      transitionHeight,
      rootRef
    });
    const canMoveBack = computed(() => props.continuous || activeIndex.value !== 0);
    const canMoveForward = computed(() => props.continuous || activeIndex.value !== group.items.value.length - 1);
    function prev() {
      canMoveBack.value && group.prev();
    }
    function next() {
      canMoveForward.value && group.next();
    }
    const arrows = computed(() => {
      const arrows2 = [];
      const prevProps = {
        icon: isRtl.value ? props.nextIcon : props.prevIcon,
        class: `v-window__${isRtlReverse.value ? "right" : "left"}`,
        onClick: group.prev,
        ariaLabel: t("$vuetify.carousel.prev")
      };
      arrows2.push(canMoveBack.value ? slots.prev ? slots.prev({
        props: prevProps
      }) : createVNode(VBtn, prevProps, null) : createVNode("div", null, null));
      const nextProps = {
        icon: isRtl.value ? props.prevIcon : props.nextIcon,
        class: `v-window__${isRtlReverse.value ? "left" : "right"}`,
        onClick: group.next,
        ariaLabel: t("$vuetify.carousel.next")
      };
      arrows2.push(canMoveForward.value ? slots.next ? slots.next({
        props: nextProps
      }) : createVNode(VBtn, nextProps, null) : createVNode("div", null, null));
      return arrows2;
    });
    const touchOptions = computed(() => {
      if (props.touch === false)
        return props.touch;
      const options = {
        left: () => {
          isRtlReverse.value ? prev() : next();
        },
        right: () => {
          isRtlReverse.value ? next() : prev();
        },
        start: (_ref2) => {
          let {
            originalEvent
          } = _ref2;
          originalEvent.stopPropagation();
        }
      };
      return {
        ...options,
        ...props.touch === true ? {} : props.touch
      };
    });
    useRender(() => withDirectives(createVNode(props.tag, {
      "ref": rootRef,
      "class": ["v-window", {
        "v-window--show-arrows-on-hover": props.showArrows === "hover"
      }, themeClasses.value, props.class],
      "style": props.style
    }, {
      default: () => [createVNode("div", {
        "class": "v-window__container",
        "style": {
          height: transitionHeight.value
        }
      }, [slots.default?.({
        group
      }), props.showArrows !== false && createVNode("div", {
        "class": "v-window__controls"
      }, [arrows.value])]), slots.additional?.({
        group
      })]
    }), [[resolveDirective("touch"), touchOptions.value]]));
    return {
      group
    };
  }
});
const makeVCarouselProps = propsFactory({
  color: String,
  cycle: Boolean,
  delimiterIcon: {
    type: IconValue,
    default: "$delimiter"
  },
  height: {
    type: [Number, String],
    default: 500
  },
  hideDelimiters: Boolean,
  hideDelimiterBackground: Boolean,
  interval: {
    type: [Number, String],
    default: 6e3,
    validator: (value) => Number(value) > 0
  },
  progress: [Boolean, String],
  verticalDelimiters: [Boolean, String],
  ...makeVWindowProps({
    continuous: true,
    mandatory: "force",
    showArrows: true
  })
}, "VCarousel");
const VCarousel = genericComponent()({
  name: "VCarousel",
  props: makeVCarouselProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const {
      t
    } = useLocale();
    const windowRef = ref();
    let slideTimeout = -1;
    watch(model, restartTimeout);
    watch(() => props.interval, restartTimeout);
    watch(() => props.cycle, (val) => {
      if (val)
        restartTimeout();
      else
        window.clearTimeout(slideTimeout);
    });
    onMounted(startTimeout);
    function startTimeout() {
      if (!props.cycle || !windowRef.value)
        return;
      slideTimeout = window.setTimeout(windowRef.value.group.next, +props.interval > 0 ? +props.interval : 6e3);
    }
    function restartTimeout() {
      window.clearTimeout(slideTimeout);
      window.requestAnimationFrame(startTimeout);
    }
    useRender(() => {
      const windowProps = VWindow.filterProps(props);
      return createVNode(VWindow, mergeProps({
        "ref": windowRef
      }, windowProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": ["v-carousel", {
          "v-carousel--hide-delimiter-background": props.hideDelimiterBackground,
          "v-carousel--vertical-delimiters": props.verticalDelimiters
        }, props.class],
        "style": [{
          height: convertToUnit(props.height)
        }, props.style]
      }), {
        default: slots.default,
        additional: (_ref2) => {
          let {
            group
          } = _ref2;
          return createVNode(Fragment, null, [!props.hideDelimiters && createVNode("div", {
            "class": "v-carousel__controls",
            "style": {
              left: props.verticalDelimiters === "left" && props.verticalDelimiters ? 0 : "auto",
              right: props.verticalDelimiters === "right" ? 0 : "auto"
            }
          }, [group.items.value.length > 0 && createVNode(VDefaultsProvider, {
            "defaults": {
              VBtn: {
                color: props.color,
                icon: props.delimiterIcon,
                size: "x-small",
                variant: "text"
              }
            },
            "scoped": true
          }, {
            default: () => [group.items.value.map((item, index) => {
              const props2 = {
                id: `carousel-item-${item.id}`,
                "aria-label": t("$vuetify.carousel.ariaLabel.delimiter", index + 1, group.items.value.length),
                class: ["v-carousel__controls__item", group.isSelected(item.id) && "v-btn--active"],
                onClick: () => group.select(item.id, true)
              };
              return slots.item ? slots.item({
                props: props2,
                item
              }) : createVNode(VBtn, mergeProps(item, props2), null);
            })]
          })]), props.progress && createVNode(VProgressLinear, {
            "class": "v-carousel__progress",
            "color": typeof props.progress === "string" ? props.progress : void 0,
            "modelValue": (group.getItemIndex(model.value) + 1) / group.items.value.length * 100
          }, null)]);
        },
        prev: slots.prev,
        next: slots.next
      });
    });
    return {};
  }
});
const makeVWindowItemProps = propsFactory({
  reverseTransition: {
    type: [Boolean, String],
    default: void 0
  },
  transition: {
    type: [Boolean, String],
    default: void 0
  },
  ...makeComponentProps(),
  ...makeGroupItemProps(),
  ...makeLazyProps()
}, "VWindowItem");
const VWindowItem = genericComponent()({
  name: "VWindowItem",
  directives: {
    Touch
  },
  props: makeVWindowItemProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const window2 = inject$1(VWindowSymbol);
    const groupItem = useGroupItem(props, VWindowGroupSymbol);
    const {
      isBooted
    } = useSsrBoot();
    if (!window2 || !groupItem)
      throw new Error("[Vuetify] VWindowItem must be used inside VWindow");
    const isTransitioning = shallowRef(false);
    const hasTransition = computed(() => isBooted.value && (window2.isReversed.value ? props.reverseTransition !== false : props.transition !== false));
    function onAfterTransition() {
      if (!isTransitioning.value || !window2) {
        return;
      }
      isTransitioning.value = false;
      if (window2.transitionCount.value > 0) {
        window2.transitionCount.value -= 1;
        if (window2.transitionCount.value === 0) {
          window2.transitionHeight.value = void 0;
        }
      }
    }
    function onBeforeTransition() {
      if (isTransitioning.value || !window2) {
        return;
      }
      isTransitioning.value = true;
      if (window2.transitionCount.value === 0) {
        window2.transitionHeight.value = convertToUnit(window2.rootRef.value?.clientHeight);
      }
      window2.transitionCount.value += 1;
    }
    function onTransitionCancelled() {
      onAfterTransition();
    }
    function onEnterTransition(el) {
      if (!isTransitioning.value) {
        return;
      }
      nextTick(() => {
        if (!hasTransition.value || !isTransitioning.value || !window2) {
          return;
        }
        window2.transitionHeight.value = convertToUnit(el.clientHeight);
      });
    }
    const transition = computed(() => {
      const name = window2.isReversed.value ? props.reverseTransition : props.transition;
      return !hasTransition.value ? false : {
        name: typeof name !== "string" ? window2.transition.value : name,
        onBeforeEnter: onBeforeTransition,
        onAfterEnter: onAfterTransition,
        onEnterCancelled: onTransitionCancelled,
        onBeforeLeave: onBeforeTransition,
        onAfterLeave: onAfterTransition,
        onLeaveCancelled: onTransitionCancelled,
        onEnter: onEnterTransition
      };
    });
    const {
      hasContent
    } = useLazy(props, groupItem.isSelected);
    useRender(() => createVNode(MaybeTransition, {
      "transition": transition.value,
      "disabled": !isBooted.value
    }, {
      default: () => [withDirectives(createVNode("div", {
        "class": ["v-window-item", groupItem.selectedClass.value, props.class],
        "style": props.style
      }, [hasContent.value && slots.default?.()]), [[vShow, groupItem.isSelected.value]])]
    }));
    return {
      groupItem
    };
  }
});
const makeVCarouselItemProps = propsFactory({
  ...makeVImgProps(),
  ...makeVWindowItemProps()
}, "VCarouselItem");
const VCarouselItem = genericComponent()({
  name: "VCarouselItem",
  inheritAttrs: false,
  props: makeVCarouselItemProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    useRender(() => {
      const imgProps = VImg.filterProps(props);
      const windowItemProps = VWindowItem.filterProps(props);
      return createVNode(VWindowItem, mergeProps({
        "class": "v-carousel-item"
      }, windowItemProps), {
        default: () => [createVNode(VImg, mergeProps(attrs, imgProps), slots)]
      });
    });
  }
});
const VCode$1 = "";
const VCode = createSimpleFunctional("v-code");
const VColorPicker$1 = "";
const VColorPickerCanvas$1 = "";
const makeVColorPickerCanvasProps = propsFactory({
  color: {
    type: Object
  },
  disabled: Boolean,
  dotSize: {
    type: [Number, String],
    default: 10
  },
  height: {
    type: [Number, String],
    default: 150
  },
  width: {
    type: [Number, String],
    default: 300
  },
  ...makeComponentProps()
}, "VColorPickerCanvas");
const VColorPickerCanvas = defineComponent({
  name: "VColorPickerCanvas",
  props: makeVColorPickerCanvasProps(),
  emits: {
    "update:color": (color) => true,
    "update:position": (hue) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2
    } = _ref;
    const isInteracting = shallowRef(false);
    const canvasRef = ref();
    const canvasWidth = shallowRef(parseFloat(props.width));
    const canvasHeight = shallowRef(parseFloat(props.height));
    const _dotPosition = ref({
      x: 0,
      y: 0
    });
    const dotPosition = computed({
      get: () => _dotPosition.value,
      set(val) {
        if (!canvasRef.value)
          return;
        const {
          x,
          y
        } = val;
        _dotPosition.value = val;
        emit2("update:color", {
          h: props.color?.h ?? 0,
          s: clamp(x, 0, canvasWidth.value) / canvasWidth.value,
          v: 1 - clamp(y, 0, canvasHeight.value) / canvasHeight.value,
          a: props.color?.a ?? 1
        });
      }
    });
    const dotStyles = computed(() => {
      const {
        x,
        y
      } = dotPosition.value;
      const radius = parseInt(props.dotSize, 10) / 2;
      return {
        width: convertToUnit(props.dotSize),
        height: convertToUnit(props.dotSize),
        transform: `translate(${convertToUnit(x - radius)}, ${convertToUnit(y - radius)})`
      };
    });
    const {
      resizeRef
    } = useResizeObserver((entries) => {
      if (!resizeRef.value?.offsetParent)
        return;
      const {
        width,
        height
      } = entries[0].contentRect;
      canvasWidth.value = width;
      canvasHeight.value = height;
    });
    function updateDotPosition(x, y, rect) {
      const {
        left,
        top,
        width,
        height
      } = rect;
      dotPosition.value = {
        x: clamp(x - left, 0, width),
        y: clamp(y - top, 0, height)
      };
    }
    function handleMouseDown(e) {
      if (e.type === "mousedown") {
        e.preventDefault();
      }
      if (props.disabled)
        return;
      handleMouseMove(e);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("touchend", handleMouseUp);
    }
    function handleMouseMove(e) {
      if (props.disabled || !canvasRef.value)
        return;
      isInteracting.value = true;
      const coords = getEventCoordinates(e);
      updateDotPosition(coords.clientX, coords.clientY, canvasRef.value.getBoundingClientRect());
    }
    function handleMouseUp() {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
    }
    function updateCanvas() {
      if (!canvasRef.value)
        return;
      const canvas = canvasRef.value;
      const ctx = canvas.getContext("2d");
      if (!ctx)
        return;
      const saturationGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      saturationGradient.addColorStop(0, "hsla(0, 0%, 100%, 1)");
      saturationGradient.addColorStop(1, `hsla(${props.color?.h ?? 0}, 100%, 50%, 1)`);
      ctx.fillStyle = saturationGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const valueGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      valueGradient.addColorStop(0, "hsla(0, 0%, 100%, 0)");
      valueGradient.addColorStop(1, "hsla(0, 0%, 0%, 1)");
      ctx.fillStyle = valueGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    watch(() => props.color?.h, updateCanvas, {
      immediate: true
    });
    watch(() => [canvasWidth.value, canvasHeight.value], (newVal, oldVal) => {
      updateCanvas();
      _dotPosition.value = {
        x: dotPosition.value.x * newVal[0] / oldVal[0],
        y: dotPosition.value.y * newVal[1] / oldVal[1]
      };
    }, {
      flush: "post"
    });
    watch(() => props.color, () => {
      if (isInteracting.value) {
        isInteracting.value = false;
        return;
      }
      _dotPosition.value = props.color ? {
        x: props.color.s * canvasWidth.value,
        y: (1 - props.color.v) * canvasHeight.value
      } : {
        x: 0,
        y: 0
      };
    }, {
      deep: true,
      immediate: true
    });
    onMounted(() => updateCanvas());
    useRender(() => createVNode("div", {
      "ref": resizeRef,
      "class": ["v-color-picker-canvas", props.class],
      "style": props.style,
      "onMousedown": handleMouseDown,
      "onTouchstartPassive": handleMouseDown
    }, [createVNode("canvas", {
      "ref": canvasRef,
      "width": canvasWidth.value,
      "height": canvasHeight.value
    }, null), props.color && createVNode("div", {
      "class": ["v-color-picker-canvas__dot", {
        "v-color-picker-canvas__dot--disabled": props.disabled
      }],
      "style": dotStyles.value
    }, null)]));
    return {};
  }
});
const VColorPickerEdit$1 = "";
function stripAlpha(color, stripAlpha2) {
  if (stripAlpha2) {
    const {
      a,
      ...rest
    } = color;
    return rest;
  }
  return color;
}
function extractColor(color, input) {
  if (input == null || typeof input === "string") {
    const hex2 = HSVtoHex(color);
    if (color.a === 1)
      return hex2.slice(0, 7);
    else
      return hex2;
  }
  if (typeof input === "object") {
    let converted;
    if (has(input, ["r", "g", "b"]))
      converted = HSVtoRGB(color);
    else if (has(input, ["h", "s", "l"]))
      converted = HSVtoHSL(color);
    else if (has(input, ["h", "s", "v"]))
      converted = color;
    return stripAlpha(converted, !has(input, ["a"]) && color.a === 1);
  }
  return color;
}
const nullColor = {
  h: 0,
  s: 0,
  v: 1,
  a: 1
};
const rgba = {
  inputProps: {
    type: "number",
    min: 0
  },
  inputs: [{
    label: "R",
    max: 255,
    step: 1,
    getValue: (c) => Math.round(c.r),
    getColor: (c, v) => ({
      ...c,
      r: Number(v)
    })
  }, {
    label: "G",
    max: 255,
    step: 1,
    getValue: (c) => Math.round(c.g),
    getColor: (c, v) => ({
      ...c,
      g: Number(v)
    })
  }, {
    label: "B",
    max: 255,
    step: 1,
    getValue: (c) => Math.round(c.b),
    getColor: (c, v) => ({
      ...c,
      b: Number(v)
    })
  }, {
    label: "A",
    max: 1,
    step: 0.01,
    getValue: (_ref) => {
      let {
        a
      } = _ref;
      return a != null ? Math.round(a * 100) / 100 : 1;
    },
    getColor: (c, v) => ({
      ...c,
      a: Number(v)
    })
  }],
  to: HSVtoRGB,
  from: RGBtoHSV
};
const rgb = {
  ...rgba,
  inputs: rgba.inputs?.slice(0, 3)
};
const hsla = {
  inputProps: {
    type: "number",
    min: 0
  },
  inputs: [{
    label: "H",
    max: 360,
    step: 1,
    getValue: (c) => Math.round(c.h),
    getColor: (c, v) => ({
      ...c,
      h: Number(v)
    })
  }, {
    label: "S",
    max: 1,
    step: 0.01,
    getValue: (c) => Math.round(c.s * 100) / 100,
    getColor: (c, v) => ({
      ...c,
      s: Number(v)
    })
  }, {
    label: "L",
    max: 1,
    step: 0.01,
    getValue: (c) => Math.round(c.l * 100) / 100,
    getColor: (c, v) => ({
      ...c,
      l: Number(v)
    })
  }, {
    label: "A",
    max: 1,
    step: 0.01,
    getValue: (_ref2) => {
      let {
        a
      } = _ref2;
      return a != null ? Math.round(a * 100) / 100 : 1;
    },
    getColor: (c, v) => ({
      ...c,
      a: Number(v)
    })
  }],
  to: HSVtoHSL,
  from: HSLtoHSV
};
const hsl = {
  ...hsla,
  inputs: hsla.inputs.slice(0, 3)
};
const hexa = {
  inputProps: {
    type: "text"
  },
  inputs: [{
    label: "HEXA",
    getValue: (c) => c,
    getColor: (c, v) => v
  }],
  to: HSVtoHex,
  from: HexToHSV
};
const hex = {
  ...hexa,
  inputs: [{
    label: "HEX",
    getValue: (c) => c.slice(0, 7),
    getColor: (c, v) => v
  }]
};
const modes = {
  rgb,
  rgba,
  hsl,
  hsla,
  hex,
  hexa
};
const VColorPickerInput = (_ref) => {
  let {
    label,
    ...rest
  } = _ref;
  return createVNode("div", {
    "class": "v-color-picker-edit__input"
  }, [createVNode("input", rest, null), createVNode("span", null, [label])]);
};
const makeVColorPickerEditProps = propsFactory({
  color: Object,
  disabled: Boolean,
  mode: {
    type: String,
    default: "rgba",
    validator: (v) => Object.keys(modes).includes(v)
  },
  modes: {
    type: Array,
    default: () => Object.keys(modes),
    validator: (v) => Array.isArray(v) && v.every((m) => Object.keys(modes).includes(m))
  },
  ...makeComponentProps()
}, "VColorPickerEdit");
const VColorPickerEdit = defineComponent({
  name: "VColorPickerEdit",
  props: makeVColorPickerEditProps(),
  emits: {
    "update:color": (color) => true,
    "update:mode": (mode) => true
  },
  setup(props, _ref2) {
    let {
      emit: emit2
    } = _ref2;
    const enabledModes = computed(() => {
      return props.modes.map((key) => ({
        ...modes[key],
        name: key
      }));
    });
    const inputs = computed(() => {
      const mode = enabledModes.value.find((m) => m.name === props.mode);
      if (!mode)
        return [];
      const color = props.color ? mode.to(props.color) : null;
      return mode.inputs?.map((_ref3) => {
        let {
          getValue,
          getColor,
          ...inputProps
        } = _ref3;
        return {
          ...mode.inputProps,
          ...inputProps,
          disabled: props.disabled,
          value: color && getValue(color),
          onChange: (e) => {
            const target = e.target;
            if (!target)
              return;
            emit2("update:color", mode.from(getColor(color ?? nullColor, target.value)));
          }
        };
      });
    });
    useRender(() => createVNode("div", {
      "class": ["v-color-picker-edit", props.class],
      "style": props.style
    }, [inputs.value?.map((props2) => createVNode(VColorPickerInput, props2, null)), enabledModes.value.length > 1 && createVNode(VBtn, {
      "icon": "$unfold",
      "size": "x-small",
      "variant": "plain",
      "onClick": () => {
        const mi = enabledModes.value.findIndex((m) => m.name === props.mode);
        emit2("update:mode", enabledModes.value[(mi + 1) % enabledModes.value.length].name);
      }
    }, null)]));
    return {};
  }
});
const VColorPickerPreview$1 = "";
const VSlider$1 = "";
const VSliderThumb$1 = "";
const VSliderSymbol = Symbol.for("vuetify:v-slider");
function getOffset(e, el, direction) {
  const vertical = direction === "vertical";
  const rect = el.getBoundingClientRect();
  const touch = "touches" in e ? e.touches[0] : e;
  return vertical ? touch.clientY - (rect.top + rect.height / 2) : touch.clientX - (rect.left + rect.width / 2);
}
function getPosition(e, position) {
  if ("touches" in e && e.touches.length)
    return e.touches[0][position];
  else if ("changedTouches" in e && e.changedTouches.length)
    return e.changedTouches[0][position];
  else
    return e[position];
}
const makeSliderProps = propsFactory({
  disabled: {
    type: Boolean,
    default: null
  },
  error: Boolean,
  readonly: {
    type: Boolean,
    default: null
  },
  max: {
    type: [Number, String],
    default: 100
  },
  min: {
    type: [Number, String],
    default: 0
  },
  step: {
    type: [Number, String],
    default: 0
  },
  thumbColor: String,
  thumbLabel: {
    type: [Boolean, String],
    default: void 0,
    validator: (v) => typeof v === "boolean" || v === "always"
  },
  thumbSize: {
    type: [Number, String],
    default: 20
  },
  showTicks: {
    type: [Boolean, String],
    default: false,
    validator: (v) => typeof v === "boolean" || v === "always"
  },
  ticks: {
    type: [Array, Object]
  },
  tickSize: {
    type: [Number, String],
    default: 2
  },
  color: String,
  trackColor: String,
  trackFillColor: String,
  trackSize: {
    type: [Number, String],
    default: 4
  },
  direction: {
    type: String,
    default: "horizontal",
    validator: (v) => ["vertical", "horizontal"].includes(v)
  },
  reverse: Boolean,
  ...makeRoundedProps(),
  ...makeElevationProps({
    elevation: 2
  }),
  ripple: {
    type: Boolean,
    default: true
  }
}, "Slider");
const useSteps = (props) => {
  const min = computed(() => parseFloat(props.min));
  const max = computed(() => parseFloat(props.max));
  const step = computed(() => +props.step > 0 ? parseFloat(props.step) : 0);
  const decimals = computed(() => Math.max(getDecimals(step.value), getDecimals(min.value)));
  function roundValue(value) {
    value = parseFloat(value);
    if (step.value <= 0)
      return value;
    const clamped = clamp(value, min.value, max.value);
    const offset = min.value % step.value;
    const newValue = Math.round((clamped - offset) / step.value) * step.value + offset;
    return parseFloat(Math.min(newValue, max.value).toFixed(decimals.value));
  }
  return {
    min,
    max,
    step,
    decimals,
    roundValue
  };
};
const useSlider = (_ref) => {
  let {
    props,
    steps,
    onSliderStart,
    onSliderMove,
    onSliderEnd,
    getActiveThumb
  } = _ref;
  const {
    isRtl
  } = useRtl();
  const isReversed = toRef(props, "reverse");
  const vertical = computed(() => props.direction === "vertical");
  const indexFromEnd = computed(() => vertical.value !== isReversed.value);
  const {
    min,
    max,
    step,
    decimals,
    roundValue
  } = steps;
  const thumbSize = computed(() => parseInt(props.thumbSize, 10));
  const tickSize = computed(() => parseInt(props.tickSize, 10));
  const trackSize = computed(() => parseInt(props.trackSize, 10));
  const numTicks = computed(() => (max.value - min.value) / step.value);
  const disabled = toRef(props, "disabled");
  const thumbColor = computed(() => props.error || props.disabled ? void 0 : props.thumbColor ?? props.color);
  const trackColor = computed(() => props.error || props.disabled ? void 0 : props.trackColor ?? props.color);
  const trackFillColor = computed(() => props.error || props.disabled ? void 0 : props.trackFillColor ?? props.color);
  const mousePressed = shallowRef(false);
  const startOffset = shallowRef(0);
  const trackContainerRef = ref();
  const activeThumbRef = ref();
  function parseMouseMove(e) {
    const vertical2 = props.direction === "vertical";
    const start = vertical2 ? "top" : "left";
    const length = vertical2 ? "height" : "width";
    const position2 = vertical2 ? "clientY" : "clientX";
    const {
      [start]: trackStart,
      [length]: trackLength
    } = trackContainerRef.value?.$el.getBoundingClientRect();
    const clickOffset = getPosition(e, position2);
    let clickPos = Math.min(Math.max((clickOffset - trackStart - startOffset.value) / trackLength, 0), 1) || 0;
    if (vertical2 ? indexFromEnd.value : indexFromEnd.value !== isRtl.value)
      clickPos = 1 - clickPos;
    return roundValue(min.value + clickPos * (max.value - min.value));
  }
  const handleStop = (e) => {
    onSliderEnd({
      value: parseMouseMove(e)
    });
    mousePressed.value = false;
    startOffset.value = 0;
  };
  const handleStart = (e) => {
    activeThumbRef.value = getActiveThumb(e);
    if (!activeThumbRef.value)
      return;
    activeThumbRef.value.focus();
    mousePressed.value = true;
    if (activeThumbRef.value.contains(e.target)) {
      startOffset.value = getOffset(e, activeThumbRef.value, props.direction);
    } else {
      startOffset.value = 0;
      onSliderMove({
        value: parseMouseMove(e)
      });
    }
    onSliderStart({
      value: parseMouseMove(e)
    });
  };
  const moveListenerOptions = {
    passive: true,
    capture: true
  };
  function onMouseMove(e) {
    onSliderMove({
      value: parseMouseMove(e)
    });
  }
  function onSliderMouseUp(e) {
    e.stopPropagation();
    e.preventDefault();
    handleStop(e);
    window.removeEventListener("mousemove", onMouseMove, moveListenerOptions);
    window.removeEventListener("mouseup", onSliderMouseUp);
  }
  function onSliderTouchend(e) {
    handleStop(e);
    window.removeEventListener("touchmove", onMouseMove, moveListenerOptions);
    e.target?.removeEventListener("touchend", onSliderTouchend);
  }
  function onSliderTouchstart(e) {
    handleStart(e);
    window.addEventListener("touchmove", onMouseMove, moveListenerOptions);
    e.target?.addEventListener("touchend", onSliderTouchend, {
      passive: false
    });
  }
  function onSliderMousedown(e) {
    e.preventDefault();
    handleStart(e);
    window.addEventListener("mousemove", onMouseMove, moveListenerOptions);
    window.addEventListener("mouseup", onSliderMouseUp, {
      passive: false
    });
  }
  const position = (val) => {
    const percentage = (val - min.value) / (max.value - min.value) * 100;
    return clamp(isNaN(percentage) ? 0 : percentage, 0, 100);
  };
  const showTicks = toRef(props, "showTicks");
  const parsedTicks = computed(() => {
    if (!showTicks.value)
      return [];
    if (!props.ticks) {
      return numTicks.value !== Infinity ? createRange(numTicks.value + 1).map((t) => {
        const value = min.value + t * step.value;
        return {
          value,
          position: position(value)
        };
      }) : [];
    }
    if (Array.isArray(props.ticks))
      return props.ticks.map((t) => ({
        value: t,
        position: position(t),
        label: t.toString()
      }));
    return Object.keys(props.ticks).map((key) => ({
      value: parseFloat(key),
      position: position(parseFloat(key)),
      label: props.ticks[key]
    }));
  });
  const hasLabels = computed(() => parsedTicks.value.some((_ref2) => {
    let {
      label
    } = _ref2;
    return !!label;
  }));
  const data = {
    activeThumbRef,
    color: toRef(props, "color"),
    decimals,
    disabled,
    direction: toRef(props, "direction"),
    elevation: toRef(props, "elevation"),
    hasLabels,
    isReversed,
    indexFromEnd,
    min,
    max,
    mousePressed,
    numTicks,
    onSliderMousedown,
    onSliderTouchstart,
    parsedTicks,
    parseMouseMove,
    position,
    readonly: toRef(props, "readonly"),
    rounded: toRef(props, "rounded"),
    roundValue,
    showTicks,
    startOffset,
    step,
    thumbSize,
    thumbColor,
    thumbLabel: toRef(props, "thumbLabel"),
    ticks: toRef(props, "ticks"),
    tickSize,
    trackColor,
    trackContainerRef,
    trackFillColor,
    trackSize,
    vertical
  };
  provide(VSliderSymbol, data);
  return data;
};
const makeVSliderThumbProps = propsFactory({
  focused: Boolean,
  max: {
    type: Number,
    required: true
  },
  min: {
    type: Number,
    required: true
  },
  modelValue: {
    type: Number,
    required: true
  },
  position: {
    type: Number,
    required: true
  },
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  ...makeComponentProps()
}, "VSliderThumb");
const VSliderThumb = genericComponent()({
  name: "VSliderThumb",
  directives: {
    Ripple
  },
  props: makeVSliderThumbProps(),
  emits: {
    "update:modelValue": (v) => true
  },
  setup(props, _ref) {
    let {
      slots,
      emit: emit2
    } = _ref;
    const slider = inject$1(VSliderSymbol);
    const {
      isRtl,
      rtlClasses
    } = useRtl();
    if (!slider)
      throw new Error("[Vuetify] v-slider-thumb must be used inside v-slider or v-range-slider");
    const {
      thumbColor,
      step,
      disabled,
      thumbSize,
      thumbLabel,
      direction,
      isReversed,
      vertical,
      readonly: readonly2,
      elevation,
      mousePressed,
      decimals,
      indexFromEnd
    } = slider;
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(thumbColor);
    const {
      pageup,
      pagedown,
      end,
      home,
      left,
      right,
      down,
      up
    } = keyValues;
    const relevantKeys = [pageup, pagedown, end, home, left, right, down, up];
    const multipliers = computed(() => {
      if (step.value)
        return [1, 2, 3];
      else
        return [1, 5, 10];
    });
    function parseKeydown(e, value) {
      if (!relevantKeys.includes(e.key))
        return;
      e.preventDefault();
      const _step = step.value || 0.1;
      const steps = (props.max - props.min) / _step;
      if ([left, right, down, up].includes(e.key)) {
        const increase = vertical.value ? [isRtl.value ? left : right, isReversed.value ? down : up] : indexFromEnd.value !== isRtl.value ? [left, up] : [right, up];
        const direction2 = increase.includes(e.key) ? 1 : -1;
        const multiplier = e.shiftKey ? 2 : e.ctrlKey ? 1 : 0;
        value = value + direction2 * _step * multipliers.value[multiplier];
      } else if (e.key === home) {
        value = props.min;
      } else if (e.key === end) {
        value = props.max;
      } else {
        const direction2 = e.key === pagedown ? 1 : -1;
        value = value - direction2 * _step * (steps > 100 ? steps / 10 : 10);
      }
      return Math.max(props.min, Math.min(props.max, value));
    }
    function onKeydown(e) {
      const newValue = parseKeydown(e, props.modelValue);
      newValue != null && emit2("update:modelValue", newValue);
    }
    useRender(() => {
      const positionPercentage = convertToUnit(indexFromEnd.value ? 100 - props.position : props.position, "%");
      const {
        elevationClasses
      } = useElevation(computed(() => !disabled.value ? elevation.value : void 0));
      return createVNode("div", {
        "class": ["v-slider-thumb", {
          "v-slider-thumb--focused": props.focused,
          "v-slider-thumb--pressed": props.focused && mousePressed.value
        }, props.class, rtlClasses.value],
        "style": [{
          "--v-slider-thumb-position": positionPercentage,
          "--v-slider-thumb-size": convertToUnit(thumbSize.value)
        }, props.style],
        "role": "slider",
        "tabindex": disabled.value ? -1 : 0,
        "aria-valuemin": props.min,
        "aria-valuemax": props.max,
        "aria-valuenow": props.modelValue,
        "aria-readonly": !!readonly2.value,
        "aria-orientation": direction.value,
        "onKeydown": !readonly2.value ? onKeydown : void 0
      }, [createVNode("div", {
        "class": ["v-slider-thumb__surface", textColorClasses.value, elevationClasses.value],
        "style": {
          ...textColorStyles.value
        }
      }, null), withDirectives(createVNode("div", {
        "class": ["v-slider-thumb__ripple", textColorClasses.value],
        "style": textColorStyles.value
      }, null), [[resolveDirective("ripple"), props.ripple, null, {
        circle: true,
        center: true
      }]]), createVNode(VScaleTransition, {
        "origin": "bottom center"
      }, {
        default: () => [withDirectives(createVNode("div", {
          "class": "v-slider-thumb__label-container"
        }, [createVNode("div", {
          "class": ["v-slider-thumb__label"]
        }, [createVNode("div", null, [slots["thumb-label"]?.({
          modelValue: props.modelValue
        }) ?? props.modelValue.toFixed(step.value ? decimals.value : 1)])])]), [[vShow, thumbLabel.value && props.focused || thumbLabel.value === "always"]])]
      })]);
    });
    return {};
  }
});
const VSliderTrack$1 = "";
const makeVSliderTrackProps = propsFactory({
  start: {
    type: Number,
    required: true
  },
  stop: {
    type: Number,
    required: true
  },
  ...makeComponentProps()
}, "VSliderTrack");
const VSliderTrack = genericComponent()({
  name: "VSliderTrack",
  props: makeVSliderTrackProps(),
  emits: {},
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const slider = inject$1(VSliderSymbol);
    if (!slider)
      throw new Error("[Vuetify] v-slider-track must be inside v-slider or v-range-slider");
    const {
      color,
      parsedTicks,
      rounded,
      showTicks,
      tickSize,
      trackColor,
      trackFillColor,
      trackSize,
      vertical,
      min,
      max,
      indexFromEnd
    } = slider;
    const {
      roundedClasses
    } = useRounded(rounded);
    const {
      backgroundColorClasses: trackFillColorClasses,
      backgroundColorStyles: trackFillColorStyles
    } = useBackgroundColor(trackFillColor);
    const {
      backgroundColorClasses: trackColorClasses,
      backgroundColorStyles: trackColorStyles
    } = useBackgroundColor(trackColor);
    const startDir = computed(() => `inset-${vertical.value ? "block" : "inline"}-${indexFromEnd.value ? "end" : "start"}`);
    const endDir = computed(() => vertical.value ? "height" : "width");
    const backgroundStyles = computed(() => {
      return {
        [startDir.value]: "0%",
        [endDir.value]: "100%"
      };
    });
    const trackFillWidth = computed(() => props.stop - props.start);
    const trackFillStyles = computed(() => {
      return {
        [startDir.value]: convertToUnit(props.start, "%"),
        [endDir.value]: convertToUnit(trackFillWidth.value, "%")
      };
    });
    const computedTicks = computed(() => {
      if (!showTicks.value)
        return [];
      const ticks = vertical.value ? parsedTicks.value.slice().reverse() : parsedTicks.value;
      return ticks.map((tick, index) => {
        const directionValue = tick.value !== min.value && tick.value !== max.value ? convertToUnit(tick.position, "%") : void 0;
        return createVNode("div", {
          "key": tick.value,
          "class": ["v-slider-track__tick", {
            "v-slider-track__tick--filled": tick.position >= props.start && tick.position <= props.stop,
            "v-slider-track__tick--first": tick.value === min.value,
            "v-slider-track__tick--last": tick.value === max.value
          }],
          "style": {
            [startDir.value]: directionValue
          }
        }, [(tick.label || slots["tick-label"]) && createVNode("div", {
          "class": "v-slider-track__tick-label"
        }, [slots["tick-label"]?.({
          tick,
          index
        }) ?? tick.label])]);
      });
    });
    useRender(() => {
      return createVNode("div", {
        "class": ["v-slider-track", roundedClasses.value, props.class],
        "style": [{
          "--v-slider-track-size": convertToUnit(trackSize.value),
          "--v-slider-tick-size": convertToUnit(tickSize.value)
        }, props.style]
      }, [createVNode("div", {
        "class": ["v-slider-track__background", trackColorClasses.value, {
          "v-slider-track__background--opacity": !!color.value || !trackFillColor.value
        }],
        "style": {
          ...backgroundStyles.value,
          ...trackColorStyles.value
        }
      }, null), createVNode("div", {
        "class": ["v-slider-track__fill", trackFillColorClasses.value],
        "style": {
          ...trackFillStyles.value,
          ...trackFillColorStyles.value
        }
      }, null), showTicks.value && createVNode("div", {
        "class": ["v-slider-track__ticks", {
          "v-slider-track__ticks--always-show": showTicks.value === "always"
        }]
      }, [computedTicks.value])]);
    });
    return {};
  }
});
const makeVSliderProps = propsFactory({
  ...makeFocusProps(),
  ...makeSliderProps(),
  ...makeVInputProps(),
  modelValue: {
    type: [Number, String],
    default: 0
  }
}, "VSlider");
const VSlider = genericComponent()({
  name: "VSlider",
  props: makeVSliderProps(),
  emits: {
    "update:focused": (value) => true,
    "update:modelValue": (v) => true,
    start: (value) => true,
    end: (value) => true
  },
  setup(props, _ref) {
    let {
      slots,
      emit: emit2
    } = _ref;
    const thumbContainerRef = ref();
    const {
      rtlClasses
    } = useRtl();
    const steps = useSteps(props);
    const model = useProxiedModel(props, "modelValue", void 0, (value) => {
      return steps.roundValue(value == null ? steps.min.value : value);
    });
    const {
      min,
      max,
      mousePressed,
      roundValue,
      onSliderMousedown,
      onSliderTouchstart,
      trackContainerRef,
      position,
      hasLabels,
      readonly: readonly2
    } = useSlider({
      props,
      steps,
      onSliderStart: () => {
        emit2("start", model.value);
      },
      onSliderEnd: (_ref2) => {
        let {
          value
        } = _ref2;
        const roundedValue = roundValue(value);
        model.value = roundedValue;
        emit2("end", roundedValue);
      },
      onSliderMove: (_ref3) => {
        let {
          value
        } = _ref3;
        return model.value = roundValue(value);
      },
      getActiveThumb: () => thumbContainerRef.value?.$el
    });
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const trackStop = computed(() => position(model.value));
    useRender(() => {
      const inputProps = VInput.filterProps(props);
      const hasPrepend = !!(props.label || slots.label || slots.prepend);
      return createVNode(VInput, mergeProps({
        "class": ["v-slider", {
          "v-slider--has-labels": !!slots["tick-label"] || hasLabels.value,
          "v-slider--focused": isFocused.value,
          "v-slider--pressed": mousePressed.value,
          "v-slider--disabled": props.disabled
        }, rtlClasses.value, props.class],
        "style": props.style
      }, inputProps, {
        "focused": isFocused.value
      }), {
        ...slots,
        prepend: hasPrepend ? (slotProps) => createVNode(Fragment, null, [slots.label?.(slotProps) ?? (props.label ? createVNode(VLabel, {
          "id": slotProps.id.value,
          "class": "v-slider__label",
          "text": props.label
        }, null) : void 0), slots.prepend?.(slotProps)]) : void 0,
        default: (_ref4) => {
          let {
            id,
            messagesId
          } = _ref4;
          return createVNode("div", {
            "class": "v-slider__container",
            "onMousedown": !readonly2.value ? onSliderMousedown : void 0,
            "onTouchstartPassive": !readonly2.value ? onSliderTouchstart : void 0
          }, [createVNode("input", {
            "id": id.value,
            "name": props.name || id.value,
            "disabled": !!props.disabled,
            "readonly": !!props.readonly,
            "tabindex": "-1",
            "value": model.value
          }, null), createVNode(VSliderTrack, {
            "ref": trackContainerRef,
            "start": 0,
            "stop": trackStop.value
          }, {
            "tick-label": slots["tick-label"]
          }), createVNode(VSliderThumb, {
            "ref": thumbContainerRef,
            "aria-describedby": messagesId.value,
            "focused": isFocused.value,
            "min": min.value,
            "max": max.value,
            "modelValue": model.value,
            "onUpdate:modelValue": (v) => model.value = v,
            "position": trackStop.value,
            "elevation": props.elevation,
            "onFocus": focus,
            "onBlur": blur,
            "ripple": props.ripple
          }, {
            "thumb-label": slots["thumb-label"]
          })]);
        }
      });
    });
    return {};
  }
});
const makeVColorPickerPreviewProps = propsFactory({
  color: {
    type: Object
  },
  disabled: Boolean,
  hideAlpha: Boolean,
  ...makeComponentProps()
}, "VColorPickerPreview");
const VColorPickerPreview = defineComponent({
  name: "VColorPickerPreview",
  props: makeVColorPickerPreviewProps(),
  emits: {
    "update:color": (color) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2
    } = _ref;
    const abortController = new AbortController();
    onUnmounted(() => abortController.abort());
    async function openEyeDropper() {
      if (!SUPPORTS_EYE_DROPPER)
        return;
      const eyeDropper = new window.EyeDropper();
      try {
        const result = await eyeDropper.open({
          signal: abortController.signal
        });
        const colorHexValue = HexToHSV(result.sRGBHex);
        emit2("update:color", {
          ...props.color ?? nullColor,
          ...colorHexValue
        });
      } catch (e) {
      }
    }
    useRender(() => createVNode("div", {
      "class": ["v-color-picker-preview", {
        "v-color-picker-preview--hide-alpha": props.hideAlpha
      }, props.class],
      "style": props.style
    }, [SUPPORTS_EYE_DROPPER && createVNode("div", {
      "class": "v-color-picker-preview__eye-dropper",
      "key": "eyeDropper"
    }, [createVNode(VBtn, {
      "onClick": openEyeDropper,
      "icon": "$eyeDropper",
      "variant": "plain",
      "density": "comfortable"
    }, null)]), createVNode("div", {
      "class": "v-color-picker-preview__dot"
    }, [createVNode("div", {
      "style": {
        background: HSVtoCSS(props.color ?? nullColor)
      }
    }, null)]), createVNode("div", {
      "class": "v-color-picker-preview__sliders"
    }, [createVNode(VSlider, {
      "class": "v-color-picker-preview__track v-color-picker-preview__hue",
      "modelValue": props.color?.h,
      "onUpdate:modelValue": (h2) => emit2("update:color", {
        ...props.color ?? nullColor,
        h: h2
      }),
      "step": 0,
      "min": 0,
      "max": 360,
      "disabled": props.disabled,
      "thumbSize": 14,
      "trackSize": 8,
      "trackFillColor": "white",
      "hideDetails": true
    }, null), !props.hideAlpha && createVNode(VSlider, {
      "class": "v-color-picker-preview__track v-color-picker-preview__alpha",
      "modelValue": props.color?.a ?? 1,
      "onUpdate:modelValue": (a) => emit2("update:color", {
        ...props.color ?? nullColor,
        a
      }),
      "step": 1 / 256,
      "min": 0,
      "max": 1,
      "disabled": props.disabled,
      "thumbSize": 14,
      "trackSize": 8,
      "trackFillColor": "white",
      "hideDetails": true
    }, null)])]));
    return {};
  }
});
const VColorPickerSwatches$1 = "";
const red = {
  base: "#f44336",
  lighten5: "#ffebee",
  lighten4: "#ffcdd2",
  lighten3: "#ef9a9a",
  lighten2: "#e57373",
  lighten1: "#ef5350",
  darken1: "#e53935",
  darken2: "#d32f2f",
  darken3: "#c62828",
  darken4: "#b71c1c",
  accent1: "#ff8a80",
  accent2: "#ff5252",
  accent3: "#ff1744",
  accent4: "#d50000"
};
const pink = {
  base: "#e91e63",
  lighten5: "#fce4ec",
  lighten4: "#f8bbd0",
  lighten3: "#f48fb1",
  lighten2: "#f06292",
  lighten1: "#ec407a",
  darken1: "#d81b60",
  darken2: "#c2185b",
  darken3: "#ad1457",
  darken4: "#880e4f",
  accent1: "#ff80ab",
  accent2: "#ff4081",
  accent3: "#f50057",
  accent4: "#c51162"
};
const purple = {
  base: "#9c27b0",
  lighten5: "#f3e5f5",
  lighten4: "#e1bee7",
  lighten3: "#ce93d8",
  lighten2: "#ba68c8",
  lighten1: "#ab47bc",
  darken1: "#8e24aa",
  darken2: "#7b1fa2",
  darken3: "#6a1b9a",
  darken4: "#4a148c",
  accent1: "#ea80fc",
  accent2: "#e040fb",
  accent3: "#d500f9",
  accent4: "#aa00ff"
};
const deepPurple = {
  base: "#673ab7",
  lighten5: "#ede7f6",
  lighten4: "#d1c4e9",
  lighten3: "#b39ddb",
  lighten2: "#9575cd",
  lighten1: "#7e57c2",
  darken1: "#5e35b1",
  darken2: "#512da8",
  darken3: "#4527a0",
  darken4: "#311b92",
  accent1: "#b388ff",
  accent2: "#7c4dff",
  accent3: "#651fff",
  accent4: "#6200ea"
};
const indigo = {
  base: "#3f51b5",
  lighten5: "#e8eaf6",
  lighten4: "#c5cae9",
  lighten3: "#9fa8da",
  lighten2: "#7986cb",
  lighten1: "#5c6bc0",
  darken1: "#3949ab",
  darken2: "#303f9f",
  darken3: "#283593",
  darken4: "#1a237e",
  accent1: "#8c9eff",
  accent2: "#536dfe",
  accent3: "#3d5afe",
  accent4: "#304ffe"
};
const blue = {
  base: "#2196f3",
  lighten5: "#e3f2fd",
  lighten4: "#bbdefb",
  lighten3: "#90caf9",
  lighten2: "#64b5f6",
  lighten1: "#42a5f5",
  darken1: "#1e88e5",
  darken2: "#1976d2",
  darken3: "#1565c0",
  darken4: "#0d47a1",
  accent1: "#82b1ff",
  accent2: "#448aff",
  accent3: "#2979ff",
  accent4: "#2962ff"
};
const lightBlue = {
  base: "#03a9f4",
  lighten5: "#e1f5fe",
  lighten4: "#b3e5fc",
  lighten3: "#81d4fa",
  lighten2: "#4fc3f7",
  lighten1: "#29b6f6",
  darken1: "#039be5",
  darken2: "#0288d1",
  darken3: "#0277bd",
  darken4: "#01579b",
  accent1: "#80d8ff",
  accent2: "#40c4ff",
  accent3: "#00b0ff",
  accent4: "#0091ea"
};
const cyan = {
  base: "#00bcd4",
  lighten5: "#e0f7fa",
  lighten4: "#b2ebf2",
  lighten3: "#80deea",
  lighten2: "#4dd0e1",
  lighten1: "#26c6da",
  darken1: "#00acc1",
  darken2: "#0097a7",
  darken3: "#00838f",
  darken4: "#006064",
  accent1: "#84ffff",
  accent2: "#18ffff",
  accent3: "#00e5ff",
  accent4: "#00b8d4"
};
const teal = {
  base: "#009688",
  lighten5: "#e0f2f1",
  lighten4: "#b2dfdb",
  lighten3: "#80cbc4",
  lighten2: "#4db6ac",
  lighten1: "#26a69a",
  darken1: "#00897b",
  darken2: "#00796b",
  darken3: "#00695c",
  darken4: "#004d40",
  accent1: "#a7ffeb",
  accent2: "#64ffda",
  accent3: "#1de9b6",
  accent4: "#00bfa5"
};
const green = {
  base: "#4caf50",
  lighten5: "#e8f5e9",
  lighten4: "#c8e6c9",
  lighten3: "#a5d6a7",
  lighten2: "#81c784",
  lighten1: "#66bb6a",
  darken1: "#43a047",
  darken2: "#388e3c",
  darken3: "#2e7d32",
  darken4: "#1b5e20",
  accent1: "#b9f6ca",
  accent2: "#69f0ae",
  accent3: "#00e676",
  accent4: "#00c853"
};
const lightGreen = {
  base: "#8bc34a",
  lighten5: "#f1f8e9",
  lighten4: "#dcedc8",
  lighten3: "#c5e1a5",
  lighten2: "#aed581",
  lighten1: "#9ccc65",
  darken1: "#7cb342",
  darken2: "#689f38",
  darken3: "#558b2f",
  darken4: "#33691e",
  accent1: "#ccff90",
  accent2: "#b2ff59",
  accent3: "#76ff03",
  accent4: "#64dd17"
};
const lime = {
  base: "#cddc39",
  lighten5: "#f9fbe7",
  lighten4: "#f0f4c3",
  lighten3: "#e6ee9c",
  lighten2: "#dce775",
  lighten1: "#d4e157",
  darken1: "#c0ca33",
  darken2: "#afb42b",
  darken3: "#9e9d24",
  darken4: "#827717",
  accent1: "#f4ff81",
  accent2: "#eeff41",
  accent3: "#c6ff00",
  accent4: "#aeea00"
};
const yellow = {
  base: "#ffeb3b",
  lighten5: "#fffde7",
  lighten4: "#fff9c4",
  lighten3: "#fff59d",
  lighten2: "#fff176",
  lighten1: "#ffee58",
  darken1: "#fdd835",
  darken2: "#fbc02d",
  darken3: "#f9a825",
  darken4: "#f57f17",
  accent1: "#ffff8d",
  accent2: "#ffff00",
  accent3: "#ffea00",
  accent4: "#ffd600"
};
const amber = {
  base: "#ffc107",
  lighten5: "#fff8e1",
  lighten4: "#ffecb3",
  lighten3: "#ffe082",
  lighten2: "#ffd54f",
  lighten1: "#ffca28",
  darken1: "#ffb300",
  darken2: "#ffa000",
  darken3: "#ff8f00",
  darken4: "#ff6f00",
  accent1: "#ffe57f",
  accent2: "#ffd740",
  accent3: "#ffc400",
  accent4: "#ffab00"
};
const orange = {
  base: "#ff9800",
  lighten5: "#fff3e0",
  lighten4: "#ffe0b2",
  lighten3: "#ffcc80",
  lighten2: "#ffb74d",
  lighten1: "#ffa726",
  darken1: "#fb8c00",
  darken2: "#f57c00",
  darken3: "#ef6c00",
  darken4: "#e65100",
  accent1: "#ffd180",
  accent2: "#ffab40",
  accent3: "#ff9100",
  accent4: "#ff6d00"
};
const deepOrange = {
  base: "#ff5722",
  lighten5: "#fbe9e7",
  lighten4: "#ffccbc",
  lighten3: "#ffab91",
  lighten2: "#ff8a65",
  lighten1: "#ff7043",
  darken1: "#f4511e",
  darken2: "#e64a19",
  darken3: "#d84315",
  darken4: "#bf360c",
  accent1: "#ff9e80",
  accent2: "#ff6e40",
  accent3: "#ff3d00",
  accent4: "#dd2c00"
};
const brown = {
  base: "#795548",
  lighten5: "#efebe9",
  lighten4: "#d7ccc8",
  lighten3: "#bcaaa4",
  lighten2: "#a1887f",
  lighten1: "#8d6e63",
  darken1: "#6d4c41",
  darken2: "#5d4037",
  darken3: "#4e342e",
  darken4: "#3e2723"
};
const blueGrey = {
  base: "#607d8b",
  lighten5: "#eceff1",
  lighten4: "#cfd8dc",
  lighten3: "#b0bec5",
  lighten2: "#90a4ae",
  lighten1: "#78909c",
  darken1: "#546e7a",
  darken2: "#455a64",
  darken3: "#37474f",
  darken4: "#263238"
};
const grey = {
  base: "#9e9e9e",
  lighten5: "#fafafa",
  lighten4: "#f5f5f5",
  lighten3: "#eeeeee",
  lighten2: "#e0e0e0",
  lighten1: "#bdbdbd",
  darken1: "#757575",
  darken2: "#616161",
  darken3: "#424242",
  darken4: "#212121"
};
const shades = {
  black: "#000000",
  white: "#ffffff",
  transparent: "#ffffff00"
};
const colors = {
  red,
  pink,
  purple,
  deepPurple,
  indigo,
  blue,
  lightBlue,
  cyan,
  teal,
  green,
  lightGreen,
  lime,
  yellow,
  amber,
  orange,
  deepOrange,
  brown,
  blueGrey,
  grey,
  shades
};
const makeVColorPickerSwatchesProps = propsFactory({
  swatches: {
    type: Array,
    default: () => parseDefaultColors(colors)
  },
  disabled: Boolean,
  color: Object,
  maxHeight: [Number, String],
  ...makeComponentProps()
}, "VColorPickerSwatches");
function parseDefaultColors(colors2) {
  return Object.keys(colors2).map((key) => {
    const color = colors2[key];
    return color.base ? [color.base, color.darken4, color.darken3, color.darken2, color.darken1, color.lighten1, color.lighten2, color.lighten3, color.lighten4, color.lighten5] : [color.black, color.white, color.transparent];
  });
}
const VColorPickerSwatches = defineComponent({
  name: "VColorPickerSwatches",
  props: makeVColorPickerSwatchesProps(),
  emits: {
    "update:color": (color) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2
    } = _ref;
    useRender(() => createVNode("div", {
      "class": ["v-color-picker-swatches", props.class],
      "style": [{
        maxHeight: convertToUnit(props.maxHeight)
      }, props.style]
    }, [createVNode("div", null, [props.swatches.map((swatch) => createVNode("div", {
      "class": "v-color-picker-swatches__swatch"
    }, [swatch.map((color) => {
      const rgba2 = parseColor(color);
      const hsva = RGBtoHSV(rgba2);
      const background = RGBtoCSS(rgba2);
      return createVNode("div", {
        "class": "v-color-picker-swatches__color",
        "onClick": () => hsva && emit2("update:color", hsva)
      }, [createVNode("div", {
        "style": {
          background
        }
      }, [props.color && deepEqual(props.color, hsva) ? createVNode(VIcon, {
        "size": "x-small",
        "icon": "$success",
        "color": getContrast(color, "#FFFFFF") > 2 ? "white" : "black"
      }, null) : void 0])]);
    })]))])]));
    return {};
  }
});
const VSheet$1 = "";
const makeVSheetProps = propsFactory({
  color: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VSheet");
const VSheet = genericComponent()({
  name: "VSheet",
  props: makeVSheetProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-sheet", themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, positionClasses.value, roundedClasses.value, props.class],
      "style": [backgroundColorStyles.value, dimensionStyles.value, locationStyles.value, props.style]
    }, slots));
    return {};
  }
});
const makeVColorPickerProps = propsFactory({
  canvasHeight: {
    type: [String, Number],
    default: 150
  },
  disabled: Boolean,
  dotSize: {
    type: [Number, String],
    default: 10
  },
  hideCanvas: Boolean,
  hideSliders: Boolean,
  hideInputs: Boolean,
  mode: {
    type: String,
    default: "rgba",
    validator: (v) => Object.keys(modes).includes(v)
  },
  modes: {
    type: Array,
    default: () => Object.keys(modes),
    validator: (v) => Array.isArray(v) && v.every((m) => Object.keys(modes).includes(m))
  },
  showSwatches: Boolean,
  swatches: Array,
  swatchesMaxHeight: {
    type: [Number, String],
    default: 150
  },
  modelValue: {
    type: [Object, String]
  },
  ...omit(makeVSheetProps({
    width: 300
  }), ["height", "location", "minHeight", "maxHeight", "minWidth", "maxWidth"])
}, "VColorPicker");
const VColorPicker = defineComponent({
  name: "VColorPicker",
  props: makeVColorPickerProps(),
  emits: {
    "update:modelValue": (color) => true,
    "update:mode": (mode) => true
  },
  setup(props) {
    const mode = useProxiedModel(props, "mode");
    const lastPickedColor = ref(null);
    const currentColor = useProxiedModel(props, "modelValue", void 0, (v) => {
      if (v == null || v === "")
        return null;
      let c;
      try {
        c = RGBtoHSV(parseColor(v));
      } catch (err) {
        return null;
      }
      if (lastPickedColor.value) {
        c = {
          ...c,
          h: lastPickedColor.value.h
        };
        lastPickedColor.value = null;
      }
      return c;
    }, (v) => {
      if (!v)
        return null;
      return extractColor(v, props.modelValue);
    });
    const {
      rtlClasses
    } = useRtl();
    const updateColor = (hsva) => {
      currentColor.value = hsva;
      lastPickedColor.value = hsva;
    };
    onMounted(() => {
      if (!props.modes.includes(mode.value))
        mode.value = props.modes[0];
    });
    provideDefaults({
      VSlider: {
        color: void 0,
        trackColor: void 0,
        trackFillColor: void 0
      }
    });
    useRender(() => {
      const sheetProps = VSheet.filterProps(props);
      return createVNode(VSheet, mergeProps({
        "rounded": props.rounded,
        "elevation": props.elevation,
        "theme": props.theme,
        "class": ["v-color-picker", rtlClasses.value, props.class],
        "style": [{
          "--v-color-picker-color-hsv": HSVtoCSS({
            ...currentColor.value ?? nullColor,
            a: 1
          })
        }, props.style]
      }, sheetProps, {
        "maxWidth": props.width
      }), {
        default: () => [!props.hideCanvas && createVNode(VColorPickerCanvas, {
          "key": "canvas",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "disabled": props.disabled,
          "dotSize": props.dotSize,
          "width": props.width,
          "height": props.canvasHeight
        }, null), (!props.hideSliders || !props.hideInputs) && createVNode("div", {
          "key": "controls",
          "class": "v-color-picker__controls"
        }, [!props.hideSliders && createVNode(VColorPickerPreview, {
          "key": "preview",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "hideAlpha": !mode.value.endsWith("a"),
          "disabled": props.disabled
        }, null), !props.hideInputs && createVNode(VColorPickerEdit, {
          "key": "edit",
          "modes": props.modes,
          "mode": mode.value,
          "onUpdate:mode": (m) => mode.value = m,
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "disabled": props.disabled
        }, null)]), props.showSwatches && createVNode(VColorPickerSwatches, {
          "key": "swatches",
          "color": currentColor.value,
          "onUpdate:color": updateColor,
          "maxHeight": props.swatchesMaxHeight,
          "swatches": props.swatches,
          "disabled": props.disabled
        }, null)]
      });
    });
    return {};
  }
});
const VCombobox$1 = "";
function highlightResult(text, matches, length) {
  if (matches == null)
    return text;
  if (Array.isArray(matches))
    throw new Error("Multiple matches is not implemented");
  return typeof matches === "number" && ~matches ? createVNode(Fragment, null, [createVNode("span", {
    "class": "v-combobox__unmask"
  }, [text.substr(0, matches)]), createVNode("span", {
    "class": "v-combobox__mask"
  }, [text.substr(matches, length)]), createVNode("span", {
    "class": "v-combobox__unmask"
  }, [text.substr(matches + length)])]) : text;
}
const makeVComboboxProps = propsFactory({
  autoSelectFirst: {
    type: [Boolean, String]
  },
  delimiters: Array,
  ...makeFilterProps({
    filterKeys: ["title"]
  }),
  ...makeSelectProps({
    hideNoData: true,
    returnObject: true
  }),
  ...omit(makeVTextFieldProps({
    modelValue: null,
    role: "combobox"
  }), ["validationValue", "dirty", "appendInnerIcon"]),
  ...makeTransitionProps({
    transition: false
  })
}, "VCombobox");
const VCombobox = genericComponent()({
  name: "VCombobox",
  props: makeVComboboxProps(),
  emits: {
    "update:focused": (focused) => true,
    "update:modelValue": (value) => true,
    "update:search": (value) => true,
    "update:menu": (value) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const vTextFieldRef = ref();
    const isFocused = shallowRef(false);
    const isPristine = shallowRef(true);
    const listHasFocus = shallowRef(false);
    const vMenuRef = ref();
    const vVirtualScrollRef = ref();
    const _menu = useProxiedModel(props, "menu");
    const menu = computed({
      get: () => _menu.value,
      set: (v) => {
        if (_menu.value && !v && vMenuRef.value?.ΨopenChildren)
          return;
        _menu.value = v;
      }
    });
    const selectionIndex = shallowRef(-1);
    let cleared = false;
    const color = computed(() => vTextFieldRef.value?.color);
    const label = computed(() => menu.value ? props.closeText : props.openText);
    const {
      items,
      transformIn,
      transformOut
    } = useItems(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(color);
    const model = useProxiedModel(props, "modelValue", [], (v) => transformIn(wrapInArray(v)), (v) => {
      const transformed = transformOut(v);
      return props.multiple ? transformed : transformed[0] ?? null;
    });
    const form = useForm();
    const _search = shallowRef(!props.multiple ? model.value[0]?.title ?? "" : "");
    const search = computed({
      get: () => {
        return _search.value;
      },
      set: (val) => {
        _search.value = val ?? "";
        if (!props.multiple) {
          model.value = [transformItem$3(props, val)];
        }
        if (val && props.multiple && props.delimiters?.length) {
          const values = val.split(new RegExp(`(?:${props.delimiters.join("|")})+`));
          if (values.length > 1) {
            values.forEach((v) => {
              v = v.trim();
              if (v)
                select(transformItem$3(props, v));
            });
            _search.value = "";
          }
        }
        if (!val)
          selectionIndex.value = -1;
        isPristine.value = !val;
      }
    });
    const counterValue = computed(() => {
      return typeof props.counterValue === "function" ? props.counterValue(model.value) : typeof props.counterValue === "number" ? props.counterValue : props.multiple ? model.value.length : search.value.length;
    });
    watch(_search, (value) => {
      if (cleared) {
        nextTick(() => cleared = false);
      } else if (isFocused.value && !menu.value) {
        menu.value = true;
      }
      emit2("update:search", value);
    });
    watch(model, (value) => {
      if (!props.multiple) {
        _search.value = value[0]?.title ?? "";
      }
    });
    const {
      filteredItems,
      getMatches
    } = useFilter(props, items, () => isPristine.value ? "" : search.value);
    const displayItems = computed(() => {
      if (props.hideSelected) {
        return filteredItems.value.filter((filteredItem) => !model.value.some((s) => s.value === filteredItem.value));
      }
      return filteredItems.value;
    });
    const selectedValues = computed(() => model.value.map((selection) => selection.value));
    const highlightFirst = computed(() => {
      const selectFirst = props.autoSelectFirst === true || props.autoSelectFirst === "exact" && search.value === displayItems.value[0]?.title;
      return selectFirst && displayItems.value.length > 0 && !isPristine.value && !listHasFocus.value;
    });
    const menuDisabled = computed(() => props.hideNoData && !items.value.length || props.readonly || form?.isReadonly.value);
    const listRef = ref();
    const {
      onListScroll,
      onListKeydown
    } = useScrolling(listRef, vTextFieldRef);
    function onClear(e) {
      cleared = true;
      if (props.openOnClear) {
        menu.value = true;
      }
    }
    function onMousedownControl() {
      if (menuDisabled.value)
        return;
      menu.value = true;
    }
    function onMousedownMenuIcon(e) {
      if (menuDisabled.value)
        return;
      if (isFocused.value) {
        e.preventDefault();
        e.stopPropagation();
      }
      menu.value = !menu.value;
    }
    function onKeydown(e) {
      if (isComposingIgnoreKey(e) || props.readonly || form?.isReadonly.value)
        return;
      const selectionStart = vTextFieldRef.value.selectionStart;
      const length = model.value.length;
      if (selectionIndex.value > -1 || ["Enter", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
      }
      if (["Enter", "ArrowDown"].includes(e.key)) {
        menu.value = true;
      }
      if (["Escape"].includes(e.key)) {
        menu.value = false;
      }
      if (["Enter", "Escape", "Tab"].includes(e.key)) {
        if (highlightFirst.value && ["Enter", "Tab"].includes(e.key)) {
          select(filteredItems.value[0]);
        }
        isPristine.value = true;
      }
      if (e.key === "ArrowDown" && highlightFirst.value) {
        listRef.value?.focus("next");
      }
      if (!props.multiple)
        return;
      if (["Backspace", "Delete"].includes(e.key)) {
        if (selectionIndex.value < 0) {
          if (e.key === "Backspace" && !search.value) {
            selectionIndex.value = length - 1;
          }
          return;
        }
        const originalSelectionIndex = selectionIndex.value;
        const selectedItem = model.value[selectionIndex.value];
        if (selectedItem && !selectedItem.props.disabled)
          select(selectedItem);
        selectionIndex.value = originalSelectionIndex >= length - 1 ? length - 2 : originalSelectionIndex;
      }
      if (e.key === "ArrowLeft") {
        if (selectionIndex.value < 0 && selectionStart > 0)
          return;
        const prev = selectionIndex.value > -1 ? selectionIndex.value - 1 : length - 1;
        if (model.value[prev]) {
          selectionIndex.value = prev;
        } else {
          selectionIndex.value = -1;
          vTextFieldRef.value.setSelectionRange(search.value.length, search.value.length);
        }
      }
      if (e.key === "ArrowRight") {
        if (selectionIndex.value < 0)
          return;
        const next = selectionIndex.value + 1;
        if (model.value[next]) {
          selectionIndex.value = next;
        } else {
          selectionIndex.value = -1;
          vTextFieldRef.value.setSelectionRange(0, 0);
        }
      }
      if (e.key === "Enter" && search.value) {
        select(transformItem$3(props, search.value));
        search.value = "";
      }
    }
    function onAfterLeave() {
      if (isFocused.value) {
        isPristine.value = true;
        vTextFieldRef.value?.focus();
      }
    }
    function select(item) {
      let set2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
      if (props.multiple) {
        const index = model.value.findIndex((selection) => props.valueComparator(selection.value, item.value));
        const add2 = set2 == null ? !~index : set2;
        if (~index) {
          const value = add2 ? [...model.value, item] : [...model.value];
          value.splice(index, 1);
          model.value = value;
        } else if (add2) {
          model.value = [...model.value, item];
        }
        search.value = "";
      } else {
        const add2 = set2 !== false;
        model.value = add2 ? [item] : [];
        _search.value = add2 ? item.title : "";
        nextTick(() => {
          menu.value = false;
          isPristine.value = true;
        });
      }
    }
    function onFocusin(e) {
      isFocused.value = true;
      setTimeout(() => {
        listHasFocus.value = true;
      });
    }
    function onFocusout(e) {
      listHasFocus.value = false;
    }
    function onUpdateModelValue(v) {
      if (v == null || v === "" && !props.multiple)
        model.value = [];
    }
    watch(filteredItems, (val) => {
      if (!val.length && props.hideNoData)
        menu.value = false;
    });
    watch(isFocused, (val, oldVal) => {
      if (val || val === oldVal)
        return;
      selectionIndex.value = -1;
      menu.value = false;
      if (highlightFirst.value && !listHasFocus.value && !model.value.some((_ref2) => {
        let {
          value
        } = _ref2;
        return value === displayItems.value[0].value;
      })) {
        select(displayItems.value[0]);
      } else if (props.multiple && search.value) {
        select(transformItem$3(props, search.value));
      }
    });
    watch(menu, () => {
      if (!props.hideSelected && menu.value && model.value.length) {
        const index = displayItems.value.findIndex((item) => model.value.some((s) => props.valueComparator(s.value, item.value)));
        IN_BROWSER && window.requestAnimationFrame(() => {
          index >= 0 && vVirtualScrollRef.value?.scrollToIndex(index);
        });
      }
    });
    useRender(() => {
      const hasChips = !!(props.chips || slots.chip);
      const hasList = !!(!props.hideNoData || displayItems.value.length || slots["prepend-item"] || slots["append-item"] || slots["no-data"]);
      const isDirty = model.value.length > 0;
      const textFieldProps = VTextField.filterProps(props);
      return createVNode(VTextField, mergeProps({
        "ref": vTextFieldRef
      }, textFieldProps, {
        "modelValue": search.value,
        "onUpdate:modelValue": [($event) => search.value = $event, onUpdateModelValue],
        "focused": isFocused.value,
        "onUpdate:focused": ($event) => isFocused.value = $event,
        "validationValue": model.externalValue,
        "counterValue": counterValue.value,
        "dirty": isDirty,
        "class": ["v-combobox", {
          "v-combobox--active-menu": menu.value,
          "v-combobox--chips": !!props.chips,
          "v-combobox--selection-slot": !!slots.selection,
          "v-combobox--selecting-index": selectionIndex.value > -1,
          [`v-combobox--${props.multiple ? "multiple" : "single"}`]: true
        }, props.class],
        "style": props.style,
        "readonly": props.readonly,
        "placeholder": isDirty ? void 0 : props.placeholder,
        "onClick:clear": onClear,
        "onMousedown:control": onMousedownControl,
        "onKeydown": onKeydown
      }), {
        ...slots,
        default: () => createVNode(Fragment, null, [createVNode(VMenu, mergeProps({
          "ref": vMenuRef,
          "modelValue": menu.value,
          "onUpdate:modelValue": ($event) => menu.value = $event,
          "activator": "parent",
          "contentClass": "v-combobox__content",
          "disabled": menuDisabled.value,
          "eager": props.eager,
          "maxHeight": 310,
          "openOnClick": false,
          "closeOnContentClick": false,
          "transition": props.transition,
          "onAfterLeave": onAfterLeave
        }, props.menuProps), {
          default: () => [hasList && createVNode(VList, {
            "ref": listRef,
            "selected": selectedValues.value,
            "selectStrategy": props.multiple ? "independent" : "single-independent",
            "onMousedown": (e) => e.preventDefault(),
            "onKeydown": onListKeydown,
            "onFocusin": onFocusin,
            "onFocusout": onFocusout,
            "onScrollPassive": onListScroll,
            "tabindex": "-1",
            "color": props.itemColor ?? props.color
          }, {
            default: () => [slots["prepend-item"]?.(), !displayItems.value.length && !props.hideNoData && (slots["no-data"]?.() ?? createVNode(VListItem, {
              "title": t(props.noDataText)
            }, null)), createVNode(VVirtualScroll, {
              "ref": vVirtualScrollRef,
              "renderless": true,
              "items": displayItems.value
            }, {
              default: (_ref3) => {
                let {
                  item,
                  index,
                  itemRef
                } = _ref3;
                const itemProps = mergeProps(item.props, {
                  ref: itemRef,
                  key: index,
                  active: highlightFirst.value && index === 0 ? true : void 0,
                  onClick: () => select(item, null)
                });
                return slots.item?.({
                  item,
                  index,
                  props: itemProps
                }) ?? createVNode(VListItem, itemProps, {
                  prepend: (_ref4) => {
                    let {
                      isSelected
                    } = _ref4;
                    return createVNode(Fragment, null, [props.multiple && !props.hideSelected ? createVNode(VCheckboxBtn, {
                      "key": item.value,
                      "modelValue": isSelected,
                      "ripple": false,
                      "tabindex": "-1"
                    }, null) : void 0, item.props.prependIcon && createVNode(VIcon, {
                      "icon": item.props.prependIcon
                    }, null)]);
                  },
                  title: () => {
                    return isPristine.value ? item.title : highlightResult(item.title, getMatches(item)?.title, search.value?.length ?? 0);
                  }
                });
              }
            }), slots["append-item"]?.()]
          })]
        }), model.value.map((item, index) => {
          function onChipClose(e) {
            e.stopPropagation();
            e.preventDefault();
            select(item, false);
          }
          const slotProps = {
            "onClick:close": onChipClose,
            onMousedown(e) {
              e.preventDefault();
              e.stopPropagation();
            },
            modelValue: true,
            "onUpdate:modelValue": void 0
          };
          const hasSlot = hasChips ? !!slots.chip : !!slots.selection;
          const slotContent = hasSlot ? ensureValidVNode(hasChips ? slots.chip({
            item,
            index,
            props: slotProps
          }) : slots.selection({
            item,
            index
          })) : void 0;
          if (hasSlot && !slotContent)
            return void 0;
          return createVNode("div", {
            "key": item.value,
            "class": ["v-combobox__selection", index === selectionIndex.value && ["v-combobox__selection--selected", textColorClasses.value]],
            "style": index === selectionIndex.value ? textColorStyles.value : {}
          }, [hasChips ? !slots.chip ? createVNode(VChip, mergeProps({
            "key": "chip",
            "closable": props.closableChips,
            "size": "small",
            "text": item.title,
            "disabled": item.props.disabled
          }, slotProps), null) : createVNode(VDefaultsProvider, {
            "key": "chip-defaults",
            "defaults": {
              VChip: {
                closable: props.closableChips,
                size: "small",
                text: item.title
              }
            }
          }, {
            default: () => [slotContent]
          }) : slotContent ?? createVNode("span", {
            "class": "v-combobox__selection-text"
          }, [item.title, props.multiple && index < model.value.length - 1 && createVNode("span", {
            "class": "v-combobox__selection-comma"
          }, [createTextVNode(",")])])]);
        })]),
        "append-inner": function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return createVNode(Fragment, null, [slots["append-inner"]?.(...args), (!props.hideNoData || props.items.length) && props.menuIcon ? createVNode(VIcon, {
            "class": "v-combobox__menu-icon",
            "icon": props.menuIcon,
            "onMousedown": onMousedownMenuIcon,
            "onClick": noop$1,
            "aria-label": t(label.value),
            "title": t(label.value)
          }, null) : void 0]);
        }
      });
    });
    return forwardRefs({
      isFocused,
      isPristine,
      menu,
      search,
      selectionIndex,
      filteredItems,
      select
    }, vTextFieldRef);
  }
});
const makeDataTableExpandProps = propsFactory({
  expandOnClick: Boolean,
  showExpand: Boolean,
  expanded: {
    type: Array,
    default: () => []
  }
}, "DataTable-expand");
const VDataTableExpandedKey = Symbol.for("vuetify:datatable:expanded");
function provideExpanded(props) {
  const expandOnClick = toRef(props, "expandOnClick");
  const expanded = useProxiedModel(props, "expanded", props.expanded, (v) => {
    return new Set(v);
  }, (v) => {
    return [...v.values()];
  });
  function expand(item, value) {
    const newExpanded = new Set(expanded.value);
    if (!value) {
      newExpanded.delete(item.value);
    } else {
      newExpanded.add(item.value);
    }
    expanded.value = newExpanded;
  }
  function isExpanded(item) {
    return expanded.value.has(item.value);
  }
  function toggleExpand(item) {
    expand(item, !isExpanded(item));
  }
  const data = {
    expand,
    expanded,
    expandOnClick,
    isExpanded,
    toggleExpand
  };
  provide(VDataTableExpandedKey, data);
  return data;
}
function useExpanded() {
  const data = inject$1(VDataTableExpandedKey);
  if (!data)
    throw new Error("foo");
  return data;
}
const makeDataTableGroupProps = propsFactory({
  groupBy: {
    type: Array,
    default: () => []
  }
}, "DataTable-group");
const VDataTableGroupSymbol = Symbol.for("vuetify:data-table-group");
function createGroupBy(props) {
  const groupBy = useProxiedModel(props, "groupBy");
  return {
    groupBy
  };
}
function provideGroupBy(options) {
  const {
    groupBy,
    sortBy
  } = options;
  const opened = ref(/* @__PURE__ */ new Set());
  const sortByWithGroups = computed(() => {
    return groupBy.value.map((val) => ({
      ...val,
      order: val.order ?? false
    })).concat(sortBy.value);
  });
  function isGroupOpen(group) {
    return opened.value.has(group.id);
  }
  function toggleGroup(group) {
    const newOpened = new Set(opened.value);
    if (!isGroupOpen(group))
      newOpened.add(group.id);
    else
      newOpened.delete(group.id);
    opened.value = newOpened;
  }
  function extractRows(items) {
    function dive(group) {
      const arr = [];
      for (const item of group.items) {
        if ("type" in item && item.type === "group") {
          arr.push(...dive(item));
        } else {
          arr.push(item);
        }
      }
      return arr;
    }
    return dive({
      type: "group",
      items,
      id: "dummy",
      key: "dummy",
      value: "dummy",
      depth: 0
    });
  }
  const data = {
    sortByWithGroups,
    toggleGroup,
    opened,
    groupBy,
    extractRows,
    isGroupOpen
  };
  provide(VDataTableGroupSymbol, data);
  return data;
}
function useGroupBy() {
  const data = inject$1(VDataTableGroupSymbol);
  if (!data)
    throw new Error("Missing group!");
  return data;
}
function groupItemsByProperty(items, groupBy) {
  if (!items.length)
    return [];
  const groups = /* @__PURE__ */ new Map();
  for (const item of items) {
    const value = getObjectValueByPath(item.raw, groupBy);
    if (!groups.has(value)) {
      groups.set(value, []);
    }
    groups.get(value).push(item);
  }
  return groups;
}
function groupItems(items, groupBy) {
  let depth = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : 0;
  let prefix = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : "root";
  if (!groupBy.length)
    return [];
  const groupedItems = groupItemsByProperty(items, groupBy[0]);
  const groups = [];
  const rest = groupBy.slice(1);
  groupedItems.forEach((items2, value) => {
    const key = groupBy[0];
    const id = `${prefix}_${key}_${value}`;
    groups.push({
      depth,
      id,
      key,
      value,
      items: rest.length ? groupItems(items2, rest, depth + 1, id) : items2,
      type: "group"
    });
  });
  return groups;
}
function flattenItems(items, opened) {
  const flatItems = [];
  for (const item of items) {
    if ("type" in item && item.type === "group") {
      if (item.value != null) {
        flatItems.push(item);
      }
      if (opened.has(item.id) || item.value == null) {
        flatItems.push(...flattenItems(item.items, opened));
      }
    } else {
      flatItems.push(item);
    }
  }
  return flatItems;
}
function useGroupedItems(items, groupBy, opened) {
  const flatItems = computed(() => {
    if (!groupBy.value.length)
      return items.value;
    const groupedItems = groupItems(items.value, groupBy.value.map((item) => item.key));
    return flattenItems(groupedItems, opened.value);
  });
  return {
    flatItems
  };
}
function useOptions(_ref) {
  let {
    page,
    itemsPerPage,
    sortBy,
    groupBy,
    search
  } = _ref;
  const vm = getCurrentInstance("VDataTable");
  const options = computed(() => ({
    page: page.value,
    itemsPerPage: itemsPerPage.value,
    sortBy: sortBy.value,
    groupBy: groupBy.value,
    search: search.value
  }));
  let oldOptions = null;
  watch(options, () => {
    if (deepEqual(oldOptions, options.value))
      return;
    if (oldOptions?.search !== options.value.search) {
      page.value = 1;
    }
    vm.emit("update:options", options.value);
    oldOptions = options.value;
  }, {
    deep: true,
    immediate: true
  });
}
const makeDataTablePaginateProps = propsFactory({
  page: {
    type: [Number, String],
    default: 1
  },
  itemsPerPage: {
    type: [Number, String],
    default: 10
  }
}, "DataTable-paginate");
const VDataTablePaginationSymbol = Symbol.for("vuetify:data-table-pagination");
function createPagination(props) {
  const page = useProxiedModel(props, "page", void 0, (value) => +(value ?? 1));
  const itemsPerPage = useProxiedModel(props, "itemsPerPage", void 0, (value) => +(value ?? 10));
  return {
    page,
    itemsPerPage
  };
}
function providePagination(options) {
  const {
    page,
    itemsPerPage,
    itemsLength
  } = options;
  const startIndex = computed(() => {
    if (itemsPerPage.value === -1)
      return 0;
    return itemsPerPage.value * (page.value - 1);
  });
  const stopIndex = computed(() => {
    if (itemsPerPage.value === -1)
      return itemsLength.value;
    return Math.min(itemsLength.value, startIndex.value + itemsPerPage.value);
  });
  const pageCount = computed(() => {
    if (itemsPerPage.value === -1 || itemsLength.value === 0)
      return 1;
    return Math.ceil(itemsLength.value / itemsPerPage.value);
  });
  watchEffect(() => {
    if (page.value > pageCount.value) {
      page.value = pageCount.value;
    }
  });
  function setItemsPerPage(value) {
    itemsPerPage.value = value;
    page.value = 1;
  }
  function nextPage() {
    page.value = clamp(page.value + 1, 1, pageCount.value);
  }
  function prevPage() {
    page.value = clamp(page.value - 1, 1, pageCount.value);
  }
  function setPage(value) {
    page.value = clamp(value, 1, pageCount.value);
  }
  const data = {
    page,
    itemsPerPage,
    startIndex,
    stopIndex,
    pageCount,
    itemsLength,
    nextPage,
    prevPage,
    setPage,
    setItemsPerPage
  };
  provide(VDataTablePaginationSymbol, data);
  return data;
}
function usePagination() {
  const data = inject$1(VDataTablePaginationSymbol);
  if (!data)
    throw new Error("Missing pagination!");
  return data;
}
function usePaginatedItems(options) {
  const {
    items,
    startIndex,
    stopIndex,
    itemsPerPage
  } = options;
  const paginatedItems = computed(() => {
    if (itemsPerPage.value <= 0)
      return items.value;
    return items.value.slice(startIndex.value, stopIndex.value);
  });
  return {
    paginatedItems
  };
}
const singleSelectStrategy = {
  showSelectAll: false,
  allSelected: () => [],
  select: (_ref) => {
    let {
      items,
      value
    } = _ref;
    return new Set(value ? [items[0]?.value] : []);
  },
  selectAll: (_ref2) => {
    let {
      selected
    } = _ref2;
    return selected;
  }
};
const pageSelectStrategy = {
  showSelectAll: true,
  allSelected: (_ref3) => {
    let {
      currentPage
    } = _ref3;
    return currentPage;
  },
  select: (_ref4) => {
    let {
      items,
      value,
      selected
    } = _ref4;
    for (const item of items) {
      if (value)
        selected.add(item.value);
      else
        selected.delete(item.value);
    }
    return selected;
  },
  selectAll: (_ref5) => {
    let {
      value,
      currentPage,
      selected
    } = _ref5;
    return pageSelectStrategy.select({
      items: currentPage,
      value,
      selected
    });
  }
};
const allSelectStrategy = {
  showSelectAll: true,
  allSelected: (_ref6) => {
    let {
      allItems
    } = _ref6;
    return allItems;
  },
  select: (_ref7) => {
    let {
      items,
      value,
      selected
    } = _ref7;
    for (const item of items) {
      if (value)
        selected.add(item.value);
      else
        selected.delete(item.value);
    }
    return selected;
  },
  selectAll: (_ref8) => {
    let {
      value,
      allItems,
      selected
    } = _ref8;
    return allSelectStrategy.select({
      items: allItems,
      value,
      selected
    });
  }
};
const makeDataTableSelectProps = propsFactory({
  showSelect: Boolean,
  selectStrategy: {
    type: [String, Object],
    default: "page"
  },
  modelValue: {
    type: Array,
    default: () => []
  },
  valueComparator: {
    type: Function,
    default: deepEqual
  }
}, "DataTable-select");
const VDataTableSelectionSymbol = Symbol.for("vuetify:data-table-selection");
function provideSelection(props, _ref9) {
  let {
    allItems,
    currentPage
  } = _ref9;
  const selected = useProxiedModel(props, "modelValue", props.modelValue, (v) => {
    return new Set(wrapInArray(v).map((v2) => {
      return allItems.value.find((item) => props.valueComparator(v2, item.value))?.value ?? v2;
    }));
  }, (v) => {
    return [...v.values()];
  });
  const allSelectable = computed(() => allItems.value.filter((item) => item.selectable));
  const currentPageSelectable = computed(() => currentPage.value.filter((item) => item.selectable));
  const selectStrategy = computed(() => {
    if (typeof props.selectStrategy === "object")
      return props.selectStrategy;
    switch (props.selectStrategy) {
      case "single":
        return singleSelectStrategy;
      case "all":
        return allSelectStrategy;
      case "page":
      default:
        return pageSelectStrategy;
    }
  });
  function isSelected(items) {
    return wrapInArray(items).every((item) => selected.value.has(item.value));
  }
  function isSomeSelected(items) {
    return wrapInArray(items).some((item) => selected.value.has(item.value));
  }
  function select(items, value) {
    const newSelected = selectStrategy.value.select({
      items,
      value,
      selected: new Set(selected.value)
    });
    selected.value = newSelected;
  }
  function toggleSelect(item) {
    select([item], !isSelected([item]));
  }
  function selectAll(value) {
    const newSelected = selectStrategy.value.selectAll({
      value,
      allItems: allSelectable.value,
      currentPage: currentPageSelectable.value,
      selected: new Set(selected.value)
    });
    selected.value = newSelected;
  }
  const someSelected = computed(() => selected.value.size > 0);
  const allSelected = computed(() => {
    const items = selectStrategy.value.allSelected({
      allItems: allSelectable.value,
      currentPage: currentPageSelectable.value
    });
    return !!items.length && isSelected(items);
  });
  const data = {
    toggleSelect,
    select,
    selectAll,
    isSelected,
    isSomeSelected,
    someSelected,
    allSelected,
    showSelectAll: selectStrategy.value.showSelectAll
  };
  provide(VDataTableSelectionSymbol, data);
  return data;
}
function useSelection() {
  const data = inject$1(VDataTableSelectionSymbol);
  if (!data)
    throw new Error("Missing selection!");
  return data;
}
const makeDataTableSortProps = propsFactory({
  sortBy: {
    type: Array,
    default: () => []
  },
  customKeySort: Object,
  multiSort: Boolean,
  mustSort: Boolean
}, "DataTable-sort");
const VDataTableSortSymbol = Symbol.for("vuetify:data-table-sort");
function createSort(props) {
  const sortBy = useProxiedModel(props, "sortBy");
  const mustSort = toRef(props, "mustSort");
  const multiSort = toRef(props, "multiSort");
  return {
    sortBy,
    mustSort,
    multiSort
  };
}
function provideSort(options) {
  const {
    sortBy,
    mustSort,
    multiSort,
    page
  } = options;
  const toggleSort = (column) => {
    if (column.key == null)
      return;
    let newSortBy = sortBy.value.map((x) => ({
      ...x
    })) ?? [];
    const item = newSortBy.find((x) => x.key === column.key);
    if (!item) {
      if (multiSort.value)
        newSortBy = [...newSortBy, {
          key: column.key,
          order: "asc"
        }];
      else
        newSortBy = [{
          key: column.key,
          order: "asc"
        }];
    } else if (item.order === "desc") {
      if (mustSort.value) {
        item.order = "asc";
      } else {
        newSortBy = newSortBy.filter((x) => x.key !== column.key);
      }
    } else {
      item.order = "desc";
    }
    sortBy.value = newSortBy;
    if (page)
      page.value = 1;
  };
  function isSorted(column) {
    return !!sortBy.value.find((item) => item.key === column.key);
  }
  const data = {
    sortBy,
    toggleSort,
    isSorted
  };
  provide(VDataTableSortSymbol, data);
  return data;
}
function useSort() {
  const data = inject$1(VDataTableSortSymbol);
  if (!data)
    throw new Error("Missing sort!");
  return data;
}
function useSortedItems(props, items, sortBy, sortFunctions) {
  const locale = useLocale();
  const sortedItems = computed(() => {
    if (!sortBy.value.length)
      return items.value;
    return sortItems(items.value, sortBy.value, locale.current.value, {
      ...props.customKeySort,
      ...sortFunctions?.value
    });
  });
  return {
    sortedItems
  };
}
function sortItems(items, sortByItems, locale, customSorters) {
  const stringCollator = new Intl.Collator(locale, {
    sensitivity: "accent",
    usage: "sort"
  });
  return [...items].sort((a, b) => {
    for (let i = 0; i < sortByItems.length; i++) {
      const sortKey = sortByItems[i].key;
      const sortOrder = sortByItems[i].order ?? "asc";
      if (sortOrder === false)
        continue;
      let sortA = getObjectValueByPath(a.raw, sortKey);
      let sortB = getObjectValueByPath(b.raw, sortKey);
      if (sortOrder === "desc") {
        [sortA, sortB] = [sortB, sortA];
      }
      if (customSorters?.[sortKey]) {
        const customResult = customSorters[sortKey](sortA, sortB);
        if (!customResult)
          continue;
        return customResult;
      }
      if (sortA instanceof Date && sortB instanceof Date) {
        return sortA.getTime() - sortB.getTime();
      }
      [sortA, sortB] = [sortA, sortB].map((s) => s != null ? s.toString().toLocaleLowerCase() : s);
      if (sortA !== sortB) {
        if (isEmpty(sortA) && isEmpty(sortB))
          return 0;
        if (isEmpty(sortA))
          return -1;
        if (isEmpty(sortB))
          return 1;
        if (!isNaN(sortA) && !isNaN(sortB))
          return Number(sortA) - Number(sortB);
        return stringCollator.compare(sortA, sortB);
      }
    }
    return 0;
  });
}
const makeDataIteratorItemsProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  itemValue: {
    type: [String, Array, Function],
    default: "id"
  },
  itemSelectable: {
    type: [String, Array, Function],
    default: null
  },
  returnObject: Boolean
}, "DataIterator-items");
function transformItem$1(props, item) {
  const value = props.returnObject ? item : getPropertyFromItem(item, props.itemValue);
  const selectable = getPropertyFromItem(item, props.itemSelectable, true);
  return {
    type: "item",
    value,
    selectable,
    raw: item
  };
}
function transformItems$1(props, items) {
  const array = [];
  for (const item of items) {
    array.push(transformItem$1(props, item));
  }
  return array;
}
function useDataIteratorItems(props) {
  const items = computed(() => transformItems$1(props, props.items));
  return {
    items
  };
}
const makeVDataIteratorProps = propsFactory({
  search: String,
  loading: Boolean,
  ...makeComponentProps(),
  ...makeDataIteratorItemsProps(),
  ...makeDataTableSelectProps(),
  ...makeDataTableSortProps(),
  ...makeDataTablePaginateProps({
    itemsPerPage: 5
  }),
  ...makeDataTableExpandProps(),
  ...makeDataTableGroupProps(),
  ...makeFilterProps(),
  ...makeTagProps()
}, "VDataIterator");
const VDataIterator = genericComponent()({
  name: "VDataIterator",
  props: makeVDataIteratorProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:groupBy": (value) => true,
    "update:page": (value) => true,
    "update:itemsPerPage": (value) => true,
    "update:sortBy": (value) => true,
    "update:options": (value) => true,
    "update:expanded": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const groupBy = useProxiedModel(props, "groupBy");
    const search = toRef(props, "search");
    const {
      items
    } = useDataIteratorItems(props);
    const {
      filteredItems
    } = useFilter(props, items, search, {
      transform: (item) => item.raw
    });
    const {
      sortBy,
      multiSort,
      mustSort
    } = createSort(props);
    const {
      page,
      itemsPerPage
    } = createPagination(props);
    const {
      toggleSort
    } = provideSort({
      sortBy,
      multiSort,
      mustSort,
      page
    });
    const {
      sortByWithGroups,
      opened,
      extractRows,
      isGroupOpen,
      toggleGroup
    } = provideGroupBy({
      groupBy,
      sortBy
    });
    const {
      sortedItems
    } = useSortedItems(props, filteredItems, sortByWithGroups);
    const {
      flatItems
    } = useGroupedItems(sortedItems, groupBy, opened);
    const itemsLength = computed(() => flatItems.value.length);
    const {
      startIndex,
      stopIndex,
      pageCount,
      prevPage,
      nextPage,
      setItemsPerPage,
      setPage
    } = providePagination({
      page,
      itemsPerPage,
      itemsLength
    });
    const {
      paginatedItems
    } = usePaginatedItems({
      items: flatItems,
      startIndex,
      stopIndex,
      itemsPerPage
    });
    const paginatedItemsWithoutGroups = computed(() => extractRows(paginatedItems.value));
    const {
      isSelected,
      select,
      selectAll,
      toggleSelect
    } = provideSelection(props, {
      allItems: items,
      currentPage: paginatedItemsWithoutGroups
    });
    const {
      isExpanded,
      toggleExpand
    } = provideExpanded(props);
    useOptions({
      page,
      itemsPerPage,
      sortBy,
      groupBy,
      search
    });
    const slotProps = computed(() => ({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
      pageCount: pageCount.value,
      toggleSort,
      prevPage,
      nextPage,
      setPage,
      setItemsPerPage,
      isSelected,
      select,
      selectAll,
      toggleSelect,
      isExpanded,
      toggleExpand,
      isGroupOpen,
      toggleGroup,
      items: paginatedItemsWithoutGroups.value,
      groupedItems: paginatedItems.value
    }));
    useRender(() => createVNode(props.tag, {
      "class": ["v-data-iterator", props.class],
      "style": props.style
    }, {
      default: () => [slots.header?.(slotProps.value), !paginatedItems.value.length ? slots["no-data"]?.() : slots.default?.(slotProps.value), slots.footer?.(slotProps.value)]
    }));
    return {};
  }
});
const VDataTable$1 = "";
const VDataTableFooter$1 = "";
const VPagination$1 = "";
function useRefs() {
  const refs = ref([]);
  onBeforeUpdate(() => refs.value = []);
  function updateRef(e, i) {
    refs.value[i] = e;
  }
  return {
    refs,
    updateRef
  };
}
const makeVPaginationProps = propsFactory({
  activeColor: String,
  start: {
    type: [Number, String],
    default: 1
  },
  modelValue: {
    type: Number,
    default: (props) => props.start
  },
  disabled: Boolean,
  length: {
    type: [Number, String],
    default: 1,
    validator: (val) => val % 1 === 0
  },
  totalVisible: [Number, String],
  firstIcon: {
    type: IconValue,
    default: "$first"
  },
  prevIcon: {
    type: IconValue,
    default: "$prev"
  },
  nextIcon: {
    type: IconValue,
    default: "$next"
  },
  lastIcon: {
    type: IconValue,
    default: "$last"
  },
  ariaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.root"
  },
  pageAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.page"
  },
  currentPageAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.currentPage"
  },
  firstAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.first"
  },
  previousAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.previous"
  },
  nextAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.next"
  },
  lastAriaLabel: {
    type: String,
    default: "$vuetify.pagination.ariaLabel.last"
  },
  ellipsis: {
    type: String,
    default: "..."
  },
  showFirstLastPage: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "nav"
  }),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VPagination");
const VPagination = genericComponent()({
  name: "VPagination",
  props: makeVPaginationProps(),
  emits: {
    "update:modelValue": (value) => true,
    first: (value) => true,
    prev: (value) => true,
    next: (value) => true,
    last: (value) => true
  },
  setup(props, _ref) {
    let {
      slots,
      emit: emit2
    } = _ref;
    const page = useProxiedModel(props, "modelValue");
    const {
      t,
      n
    } = useLocale();
    const {
      isRtl
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      width
    } = useDisplay();
    const maxButtons = shallowRef(-1);
    provideDefaults(void 0, {
      scoped: true
    });
    const {
      resizeRef
    } = useResizeObserver((entries) => {
      if (!entries.length)
        return;
      const {
        target,
        contentRect
      } = entries[0];
      const firstItem = target.querySelector(".v-pagination__list > *");
      if (!firstItem)
        return;
      const totalWidth = contentRect.width;
      const itemWidth = firstItem.offsetWidth + parseFloat(getComputedStyle(firstItem).marginRight) * 2;
      maxButtons.value = getMax(totalWidth, itemWidth);
    });
    const length = computed(() => parseInt(props.length, 10));
    const start = computed(() => parseInt(props.start, 10));
    const totalVisible = computed(() => {
      if (props.totalVisible != null)
        return parseInt(props.totalVisible, 10);
      else if (maxButtons.value >= 0)
        return maxButtons.value;
      return getMax(width.value, 58);
    });
    function getMax(totalWidth, itemWidth) {
      const minButtons = props.showFirstLastPage ? 5 : 3;
      return Math.max(0, Math.floor(
        // Round to two decimal places to avoid floating point errors
        +((totalWidth - itemWidth * minButtons) / itemWidth).toFixed(2)
      ));
    }
    const range = computed(() => {
      if (length.value <= 0 || isNaN(length.value) || length.value > Number.MAX_SAFE_INTEGER)
        return [];
      if (totalVisible.value <= 0)
        return [];
      else if (totalVisible.value === 1)
        return [page.value];
      if (length.value <= totalVisible.value) {
        return createRange(length.value, start.value);
      }
      const even = totalVisible.value % 2 === 0;
      const middle = even ? totalVisible.value / 2 : Math.floor(totalVisible.value / 2);
      const left = even ? middle : middle + 1;
      const right = length.value - middle;
      if (left - page.value >= 0) {
        return [...createRange(Math.max(1, totalVisible.value - 1), start.value), props.ellipsis, length.value];
      } else if (page.value - right >= (even ? 1 : 0)) {
        const rangeLength = totalVisible.value - 1;
        const rangeStart = length.value - rangeLength + start.value;
        return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart)];
      } else {
        const rangeLength = Math.max(1, totalVisible.value - 3);
        const rangeStart = rangeLength === 1 ? page.value : page.value - Math.ceil(rangeLength / 2) + start.value;
        return [start.value, props.ellipsis, ...createRange(rangeLength, rangeStart), props.ellipsis, length.value];
      }
    });
    function setValue(e, value, event) {
      e.preventDefault();
      page.value = value;
      event && emit2(event, value);
    }
    const {
      refs,
      updateRef
    } = useRefs();
    provideDefaults({
      VPaginationBtn: {
        color: toRef(props, "color"),
        border: toRef(props, "border"),
        density: toRef(props, "density"),
        size: toRef(props, "size"),
        variant: toRef(props, "variant"),
        rounded: toRef(props, "rounded"),
        elevation: toRef(props, "elevation")
      }
    });
    const items = computed(() => {
      return range.value.map((item, index) => {
        const ref2 = (e) => updateRef(e, index);
        if (typeof item === "string") {
          return {
            isActive: false,
            key: `ellipsis-${index}`,
            page: item,
            props: {
              ref: ref2,
              ellipsis: true,
              icon: true,
              disabled: true
            }
          };
        } else {
          const isActive = item === page.value;
          return {
            isActive,
            key: item,
            page: n(item),
            props: {
              ref: ref2,
              ellipsis: false,
              icon: true,
              disabled: !!props.disabled || +props.length < 2,
              color: isActive ? props.activeColor : props.color,
              ariaCurrent: isActive,
              ariaLabel: t(isActive ? props.currentPageAriaLabel : props.pageAriaLabel, item),
              onClick: (e) => setValue(e, item)
            }
          };
        }
      });
    });
    const controls = computed(() => {
      const prevDisabled = !!props.disabled || page.value <= start.value;
      const nextDisabled = !!props.disabled || page.value >= start.value + length.value - 1;
      return {
        first: props.showFirstLastPage ? {
          icon: isRtl.value ? props.lastIcon : props.firstIcon,
          onClick: (e) => setValue(e, start.value, "first"),
          disabled: prevDisabled,
          ariaLabel: t(props.firstAriaLabel),
          ariaDisabled: prevDisabled
        } : void 0,
        prev: {
          icon: isRtl.value ? props.nextIcon : props.prevIcon,
          onClick: (e) => setValue(e, page.value - 1, "prev"),
          disabled: prevDisabled,
          ariaLabel: t(props.previousAriaLabel),
          ariaDisabled: prevDisabled
        },
        next: {
          icon: isRtl.value ? props.prevIcon : props.nextIcon,
          onClick: (e) => setValue(e, page.value + 1, "next"),
          disabled: nextDisabled,
          ariaLabel: t(props.nextAriaLabel),
          ariaDisabled: nextDisabled
        },
        last: props.showFirstLastPage ? {
          icon: isRtl.value ? props.firstIcon : props.lastIcon,
          onClick: (e) => setValue(e, start.value + length.value - 1, "last"),
          disabled: nextDisabled,
          ariaLabel: t(props.lastAriaLabel),
          ariaDisabled: nextDisabled
        } : void 0
      };
    });
    function updateFocus() {
      const currentIndex = page.value - start.value;
      refs.value[currentIndex]?.$el.focus();
    }
    function onKeydown(e) {
      if (e.key === keyValues.left && !props.disabled && page.value > +props.start) {
        page.value = page.value - 1;
        nextTick(updateFocus);
      } else if (e.key === keyValues.right && !props.disabled && page.value < start.value + length.value - 1) {
        page.value = page.value + 1;
        nextTick(updateFocus);
      }
    }
    useRender(() => createVNode(props.tag, {
      "ref": resizeRef,
      "class": ["v-pagination", themeClasses.value, props.class],
      "style": props.style,
      "role": "navigation",
      "aria-label": t(props.ariaLabel),
      "onKeydown": onKeydown,
      "data-test": "v-pagination-root"
    }, {
      default: () => [createVNode("ul", {
        "class": "v-pagination__list"
      }, [props.showFirstLastPage && createVNode("li", {
        "key": "first",
        "class": "v-pagination__first",
        "data-test": "v-pagination-first"
      }, [slots.first ? slots.first(controls.value.first) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.first), null)]), createVNode("li", {
        "key": "prev",
        "class": "v-pagination__prev",
        "data-test": "v-pagination-prev"
      }, [slots.prev ? slots.prev(controls.value.prev) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.prev), null)]), items.value.map((item, index) => createVNode("li", {
        "key": item.key,
        "class": ["v-pagination__item", {
          "v-pagination__item--is-active": item.isActive
        }],
        "data-test": "v-pagination-item"
      }, [slots.item ? slots.item(item) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, item.props), {
        default: () => [item.page]
      })])), createVNode("li", {
        "key": "next",
        "class": "v-pagination__next",
        "data-test": "v-pagination-next"
      }, [slots.next ? slots.next(controls.value.next) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.next), null)]), props.showFirstLastPage && createVNode("li", {
        "key": "last",
        "class": "v-pagination__last",
        "data-test": "v-pagination-last"
      }, [slots.last ? slots.last(controls.value.last) : createVNode(VBtn, mergeProps({
        "_as": "VPaginationBtn"
      }, controls.value.last), null)])])]
    }));
    return {};
  }
});
const makeVDataTableFooterProps = propsFactory({
  prevIcon: {
    type: String,
    default: "$prev"
  },
  nextIcon: {
    type: String,
    default: "$next"
  },
  firstIcon: {
    type: String,
    default: "$first"
  },
  lastIcon: {
    type: String,
    default: "$last"
  },
  itemsPerPageText: {
    type: String,
    default: "$vuetify.dataFooter.itemsPerPageText"
  },
  pageText: {
    type: String,
    default: "$vuetify.dataFooter.pageText"
  },
  firstPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.firstPage"
  },
  prevPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.prevPage"
  },
  nextPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.nextPage"
  },
  lastPageLabel: {
    type: String,
    default: "$vuetify.dataFooter.lastPage"
  },
  itemsPerPageOptions: {
    type: Array,
    default: () => [{
      value: 10,
      title: "10"
    }, {
      value: 25,
      title: "25"
    }, {
      value: 50,
      title: "50"
    }, {
      value: 100,
      title: "100"
    }, {
      value: -1,
      title: "$vuetify.dataFooter.itemsPerPageAll"
    }]
  },
  showCurrentPage: Boolean
}, "VDataTableFooter");
const VDataTableFooter = genericComponent()({
  name: "VDataTableFooter",
  props: makeVDataTableFooterProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      page,
      pageCount,
      startIndex,
      stopIndex,
      itemsLength,
      itemsPerPage,
      setItemsPerPage
    } = usePagination();
    const itemsPerPageOptions = computed(() => props.itemsPerPageOptions.map((option) => {
      if (typeof option === "number") {
        return {
          value: option,
          title: option === -1 ? t("$vuetify.dataFooter.itemsPerPageAll") : String(option)
        };
      }
      return {
        ...option,
        title: t(option.title)
      };
    }));
    useRender(() => createVNode("div", {
      "class": "v-data-table-footer"
    }, [slots.prepend?.(), createVNode("div", {
      "class": "v-data-table-footer__items-per-page"
    }, [createVNode("span", null, [t(props.itemsPerPageText)]), createVNode(VSelect, {
      "items": itemsPerPageOptions.value,
      "modelValue": itemsPerPage.value,
      "onUpdate:modelValue": (v) => setItemsPerPage(Number(v)),
      "density": "compact",
      "variant": "outlined",
      "hide-details": true
    }, null)]), createVNode("div", {
      "class": "v-data-table-footer__info"
    }, [createVNode("div", null, [t(props.pageText, !itemsLength.value ? 0 : startIndex.value + 1, stopIndex.value, itemsLength.value)])]), createVNode("div", {
      "class": "v-data-table-footer__pagination"
    }, [createVNode(VPagination, {
      "modelValue": page.value,
      "onUpdate:modelValue": ($event) => page.value = $event,
      "density": "comfortable",
      "first-aria-label": props.firstPageLabel,
      "last-aria-label": props.lastPageLabel,
      "length": pageCount.value,
      "next-aria-label": props.nextPageLabel,
      "prev-aria-label": props.prevPageLabel,
      "rounded": true,
      "show-first-last-page": true,
      "total-visible": props.showCurrentPage ? 1 : 0,
      "variant": "plain"
    }, null)])]));
    return {};
  }
});
const VDataTableColumn = defineFunctionalComponent({
  align: {
    type: String,
    default: "start"
  },
  fixed: Boolean,
  fixedOffset: [Number, String],
  height: [Number, String],
  lastFixed: Boolean,
  noPadding: Boolean,
  tag: String,
  width: [Number, String]
}, (props, _ref) => {
  let {
    slots
  } = _ref;
  const Tag = props.tag ?? "td";
  return createVNode(Tag, {
    "class": ["v-data-table__td", {
      "v-data-table-column--fixed": props.fixed,
      "v-data-table-column--last-fixed": props.lastFixed,
      "v-data-table-column--no-padding": props.noPadding
    }, `v-data-table-column--align-${props.align}`],
    "style": {
      height: convertToUnit(props.height),
      width: convertToUnit(props.width),
      left: convertToUnit(props.fixedOffset || null)
    }
  }, {
    default: () => [slots.default?.()]
  });
});
const makeDataTableHeaderProps = propsFactory({
  headers: Array
}, "DataTable-header");
const VDataTableHeadersSymbol = Symbol.for("vuetify:data-table-headers");
const defaultHeader = {
  title: "",
  sortable: false
};
const defaultActionHeader = {
  ...defaultHeader,
  width: 48
};
function priorityQueue() {
  let arr = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  const queue2 = arr.map((element) => ({
    element,
    priority: 0
  }));
  return {
    enqueue: (element, priority) => {
      let added = false;
      for (let i = 0; i < queue2.length; i++) {
        const item = queue2[i];
        if (item.priority > priority) {
          queue2.splice(i, 0, {
            element,
            priority
          });
          added = true;
          break;
        }
      }
      if (!added)
        queue2.push({
          element,
          priority
        });
    },
    size: () => queue2.length,
    count: () => {
      let count = 0;
      if (!queue2.length)
        return 0;
      const whole = Math.floor(queue2[0].priority);
      for (let i = 0; i < queue2.length; i++) {
        if (Math.floor(queue2[i].priority) === whole)
          count += 1;
      }
      return count;
    },
    dequeue: () => {
      return queue2.shift();
    }
  };
}
function extractLeaves(item) {
  let columns = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  if (!item.children) {
    columns.push(item);
  } else {
    for (const child of item.children) {
      extractLeaves(child, columns);
    }
  }
  return columns;
}
function extractKeys(headers) {
  let keys2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : /* @__PURE__ */ new Set();
  for (const item of headers) {
    if (item.key)
      keys2.add(item.key);
    if (item.children) {
      extractKeys(item.children, keys2);
    }
  }
  return keys2;
}
function getDefaultItem(item) {
  if (!item.key)
    return void 0;
  if (item.key === "data-table-group")
    return defaultHeader;
  if (["data-table-expand", "data-table-select"].includes(item.key))
    return defaultActionHeader;
  return void 0;
}
function getDepth(item) {
  let depth = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  if (!item.children)
    return depth;
  return Math.max(depth, ...item.children.map((child) => getDepth(child, depth + 1)));
}
function parseFixedColumns(items) {
  let seenFixed = false;
  function setFixed(item) {
    let parentFixed = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (!item)
      return;
    if (parentFixed) {
      item.fixed = true;
    }
    if (item.fixed) {
      if (item.children) {
        for (let i = item.children.length - 1; i >= 0; i--) {
          setFixed(item.children[i], true);
        }
      } else {
        if (!seenFixed) {
          item.lastFixed = true;
        } else if (isNaN(+item.width)) {
          consoleError(`Multiple fixed columns should have a static width (key: ${item.key})`);
        }
        seenFixed = true;
      }
    } else {
      if (item.children) {
        for (let i = item.children.length - 1; i >= 0; i--) {
          setFixed(item.children[i]);
        }
      } else {
        seenFixed = false;
      }
    }
  }
  for (let i = items.length - 1; i >= 0; i--) {
    setFixed(items[i]);
  }
  function setFixedOffset(item) {
    let fixedOffset2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    if (!item)
      return fixedOffset2;
    if (item.children) {
      item.fixedOffset = fixedOffset2;
      for (const child of item.children) {
        fixedOffset2 = setFixedOffset(child, fixedOffset2);
      }
    } else if (item.fixed) {
      item.fixedOffset = fixedOffset2;
      fixedOffset2 += parseFloat(item.width || "0") || 0;
    }
    return fixedOffset2;
  }
  let fixedOffset = 0;
  for (const item of items) {
    fixedOffset = setFixedOffset(item, fixedOffset);
  }
}
function parse(items, maxDepth) {
  const headers = [];
  let currentDepth = 0;
  const queue2 = priorityQueue(items);
  while (queue2.size() > 0) {
    let rowSize = queue2.count();
    const row = [];
    let fraction = 1;
    while (rowSize > 0) {
      const {
        element: item,
        priority
      } = queue2.dequeue();
      const diff = maxDepth - currentDepth - getDepth(item);
      row.push({
        ...item,
        rowspan: diff ?? 1,
        colspan: item.children ? extractLeaves(item).length : 1
      });
      if (item.children) {
        for (const child of item.children) {
          const sort = priority % 1 + fraction / Math.pow(10, currentDepth + 2);
          queue2.enqueue(child, currentDepth + diff + sort);
        }
      }
      fraction += 1;
      rowSize -= 1;
    }
    currentDepth += 1;
    headers.push(row);
  }
  const columns = items.map((item) => extractLeaves(item)).flat();
  return {
    columns,
    headers
  };
}
function convertToInternalHeaders(items) {
  const internalHeaders = [];
  for (const item of items) {
    const defaultItem = {
      ...getDefaultItem(item),
      ...item
    };
    const key = defaultItem.key ?? (typeof defaultItem.value === "string" ? defaultItem.value : null);
    const value = defaultItem.value ?? key ?? null;
    const internalItem = {
      ...defaultItem,
      key,
      value,
      sortable: defaultItem.sortable ?? (defaultItem.key != null || !!defaultItem.sort),
      children: defaultItem.children ? convertToInternalHeaders(defaultItem.children) : void 0
    };
    internalHeaders.push(internalItem);
  }
  return internalHeaders;
}
function createHeaders(props, options) {
  const headers = ref([]);
  const columns = ref([]);
  const sortFunctions = ref();
  const filterFunctions = ref();
  watchEffect(() => {
    const _headers = props.headers || Object.keys(props.items[0] ?? {}).map((key) => ({
      key,
      title: capitalize(key)
    }));
    const items = _headers.slice();
    const keys2 = extractKeys(items);
    if (options?.groupBy?.value.length && !keys2.has("data-table-group")) {
      items.unshift({
        key: "data-table-group",
        title: "Group"
      });
    }
    if (options?.showSelect?.value && !keys2.has("data-table-select")) {
      items.unshift({
        key: "data-table-select"
      });
    }
    if (options?.showExpand?.value && !keys2.has("data-table-expand")) {
      items.push({
        key: "data-table-expand"
      });
    }
    const internalHeaders = convertToInternalHeaders(items);
    parseFixedColumns(internalHeaders);
    const maxDepth = Math.max(...internalHeaders.map((item) => getDepth(item))) + 1;
    const parsed = parse(internalHeaders, maxDepth);
    headers.value = parsed.headers;
    columns.value = parsed.columns;
    const flatHeaders = parsed.headers.flat(1);
    sortFunctions.value = flatHeaders.reduce((acc, header) => {
      if (header.sortable && header.key && header.sort) {
        acc[header.key] = header.sort;
      }
      return acc;
    }, {});
    filterFunctions.value = flatHeaders.reduce((acc, header) => {
      if (header.key && header.filter) {
        acc[header.key] = header.filter;
      }
      return acc;
    }, {});
  });
  const data = {
    headers,
    columns,
    sortFunctions,
    filterFunctions
  };
  provide(VDataTableHeadersSymbol, data);
  return data;
}
function useHeaders() {
  const data = inject$1(VDataTableHeadersSymbol);
  if (!data)
    throw new Error("Missing headers!");
  return data;
}
const makeVDataTableHeadersProps = propsFactory({
  color: String,
  sticky: Boolean,
  multiSort: Boolean,
  sortAscIcon: {
    type: IconValue,
    default: "$sortAsc"
  },
  sortDescIcon: {
    type: IconValue,
    default: "$sortDesc"
  },
  ...makeLoaderProps()
}, "VDataTableHeaders");
const VDataTableHeaders = genericComponent()({
  name: "VDataTableHeaders",
  props: makeVDataTableHeadersProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      toggleSort,
      sortBy,
      isSorted
    } = useSort();
    const {
      someSelected,
      allSelected,
      selectAll,
      showSelectAll
    } = useSelection();
    const {
      columns,
      headers
    } = useHeaders();
    const {
      loaderClasses
    } = useLoader(props);
    function getFixedStyles(column, y) {
      if (!props.sticky && !column.fixed)
        return void 0;
      return {
        position: "sticky",
        left: column.fixed ? convertToUnit(column.fixedOffset) : void 0,
        top: props.sticky ? `calc(var(--v-table-header-height) * ${y})` : void 0
      };
    }
    function getSortIcon(column) {
      const item = sortBy.value.find((item2) => item2.key === column.key);
      if (!item)
        return props.sortAscIcon;
      return item.order === "asc" ? props.sortAscIcon : props.sortDescIcon;
    }
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(props, "color");
    const slotProps = computed(() => ({
      headers: headers.value,
      columns: columns.value,
      toggleSort,
      isSorted,
      sortBy: sortBy.value,
      someSelected: someSelected.value,
      allSelected: allSelected.value,
      selectAll,
      getSortIcon
    }));
    const VDataTableHeaderCell = (_ref2) => {
      let {
        column,
        x,
        y
      } = _ref2;
      const noPadding = column.key === "data-table-select" || column.key === "data-table-expand";
      return createVNode(VDataTableColumn, mergeProps({
        "tag": "th",
        "align": column.align,
        "class": ["v-data-table__th", {
          "v-data-table__th--sortable": column.sortable,
          "v-data-table__th--sorted": isSorted(column),
          "v-data-table__th--fixed": column.fixed
        }, loaderClasses.value],
        "style": {
          width: convertToUnit(column.width),
          minWidth: convertToUnit(column.minWidth),
          ...getFixedStyles(column, y)
        },
        "colspan": column.colspan,
        "rowspan": column.rowspan,
        "onClick": column.sortable ? () => toggleSort(column) : void 0,
        "fixed": column.fixed,
        "lastFixed": column.lastFixed,
        "noPadding": noPadding
      }, column.headerProps), {
        default: () => {
          const columnSlotName = `header.${column.key}`;
          const columnSlotProps = {
            column,
            selectAll,
            isSorted,
            toggleSort,
            sortBy: sortBy.value,
            someSelected: someSelected.value,
            allSelected: allSelected.value,
            getSortIcon
          };
          if (slots[columnSlotName])
            return slots[columnSlotName](columnSlotProps);
          if (column.key === "data-table-select") {
            return slots["header.data-table-select"]?.(columnSlotProps) ?? (showSelectAll && createVNode(VCheckboxBtn, {
              "modelValue": allSelected.value,
              "indeterminate": someSelected.value && !allSelected.value,
              "onUpdate:modelValue": selectAll
            }, null));
          }
          return createVNode("div", {
            "class": "v-data-table-header__content"
          }, [createVNode("span", null, [column.title]), column.sortable && createVNode(VIcon, {
            "key": "icon",
            "class": "v-data-table-header__sort-icon",
            "icon": getSortIcon(column)
          }, null), props.multiSort && isSorted(column) && createVNode("div", {
            "key": "badge",
            "class": ["v-data-table-header__sort-badge", ...backgroundColorClasses.value],
            "style": backgroundColorStyles.value
          }, [sortBy.value.findIndex((x2) => x2.key === column.key) + 1])]);
        }
      });
    };
    useRender(() => {
      return createVNode(Fragment, null, [slots.headers ? slots.headers(slotProps.value) : headers.value.map((row, y) => createVNode("tr", null, [row.map((column, x) => createVNode(VDataTableHeaderCell, {
        "column": column,
        "x": x,
        "y": y
      }, null))])), props.loading && createVNode("tr", {
        "class": "v-data-table-progress"
      }, [createVNode("th", {
        "colspan": columns.value.length
      }, [createVNode(LoaderSlot, {
        "name": "v-data-table-progress",
        "absolute": true,
        "active": true,
        "color": typeof props.loading === "boolean" ? void 0 : props.loading,
        "indeterminate": true
      }, {
        default: slots.loader
      })])])]);
    });
  }
});
const makeVDataTableGroupHeaderRowProps = propsFactory({
  item: {
    type: Object,
    required: true
  }
}, "VDataTableGroupHeaderRow");
const VDataTableGroupHeaderRow = genericComponent()({
  name: "VDataTableGroupHeaderRow",
  props: makeVDataTableGroupHeaderRowProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isGroupOpen,
      toggleGroup,
      extractRows
    } = useGroupBy();
    const {
      isSelected,
      isSomeSelected,
      select
    } = useSelection();
    const {
      columns
    } = useHeaders();
    const rows = computed(() => {
      return extractRows([props.item]);
    });
    return () => createVNode("tr", {
      "class": "v-data-table-group-header-row",
      "style": {
        "--v-data-table-group-header-row-depth": props.item.depth
      }
    }, [columns.value.map((column) => {
      if (column.key === "data-table-group") {
        const icon = isGroupOpen(props.item) ? "$expand" : "$next";
        const onClick = () => toggleGroup(props.item);
        return slots["data-table-group"]?.({
          item: props.item,
          count: rows.value.length,
          props: {
            icon,
            onClick
          }
        }) ?? createVNode(VDataTableColumn, {
          "class": "v-data-table-group-header-row__column"
        }, {
          default: () => [createVNode(VBtn, {
            "size": "small",
            "variant": "text",
            "icon": icon,
            "onClick": onClick
          }, null), createVNode("span", null, [props.item.value]), createVNode("span", null, [createTextVNode("("), rows.value.length, createTextVNode(")")])]
        });
      }
      if (column.key === "data-table-select") {
        const modelValue = isSelected(rows.value);
        const indeterminate = isSomeSelected(rows.value) && !modelValue;
        const selectGroup = (v) => select(rows.value, v);
        return slots["data-table-select"]?.({
          props: {
            modelValue,
            indeterminate,
            "onUpdate:modelValue": selectGroup
          }
        }) ?? createVNode("td", null, [createVNode(VCheckboxBtn, {
          "modelValue": modelValue,
          "indeterminate": indeterminate,
          "onUpdate:modelValue": selectGroup
        }, null)]);
      }
      return createVNode("td", null, null);
    })]);
  }
});
const makeVDataTableRowProps = propsFactory({
  index: Number,
  item: Object,
  cellProps: [Object, Function],
  onClick: EventProp(),
  onContextmenu: EventProp(),
  onDblclick: EventProp()
}, "VDataTableRow");
const VDataTableRow = genericComponent()({
  name: "VDataTableRow",
  props: makeVDataTableRowProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isSelected,
      toggleSelect
    } = useSelection();
    const {
      isExpanded,
      toggleExpand
    } = useExpanded();
    const {
      columns
    } = useHeaders();
    useRender(() => createVNode("tr", {
      "class": ["v-data-table__tr", {
        "v-data-table__tr--clickable": !!(props.onClick || props.onContextmenu || props.onDblclick)
      }],
      "onClick": props.onClick,
      "onContextmenu": props.onContextmenu,
      "onDblclick": props.onDblclick
    }, [props.item && columns.value.map((column, i) => {
      const item = props.item;
      const slotName = `item.${column.key}`;
      const slotProps = {
        index: props.index,
        item: item.raw,
        internalItem: item,
        value: getObjectValueByPath(item.columns, column.key),
        column,
        isSelected,
        toggleSelect,
        isExpanded,
        toggleExpand
      };
      const cellProps = typeof props.cellProps === "function" ? props.cellProps({
        index: slotProps.index,
        item: slotProps.item,
        internalItem: slotProps.internalItem,
        value: slotProps.value,
        column
      }) : props.cellProps;
      const columnCellProps = typeof column.cellProps === "function" ? column.cellProps({
        index: slotProps.index,
        item: slotProps.item,
        internalItem: slotProps.internalItem,
        value: slotProps.value
      }) : column.cellProps;
      return createVNode(VDataTableColumn, mergeProps({
        "align": column.align,
        "fixed": column.fixed,
        "fixedOffset": column.fixedOffset,
        "lastFixed": column.lastFixed,
        "noPadding": column.key === "data-table-select" || column.key === "data-table-expand",
        "width": column.width
      }, cellProps, columnCellProps), {
        default: () => {
          if (slots[slotName])
            return slots[slotName](slotProps);
          if (column.key === "data-table-select") {
            return slots["item.data-table-select"]?.(slotProps) ?? createVNode(VCheckboxBtn, {
              "disabled": !item.selectable,
              "modelValue": isSelected([item]),
              "onClick": withModifiers(() => toggleSelect(item), ["stop"])
            }, null);
          }
          if (column.key === "data-table-expand") {
            return slots["item.data-table-expand"]?.(slotProps) ?? createVNode(VBtn, {
              "icon": isExpanded(item) ? "$collapse" : "$expand",
              "size": "small",
              "variant": "text",
              "onClick": withModifiers(() => toggleExpand(item), ["stop"])
            }, null);
          }
          return toDisplayString(slotProps.value);
        }
      });
    })]));
  }
});
const makeVDataTableRowsProps = propsFactory({
  loading: [Boolean, String],
  loadingText: {
    type: String,
    default: "$vuetify.dataIterator.loadingText"
  },
  hideNoData: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  noDataText: {
    type: String,
    default: "$vuetify.noDataText"
  },
  rowProps: [Object, Function],
  cellProps: [Object, Function]
}, "VDataTableRows");
const VDataTableRows = genericComponent()({
  name: "VDataTableRows",
  inheritAttrs: false,
  props: makeVDataTableRowsProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      columns
    } = useHeaders();
    const {
      expandOnClick,
      toggleExpand,
      isExpanded
    } = useExpanded();
    const {
      isSelected,
      toggleSelect
    } = useSelection();
    const {
      toggleGroup,
      isGroupOpen
    } = useGroupBy();
    const {
      t
    } = useLocale();
    useRender(() => {
      if (props.loading && (!props.items.length || slots.loading)) {
        return createVNode("tr", {
          "class": "v-data-table-rows-loading",
          "key": "loading"
        }, [createVNode("td", {
          "colspan": columns.value.length
        }, [slots.loading?.() ?? t(props.loadingText)])]);
      }
      if (!props.loading && !props.items.length && !props.hideNoData) {
        return createVNode("tr", {
          "class": "v-data-table-rows-no-data",
          "key": "no-data"
        }, [createVNode("td", {
          "colspan": columns.value.length
        }, [slots["no-data"]?.() ?? t(props.noDataText)])]);
      }
      return createVNode(Fragment, null, [props.items.map((item, index) => {
        if (item.type === "group") {
          const slotProps2 = {
            index,
            item,
            columns: columns.value,
            isExpanded,
            toggleExpand,
            isSelected,
            toggleSelect,
            toggleGroup,
            isGroupOpen
          };
          return slots["group-header"] ? slots["group-header"](slotProps2) : createVNode(VDataTableGroupHeaderRow, mergeProps({
            "key": `group-header_${item.id}`,
            "item": item
          }, getPrefixedEventHandlers(attrs, ":group-header", () => slotProps2)), slots);
        }
        const slotProps = {
          index,
          item: item.raw,
          internalItem: item,
          columns: columns.value,
          isExpanded,
          toggleExpand,
          isSelected,
          toggleSelect
        };
        const itemSlotProps = {
          ...slotProps,
          props: mergeProps({
            key: `item_${item.key ?? item.index}`,
            onClick: expandOnClick.value ? () => {
              toggleExpand(item);
            } : void 0,
            index,
            item,
            cellProps: props.cellProps
          }, getPrefixedEventHandlers(attrs, ":row", () => slotProps), typeof props.rowProps === "function" ? props.rowProps({
            item: slotProps.item,
            index: slotProps.index,
            internalItem: slotProps.internalItem
          }) : props.rowProps)
        };
        return createVNode(Fragment, {
          "key": itemSlotProps.props.key
        }, [slots.item ? slots.item(itemSlotProps) : createVNode(VDataTableRow, itemSlotProps.props, slots), isExpanded(item) && slots["expanded-row"]?.(slotProps)]);
      })]);
    });
    return {};
  }
});
const VTable$1 = "";
const makeVTableProps = propsFactory({
  fixedHeader: Boolean,
  fixedFooter: Boolean,
  height: [Number, String],
  hover: Boolean,
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VTable");
const VTable = genericComponent()({
  name: "VTable",
  props: makeVTableProps(),
  setup(props, _ref) {
    let {
      slots,
      emit: emit2
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    useRender(() => createVNode(props.tag, {
      "class": ["v-table", {
        "v-table--fixed-height": !!props.height,
        "v-table--fixed-header": props.fixedHeader,
        "v-table--fixed-footer": props.fixedFooter,
        "v-table--has-top": !!slots.top,
        "v-table--has-bottom": !!slots.bottom,
        "v-table--hover": props.hover
      }, themeClasses.value, densityClasses.value, props.class],
      "style": props.style
    }, {
      default: () => [slots.top?.(), slots.default ? createVNode("div", {
        "class": "v-table__wrapper",
        "style": {
          height: convertToUnit(props.height)
        }
      }, [createVNode("table", null, [slots.default()])]) : slots.wrapper?.(), slots.bottom?.()]
    }));
    return {};
  }
});
const makeDataTableItemsProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  itemValue: {
    type: [String, Array, Function],
    default: "id"
  },
  itemSelectable: {
    type: [String, Array, Function],
    default: null
  },
  rowProps: [Object, Function],
  cellProps: [Object, Function],
  returnObject: Boolean
}, "DataTable-items");
function transformItem(props, item, index, columns) {
  const value = props.returnObject ? item : getPropertyFromItem(item, props.itemValue);
  const selectable = getPropertyFromItem(item, props.itemSelectable, true);
  const itemColumns = columns.reduce((obj, column) => {
    if (column.key != null)
      obj[column.key] = getPropertyFromItem(item, column.value);
    return obj;
  }, {});
  return {
    type: "item",
    key: props.returnObject ? getPropertyFromItem(item, props.itemValue) : value,
    index,
    value,
    selectable,
    columns: itemColumns,
    raw: item
  };
}
function transformItems(props, items, columns) {
  return items.map((item, index) => transformItem(props, item, index, columns));
}
function useDataTableItems(props, columns) {
  const items = computed(() => transformItems(props, props.items, columns.value));
  return {
    items
  };
}
const makeDataTableProps = propsFactory({
  ...makeVDataTableRowsProps(),
  width: [String, Number],
  search: String,
  ...makeDataTableExpandProps(),
  ...makeDataTableGroupProps(),
  ...makeDataTableHeaderProps(),
  ...makeDataTableItemsProps(),
  ...makeDataTableSelectProps(),
  ...makeDataTableSortProps(),
  ...makeVDataTableHeadersProps(),
  ...makeVTableProps()
}, "DataTable");
const makeVDataTableProps = propsFactory({
  ...makeDataTablePaginateProps(),
  ...makeDataTableProps(),
  ...makeFilterProps(),
  ...makeVDataTableFooterProps()
}, "VDataTable");
const VDataTable = genericComponent()({
  name: "VDataTable",
  props: makeVDataTableProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:page": (value) => true,
    "update:itemsPerPage": (value) => true,
    "update:sortBy": (value) => true,
    "update:options": (value) => true,
    "update:groupBy": (value) => true,
    "update:expanded": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      groupBy
    } = createGroupBy(props);
    const {
      sortBy,
      multiSort,
      mustSort
    } = createSort(props);
    const {
      page,
      itemsPerPage
    } = createPagination(props);
    const {
      columns,
      headers,
      sortFunctions,
      filterFunctions
    } = createHeaders(props, {
      groupBy,
      showSelect: toRef(props, "showSelect"),
      showExpand: toRef(props, "showExpand")
    });
    const {
      items
    } = useDataTableItems(props, columns);
    const search = toRef(props, "search");
    const {
      filteredItems
    } = useFilter(props, items, search, {
      transform: (item) => item.columns,
      customKeyFilter: filterFunctions
    });
    const {
      toggleSort
    } = provideSort({
      sortBy,
      multiSort,
      mustSort,
      page
    });
    const {
      sortByWithGroups,
      opened,
      extractRows,
      isGroupOpen,
      toggleGroup
    } = provideGroupBy({
      groupBy,
      sortBy
    });
    const {
      sortedItems
    } = useSortedItems(props, filteredItems, sortByWithGroups, sortFunctions);
    const {
      flatItems
    } = useGroupedItems(sortedItems, groupBy, opened);
    const itemsLength = computed(() => flatItems.value.length);
    const {
      startIndex,
      stopIndex,
      pageCount,
      setItemsPerPage
    } = providePagination({
      page,
      itemsPerPage,
      itemsLength
    });
    const {
      paginatedItems
    } = usePaginatedItems({
      items: flatItems,
      startIndex,
      stopIndex,
      itemsPerPage
    });
    const paginatedItemsWithoutGroups = computed(() => extractRows(paginatedItems.value));
    const {
      isSelected,
      select,
      selectAll,
      toggleSelect,
      someSelected,
      allSelected
    } = provideSelection(props, {
      allItems: items,
      currentPage: paginatedItemsWithoutGroups
    });
    const {
      isExpanded,
      toggleExpand
    } = provideExpanded(props);
    useOptions({
      page,
      itemsPerPage,
      sortBy,
      groupBy,
      search
    });
    provideDefaults({
      VDataTableRows: {
        hideNoData: toRef(props, "hideNoData"),
        noDataText: toRef(props, "noDataText"),
        loading: toRef(props, "loading"),
        loadingText: toRef(props, "loadingText")
      }
    });
    const slotProps = computed(() => ({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
      pageCount: pageCount.value,
      toggleSort,
      setItemsPerPage,
      someSelected: someSelected.value,
      allSelected: allSelected.value,
      isSelected,
      select,
      selectAll,
      toggleSelect,
      isExpanded,
      toggleExpand,
      isGroupOpen,
      toggleGroup,
      items: paginatedItemsWithoutGroups.value.map((item) => item.raw),
      internalItems: paginatedItemsWithoutGroups.value,
      groupedItems: paginatedItems.value,
      columns: columns.value,
      headers: headers.value
    }));
    useRender(() => {
      const dataTableFooterProps = VDataTableFooter.filterProps(props);
      const dataTableHeadersProps = VDataTableHeaders.filterProps(props);
      const dataTableRowsProps = VDataTableRows.filterProps(props);
      const tableProps = VTable.filterProps(props);
      return createVNode(VTable, mergeProps({
        "class": ["v-data-table", {
          "v-data-table--show-select": props.showSelect,
          "v-data-table--loading": props.loading
        }, props.class],
        "style": props.style
      }, tableProps), {
        top: () => slots.top?.(slotProps.value),
        default: () => slots.default ? slots.default(slotProps.value) : createVNode(Fragment, null, [slots.colgroup?.(slotProps.value), createVNode("thead", null, [createVNode(VDataTableHeaders, dataTableHeadersProps, slots)]), slots.thead?.(slotProps.value), createVNode("tbody", null, [slots["body.prepend"]?.(slotProps.value), slots.body ? slots.body(slotProps.value) : createVNode(VDataTableRows, mergeProps(attrs, dataTableRowsProps, {
          "items": paginatedItems.value
        }), slots), slots["body.append"]?.(slotProps.value)]), slots.tbody?.(slotProps.value), slots.tfoot?.(slotProps.value)]),
        bottom: () => slots.bottom ? slots.bottom(slotProps.value) : createVNode(Fragment, null, [createVNode(VDivider, null, null), createVNode(VDataTableFooter, dataTableFooterProps, {
          prepend: slots["footer.prepend"]
        })])
      });
    });
    return {};
  }
});
const makeVDataTableVirtualProps = propsFactory({
  ...makeDataTableProps(),
  ...makeDataTableGroupProps(),
  ...makeVirtualProps(),
  ...makeFilterProps()
}, "VDataTableVirtual");
const VDataTableVirtual = genericComponent()({
  name: "VDataTableVirtual",
  props: makeVDataTableVirtualProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:sortBy": (value) => true,
    "update:options": (value) => true,
    "update:groupBy": (value) => true,
    "update:expanded": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      groupBy
    } = createGroupBy(props);
    const {
      sortBy,
      multiSort,
      mustSort
    } = createSort(props);
    const {
      columns,
      headers,
      sortFunctions,
      filterFunctions
    } = createHeaders(props, {
      groupBy,
      showSelect: toRef(props, "showSelect"),
      showExpand: toRef(props, "showExpand")
    });
    const {
      items
    } = useDataTableItems(props, columns);
    const search = toRef(props, "search");
    const {
      filteredItems
    } = useFilter(props, items, search, {
      transform: (item) => item.columns,
      customKeyFilter: filterFunctions
    });
    const {
      toggleSort
    } = provideSort({
      sortBy,
      multiSort,
      mustSort
    });
    const {
      sortByWithGroups,
      opened,
      extractRows,
      isGroupOpen,
      toggleGroup
    } = provideGroupBy({
      groupBy,
      sortBy
    });
    const {
      sortedItems
    } = useSortedItems(props, filteredItems, sortByWithGroups, sortFunctions);
    const {
      flatItems
    } = useGroupedItems(sortedItems, groupBy, opened);
    const allItems = computed(() => extractRows(flatItems.value));
    const {
      isSelected,
      select,
      selectAll,
      toggleSelect,
      someSelected,
      allSelected
    } = provideSelection(props, {
      allItems,
      currentPage: allItems
    });
    const {
      isExpanded,
      toggleExpand
    } = provideExpanded(props);
    const {
      containerRef,
      markerRef,
      paddingTop,
      paddingBottom,
      computedItems,
      handleItemResize,
      handleScroll,
      handleScrollend
    } = useVirtual(props, flatItems);
    const displayItems = computed(() => computedItems.value.map((item) => item.raw));
    useOptions({
      sortBy,
      page: shallowRef(1),
      itemsPerPage: shallowRef(-1),
      groupBy,
      search
    });
    provideDefaults({
      VDataTableRows: {
        hideNoData: toRef(props, "hideNoData"),
        noDataText: toRef(props, "noDataText"),
        loading: toRef(props, "loading"),
        loadingText: toRef(props, "loadingText")
      }
    });
    const slotProps = computed(() => ({
      sortBy: sortBy.value,
      toggleSort,
      someSelected: someSelected.value,
      allSelected: allSelected.value,
      isSelected,
      select,
      selectAll,
      toggleSelect,
      isExpanded,
      toggleExpand,
      isGroupOpen,
      toggleGroup,
      items: allItems.value.map((item) => item.raw),
      internalItems: allItems.value,
      groupedItems: flatItems.value,
      columns: columns.value,
      headers: headers.value
    }));
    useRender(() => {
      const dataTableHeadersProps = VDataTableHeaders.filterProps(props);
      const dataTableRowsProps = VDataTableRows.filterProps(props);
      const tableProps = VTable.filterProps(props);
      return createVNode(VTable, mergeProps({
        "class": ["v-data-table", {
          "v-data-table--loading": props.loading
        }, props.class],
        "style": props.style
      }, tableProps), {
        top: () => slots.top?.(slotProps.value),
        wrapper: () => createVNode("div", {
          "ref": containerRef,
          "onScrollPassive": handleScroll,
          "onScrollend": handleScrollend,
          "class": "v-table__wrapper",
          "style": {
            height: convertToUnit(props.height)
          }
        }, [createVNode("table", null, [createVNode("thead", null, [createVNode(VDataTableHeaders, mergeProps(dataTableHeadersProps, {
          "sticky": props.fixedHeader
        }), slots)]), createVNode("tbody", null, [createVNode("tr", {
          "ref": markerRef,
          "style": {
            height: convertToUnit(paddingTop.value),
            border: 0
          }
        }, [createVNode("td", {
          "colspan": columns.value.length,
          "style": {
            height: 0,
            border: 0
          }
        }, null)]), slots["body.prepend"]?.(slotProps.value), createVNode(VDataTableRows, mergeProps(attrs, dataTableRowsProps, {
          "items": displayItems.value
        }), {
          ...slots,
          item: (itemSlotProps) => createVNode(VVirtualScrollItem, {
            "key": itemSlotProps.internalItem.index,
            "renderless": true,
            "onUpdate:height": (height) => handleItemResize(itemSlotProps.internalItem.index, height)
          }, {
            default: (_ref2) => {
              let {
                itemRef
              } = _ref2;
              return slots.item?.({
                ...itemSlotProps,
                itemRef
              }) ?? createVNode(VDataTableRow, mergeProps(itemSlotProps.props, {
                "ref": itemRef,
                "key": itemSlotProps.internalItem.index,
                "index": itemSlotProps.internalItem.index
              }), slots);
            }
          })
        }), slots["body.append"]?.(slotProps.value), createVNode("tr", {
          "style": {
            height: convertToUnit(paddingBottom.value),
            border: 0
          }
        }, [createVNode("td", {
          "colspan": columns.value.length,
          "style": {
            height: 0,
            border: 0
          }
        }, null)])])])]),
        bottom: () => slots.bottom?.(slotProps.value)
      });
    });
  }
});
const makeVDataTableServerProps = propsFactory({
  itemsLength: {
    type: [Number, String],
    required: true
  },
  ...makeDataTablePaginateProps(),
  ...makeDataTableProps(),
  ...makeVDataTableFooterProps()
}, "VDataTableServer");
const VDataTableServer = genericComponent()({
  name: "VDataTableServer",
  props: makeVDataTableServerProps(),
  emits: {
    "update:modelValue": (value) => true,
    "update:page": (page) => true,
    "update:itemsPerPage": (page) => true,
    "update:sortBy": (sortBy) => true,
    "update:options": (options) => true,
    "update:expanded": (options) => true,
    "update:groupBy": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      groupBy
    } = createGroupBy(props);
    const {
      sortBy,
      multiSort,
      mustSort
    } = createSort(props);
    const {
      page,
      itemsPerPage
    } = createPagination(props);
    const itemsLength = computed(() => parseInt(props.itemsLength, 10));
    const {
      columns,
      headers
    } = createHeaders(props, {
      groupBy,
      showSelect: toRef(props, "showSelect"),
      showExpand: toRef(props, "showExpand")
    });
    const {
      items
    } = useDataTableItems(props, columns);
    const {
      toggleSort
    } = provideSort({
      sortBy,
      multiSort,
      mustSort,
      page
    });
    const {
      opened,
      isGroupOpen,
      toggleGroup,
      extractRows
    } = provideGroupBy({
      groupBy,
      sortBy
    });
    const {
      pageCount,
      setItemsPerPage
    } = providePagination({
      page,
      itemsPerPage,
      itemsLength
    });
    const {
      flatItems
    } = useGroupedItems(items, groupBy, opened);
    const {
      isSelected,
      select,
      selectAll,
      toggleSelect,
      someSelected,
      allSelected
    } = provideSelection(props, {
      allItems: items,
      currentPage: items
    });
    const {
      isExpanded,
      toggleExpand
    } = provideExpanded(props);
    const itemsWithoutGroups = computed(() => extractRows(items.value));
    useOptions({
      page,
      itemsPerPage,
      sortBy,
      groupBy,
      search: toRef(props, "search")
    });
    provide("v-data-table", {
      toggleSort,
      sortBy
    });
    provideDefaults({
      VDataTableRows: {
        hideNoData: toRef(props, "hideNoData"),
        noDataText: toRef(props, "noDataText"),
        loading: toRef(props, "loading"),
        loadingText: toRef(props, "loadingText")
      }
    });
    const slotProps = computed(() => ({
      page: page.value,
      itemsPerPage: itemsPerPage.value,
      sortBy: sortBy.value,
      pageCount: pageCount.value,
      toggleSort,
      setItemsPerPage,
      someSelected: someSelected.value,
      allSelected: allSelected.value,
      isSelected,
      select,
      selectAll,
      toggleSelect,
      isExpanded,
      toggleExpand,
      isGroupOpen,
      toggleGroup,
      items: itemsWithoutGroups.value.map((item) => item.raw),
      internalItems: itemsWithoutGroups.value,
      groupedItems: flatItems.value,
      columns: columns.value,
      headers: headers.value
    }));
    useRender(() => {
      const dataTableFooterProps = VDataTableFooter.filterProps(props);
      const dataTableHeadersProps = VDataTableHeaders.filterProps(props);
      const dataTableRowsProps = VDataTableRows.filterProps(props);
      const tableProps = VTable.filterProps(props);
      return createVNode(VTable, mergeProps({
        "class": ["v-data-table", {
          "v-data-table--loading": props.loading
        }, props.class],
        "style": props.style
      }, tableProps), {
        top: () => slots.top?.(slotProps.value),
        default: () => slots.default ? slots.default(slotProps.value) : createVNode(Fragment, null, [slots.colgroup?.(slotProps.value), createVNode("thead", {
          "class": "v-data-table__thead",
          "role": "rowgroup"
        }, [createVNode(VDataTableHeaders, mergeProps(dataTableHeadersProps, {
          "sticky": props.fixedHeader
        }), slots)]), slots.thead?.(slotProps.value), createVNode("tbody", {
          "class": "v-data-table__tbody",
          "role": "rowgroup"
        }, [slots["body.prepend"]?.(slotProps.value), slots.body ? slots.body(slotProps.value) : createVNode(VDataTableRows, mergeProps(attrs, dataTableRowsProps, {
          "items": flatItems.value
        }), slots), slots["body.append"]?.(slotProps.value)]), slots.tbody?.(slotProps.value), slots.tfoot?.(slotProps.value)]),
        bottom: () => slots.bottom ? slots.bottom(slotProps.value) : createVNode(VDataTableFooter, dataTableFooterProps, {
          prepend: slots["footer.prepend"]
        })
      });
    });
  }
});
const VDatePicker$1 = "";
const VDatePickerControls$1 = "";
const VGrid = "";
const makeVContainerProps = propsFactory({
  fluid: {
    type: Boolean,
    default: false
  },
  ...makeComponentProps(),
  ...makeTagProps()
}, "VContainer");
const VContainer = genericComponent()({
  name: "VContainer",
  props: makeVContainerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      rtlClasses
    } = useRtl();
    useRender(() => createVNode(props.tag, {
      "class": ["v-container", {
        "v-container--fluid": props.fluid
      }, rtlClasses.value, props.class],
      "style": props.style
    }, slots));
    return {};
  }
});
const breakpointProps = (() => {
  return breakpoints.reduce((props, val) => {
    props[val] = {
      type: [Boolean, String, Number],
      default: false
    };
    return props;
  }, {});
})();
const offsetProps = (() => {
  return breakpoints.reduce((props, val) => {
    const offsetKey = "offset" + capitalize(val);
    props[offsetKey] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();
const orderProps = (() => {
  return breakpoints.reduce((props, val) => {
    const orderKey = "order" + capitalize(val);
    props[orderKey] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();
const propMap$1 = {
  col: Object.keys(breakpointProps),
  offset: Object.keys(offsetProps),
  order: Object.keys(orderProps)
};
function breakpointClass$1(type, prop, val) {
  let className = type;
  if (val == null || val === false) {
    return void 0;
  }
  if (prop) {
    const breakpoint = prop.replace(type, "");
    className += `-${breakpoint}`;
  }
  if (type === "col") {
    className = "v-" + className;
  }
  if (type === "col" && (val === "" || val === true)) {
    return className.toLowerCase();
  }
  className += `-${val}`;
  return className.toLowerCase();
}
const ALIGN_SELF_VALUES = ["auto", "start", "end", "center", "baseline", "stretch"];
const makeVColProps = propsFactory({
  cols: {
    type: [Boolean, String, Number],
    default: false
  },
  ...breakpointProps,
  offset: {
    type: [String, Number],
    default: null
  },
  ...offsetProps,
  order: {
    type: [String, Number],
    default: null
  },
  ...orderProps,
  alignSelf: {
    type: String,
    default: null,
    validator: (str) => ALIGN_SELF_VALUES.includes(str)
  },
  ...makeComponentProps(),
  ...makeTagProps()
}, "VCol");
const VCol = genericComponent()({
  name: "VCol",
  props: makeVColProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const classes = computed(() => {
      const classList = [];
      let type;
      for (type in propMap$1) {
        propMap$1[type].forEach((prop) => {
          const value = props[prop];
          const className = breakpointClass$1(type, prop, value);
          if (className)
            classList.push(className);
        });
      }
      const hasColClasses = classList.some((className) => className.startsWith("v-col-"));
      classList.push({
        // Default to .v-col if no other col-{bp}-* classes generated nor `cols` specified.
        "v-col": !hasColClasses || !props.cols,
        [`v-col-${props.cols}`]: props.cols,
        [`offset-${props.offset}`]: props.offset,
        [`order-${props.order}`]: props.order,
        [`align-self-${props.alignSelf}`]: props.alignSelf
      });
      return classList;
    });
    return () => h(props.tag, {
      class: [classes.value, props.class],
      style: props.style
    }, slots.default?.());
  }
});
const ALIGNMENT = ["start", "end", "center"];
const SPACE = ["space-between", "space-around", "space-evenly"];
function makeRowProps(prefix, def2) {
  return breakpoints.reduce((props, val) => {
    const prefixKey = prefix + capitalize(val);
    props[prefixKey] = def2();
    return props;
  }, {});
}
const ALIGN_VALUES = [...ALIGNMENT, "baseline", "stretch"];
const alignValidator = (str) => ALIGN_VALUES.includes(str);
const alignProps = makeRowProps("align", () => ({
  type: String,
  default: null,
  validator: alignValidator
}));
const JUSTIFY_VALUES = [...ALIGNMENT, ...SPACE];
const justifyValidator = (str) => JUSTIFY_VALUES.includes(str);
const justifyProps = makeRowProps("justify", () => ({
  type: String,
  default: null,
  validator: justifyValidator
}));
const ALIGN_CONTENT_VALUES = [...ALIGNMENT, ...SPACE, "stretch"];
const alignContentValidator = (str) => ALIGN_CONTENT_VALUES.includes(str);
const alignContentProps = makeRowProps("alignContent", () => ({
  type: String,
  default: null,
  validator: alignContentValidator
}));
const propMap = {
  align: Object.keys(alignProps),
  justify: Object.keys(justifyProps),
  alignContent: Object.keys(alignContentProps)
};
const classMap = {
  align: "align",
  justify: "justify",
  alignContent: "align-content"
};
function breakpointClass(type, prop, val) {
  let className = classMap[type];
  if (val == null) {
    return void 0;
  }
  if (prop) {
    const breakpoint = prop.replace(type, "");
    className += `-${breakpoint}`;
  }
  className += `-${val}`;
  return className.toLowerCase();
}
const makeVRowProps = propsFactory({
  dense: Boolean,
  noGutters: Boolean,
  align: {
    type: String,
    default: null,
    validator: alignValidator
  },
  ...alignProps,
  justify: {
    type: String,
    default: null,
    validator: justifyValidator
  },
  ...justifyProps,
  alignContent: {
    type: String,
    default: null,
    validator: alignContentValidator
  },
  ...alignContentProps,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VRow");
const VRow = genericComponent()({
  name: "VRow",
  props: makeVRowProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const classes = computed(() => {
      const classList = [];
      let type;
      for (type in propMap) {
        propMap[type].forEach((prop) => {
          const value = props[prop];
          const className = breakpointClass(type, prop, value);
          if (className)
            classList.push(className);
        });
      }
      classList.push({
        "v-row--no-gutters": props.noGutters,
        "v-row--dense": props.dense,
        [`align-${props.align}`]: props.align,
        [`justify-${props.justify}`]: props.justify,
        [`align-content-${props.alignContent}`]: props.alignContent
      });
      return classList;
    });
    return () => h(props.tag, {
      class: ["v-row", classes.value, props.class],
      style: props.style
    }, slots.default?.());
  }
});
const VSpacer = createSimpleFunctional("v-spacer", "div", "VSpacer");
const makeVDatePickerControlsProps = propsFactory({
  active: {
    type: [String, Array],
    default: void 0
  },
  disabled: {
    type: [Boolean, String, Array],
    default: false
  },
  nextIcon: {
    type: [String],
    default: "$next"
  },
  prevIcon: {
    type: [String],
    default: "$prev"
  },
  modeIcon: {
    type: [String],
    default: "$subgroup"
  },
  text: String,
  viewMode: {
    type: String,
    default: "month"
  }
}, "VDatePickerControls");
const VDatePickerControls = genericComponent()({
  name: "VDatePickerControls",
  props: makeVDatePickerControlsProps(),
  emits: {
    "click:year": () => true,
    "click:month": () => true,
    "click:prev": () => true,
    "click:next": () => true,
    "click:text": () => true
  },
  setup(props, _ref) {
    let {
      emit: emit2
    } = _ref;
    const disableMonth = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("text") : !!props.disabled;
    });
    const disableYear = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("mode") : !!props.disabled;
    });
    const disablePrev = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("prev") : !!props.disabled;
    });
    const disableNext = computed(() => {
      return Array.isArray(props.disabled) ? props.disabled.includes("next") : !!props.disabled;
    });
    function onClickPrev() {
      emit2("click:prev");
    }
    function onClickNext() {
      emit2("click:next");
    }
    function onClickYear() {
      emit2("click:year");
    }
    function onClickMonth() {
      emit2("click:month");
    }
    useRender(() => {
      return createVNode("div", {
        "class": ["v-date-picker-controls"]
      }, [createVNode(VBtn, {
        "class": "v-date-picker-controls__month-btn",
        "disabled": disableMonth.value,
        "text": props.text,
        "variant": "text",
        "rounded": true,
        "onClick": onClickMonth
      }, null), createVNode(VBtn, {
        "key": "mode-btn",
        "class": "v-date-picker-controls__mode-btn",
        "disabled": disableYear.value,
        "density": "comfortable",
        "icon": props.modeIcon,
        "variant": "text",
        "onClick": onClickYear
      }, null), createVNode(VSpacer, {
        "key": "mode-spacer"
      }, null), createVNode("div", {
        "key": "month-buttons",
        "class": "v-date-picker-controls__month"
      }, [createVNode(VBtn, {
        "disabled": disablePrev.value,
        "icon": props.prevIcon,
        "variant": "text",
        "onClick": onClickPrev
      }, null), createVNode(VBtn, {
        "disabled": disableNext.value,
        "icon": props.nextIcon,
        "variant": "text",
        "onClick": onClickNext
      }, null)])]);
    });
    return {};
  }
});
const VDatePickerHeader$1 = "";
const makeVDatePickerHeaderProps = propsFactory({
  appendIcon: String,
  color: String,
  header: String,
  transition: String,
  onClick: EventProp()
}, "VDatePickerHeader");
const VDatePickerHeader = genericComponent()({
  name: "VDatePickerHeader",
  props: makeVDatePickerHeaderProps(),
  emits: {
    click: () => true,
    "click:append": () => true
  },
  setup(props, _ref) {
    let {
      emit: emit2,
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(props, "color");
    function onClick() {
      emit2("click");
    }
    function onClickAppend() {
      emit2("click:append");
    }
    useRender(() => {
      const hasContent = !!(slots.default || props.header);
      const hasAppend = !!(slots.append || props.appendIcon);
      return createVNode("div", {
        "class": ["v-date-picker-header", {
          "v-date-picker-header--clickable": !!props.onClick
        }, backgroundColorClasses.value],
        "style": backgroundColorStyles.value,
        "onClick": onClick
      }, [slots.prepend && createVNode("div", {
        "key": "prepend",
        "class": "v-date-picker-header__prepend"
      }, [slots.prepend()]), hasContent && createVNode(MaybeTransition, {
        "key": "content",
        "name": props.transition
      }, {
        default: () => [createVNode("div", {
          "key": props.header,
          "class": "v-date-picker-header__content"
        }, [slots.default?.() ?? props.header])]
      }), hasAppend && createVNode("div", {
        "class": "v-date-picker-header__append"
      }, [!slots.append ? createVNode(VBtn, {
        "key": "append-btn",
        "icon": props.appendIcon,
        "variant": "text",
        "onClick": onClickAppend
      }, null) : createVNode(VDefaultsProvider, {
        "key": "append-defaults",
        "disabled": !props.appendIcon,
        "defaults": {
          VBtn: {
            icon: props.appendIcon,
            variant: "text"
          }
        }
      }, {
        default: () => [slots.append?.()]
      })])]);
    });
    return {};
  }
});
const VDatePickerMonth$1 = "";
const makeVDatePickerMonthProps = propsFactory({
  allowedDates: [Array, Function],
  disabled: Boolean,
  color: String,
  month: [Number, String],
  hideWeekdays: Boolean,
  max: null,
  min: null,
  modelValue: Array,
  multiple: Boolean,
  showAdjacentMonths: Boolean,
  showWeek: Boolean,
  year: [Number, String]
}, "VDatePickerMonth");
const VDatePickerMonth = genericComponent()({
  name: "VDatePickerMonth",
  props: makeVDatePickerMonthProps(),
  emits: {
    "update:modelValue": (date2) => true,
    "update:month": (date2) => true,
    "update:year": (date2) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2,
      slots
    } = _ref;
    const daysRef = ref();
    const adapter = useDate();
    const model = useProxiedModel(props, "modelValue", [], (v) => wrapInArray(v));
    const displayValue = computed(() => {
      if (model.value.length > 0)
        return adapter.date(model.value[0]);
      if (props.min)
        return adapter.date(props.min);
      if (Array.isArray(props.allowedDates))
        return adapter.date(props.allowedDates[0]);
      return adapter.date();
    });
    const year = useProxiedModel(props, "year", void 0, (v) => {
      const value = v != null ? Number(v) : adapter.getYear(displayValue.value);
      return adapter.startOfYear(adapter.setYear(adapter.date(), value));
    }, (v) => adapter.getYear(v));
    const month = useProxiedModel(props, "month", void 0, (v) => {
      const value = v != null ? Number(v) : adapter.getMonth(displayValue.value);
      const date2 = adapter.setYear(adapter.date(), adapter.getYear(year.value));
      return adapter.setMonth(date2, value);
    }, (v) => adapter.getMonth(v));
    const weeksInMonth = computed(() => {
      const weeks2 = adapter.getWeekArray(month.value);
      const days = weeks2.flat();
      const daysInMonth2 = 6 * 7;
      if (days.length < daysInMonth2) {
        const lastDay = days[days.length - 1];
        let week = [];
        for (let day = 1; day <= daysInMonth2 - days.length; day++) {
          week.push(adapter.addDays(lastDay, day));
          if (day % 7 === 0) {
            weeks2.push(week);
            week = [];
          }
        }
      }
      return weeks2;
    });
    const daysInMonth = computed(() => {
      const days = weeksInMonth.value.flat();
      const today = adapter.date();
      return days.map((date2, index) => {
        const isoDate = adapter.toISO(date2);
        const isAdjacent = !adapter.isSameMonth(date2, month.value);
        return {
          date: date2,
          isoDate,
          formatted: adapter.format(date2, "keyboardDate"),
          year: adapter.getYear(date2),
          month: adapter.getMonth(date2),
          isDisabled: isDisabled(date2),
          isWeekStart: index % 7 === 0,
          isWeekEnd: index % 7 === 6,
          isSelected: model.value.some((value) => adapter.isSameDay(date2, value)),
          isToday: adapter.isSameDay(date2, today),
          isAdjacent,
          isHidden: isAdjacent && !props.showAdjacentMonths,
          isHovered: false,
          localized: adapter.format(date2, "dayOfMonth")
        };
      });
    });
    const weeks = computed(() => {
      return weeksInMonth.value.map((week) => {
        return getWeek(adapter, week[0]);
      });
    });
    function isDisabled(value) {
      if (props.disabled)
        return true;
      const date2 = adapter.date(value);
      if (props.min && adapter.isAfter(adapter.date(props.min), date2))
        return true;
      if (props.max && adapter.isAfter(date2, adapter.date(props.max)))
        return true;
      if (Array.isArray(props.allowedDates) && props.allowedDates.length > 0) {
        return !props.allowedDates.some((d) => adapter.isSameDay(adapter.date(d), date2));
      }
      if (typeof props.allowedDates === "function") {
        return !props.allowedDates(date2);
      }
      return false;
    }
    function onClick(value) {
      if (props.multiple) {
        const index = model.value.findIndex((selection) => adapter.isSameDay(selection, value));
        if (index === -1) {
          model.value = [...model.value, value];
        } else {
          const value2 = [...model.value];
          value2.splice(index, 1);
          model.value = value2;
        }
      } else {
        model.value = [value];
      }
    }
    watch(displayValue, (val) => {
      month.value = val;
      year.value = val;
    });
    return () => createVNode("div", {
      "class": "v-date-picker-month"
    }, [props.showWeek && createVNode("div", {
      "key": "weeks",
      "class": "v-date-picker-month__weeks"
    }, [!props.hideWeekdays && createVNode("div", {
      "key": "hide-week-days",
      "class": "v-date-picker-month__day"
    }, [createTextVNode(" ")]), weeks.value.map((week) => createVNode("div", {
      "class": ["v-date-picker-month__day", "v-date-picker-month__day--adjacent"]
    }, [week]))]), createVNode("div", {
      "ref": daysRef,
      "class": "v-date-picker-month__days"
    }, [!props.hideWeekdays && adapter.getWeekdays().map((weekDay) => createVNode("div", {
      "class": ["v-date-picker-month__day", "v-date-picker-month__weekday"]
    }, [weekDay])), daysInMonth.value.map((item, i) => {
      const slotProps = {
        props: {
          onClick: () => onClick(item.date)
        },
        item,
        i
      };
      return createVNode("div", {
        "class": ["v-date-picker-month__day", {
          "v-date-picker-month__day--adjacent": item.isAdjacent,
          "v-date-picker-month__day--hide-adjacent": item.isHidden,
          "v-date-picker-month__day--hovered": item.isHovered,
          "v-date-picker-month__day--selected": item.isSelected,
          "v-date-picker-month__day--week-end": item.isWeekEnd,
          "v-date-picker-month__day--week-start": item.isWeekStart
        }],
        "data-v-date": !item.isDisabled ? item.isoDate : void 0
      }, [(props.showAdjacentMonths || !item.isAdjacent) && createVNode(VDefaultsProvider, {
        "defaults": {
          VBtn: {
            color: (item.isSelected || item.isToday) && !item.isDisabled ? props.color : void 0,
            disabled: item.isDisabled,
            icon: true,
            ripple: false,
            text: item.localized,
            variant: item.isDisabled ? "text" : item.isToday && !item.isSelected ? "outlined" : "flat",
            onClick: () => onClick(item.date)
          }
        }
      }, {
        default: () => [slots.day?.(slotProps) ?? createVNode(VBtn, slotProps.props, null)]
      })]);
    })])]);
  }
});
const VDatePickerMonths$1 = "";
const makeVDatePickerMonthsProps = propsFactory({
  color: String,
  height: [String, Number],
  modelValue: Number
}, "VDatePickerMonths");
const VDatePickerMonths = genericComponent()({
  name: "VDatePickerMonths",
  props: makeVDatePickerMonthsProps(),
  emits: {
    "update:modelValue": (date2) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const adapter = useDate();
    const model = useProxiedModel(props, "modelValue");
    const months = computed(() => {
      let date2 = adapter.startOfYear(adapter.date());
      return createRange(12).map((i) => {
        const text = adapter.format(date2, "monthShort");
        date2 = adapter.getNextMonth(date2);
        return {
          text,
          value: i
        };
      });
    });
    watchEffect(() => {
      model.value = model.value ?? adapter.getMonth(adapter.date());
    });
    useRender(() => createVNode("div", {
      "class": "v-date-picker-months",
      "style": {
        height: convertToUnit(props.height)
      }
    }, [createVNode("div", {
      "class": "v-date-picker-months__content"
    }, [months.value.map((month, i) => {
      const btnProps = {
        active: model.value === i,
        color: model.value === i ? props.color : void 0,
        rounded: true,
        text: month.text,
        variant: model.value === month.value ? "flat" : "text",
        onClick: () => onClick(i)
      };
      function onClick(i2) {
        model.value = i2;
      }
      return slots.month?.({
        month,
        i,
        props: btnProps
      }) ?? createVNode(VBtn, mergeProps({
        "key": "month"
      }, btnProps, {
        "onClick": () => onClick(i)
      }), null);
    })])]));
    return {};
  }
});
const VDatePickerYears$1 = "";
const makeVDatePickerYearsProps = propsFactory({
  color: String,
  height: [String, Number],
  min: null,
  max: null,
  modelValue: Number
}, "VDatePickerYears");
const VDatePickerYears = genericComponent()({
  name: "VDatePickerYears",
  props: makeVDatePickerYearsProps(),
  emits: {
    "update:modelValue": (year) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const adapter = useDate();
    const model = useProxiedModel(props, "modelValue");
    const years = computed(() => {
      const year = adapter.getYear(adapter.date());
      let min = year - 100;
      let max = year + 52;
      if (props.min) {
        min = adapter.getYear(adapter.date(props.min));
      }
      if (props.max) {
        max = adapter.getYear(adapter.date(props.max));
      }
      let date2 = adapter.startOfYear(adapter.date());
      date2 = adapter.setYear(date2, min);
      return createRange(max - min + 1, min).map((i) => {
        const text = adapter.format(date2, "year");
        date2 = adapter.setYear(date2, adapter.getYear(date2) + 1);
        return {
          text,
          value: i
        };
      });
    });
    watchEffect(() => {
      model.value = model.value ?? adapter.getYear(adapter.date());
    });
    const yearRef = ref();
    onMounted(async () => {
      await nextTick();
      yearRef.value?.$el.scrollIntoView({
        block: "center"
      });
    });
    useRender(() => createVNode("div", {
      "class": "v-date-picker-years",
      "style": {
        height: convertToUnit(props.height)
      }
    }, [createVNode("div", {
      "class": "v-date-picker-years__content"
    }, [years.value.map((year, i) => {
      const btnProps = {
        ref: model.value === year.value ? yearRef : void 0,
        active: model.value === year.value,
        color: model.value === year.value ? props.color : void 0,
        rounded: true,
        text: year.text,
        variant: model.value === year.value ? "flat" : "text",
        onClick: () => model.value = year.value
      };
      return slots.year?.({
        year,
        i,
        props: btnProps
      }) ?? createVNode(VBtn, mergeProps({
        "key": "month"
      }, btnProps), null);
    })])]));
    return {};
  }
});
const VPicker$1 = "";
const VPickerTitle = createSimpleFunctional("v-picker-title");
const makeVPickerProps = propsFactory({
  bgColor: String,
  landscape: Boolean,
  title: String,
  hideHeader: Boolean,
  ...makeVSheetProps()
}, "VPicker");
const VPicker = genericComponent()({
  name: "VPicker",
  props: makeVPickerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    useRender(() => {
      const sheetProps = VSheet.filterProps(props);
      const hasTitle = !!(props.title || slots.title);
      return createVNode(VSheet, mergeProps(sheetProps, {
        "color": props.bgColor,
        "class": ["v-picker", {
          "v-picker--landscape": props.landscape,
          "v-picker--with-actions": !!slots.actions
        }, props.class],
        "style": props.style
      }), {
        default: () => [!props.hideHeader && createVNode("div", {
          "key": "header",
          "class": [backgroundColorClasses.value],
          "style": [backgroundColorStyles.value]
        }, [hasTitle && createVNode(VPickerTitle, {
          "key": "picker-title"
        }, {
          default: () => [slots.title?.() ?? props.title]
        }), slots.header && createVNode("div", {
          "class": "v-picker__header"
        }, [slots.header()])]), createVNode("div", {
          "class": "v-picker__body"
        }, [slots.default?.()]), slots.actions && createVNode(VDefaultsProvider, {
          "defaults": {
            VBtn: {
              slim: true,
              variant: "text"
            }
          }
        }, {
          default: () => [createVNode("div", {
            "class": "v-picker__actions"
          }, [slots.actions()])]
        })]
      });
    });
    return {};
  }
});
const makeVDatePickerProps = propsFactory({
  // TODO: implement in v3.5
  // calendarIcon: {
  //   type: String,
  //   default: '$calendar',
  // },
  // keyboardIcon: {
  //   type: String,
  //   default: '$edit',
  // },
  // inputMode: {
  //   type: String as PropType<'calendar' | 'keyboard'>,
  //   default: 'calendar',
  // },
  // inputText: {
  //   type: String,
  //   default: '$vuetify.datePicker.input.placeholder',
  // },
  // inputPlaceholder: {
  //   type: String,
  //   default: 'dd/mm/yyyy',
  // },
  header: {
    type: String,
    default: "$vuetify.datePicker.header"
  },
  ...makeVDatePickerControlsProps(),
  ...makeVDatePickerMonthProps(),
  ...omit(makeVDatePickerMonthsProps(), ["modelValue"]),
  ...omit(makeVDatePickerYearsProps(), ["modelValue"]),
  ...makeVPickerProps({
    title: "$vuetify.datePicker.title"
  }),
  modelValue: null
}, "VDatePicker");
const VDatePicker = genericComponent()({
  name: "VDatePicker",
  props: makeVDatePickerProps(),
  emits: {
    "update:modelValue": (date2) => true,
    "update:month": (date2) => true,
    "update:year": (date2) => true,
    // 'update:inputMode': (date: any) => true,
    "update:viewMode": (date2) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2,
      slots
    } = _ref;
    const adapter = useDate();
    const {
      t
    } = useLocale();
    const model = useProxiedModel(props, "modelValue", void 0, (v) => wrapInArray(v), (v) => props.multiple ? v : v[0]);
    const viewMode = useProxiedModel(props, "viewMode");
    const internal = computed(() => {
      const value = adapter.date(model.value?.[0]);
      return value && adapter.isValid(value) ? value : adapter.date();
    });
    const month = ref(Number(props.month ?? adapter.getMonth(adapter.startOfMonth(internal.value))));
    const year = ref(Number(props.year ?? adapter.getYear(adapter.startOfYear(adapter.setMonth(internal.value, month.value)))));
    const isReversing = shallowRef(false);
    const header = computed(() => {
      return props.multiple && model.value.length > 1 ? t("$vuetify.datePicker.itemsSelected", model.value.length) : model.value[0] && adapter.isValid(model.value[0]) ? adapter.format(model.value[0], "normalDateWithWeekday") : t(props.header);
    });
    const text = computed(() => {
      return adapter.format(adapter.setYear(adapter.setMonth(adapter.date(), month.value), year.value), "monthAndYear");
    });
    const headerTransition = computed(() => `date-picker-header${isReversing.value ? "-reverse" : ""}-transition`);
    const minDate = computed(() => {
      const date2 = adapter.date(props.min);
      return props.min && adapter.isValid(date2) ? date2 : null;
    });
    const maxDate = computed(() => {
      const date2 = adapter.date(props.max);
      return props.max && adapter.isValid(date2) ? date2 : null;
    });
    const disabled = computed(() => {
      if (props.disabled)
        return true;
      const targets = [];
      if (viewMode.value !== "month") {
        targets.push(...["prev", "next"]);
      } else {
        let _date = adapter.date();
        _date = adapter.setYear(_date, year.value);
        _date = adapter.setMonth(_date, month.value);
        if (minDate.value) {
          const date2 = adapter.addDays(adapter.startOfMonth(_date), -1);
          adapter.isAfter(minDate.value, date2) && targets.push("prev");
        }
        if (maxDate.value) {
          const date2 = adapter.addDays(adapter.endOfMonth(_date), 1);
          adapter.isAfter(date2, maxDate.value) && targets.push("next");
        }
      }
      return targets;
    });
    function onClickNext() {
      if (month.value < 11) {
        month.value++;
      } else {
        year.value++;
        month.value = 0;
      }
    }
    function onClickPrev() {
      if (month.value > 0) {
        month.value--;
      } else {
        year.value--;
        month.value = 11;
      }
    }
    function onClickDate() {
      viewMode.value = "month";
    }
    function onClickMonth() {
      viewMode.value = viewMode.value === "months" ? "month" : "months";
    }
    function onClickYear() {
      viewMode.value = viewMode.value === "year" ? "month" : "year";
    }
    watch(month, () => {
      if (viewMode.value === "months")
        onClickMonth();
      emit2("update:month", month.value);
    });
    watch(year, () => {
      if (viewMode.value === "year")
        onClickYear();
      emit2("update:year", year.value);
    });
    watch(model, (val, oldVal) => {
      const before = adapter.date(wrapInArray(val)[0]);
      const after = adapter.date(wrapInArray(oldVal)[0]);
      isReversing.value = adapter.isBefore(before, after);
    });
    useRender(() => {
      const pickerProps = VPicker.filterProps(props);
      const datePickerControlsProps = VDatePickerControls.filterProps(props);
      const datePickerHeaderProps = VDatePickerHeader.filterProps(props);
      const datePickerMonthProps = VDatePickerMonth.filterProps(props);
      const datePickerMonthsProps = omit(VDatePickerMonths.filterProps(props), ["modelValue"]);
      const datePickerYearsProps = omit(VDatePickerYears.filterProps(props), ["modelValue"]);
      const headerProps = {
        header: header.value,
        transition: headerTransition.value
      };
      return createVNode(VPicker, mergeProps(pickerProps, {
        "class": ["v-date-picker", `v-date-picker--${viewMode.value}`, {
          "v-date-picker--show-week": props.showWeek
        }, props.class],
        "style": props.style
      }), {
        title: () => slots.title?.() ?? createVNode("div", {
          "class": "v-date-picker__title"
        }, [t(props.title)]),
        header: () => slots.header ? createVNode(VDefaultsProvider, {
          "defaults": {
            VDatePickerHeader: {
              ...headerProps
            }
          }
        }, {
          default: () => [slots.header?.(headerProps)]
        }) : createVNode(VDatePickerHeader, mergeProps({
          "key": "header"
        }, datePickerHeaderProps, headerProps, {
          "onClick": viewMode.value !== "month" ? onClickDate : void 0
        }), slots),
        default: () => createVNode(Fragment, null, [createVNode(VDatePickerControls, mergeProps(datePickerControlsProps, {
          "disabled": disabled.value,
          "text": text.value,
          "onClick:next": onClickNext,
          "onClick:prev": onClickPrev,
          "onClick:month": onClickMonth,
          "onClick:year": onClickYear
        }), null), createVNode(VFadeTransition, {
          "hideOnLeave": true
        }, {
          default: () => [viewMode.value === "months" ? createVNode(VDatePickerMonths, mergeProps({
            "key": "date-picker-months"
          }, datePickerMonthsProps, {
            "modelValue": month.value,
            "onUpdate:modelValue": ($event) => month.value = $event,
            "min": minDate.value,
            "max": maxDate.value
          }), null) : viewMode.value === "year" ? createVNode(VDatePickerYears, mergeProps({
            "key": "date-picker-years"
          }, datePickerYearsProps, {
            "modelValue": year.value,
            "onUpdate:modelValue": ($event) => year.value = $event,
            "min": minDate.value,
            "max": maxDate.value
          }), null) : createVNode(VDatePickerMonth, mergeProps({
            "key": "date-picker-month"
          }, datePickerMonthProps, {
            "modelValue": model.value,
            "onUpdate:modelValue": ($event) => model.value = $event,
            "month": month.value,
            "onUpdate:month": ($event) => month.value = $event,
            "year": year.value,
            "onUpdate:year": ($event) => year.value = $event,
            "min": minDate.value,
            "max": maxDate.value
          }), null)]
        })]),
        actions: slots.actions
      });
    });
    return {};
  }
});
const VExpansionPanel$1 = "";
const VExpansionPanelSymbol = Symbol.for("vuetify:v-expansion-panel");
const allowedVariants = ["default", "accordion", "inset", "popout"];
const makeVExpansionPanelsProps = propsFactory({
  color: String,
  static: Boolean,
  variant: {
    type: String,
    default: "default",
    validator: (v) => allowedVariants.includes(v)
  },
  readonly: Boolean,
  ...makeComponentProps(),
  ...makeGroupProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VExpansionPanels");
const VExpansionPanels = genericComponent()({
  name: "VExpansionPanels",
  props: makeVExpansionPanelsProps(),
  emits: {
    "update:modelValue": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useGroup(props, VExpansionPanelSymbol);
    const {
      themeClasses
    } = provideTheme(props);
    const variantClass = computed(() => props.variant && `v-expansion-panels--variant-${props.variant}`);
    provideDefaults({
      VExpansionPanel: {
        color: toRef(props, "color"),
        readonly: toRef(props, "readonly"),
        static: toRef(props, "static")
      }
    });
    useRender(() => createVNode(props.tag, {
      "class": ["v-expansion-panels", themeClasses.value, variantClass.value, props.class],
      "style": props.style
    }, slots));
    return {};
  }
});
const makeVExpansionPanelTextProps = propsFactory({
  ...makeComponentProps(),
  ...makeLazyProps()
}, "VExpansionPanelText");
const VExpansionPanelText = genericComponent()({
  name: "VExpansionPanelText",
  props: makeVExpansionPanelTextProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const expansionPanel = inject$1(VExpansionPanelSymbol);
    if (!expansionPanel)
      throw new Error("[Vuetify] v-expansion-panel-text needs to be placed inside v-expansion-panel");
    const {
      hasContent,
      onAfterLeave
    } = useLazy(props, expansionPanel.isSelected);
    useRender(() => createVNode(VExpandTransition, {
      "onAfterLeave": onAfterLeave
    }, {
      default: () => [withDirectives(createVNode("div", {
        "class": ["v-expansion-panel-text", props.class],
        "style": props.style
      }, [slots.default && hasContent.value && createVNode("div", {
        "class": "v-expansion-panel-text__wrapper"
      }, [slots.default?.()])]), [[vShow, expansionPanel.isSelected.value]])]
    }));
    return {};
  }
});
const makeVExpansionPanelTitleProps = propsFactory({
  color: String,
  expandIcon: {
    type: IconValue,
    default: "$expand"
  },
  collapseIcon: {
    type: IconValue,
    default: "$collapse"
  },
  hideActions: Boolean,
  static: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: false
  },
  readonly: Boolean,
  ...makeComponentProps()
}, "VExpansionPanelTitle");
const VExpansionPanelTitle = genericComponent()({
  name: "VExpansionPanelTitle",
  directives: {
    Ripple
  },
  props: makeVExpansionPanelTitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const expansionPanel = inject$1(VExpansionPanelSymbol);
    if (!expansionPanel)
      throw new Error("[Vuetify] v-expansion-panel-title needs to be placed inside v-expansion-panel");
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(props, "color");
    const slotProps = computed(() => ({
      collapseIcon: props.collapseIcon,
      disabled: expansionPanel.disabled.value,
      expanded: expansionPanel.isSelected.value,
      expandIcon: props.expandIcon,
      readonly: props.readonly
    }));
    useRender(() => withDirectives(createVNode("button", {
      "class": ["v-expansion-panel-title", {
        "v-expansion-panel-title--active": expansionPanel.isSelected.value,
        "v-expansion-panel-title--static": props.static
      }, backgroundColorClasses.value, props.class],
      "style": [backgroundColorStyles.value, props.style],
      "type": "button",
      "tabindex": expansionPanel.disabled.value ? -1 : void 0,
      "disabled": expansionPanel.disabled.value,
      "aria-expanded": expansionPanel.isSelected.value,
      "onClick": !props.readonly ? expansionPanel.toggle : void 0
    }, [createVNode("span", {
      "class": "v-expansion-panel-title__overlay"
    }, null), slots.default?.(slotProps.value), !props.hideActions && createVNode("span", {
      "class": "v-expansion-panel-title__icon"
    }, [slots.actions ? slots.actions(slotProps.value) : createVNode(VIcon, {
      "icon": expansionPanel.isSelected.value ? props.collapseIcon : props.expandIcon
    }, null)])]), [[resolveDirective("ripple"), props.ripple]]));
    return {};
  }
});
const makeVExpansionPanelProps = propsFactory({
  title: String,
  text: String,
  bgColor: String,
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makeLazyProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeVExpansionPanelTitleProps()
}, "VExpansionPanel");
const VExpansionPanel = genericComponent()({
  name: "VExpansionPanel",
  props: makeVExpansionPanelProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const groupItem = useGroupItem(props, VExpansionPanelSymbol);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(props, "bgColor");
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const isDisabled = computed(() => groupItem?.disabled.value || props.disabled);
    const selectedIndices = computed(() => groupItem.group.items.value.reduce((arr, item, index) => {
      if (groupItem.group.selected.value.includes(item.id))
        arr.push(index);
      return arr;
    }, []));
    const isBeforeSelected = computed(() => {
      const index = groupItem.group.items.value.findIndex((item) => item.id === groupItem.id);
      return !groupItem.isSelected.value && selectedIndices.value.some((selectedIndex) => selectedIndex - index === 1);
    });
    const isAfterSelected = computed(() => {
      const index = groupItem.group.items.value.findIndex((item) => item.id === groupItem.id);
      return !groupItem.isSelected.value && selectedIndices.value.some((selectedIndex) => selectedIndex - index === -1);
    });
    provide(VExpansionPanelSymbol, groupItem);
    provideDefaults({
      VExpansionPanelText: {
        eager: toRef(props, "eager")
      },
      VExpansionPanelTitle: {
        readonly: toRef(props, "readonly")
      }
    });
    useRender(() => {
      const hasText = !!(slots.text || props.text);
      const hasTitle = !!(slots.title || props.title);
      return createVNode(props.tag, {
        "class": ["v-expansion-panel", {
          "v-expansion-panel--active": groupItem.isSelected.value,
          "v-expansion-panel--before-active": isBeforeSelected.value,
          "v-expansion-panel--after-active": isAfterSelected.value,
          "v-expansion-panel--disabled": isDisabled.value
        }, roundedClasses.value, backgroundColorClasses.value, props.class],
        "style": [backgroundColorStyles.value, props.style]
      }, {
        default: () => [createVNode("div", {
          "class": ["v-expansion-panel__shadow", ...elevationClasses.value]
        }, null), hasTitle && createVNode(VExpansionPanelTitle, {
          "key": "title",
          "collapseIcon": props.collapseIcon,
          "color": props.color,
          "expandIcon": props.expandIcon,
          "hideActions": props.hideActions,
          "ripple": props.ripple
        }, {
          default: () => [slots.title ? slots.title() : props.title]
        }), hasText && createVNode(VExpansionPanelText, {
          "key": "text"
        }, {
          default: () => [slots.text ? slots.text() : props.text]
        }), slots.default?.()]
      });
    });
    return {};
  }
});
const VFileInput$1 = "";
const makeVFileInputProps = propsFactory({
  chips: Boolean,
  counter: Boolean,
  counterSizeString: {
    type: String,
    default: "$vuetify.fileInput.counterSize"
  },
  counterString: {
    type: String,
    default: "$vuetify.fileInput.counter"
  },
  multiple: Boolean,
  showSize: {
    type: [Boolean, Number],
    default: false,
    validator: (v) => {
      return typeof v === "boolean" || [1e3, 1024].includes(v);
    }
  },
  ...makeVInputProps({
    prependIcon: "$file"
  }),
  modelValue: {
    type: Array,
    default: () => [],
    validator: (val) => {
      return wrapInArray(val).every((v) => v != null && typeof v === "object");
    }
  },
  ...makeVFieldProps({
    clearable: true
  })
}, "VFileInput");
const VFileInput = genericComponent()({
  name: "VFileInput",
  inheritAttrs: false,
  props: makeVFileInputProps(),
  emits: {
    "click:control": (e) => true,
    "mousedown:control": (e) => true,
    "update:focused": (focused) => true,
    "update:modelValue": (files) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const model = useProxiedModel(props, "modelValue");
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const base = computed(() => typeof props.showSize !== "boolean" ? props.showSize : void 0);
    const totalBytes = computed(() => (model.value ?? []).reduce((bytes, _ref2) => {
      let {
        size: size2 = 0
      } = _ref2;
      return bytes + size2;
    }, 0));
    const totalBytesReadable = computed(() => humanReadableFileSize(totalBytes.value, base.value));
    const fileNames = computed(() => (model.value ?? []).map((file) => {
      const {
        name = "",
        size: size2 = 0
      } = file;
      return !props.showSize ? name : `${name} (${humanReadableFileSize(size2, base.value)})`;
    }));
    const counterValue = computed(() => {
      const fileCount = model.value?.length ?? 0;
      if (props.showSize)
        return t(props.counterSizeString, fileCount, totalBytesReadable.value);
      else
        return t(props.counterString, fileCount);
    });
    const vInputRef = ref();
    const vFieldRef = ref();
    const inputRef = ref();
    const isActive = computed(() => isFocused.value || props.active);
    const isPlainOrUnderlined = computed(() => ["plain", "underlined"].includes(props.variant));
    function onFocus() {
      if (inputRef.value !== document.activeElement) {
        inputRef.value?.focus();
      }
      if (!isFocused.value)
        focus();
    }
    function onClickPrepend(e) {
      onControlClick(e);
    }
    function onControlMousedown(e) {
      emit2("mousedown:control", e);
    }
    function onControlClick(e) {
      inputRef.value?.click();
      emit2("click:control", e);
    }
    function onClear(e) {
      e.stopPropagation();
      onFocus();
      nextTick(() => {
        model.value = [];
        callEvent(props["onClick:clear"], e);
      });
    }
    watch(model, (newValue) => {
      const hasModelReset = !Array.isArray(newValue) || !newValue.length;
      if (hasModelReset && inputRef.value) {
        inputRef.value.value = "";
      }
    });
    useRender(() => {
      const hasCounter = !!(slots.counter || props.counter);
      const hasDetails = !!(hasCounter || slots.details);
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const {
        modelValue: _,
        ...inputProps
      } = VInput.filterProps(props);
      const fieldProps = filterFieldProps(props);
      return createVNode(VInput, mergeProps({
        "ref": vInputRef,
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": ["v-file-input", {
          "v-file-input--chips": !!props.chips,
          "v-input--plain-underlined": isPlainOrUnderlined.value
        }, props.class],
        "style": props.style,
        "onClick:prepend": onClickPrepend
      }, rootAttrs, inputProps, {
        "centerAffix": !isPlainOrUnderlined.value,
        "focused": isFocused.value
      }), {
        ...slots,
        default: (_ref3) => {
          let {
            id,
            isDisabled,
            isDirty,
            isReadonly: isReadonly2,
            isValid: isValid2
          } = _ref3;
          return createVNode(VField, mergeProps({
            "ref": vFieldRef,
            "prepend-icon": props.prependIcon,
            "onMousedown": onControlMousedown,
            "onClick": onControlClick,
            "onClick:clear": onClear,
            "onClick:prependInner": props["onClick:prependInner"],
            "onClick:appendInner": props["onClick:appendInner"]
          }, fieldProps, {
            "id": id.value,
            "active": isActive.value || isDirty.value,
            "dirty": isDirty.value,
            "disabled": isDisabled.value,
            "focused": isFocused.value,
            "error": isValid2.value === false
          }), {
            ...slots,
            default: (_ref4) => {
              let {
                props: {
                  class: fieldClass,
                  ...slotProps
                }
              } = _ref4;
              return createVNode(Fragment, null, [createVNode("input", mergeProps({
                "ref": inputRef,
                "type": "file",
                "readonly": isReadonly2.value,
                "disabled": isDisabled.value,
                "multiple": props.multiple,
                "name": props.name,
                "onClick": (e) => {
                  e.stopPropagation();
                  if (isReadonly2.value)
                    e.preventDefault();
                  onFocus();
                },
                "onChange": (e) => {
                  if (!e.target)
                    return;
                  const target = e.target;
                  model.value = [...target.files ?? []];
                },
                "onFocus": onFocus,
                "onBlur": blur
              }, slotProps, inputAttrs), null), createVNode("div", {
                "class": fieldClass
              }, [!!model.value?.length && (slots.selection ? slots.selection({
                fileNames: fileNames.value,
                totalBytes: totalBytes.value,
                totalBytesReadable: totalBytesReadable.value
              }) : props.chips ? fileNames.value.map((text) => createVNode(VChip, {
                "key": text,
                "size": "small",
                "color": props.color
              }, {
                default: () => [text]
              })) : fileNames.value.join(", "))])]);
            }
          });
        },
        details: hasDetails ? (slotProps) => createVNode(Fragment, null, [slots.details?.(slotProps), hasCounter && createVNode(Fragment, null, [createVNode("span", null, null), createVNode(VCounter, {
          "active": !!model.value?.length,
          "value": counterValue.value
        }, slots.counter)])]) : void 0
      });
    });
    return forwardRefs({}, vInputRef, vFieldRef, inputRef);
  }
});
const VFooter$1 = "";
const makeVFooterProps = propsFactory({
  app: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: "auto"
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "footer"
  }),
  ...makeThemeProps()
}, "VFooter");
const VFooter = genericComponent()({
  name: "VFooter",
  props: makeVFooterProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const autoHeight = shallowRef(32);
    const {
      resizeRef
    } = useResizeObserver((entries) => {
      if (!entries.length)
        return;
      autoHeight.value = entries[0].target.clientHeight;
    });
    const height = computed(() => props.height === "auto" ? autoHeight.value : parseInt(props.height, 10));
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: computed(() => "bottom"),
      layoutSize: height,
      elementSize: computed(() => props.height === "auto" ? void 0 : height.value),
      active: computed(() => props.app),
      absolute: toRef(props, "absolute")
    });
    useRender(() => createVNode(props.tag, {
      "ref": resizeRef,
      "class": ["v-footer", themeClasses.value, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value, props.class],
      "style": [backgroundColorStyles.value, props.app ? layoutItemStyles.value : {
        height: convertToUnit(props.height)
      }, props.style]
    }, slots));
    return {};
  }
});
const makeVFormProps = propsFactory({
  ...makeComponentProps(),
  ...makeFormProps()
}, "VForm");
const VForm = genericComponent()({
  name: "VForm",
  props: makeVFormProps(),
  emits: {
    "update:modelValue": (val) => true,
    submit: (e) => true
  },
  setup(props, _ref) {
    let {
      slots,
      emit: emit2
    } = _ref;
    const form = createForm(props);
    const formRef = ref();
    function onReset(e) {
      e.preventDefault();
      form.reset();
    }
    function onSubmit(_e) {
      const e = _e;
      const ready = form.validate();
      e.then = ready.then.bind(ready);
      e.catch = ready.catch.bind(ready);
      e.finally = ready.finally.bind(ready);
      emit2("submit", e);
      if (!e.defaultPrevented) {
        ready.then((_ref2) => {
          let {
            valid
          } = _ref2;
          if (valid) {
            formRef.value?.submit();
          }
        });
      }
      e.preventDefault();
    }
    useRender(() => createVNode("form", {
      "ref": formRef,
      "class": ["v-form", props.class],
      "style": props.style,
      "novalidate": true,
      "onReset": onReset,
      "onSubmit": onSubmit
    }, [slots.default?.(form)]));
    return forwardRefs(form, formRef);
  }
});
const makeVHoverProps = propsFactory({
  disabled: Boolean,
  modelValue: {
    type: Boolean,
    default: void 0
  },
  ...makeDelayProps()
}, "VHover");
const VHover = genericComponent()({
  name: "VHover",
  props: makeVHoverProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isHovering = useProxiedModel(props, "modelValue");
    const {
      runOpenDelay,
      runCloseDelay
    } = useDelay(props, (value) => !props.disabled && (isHovering.value = value));
    return () => slots.default?.({
      isHovering: isHovering.value,
      props: {
        onMouseenter: runOpenDelay,
        onMouseleave: runCloseDelay
      }
    });
  }
});
const VInfiniteScroll$1 = "";
const makeVInfiniteScrollProps = propsFactory({
  color: String,
  direction: {
    type: String,
    default: "vertical",
    validator: (v) => ["vertical", "horizontal"].includes(v)
  },
  side: {
    type: String,
    default: "end",
    validator: (v) => ["start", "end", "both"].includes(v)
  },
  mode: {
    type: String,
    default: "intersect",
    validator: (v) => ["intersect", "manual"].includes(v)
  },
  margin: [Number, String],
  loadMoreText: {
    type: String,
    default: "$vuetify.infiniteScroll.loadMore"
  },
  emptyText: {
    type: String,
    default: "$vuetify.infiniteScroll.empty"
  },
  ...makeDimensionProps(),
  ...makeTagProps()
}, "VInfiniteScroll");
const VInfiniteScrollIntersect = defineComponent({
  name: "VInfiniteScrollIntersect",
  props: {
    side: {
      type: String,
      required: true
    },
    rootRef: null,
    rootMargin: String
  },
  emits: {
    intersect: (side, isIntersecting) => true
  },
  setup(props, _ref) {
    let {
      emit: emit2
    } = _ref;
    const {
      intersectionRef,
      isIntersecting
    } = useIntersectionObserver((entries) => {
    }, props.rootMargin ? {
      rootMargin: props.rootMargin
    } : void 0);
    watch(isIntersecting, async (val) => {
      emit2("intersect", props.side, val);
    });
    useRender(() => createVNode("div", {
      "class": "v-infinite-scroll-intersect",
      "ref": intersectionRef
    }, [createTextVNode(" ")]));
    return {};
  }
});
const VInfiniteScroll = genericComponent()({
  name: "VInfiniteScroll",
  props: makeVInfiniteScrollProps(),
  emits: {
    load: (options) => true
  },
  setup(props, _ref2) {
    let {
      slots,
      emit: emit2
    } = _ref2;
    const rootEl = ref();
    const startStatus = shallowRef("ok");
    const endStatus = shallowRef("ok");
    const margin = computed(() => convertToUnit(props.margin));
    const isIntersecting = shallowRef(false);
    function setScrollAmount(amount) {
      if (!rootEl.value)
        return;
      const property = props.direction === "vertical" ? "scrollTop" : "scrollLeft";
      rootEl.value[property] = amount;
    }
    function getScrollAmount() {
      if (!rootEl.value)
        return 0;
      const property = props.direction === "vertical" ? "scrollTop" : "scrollLeft";
      return rootEl.value[property];
    }
    function getScrollSize() {
      if (!rootEl.value)
        return 0;
      const property = props.direction === "vertical" ? "scrollHeight" : "scrollWidth";
      return rootEl.value[property];
    }
    function getContainerSize() {
      if (!rootEl.value)
        return 0;
      const property = props.direction === "vertical" ? "clientHeight" : "clientWidth";
      return rootEl.value[property];
    }
    onMounted(() => {
      if (!rootEl.value)
        return;
      if (props.side === "start") {
        setScrollAmount(getScrollSize());
      } else if (props.side === "both") {
        setScrollAmount(getScrollSize() / 2 - getContainerSize() / 2);
      }
    });
    function setStatus(side, status) {
      if (side === "start") {
        startStatus.value = status;
      } else if (side === "end") {
        endStatus.value = status;
      }
    }
    function getStatus(side) {
      return side === "start" ? startStatus.value : endStatus.value;
    }
    let previousScrollSize = 0;
    function handleIntersect(side, _isIntersecting) {
      isIntersecting.value = _isIntersecting;
      if (isIntersecting.value) {
        intersecting(side);
      }
    }
    function intersecting(side) {
      if (props.mode !== "manual" && !isIntersecting.value)
        return;
      const status = getStatus(side);
      if (!rootEl.value || status === "loading")
        return;
      previousScrollSize = getScrollSize();
      setStatus(side, "loading");
      function done(status2) {
        setStatus(side, status2);
        nextTick(() => {
          if (status2 === "empty" || status2 === "error")
            return;
          if (status2 === "ok" && side === "start") {
            setScrollAmount(getScrollSize() - previousScrollSize + getScrollAmount());
          }
          if (props.mode !== "manual") {
            nextTick(() => {
              window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                  window.requestAnimationFrame(() => {
                    intersecting(side);
                  });
                });
              });
            });
          }
        });
      }
      emit2("load", {
        side,
        done
      });
    }
    const {
      t
    } = useLocale();
    function renderSide(side, status) {
      if (props.side !== side && props.side !== "both")
        return;
      const onClick = () => intersecting(side);
      const slotProps = {
        side,
        props: {
          onClick,
          color: props.color
        }
      };
      if (status === "error")
        return slots.error?.(slotProps);
      if (status === "empty")
        return slots.empty?.(slotProps) ?? createVNode("div", null, [t(props.emptyText)]);
      if (props.mode === "manual") {
        if (status === "loading") {
          return slots.loading?.(slotProps) ?? createVNode(VProgressCircular, {
            "indeterminate": true,
            "color": props.color
          }, null);
        }
        return slots["load-more"]?.(slotProps) ?? createVNode(VBtn, {
          "variant": "outlined",
          "color": props.color,
          "onClick": onClick
        }, {
          default: () => [t(props.loadMoreText)]
        });
      }
      return slots.loading?.(slotProps) ?? createVNode(VProgressCircular, {
        "indeterminate": true,
        "color": props.color
      }, null);
    }
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => {
      const Tag = props.tag;
      const hasStartIntersect = props.side === "start" || props.side === "both";
      const hasEndIntersect = props.side === "end" || props.side === "both";
      const intersectMode = props.mode === "intersect";
      return createVNode(Tag, {
        "ref": rootEl,
        "class": ["v-infinite-scroll", `v-infinite-scroll--${props.direction}`, {
          "v-infinite-scroll--start": hasStartIntersect,
          "v-infinite-scroll--end": hasEndIntersect
        }],
        "style": dimensionStyles.value
      }, {
        default: () => [createVNode("div", {
          "class": "v-infinite-scroll__side"
        }, [renderSide("start", startStatus.value)]), rootEl.value && hasStartIntersect && intersectMode && createVNode(VInfiniteScrollIntersect, {
          "key": "start",
          "side": "start",
          "onIntersect": handleIntersect,
          "rootRef": rootEl.value,
          "rootMargin": margin.value
        }, null), slots.default?.(), rootEl.value && hasEndIntersect && intersectMode && createVNode(VInfiniteScrollIntersect, {
          "key": "end",
          "side": "end",
          "onIntersect": handleIntersect,
          "rootRef": rootEl.value,
          "rootMargin": margin.value
        }, null), createVNode("div", {
          "class": "v-infinite-scroll__side"
        }, [renderSide("end", endStatus.value)])]
      });
    });
  }
});
const VItemGroup$1 = "";
const VItemGroupSymbol = Symbol.for("vuetify:v-item-group");
const makeVItemGroupProps = propsFactory({
  ...makeComponentProps(),
  ...makeGroupProps({
    selectedClass: "v-item--selected"
  }),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VItemGroup");
const VItemGroup = genericComponent()({
  name: "VItemGroup",
  props: makeVItemGroupProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      isSelected,
      select,
      next,
      prev,
      selected
    } = useGroup(props, VItemGroupSymbol);
    return () => createVNode(props.tag, {
      "class": ["v-item-group", themeClasses.value, props.class],
      "style": props.style
    }, {
      default: () => [slots.default?.({
        isSelected,
        select,
        next,
        prev,
        selected: selected.value
      })]
    });
  }
});
const VItem = genericComponent()({
  name: "VItem",
  props: makeGroupItemProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isSelected,
      select,
      toggle,
      selectedClass,
      value,
      disabled
    } = useGroupItem(props, VItemGroupSymbol);
    return () => slots.default?.({
      isSelected: isSelected.value,
      selectedClass: selectedClass.value,
      select,
      toggle,
      value: value.value,
      disabled: disabled.value
    });
  }
});
const VKbd$1 = "";
const VKbd = createSimpleFunctional("v-kbd");
const VLayout$1 = "";
const makeVLayoutProps = propsFactory({
  ...makeComponentProps(),
  ...makeLayoutProps()
}, "VLayout");
const VLayout = genericComponent()({
  name: "VLayout",
  props: makeVLayoutProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      layoutClasses,
      layoutStyles,
      getLayoutItem,
      items,
      layoutRef
    } = createLayout(props);
    useRender(() => createVNode("div", {
      "ref": layoutRef,
      "class": [layoutClasses.value, props.class],
      "style": [layoutStyles.value, props.style]
    }, [slots.default?.()]));
    return {
      getLayoutItem,
      items
    };
  }
});
const VLayoutItem$1 = "";
const makeVLayoutItemProps = propsFactory({
  position: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 300
  },
  modelValue: Boolean,
  ...makeComponentProps(),
  ...makeLayoutItemProps()
}, "VLayoutItem");
const VLayoutItem = genericComponent()({
  name: "VLayoutItem",
  props: makeVLayoutItemProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: toRef(props, "position"),
      elementSize: toRef(props, "size"),
      layoutSize: toRef(props, "size"),
      active: toRef(props, "modelValue"),
      absolute: toRef(props, "absolute")
    });
    return () => createVNode("div", {
      "class": ["v-layout-item", props.class],
      "style": [layoutItemStyles.value, props.style]
    }, [slots.default?.()]);
  }
});
const makeVLazyProps = propsFactory({
  modelValue: Boolean,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps(),
  ...makeTransitionProps({
    transition: "fade-transition"
  })
}, "VLazy");
const VLazy = genericComponent()({
  name: "VLazy",
  directives: {
    intersect: Intersect
  },
  props: makeVLazyProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const isActive = useProxiedModel(props, "modelValue");
    function onIntersect(isIntersecting) {
      if (isActive.value)
        return;
      isActive.value = isIntersecting;
    }
    useRender(() => withDirectives(createVNode(props.tag, {
      "class": ["v-lazy", props.class],
      "style": [dimensionStyles.value, props.style]
    }, {
      default: () => [isActive.value && createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => [slots.default?.()]
      })]
    }), [[resolveDirective("intersect"), {
      handler: onIntersect,
      options: props.options
    }, null]]));
    return {};
  }
});
const VLocaleProvider$1 = "";
const makeVLocaleProviderProps = propsFactory({
  locale: String,
  fallbackLocale: String,
  messages: Object,
  rtl: {
    type: Boolean,
    default: void 0
  },
  ...makeComponentProps()
}, "VLocaleProvider");
const VLocaleProvider = genericComponent()({
  name: "VLocaleProvider",
  props: makeVLocaleProviderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      rtlClasses
    } = provideLocale(props);
    useRender(() => createVNode("div", {
      "class": ["v-locale-provider", rtlClasses.value, props.class],
      "style": props.style
    }, [slots.default?.()]));
    return {};
  }
});
const VMain$1 = "";
const makeVMainProps = propsFactory({
  scrollable: Boolean,
  ...makeComponentProps(),
  ...makeTagProps({
    tag: "main"
  })
}, "VMain");
const VMain = genericComponent()({
  name: "VMain",
  props: makeVMainProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      mainStyles
    } = useLayout();
    const {
      ssrBootStyles
    } = useSsrBoot();
    useRender(() => createVNode(props.tag, {
      "class": ["v-main", {
        "v-main--scrollable": props.scrollable
      }, props.class],
      "style": [mainStyles.value, ssrBootStyles.value, props.style]
    }, {
      default: () => [props.scrollable ? createVNode("div", {
        "class": "v-main__scroller"
      }, [slots.default?.()]) : slots.default?.()]
    }));
    return {};
  }
});
const VNavigationDrawer$1 = "";
function useSticky(_ref) {
  let {
    rootEl,
    isSticky,
    layoutItemStyles
  } = _ref;
  const isStuck = shallowRef(false);
  const stuckPosition = shallowRef(0);
  const stickyStyles = computed(() => {
    const side = typeof isStuck.value === "boolean" ? "top" : isStuck.value;
    return [isSticky.value ? {
      top: "auto",
      bottom: "auto",
      height: void 0
    } : void 0, isStuck.value ? {
      [side]: convertToUnit(stuckPosition.value)
    } : {
      top: layoutItemStyles.value.top
    }];
  });
  onMounted(() => {
    watch(isSticky, (val) => {
      if (val) {
        window.addEventListener("scroll", onScroll, {
          passive: true
        });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    }, {
      immediate: true
    });
  });
  onBeforeUnmount(() => {
    window.removeEventListener("scroll", onScroll);
  });
  let lastScrollTop = 0;
  function onScroll() {
    const direction = lastScrollTop > window.scrollY ? "up" : "down";
    const rect = rootEl.value.getBoundingClientRect();
    const layoutTop = parseFloat(layoutItemStyles.value.top ?? 0);
    const top = window.scrollY - Math.max(0, stuckPosition.value - layoutTop);
    const bottom = rect.height + Math.max(stuckPosition.value, layoutTop) - window.scrollY - window.innerHeight;
    const bodyScroll = parseFloat(getComputedStyle(rootEl.value).getPropertyValue("--v-body-scroll-y")) || 0;
    if (rect.height < window.innerHeight - layoutTop) {
      isStuck.value = "top";
      stuckPosition.value = layoutTop;
    } else if (direction === "up" && isStuck.value === "bottom" || direction === "down" && isStuck.value === "top") {
      stuckPosition.value = window.scrollY + rect.top - bodyScroll;
      isStuck.value = true;
    } else if (direction === "down" && bottom <= 0) {
      stuckPosition.value = 0;
      isStuck.value = "bottom";
    } else if (direction === "up" && top <= 0) {
      if (!bodyScroll) {
        stuckPosition.value = rect.top + top;
        isStuck.value = "top";
      } else if (isStuck.value !== "top") {
        stuckPosition.value = -top + bodyScroll + layoutTop;
        isStuck.value = "top";
      }
    }
    lastScrollTop = window.scrollY;
  }
  return {
    isStuck,
    stickyStyles
  };
}
const HORIZON = 100;
const HISTORY = 20;
function kineticEnergyToVelocity(work) {
  const sqrt2 = 1.41421356237;
  return (work < 0 ? -1 : 1) * Math.sqrt(Math.abs(work)) * sqrt2;
}
function calculateImpulseVelocity(samples) {
  if (samples.length < 2) {
    return 0;
  }
  if (samples.length === 2) {
    if (samples[1].t === samples[0].t) {
      return 0;
    }
    return (samples[1].d - samples[0].d) / (samples[1].t - samples[0].t);
  }
  let work = 0;
  for (let i = samples.length - 1; i > 0; i--) {
    if (samples[i].t === samples[i - 1].t) {
      continue;
    }
    const vprev = kineticEnergyToVelocity(work);
    const vcurr = (samples[i].d - samples[i - 1].d) / (samples[i].t - samples[i - 1].t);
    work += (vcurr - vprev) * Math.abs(vcurr);
    if (i === samples.length - 1) {
      work *= 0.5;
    }
  }
  return kineticEnergyToVelocity(work) * 1e3;
}
function useVelocity() {
  const touches = {};
  function addMovement(e) {
    Array.from(e.changedTouches).forEach((touch) => {
      const samples = touches[touch.identifier] ?? (touches[touch.identifier] = new CircularBuffer(HISTORY));
      samples.push([e.timeStamp, touch]);
    });
  }
  function endTouch(e) {
    Array.from(e.changedTouches).forEach((touch) => {
      delete touches[touch.identifier];
    });
  }
  function getVelocity(id) {
    const samples = touches[id]?.values().reverse();
    if (!samples) {
      throw new Error(`No samples for touch id ${id}`);
    }
    const newest = samples[0];
    const x = [];
    const y = [];
    for (const val of samples) {
      if (newest[0] - val[0] > HORIZON)
        break;
      x.push({
        t: val[0],
        d: val[1].clientX
      });
      y.push({
        t: val[0],
        d: val[1].clientY
      });
    }
    return {
      x: calculateImpulseVelocity(x),
      y: calculateImpulseVelocity(y),
      get direction() {
        const {
          x: x2,
          y: y2
        } = this;
        const [absX, absY] = [Math.abs(x2), Math.abs(y2)];
        return absX > absY && x2 >= 0 ? "right" : absX > absY && x2 <= 0 ? "left" : absY > absX && y2 >= 0 ? "down" : absY > absX && y2 <= 0 ? "up" : oops$1();
      }
    };
  }
  return {
    addMovement,
    endTouch,
    getVelocity
  };
}
function oops$1() {
  throw new Error();
}
function useTouch(_ref) {
  let {
    isActive,
    isTemporary,
    width,
    touchless,
    position
  } = _ref;
  onMounted(() => {
    window.addEventListener("touchstart", onTouchstart, {
      passive: true
    });
    window.addEventListener("touchmove", onTouchmove, {
      passive: false
    });
    window.addEventListener("touchend", onTouchend, {
      passive: true
    });
  });
  onBeforeUnmount(() => {
    window.removeEventListener("touchstart", onTouchstart);
    window.removeEventListener("touchmove", onTouchmove);
    window.removeEventListener("touchend", onTouchend);
  });
  const isHorizontal = computed(() => ["left", "right"].includes(position.value));
  const {
    addMovement,
    endTouch,
    getVelocity
  } = useVelocity();
  let maybeDragging = false;
  const isDragging = shallowRef(false);
  const dragProgress = shallowRef(0);
  const offset = shallowRef(0);
  let start;
  function getOffset2(pos, active) {
    return (position.value === "left" ? pos : position.value === "right" ? document.documentElement.clientWidth - pos : position.value === "top" ? pos : position.value === "bottom" ? document.documentElement.clientHeight - pos : oops()) - (active ? width.value : 0);
  }
  function getProgress(pos) {
    let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    const progress = position.value === "left" ? (pos - offset.value) / width.value : position.value === "right" ? (document.documentElement.clientWidth - pos - offset.value) / width.value : position.value === "top" ? (pos - offset.value) / width.value : position.value === "bottom" ? (document.documentElement.clientHeight - pos - offset.value) / width.value : oops();
    return limit ? Math.max(0, Math.min(1, progress)) : progress;
  }
  function onTouchstart(e) {
    if (touchless.value)
      return;
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const touchZone = 25;
    const inTouchZone = position.value === "left" ? touchX < touchZone : position.value === "right" ? touchX > document.documentElement.clientWidth - touchZone : position.value === "top" ? touchY < touchZone : position.value === "bottom" ? touchY > document.documentElement.clientHeight - touchZone : oops();
    const inElement = isActive.value && (position.value === "left" ? touchX < width.value : position.value === "right" ? touchX > document.documentElement.clientWidth - width.value : position.value === "top" ? touchY < width.value : position.value === "bottom" ? touchY > document.documentElement.clientHeight - width.value : oops());
    if (inTouchZone || inElement || isActive.value && isTemporary.value) {
      maybeDragging = true;
      start = [touchX, touchY];
      offset.value = getOffset2(isHorizontal.value ? touchX : touchY, isActive.value);
      dragProgress.value = getProgress(isHorizontal.value ? touchX : touchY);
      endTouch(e);
      addMovement(e);
    }
  }
  function onTouchmove(e) {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    if (maybeDragging) {
      if (!e.cancelable) {
        maybeDragging = false;
        return;
      }
      const dx = Math.abs(touchX - start[0]);
      const dy = Math.abs(touchY - start[1]);
      const thresholdMet = isHorizontal.value ? dx > dy && dx > 3 : dy > dx && dy > 3;
      if (thresholdMet) {
        isDragging.value = true;
        maybeDragging = false;
      } else if ((isHorizontal.value ? dy : dx) > 3) {
        maybeDragging = false;
      }
    }
    if (!isDragging.value)
      return;
    e.preventDefault();
    addMovement(e);
    const progress = getProgress(isHorizontal.value ? touchX : touchY, false);
    dragProgress.value = Math.max(0, Math.min(1, progress));
    if (progress > 1) {
      offset.value = getOffset2(isHorizontal.value ? touchX : touchY, true);
    } else if (progress < 0) {
      offset.value = getOffset2(isHorizontal.value ? touchX : touchY, false);
    }
  }
  function onTouchend(e) {
    maybeDragging = false;
    if (!isDragging.value)
      return;
    addMovement(e);
    isDragging.value = false;
    const velocity = getVelocity(e.changedTouches[0].identifier);
    const vx = Math.abs(velocity.x);
    const vy = Math.abs(velocity.y);
    const thresholdMet = isHorizontal.value ? vx > vy && vx > 400 : vy > vx && vy > 3;
    if (thresholdMet) {
      isActive.value = velocity.direction === ({
        left: "right",
        right: "left",
        top: "down",
        bottom: "up"
      }[position.value] || oops());
    } else {
      isActive.value = dragProgress.value > 0.5;
    }
  }
  const dragStyles = computed(() => {
    return isDragging.value ? {
      transform: position.value === "left" ? `translateX(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "right" ? `translateX(calc(100% - ${dragProgress.value * width.value}px))` : position.value === "top" ? `translateY(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "bottom" ? `translateY(calc(100% - ${dragProgress.value * width.value}px))` : oops(),
      transition: "none"
    } : void 0;
  });
  return {
    isDragging,
    dragProgress,
    dragStyles
  };
}
function oops() {
  throw new Error();
}
const locations = ["start", "end", "left", "right", "top", "bottom"];
const makeVNavigationDrawerProps = propsFactory({
  color: String,
  disableResizeWatcher: Boolean,
  disableRouteWatcher: Boolean,
  expandOnHover: Boolean,
  floating: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  permanent: Boolean,
  rail: {
    type: Boolean,
    default: null
  },
  railWidth: {
    type: [Number, String],
    default: 56
  },
  scrim: {
    type: [Boolean, String],
    default: true
  },
  image: String,
  temporary: Boolean,
  touchless: Boolean,
  width: {
    type: [Number, String],
    default: 256
  },
  location: {
    type: String,
    default: "start",
    validator: (value) => locations.includes(value)
  },
  sticky: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDisplayProps(),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "nav"
  }),
  ...makeThemeProps()
}, "VNavigationDrawer");
const VNavigationDrawer = genericComponent()({
  name: "VNavigationDrawer",
  props: makeVNavigationDrawerProps(),
  emits: {
    "update:modelValue": (val) => true,
    "update:rail": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const {
      isRtl
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      elevationClasses
    } = useElevation(props);
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const {
      roundedClasses
    } = useRounded(props);
    const router2 = useRouter();
    const isActive = useProxiedModel(props, "modelValue", null, (v) => !!v);
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      scopeId
    } = useScopeId();
    const rootEl = ref();
    const isHovering = shallowRef(false);
    const width = computed(() => {
      return props.rail && props.expandOnHover && isHovering.value ? Number(props.width) : Number(props.rail ? props.railWidth : props.width);
    });
    const location2 = computed(() => {
      return toPhysical(props.location, isRtl.value);
    });
    const isTemporary = computed(() => !props.permanent && (mobile.value || props.temporary));
    const isSticky = computed(() => props.sticky && !isTemporary.value && location2.value !== "bottom");
    useToggleScope(() => props.expandOnHover && props.rail != null, () => {
      watch(isHovering, (val) => emit2("update:rail", !val));
    });
    useToggleScope(() => !props.disableResizeWatcher, () => {
      watch(isTemporary, (val) => !props.permanent && nextTick(() => isActive.value = !val));
    });
    useToggleScope(() => !props.disableRouteWatcher && !!router2, () => {
      watch(router2.currentRoute, () => isTemporary.value && (isActive.value = false));
    });
    watch(() => props.permanent, (val) => {
      if (val)
        isActive.value = true;
    });
    onBeforeMount(() => {
      if (props.modelValue != null || isTemporary.value)
        return;
      isActive.value = props.permanent || !mobile.value;
    });
    const {
      isDragging,
      dragProgress,
      dragStyles
    } = useTouch({
      isActive,
      isTemporary,
      width,
      touchless: toRef(props, "touchless"),
      position: location2
    });
    const layoutSize = computed(() => {
      const size2 = isTemporary.value ? 0 : props.rail && props.expandOnHover ? Number(props.railWidth) : width.value;
      return isDragging.value ? size2 * dragProgress.value : size2;
    });
    const {
      layoutItemStyles,
      layoutItemScrimStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: location2,
      layoutSize,
      elementSize: width,
      active: computed(() => isActive.value || isDragging.value),
      disableTransitions: computed(() => isDragging.value),
      absolute: computed(() => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        props.absolute || isSticky.value && typeof isStuck.value !== "string"
      ))
    });
    const {
      isStuck,
      stickyStyles
    } = useSticky({
      rootEl,
      isSticky,
      layoutItemStyles
    });
    const scrimColor = useBackgroundColor(computed(() => {
      return typeof props.scrim === "string" ? props.scrim : null;
    }));
    const scrimStyles = computed(() => ({
      ...isDragging.value ? {
        opacity: dragProgress.value * 0.2,
        transition: "none"
      } : void 0,
      ...layoutItemScrimStyles.value
    }));
    provideDefaults({
      VList: {
        bgColor: "transparent"
      }
    });
    function onMouseenter() {
      isHovering.value = true;
    }
    function onMouseleave() {
      isHovering.value = false;
    }
    useRender(() => {
      const hasImage = slots.image || props.image;
      return createVNode(Fragment, null, [createVNode(props.tag, mergeProps({
        "ref": rootEl,
        "onMouseenter": onMouseenter,
        "onMouseleave": onMouseleave,
        "class": ["v-navigation-drawer", `v-navigation-drawer--${location2.value}`, {
          "v-navigation-drawer--expand-on-hover": props.expandOnHover,
          "v-navigation-drawer--floating": props.floating,
          "v-navigation-drawer--is-hovering": isHovering.value,
          "v-navigation-drawer--rail": props.rail,
          "v-navigation-drawer--temporary": isTemporary.value,
          "v-navigation-drawer--active": isActive.value,
          "v-navigation-drawer--sticky": isSticky.value
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, displayClasses.value, elevationClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, layoutItemStyles.value, dragStyles.value, ssrBootStyles.value, stickyStyles.value, props.style]
      }, scopeId, attrs), {
        default: () => [hasImage && createVNode("div", {
          "key": "image",
          "class": "v-navigation-drawer__img"
        }, [slots.image ? slots.image?.({
          image: props.image
        }) : createVNode("img", {
          "src": props.image,
          "alt": ""
        }, null)]), slots.prepend && createVNode("div", {
          "class": "v-navigation-drawer__prepend"
        }, [slots.prepend?.()]), createVNode("div", {
          "class": "v-navigation-drawer__content"
        }, [slots.default?.()]), slots.append && createVNode("div", {
          "class": "v-navigation-drawer__append"
        }, [slots.append?.()])]
      }), createVNode(Transition, {
        "name": "fade-transition"
      }, {
        default: () => [isTemporary.value && (isDragging.value || isActive.value) && !!props.scrim && createVNode("div", mergeProps({
          "class": ["v-navigation-drawer__scrim", scrimColor.backgroundColorClasses.value],
          "style": [scrimStyles.value, scrimColor.backgroundColorStyles.value],
          "onClick": () => isActive.value = false
        }, scopeId), null)]
      })]);
    });
    return {
      isStuck
    };
  }
});
const VNoSsr = defineComponent({
  name: "VNoSsr",
  setup(_, _ref) {
    let {
      slots
    } = _ref;
    const show = useHydration();
    return () => show.value && slots.default?.();
  }
});
const VOtpInput$1 = "";
const makeVOtpInputProps = propsFactory({
  autofocus: Boolean,
  divider: String,
  focusAll: Boolean,
  label: {
    type: String,
    default: "$vuetify.input.otp"
  },
  length: {
    type: [Number, String],
    default: 6
  },
  modelValue: {
    type: [Number, String],
    default: void 0
  },
  placeholder: String,
  type: {
    type: String,
    default: "number"
  },
  ...makeDimensionProps(),
  ...makeFocusProps(),
  ...only(makeVFieldProps({
    variant: "outlined"
  }), ["baseColor", "bgColor", "class", "color", "disabled", "error", "loading", "rounded", "style", "theme", "variant"])
}, "VOtpInput");
const VOtpInput = genericComponent()({
  name: "VOtpInput",
  props: makeVOtpInputProps(),
  emits: {
    finish: (val) => true,
    "update:focused": (val) => true,
    "update:modelValue": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const model = useProxiedModel(props, "modelValue", "", (val) => String(val).split(""), (val) => val.join(""));
    const {
      t
    } = useLocale();
    const length = computed(() => Number(props.length));
    const fields = computed(() => Array(length.value).fill(0));
    const focusIndex = ref(-1);
    const contentRef = ref();
    const inputRef = ref([]);
    const current = computed(() => inputRef.value[focusIndex.value]);
    function onInput() {
      if (props.type === "number" && /[^0-9]/g.test(current.value.value)) {
        current.value.value = "";
        return;
      }
      const array = model.value.slice();
      const value = current.value.value;
      array[focusIndex.value] = value;
      let target = null;
      if (focusIndex.value > model.value.length) {
        target = model.value.length + 1;
      } else if (focusIndex.value + 1 !== length.value) {
        target = "next";
      }
      model.value = array;
      if (target)
        focusChild(contentRef.value, target);
    }
    function onKeydown(e) {
      const array = model.value.slice();
      const index = focusIndex.value;
      let target = null;
      if (!["ArrowLeft", "ArrowRight", "Backspace", "Delete"].includes(e.key))
        return;
      e.preventDefault();
      if (e.key === "ArrowLeft") {
        target = "prev";
      } else if (e.key === "ArrowRight") {
        target = "next";
      } else if (["Backspace", "Delete"].includes(e.key)) {
        array[focusIndex.value] = "";
        model.value = array;
        if (focusIndex.value > 0 && e.key === "Backspace") {
          target = "prev";
        } else {
          requestAnimationFrame(() => {
            inputRef.value[index]?.select();
          });
        }
      }
      requestAnimationFrame(() => {
        if (target != null) {
          focusChild(contentRef.value, target);
        }
      });
    }
    function onPaste(index, e) {
      e.preventDefault();
      e.stopPropagation();
      model.value = (e?.clipboardData?.getData("Text") ?? "").split("");
      inputRef.value?.[index].blur();
    }
    function reset() {
      model.value = [];
    }
    function onFocus(e, index) {
      focus();
      focusIndex.value = index;
    }
    function onBlur() {
      blur();
      focusIndex.value = -1;
    }
    provideDefaults({
      VField: {
        color: computed(() => props.color),
        bgColor: computed(() => props.color),
        baseColor: computed(() => props.baseColor),
        disabled: computed(() => props.disabled),
        error: computed(() => props.error),
        variant: computed(() => props.variant)
      }
    }, {
      scoped: true
    });
    watch(model, (val) => {
      if (val.length === length.value)
        emit2("finish", val.join(""));
    }, {
      deep: true
    });
    watch(focusIndex, (val) => {
      if (val < 0)
        return;
      nextTick(() => {
        inputRef.value[val]?.select();
      });
    });
    useRender(() => {
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      return createVNode("div", mergeProps({
        "class": ["v-otp-input", {
          "v-otp-input--divided": !!props.divider
        }, props.class],
        "style": [props.style]
      }, rootAttrs), [createVNode("div", {
        "ref": contentRef,
        "class": "v-otp-input__content",
        "style": [dimensionStyles.value]
      }, [fields.value.map((_, i) => createVNode(Fragment, null, [props.divider && i !== 0 && createVNode("span", {
        "class": "v-otp-input__divider"
      }, [props.divider]), createVNode(VField, {
        "focused": isFocused.value && props.focusAll || focusIndex.value === i,
        "key": i
      }, {
        ...slots,
        default: () => {
          return createVNode("input", {
            "ref": (val) => inputRef.value[i] = val,
            "aria-label": t(props.label, i + 1),
            "autofocus": i === 0 && props.autofocus,
            "autocomplete": "one-time-code",
            "class": ["v-otp-input__field"],
            "disabled": props.disabled,
            "inputmode": props.type === "number" ? "numeric" : "text",
            "min": props.type === "number" ? 0 : void 0,
            "maxlength": "1",
            "placeholder": props.placeholder,
            "type": props.type === "number" ? "text" : props.type,
            "value": model.value[i],
            "onInput": onInput,
            "onFocus": (e) => onFocus(e, i),
            "onBlur": onBlur,
            "onKeydown": onKeydown,
            "onPaste": (event) => onPaste(i, event)
          }, null);
        }
      })])), createVNode("input", mergeProps({
        "class": "v-otp-input-input",
        "type": "hidden"
      }, inputAttrs, {
        "value": model.value.join("")
      }), null), createVNode(VOverlay, {
        "contained": true,
        "content-class": "v-otp-input__loader",
        "model-value": !!props.loading,
        "persistent": true
      }, {
        default: () => [slots.loader?.() ?? createVNode(VProgressCircular, {
          "color": typeof props.loading === "boolean" ? void 0 : props.loading,
          "indeterminate": true,
          "size": "24",
          "width": "2"
        }, null)]
      }), slots.default?.()])]);
    });
    return {
      blur: () => {
        inputRef.value?.some((input) => input.blur());
      },
      focus: () => {
        inputRef.value?.[0].focus();
      },
      reset,
      isFocused
    };
  }
});
const VParallax$1 = "";
function floor(val) {
  return Math.floor(Math.abs(val)) * Math.sign(val);
}
const makeVParallaxProps = propsFactory({
  scale: {
    type: [Number, String],
    default: 0.5
  },
  ...makeComponentProps()
}, "VParallax");
const VParallax = genericComponent()({
  name: "VParallax",
  props: makeVParallaxProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      intersectionRef,
      isIntersecting
    } = useIntersectionObserver();
    const {
      resizeRef,
      contentRect
    } = useResizeObserver();
    const {
      height: displayHeight
    } = useDisplay();
    const root = ref();
    watchEffect(() => {
      intersectionRef.value = resizeRef.value = root.value?.$el;
    });
    let scrollParent;
    watch(isIntersecting, (val) => {
      if (val) {
        scrollParent = getScrollParent(intersectionRef.value);
        scrollParent = scrollParent === document.scrollingElement ? document : scrollParent;
        scrollParent.addEventListener("scroll", onScroll, {
          passive: true
        });
        onScroll();
      } else {
        scrollParent.removeEventListener("scroll", onScroll);
      }
    });
    onBeforeUnmount(() => {
      scrollParent?.removeEventListener("scroll", onScroll);
    });
    watch(displayHeight, onScroll);
    watch(() => contentRect.value?.height, onScroll);
    const scale = computed(() => {
      return 1 - clamp(+props.scale);
    });
    let frame = -1;
    function onScroll() {
      if (!isIntersecting.value)
        return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = (root.value?.$el).querySelector(".v-img__img");
        if (!el)
          return;
        const scrollHeight = scrollParent instanceof Document ? document.documentElement.clientHeight : scrollParent.clientHeight;
        const scrollPos = scrollParent instanceof Document ? window.scrollY : scrollParent.scrollTop;
        const top = intersectionRef.value.getBoundingClientRect().top + scrollPos;
        const height = contentRect.value.height;
        const center = top + (height - scrollHeight) / 2;
        const translate = floor((scrollPos - center) * scale.value);
        const sizeScale = Math.max(1, (scale.value * (scrollHeight - height) + height) / height);
        el.style.setProperty("transform", `translateY(${translate}px) scale(${sizeScale})`);
      });
    }
    useRender(() => createVNode(VImg, {
      "class": ["v-parallax", {
        "v-parallax--active": isIntersecting.value
      }, props.class],
      "style": props.style,
      "ref": root,
      "cover": true,
      "onLoadstart": onScroll,
      "onLoad": onScroll
    }, slots));
    return {};
  }
});
const makeVRadioProps = propsFactory({
  ...makeVSelectionControlProps({
    falseIcon: "$radioOff",
    trueIcon: "$radioOn"
  })
}, "VRadio");
const VRadio = genericComponent()({
  name: "VRadio",
  props: makeVRadioProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => createVNode(VSelectionControl, mergeProps(props, {
      "class": ["v-radio", props.class],
      "style": props.style,
      "type": "radio"
    }), slots));
    return {};
  }
});
const VRadioGroup$1 = "";
const makeVRadioGroupProps = propsFactory({
  height: {
    type: [Number, String],
    default: "auto"
  },
  ...makeVInputProps(),
  ...omit(makeSelectionControlGroupProps(), ["multiple"]),
  trueIcon: {
    type: IconValue,
    default: "$radioOn"
  },
  falseIcon: {
    type: IconValue,
    default: "$radioOff"
  },
  type: {
    type: String,
    default: "radio"
  }
}, "VRadioGroup");
const VRadioGroup = genericComponent()({
  name: "VRadioGroup",
  inheritAttrs: false,
  props: makeVRadioGroupProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const uid2 = getUid();
    const id = computed(() => props.id || `radio-group-${uid2}`);
    const model = useProxiedModel(props, "modelValue");
    useRender(() => {
      const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
      const inputProps = VInput.filterProps(props);
      const controlProps = VSelectionControl.filterProps(props);
      const label = slots.label ? slots.label({
        label: props.label,
        props: {
          for: id.value
        }
      }) : props.label;
      return createVNode(VInput, mergeProps({
        "class": ["v-radio-group", props.class],
        "style": props.style
      }, rootAttrs, inputProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "id": id.value
      }), {
        ...slots,
        default: (_ref2) => {
          let {
            id: id2,
            messagesId,
            isDisabled,
            isReadonly: isReadonly2
          } = _ref2;
          return createVNode(Fragment, null, [label && createVNode(VLabel, {
            "id": id2.value
          }, {
            default: () => [label]
          }), createVNode(VSelectionControlGroup, mergeProps(controlProps, {
            "id": id2.value,
            "aria-describedby": messagesId.value,
            "defaultsTarget": "VRadio",
            "trueIcon": props.trueIcon,
            "falseIcon": props.falseIcon,
            "type": props.type,
            "disabled": isDisabled.value,
            "readonly": isReadonly2.value,
            "aria-labelledby": label ? id2.value : void 0,
            "multiple": false
          }, controlAttrs, {
            "modelValue": model.value,
            "onUpdate:modelValue": ($event) => model.value = $event
          }), slots)]);
        }
      });
    });
    return {};
  }
});
const makeVRangeSliderProps = propsFactory({
  ...makeFocusProps(),
  ...makeVInputProps(),
  ...makeSliderProps(),
  strict: Boolean,
  modelValue: {
    type: Array,
    default: () => [0, 0]
  }
}, "VRangeSlider");
const VRangeSlider = genericComponent()({
  name: "VRangeSlider",
  props: makeVRangeSliderProps(),
  emits: {
    "update:focused": (value) => true,
    "update:modelValue": (value) => true,
    end: (value) => true,
    start: (value) => true
  },
  setup(props, _ref) {
    let {
      slots,
      emit: emit2
    } = _ref;
    const startThumbRef = ref();
    const stopThumbRef = ref();
    const inputRef = ref();
    const {
      rtlClasses
    } = useRtl();
    function getActiveThumb(e) {
      if (!startThumbRef.value || !stopThumbRef.value)
        return;
      const startOffset = getOffset(e, startThumbRef.value.$el, props.direction);
      const stopOffset = getOffset(e, stopThumbRef.value.$el, props.direction);
      const a = Math.abs(startOffset);
      const b = Math.abs(stopOffset);
      return a < b || a === b && startOffset < 0 ? startThumbRef.value.$el : stopThumbRef.value.$el;
    }
    const steps = useSteps(props);
    const model = useProxiedModel(props, "modelValue", void 0, (arr) => {
      if (!arr?.length)
        return [0, 0];
      return arr.map((value) => steps.roundValue(value));
    });
    const {
      activeThumbRef,
      hasLabels,
      max,
      min,
      mousePressed,
      onSliderMousedown,
      onSliderTouchstart,
      position,
      trackContainerRef
    } = useSlider({
      props,
      steps,
      onSliderStart: () => {
        emit2("start", model.value);
      },
      onSliderEnd: (_ref2) => {
        let {
          value
        } = _ref2;
        const newValue = activeThumbRef.value === startThumbRef.value?.$el ? [value, model.value[1]] : [model.value[0], value];
        if (!props.strict && newValue[0] < newValue[1]) {
          model.value = newValue;
        }
        emit2("end", model.value);
      },
      onSliderMove: (_ref3) => {
        let {
          value
        } = _ref3;
        const [start, stop] = model.value;
        if (!props.strict && start === stop && start !== min.value) {
          activeThumbRef.value = value > start ? stopThumbRef.value?.$el : startThumbRef.value?.$el;
          activeThumbRef.value?.focus();
        }
        if (activeThumbRef.value === startThumbRef.value?.$el) {
          model.value = [Math.min(value, stop), stop];
        } else {
          model.value = [start, Math.max(start, value)];
        }
      },
      getActiveThumb
    });
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const trackStart = computed(() => position(model.value[0]));
    const trackStop = computed(() => position(model.value[1]));
    useRender(() => {
      const inputProps = VInput.filterProps(props);
      const hasPrepend = !!(props.label || slots.label || slots.prepend);
      return createVNode(VInput, mergeProps({
        "class": ["v-slider", "v-range-slider", {
          "v-slider--has-labels": !!slots["tick-label"] || hasLabels.value,
          "v-slider--focused": isFocused.value,
          "v-slider--pressed": mousePressed.value,
          "v-slider--disabled": props.disabled
        }, rtlClasses.value, props.class],
        "style": props.style,
        "ref": inputRef
      }, inputProps, {
        "focused": isFocused.value
      }), {
        ...slots,
        prepend: hasPrepend ? (slotProps) => createVNode(Fragment, null, [slots.label?.(slotProps) ?? (props.label ? createVNode(VLabel, {
          "class": "v-slider__label",
          "text": props.label
        }, null) : void 0), slots.prepend?.(slotProps)]) : void 0,
        default: (_ref4) => {
          let {
            id,
            messagesId
          } = _ref4;
          return createVNode("div", {
            "class": "v-slider__container",
            "onMousedown": onSliderMousedown,
            "onTouchstartPassive": onSliderTouchstart
          }, [createVNode("input", {
            "id": `${id.value}_start`,
            "name": props.name || id.value,
            "disabled": !!props.disabled,
            "readonly": !!props.readonly,
            "tabindex": "-1",
            "value": model.value[0]
          }, null), createVNode("input", {
            "id": `${id.value}_stop`,
            "name": props.name || id.value,
            "disabled": !!props.disabled,
            "readonly": !!props.readonly,
            "tabindex": "-1",
            "value": model.value[1]
          }, null), createVNode(VSliderTrack, {
            "ref": trackContainerRef,
            "start": trackStart.value,
            "stop": trackStop.value
          }, {
            "tick-label": slots["tick-label"]
          }), createVNode(VSliderThumb, {
            "ref": startThumbRef,
            "aria-describedby": messagesId.value,
            "focused": isFocused && activeThumbRef.value === startThumbRef.value?.$el,
            "modelValue": model.value[0],
            "onUpdate:modelValue": (v) => model.value = [v, model.value[1]],
            "onFocus": (e) => {
              focus();
              activeThumbRef.value = startThumbRef.value?.$el;
              if (model.value[0] === model.value[1] && model.value[1] === min.value && e.relatedTarget !== stopThumbRef.value?.$el) {
                startThumbRef.value?.$el.blur();
                stopThumbRef.value?.$el.focus();
              }
            },
            "onBlur": () => {
              blur();
              activeThumbRef.value = void 0;
            },
            "min": min.value,
            "max": model.value[1],
            "position": trackStart.value,
            "ripple": props.ripple
          }, {
            "thumb-label": slots["thumb-label"]
          }), createVNode(VSliderThumb, {
            "ref": stopThumbRef,
            "aria-describedby": messagesId.value,
            "focused": isFocused && activeThumbRef.value === stopThumbRef.value?.$el,
            "modelValue": model.value[1],
            "onUpdate:modelValue": (v) => model.value = [model.value[0], v],
            "onFocus": (e) => {
              focus();
              activeThumbRef.value = stopThumbRef.value?.$el;
              if (model.value[0] === model.value[1] && model.value[0] === max.value && e.relatedTarget !== startThumbRef.value?.$el) {
                stopThumbRef.value?.$el.blur();
                startThumbRef.value?.$el.focus();
              }
            },
            "onBlur": () => {
              blur();
              activeThumbRef.value = void 0;
            },
            "min": model.value[0],
            "max": max.value,
            "position": trackStop.value,
            "ripple": props.ripple
          }, {
            "thumb-label": slots["thumb-label"]
          })]);
        }
      });
    });
    return {};
  }
});
const VRating$1 = "";
const makeVRatingProps = propsFactory({
  name: String,
  itemAriaLabel: {
    type: String,
    default: "$vuetify.rating.ariaLabel.item"
  },
  activeColor: String,
  color: String,
  clearable: Boolean,
  disabled: Boolean,
  emptyIcon: {
    type: IconValue,
    default: "$ratingEmpty"
  },
  fullIcon: {
    type: IconValue,
    default: "$ratingFull"
  },
  halfIncrements: Boolean,
  hover: Boolean,
  length: {
    type: [Number, String],
    default: 5
  },
  readonly: Boolean,
  modelValue: {
    type: [Number, String],
    default: 0
  },
  itemLabels: Array,
  itemLabelPosition: {
    type: String,
    default: "top",
    validator: (v) => ["top", "bottom"].includes(v)
  },
  ripple: Boolean,
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VRating");
const VRating = genericComponent()({
  name: "VRating",
  props: makeVRatingProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    const {
      themeClasses
    } = provideTheme(props);
    const rating = useProxiedModel(props, "modelValue");
    const normalizedValue = computed(() => clamp(parseFloat(rating.value), 0, +props.length));
    const range = computed(() => createRange(Number(props.length), 1));
    const increments = computed(() => range.value.flatMap((v) => props.halfIncrements ? [v - 0.5, v] : [v]));
    const hoverIndex = shallowRef(-1);
    const itemState = computed(() => increments.value.map((value) => {
      const isHovering = props.hover && hoverIndex.value > -1;
      const isFilled = normalizedValue.value >= value;
      const isHovered = hoverIndex.value >= value;
      const isFullIcon = isHovering ? isHovered : isFilled;
      const icon = isFullIcon ? props.fullIcon : props.emptyIcon;
      const activeColor = props.activeColor ?? props.color;
      const color = isFilled || isHovered ? activeColor : props.color;
      return {
        isFilled,
        isHovered,
        icon,
        color
      };
    }));
    const eventState = computed(() => [0, ...increments.value].map((value) => {
      function onMouseenter() {
        hoverIndex.value = value;
      }
      function onMouseleave() {
        hoverIndex.value = -1;
      }
      function onClick() {
        if (props.disabled || props.readonly)
          return;
        rating.value = normalizedValue.value === value && props.clearable ? 0 : value;
      }
      return {
        onMouseenter: props.hover ? onMouseenter : void 0,
        onMouseleave: props.hover ? onMouseleave : void 0,
        onClick
      };
    }));
    const name = computed(() => props.name ?? `v-rating-${getUid()}`);
    function VRatingItem(_ref2) {
      let {
        value,
        index,
        showStar = true
      } = _ref2;
      const {
        onMouseenter,
        onMouseleave,
        onClick
      } = eventState.value[index + 1];
      const id = `${name.value}-${String(value).replace(".", "-")}`;
      const btnProps = {
        color: itemState.value[index]?.color,
        density: props.density,
        disabled: props.disabled,
        icon: itemState.value[index]?.icon,
        ripple: props.ripple,
        size: props.size,
        variant: "plain"
      };
      return createVNode(Fragment, null, [createVNode("label", {
        "for": id,
        "class": {
          "v-rating__item--half": props.halfIncrements && value % 1 > 0,
          "v-rating__item--full": props.halfIncrements && value % 1 === 0
        },
        "onMouseenter": onMouseenter,
        "onMouseleave": onMouseleave,
        "onClick": onClick
      }, [createVNode("span", {
        "class": "v-rating__hidden"
      }, [t(props.itemAriaLabel, value, props.length)]), !showStar ? void 0 : slots.item ? slots.item({
        ...itemState.value[index],
        props: btnProps,
        value,
        index,
        rating: normalizedValue.value
      }) : createVNode(VBtn, mergeProps({
        "aria-label": t(props.itemAriaLabel, value, props.length)
      }, btnProps), null)]), createVNode("input", {
        "class": "v-rating__hidden",
        "name": name.value,
        "id": id,
        "type": "radio",
        "value": value,
        "checked": normalizedValue.value === value,
        "tabindex": -1,
        "readonly": props.readonly,
        "disabled": props.disabled
      }, null)]);
    }
    function createLabel(labelProps) {
      if (slots["item-label"])
        return slots["item-label"](labelProps);
      if (labelProps.label)
        return createVNode("span", null, [labelProps.label]);
      return createVNode("span", null, [createTextVNode(" ")]);
    }
    useRender(() => {
      const hasLabels = !!props.itemLabels?.length || slots["item-label"];
      return createVNode(props.tag, {
        "class": ["v-rating", {
          "v-rating--hover": props.hover,
          "v-rating--readonly": props.readonly
        }, themeClasses.value, props.class],
        "style": props.style
      }, {
        default: () => [createVNode(VRatingItem, {
          "value": 0,
          "index": -1,
          "showStar": false
        }, null), range.value.map((value, i) => createVNode("div", {
          "class": "v-rating__wrapper"
        }, [hasLabels && props.itemLabelPosition === "top" ? createLabel({
          value,
          index: i,
          label: props.itemLabels?.[i]
        }) : void 0, createVNode("div", {
          "class": "v-rating__item"
        }, [props.halfIncrements ? createVNode(Fragment, null, [createVNode(VRatingItem, {
          "value": value - 0.5,
          "index": i * 2
        }, null), createVNode(VRatingItem, {
          "value": value,
          "index": i * 2 + 1
        }, null)]) : createVNode(VRatingItem, {
          "value": value,
          "index": i
        }, null)]), hasLabels && props.itemLabelPosition === "bottom" ? createLabel({
          value,
          index: i,
          label: props.itemLabels?.[i]
        }) : void 0]))]
      });
    });
    return {};
  }
});
const VSkeletonLoader$1 = "";
const rootTypes = {
  actions: "button@2",
  article: "heading, paragraph",
  avatar: "avatar",
  button: "button",
  card: "image, heading",
  "card-avatar": "image, list-item-avatar",
  chip: "chip",
  "date-picker": "list-item, heading, divider, date-picker-options, date-picker-days, actions",
  "date-picker-options": "text, avatar@2",
  "date-picker-days": "avatar@28",
  divider: "divider",
  heading: "heading",
  image: "image",
  "list-item": "text",
  "list-item-avatar": "avatar, text",
  "list-item-two-line": "sentences",
  "list-item-avatar-two-line": "avatar, sentences",
  "list-item-three-line": "paragraph",
  "list-item-avatar-three-line": "avatar, paragraph",
  ossein: "ossein",
  paragraph: "text@3",
  sentences: "text@2",
  subtitle: "text",
  table: "table-heading, table-thead, table-tbody, table-tfoot",
  "table-heading": "chip, text",
  "table-thead": "heading@6",
  "table-tbody": "table-row-divider@6",
  "table-row-divider": "table-row, divider",
  "table-row": "text@6",
  "table-tfoot": "text@2, avatar@2",
  text: "text"
};
function genBone(type) {
  let children = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return createVNode("div", {
    "class": ["v-skeleton-loader__bone", `v-skeleton-loader__${type}`]
  }, [children]);
}
function genBones(bone) {
  const [type, length] = bone.split("@");
  return Array.from({
    length
  }).map(() => genStructure(type));
}
function genStructure(type) {
  let children = [];
  if (!type)
    return children;
  const bone = rootTypes[type];
  if (type === bone)
    ;
  else if (type.includes(","))
    return mapBones(type);
  else if (type.includes("@"))
    return genBones(type);
  else if (bone.includes(","))
    children = mapBones(bone);
  else if (bone.includes("@"))
    children = genBones(bone);
  else if (bone)
    children.push(genStructure(bone));
  return [genBone(type, children)];
}
function mapBones(bones) {
  return bones.replace(/\s/g, "").split(",").map(genStructure);
}
const makeVSkeletonLoaderProps = propsFactory({
  boilerplate: Boolean,
  color: String,
  loading: Boolean,
  loadingText: {
    type: String,
    default: "$vuetify.loading"
  },
  type: {
    type: [String, Array],
    default: "ossein"
  },
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeThemeProps()
}, "VSkeletonLoader");
const VSkeletonLoader = genericComponent()({
  name: "VSkeletonLoader",
  props: makeVSkeletonLoaderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      t
    } = useLocale();
    const items = computed(() => genStructure(wrapInArray(props.type).join(",")));
    useRender(() => {
      const isLoading = !slots.default || props.loading;
      return createVNode("div", {
        "class": ["v-skeleton-loader", {
          "v-skeleton-loader--boilerplate": props.boilerplate
        }, themeClasses.value, backgroundColorClasses.value, elevationClasses.value],
        "style": [backgroundColorStyles.value, isLoading ? dimensionStyles.value : {}],
        "aria-busy": !props.boilerplate ? isLoading : void 0,
        "aria-live": !props.boilerplate ? "polite" : void 0,
        "aria-label": !props.boilerplate ? t(props.loadingText) : void 0,
        "role": !props.boilerplate ? "alert" : void 0
      }, [isLoading ? items.value : slots.default?.()]);
    });
    return {};
  }
});
const VSlideGroup$1 = "";
function bias(val) {
  const c = 0.501;
  const x = Math.abs(val);
  return Math.sign(val) * (x / ((1 / c - 2) * (1 - x) + 1));
}
function calculateUpdatedOffset(_ref) {
  let {
    selectedElement,
    containerSize,
    contentSize,
    isRtl,
    currentScrollOffset,
    isHorizontal
  } = _ref;
  const clientSize = isHorizontal ? selectedElement.clientWidth : selectedElement.clientHeight;
  const offsetStart = isHorizontal ? selectedElement.offsetLeft : selectedElement.offsetTop;
  const adjustedOffsetStart = isRtl && isHorizontal ? contentSize - offsetStart - clientSize : offsetStart;
  const totalSize = containerSize + currentScrollOffset;
  const itemOffset = clientSize + adjustedOffsetStart;
  const additionalOffset = clientSize * 0.4;
  if (adjustedOffsetStart <= currentScrollOffset) {
    currentScrollOffset = Math.max(adjustedOffsetStart - additionalOffset, 0);
  } else if (totalSize <= itemOffset) {
    currentScrollOffset = Math.min(currentScrollOffset - (totalSize - itemOffset - additionalOffset), contentSize - containerSize);
  }
  return currentScrollOffset;
}
function calculateCenteredOffset(_ref2) {
  let {
    selectedElement,
    containerSize,
    contentSize,
    isRtl,
    isHorizontal
  } = _ref2;
  const clientSize = isHorizontal ? selectedElement.clientWidth : selectedElement.clientHeight;
  const offsetStart = isHorizontal ? selectedElement.offsetLeft : selectedElement.offsetTop;
  const offsetCentered = isRtl && isHorizontal ? contentSize - offsetStart - clientSize / 2 - containerSize / 2 : offsetStart + clientSize / 2 - containerSize / 2;
  return Math.min(contentSize - containerSize, Math.max(0, offsetCentered));
}
const VSlideGroupSymbol = Symbol.for("vuetify:v-slide-group");
const makeVSlideGroupProps = propsFactory({
  centerActive: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  symbol: {
    type: null,
    default: VSlideGroupSymbol
  },
  nextIcon: {
    type: IconValue,
    default: "$next"
  },
  prevIcon: {
    type: IconValue,
    default: "$prev"
  },
  showArrows: {
    type: [Boolean, String],
    validator: (v) => typeof v === "boolean" || ["always", "desktop", "mobile"].includes(v)
  },
  ...makeComponentProps(),
  ...makeDisplayProps(),
  ...makeTagProps(),
  ...makeGroupProps({
    selectedClass: "v-slide-group-item--active"
  })
}, "VSlideGroup");
const VSlideGroup = genericComponent()({
  name: "VSlideGroup",
  props: makeVSlideGroupProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isRtl
    } = useRtl();
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const group = useGroup(props, props.symbol);
    const isOverflowing = shallowRef(false);
    const scrollOffset = shallowRef(0);
    const containerSize = shallowRef(0);
    const contentSize = shallowRef(0);
    const isHorizontal = computed(() => props.direction === "horizontal");
    const {
      resizeRef: containerRef,
      contentRect: containerRect
    } = useResizeObserver();
    const {
      resizeRef: contentRef,
      contentRect
    } = useResizeObserver();
    const firstSelectedIndex = computed(() => {
      if (!group.selected.value.length)
        return -1;
      return group.items.value.findIndex((item) => item.id === group.selected.value[0]);
    });
    const lastSelectedIndex = computed(() => {
      if (!group.selected.value.length)
        return -1;
      return group.items.value.findIndex((item) => item.id === group.selected.value[group.selected.value.length - 1]);
    });
    if (IN_BROWSER) {
      let frame = -1;
      watch(() => [group.selected.value, containerRect.value, contentRect.value, isHorizontal.value], () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          if (containerRect.value && contentRect.value) {
            const sizeProperty = isHorizontal.value ? "width" : "height";
            containerSize.value = containerRect.value[sizeProperty];
            contentSize.value = contentRect.value[sizeProperty];
            isOverflowing.value = containerSize.value + 1 < contentSize.value;
          }
          if (firstSelectedIndex.value >= 0 && contentRef.value) {
            const selectedElement = contentRef.value.children[lastSelectedIndex.value];
            if (firstSelectedIndex.value === 0 || !isOverflowing.value) {
              scrollOffset.value = 0;
            } else if (props.centerActive) {
              scrollOffset.value = calculateCenteredOffset({
                selectedElement,
                containerSize: containerSize.value,
                contentSize: contentSize.value,
                isRtl: isRtl.value,
                isHorizontal: isHorizontal.value
              });
            } else if (isOverflowing.value) {
              scrollOffset.value = calculateUpdatedOffset({
                selectedElement,
                containerSize: containerSize.value,
                contentSize: contentSize.value,
                isRtl: isRtl.value,
                currentScrollOffset: scrollOffset.value,
                isHorizontal: isHorizontal.value
              });
            }
          }
        });
      });
    }
    const disableTransition = shallowRef(false);
    let startTouch = 0;
    let startOffset = 0;
    function onTouchstart(e) {
      const sizeProperty = isHorizontal.value ? "clientX" : "clientY";
      const sign = isRtl.value && isHorizontal.value ? -1 : 1;
      startOffset = sign * scrollOffset.value;
      startTouch = e.touches[0][sizeProperty];
      disableTransition.value = true;
    }
    function onTouchmove(e) {
      if (!isOverflowing.value)
        return;
      const sizeProperty = isHorizontal.value ? "clientX" : "clientY";
      const sign = isRtl.value && isHorizontal.value ? -1 : 1;
      scrollOffset.value = sign * (startOffset + startTouch - e.touches[0][sizeProperty]);
    }
    function onTouchend(e) {
      const maxScrollOffset = contentSize.value - containerSize.value;
      if (scrollOffset.value < 0 || !isOverflowing.value) {
        scrollOffset.value = 0;
      } else if (scrollOffset.value >= maxScrollOffset) {
        scrollOffset.value = maxScrollOffset;
      }
      disableTransition.value = false;
    }
    function onScroll() {
      if (!containerRef.value)
        return;
      containerRef.value[isHorizontal.value ? "scrollLeft" : "scrollTop"] = 0;
    }
    const isFocused = shallowRef(false);
    function onFocusin(e) {
      isFocused.value = true;
      if (!isOverflowing.value || !contentRef.value)
        return;
      for (const el of e.composedPath()) {
        for (const item of contentRef.value.children) {
          if (item === el) {
            scrollOffset.value = calculateUpdatedOffset({
              selectedElement: item,
              containerSize: containerSize.value,
              contentSize: contentSize.value,
              isRtl: isRtl.value,
              currentScrollOffset: scrollOffset.value,
              isHorizontal: isHorizontal.value
            });
            return;
          }
        }
      }
    }
    function onFocusout(e) {
      isFocused.value = false;
    }
    function onFocus(e) {
      if (!isFocused.value && !(e.relatedTarget && contentRef.value?.contains(e.relatedTarget)))
        focus();
    }
    function onKeydown(e) {
      if (!contentRef.value)
        return;
      if (isHorizontal.value) {
        if (e.key === "ArrowRight") {
          focus(isRtl.value ? "prev" : "next");
        } else if (e.key === "ArrowLeft") {
          focus(isRtl.value ? "next" : "prev");
        }
      } else {
        if (e.key === "ArrowDown") {
          focus("next");
        } else if (e.key === "ArrowUp") {
          focus("prev");
        }
      }
      if (e.key === "Home") {
        focus("first");
      } else if (e.key === "End") {
        focus("last");
      }
    }
    function focus(location2) {
      if (!contentRef.value)
        return;
      if (!location2) {
        const focusable = focusableChildren(contentRef.value);
        focusable[0]?.focus();
      } else if (location2 === "next") {
        const el = contentRef.value.querySelector(":focus")?.nextElementSibling;
        if (el)
          el.focus();
        else
          focus("first");
      } else if (location2 === "prev") {
        const el = contentRef.value.querySelector(":focus")?.previousElementSibling;
        if (el)
          el.focus();
        else
          focus("last");
      } else if (location2 === "first") {
        contentRef.value.firstElementChild?.focus();
      } else if (location2 === "last") {
        contentRef.value.lastElementChild?.focus();
      }
    }
    function scrollTo(location2) {
      const newAbsoluteOffset = scrollOffset.value + (location2 === "prev" ? -1 : 1) * containerSize.value;
      scrollOffset.value = clamp(newAbsoluteOffset, 0, contentSize.value - containerSize.value);
    }
    const contentStyles = computed(() => {
      let scrollAmount = scrollOffset.value > contentSize.value - containerSize.value ? -(contentSize.value - containerSize.value) + bias(contentSize.value - containerSize.value - scrollOffset.value) : -scrollOffset.value;
      if (scrollOffset.value <= 0) {
        scrollAmount = bias(-scrollOffset.value);
      }
      const sign = isRtl.value && isHorizontal.value ? -1 : 1;
      return {
        transform: `translate${isHorizontal.value ? "X" : "Y"}(${sign * scrollAmount}px)`,
        transition: disableTransition.value ? "none" : "",
        willChange: disableTransition.value ? "transform" : ""
      };
    });
    const slotProps = computed(() => ({
      next: group.next,
      prev: group.prev,
      select: group.select,
      isSelected: group.isSelected
    }));
    const hasAffixes = computed(() => {
      switch (props.showArrows) {
        case "always":
          return true;
        case "desktop":
          return !mobile.value;
        case true:
          return isOverflowing.value || Math.abs(scrollOffset.value) > 0;
        case "mobile":
          return mobile.value || isOverflowing.value || Math.abs(scrollOffset.value) > 0;
        default:
          return !mobile.value && (isOverflowing.value || Math.abs(scrollOffset.value) > 0);
      }
    });
    const hasPrev = computed(() => {
      return Math.abs(scrollOffset.value) > 0;
    });
    const hasNext = computed(() => {
      return contentSize.value > Math.abs(scrollOffset.value) + containerSize.value;
    });
    useRender(() => createVNode(props.tag, {
      "class": ["v-slide-group", {
        "v-slide-group--vertical": !isHorizontal.value,
        "v-slide-group--has-affixes": hasAffixes.value,
        "v-slide-group--is-overflowing": isOverflowing.value
      }, displayClasses.value, props.class],
      "style": props.style,
      "tabindex": isFocused.value || group.selected.value.length ? -1 : 0,
      "onFocus": onFocus
    }, {
      default: () => [hasAffixes.value && createVNode("div", {
        "key": "prev",
        "class": ["v-slide-group__prev", {
          "v-slide-group__prev--disabled": !hasPrev.value
        }],
        "onClick": () => hasPrev.value && scrollTo("prev")
      }, [slots.prev?.(slotProps.value) ?? createVNode(VFadeTransition, null, {
        default: () => [createVNode(VIcon, {
          "icon": isRtl.value ? props.nextIcon : props.prevIcon
        }, null)]
      })]), createVNode("div", {
        "key": "container",
        "ref": containerRef,
        "class": "v-slide-group__container",
        "onScroll": onScroll
      }, [createVNode("div", {
        "ref": contentRef,
        "class": "v-slide-group__content",
        "style": contentStyles.value,
        "onTouchstartPassive": onTouchstart,
        "onTouchmovePassive": onTouchmove,
        "onTouchendPassive": onTouchend,
        "onFocusin": onFocusin,
        "onFocusout": onFocusout,
        "onKeydown": onKeydown
      }, [slots.default?.(slotProps.value)])]), hasAffixes.value && createVNode("div", {
        "key": "next",
        "class": ["v-slide-group__next", {
          "v-slide-group__next--disabled": !hasNext.value
        }],
        "onClick": () => hasNext.value && scrollTo("next")
      }, [slots.next?.(slotProps.value) ?? createVNode(VFadeTransition, null, {
        default: () => [createVNode(VIcon, {
          "icon": isRtl.value ? props.prevIcon : props.nextIcon
        }, null)]
      })])]
    }));
    return {
      selected: group.selected,
      scrollTo,
      scrollOffset,
      focus
    };
  }
});
const VSlideGroupItem = genericComponent()({
  name: "VSlideGroupItem",
  props: makeGroupItemProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const slideGroupItem = useGroupItem(props, VSlideGroupSymbol);
    return () => slots.default?.({
      isSelected: slideGroupItem.isSelected.value,
      select: slideGroupItem.select,
      toggle: slideGroupItem.toggle,
      selectedClass: slideGroupItem.selectedClass.value
    });
  }
});
const VSnackbar$1 = "";
function useCountdown(milliseconds) {
  const time = shallowRef(milliseconds);
  let timer = -1;
  function clear2() {
    clearInterval(timer);
  }
  function reset() {
    clear2();
    nextTick(() => time.value = milliseconds);
  }
  function start(el) {
    const style = el ? getComputedStyle(el) : {
      transitionDuration: 0.2
    };
    const interval = parseFloat(style.transitionDuration) * 1e3 || 200;
    clear2();
    if (time.value <= 0)
      return;
    const startTime = performance.now();
    timer = window.setInterval(() => {
      const elapsed = performance.now() - startTime + interval;
      time.value = Math.max(milliseconds - elapsed, 0);
      if (time.value <= 0)
        clear2();
    }, interval);
  }
  onScopeDispose(clear2);
  return {
    clear: clear2,
    time,
    start,
    reset
  };
}
const makeVSnackbarProps = propsFactory({
  multiLine: Boolean,
  text: String,
  timer: [Boolean, String],
  timeout: {
    type: [Number, String],
    default: 5e3
  },
  vertical: Boolean,
  ...makeLocationProps({
    location: "bottom"
  }),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeVariantProps(),
  ...makeThemeProps(),
  ...omit(makeVOverlayProps({
    transition: "v-snackbar-transition"
  }), ["persistent", "noClickAnimation", "scrim", "scrollStrategy"])
}, "VSnackbar");
const VSnackbar = genericComponent()({
  name: "VSnackbar",
  props: makeVSnackbarProps(),
  emits: {
    "update:modelValue": (v) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      scopeId
    } = useScopeId();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      roundedClasses
    } = useRounded(props);
    const countdown = useCountdown(Number(props.timeout));
    const overlay = ref();
    const timerRef = ref();
    const isHovering = shallowRef(false);
    watch(isActive, startTimeout);
    watch(() => props.timeout, startTimeout);
    onMounted(() => {
      if (isActive.value)
        startTimeout();
    });
    let activeTimeout = -1;
    function startTimeout() {
      countdown.reset();
      window.clearTimeout(activeTimeout);
      const timeout = Number(props.timeout);
      if (!isActive.value || timeout === -1)
        return;
      const element = refElement(timerRef.value);
      countdown.start(element);
      activeTimeout = window.setTimeout(() => {
        isActive.value = false;
      }, timeout);
    }
    function clearTimeout2() {
      countdown.reset();
      window.clearTimeout(activeTimeout);
    }
    function onPointerenter() {
      isHovering.value = true;
      clearTimeout2();
    }
    function onPointerleave() {
      isHovering.value = false;
      startTimeout();
    }
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      const hasContent = !!(slots.default || slots.text || props.text);
      return createVNode(VOverlay, mergeProps({
        "ref": overlay,
        "class": ["v-snackbar", {
          "v-snackbar--active": isActive.value,
          "v-snackbar--multi-line": props.multiLine && !props.vertical,
          "v-snackbar--timer": !!props.timer,
          "v-snackbar--vertical": props.vertical
        }, positionClasses.value, props.class],
        "style": props.style
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "contentProps": mergeProps({
          class: ["v-snackbar__wrapper", themeClasses.value, colorClasses.value, roundedClasses.value, variantClasses.value],
          style: [locationStyles.value, colorStyles.value],
          onPointerenter,
          onPointerleave
        }, overlayProps.contentProps),
        "persistent": true,
        "noClickAnimation": true,
        "scrim": false,
        "scrollStrategy": "none",
        "_disableGlobalStack": true
      }, scopeId), {
        default: () => [genOverlays(false, "v-snackbar"), props.timer && createVNode("div", {
          "key": "timer",
          "class": "v-snackbar__timer"
        }, [createVNode(VProgressLinear, {
          "ref": timerRef,
          "active": !isHovering.value,
          "color": typeof props.timer === "string" ? props.timer : "info",
          "max": props.timeout,
          "model-value": countdown.time.value
        }, null)]), hasContent && createVNode("div", {
          "key": "content",
          "class": "v-snackbar__content",
          "role": "status",
          "aria-live": "polite"
        }, [slots.text?.() ?? props.text, slots.default?.()]), slots.actions && createVNode(VDefaultsProvider, {
          "defaults": {
            VBtn: {
              variant: "text",
              ripple: false,
              slim: true
            }
          }
        }, {
          default: () => [createVNode("div", {
            "class": "v-snackbar__actions"
          }, [slots.actions()])]
        })],
        activator: slots.activator
      });
    });
    return forwardRefs({}, overlay);
  }
});
const VStepper$1 = "";
const makeVStepperActionsProps = propsFactory({
  color: String,
  disabled: {
    type: [Boolean, String],
    default: false
  },
  prevText: {
    type: String,
    default: "$vuetify.stepper.prev"
  },
  nextText: {
    type: String,
    default: "$vuetify.stepper.next"
  }
}, "VStepperActions");
const VStepperActions = genericComponent()({
  name: "VStepperActions",
  props: makeVStepperActionsProps(),
  emits: {
    "click:prev": () => true,
    "click:next": () => true
  },
  setup(props, _ref) {
    let {
      emit: emit2,
      slots
    } = _ref;
    const {
      t
    } = useLocale();
    function onClickPrev() {
      emit2("click:prev");
    }
    function onClickNext() {
      emit2("click:next");
    }
    useRender(() => {
      const prevSlotProps = {
        onClick: onClickPrev
      };
      const nextSlotProps = {
        onClick: onClickNext
      };
      return createVNode("div", {
        "class": "v-stepper-actions"
      }, [createVNode(VDefaultsProvider, {
        "defaults": {
          VBtn: {
            disabled: ["prev", true].includes(props.disabled),
            text: t(props.prevText),
            variant: "text"
          }
        }
      }, {
        default: () => [slots.prev?.({
          props: prevSlotProps
        }) ?? createVNode(VBtn, prevSlotProps, null)]
      }), createVNode(VDefaultsProvider, {
        "defaults": {
          VBtn: {
            color: props.color,
            disabled: ["next", true].includes(props.disabled),
            text: t(props.nextText),
            variant: "tonal"
          }
        }
      }, {
        default: () => [slots.next?.({
          props: nextSlotProps
        }) ?? createVNode(VBtn, nextSlotProps, null)]
      })]);
    });
    return {};
  }
});
const VStepperHeader = createSimpleFunctional("v-stepper-header");
const VStepperItem$1 = "";
const makeVStepperItemProps = propsFactory({
  color: String,
  title: String,
  subtitle: String,
  complete: Boolean,
  completeIcon: {
    type: String,
    default: "$complete"
  },
  editable: Boolean,
  editIcon: {
    type: String,
    default: "$edit"
  },
  error: Boolean,
  errorIcon: {
    type: String,
    default: "$error"
  },
  icon: String,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  rules: {
    type: Array,
    default: () => []
  },
  ...makeGroupItemProps()
}, "VStepperItem");
const VStepperItem = genericComponent()({
  name: "VStepperItem",
  directives: {
    Ripple
  },
  props: makeVStepperItemProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const group = useGroupItem(props, VStepperSymbol, true);
    const step = computed(() => group?.value.value ?? props.value);
    const isValid2 = computed(() => props.rules.every((handler) => handler() === true));
    const canEdit = computed(() => !props.disabled && props.editable);
    const hasError = computed(() => props.error || !isValid2.value);
    const hasCompleted = computed(() => props.complete || props.rules.length > 0 && isValid2.value);
    const icon = computed(() => {
      if (hasError.value)
        return props.errorIcon;
      if (hasCompleted.value)
        return props.completeIcon;
      if (props.editable)
        return props.editIcon;
      return props.icon;
    });
    const slotProps = computed(() => ({
      canEdit: canEdit.value,
      hasError: hasError.value,
      hasCompleted: hasCompleted.value,
      title: props.title,
      subtitle: props.subtitle,
      step: step.value,
      value: props.value
    }));
    useRender(() => {
      const hasColor = (!group || group.isSelected.value || hasCompleted.value || canEdit.value) && !hasError.value && !props.disabled;
      const hasTitle = !!(props.title != null || slots.title);
      const hasSubtitle = !!(props.subtitle != null || slots.subtitle);
      function onClick() {
        group?.toggle();
      }
      return withDirectives(createVNode("button", {
        "class": ["v-stepper-item", {
          "v-stepper-item--complete": hasCompleted.value,
          "v-stepper-item--disabled": props.disabled,
          "v-stepper-item--error": hasError.value
        }, group?.selectedClass.value],
        "disabled": !props.editable,
        "onClick": onClick
      }, [createVNode(VAvatar, {
        "key": "stepper-avatar",
        "class": "v-stepper-item__avatar",
        "color": hasColor ? props.color : void 0,
        "size": 24
      }, {
        default: () => [slots.icon?.(slotProps.value) ?? (icon.value ? createVNode(VIcon, {
          "icon": icon.value
        }, null) : step.value)]
      }), createVNode("div", {
        "class": "v-stepper-item__content"
      }, [hasTitle && createVNode("div", {
        "key": "title",
        "class": "v-stepper-item__title"
      }, [slots.title?.(slotProps.value) ?? props.title]), hasSubtitle && createVNode("div", {
        "key": "subtitle",
        "class": "v-stepper-item__subtitle"
      }, [slots.subtitle?.(slotProps.value) ?? props.subtitle]), slots.default?.(slotProps.value)])]), [[resolveDirective("ripple"), props.ripple && props.editable, null]]);
    });
    return {};
  }
});
const VStepperSymbol$1 = Symbol.for("vuetify:v-stepper");
const makeVStepperWindowProps = propsFactory({
  ...omit(makeVWindowProps(), ["continuous", "nextIcon", "prevIcon", "showArrows", "touch", "mandatory"])
}, "VStepperWindow");
const VStepperWindow = genericComponent()({
  name: "VStepperWindow",
  props: makeVStepperWindowProps(),
  emits: {
    "update:modelValue": (v) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const group = inject$1(VStepperSymbol$1, null);
    const _model = useProxiedModel(props, "modelValue");
    const model = computed({
      get() {
        if (_model.value != null || !group)
          return _model.value;
        return group.items.value.find((item) => group.selected.value.includes(item.id))?.value;
      },
      set(val) {
        _model.value = val;
      }
    });
    useRender(() => {
      const windowProps = VWindow.filterProps(props);
      return createVNode(VWindow, mergeProps({
        "_as": "VStepperWindow"
      }, windowProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": "v-stepper-window",
        "mandatory": false,
        "touch": false
      }), slots);
    });
    return {};
  }
});
const makeVStepperWindowItemProps = propsFactory({
  ...makeVWindowItemProps()
}, "VStepperWindowItem");
const VStepperWindowItem = genericComponent()({
  name: "VStepperWindowItem",
  props: makeVStepperWindowItemProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => {
      const windowItemProps = VWindowItem.filterProps(props);
      return createVNode(VWindowItem, mergeProps({
        "_as": "VStepperWindowItem"
      }, windowItemProps, {
        "class": "v-stepper-window-item"
      }), slots);
    });
    return {};
  }
});
const VStepperSymbol = Symbol.for("vuetify:v-stepper");
const makeVStepperProps = propsFactory({
  altLabels: Boolean,
  bgColor: String,
  editable: Boolean,
  hideActions: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: String,
    default: "title"
  },
  itemValue: {
    type: String,
    default: "value"
  },
  mobile: Boolean,
  nonLinear: Boolean,
  flat: Boolean,
  ...makeGroupProps({
    mandatory: "force",
    selectedClass: "v-stepper-item--selected"
  }),
  ...makeVSheetProps(),
  ...only(makeVStepperActionsProps(), ["prevText", "nextText"])
}, "VStepper");
const VStepper = genericComponent()({
  name: "VStepper",
  props: makeVStepperProps(),
  emits: {
    "update:modelValue": (v) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      items: _items,
      next,
      prev,
      selected
    } = useGroup(props, VStepperSymbol);
    const {
      color,
      editable,
      prevText,
      nextText
    } = toRefs(props);
    const items = computed(() => props.items.map((item, index) => {
      const title = getPropertyFromItem(item, props.itemTitle, item);
      const value = getPropertyFromItem(item, props.itemValue, index + 1);
      return {
        title,
        value,
        raw: item
      };
    }));
    const activeIndex = computed(() => {
      return _items.value.findIndex((item) => selected.value.includes(item.id));
    });
    const disabled = computed(() => {
      if (props.disabled)
        return props.disabled;
      if (activeIndex.value === 0)
        return "prev";
      if (activeIndex.value === _items.value.length - 1)
        return "next";
      return false;
    });
    provideDefaults({
      VStepperItem: {
        editable,
        prevText,
        nextText
      },
      VStepperActions: {
        color,
        disabled,
        prevText,
        nextText
      }
    });
    useRender(() => {
      const sheetProps = VSheet.filterProps(props);
      const hasHeader = !!(slots.header || props.items.length);
      const hasWindow = props.items.length > 0;
      const hasActions = !props.hideActions && !!(hasWindow || slots.actions);
      return createVNode(VSheet, mergeProps(sheetProps, {
        "color": props.bgColor,
        "class": ["v-stepper", {
          "v-stepper--alt-labels": props.altLabels,
          "v-stepper--flat": props.flat,
          "v-stepper--non-linear": props.nonLinear,
          "v-stepper--mobile": props.mobile
        }, props.class],
        "style": props.style
      }), {
        default: () => [hasHeader && createVNode(VStepperHeader, {
          "key": "stepper-header"
        }, {
          default: () => [items.value.map((item, index) => createVNode(Fragment, null, [!!index && createVNode(VDivider, null, null), createVNode(VStepperItem, item, {
            default: slots[`header-item.${item.value}`] ?? slots.header,
            icon: slots.icon,
            title: slots.title,
            subtitle: slots.subtitle
          })]))]
        }), hasWindow && createVNode(VStepperWindow, {
          "key": "stepper-window"
        }, {
          default: () => [items.value.map((item) => createVNode(VStepperWindowItem, {
            "value": item.value
          }, {
            default: () => slots[`item.${item.value}`]?.(item) ?? slots.item?.(item)
          }))]
        }), slots.default?.({
          prev,
          next
        }), hasActions && (slots.actions?.({
          next,
          prev
        }) ?? createVNode(VStepperActions, {
          "key": "stepper-actions",
          "onClick:prev": prev,
          "onClick:next": next
        }, slots))]
      });
    });
    return {
      prev,
      next
    };
  }
});
const VSwitch$1 = "";
const makeVSwitchProps = propsFactory({
  indeterminate: Boolean,
  inset: Boolean,
  flat: Boolean,
  loading: {
    type: [Boolean, String],
    default: false
  },
  ...makeVInputProps(),
  ...makeVSelectionControlProps()
}, "VSwitch");
const VSwitch = genericComponent()({
  name: "VSwitch",
  inheritAttrs: false,
  props: makeVSwitchProps(),
  emits: {
    "update:focused": (focused) => true,
    "update:modelValue": (value) => true,
    "update:indeterminate": (value) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const indeterminate = useProxiedModel(props, "indeterminate");
    const model = useProxiedModel(props, "modelValue");
    const {
      loaderClasses
    } = useLoader(props);
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const control = ref();
    const loaderColor = computed(() => {
      return typeof props.loading === "string" && props.loading !== "" ? props.loading : props.color;
    });
    const uid2 = getUid();
    const id = computed(() => props.id || `switch-${uid2}`);
    function onChange() {
      if (indeterminate.value) {
        indeterminate.value = false;
      }
    }
    function onTrackClick(e) {
      e.stopPropagation();
      e.preventDefault();
      control.value?.input?.click();
    }
    useRender(() => {
      const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
      const inputProps = VInput.filterProps(props);
      const controlProps = VSelectionControl.filterProps(props);
      return createVNode(VInput, mergeProps({
        "class": ["v-switch", {
          "v-switch--inset": props.inset
        }, {
          "v-switch--indeterminate": indeterminate.value
        }, loaderClasses.value, props.class]
      }, rootAttrs, inputProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "id": id.value,
        "focused": isFocused.value,
        "style": props.style
      }), {
        ...slots,
        default: (_ref2) => {
          let {
            id: id2,
            messagesId,
            isDisabled,
            isReadonly: isReadonly2,
            isValid: isValid2
          } = _ref2;
          return createVNode(VSelectionControl, mergeProps({
            "ref": control
          }, controlProps, {
            "modelValue": model.value,
            "onUpdate:modelValue": [($event) => model.value = $event, onChange],
            "id": id2.value,
            "aria-describedby": messagesId.value,
            "type": "checkbox",
            "aria-checked": indeterminate.value ? "mixed" : void 0,
            "disabled": isDisabled.value,
            "readonly": isReadonly2.value,
            "onFocus": focus,
            "onBlur": blur
          }, controlAttrs), {
            ...slots,
            default: (_ref3) => {
              let {
                backgroundColorClasses,
                backgroundColorStyles
              } = _ref3;
              return createVNode("div", {
                "class": ["v-switch__track", ...backgroundColorClasses.value],
                "style": backgroundColorStyles.value,
                "onClick": onTrackClick
              }, null);
            },
            input: (_ref4) => {
              let {
                inputNode,
                icon,
                backgroundColorClasses,
                backgroundColorStyles
              } = _ref4;
              return createVNode(Fragment, null, [inputNode, createVNode("div", {
                "class": ["v-switch__thumb", {
                  "v-switch__thumb--filled": icon || props.loading
                }, props.inset ? void 0 : backgroundColorClasses.value],
                "style": props.inset ? void 0 : backgroundColorStyles.value
              }, [createVNode(VScaleTransition, null, {
                default: () => [!props.loading ? icon && createVNode(VIcon, {
                  "key": icon,
                  "icon": icon,
                  "size": "x-small"
                }, null) : createVNode(LoaderSlot, {
                  "name": "v-switch",
                  "active": true,
                  "color": isValid2.value === false ? void 0 : loaderColor.value
                }, {
                  default: (slotProps) => slots.loader ? slots.loader(slotProps) : createVNode(VProgressCircular, {
                    "active": slotProps.isActive,
                    "color": slotProps.color,
                    "indeterminate": true,
                    "size": "16",
                    "width": "2"
                  }, null)
                })]
              })])]);
            }
          });
        }
      });
    });
    return {};
  }
});
const VSystemBar$1 = "";
const makeVSystemBarProps = propsFactory({
  color: String,
  height: [Number, String],
  window: Boolean,
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VSystemBar");
const VSystemBar = genericComponent()({
  name: "VSystemBar",
  props: makeVSystemBarProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "color"));
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      ssrBootStyles
    } = useSsrBoot();
    const height = computed(() => props.height ?? (props.window ? 32 : 24));
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: shallowRef("top"),
      layoutSize: height,
      elementSize: height,
      active: computed(() => true),
      absolute: toRef(props, "absolute")
    });
    useRender(() => createVNode(props.tag, {
      "class": ["v-system-bar", {
        "v-system-bar--window": props.window
      }, themeClasses.value, backgroundColorClasses.value, elevationClasses.value, roundedClasses.value, props.class],
      "style": [backgroundColorStyles.value, layoutItemStyles.value, ssrBootStyles.value, props.style]
    }, slots));
    return {};
  }
});
const VTabs$1 = "";
const VTab$1 = "";
const VTabsSymbol = Symbol.for("vuetify:v-tabs");
const makeVTabProps = propsFactory({
  fixed: Boolean,
  sliderColor: String,
  hideSlider: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  ...omit(makeVBtnProps({
    selectedClass: "v-tab--selected",
    variant: "text"
  }), ["active", "block", "flat", "location", "position", "symbol"])
}, "VTab");
const VTab = genericComponent()({
  name: "VTab",
  props: makeVTabProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      textColorClasses: sliderColorClasses,
      textColorStyles: sliderColorStyles
    } = useTextColor(props, "sliderColor");
    const isHorizontal = computed(() => props.direction === "horizontal");
    const isSelected = shallowRef(false);
    const rootEl = ref();
    const sliderEl = ref();
    function updateSlider(_ref2) {
      let {
        value
      } = _ref2;
      isSelected.value = value;
      if (value) {
        const prevEl = rootEl.value?.$el.parentElement?.querySelector(".v-tab--selected .v-tab__slider");
        const nextEl = sliderEl.value;
        if (!prevEl || !nextEl)
          return;
        const color = getComputedStyle(prevEl).color;
        const prevBox = prevEl.getBoundingClientRect();
        const nextBox = nextEl.getBoundingClientRect();
        const xy = isHorizontal.value ? "x" : "y";
        const XY = isHorizontal.value ? "X" : "Y";
        const rightBottom = isHorizontal.value ? "right" : "bottom";
        const widthHeight = isHorizontal.value ? "width" : "height";
        const prevPos = prevBox[xy];
        const nextPos = nextBox[xy];
        const delta2 = prevPos > nextPos ? prevBox[rightBottom] - nextBox[rightBottom] : prevBox[xy] - nextBox[xy];
        const origin = Math.sign(delta2) > 0 ? isHorizontal.value ? "right" : "bottom" : Math.sign(delta2) < 0 ? isHorizontal.value ? "left" : "top" : "center";
        const size2 = Math.abs(delta2) + (Math.sign(delta2) < 0 ? prevBox[widthHeight] : nextBox[widthHeight]);
        const scale = size2 / Math.max(prevBox[widthHeight], nextBox[widthHeight]) || 0;
        const initialScale = prevBox[widthHeight] / nextBox[widthHeight] || 0;
        const sigma = 1.5;
        animate(nextEl, {
          backgroundColor: [color, "currentcolor"],
          transform: [`translate${XY}(${delta2}px) scale${XY}(${initialScale})`, `translate${XY}(${delta2 / sigma}px) scale${XY}(${(scale - 1) / sigma + 1})`, "none"],
          transformOrigin: Array(3).fill(origin)
        }, {
          duration: 225,
          easing: standardEasing
        });
      }
    }
    useRender(() => {
      const btnProps = VBtn.filterProps(props);
      return createVNode(VBtn, mergeProps({
        "symbol": VTabsSymbol,
        "ref": rootEl,
        "class": ["v-tab", props.class],
        "style": props.style,
        "tabindex": isSelected.value ? 0 : -1,
        "role": "tab",
        "aria-selected": String(isSelected.value),
        "active": false
      }, btnProps, attrs, {
        "block": props.fixed,
        "maxWidth": props.fixed ? 300 : void 0,
        "onGroup:selected": updateSlider
      }), {
        ...slots,
        default: () => createVNode(Fragment, null, [slots.default?.() ?? props.text, !props.hideSlider && createVNode("div", {
          "ref": sliderEl,
          "class": ["v-tab__slider", sliderColorClasses.value],
          "style": sliderColorStyles.value
        }, null)])
      });
    });
    return {};
  }
});
function parseItems(items) {
  if (!items)
    return [];
  return items.map((item) => {
    if (!isObject(item))
      return {
        text: item,
        value: item
      };
    return item;
  });
}
const makeVTabsProps = propsFactory({
  alignTabs: {
    type: String,
    default: "start"
  },
  color: String,
  fixedTabs: Boolean,
  items: {
    type: Array,
    default: () => []
  },
  stacked: Boolean,
  bgColor: String,
  grow: Boolean,
  height: {
    type: [Number, String],
    default: void 0
  },
  hideSlider: Boolean,
  sliderColor: String,
  ...makeVSlideGroupProps({
    mandatory: "force"
  }),
  ...makeDensityProps(),
  ...makeTagProps()
}, "VTabs");
const VTabs = genericComponent()({
  name: "VTabs",
  props: makeVTabsProps(),
  emits: {
    "update:modelValue": (v) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const parsedItems = computed(() => parseItems(props.items));
    const {
      densityClasses
    } = useDensity(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(toRef(props, "bgColor"));
    provideDefaults({
      VTab: {
        color: toRef(props, "color"),
        direction: toRef(props, "direction"),
        stacked: toRef(props, "stacked"),
        fixed: toRef(props, "fixedTabs"),
        sliderColor: toRef(props, "sliderColor"),
        hideSlider: toRef(props, "hideSlider")
      }
    });
    useRender(() => {
      const slideGroupProps = VSlideGroup.filterProps(props);
      return createVNode(VSlideGroup, mergeProps(slideGroupProps, {
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": ["v-tabs", `v-tabs--${props.direction}`, `v-tabs--align-tabs-${props.alignTabs}`, {
          "v-tabs--fixed-tabs": props.fixedTabs,
          "v-tabs--grow": props.grow,
          "v-tabs--stacked": props.stacked
        }, densityClasses.value, backgroundColorClasses.value, props.class],
        "style": [{
          "--v-tabs-height": convertToUnit(props.height)
        }, backgroundColorStyles.value, props.style],
        "role": "tablist",
        "symbol": VTabsSymbol
      }), {
        default: () => [slots.default ? slots.default() : parsedItems.value.map((item) => createVNode(VTab, mergeProps(item, {
          "key": item.text
        }), null))]
      });
    });
    return {};
  }
});
const VTextarea$1 = "";
const makeVTextareaProps = propsFactory({
  autoGrow: Boolean,
  autofocus: Boolean,
  counter: [Boolean, Number, String],
  counterValue: Function,
  prefix: String,
  placeholder: String,
  persistentPlaceholder: Boolean,
  persistentCounter: Boolean,
  noResize: Boolean,
  rows: {
    type: [Number, String],
    default: 5,
    validator: (v) => !isNaN(parseFloat(v))
  },
  maxRows: {
    type: [Number, String],
    validator: (v) => !isNaN(parseFloat(v))
  },
  suffix: String,
  modelModifiers: Object,
  ...makeVInputProps(),
  ...makeVFieldProps()
}, "VTextarea");
const VTextarea = genericComponent()({
  name: "VTextarea",
  directives: {
    Intersect
  },
  inheritAttrs: false,
  props: makeVTextareaProps(),
  emits: {
    "click:control": (e) => true,
    "mousedown:control": (e) => true,
    "update:focused": (focused) => true,
    "update:modelValue": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit: emit2,
      slots
    } = _ref;
    const model = useProxiedModel(props, "modelValue");
    const {
      isFocused,
      focus,
      blur
    } = useFocus(props);
    const counterValue = computed(() => {
      return typeof props.counterValue === "function" ? props.counterValue(model.value) : (model.value || "").toString().length;
    });
    const max = computed(() => {
      if (attrs.maxlength)
        return attrs.maxlength;
      if (!props.counter || typeof props.counter !== "number" && typeof props.counter !== "string")
        return void 0;
      return props.counter;
    });
    function onIntersect(isIntersecting, entries) {
      if (!props.autofocus || !isIntersecting)
        return;
      entries[0].target?.focus?.();
    }
    const vInputRef = ref();
    const vFieldRef = ref();
    const controlHeight = shallowRef("");
    const textareaRef = ref();
    const isActive = computed(() => props.persistentPlaceholder || isFocused.value || props.active);
    function onFocus() {
      if (textareaRef.value !== document.activeElement) {
        textareaRef.value?.focus();
      }
      if (!isFocused.value)
        focus();
    }
    function onControlClick(e) {
      onFocus();
      emit2("click:control", e);
    }
    function onControlMousedown(e) {
      emit2("mousedown:control", e);
    }
    function onClear(e) {
      e.stopPropagation();
      onFocus();
      nextTick(() => {
        model.value = "";
        callEvent(props["onClick:clear"], e);
      });
    }
    function onInput(e) {
      const el = e.target;
      model.value = el.value;
      if (props.modelModifiers?.trim) {
        const caretPosition = [el.selectionStart, el.selectionEnd];
        nextTick(() => {
          el.selectionStart = caretPosition[0];
          el.selectionEnd = caretPosition[1];
        });
      }
    }
    const sizerRef = ref();
    const rows = ref(+props.rows);
    const isPlainOrUnderlined = computed(() => ["plain", "underlined"].includes(props.variant));
    watchEffect(() => {
      if (!props.autoGrow)
        rows.value = +props.rows;
    });
    function calculateInputHeight() {
      if (!props.autoGrow)
        return;
      nextTick(() => {
        if (!sizerRef.value || !vFieldRef.value)
          return;
        const style = getComputedStyle(sizerRef.value);
        const fieldStyle = getComputedStyle(vFieldRef.value.$el);
        const padding = parseFloat(style.getPropertyValue("--v-field-padding-top")) + parseFloat(style.getPropertyValue("--v-input-padding-top")) + parseFloat(style.getPropertyValue("--v-field-padding-bottom"));
        const height = sizerRef.value.scrollHeight;
        const lineHeight = parseFloat(style.lineHeight);
        const minHeight = Math.max(parseFloat(props.rows) * lineHeight + padding, parseFloat(fieldStyle.getPropertyValue("--v-input-control-height")));
        const maxHeight = parseFloat(props.maxRows) * lineHeight + padding || Infinity;
        const newHeight = clamp(height ?? 0, minHeight, maxHeight);
        rows.value = Math.floor((newHeight - padding) / lineHeight);
        controlHeight.value = convertToUnit(newHeight);
      });
    }
    onMounted(calculateInputHeight);
    watch(model, calculateInputHeight);
    watch(() => props.rows, calculateInputHeight);
    watch(() => props.maxRows, calculateInputHeight);
    watch(() => props.density, calculateInputHeight);
    let observer;
    watch(sizerRef, (val) => {
      if (val) {
        observer = new ResizeObserver(calculateInputHeight);
        observer.observe(sizerRef.value);
      } else {
        observer?.disconnect();
      }
    });
    onBeforeUnmount(() => {
      observer?.disconnect();
    });
    useRender(() => {
      const hasCounter = !!(slots.counter || props.counter || props.counterValue);
      const hasDetails = !!(hasCounter || slots.details);
      const [rootAttrs, inputAttrs] = filterInputAttrs(attrs);
      const {
        modelValue: _,
        ...inputProps
      } = VInput.filterProps(props);
      const fieldProps = filterFieldProps(props);
      return createVNode(VInput, mergeProps({
        "ref": vInputRef,
        "modelValue": model.value,
        "onUpdate:modelValue": ($event) => model.value = $event,
        "class": ["v-textarea v-text-field", {
          "v-textarea--prefixed": props.prefix,
          "v-textarea--suffixed": props.suffix,
          "v-text-field--prefixed": props.prefix,
          "v-text-field--suffixed": props.suffix,
          "v-textarea--auto-grow": props.autoGrow,
          "v-textarea--no-resize": props.noResize || props.autoGrow,
          "v-input--plain-underlined": isPlainOrUnderlined.value
        }, props.class],
        "style": props.style
      }, rootAttrs, inputProps, {
        "centerAffix": rows.value === 1 && !isPlainOrUnderlined.value,
        "focused": isFocused.value
      }), {
        ...slots,
        default: (_ref2) => {
          let {
            id,
            isDisabled,
            isDirty,
            isReadonly: isReadonly2,
            isValid: isValid2
          } = _ref2;
          return createVNode(VField, mergeProps({
            "ref": vFieldRef,
            "style": {
              "--v-textarea-control-height": controlHeight.value
            },
            "onClick": onControlClick,
            "onMousedown": onControlMousedown,
            "onClick:clear": onClear,
            "onClick:prependInner": props["onClick:prependInner"],
            "onClick:appendInner": props["onClick:appendInner"]
          }, fieldProps, {
            "id": id.value,
            "active": isActive.value || isDirty.value,
            "centerAffix": rows.value === 1 && !isPlainOrUnderlined.value,
            "dirty": isDirty.value || props.dirty,
            "disabled": isDisabled.value,
            "focused": isFocused.value,
            "error": isValid2.value === false
          }), {
            ...slots,
            default: (_ref3) => {
              let {
                props: {
                  class: fieldClass,
                  ...slotProps
                }
              } = _ref3;
              return createVNode(Fragment, null, [props.prefix && createVNode("span", {
                "class": "v-text-field__prefix"
              }, [props.prefix]), withDirectives(createVNode("textarea", mergeProps({
                "ref": textareaRef,
                "class": fieldClass,
                "value": model.value,
                "onInput": onInput,
                "autofocus": props.autofocus,
                "readonly": isReadonly2.value,
                "disabled": isDisabled.value,
                "placeholder": props.placeholder,
                "rows": props.rows,
                "name": props.name,
                "onFocus": onFocus,
                "onBlur": blur
              }, slotProps, inputAttrs), null), [[resolveDirective("intersect"), {
                handler: onIntersect
              }, null, {
                once: true
              }]]), props.autoGrow && withDirectives(createVNode("textarea", {
                "class": [fieldClass, "v-textarea__sizer"],
                "id": `${slotProps.id}-sizer`,
                "onUpdate:modelValue": ($event) => model.value = $event,
                "ref": sizerRef,
                "readonly": true,
                "aria-hidden": "true"
              }, null), [[vModelText, model.value]]), props.suffix && createVNode("span", {
                "class": "v-text-field__suffix"
              }, [props.suffix])]);
            }
          });
        },
        details: hasDetails ? (slotProps) => createVNode(Fragment, null, [slots.details?.(slotProps), hasCounter && createVNode(Fragment, null, [createVNode("span", null, null), createVNode(VCounter, {
          "active": props.persistentCounter || isFocused.value,
          "value": counterValue.value,
          "max": max.value
        }, slots.counter)])]) : void 0
      });
    });
    return forwardRefs({}, vInputRef, vFieldRef, textareaRef);
  }
});
const VThemeProvider$1 = "";
const makeVThemeProviderProps = propsFactory({
  withBackground: Boolean,
  ...makeComponentProps(),
  ...makeThemeProps(),
  ...makeTagProps()
}, "VThemeProvider");
const VThemeProvider = genericComponent()({
  name: "VThemeProvider",
  props: makeVThemeProviderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    return () => {
      if (!props.withBackground)
        return slots.default?.();
      return createVNode(props.tag, {
        "class": ["v-theme-provider", themeClasses.value, props.class],
        "style": props.style
      }, {
        default: () => [slots.default?.()]
      });
    };
  }
});
const VTimeline$1 = "";
const makeVTimelineProps = propsFactory({
  align: {
    type: String,
    default: "center",
    validator: (v) => ["center", "start"].includes(v)
  },
  direction: {
    type: String,
    default: "vertical",
    validator: (v) => ["vertical", "horizontal"].includes(v)
  },
  justify: {
    type: String,
    default: "auto",
    validator: (v) => ["auto", "center"].includes(v)
  },
  side: {
    type: String,
    validator: (v) => v == null || ["start", "end"].includes(v)
  },
  lineInset: {
    type: [String, Number],
    default: 0
  },
  lineThickness: {
    type: [String, Number],
    default: 2
  },
  lineColor: String,
  truncateLine: {
    type: String,
    validator: (v) => ["start", "end", "both"].includes(v)
  },
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VTimeline");
const VTimeline = genericComponent()({
  name: "VTimeline",
  props: makeVTimelineProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      rtlClasses
    } = useRtl();
    provideDefaults({
      VTimelineDivider: {
        lineColor: toRef(props, "lineColor")
      },
      VTimelineItem: {
        density: toRef(props, "density"),
        lineInset: toRef(props, "lineInset")
      }
    });
    const sideClasses = computed(() => {
      const side = props.side ? props.side : props.density !== "default" ? "end" : null;
      return side && `v-timeline--side-${side}`;
    });
    const truncateClasses = computed(() => {
      const classes = ["v-timeline--truncate-line-start", "v-timeline--truncate-line-end"];
      switch (props.truncateLine) {
        case "both":
          return classes;
        case "start":
          return classes[0];
        case "end":
          return classes[1];
        default:
          return null;
      }
    });
    useRender(() => createVNode(props.tag, {
      "class": ["v-timeline", `v-timeline--${props.direction}`, `v-timeline--align-${props.align}`, `v-timeline--justify-${props.justify}`, truncateClasses.value, {
        "v-timeline--inset-line": !!props.lineInset
      }, themeClasses.value, densityClasses.value, sideClasses.value, rtlClasses.value, props.class],
      "style": [{
        "--v-timeline-line-thickness": convertToUnit(props.lineThickness)
      }, props.style]
    }, slots));
    return {};
  }
});
const makeVTimelineDividerProps = propsFactory({
  dotColor: String,
  fillDot: Boolean,
  hideDot: Boolean,
  icon: IconValue,
  iconColor: String,
  lineColor: String,
  ...makeComponentProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeElevationProps()
}, "VTimelineDivider");
const VTimelineDivider = genericComponent()({
  name: "VTimelineDivider",
  props: makeVTimelineDividerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props, "v-timeline-divider__dot");
    const {
      backgroundColorStyles,
      backgroundColorClasses
    } = useBackgroundColor(toRef(props, "dotColor"));
    const {
      roundedClasses
    } = useRounded(props, "v-timeline-divider__dot");
    const {
      elevationClasses
    } = useElevation(props);
    const {
      backgroundColorClasses: lineColorClasses,
      backgroundColorStyles: lineColorStyles
    } = useBackgroundColor(toRef(props, "lineColor"));
    useRender(() => createVNode("div", {
      "class": ["v-timeline-divider", {
        "v-timeline-divider--fill-dot": props.fillDot
      }, props.class],
      "style": props.style
    }, [createVNode("div", {
      "class": ["v-timeline-divider__before", lineColorClasses.value],
      "style": lineColorStyles.value
    }, null), !props.hideDot && createVNode("div", {
      "key": "dot",
      "class": ["v-timeline-divider__dot", elevationClasses.value, roundedClasses.value, sizeClasses.value],
      "style": sizeStyles.value
    }, [createVNode("div", {
      "class": ["v-timeline-divider__inner-dot", backgroundColorClasses.value, roundedClasses.value],
      "style": backgroundColorStyles.value
    }, [!slots.default ? createVNode(VIcon, {
      "key": "icon",
      "color": props.iconColor,
      "icon": props.icon,
      "size": props.size
    }, null) : createVNode(VDefaultsProvider, {
      "key": "icon-defaults",
      "disabled": !props.icon,
      "defaults": {
        VIcon: {
          color: props.iconColor,
          icon: props.icon,
          size: props.size
        }
      }
    }, slots.default)])]), createVNode("div", {
      "class": ["v-timeline-divider__after", lineColorClasses.value],
      "style": lineColorStyles.value
    }, null)]));
    return {};
  }
});
const makeVTimelineItemProps = propsFactory({
  density: String,
  dotColor: String,
  fillDot: Boolean,
  hideDot: Boolean,
  hideOpposite: {
    type: Boolean,
    default: void 0
  },
  icon: IconValue,
  iconColor: String,
  lineInset: [Number, String],
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps()
}, "VTimelineItem");
const VTimelineItem = genericComponent()({
  name: "VTimelineItem",
  props: makeVTimelineItemProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const dotSize = shallowRef(0);
    const dotRef = ref();
    watch(dotRef, (newValue) => {
      if (!newValue)
        return;
      dotSize.value = newValue.$el.querySelector(".v-timeline-divider__dot")?.getBoundingClientRect().width ?? 0;
    }, {
      flush: "post"
    });
    useRender(() => createVNode("div", {
      "class": ["v-timeline-item", {
        "v-timeline-item--fill-dot": props.fillDot
      }, props.class],
      "style": [{
        "--v-timeline-dot-size": convertToUnit(dotSize.value),
        "--v-timeline-line-inset": props.lineInset ? `calc(var(--v-timeline-dot-size) / 2 + ${convertToUnit(props.lineInset)})` : convertToUnit(0)
      }, props.style]
    }, [createVNode("div", {
      "class": "v-timeline-item__body",
      "style": dimensionStyles.value
    }, [slots.default?.()]), createVNode(VTimelineDivider, {
      "ref": dotRef,
      "hideDot": props.hideDot,
      "icon": props.icon,
      "iconColor": props.iconColor,
      "size": props.size,
      "elevation": props.elevation,
      "dotColor": props.dotColor,
      "fillDot": props.fillDot,
      "rounded": props.rounded
    }, {
      default: slots.icon
    }), props.density !== "compact" && createVNode("div", {
      "class": "v-timeline-item__opposite"
    }, [!props.hideOpposite && slots.opposite?.()])]));
    return {};
  }
});
const makeVToolbarItemsProps = propsFactory({
  ...makeComponentProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VToolbarItems");
const VToolbarItems = genericComponent()({
  name: "VToolbarItems",
  props: makeVToolbarItemsProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    provideDefaults({
      VBtn: {
        color: toRef(props, "color"),
        height: "inherit",
        variant: toRef(props, "variant")
      }
    });
    useRender(() => createVNode("div", {
      "class": ["v-toolbar-items", props.class],
      "style": props.style
    }, [slots.default?.()]));
    return {};
  }
});
const VTooltip$1 = "";
const makeVTooltipProps = propsFactory({
  id: String,
  text: String,
  ...omit(makeVOverlayProps({
    closeOnBack: false,
    location: "end",
    locationStrategy: "connected",
    eager: true,
    minWidth: 0,
    offset: 10,
    openOnClick: false,
    openOnHover: true,
    origin: "auto",
    scrim: false,
    scrollStrategy: "reposition",
    transition: false
  }), ["absolute", "persistent"])
}, "VTooltip");
const VTooltip = genericComponent()({
  name: "VTooltip",
  props: makeVTooltipProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      scopeId
    } = useScopeId();
    const uid2 = getUid();
    const id = computed(() => props.id || `v-tooltip-${uid2}`);
    const overlay = ref();
    const location2 = computed(() => {
      return props.location.split(" ").length > 1 ? props.location : props.location + " center";
    });
    const origin = computed(() => {
      return props.origin === "auto" || props.origin === "overlap" || props.origin.split(" ").length > 1 || props.location.split(" ").length > 1 ? props.origin : props.origin + " center";
    });
    const transition = computed(() => {
      if (props.transition)
        return props.transition;
      return isActive.value ? "scale-transition" : "fade-transition";
    });
    const activatorProps = computed(() => mergeProps({
      "aria-describedby": id.value
    }, props.activatorProps));
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      return createVNode(VOverlay, mergeProps({
        "ref": overlay,
        "class": ["v-tooltip", props.class],
        "style": props.style,
        "id": id.value
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "transition": transition.value,
        "absolute": true,
        "location": location2.value,
        "origin": origin.value,
        "persistent": true,
        "role": "tooltip",
        "activatorProps": activatorProps.value,
        "_disableGlobalStack": true
      }, scopeId), {
        activator: slots.activator,
        default: function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return slots.default?.(...args) ?? props.text;
        }
      });
    });
    return forwardRefs({}, overlay);
  }
});
const VValidation = genericComponent()({
  name: "VValidation",
  props: makeValidationProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const validation = useValidation(props, "validation");
    return () => slots.default?.(validation);
  }
});
const components = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  VAlert,
  VAlertTitle,
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VAutocomplete,
  VAvatar,
  VBadge,
  VBanner,
  VBannerActions,
  VBannerText,
  VBottomNavigation,
  VBottomSheet,
  VBreadcrumbs,
  VBreadcrumbsDivider,
  VBreadcrumbsItem,
  VBtn,
  VBtnGroup,
  VBtnToggle,
  VCard,
  VCardActions,
  VCardItem,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VCarousel,
  VCarouselItem,
  VCheckbox,
  VCheckboxBtn,
  VChip,
  VChipGroup,
  VClassIcon,
  VCode,
  VCol,
  VColorPicker,
  VCombobox,
  VComponentIcon,
  VContainer,
  VCounter,
  VDataIterator,
  VDataTable,
  VDataTableFooter,
  VDataTableRow,
  VDataTableRows,
  VDataTableServer,
  VDataTableVirtual,
  VDatePicker,
  VDatePickerControls,
  VDatePickerHeader,
  VDatePickerMonth,
  VDatePickerMonths,
  VDatePickerYears,
  VDefaultsProvider,
  VDialog,
  VDialogBottomTransition,
  VDialogTopTransition,
  VDialogTransition,
  VDivider,
  VExpandTransition,
  VExpandXTransition,
  VExpansionPanel,
  VExpansionPanelText,
  VExpansionPanelTitle,
  VExpansionPanels,
  VFabTransition,
  VFadeTransition,
  VField,
  VFieldLabel,
  VFileInput,
  VFooter,
  VForm,
  VHover,
  VIcon,
  VImg,
  VInfiniteScroll,
  VInput,
  VItem,
  VItemGroup,
  VKbd,
  VLabel,
  VLayout,
  VLayoutItem,
  VLazy,
  VLigatureIcon,
  VList,
  VListGroup,
  VListImg,
  VListItem,
  VListItemAction,
  VListItemMedia,
  VListItemSubtitle,
  VListItemTitle,
  VListSubheader,
  VLocaleProvider,
  VMain,
  VMenu,
  VMessages,
  VNavigationDrawer,
  VNoSsr,
  VOtpInput,
  VOverlay,
  VPagination,
  VParallax,
  VProgressCircular,
  VProgressLinear,
  VRadio,
  VRadioGroup,
  VRangeSlider,
  VRating,
  VResponsive,
  VRow,
  VScaleTransition,
  VScrollXReverseTransition,
  VScrollXTransition,
  VScrollYReverseTransition,
  VScrollYTransition,
  VSelect,
  VSelectionControl,
  VSelectionControlGroup,
  VSheet,
  VSkeletonLoader,
  VSlideGroup,
  VSlideGroupItem,
  VSlideXReverseTransition,
  VSlideXTransition,
  VSlideYReverseTransition,
  VSlideYTransition,
  VSlider,
  VSnackbar,
  VSpacer,
  VStepper,
  VStepperActions,
  VStepperHeader,
  VStepperItem,
  VStepperWindow,
  VStepperWindowItem,
  VSvgIcon,
  VSwitch,
  VSystemBar,
  VTab,
  VTable,
  VTabs,
  VTextField,
  VTextarea,
  VThemeProvider,
  VTimeline,
  VTimelineItem,
  VToolbar,
  VToolbarItems,
  VToolbarTitle,
  VTooltip,
  VValidation,
  VVirtualScroll,
  VWindow,
  VWindowItem
}, Symbol.toStringTag, { value: "Module" }));
function mounted$2(el, binding) {
  const modifiers = binding.modifiers || {};
  const value = binding.value;
  const {
    once,
    immediate,
    ...modifierKeys
  } = modifiers;
  const defaultValue = !Object.keys(modifierKeys).length;
  const {
    handler,
    options
  } = typeof value === "object" ? value : {
    handler: value,
    options: {
      attributes: modifierKeys?.attr ?? defaultValue,
      characterData: modifierKeys?.char ?? defaultValue,
      childList: modifierKeys?.child ?? defaultValue,
      subtree: modifierKeys?.sub ?? defaultValue
    }
  };
  const observer = new MutationObserver(function() {
    let mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let observer2 = arguments.length > 1 ? arguments[1] : void 0;
    handler?.(mutations, observer2);
    if (once)
      unmounted$2(el, binding);
  });
  if (immediate)
    handler?.([], observer);
  el._mutate = Object(el._mutate);
  el._mutate[binding.instance.$.uid] = {
    observer
  };
  observer.observe(el, options);
}
function unmounted$2(el, binding) {
  if (!el._mutate?.[binding.instance.$.uid])
    return;
  el._mutate[binding.instance.$.uid].observer.disconnect();
  delete el._mutate[binding.instance.$.uid];
}
const Mutate = {
  mounted: mounted$2,
  unmounted: unmounted$2
};
function mounted$1(el, binding) {
  const handler = binding.value;
  const options = {
    passive: !binding.modifiers?.active
  };
  window.addEventListener("resize", handler, options);
  el._onResize = Object(el._onResize);
  el._onResize[binding.instance.$.uid] = {
    handler,
    options
  };
  if (!binding.modifiers?.quiet) {
    handler();
  }
}
function unmounted$1(el, binding) {
  if (!el._onResize?.[binding.instance.$.uid])
    return;
  const {
    handler,
    options
  } = el._onResize[binding.instance.$.uid];
  window.removeEventListener("resize", handler, options);
  delete el._onResize[binding.instance.$.uid];
}
const Resize = {
  mounted: mounted$1,
  unmounted: unmounted$1
};
function mounted(el, binding) {
  const {
    self: self2 = false
  } = binding.modifiers ?? {};
  const value = binding.value;
  const options = typeof value === "object" && value.options || {
    passive: true
  };
  const handler = typeof value === "function" || "handleEvent" in value ? value : value.handler;
  const target = self2 ? el : binding.arg ? document.querySelector(binding.arg) : window;
  if (!target)
    return;
  target.addEventListener("scroll", handler, options);
  el._onScroll = Object(el._onScroll);
  el._onScroll[binding.instance.$.uid] = {
    handler,
    options,
    // Don't reference self
    target: self2 ? void 0 : target
  };
}
function unmounted(el, binding) {
  if (!el._onScroll?.[binding.instance.$.uid])
    return;
  const {
    handler,
    options,
    target = el
  } = el._onScroll[binding.instance.$.uid];
  target.removeEventListener("scroll", handler, options);
  delete el._onScroll[binding.instance.$.uid];
}
function updated(el, binding) {
  if (binding.value === binding.oldValue)
    return;
  unmounted(el, binding);
  mounted(el, binding);
}
const Scroll = {
  mounted,
  unmounted,
  updated
};
const directives = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ClickOutside,
  Intersect,
  Mutate,
  Resize,
  Ripple,
  Scroll,
  Touch
}, Symbol.toStringTag, { value: "Module" }));
const light = {
  dark: false,
  colors: {
    primary: "#667acc",
    secondary: "#FFFFFF",
    background: "#F5F5F5",
    tabs: "#F5F5F5",
    foreground: "#F5F5F5",
    paymentForm: "#F5F5F5",
    "v-theme-background": "#FFFFFF",
    "v-theme-surface": "#FFFFFF",
    "v-theme-card": "#FFFFFF"
  }
};
const dark = {
  dark: true,
  colors: {
    primary: "#667acc",
    secondary: "#1E2127",
    background: "#18191B",
    tabs: "#1E1E1E",
    foreground: "#1E1E1E",
    paymentForm: "#E0E0E0",
    "v-theme-background": "#1E2127",
    "v-theme-surface": "#1E2127",
    "v-theme-card": "#22252B"
  }
};
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
    themes: {
      dark,
      light
    }
  },
  icons: {
    ...aliases,
    sets: {
      fa
    }
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {};
function _sfc_render(_ctx, _cache) {
  const _component_router_view = resolveComponent("router-view");
  const _component_v_app = resolveComponent("v-app");
  return openBlock(), createBlock(_component_v_app, { class: "d-flex" }, {
    default: withCtx(() => [
      createVNode(_component_router_view)
    ]),
    _: 1
  });
}
const AppLayout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render]]);
const global$1 = "";
const _sfc_main = /* @__PURE__ */ defineComponent$1({
  __name: "App",
  setup(__props) {
    const components2 = {
      AppLayout
    };
    const layout = computed(() => components2["AppLayout"]);
    return (_ctx, _cache) => {
      const _component_v_app = resolveComponent("v-app");
      return openBlock(), createBlock(_component_v_app, null, {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(layout.value)))
        ]),
        _: 1
      });
    };
  }
});
var isVue2 = false;
/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */
let activePinia;
const setActivePinia = (pinia2) => activePinia = pinia2;
const piniaSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia2 = markRaw({
    install(app2) {
      setActivePinia(pinia2);
      {
        pinia2._a = app2;
        app2.provide(piniaSymbol, pinia2);
        app2.config.globalProperties.$pinia = pinia2;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia2;
}
const noop = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
const fallbackRunWithContext = (fn) => fn();
function mergeReactiveObjects(target, patchToApply) {
  if (target instanceof Map && patchToApply instanceof Map) {
    patchToApply.forEach((value, key) => target.set(key, value));
  }
  if (target instanceof Set && patchToApply instanceof Set) {
    patchToApply.forEach(target.add, target);
  }
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = (
  /* istanbul ignore next */
  Symbol()
);
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia2, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia2.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia2.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia2.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia2);
        const store2 = pinia2._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia2, hot, true);
  return store;
}
function createSetupStore($id, setup, options = {}, pinia2, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = {
    deep: true
    // flush: 'post',
  };
  let isListening;
  let isSyncListening;
  let subscriptions = [];
  let actionSubscriptions = [];
  let debuggerEvents;
  const initialState = pinia2.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    {
      pinia2.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia2.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia2.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia2.state.value[$id]);
  }
  const $reset = isOptionsStore ? function $reset2() {
    const { state } = options;
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  } : (
    /* istanbul ignore next */
    noop
  );
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia2._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia2);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const partialStore = {
    _p: pinia2,
    // _s: scope,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia2.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(partialStore);
  pinia2._s.set($id, store);
  const runWithContext = pinia2._a && pinia2._a.runWithContext || fallbackRunWithContext;
  const setupStore = runWithContext(() => pinia2._e.run(() => (scope = effectScope()).run(setup)));
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia2.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else
      ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia2.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia2._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia2._a,
        pinia: pinia2,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia2, hot) {
    const hasContext = hasInjectionContext();
    pinia2 = // in test mode, ignore the argument provided as we can always retrieve a
    // pinia instance with getActivePinia()
    pinia2 || (hasContext ? inject$1(piniaSymbol, null) : null);
    if (pinia2)
      setActivePinia(pinia2);
    pinia2 = activePinia;
    if (!pinia2._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia2);
      } else {
        createOptionsStore(id, options, pinia2);
      }
    }
    const store = pinia2._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
const pinia = createPinia();
const app = createApp(_sfc_main);
app.use(vuetify);
app.use(pinia);
app.use(router);
app.mount("#app");
export {
  onScopeDispose as A,
  getCurrentInstance$1 as B,
  shallowRef as C,
  defineStore as D,
  Fragment as F,
  Transition as T,
  reactive as a,
  resolveComponent as b,
  computed as c,
  defineComponent$1 as d,
  createBlock as e,
  openBlock as f,
  createVNode as g,
  unref as h,
  createTextVNode as i,
  withModifiers as j,
  createBaseVNode as k,
  withDirectives as l,
  mergeProps as m,
  createCommentVNode as n,
  onMounted as o,
  onBeforeUnmount as p,
  createElementBlock as q,
  ref as r,
  nextTick as s,
  toDisplayString as t,
  useRouter$1 as u,
  vShow as v,
  withCtx as w,
  readonly as x,
  watch as y,
  getCurrentScope as z
};
