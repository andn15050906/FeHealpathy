import { createApp } from "vue";
import { createVuestic } from "vuestic-ui";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical';
import { createPinia } from "pinia";
import { toast } from "vue3-toastify";
import VueFroala from "vue-froala-wysiwyg";
import VueTour from "vue3-tour";

// Styles
import "vuestic-ui/css";
import "bootstrap/dist/css/bootstrap.min.css";
import "vuetify/styles";
import '@mdi/font/css/materialdesignicons.css';
import "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "vue3-toastify/dist/index.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "vue3-tour/dist/vue3-tour.css";

import App from "./App.vue";
import router from "./scripts/router";
import vuesticGlobalConfig from "./scripts/plugins/vuestic-ui/global-config";

// Cấu hình i18n
const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
});

// Cấu hình Vuetify
const vuetify = createVuetify({
  components: {
    ...components,
    VStepperVertical, VStepperVerticalItem
  },
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          primary: "#154EC1",
          secondary: "#767C88",
          background: "#FFFFFF",
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: "#154EC1",
          secondary: "#767C88",
          background: "#121212",
        },
      },
    },
  },
});

const app = createApp(App);
const pinia = createPinia();

// Register plugins
app.use(router);
app.use(i18n);
app.use(vuetify);
app.use(createVuestic({ config: vuesticGlobalConfig }));
app.use(pinia);
app.use(toast, {
  position: "bottom-left",
  autoClose: 3000,
  theme: "light",
});
app.use(VueFroala);
app.use(VueTour);

// Mount app
app.mount("#app");
