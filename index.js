/* eslint-disable no-console */
(function installKindlePolyfill(globalScope) {
  const navigatorLike = globalScope && globalScope.navigator;
  if (!navigatorLike || navigatorLike.kindle) {
    return;
  }

  const state = {
    autoRefresh: false,
    autoRefreshInterval: 2500,
    autoRefreshTimer: null,
    lastRefreshAt: null,
  };

  const defaultPolicy = {
    waveform: "quality",
    flashing: false,
  };

  function viewportSize() {
    const width =
      globalScope.innerWidth ||
      (globalScope.document &&
        globalScope.document.documentElement &&
        globalScope.document.documentElement.clientWidth) ||
      0;
    const height =
      globalScope.innerHeight ||
      (globalScope.document &&
        globalScope.document.documentElement &&
        globalScope.document.documentElement.clientHeight) ||
      0;
    return { width, height };
  }

  function normalizeRect(rect) {
    const x = Number(rect && rect.x) || 0;
    const y = Number(rect && rect.y) || 0;
    const width = Number(rect && rect.width) || 0;
    const height = Number(rect && rect.height) || 0;
    return { x, y, width, height };
  }

  function measureElementRect(element) {
    if (!element || typeof element.getBoundingClientRect !== "function") {
      return normalizeRect();
    }
    return normalizeRect(element.getBoundingClientRect());
  }

  async function refreshNow(options) {
    const policy = {
      ...defaultPolicy,
      ...(options || {}),
    };
    const elements = Array.isArray(options && options.elements)
      ? options.elements.map(measureElementRect)
      : [];
    const rects = Array.isArray(options && options.rects)
      ? options.rects.map(normalizeRect)
      : [];

    state.lastRefreshAt = Date.now();

    console.info("[kindle-polyfill] refreshNow", {
      at: state.lastRefreshAt,
      policy: { waveform: policy.waveform, flashing: !!policy.flashing },
      elements,
      rects,
    });
  }

  function clearAutoRefreshTimer() {
    if (state.autoRefreshTimer) {
      globalScope.clearInterval(state.autoRefreshTimer);
      state.autoRefreshTimer = null;
    }
  }

  const screen = {
    get width() {
      return viewportSize().width;
    },
    get height() {
      return viewportSize().height;
    },
    get autoRefresh() {
      return state.autoRefresh;
    },
    get autoRefreshInterval() {
      return state.autoRefreshInterval;
    },
    setAutoRefresh(enabled, interval) {
      state.autoRefresh = !!enabled;
      if (typeof interval === "number" && interval > 0) {
        state.autoRefreshInterval = interval;
      }
      clearAutoRefreshTimer();
      if (state.autoRefresh) {
        state.autoRefreshTimer = globalScope.setInterval(() => {
          refreshNow(defaultPolicy);
        }, state.autoRefreshInterval);
      }
      console.info("[kindle-polyfill] setAutoRefresh", {
        enabled: state.autoRefresh,
        interval: state.autoRefreshInterval,
      });
    },
    lastRefresh() {
      return state.lastRefreshAt;
    },
    refreshNow,
    beginRefresh(options) {
      const transactionPolicy = {
        ...defaultPolicy,
        ...(options || {}),
      };
      const queuedElements = [];
      const queuedRects = [];
      let done = false;

      return {
        add(element) {
          if (done) return;
          queuedElements.push(measureElementRect(element));
        },
        addRect(rect) {
          if (done) return;
          queuedRects.push(normalizeRect(rect));
        },
        async commit() {
          if (done) return;
          done = true;
          await refreshNow({
            waveform: transactionPolicy.waveform,
            flashing: transactionPolicy.flashing,
            rects: queuedElements.concat(queuedRects),
          });
          console.info("[kindle-polyfill] refresh transaction committed", {
            regions: queuedElements.length + queuedRects.length,
          });
        },
        abort() {
          if (done) return;
          done = true;
          queuedElements.length = 0;
          queuedRects.length = 0;
          console.info("[kindle-polyfill] refresh transaction aborted");
        },
      };
    },
  };

  const device = {
    async battery() {
      return {
        percentage: 76,
        charging: false,
      };
    },
    async network() {
      return {
        connected: true,
        ssid: "PED_DEV_WIFI",
        airplaneMode: false,
        ipAddress: "192.168.0.42",
      };
    },
  };

  Object.defineProperty(navigatorLike, "kindle", {
    configurable: true,
    enumerable: true,
    writable: false,
    value: { screen, device },
  });
})(typeof window !== "undefined" ? window : globalThis);
