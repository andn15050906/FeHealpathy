<template>
  <div>
    <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
      <v-card-item>
        <template v-slot:prepend>
          <v-avatar :color="currentPath.color" size="48" class="text-white elevation-2">
            <v-icon size="large">{{ currentPath.icon }}</v-icon>
          </v-avatar>
        </template>
        <v-card-title class="text-h5">{{ currentPath.name }}</v-card-title>
        <v-card-subtitle>{{ currentPath.target }}</v-card-subtitle>
      </v-card-item>
      
      <v-card-text>
        <p class="text-body-1 mb-4">{{ currentPath.description }}</p>
        <p class="text-caption">
          <v-icon small color="grey">mdi-information-outline</v-icon>
          Based on {{ currentPath.source }}
        </p>
      </v-card-text>
    </v-card>
    
    <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-map-marker-path</v-icon>
        Your Journey Progress
      </v-card-title>
      <v-card-text>
        <v-progress-linear
          :model-value="overallProgress"
          color="primary"
          height="10"
          rounded
          class="mb-6"
        ></v-progress-linear>
        
        <div class="d-flex justify-space-between mb-8">
          <div
            v-for="(phase, index) in currentPath.phases"
            :key="index"
            class="d-flex flex-column align-center"
            :class="{ 'text-primary font-weight-medium': currentPhaseIndex >= index }"
          >
            <v-avatar
              :color="currentPhaseIndex >= index ? 'primary' : 'grey-lighten-1'"
              :class="currentPhaseIndex === index ? 'ring-4 ring-primary-lighten-4' : ''"
              size="32"
              class="mb-2 text-white"
            >
              <v-icon v-if="currentPhaseIndex > index">mdi-check</v-icon>
              <span v-else>{{ index + 1 }}</span>
            </v-avatar>
            <span class="text-caption text-center" style="max-width: 80px">{{ phase.title }}</span>
          </div>
        </div>
      </v-card-text>
    </v-card>
    
    <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
      <v-card-title class="d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-calendar-check</v-icon>
        Current Phase: {{ currentPhase.title }}
      </v-card-title>
      
      <v-card-text>
        <div class="d-flex flex-wrap align-center mb-4">
          <v-chip class="mr-2 mb-2" color="primary" variant="outlined">
            <v-icon start>mdi-clock-outline</v-icon>
            Day {{ currentDay }} of {{ currentPhase.duration }}
          </v-chip>
          
          <v-chip class="mr-2 mb-2" :color="getProgressColor(phaseProgress)">
            <v-icon start>mdi-check-circle</v-icon>
            {{ completedActions }} of {{ currentPhase.requiredActions }} required actions
          </v-chip>
          
          <v-chip class="mb-2" color="grey" variant="outlined">
            <v-icon start>mdi-calendar-range</v-icon>
            {{ daysRemaining }} days remaining
          </v-chip>
        </div>
        
        <v-alert v-if="showProgressWarning" color="warning" variant="tonal" class="mb-4">
          <div class="d-flex">
            <v-icon class="mr-3">mdi-alert-circle</v-icon>
            <div>
              <p class="font-weight-medium">You are not following the advice regularly.</p>
              <p>Would you like to change your route to be more suitable?</p>
              <div class="mt-2">
                <v-btn color="warning" variant="text" class="mr-2">Change Route</v-btn>
                <v-btn variant="text">Continue Current Path</v-btn>
              </div>
            </div>
          </div>
        </v-alert>
        
        <div class="mb-6">
          <p class="text-h6 font-weight-medium mb-3">How are you feeling today?</p>
          <v-chip-group v-model="selectedMood" mandatory class="mb-4">
            <v-chip
              v-for="(mood, index) in availableMoods"
              :key="index"
              :value="mood.value"
              filter
              variant="elevated"
            >
              <v-icon start>{{ mood.icon }}</v-icon>
              {{ mood.label }}
            </v-chip>
          </v-chip-group>
          
          <p class="text-h6 font-weight-medium mb-3">Any specific concerns today?</p>
          <v-chip-group v-model="selectedConcerns" multiple class="mb-4">
            <v-chip
              v-for="(concern, index) in availableConcerns"
              :key="index"
              :value="concern.value"
              filter
              variant="outlined"
            >
              {{ concern.label }}
            </v-chip>
          </v-chip-group>
        </div>
        
        <p class="text-h6 font-weight-medium mb-3 d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-star</v-icon>
          Today's Recommended Actions
        </p>
        
        <v-row>
          <v-col
            v-for="(action, index) in todaysActions"
            :key="index"
            cols="12"
            md="6"
          >
            <v-card
              variant="outlined"
              hover
              class="h-100 activity-card"
              :class="{'highlighted-activity': isRecommendedForMood(action)}"
            >
              <v-card-item>
                <template v-slot:prepend>
                  <v-chip
                    :color="action.required ? 'error' : 'info'"
                    size="small"
                    class="font-weight-medium"
                  >
                    {{ action.required ? 'Required' : 'Optional' }}
                  </v-chip>
                </template>
                <v-card-title class="d-flex align-center">
                  {{ action.title }}
                  <v-chip v-if="isRecommendedForMood(action)" color="primary" size="small" class="ml-2">Recommended</v-chip>
                </v-card-title>
                <v-card-subtitle>{{ getActionTypeLabel(action.type) }}</v-card-subtitle>
              </v-card-item>
              
              <v-card-text>
                <p class="text-body-2 mb-4">{{ action.description }}</p>
                
                <div class="d-flex flex-wrap">
                  <v-chip
                    v-for="(mood, mIndex) in action.moods"
                    :key="`mood-${mIndex}`"
                    size="small"
                    class="mr-1 mb-1"
                    variant="outlined"
                    :color="mood === selectedMood ? 'primary' : 'grey'"
                  >
                    {{ mood }}
                  </v-chip>
                </div>
              </v-card-text>
              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="!action.completed"
                  color="primary"
                  variant="text"
                  @click="completeAction(index)"
                >
                  Complete
                </v-btn>
                <v-btn
                  v-if="!action.completed && !action.required"
                  variant="text"
                  @click="skipAction(index)"
                >
                  Skip
                </v-btn>
                <v-btn
                  v-if="action.completed"
                  color="success"
                  variant="text"
                  disabled
                >
                  <v-icon start>mdi-check</v-icon>
                  Completed
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <v-dialog v-model="showSkipDialog" max-width="500px">
      <v-card>
        <v-card-title>Skip This Action</v-card-title>
        <v-card-text>
          <p class="mb-4">Please let us know why you're skipping this action:</p>
          <v-radio-group v-model="skipReason">
            <v-radio
              v-for="(reason, index) in skipReasons"
              :key="index"
              :label="reason"
              :value="reason"
            ></v-radio>
          </v-radio-group>
          <v-textarea
            v-if="skipReason === 'Other'"
            v-model="skipReasonOther"
            label="Please specify"
            rows="2"
            variant="outlined"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="showSkipDialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="confirmSkip">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  currentPath: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['phase-completed', 'update-progress']);

// Current phase tracking
const currentPhaseIndex = ref(0);
const currentDay = ref(1);
const completedActions = ref(0);
const actionHistory = ref([]);

// User mood and concerns
const selectedMood = ref(null);
const selectedConcerns = ref([]);

// Skip action dialog
const showSkipDialog = ref(false);
const skipActionIndex = ref(null);
const skipReason = ref('');
const skipReasonOther = ref('');
const skipReasons = [
  'I feel good today and don\'t need this',
  'I\'m too tired to do this now',
  'I don\'t think this will help me',
  'I\'ll do this later',
  'Other'
];

// Computed properties
const currentPhase = computed(() => props.currentPath.phases[currentPhaseIndex.value]);

const daysRemaining = computed(() => {
  return currentPhase.value.duration - currentDay.value;
});

const phaseProgress = computed(() => {
  return (completedActions.value / currentPhase.value.requiredActions) * 100;
});

const overallProgress = computed(() => {
  const totalPhases = props.currentPath.phases.length;
  const phaseWeight = 1 / totalPhases;
  const currentPhaseProgress = (currentPhaseIndex.value / totalPhases) + 
                              (phaseProgress.value / 100 * phaseWeight);
  return currentPhaseProgress * 100;
});

const showProgressWarning = computed(() => {
  // Show warning if less than 50% of required actions completed and more than half the phase has passed
  return phaseProgress.value < 50 && currentDay.value > currentPhase.value.duration / 2;
});

// Today's actions - would be more sophisticated in a real app
const todaysActions = ref([]);

// Available moods and concerns
const availableMoods = [
  { label: 'Happy', value: 'happy', icon: 'mdi-emoticon-happy-outline' },
  { label: 'Calm', value: 'calm', icon: 'mdi-emoticon-neutral-outline' },
  { label: 'Tired', value: 'tired', icon: 'mdi-emoticon-tired-outline' },
  { label: 'Anxious', value: 'anxious', icon: 'mdi-emoticon-confused-outline' },
  { label: 'Sad', value: 'sad', icon: 'mdi-emoticon-sad-outline' },
  { label: 'Stressed', value: 'stressed', icon: 'mdi-emoticon-frown-outline' }
];

const availableConcerns = [
  { label: 'Stress', value: 'stress' },
  { label: 'Sleep', value: 'sleep' },
  { label: 'Focus', value: 'focus' },
  { label: 'Mood', value: 'mood' },
  { label: 'Relationships', value: 'relationships' },
  { label: 'Physical', value: 'physical' }
];

// Initialize actions when component mounts
const initializeActions = () => {
  // In a real app, this would fetch from an API or database
  // Here we're just using the actions from the current phase
  todaysActions.value = currentPhase.value.actions.map(action => ({
    ...action,
    completed: false
  }));
};

// Watch for changes in mood and concerns to update recommendations
watch([selectedMood, selectedConcerns], () => {
  // In a real app, this would re-fetch or re-sort actions based on mood and concerns
  console.log('Mood or concerns changed, updating recommendations');
});

// Check if an action is recommended for the current mood
const isRecommendedForMood = (action) => {
  if (!selectedMood.value) return false;
  
  // Check if action matches current mood
  const matchesMood = action.moods.includes(selectedMood.value) || action.moods.includes('any');
  
  // Check if action matches any selected concerns
  const matchesConcern = selectedConcerns.value.length === 0 || 
                        selectedConcerns.value.some(concern => 
                          action.concerns.includes(concern));
  
  return matchesMood && matchesConcern;
};

// Get a user-friendly label for action types
const getActionTypeLabel = (type) => {
  const typeLabels = {
    'journaling': 'Journaling Exercise',
    'meditation': 'Meditation Practice',
    'CBT': 'Cognitive Behavioral Exercise',
    'education': 'Educational Content',
    'exercise': 'Physical Exercise',
    'activity': 'Practical Activity'
  };
  
  return typeLabels[type] || type;
};

// Get color based on progress percentage
const getProgressColor = (progress) => {
  if (progress < 30) return 'error';
  if (progress < 70) return 'warning';
  return 'success';
};

// Action completion handlers
const completeAction = (index) => {
  todaysActions.value[index].completed = true;
  
  if (todaysActions.value[index].required) {
    completedActions.value++;
  }
  
  // Record in history
  actionHistory.value.push({
    day: currentDay.value,
    phase: currentPhaseIndex.value,
    action: todaysActions.value[index].title,
    completed: true,
    timestamp: new Date()
  });
  
  // Check if phase is complete
  checkPhaseCompletion();
  
  // Emit progress update
  emit('update-progress', {
    phaseIndex: currentPhaseIndex.value,
    day: currentDay.value,
    completedActions: completedActions.value,
    requiredActions: currentPhase.value.requiredActions,
    progress: phaseProgress.value
  });
};

const skipAction = (index) => {
  skipActionIndex.value = index;
  showSkipDialog.value = true;
};

const confirmSkip = () => {
  const index = skipActionIndex.value;
  
  if (index !== null) {
    // Record in history with reason
    actionHistory.value.push({
      day: currentDay.value,
      phase: currentPhaseIndex.value,
      action: todaysActions.value[index].title,
      completed: false,
      skipped: true,
      reason: skipReason.value === 'Other' ? skipReasonOther.value : skipReason.value,
      timestamp: new Date()
    });
    
    // Mark as skipped
    todaysActions.value[index].skipped = true;
  }
  
  // Reset and close dialog
  showSkipDialog.value = false;
  skipActionIndex.value = null;
  skipReason.value = '';
  skipReasonOther.value = '';
};

// Check if the current phase is complete
const checkPhaseCompletion = () => {
  if (completedActions.value >= currentPhase.value.requiredActions) {
    // Phase is complete
    if (currentPhaseIndex.value < props.currentPath.phases.length - 1) {
      // Move to next phase
      currentPhaseIndex.value++;
      currentDay.value = 1;
      completedActions.value = 0;
      initializeActions();
      
      // Emit phase completed event
      emit('phase-completed', {
        completedPhase: currentPhaseIndex.value - 1,
        newPhase: currentPhaseIndex.value
      });
    } else {
      // Path is complete
      emit('path-completed');
    }
  } else if (currentDay.value >= currentPhase.value.duration) {
    // Time is up but not enough actions completed
    // In a real app, you might want to handle this differently
    currentDay.value = 1;
    initializeActions();
  } else {
    // Move to next day
    currentDay.value++;
    // In a real app, you would refresh actions for the new day
  }
};

// Initialize on component creation
initializeActions();
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

.ring-4 {
  box-shadow: 0 0 0 4px rgba(var(--v-theme-primary), 0.2);
}
</style>
