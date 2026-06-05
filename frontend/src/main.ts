import { createApp } from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

app.use(vuetify)
app.use(pinia)
app.mount('#app')
