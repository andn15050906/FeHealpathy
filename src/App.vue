<template>
  <v-app :theme="currentTheme">
    <LoadingSpinner ref="loadingSpinner" />
    <SweetAlert ref="sweetAlert" />
    <Header ref="headerRef" @authenticated="handleAuthenticated" :isAuthenticated="isAuthenticated" />
    <main>
      <div v-if="!router.currentRoute.value.meta.isAppMode">
        <v-navigation-drawer v-model="sidebarOpen" :rail="!sidebarOpen" permanent :color="drawerColor" border
          class="rounded-tr-xl rounded-br-xl" elevation="4" style="top: 70px; box-shadow: none !important;">
          <v-list-item class="py-2" :title="sidebarOpen ? currentCourse?.title || 'Course Progress' : ''" color="primary">
            <template v-slot:prepend>
              <v-avatar color="primary" variant="tonal" class="mr-2">
                <v-icon>mdi-book-open-page-variant</v-icon>
              </v-avatar>
            </template>
            <template v-slot:append>
              <v-btn variant="text" icon @click="toggleSidebar">
                <v-icon>{{ sidebarOpen ? 'mdi-chevron-left' : 'mdi-chevron-right' }}</v-icon>
              </v-btn>
            </template>
          </v-list-item>

          <v-divider></v-divider>

          <v-list density="compact" nav class="pa-2">
            <v-list-item v-for="(lecture, index) in currentCourse?.lectures" :key="index" :value="index"
              :active="isActiveLecture(index)" @click="selectLecture(index)" :title="sidebarOpen ? lecture.title : ''"
              :prepend-icon="'mdi-play-circle-outline'" :color="'primary'" rounded="xl" class="mb-2 transition-all duration-300"
              :class="[
                isActiveLecture(index) ? 'elevation-2 bg-primary-lighten-4' : '',
                'hover:bg-primary-lighten-5'
              ]">
              <template v-slot:prepend>
                <v-avatar :color="isActiveLecture(index) ? 'primary' : 'grey-lighten-1'"
                  :variant="isActiveLecture(index) ? 'elevated' : 'flat'" size="small" class="text-white">
                  <span>{{ index + 1 }}</span>
                </v-avatar>
              </template>
              <template v-slot:append v-if="isActiveLecture(index)">
                <v-icon color="primary">mdi-check-circle</v-icon>
              </template>
            </v-list-item>
          </v-list>

          <v-divider class="mt-2"></v-divider>
          <div class="pa-4">
            <div class="d-flex align-center">
              <v-avatar size="x-small" color="success" class="mr-2"></v-avatar>
              <span>Tiến độ: {{ courseProgressPercentage || 0 }}%</span>
            </div>
          </div>
        </v-navigation-drawer>

        <!-- Add floating button to open sidebar when collapsed -->
        <v-btn
          v-if="!sidebarOpen"
          icon
          color="primary"
          class="sidebar-toggle-btn"
          @click="toggleSidebar"
          elevation="2"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>

        <RoadmapProgress v-if="isAuthAndShown" class="left-sidebar" ref="roadmapProgress"></RoadmapProgress>
        <div class="page-container">
          <div v-if="router.currentRoute.value.meta.requiresPremium && !isPremiumUser">
            <PremiumBlocker></PremiumBlocker>
          </div>
          <RouterView v-else 
            :key="$route.fullPath"
            @authenticated="handleAuthenticated" 
            @addNotification="addNotification"
            @removeNotification="removeNotification" />

          <!--<v-main :class="mainBackground">
            <v-container>
              <div v-if="currentPath">
                <RoadmapContent :current-path="currentPath" @phase-completed="handlePhaseCompleted"
                  @update-progress="handleProgressUpdate" @path-completed="handlePathCompleted" />
              </div>
              <div v-else-if="showProgressTracker">
                <ProgressTracker :active-days="activeDays" :total-days="totalDays" :completed-actions="completedActions"
                  :total-required-actions="totalRequiredActions" :action-history="actionHistory"
                  @suggest-new-route="() => {}/*startSurvey*/" @view-full-history="viewFullHistory" />
              </div>
            </v-container>
          </v-main>-->
          <RouteCompletion v-model="showRouteCompletion" :current-theme="currentTheme"
            :assessment-result="completionAssessmentResult" @close="showRouteCompletion = false"
            @restart-assessment="() => {}/*startSurvey*/" @select-continue-option="handleContinueOptionSelected"
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

const loadingSpinner = ref(null);
const sweetAlert = ref(null);
const router = useRouter();
const isAuthenticated = ref(false);
const roadmapProgress = ref(null);
const isPremiumUser = ref(isPremium());

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

  setTheme(moodThemeMap[selectedMood.value] || 'refreshing');
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
const availableThemes = [
  { name: 'Calm', value: 'calm' },
  { name: 'Refreshing', value: 'refreshing' },
  { name: 'Energetic', value: 'energetic' },
  { name: 'Focused', value: 'focused' },
  { name: 'Peaceful', value: 'peaceful' }
]

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

// Roadmap steps data with highlighted activities
const roadmapSteps = [
  {
    title: 'Self-Awareness',
    mdiIcon: 'mdi-eye-outline',
    description: 'The first step in your mental health journey is developing self-awareness. This involves recognizing your emotions, thoughts, and behaviors, and understanding how they affect your overall wellbeing.',
    focusPoints: [
      'Pay attention to your thoughts and feelings without judgment',
      'Identify patterns in your emotional responses',
      'Recognize your personal triggers and stressors',
      'Understand how your mental state affects your daily life'
    ],
    activities: [
      {
        title: 'Daily Mood Journal',
        description: 'Take 5 minutes each day to record your mood, energy levels, and any significant events.',
        highlighted: true
      },
      {
        title: 'Body Scan Meditation',
        description: 'Practice a 10-minute body scan to increase awareness of physical sensations.',
        highlighted: true
      },
      {
        title: 'Thought Tracking',
        description: 'Note recurring thoughts and identify any cognitive distortions.',
        highlighted: false
      },
      {
        title: 'Emotion Wheel Exercise',
        description: 'Use an emotion wheel to expand your emotional vocabulary and awareness.',
        highlighted: false
      }
    ]
  },
  {
    title: 'Seeking Support',
    mdiIcon: 'mdi-account-group-outline',
    description: 'Reaching out for support is a sign of strength, not weakness. Building a support network can provide perspective, encouragement, and practical help during challenging times.',
    focusPoints: [
      'Identify trusted people in your life who can provide support',
      'Learn about professional mental health resources available to you',
      'Practice communicating your needs clearly',
      'Understand the different types of support (emotional, practical, informational)'
    ],
    activities: [
      {
        title: 'Support Network Map',
        description: 'Create a visual map of your support network, including friends, family, and professionals.',
        highlighted: true
      },
      {
        title: 'Resource Research',
        description: 'Compile a list of local mental health resources, including crisis lines and counseling services.',
        highlighted: false
      },
      {
        title: 'Vulnerability Practice',
        description: 'Start short conversations sharing your feelings with trusted individuals.',
        highlighted: true
      },
      {
        title: 'Support Group Exploration',
        description: 'Research in-person or online support groups relevant to your specific challenges.',
        highlighted: false
      }
    ]
  },
  {
    title: 'Building Healthy Habits',
    mdiIcon: 'mdi-heart-outline',
    description: 'Developing consistent healthy habits creates a foundation for good mental health. Small, sustainable changes to your daily routine can have a significant positive impact over time.',
    focusPoints: [
      'Establish regular sleep patterns',
      'Incorporate physical activity into your routine',
      'Develop healthy eating habits',
      'Create boundaries between work and personal time'
    ],
    activities: [
      {
        title: 'Sleep Hygiene Checklist',
        description: 'Create and implement a bedtime routine to improve sleep quality.',
        highlighted: true
      },
      {
        title: 'Movement Calendar',
        description: "Schedule regular physical activity that you enjoy, even if it's just a short daily walk.",
        highlighted: true
      },
      {
        title: 'Meal Planning',
        description: 'Plan balanced meals that include mood-supporting foods like omega-3s and complex carbohydrates.',
        highlighted: false
      },
      {
        title: 'Digital Boundaries',
        description: 'Set specific times to disconnect from work emails and notifications.',
        highlighted: false
      }
    ]
  },
  {
    title: 'Developing Coping Strategies',
    mdiIcon: 'mdi-brain',
    description: 'Effective coping strategies help you manage stress, regulate emotions, and navigate life\'s challenges. Building a diverse toolkit of healthy coping mechanisms is essential for resilience.',
    focusPoints: [
      'Identify your current coping mechanisms and assess if they\'re helpful or harmful',
      'Learn and practice stress reduction techniques',
      'Develop strategies for managing difficult emotions',
      'Build problem-solving skills for addressing life challenges'
    ],
    activities: [
      {
        title: 'Coping Skills Inventory',
        description: 'Create a list of healthy coping strategies to use in different situations.',
        highlighted: false
      },
      {
        title: 'Breathing Techniques',
        description: 'Practice different breathing exercises for immediate stress relief.',
        highlighted: true
      },
      {
        title: 'Emotional Regulation Plan',
        description: 'Develop a step-by-step plan for managing overwhelming emotions.',
        highlighted: true
      },
      {
        title: 'Cognitive Reframing',
        description: 'Practice identifying negative thought patterns and reframing them more constructively.',
        highlighted: false
      }
    ]
  },
  {
    title: 'Maintaining Mental Wellness',
    mdiIcon: 'mdi-white-balance-sunny',
    description: 'Maintaining mental wellness is an ongoing process that requires attention and care. This stage focuses on integrating all you\'ve learned into a sustainable lifestyle that supports your mental health.',
    focusPoints: [
      'Regularly assess your mental health and adjust your self-care accordingly',
      'Continue to strengthen your support network',
      'Practice self-compassion and celebrate progress',
      'Develop a long-term wellness plan that evolves with your needs'
    ],
    activities: [
      {
        title: 'Monthly Wellness Review',
        description: 'Set aside time each month to reflect on your mental health and adjust your practices as needed.',
        highlighted: true
      },
      {
        title: 'Gratitude Practice',
        description: 'Maintain a regular gratitude practice to foster positive emotions.',
        highlighted: true
      },
      {
        title: 'Values Alignment Check',
        description: 'Periodically review whether your daily activities align with your core values.',
        highlighted: false
      },
      {
        title: 'Community Engagement',
        description: 'Find ways to connect with and contribute to your community for a sense of purpose and belonging.',
        highlighted: false
      }
    ]
  }
]

// Current step state
const currentStepIndex = ref(0)
const currentStep = computed(() => roadmapSteps[currentStepIndex.value])
const progressPercentage = computed(() => {
  return Math.round(((currentStepIndex.value) / (roadmapSteps.length - 1)) * 100)
})

const selectStep = (index) => {
  currentStepIndex.value = index
}

// Status popup state
const selectedMood = ref('neutral')

const moods = [
  { label: 'Struggling', value: 'struggling' },
  { label: 'Okay', value: 'okay' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Good', value: 'good' },
  { label: 'Great', value: 'great' }
]

const challenges = [
  'Anxiety or worry',
  'Low mood or sadness',
  'Sleep difficulties',
  'Concentration problems',
  'Work/study stress',
  'Relationship challenges',
  'Loneliness or isolation',
  'Physical health concerns'
]

// Theme update based on mood
const moodThemeMap = {
  'struggling': 'calm',
  'okay': 'peaceful',
  'neutral': 'refreshing',
  'good': 'focused',
  'great': 'energetic'
};

watch(selectedMood, (newMood) => {
  setTheme(moodThemeMap[newMood] || 'refreshing');
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
const completionAssessmentResult = ref({
  sentiment: 'Positive',
  summary: 'You have made significant progress in your mental health journey.',
  stats: {
    daysActive: 24,
    actionsCompleted: 42,
    consistency: 85
  },
  achievements: [
    'Established a regular mindfulness practice',
    'Improved sleep quality',
    'Developed effective stress management techniques',
    'Built a stronger support network'
  ],
  improvementAreas: [
    'Consistency in daily practice',
    'Managing stress during high-pressure situations',
    'Building more social connections'
  ]
})

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
  padding: 0 20px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-repeat: no-repeat;
  background-size: 100% 100vh;
  background-position: center top;
  background-attachment: fixed;
  margin-top: 100px;
}

/**.page-container {
  min-height: 100vh;
  width: 1200px;
  background-color: #fff;
  margin-top: 60px;
  padding: 40px;
}**/

@media (max-width: 1150px) {
  .page-container {
    width: unset;
  }
}

.page-container:has(.home-background) {
  padding: 0;
}

.left-sidebar {
  position: fixed;
  top: 80px;
  left: 20px;
  border-radius: 15px;
  /*width: calc((100vw - 1200px)/2 - 8px);*/
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

.sidebar-toggle-btn {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1000;
  border-radius: 0 8px 8px 0;
  background: linear-gradient(135deg, #0d6efd, #0a58ca);
  transition: all 0.3s ease;
}

.sidebar-toggle-btn:hover {
  transform: translateY(-50%) translateX(4px);
  box-shadow: 0 4px 12px rgba(13, 110, 253, 0.3);
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