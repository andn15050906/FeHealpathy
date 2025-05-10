<template>
  <v-app :theme="currentTheme">
    <v-navigation-drawer v-model="sidebarOpen" :rail="!sidebarOpen" permanent :color="drawerColor" border
      class="rounded-tr-xl rounded-br-xl" elevation="4">
      <v-list-item class="py-2" :title="sidebarOpen ? 'Roadmap Progress' : ''" color="primary">
        <template v-slot:prepend>
          <v-avatar color="primary" variant="tonal" class="mr-2">
            <v-icon>mdi-map-marker-path</v-icon>
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
        <v-list-item v-for="(step, index) in roadmapSteps" :key="index" :value="index"
          :active="currentStepIndex === index" @click="selectStep(index)" :title="sidebarOpen ? step.title : ''"
          :prepend-icon="step.mdiIcon" :color="'primary'" rounded="xl"
          class="mb-2 transition-all duration-300" :class="currentStepIndex === index ? 'elevation-2' : ''">
          <template v-slot:prepend>
            <v-avatar :color="currentStepIndex >= index ? 'primary' : 'grey-lighten-1'"
              :variant="currentStepIndex === index ? 'elevated' : 'flat'" size="small" class="text-white">
              <v-icon v-if="currentStepIndex > index">mdi-check</v-icon>
              <span v-else>{{ index + 1 }}</span>
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider></v-divider>
        <div class="pa-4">
          <div class="d-flex align-center">
            <v-avatar size="x-small" color="success" class="mr-2"></v-avatar>
            <span v-if="sidebarOpen">Your progress: {{ progressPercentage }}%</span>
          </div>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar flat :color="appBarColor" class="px-2" elevation="1">
      <v-app-bar-title class="text-primary font-weight-bold">
        <v-icon color="primary" class="mr-2">mdi-heart-pulse</v-icon>
        Mental Health Roadmap
      </v-app-bar-title>
      <v-spacer></v-spacer>
      
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" variant="text" :color="currentTheme === 'refreshing' ? 'primary' : currentTheme" class="mr-2">
            <v-icon left>mdi-palette</v-icon>
            <span class="d-none d-sm-flex">Theme: {{ formatThemeName(currentTheme) }}</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="(theme, index) in availableThemes" :key="index" @click="setTheme(theme.value)">
            <template v-slot:prepend>
              <v-avatar :color="theme.value" size="small"></v-avatar>
            </template>
            <v-list-item-title>{{ theme.name }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <v-btn color="primary" variant="outlined" class="mr-2" prepend-icon="mdi-clipboard-check" @click="startSurvey">
        Take Assessment
      </v-btn>
      <v-btn color="primary" prepend-icon="mdi-account" @click="showStatusPopup = true">
        Update Status
      </v-btn>
    </v-app-bar>

    <v-main :class="mainBackground">
      <v-container>
        <!-- Roadmap Visualization -->
        <v-card class="mb-6" rounded="lg" elevation="3" :class="cardAnimation">
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-map-marker-path</v-icon>
            Your Mental Health Journey
          </v-card-title>
          <v-card-text>
            <!-- Roadmap Progress Bar -->
            <v-progress-linear :model-value="progressPercentage" color="primary" height="10" rounded
              class="mb-6"></v-progress-linear>

            <!-- Roadmap Steps -->
            <div class="d-flex justify-space-between mb-8">
              <div v-for="(step, index) in roadmapSteps" :key="index" class="d-flex flex-column align-center"
                :class="{ 'text-primary font-weight-medium': currentStepIndex >= index }">
                <v-avatar :color="currentStepIndex >= index ? 'primary' : 'grey-lighten-1'"
                  :class="currentStepIndex === index ? 'ring-4 ring-primary-lighten-4' : ''" size="32"
                  class="mb-2 text-white">
                  <v-icon v-if="currentStepIndex > index">mdi-check</v-icon>
                  <span v-else>{{ index + 1 }}</span>
                </v-avatar>
                <span class="text-caption text-center" style="max-width: 80px">{{ step.title }}</span>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Current Step Description -->
        <v-card rounded="lg" elevation="3" :class="cardAnimation">
          <v-card-item>
            <template v-slot:prepend>
              <v-avatar color="primary" size="48" class="text-white elevation-2">
                <v-icon size="large">{{ currentStep.mdiIcon }}</v-icon>
              </v-avatar>
            </template>
            <v-card-title class="text-h5">{{ currentStep.title }}</v-card-title>
          </v-card-item>

          <v-card-text>
            <p class="text-body-1 mb-4">{{ currentStep.description }}</p>

            <h3 class="text-h6 font-weight-medium mt-6 mb-3 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-target</v-icon>
              What to focus on:
            </h3>
            <v-list>
              <v-list-item v-for="(item, index) in currentStep.focusPoints" :key="index" :title="item"
                prepend-icon="mdi-arrow-right" density="compact" class="pl-0"></v-list-item>
            </v-list>

            <h3 class="text-h6 font-weight-medium mt-6 mb-3 d-flex align-center">
              <v-icon color="primary" class="mr-2">mdi-star</v-icon>
              Recommended activities:
            </h3>
            <v-row>
              <v-col v-for="(activity, index) in currentStep.activities" :key="index" cols="12" md="6">
                <v-card variant="outlined" hover class="h-100 activity-card" :class="{'highlighted-activity': activity.highlighted}">
                  <v-card-title class="text-subtitle-1 d-flex align-center">
                    <v-icon v-if="activity.highlighted" color="primary" class="mr-2">mdi-star</v-icon>
                    {{ activity.title }}
                    <v-chip v-if="activity.highlighted" color="primary" size="small" class="ml-2">Recommended</v-chip>
                  </v-card-title>
                  <v-card-text class="text-body-2">{{ activity.description }}</v-card-text>
                  <v-card-actions>
                    <v-btn variant="text" color="primary" size="small">
                      Start Activity
                      <v-icon right>mdi-arrow-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>

    <!-- Status Assessment Dialog -->
    <v-dialog v-model="showStatusPopup" max-width="500px" transition="dialog-bottom-transition">
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>How are you feeling today?</span>
          <v-btn icon @click="showStatusPopup = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <p class="text-body-2 mb-6">
            Your responses help us personalize your roadmap and provide relevant resources.
          </p>

          <v-container>
            <v-row>
              <v-col cols="12">
                <p class="text-subtitle-2 mb-2">Overall mood today:</p>
                <v-btn-toggle v-model="selectedMood" mandatory divided color="primary" class="d-flex">
                  <v-btn v-for="(mood, index) in moods" :key="index" :value="mood.value" class="flex-grow-1">
                    {{ mood.label }}
                  </v-btn>
                </v-btn-toggle>
              </v-col>

              <v-col cols="12" class="mt-4">
                <p class="text-subtitle-2 mb-2">What challenges are you facing? (Select all that apply)</p>
                <v-checkbox v-for="(challenge, index) in challenges" :key="index" v-model="selectedChallenges"
                  :label="challenge" :value="challenge" color="primary" hide-details class="mb-1"></v-checkbox>
              </v-col>

              <v-col cols="12" class="mt-4">
                <p class="text-subtitle-2 mb-2">Any additional notes about how you're feeling:</p>
                <v-textarea v-model="statusNotes" placeholder="Share any thoughts or feelings..." rows="3"
                  variant="outlined"></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showStatusPopup = false">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="submitStatus">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <SurveyPage v-model="showSurveyPage" :roadmap-steps="roadmapSteps" @select-roadmap="selectRoadmapFromSurvey" />
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useTheme } from 'vuetify'
import SurveyPage from './SurveyPage.vue'

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
const showStatusPopup = ref(false)
const selectedMood = ref('neutral')
const selectedChallenges = ref([])
const statusNotes = ref('')
const showSurveyPage = ref(false)

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

// Watch for mood changes to update theme
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

const submitStatus = () => {
  // Here you would typically send this data to your backend
  console.log({
    mood: selectedMood.value,
    challenges: selectedChallenges.value,
    notes: statusNotes.value
  })

  // Reset form
  selectedChallenges.value = []
  statusNotes.value = ''

  // Close popup
  showStatusPopup.value = false

  // You could also update recommendations based on the status
  // For this demo, we'll just show an alert
  alert('Thank you for sharing your status! Your roadmap has been updated and the theme has been adjusted to match your mood.')
}

const startSurvey = () => {
  showSurveyPage.value = true
}

const selectRoadmapFromSurvey = (index) => {
  currentStepIndex.value = index
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