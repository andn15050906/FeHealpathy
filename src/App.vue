<template>
  <v-app :theme="currentTheme">
    <LoadingSpinner ref="loadingSpinner" />
    <SweetAlert ref="sweetAlert" />
    <Header ref="headerRef" @authenticated="handleAuthenticated" :isAuthenticated="isAuthenticated" />
    <main>
      <div v-if="!router.currentRoute.value.meta.isAppMode">
        <RoadmapProgress v-if="isAuthAndShown" class="left-sidebar" ref="roadmapProgress"></RoadmapProgress>
        <div class="page-container">
          <div v-if="router.currentRoute.value.meta.requiresPremium && !isPremiumUser">
            <PremiumBlocker></PremiumBlocker>
          </div>
          <div v-else-if="isLoading">
            <v-container class="d-flex justify-center align-center" style="height: 400px;">
              <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
            </v-container>
          </div>
          <RouterView v-else :key="$route.fullPath" @authenticated="handleAuthenticated"
            @addNotification="addNotification" @removeNotification="removeNotification" />
          
          <RouteCompletion v-model="showRouteCompletion" :current-theme="currentTheme"
            :assessment-result="completionAssessmentResult" @close="showRouteCompletion = false"
            @restart-assessment="() => { }/*startSurvey*/" @select-continue-option="handleContinueOptionSelected"
            @select-alternative-route="handleAlternativeRouteSelected" />
        </div>
        <NotificationContainer v-if="isAuthAndShown" ref="notificationRef" />
      </div>
      <div v-else>
        <CallWindow></CallWindow>
      </div>
      <div class="partner-chat" v-if="isAuthAndShown">
        <ConversationWindow :single-room="true" @toggleChat="toggleChat" />
      </div>
    </main>
    <Footer />
  </v-app>
</template>

<script setup>
import { ref, provide, computed, watch, onMounted } from 'vue'
import { useTheme } from 'vuetify'
import { RouterView, useRouter } from 'vue-router';
import { getUserProfile, isPremium } from '@/scripts/api/services/authService';
import Header from './components/Layouts/Header.vue';
import Footer from './components/Layouts/Footer.vue';
import LoadingSpinner from './components/Common/Popup/LoadingSpinner.vue';
import SweetAlert from './components/Common/Popup/SweetAlert.vue';
import NotificationContainer from './components/NotificationComponents/NotificationContainer.vue';
import ConversationWindow from './views/Community/ConversationWindow.vue';
import RoadmapProgress from '@/components/Layouts/RoadmapProgress.vue';
import PremiumBlocker from '@/components/Layouts/PremiumBlocker.vue';
import CallWindow from '@/components/CommunityComponents/CallWindow.vue';
import { courseProgressData } from '@/scripts/data/courseData.js';
import { getRoadmapSteps } from '@/scripts/data/roadmapData.js';
import { getCourseById, getLectures, getEnrollments } from '@/scripts/api/services/courseService';

const loadingSpinner = ref(null);
const sweetAlert = ref(null);
const router = useRouter();
const isAuthenticated = ref(false);
const roadmapProgress = ref(null);
const isPremiumUser = ref(isPremium());
const isLoading = ref(true);

// App data
const roadmapSteps = ref([]);
const appData = ref({
  moodThemeMap: {},
  completionAssessmentResult: {}
});

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
  getPersonalRoadmap: () => {
    if (roadmapProgress.value)
      return roadmapProgress.value.getPersonalRoadmap();
    return null;
  },
  fetchPersonalRoadmap: () => {
    if (roadmapProgress.value)
      return roadmapProgress.value.fetchPersonalRoadmap();
    return null;
  }
});

// Add new provide for lecture management
provide('lectureManager', {
  setCurrentLectureIndex: (index) => {
    currentLectureIndex.value = index;
  },
  getCurrentLectureIndex: () => currentLectureIndex.value
});

const fetchAppData = async () => {
  try {
    roadmapSteps.value = await getRoadmapSteps();
    
    // Set initial theme
    setTheme(appData.value.moodThemeMap[selectedMood.value] || 'refreshing');
    
    isLoading.value = false;
  } catch (error) {
    console.error('Error fetching app data:', error);
    isLoading.value = false;
  }
};

onMounted(async () => {
  router.beforeEach((to, from, next) => {
    loadingSpinner.value?.showSpinner();
    next();
  });

  router.afterEach(() => {
    setTimeout(() => {
      loadingSpinner.value?.hideSpinner();
    }, 300);
  });

  if (await getUserProfile())
    isAuthenticated.value = true;

  await fetchAppData();
});

const isAuthAndShown = computed(() => {
  return !['register', 'signIn'].includes(router.currentRoute.value.name) && isAuthenticated.value;
})

const headerRef = ref(null);
const handleAuthenticated = (isAuth) => {
  isAuth = isAuth ?? true;
  isAuthenticated.value = isAuth;
  if (isAuthenticated.value)
    headerRef.value.fetchUserProfile();
  isPremiumUser.value = isPremium();
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

const theme = useTheme()

// Theme state
const currentTheme = ref('refreshing')

const setTheme = (themeName) => {
  currentTheme.value = themeName
  theme.global.name.value = themeName
}

const formatThemeName = (themeName) => {
  return themeName.charAt(0).toUpperCase() + themeName.slice(1)
}

// Computed properties for theme-based styling
const drawerColor = computed(() => {
  return 'surface'
})

const appBarColor = computed(() => {
  return 'surface'
})

const mainBackground = computed(() => {
  return 'bg-background'
})

const cardAnimation = computed(() => {
  return 'animate-fade-in'
})

// Sidebar state
const sidebarOpen = ref(true)
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// Status popup state
const selectedMood = ref('neutral')

// Theme update based on mood
const moodThemeMap = computed(() => appData.value.moodThemeMap || {});

watch(selectedMood, (newMood) => {
  setTheme(moodThemeMap.value[newMood] || 'refreshing');
});

const showRouteCompletion = ref(false)
const showProgressTracker = ref(false)

// Path and progress tracking
const currentPath = ref(null)
const activeDays = ref(0)
const totalDays = ref(0)
const completedActions = ref(0)
const totalRequiredActions = ref(0)
const actionHistory = ref([])

// Completion assessment result
const completionAssessmentResult = computed(() => appData.value.completionAssessmentResult || {})

const handlePathSelected = (path) => {
  currentPath.value = path
  activeDays.value = 0
  totalDays.value = path.phases[0].duration
  completedActions.value = 0
  totalRequiredActions.value = path.phases[0].requiredActions
  actionHistory.value = []
}

const handlePhaseCompleted = (data) => {
  console.log('Phase completed:', data)

  // Update progress tracking for new phase
  const newPhase = currentPath.value.phases[data.newPhase]
  totalDays.value = newPhase.duration
  totalRequiredActions.value = newPhase.requiredActions
}

const handleProgressUpdate = (data) => {
  console.log('Progress update:', data)

  // Update progress tracking
  activeDays.value = Math.min(activeDays.value + 1, totalDays.value)
  completedActions.value = data.completedActions
}

const handlePathCompleted = () => {
  console.log('Path completed')
  showRouteCompletion.value = true
}

const handleContinueOptionSelected = (option) => {
  console.log('Continue option selected:', option)
  // In a real app, this would set up the next phase of the journey
  currentPath.value = null
  showProgressTracker.value = true
}

const handleAlternativeRouteSelected = (route) => {
  console.log('Alternative route selected:', route)
  // In a real app, this would set up a new path
  handlePathSelected(route)
}

const viewFullHistory = () => {
  console.log('View full history')
  // In a real app, this would show a detailed history view
}

// Add new refs for course data
const currentCourse = ref(null);
const currentLectureIndex = ref(null);
const courseProgressPercentage = ref(0);
const completedLectures = ref(0);
const totalLectures = ref(0);
const isOwner = ref(false);
const isEnrolled = ref(false);

// Add new methods for course progress
const fetchCourseData = async (courseId) => {
  try {
    const courseData = await getCourseById(courseId);
    if (courseData) {
      currentCourse.value = courseData;
      await fetchLectures(courseId);
      await checkEnrollmentStatus(courseId);
    }
  } catch (error) {
    console.error('Error fetching course data:', error);
  }
};

const fetchLectures = async (courseId) => {
  try {
    const response = await getLectures(courseId);
    if (response?.items) {
      currentCourse.value.lectures = response.items.sort((a, b) => new Date(a.creationTime) - new Date(b.creationTime));
      totalLectures.value = currentCourse.value.lectures.length;
    }
  } catch (error) {
    console.error('Error fetching lectures:', error);
  }
};

const checkEnrollmentStatus = async (courseId) => {
  try {
    const response = await getEnrollments({ pageSize: 100 });
    if (response?.items) {
      isEnrolled.value = response.items.some(enrollment => enrollment.courseId === courseId);
      if (isEnrolled.value) {
        // Mock data for completed lectures - replace with actual API call
        completedLectures.value = Math.floor(Math.random() * totalLectures.value);
        courseProgressPercentage.value = Math.round((completedLectures.value / totalLectures.value) * 100);
      }
    }
  } catch (error) {
    console.error('Error checking enrollment status:', error);
    isEnrolled.value = false;
  }
};

const selectLecture = async (index) => {
  const lecture = currentCourse.value.lectures[index];
  if (!lecture) return;

  // Update the index immediately
  currentLectureIndex.value = index;

  try {
    // Allow access if user is enrolled, is owner, or lecture is previewable
    if (isOwner.value || isEnrolled.value || lecture.isPreviewable) {
      // Then update the route
      await router.replace({
        name: "lectureDetail",
        params: { id: lecture.id },
        query: { courseId: currentCourse.value.id },
      });
    } else {
      // Reset the index if access is denied
      currentLectureIndex.value = null;
      // Show premium blocker or access denied message
      sweetAlert.value.showAlert({
        icon: 'warning',
        title: 'Access Denied',
        text: 'Please enroll in this course to access the lecture content.'
      });
    }
  } catch (error) {
    // Reset the index if there's an error
    currentLectureIndex.value = null;
    console.error('Error selecting lecture:', error);
    sweetAlert.value.showAlert({
      icon: 'error',
      title: 'Error',
      text: 'Failed to navigate to lecture. Please try again.'
    });
  }
};

// Update the route watch logic
watch(() => router.currentRoute.value, async (newRoute) => {
  const courseId = newRoute.query.courseId || newRoute.params.id;
  const lectureId = newRoute.params.lectureId;

  if (courseId) {
    try {
      // Only fetch course data if we don't have it or if it's a different course
      if (!currentCourse.value || currentCourse.value.id !== courseId) {
        await fetchCourseData(courseId);
      }

      // Update lecture index if we're on a lecture page
      if (lectureId && currentCourse.value?.lectures) {
        const index = currentCourse.value.lectures.findIndex(lecture => lecture.id === lectureId);
        if (index !== -1) {
          currentLectureIndex.value = index;
        }
      } else {
        // Reset currentLectureIndex when not on a lecture page
        currentLectureIndex.value = null;
      }
    } catch (error) {
      console.error('Error handling route change:', error);
      sweetAlert.value.showAlert({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load course data. Please try again.'
      });
    }
  } else {
    // Reset currentLectureIndex when not on a course page
    currentLectureIndex.value = null;
  }
}, { immediate: true, deep: true });

// Add a computed property for the current lecture
const currentLecture = computed(() => {
  if (currentCourse.value?.lectures && currentLectureIndex.value !== null) {
    return currentCourse.value.lectures[currentLectureIndex.value];
  }
  return null;
});

// Add this computed property in the script setup section
const isActiveLecture = computed(() => (index) => {
  return currentLectureIndex.value === index;
});

const getLectureIcon = (type) => {
  switch (type) {
    case 'video':
      return 'mdi-play-circle-outline'
    case 'practice':
      return 'mdi-dumbbell'
    default:
      return 'mdi-book-outline'
  }
}
</script>

<script>
export default {
  emits: ["handleAuthenticated", "addNotification", "removeNotification"]
}
</script>

<style>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.highlighted-activity {
  border: 2px solid;
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.05);
  transition: all 0.3s ease;
}

.highlighted-activity:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.activity-card {
  transition: all 0.3s ease;
}

.activity-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.ring-4 {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-primary), 0.2);
}
</style>

<style scoped>
main {
  padding: 0;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: 100% 100vh;
  background-position: center top;
  background-attachment: fixed;
  margin-top: 100px;
}

.left-sidebar {
  position: fixed;
  top: 80px;
  left: 20px;
  border-radius: 15px;
  width: 320px;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  z-index: 1;
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
.v-timeline-item__body,
.v-step {
  z-index: 0;
}

.v-tab__slider {
  display: none !important;
}

.v-expansion-panel__shadow {
  display: none;
}
</style>