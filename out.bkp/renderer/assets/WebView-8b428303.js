import { d as defineComponent, u as useRouter, r as ref, o as onMounted, p as onBeforeUnmount, b as resolveComponent, q as createElementBlock, g as createVNode, w as withCtx, T as Transition, F as Fragment, f as openBlock, i as createTextVNode, t as toDisplayString, h as unref } from "./index-f845628f.js";
import { u as useAppStore } from "./index-ae98ff50.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "WebView",
  setup(__props) {
    const store = useAppStore();
    const router = useRouter();
    const webViewRef = ref();
    const url = ref("");
    const isLoading = ref(true);
    const goBack = () => {
      router.push({ name: "Login" });
    };
    const reload = () => {
      webViewRef.value?.reload();
    };
    const beforeLoading = (e) => {
      if (!e.isInPlace)
        isLoading.value = true;
      url.value = e.url;
    };
    const afterLoading = () => {
      isLoading.value = false;
    };
    onMounted(() => {
      const webView = webViewRef.value;
      webView.src = store.selectedInstance.url;
      webView.addEventListener("did-start-navigation", beforeLoading);
      webView.addEventListener("did-stop-loading", afterLoading);
    });
    onBeforeUnmount(() => {
      const webView = webViewRef.value;
      webView.removeEventListener("did-start-navigation", beforeLoading);
      webView.removeEventListener("did-stop-loading", afterLoading);
    });
    return (_ctx, _cache) => {
      const _component_v_icon = resolveComponent("v-icon");
      const _component_v_app_bar_nav_icon = resolveComponent("v-app-bar-nav-icon");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_app_bar = resolveComponent("v-app-bar");
      const _component_webview = resolveComponent("webview");
      const _component_v_main = resolveComponent("v-main");
      return openBlock(), createElementBlock(Fragment, null, [
        createVNode(Transition, {
          name: "fade",
          appear: ""
        }, {
          default: withCtx(() => [
            createVNode(_component_v_app_bar, { color: "primary" }, {
              prepend: withCtx(() => [
                createVNode(_component_v_app_bar_nav_icon, {
                  variant: "text",
                  onClick: goBack
                }, {
                  default: withCtx(() => [
                    createVNode(_component_v_icon, null, {
                      default: withCtx(() => [
                        createTextVNode("mdi-server")
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ]),
              default: withCtx(() => [
                createVNode(_component_v_card_title, { class: "pl-0 ml-2" }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(store).selectedInstance.name), 1)
                  ]),
                  _: 1
                }),
                createVNode(_component_v_text_field, {
                  modelValue: url.value,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => url.value = $event),
                  readonly: "",
                  "hide-details": "",
                  "single-line": "",
                  variant: "solo",
                  density: "comfortable",
                  loading: isLoading.value
                }, {
                  "prepend-inner": withCtx(() => [
                    createVNode(_component_v_icon, {
                      color: url.value.startsWith("https") ? "success" : "error"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(url.value.startsWith("https") ? "mdi-lock" : "mdi-lock-off"), 1)
                      ]),
                      _: 1
                    }, 8, ["color"])
                  ]),
                  _: 1
                }, 8, ["modelValue", "loading"]),
                createVNode(_component_v_btn, {
                  class: "ml-2",
                  variant: "text",
                  icon: "mdi-refresh",
                  onClick: reload
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }),
        createVNode(_component_v_main, null, {
          default: withCtx(() => [
            createVNode(_component_webview, {
              ref_key: "webViewRef",
              ref: webViewRef,
              style: { "flex": "1" },
              class: "fill-height"
            }, null, 512)
          ]),
          _: 1
        })
      ], 64);
    };
  }
});
export {
  _sfc_main as default
};
