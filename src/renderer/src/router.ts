import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router'

const Login = () => import('@renderer/views/Login.vue')
const WebView = () => import('@renderer/views/WebView.vue')

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },

  {
    path: '/webview',
    name: 'WebView',
    component: WebView
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})
