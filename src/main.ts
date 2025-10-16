import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// Vuetify CSS
import 'vuetify/styles'  // <-- Add this line to import Vuetify styles globally

// Vuetify
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(App).use(vuetify).mount('#app')
