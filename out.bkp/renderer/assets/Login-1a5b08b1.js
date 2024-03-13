import { d as defineComponent, u as useRouter, r as ref, a as reactive, c as computed, o as onMounted, b as resolveComponent, e as createBlock, w as withCtx, f as openBlock, g as createVNode, T as Transition, h as unref, i as createTextVNode, j as withModifiers, m as mergeProps, k as createBaseVNode, t as toDisplayString, l as withDirectives, v as vShow, n as createCommentVNode } from "./index-f845628f.js";
import { u as useAppStore } from "./index-ae98ff50.js";
const Logo = "" + new URL("logo-inverted-e5facad1.png", import.meta.url).href;
const _hoisted_1 = /* @__PURE__ */ createBaseVNode("p", { class: "text-caption text-center text-md font-weight-bolad" }, "Desktop Application ", -1);
const _hoisted_2 = /* @__PURE__ */ createBaseVNode("strong", null, "Invalid login credentials:", -1);
const _hoisted_3 = { class: "mr-4" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Login",
  setup(__props) {
    const store = useAppStore();
    const router = useRouter();
    const validForm = ref(false);
    const showError = ref(false);
    const connecting = ref(false);
    const showDialog = ref(false);
    const newInstanceForm = reactive({ name: "", url: "" });
    const show = ref(true);
    const items = store.instances;
    const instance = computed({
      get() {
        return store.selectedInstance;
      },
      set(v) {
        store.selectInstance(v);
      }
    });
    const openWebView = () => {
      router.push({ name: "WebView" });
    };
    const login = async () => {
      connecting.value = !connecting.value;
      store.setActiveInstance(store.selectedInstance);
      show.value = false;
    };
    const addInstance = () => {
      store.appendInstance({
        name: newInstanceForm.name,
        url: newInstanceForm.url,
        permanent: false
      });
      newInstanceForm.name = "";
      newInstanceForm.url = "";
      showDialog.value = false;
      store.selectInstance(store.instances[store.instances.length - 1]);
    };
    const removeInstance = (index) => {
      if (store.instances[index] === store.selectedInstance) {
        store.selectInstance(store.instances[index - 1]);
      }
      store.deleteInstance(index);
    };
    onMounted(() => {
    });
    return (_ctx, _cache) => {
      const _component_v_img = resolveComponent("v-img");
      const _component_v_card_title = resolveComponent("v-card-title");
      const _component_v_alert = resolveComponent("v-alert");
      const _component_v_slide_y_reverse_transition = resolveComponent("v-slide-y-reverse-transition");
      const _component_v_divider = resolveComponent("v-divider");
      const _component_v_text_field = resolveComponent("v-text-field");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_card_actions = resolveComponent("v-card-actions");
      const _component_v_col = resolveComponent("v-col");
      const _component_v_form = resolveComponent("v-form");
      const _component_v_card = resolveComponent("v-card");
      const _component_v_dialog = resolveComponent("v-dialog");
      const _component_v_list_item_subtitle = resolveComponent("v-list-item-subtitle");
      const _component_v_chip = resolveComponent("v-chip");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_combobox = resolveComponent("v-combobox");
      const _component_v_progress_linear = resolveComponent("v-progress-linear");
      const _component_v_container = resolveComponent("v-container");
      const _component_v_row = resolveComponent("v-row");
      const _component_v_main = resolveComponent("v-main");
      return openBlock(), createBlock(_component_v_main, { class: "d-flex" }, {
        default: withCtx(() => [
          createVNode(_component_v_container, {
            class: "full-height d-flex justify-center align-center",
            fluid: ""
          }, {
            default: withCtx(() => [
              createVNode(_component_v_row, {
                align: "center",
                justify: "center"
              }, {
                default: withCtx(() => [
                  createVNode(_component_v_col, {
                    cols: "12",
                    sm: "8",
                    md: "4",
                    xl: "3"
                  }, {
                    default: withCtx(() => [
                      createVNode(Transition, {
                        name: "bounce",
                        appear: "",
                        onAfterLeave: openWebView
                      }, {
                        default: withCtx(() => [
                          show.value ? (openBlock(), createBlock(_component_v_card, {
                            key: 0,
                            theme: "dark",
                            class: "pa-6 bg-v-theme-surface",
                            rounded: "lg"
                          }, {
                            default: withCtx(() => [
                              createVNode(_component_v_card_title, { class: "d-flex justify-center align-center mt-4" }, {
                                default: withCtx(() => [
                                  createVNode(_component_v_img, {
                                    src: unref(Logo),
                                    "max-width": "220",
                                    alt: "ShellHub logo, a cloud with a shell in your base write ShellHub in the right side"
                                  }, null, 8, ["src"])
                                ]),
                                _: 1
                              }),
                              _hoisted_1,
                              createVNode(_component_v_container, null, {
                                default: withCtx(() => [
                                  createVNode(_component_v_slide_y_reverse_transition, null, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_alert, {
                                        modelValue: showError.value,
                                        "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showError.value = $event),
                                        type: "error",
                                        closable: "",
                                        variant: "tonal",
                                        class: "mb-4"
                                      }, {
                                        default: withCtx(() => [
                                          _hoisted_2,
                                          createTextVNode(" Your password is incorrect or this account doesn't exists. ")
                                        ]),
                                        _: 1
                                      }, 8, ["modelValue"])
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(_component_v_dialog, {
                                    modelValue: showDialog.value,
                                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => showDialog.value = $event),
                                    width: "400"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_card, {
                                        class: "bg-v-theme-surface",
                                        "data-test": "deviceRename-card"
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_card_title, { class: "text-h5 pa-5 bg-primary" }, {
                                            default: withCtx(() => [
                                              createTextVNode(" Add Instance ")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_v_divider),
                                          createVNode(_component_v_form, {
                                            onSubmit: withModifiers(addInstance, ["prevent"]),
                                            class: "ma-2"
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(_component_v_col, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_v_text_field, {
                                                    modelValue: newInstanceForm.name,
                                                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => newInstanceForm.name = $event),
                                                    color: "primary",
                                                    "prepend-inner-icon": "mdi-text-box-outline",
                                                    required: "",
                                                    label: "Name",
                                                    variant: "outlined"
                                                  }, null, 8, ["modelValue"]),
                                                  createVNode(_component_v_text_field, {
                                                    modelValue: newInstanceForm.url,
                                                    "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => newInstanceForm.url = $event),
                                                    color: "primary",
                                                    "prepend-inner-icon": "mdi-link",
                                                    label: "URL",
                                                    required: "",
                                                    variant: "outlined",
                                                    "data-test": "password-text"
                                                  }, null, 8, ["modelValue"]),
                                                  createVNode(_component_v_card_actions, { class: "justify-center pa-0" }, {
                                                    default: withCtx(() => [
                                                      createVNode(_component_v_btn, {
                                                        color: "primary",
                                                        block: "",
                                                        type: "submit",
                                                        variant: "flat"
                                                      }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(" SAVE ")
                                                        ]),
                                                        _: 1
                                                      })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue"]),
                                  createVNode(_component_v_form, {
                                    modelValue: validForm.value,
                                    "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => validForm.value = $event),
                                    onSubmit: withModifiers(login, ["prevent"])
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(_component_v_col, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_v_combobox, {
                                            modelValue: instance.value,
                                            "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => instance.value = $event),
                                            label: "Select an ShellHub instance",
                                            "prepend-inner-icon": "mdi-server",
                                            variant: "outlined",
                                            "item-title": "name",
                                            "item-value": "url",
                                            items: unref(items)
                                          }, {
                                            item: withCtx(({ item, index, props }) => [
                                              createVNode(_component_v_list_item, mergeProps({
                                                value: item.value,
                                                lines: "two"
                                              }, props), {
                                                prepend: withCtx(() => [
                                                  createBaseVNode("div", _hoisted_3, [
                                                    createVNode(_component_v_chip, {
                                                      size: "x-small",
                                                      color: "primary"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("v0.13.0")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ])
                                                ]),
                                                append: withCtx(() => [
                                                  createVNode(_component_v_btn, {
                                                    disabled: item.raw.permanent,
                                                    icon: "mdi-delete",
                                                    variant: "plain",
                                                    onClick: withModifiers(($event) => removeInstance(index), ["stop"])
                                                  }, null, 8, ["disabled", "onClick"])
                                                ]),
                                                default: withCtx(() => [
                                                  createVNode(_component_v_list_item_subtitle, null, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(item.raw.url), 1)
                                                    ]),
                                                    _: 2
                                                  }, 1024)
                                                ]),
                                                _: 2
                                              }, 1040, ["value"])
                                            ]),
                                            "append-item": withCtx(() => [
                                              createVNode(_component_v_divider),
                                              createVNode(_component_v_btn, {
                                                block: "",
                                                "prepend-icon": "mdi-plus-box",
                                                variant: "text",
                                                class: "mt-2",
                                                onClick: _cache[4] || (_cache[4] = ($event) => showDialog.value = true)
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Add Custom Instance")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }, 8, ["modelValue", "items"]),
                                          createVNode(_component_v_card_actions, { class: "justify-center pa-0" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_v_btn, {
                                                disabled: !validForm.value,
                                                color: "primary",
                                                variant: validForm.value ? "elevated" : "tonal",
                                                block: "",
                                                type: "submit"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(" Choose this Instance ")
                                                ]),
                                                _: 1
                                              }, 8, ["disabled", "variant"])
                                            ]),
                                            _: 1
                                          }),
                                          withDirectives(createVNode(_component_v_progress_linear, {
                                            indeterminate: "",
                                            class: "mt-2"
                                          }, null, 512), [
                                            [vShow, connecting.value]
                                          ])
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    _: 1
                                  }, 8, ["modelValue"])
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })) : createCommentVNode("", true)
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          })
        ]),
        _: 1
      });
    };
  }
});
export {
  _sfc_main as default
};
