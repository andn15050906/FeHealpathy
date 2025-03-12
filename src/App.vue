<template>
  <!--<Guider v-if="isAuthAndShown" ref="guiderRef" />-->
  <div id="app">
    <LoadingSpinner ref="loadingSpinner" />
    <SweetAlert ref="sweetAlert" />
    <Header ref="headerRef" />
    <main>
      <RoadmapProgress v-if="isAuthAndShown" class="left-sidebar" ref="roadmapProgress"></RoadmapProgress>
      <div class="page-container">
        <!--<RouterView class="left-sidebar" v-if="isAuthAndShown" name="roadmapProgress"></RouterView>-->
        <RouterView @authenticated="handleAuthenticated" @addNotification="addNotification"
          @removeNotification="removeNotification" />
      </div>
      <NotificationContainer v-if="isAuthAndShown" ref="notificationRef" />
      <div class="partner-chat" v-if="isAuthAndShown">
        <ConversationWindow :single-room="true" @toggleChat="toggleChat" />
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, computed } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { getUserProfile } from '@/scripts/api/services/authService';
import Header from './components/Layouts/Header.vue';
import Footer from './components/Layouts/Footer.vue';
import LoadingSpinner from './components/Common/Popup/LoadingSpinner.vue';
import SweetAlert from './components/Common/Popup/SweetAlert.vue';
//import Guider from '@/components/PracticeComponents/Guider.vue';
import NotificationContainer from './components/NotificationComponents/NotificationContainer.vue';
import ConversationWindow from './views/Community/ConversationWindow.vue';
import RoadmapProgress from '@/components/Layouts/RoadmapProgress.vue'

const loadingSpinner = ref(null);
const sweetAlert = ref(null);
const router = useRouter();
const isAuthenticated = ref(false);
const roadmapProgress = ref(null);
//const guiderRef = ref(null);

provide('loadingSpinner', {
  showSpinner: () => loadingSpinner.value.showSpinner(),
  hideSpinner: () => loadingSpinner.value.hideSpinner(),
});

provide('sweetAlert', {
  showAlert: (options) => sweetAlert.value.showAlert(options),
  showSuccess: (message) => sweetAlert.value.showAlert({ icon: 'success', title: 'Success', text: message }),
  showError: (message) => sweetAlert.value.showAlert({ icon: 'error', title: 'Error', text: message }),
  showWarning: (message) => sweetAlert.value.showAlert({ icon: 'warning', title: 'Warning', text: message }),
  showInfo: (message) => sweetAlert.value.showAlert({ icon: 'info', title: 'Info', text: message }),
});

provide('roadmapProgress', {
  getPersonalRoadmap: () => roadmapProgress.value.getPersonalRoadmap()
})

/*provide('guider', {
  highlight: (targetElementId, offsetX, offsetY, width, height, position) =>
    guiderRef.value.highlight(targetElementId, offsetX, offsetY, width, height, position)
});*/

onMounted(async () => {
  router.beforeEach((to, from, next) => {
    loadingSpinner.value.showSpinner();
    next();
  });

  router.afterEach(() => {
    setTimeout(() => {
      loadingSpinner.value.hideSpinner();
    }, 300);
  });

  if (await getUserProfile())
    isAuthenticated.value = true;
});

const isAuthAndShown = computed(() => {
  return !['register', 'signIn'].includes(router.currentRoute.value.name) && isAuthenticated.value;
})

const headerRef = ref(null);
const handleAuthenticated = () => {
  isAuthenticated.value = true;
  headerRef.value.fetchUserProfile();
}

const notificationRef = ref(null);
const addNotification = async (data) => {
  setTimeout(() => {
    notificationRef.value.addNotification(data);
  }, 100);
}
const removeNotification = (data) => {
  notificationRef.value.removeNotification(data);
}

const toggleChat = () => {
  let style = document.getElementsByClassName('partner-chat')[0].style;
  style.marginBottom = (style.marginBottom == '0px' || style.marginBottom == '') ? '-400px' : '0px';
}
</script>

<script>
export default {
  emits: ["handleAuthenticated", "addNotification", "removeNotification"]
}
</script>

<style scoped>
main {
  padding: 0 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("/assets/background/green-bg1.jpg");
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-position: center top;
  background-attachment: fixed;
}

.page-container {
  min-height: 100vh;
  width: 1200px;
  background-color: #fff;
  margin-top: 60px;
  padding: 40px;
}

/*.page-container:has(.left-sidebar) {
  display: flex;
}*/

.page-container:has(.home-background) {
  padding: 0;
}

.left-sidebar {
  /*flex: 0.5;*/
  position: fixed;
  top: 60px;
  left: 0;
  width: calc((100vw - 1200px)/2 - 8px);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

.partner-chat {
  position: fixed;
  bottom: 0;
  right: 20px;
  z-index: 1000;
  height: 460px;
  width: 360px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
}

footer {
  z-index: 100;
}
</style>

<style>
.v-timeline-item__body, .v-step {
  z-index: 0;
}
.v-tab__slider {
    display: none !important;
}
</style>