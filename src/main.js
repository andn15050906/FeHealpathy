import { createApp } from "vue";
import { createVuestic } from "vuestic-ui";
import { createI18n } from "vue-i18n";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VStepperVertical, VStepperVerticalItem } from 'vuetify/labs/VStepperVertical';
import { createPinia } from "pinia";
import VueFroala from "vue-froala-wysiwyg";
import VueTour from "vue3-tour";

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

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
});

const calmTheme = {
  dark: false,
  colors: {
    primary: "#5C6BC0", // Soft indigo
    secondary: "#78909C", // Blue grey
    accent: "#B39DDB", // Light purple
    error: "#EF9A9A", // Soft red
    warning: "#FFCC80", // Soft orange
    info: "#81D4FA", // Light blue
    success: "#A5D6A7", // Soft green
    background: "#F5F7FF", // Very light blue-tinted background
    surface: "#FFFFFF",
  },
}

const refreshingTheme = {
  dark: false,
  colors: {
    primary: "#26A69A", // Teal
    secondary: "#4DB6AC", // Lighter teal
    accent: "#80CBC4", // Even lighter teal
    error: "#EF5350", // Red
    warning: "#FFA726", // Orange
    info: "#29B6F6", // Light blue
    success: "#66BB6A", // Green
    background: "#E0F7FA", // Very light teal background
    surface: "#FFFFFF",
  },
}

const energeticTheme = {
  dark: false,
  colors: {
    primary: "#FF7043", // Deep orange
    secondary: "#FF9800", // Orange
    accent: "#FFAB40", // Light orange
    error: "#F44336", // Red
    warning: "#FFB300", // Amber
    info: "#29B6F6", // Light blue
    success: "#7CB342", // Light green
    background: "#FFF8E1", // Very light orange/yellow background
    surface: "#FFFFFF",
  },
}

const focusedTheme = {
  dark: false,
  colors: {
    primary: "#5E35B1", // Deep purple
    secondary: "#7E57C2", // Purple
    accent: "#B39DDB", // Light purple
    error: "#EF5350", // Red
    warning: "#FFA726", // Orange
    info: "#29B6F6", // Light blue
    success: "#66BB6A", // Green
    background: "#F3E5F5", // Very light purple background
    surface: "#FFFFFF",
  },
}

const peacefulTheme = {
  dark: false,
  colors: {
    primary: "#42A5F5", // Blue
    secondary: "#64B5F6", // Light blue
    accent: "#90CAF9", // Even lighter blue
    error: "#EF5350", // Red
    warning: "#FFA726", // Orange
    info: "#29B6F6", // Light blue
    success: "#66BB6A", // Green
    background: "#E3F2FD", // Very light blue background
    surface: "#FFFFFF",
  },
}

const vuetify = createVuetify({
  components: {
    ...components,
    VStepperVertical, VStepperVerticalItem
  },
  directives,
  theme: {
    defaultTheme: "light",
    themes: {
      calm: calmTheme,
      refreshing: refreshingTheme,
      energetic: energeticTheme,
      focused: focusedTheme,
      peaceful: peacefulTheme,
      /*light: {
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
      },*/
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
app.use(VueFroala);
app.use(VueTour);

app.mount("#app");