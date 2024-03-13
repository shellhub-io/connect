import { createApp } from 'vue'
import { router } from "./router";
import vuetify from './plugins/vuetify';
import App from './App.vue'
//import { loadFonts } from './plugins/webfontloader';
import { createPinia } from 'pinia'

//loadFonts()

const pinia = createPinia()
const app = createApp(App)

app.use(vuetify)
app.use(pinia)
app.use(router)
app.mount('#app')
