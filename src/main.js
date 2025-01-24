import { createApp } from 'vue'
import { createVuestic } from 'vuestic-ui'
import { createI18n } from 'vue-i18n'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createPinia } from 'pinia'

// Styles
import 'vuestic-ui/css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'vuetify/styles'
import 'bootstrap'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import App from './App.vue'
import router from './router'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'

// Cấu hình i18n
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en'
})

// Cấu hình Vuetify
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#154EC1',
          secondary: '#767C88',
          background: '#FFFFFF'
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#154EC1',
          secondary: '#767C88',
          background: '#121212'
        }
      }
    }
  }
})

const app = createApp(App)
const pinia = createPinia()

// Register plugins
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(createVuestic({ config: vuesticGlobalConfig }))
app.use(pinia)

// Mount app
app.mount('#app')