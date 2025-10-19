import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Vuetify CSS
import 'vuetify/styles'  // <-- Add this line to import Vuetify styles globally

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Pinia
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Router
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')
