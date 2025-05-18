<template>
  <v-dialog v-model="showDialog" fullscreen persistent :theme="currentTheme" transition="dialog-bottom-transition">
    <v-card>
      <v-toolbar :color="$vuetify.theme.current.colors.primary" dark>
        <v-toolbar-title>Journey Completion</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-container class="pa-6">
        <div v-if="isPositiveResult" class="text-center animate-fade-in mb-8">
          <v-sheet
            color="primary"
            class="pa-8 rounded-lg mb-6"
          >
            <v-avatar
              color="white"
              class="mb-4"
              size="96"
            >
              <v-icon color="primary" size="64">mdi-trophy</v-icon>
            </v-avatar>
            <h1 class="text-h3 font-weight-bold text-white mb-4">Congratulations!</h1>
            <p class="text-h6 text-white-lighten-2 mx-auto" style="max-width: 700px">
              You've completed your mental health journey. Your current sentiment is rated as 
              <span class="font-weight-bold">{{ assessmentResult.sentiment }}</span>.
            </p>
          </v-sheet>
          
          <v-card class="mb-6" rounded="lg" elevation="3">
            <v-card-title class="text-h5">Your Journey Summary</v-card-title>
            <v-card-text>
              <p class="text-body-1 mb-6">{{ assessmentResult.summary }}</p>
              
              <v-row class="mb-6">
                <v-col cols="12" sm="4">
                  <v-card variant="outlined" class="text-center h-100">
                    <v-card-text>
                      <p class="text-h4 font-weight-bold text-primary mb-1">{{ assessmentResult.stats.daysActive }}</p>
                      <p class="text-subtitle-1">Days Active</p>
                    </v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="12" sm="4">
                  <v-card variant="outlined" class="text-center h-100">
                    <v-card-text>
                      <p class="text-h4 font-weight-bold text-primary mb-1">{{ assessmentResult.stats.actionsCompleted }}</p>
                      <p class="text-subtitle-1">Actions Completed</p>
                    </v-card-text>
                  </v-card>
                </v-col>
                
                <v-col cols="12" sm="4">
                  <v-card variant="outlined" class="text-center h-100">
                    <v-card-text>
                      <p class="text-h4 font-weight-bold text-primary mb-1">{{ assessmentResult.stats.consistency }}%</p>
                      <p class="text-subtitle-1">Consistency</p>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
              
              <p class="text-h6 font-weight-medium mb-3">Key Achievements</p>
              <v-list>
                <v-list-item
                  v-for="(achievement, index) in assessmentResult.achievements"
                  :key="index"
                  :title="achievement"
                  prepend-icon="mdi-check-circle"
                  color="success"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
          
          <p class="text-h5 font-weight-bold mb-4">How do you feel about your journey so far?</p>
          <v-rating
            v-model="journeyRating"
            color="amber"
            hover
            length="5"
            size="large"
            class="mb-6"
          ></v-rating>
          
          <v-textarea
            v-model="journeyFeedback"
            label="Share your thoughts about your experience (optional)"
            rows="3"
            variant="outlined"
            class="mb-6"
          ></v-textarea>
          
          <p class="text-h5 font-weight-bold mb-4">Continue Your Growth</p>
          <p class="text-body-1 mb-6">
            Your mental health journey doesn't have to end here. Consider these options to continue your growth:
          </p>
          
          <v-row>
            <v-col
              v-for="(option, index) in continueOptions"
              :key="index"
              cols="12"
              md="4"
            >
              <v-card
                height="100%"
                hover
                rounded="lg"
                elevation="3"
                @click="selectContinueOption(index)"
              >
                <v-card-item>
                  <template v-slot:prepend>
                    <v-avatar :color="option.color" class="text-white">
                      <v-icon>{{ option.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-card-title>{{ option.title }}</v-card-title>
                </v-card-item>
                
                <v-card-text>
                  <p>{{ option.description }}</p>
                </v-card-text>
                
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    color="primary"
                    @click.stop="selectContinueOption(index)"
                  >
                    Select
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </div>
        <div v-else class="animate-fade-in">
          <v-card class="mb-6" rounded="lg" elevation="3">
            <v-card-title class="text-h5">Your Journey Results</v-card-title>
            <v-card-text>
              <p class="text-body-1 mb-6">{{ assessmentResult.summary }}</p>
              
              <v-alert
                color="info"
                variant="tonal"
                class="mb-6"
              >
                <div class="d-flex">
                  <v-icon class="mr-3">mdi-information</v-icon>
                  <div>
                    <p class="font-weight-medium">We have new routes that might be more suitable for you.</p>
                    <p>Based on your progress and feedback, we've identified alternative approaches that may better address your needs.</p>
                  </div>
                </div>
              </v-alert>
              
              <p class="text-h6 font-weight-medium mb-3">Areas for Improvement</p>
              <v-list>
                <v-list-item
                  v-for="(area, index) in assessmentResult.improvementAreas"
                  :key="index"
                  :title="area"
                  prepend-icon="mdi-alert-circle-outline"
                  color="warning"
                ></v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
          
          <p class="text-h5 font-weight-bold mb-4">Recommended Alternative Routes</p>
          <p class="text-body-1 mb-6">
            These alternative routes may better address your specific needs and preferences:
          </p>
          
          <v-row>
            <v-col
              v-for="(route, index) in alternativeRoutes"
              :key="index"
              cols="12"
              md="4"
            >
              <v-card
                height="100%"
                hover
                rounded="lg"
                elevation="3"
                @click="selectAlternativeRoute(index)"
              >
                <v-card-item>
                  <template v-slot:prepend>
                    <v-avatar :color="route.color" class="text-white">
                      <v-icon>{{ route.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-card-title>{{ route.name }}</v-card-title>
                  <v-card-subtitle>{{ route.target }}</v-card-subtitle>
                </v-card-item>
                
                <v-card-text>
                  <p class="mb-4">{{ route.description }}</p>
                  <p class="text-caption">
                    <v-icon small color="grey">mdi-information-outline</v-icon>
                    Based on {{ route.source }}
                  </p>
                </v-card-text>
                
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    variant="text"
                    color="primary"
                    @click.stop="selectAlternativeRoute(index)"
                  >
                    Try This Route
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          
          <div class="d-flex justify-center mt-8">
            <v-btn
              variant="outlined"
              class="mr-4"
              @click="$emit('close')"
            >
              Continue Current Path
            </v-btn>
            <v-btn
              color="primary"
              @click="$emit('restart-assessment')"
            >
              Take New Assessment
            </v-btn>
          </div>
        </div>
        <v-card v-if="hasSpecialOffers" class="mt-8" color="primary-lighten-5" variant="outlined" rounded="lg">
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-tag-multiple</v-icon>
            Special Offers
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col
                v-for="(offer, index) in specialOffers"
                :key="index"
                cols="12"
                md="6"
              >
                <v-card variant="outlined" hover>
                  <v-card-title>{{ offer.title }}</v-card-title>
                  <v-card-text>
                    <p class="mb-2">{{ offer.description }}</p>
                    <v-chip color="error" class="mb-2">{{ offer.discount }}</v-chip>
                    <p class="text-caption">Valid until {{ offer.validUntil }}</p>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      variant="text"
                      @click="viewOffer(index)"
                    >
                      View Offer
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <div class="d-flex justify-center mt-8">
          <v-btn
            color="primary"
            size="large"
            rounded="pill"
            @click="finishJourney"
            class="px-8"
          >
            {{ isPositiveResult ? 'Continue to Dashboard' : 'Return to Dashboard' }}
          </v-btn>
        </div>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  currentTheme: {
    type: String,
    default: 'refreshing'
  },
  assessmentResult: {
    type: Object,
    default: () => ({
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
  }
});

const emit = defineEmits([
  'update:modelValue', 
  'close', 
  'restart-assessment', 
  'select-continue-option',
  'select-alternative-route'
]);

// Dialog control
const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// State
const journeyRating = ref(4);
const journeyFeedback = ref('');

// Computed properties
const isPositiveResult = computed(() => {
  const sentiment = props.assessmentResult.sentiment;
  return sentiment === 'Positive' || sentiment === 'Stable' || sentiment === 'Slightly improved';
});

const hasSpecialOffers = ref(true);
const specialOffers = ref([
  {
    title: 'Premium Meditation Course',
    description: 'Access our premium guided meditation series with expert instructors.',
    discount: '30% OFF',
    validUntil: 'June 30, 2025'
  },
  {
    title: 'One-on-One Coaching',
    description: 'Personal coaching sessions with certified mental health professionals.',
    discount: '20% OFF First Session',
    validUntil: 'July 15, 2025'
  }
]);

const continueOptions = ref([
  {
    title: 'Advanced Journey',
    description: 'Continue with more advanced techniques and practices to further enhance your mental wellbeing.',
    icon: 'mdi-arrow-up-bold',
    color: 'primary'
  },
  {
    title: 'Maintenance Plan',
    description: 'Switch to a lighter maintenance plan to help sustain the progress you\'ve made.',
    icon: 'mdi-shield-check',
    color: 'success'
  },
  {
    title: 'Specialized Focus',
    description: 'Focus on a specific area of mental health that interests you most.',
    icon: 'mdi-target',
    color: 'info'
  }
]);

const alternativeRoutes = ref([
  {
    name: 'Mindfulness-Based Path',
    target: 'For stress reduction and present-moment awareness',
    description: 'A path centered on mindfulness practices to help reduce stress and increase awareness of thoughts and emotions.',
    source: 'Dr. Jon Kabat-Zinn\'s MBSR program',
    color: 'indigo',
    icon: 'mdi-meditation'
  },
  {
    name: 'Behavioral Activation Path',
    target: 'For motivation and mood improvement',
    description: 'This path focuses on gradually increasing meaningful activities to improve mood and build motivation.',
    source: 'Dr. Christopher Martell\'s behavioral activation therapy',
    color: 'green',
    icon: 'mdi-run'
  },
  {
    name: 'Social Connection Path',
    target: 'For building relationships and support',
    description: 'A path designed to help you strengthen existing relationships and build new social connections.',
    source: 'Dr. Robert Waldinger\'s longevity research',
    color: 'pink',
    icon: 'mdi-account-group'
  }
]);

// Methods
const selectContinueOption = (index) => {
  emit('select-continue-option', continueOptions.value[index]);
  showDialog.value = false;
};

const selectAlternativeRoute = (index) => {
  emit('select-alternative-route', alternativeRoutes.value[index]);
  showDialog.value = false;
};

const viewOffer = (index) => {
  // In a real app, this would navigate to the offer details or apply a promo code
  console.log('Viewing offer:', specialOffers.value[index]);
};

const finishJourney = () => {
  // Submit feedback if provided
  if (journeyRating.value || journeyFeedback.value) {
    console.log('Submitting feedback:', {
      rating: journeyRating.value,
      feedback: journeyFeedback.value
    });
  }
  
  showDialog.value = false;
  emit('close');
};
</script>

<style scoped>
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
</style>
