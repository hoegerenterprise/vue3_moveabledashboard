import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Vuetify CSS
import 'vuetify/styles'

// Material Design Icons
import '@mdi/font/css/materialdesignicons.css'

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
  theme: {
    defaultTheme: 'dark'
  }
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

createApp(App)
  .use(vuetify)
  .use(pinia)
  .use(router)
  .mount('#app')
