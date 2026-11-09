/**
 * Jest global setup — stub the miniprogram runtime APIs that component
 * modules touch at import or attach time. Keep this MINIMAL: anything a test
 * asserts about must behave for real (miniprogram-simulate supplies the
 * component runtime; we only shim `wx.*`, `getApp` etc.).
 */
const noop = () => {};

const queryResult = () => ({
  boundingClientRect(cb) {
    cb && cb({ width: 300, height: 48, top: 0, left: 0, right: 300, bottom: 48 });
    return this;
  },
  selectFields(_sel, _fields, cb) {
    cb && cb({});
    return this;
  },
  node(cb) {
    cb && cb(null);
    return this;
  },
  fields() {
    return this;
  },
  in() {
    return this;
  },
  select() {
    return this;
  },
  exec(cb) {
    cb && cb([{ width: 300, height: 48 }]);
    return this;
  },
});

global.wx = new Proxy(
  {
    getSystemInfoSync: () => ({
      pixelRatio: 2,
      windowWidth: 393,
      windowHeight: 852,
      screenWidth: 393,
      screenHeight: 852,
      language: 'zh_CN',
      version: 'test',
      platform: 'devtools',
      SDKVersion: '3.0.0',
      theme: 'light',
    }),
    getDeviceInfo: () => ({ pixelRatio: 2, windowWidth: 393, windowHeight: 852 }),
    getAppBaseInfo: () => ({ SDKVersion: '3.0.0' }),
    getWindowInfo: () => ({ pixelRatio: 2, windowWidth: 393, windowHeight: 852, safeArea: { bottom: 852 } }),
    getSystemInfo: (opts) => opts && opts.success && opts.success(global.wx.getSystemInfoSync()),
    loadFontFace: (opts) => opts && opts.complete && setTimeout(opts.complete, 0),
    createSelectorQuery: () => queryResult(),
    createIntersectionObserver: () => ({
      relativeTo: () => ({ observe: noop, disconnect: noop }),
      relativeToViewport: () => ({ observe: noop, disconnect: noop }),
      observe: noop,
      disconnect: noop,
    }),
    nextTick: (cb) => setTimeout(cb, 0),
    canIUse: () => true,
    getStorageInfoSync: () => ({ keys: [] }),
    getStorageSync: () => '',
    setStorageSync: noop,
    removeStorageSync: noop,
    vibrateShort: noop,
    showToast: noop,
    hideToast: noop,
    onThemeChange: noop,
    offThemeChange: noop,
    menuButtonBoundingClientRect: () => ({ top: 48, height: 32, width: 87, left: 281, right: 368, bottom: 80 }),
  },
  {
    // Any wx.* API we forgot: loggable noop instead of hard crash.
    get(target, key) {
      if (key in target) return target[key];
      target[key] = jest.fn(noop);
      return target[key];
    },
  }
);

global.getApp = () => ({ globalData: {} });
global.getCurrentPages = () => [];
global.Page = global.Page || noop;
global.wxFont = undefined;
