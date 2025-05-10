<template>
  <v-card class="mb-6 animate-fade-in" rounded="lg" elevation="3">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-2">mdi-chart-line</v-icon>
      Phase Progress Summary
    </v-card-title>
    
    <v-card-text>
      <!-- Phase Stats -->
      <v-row class="mb-6">
        <v-col cols="12" sm="4">
          <v-card variant="outlined" class="text-center h-100">
            <v-card-text>
              <p class="text-h4 font-weight-bold text-primary mb-1">{{ activeDays }}</p>
              <p class="text-subtitle-1">Active Days</p>
              <p class="text-caption">out of {{ totalDays }} days</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-card variant="outlined" class="text-center h-100">
            <v-card-text>
              <p class="text-h4 font-weight-bold" :class="getCompletionTextColor()">{{ completedActions }}</p>
              <p class="text-subtitle-1">Actions Completed</p>
              <p class="text-caption">out of {{ totalRequiredActions }} required</p>
            </v-card-text>
          </v-card>
        </v-col>
        
        <v-col cols="12" sm="4">
          <v-card variant="outlined" class="text-center h-100">
            <v-card-text>
              <p class="text-h4 font-weight-bold" :class="getConsistencyTextColor()">{{ consistencyPercentage }}%</p>
              <p class="text-subtitle-1">Consistency</p>
              <p class="text-caption">daily engagement</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      
      <!-- Progress Chart -->
      <div class="mb-6">
        <p class="text-subtitle-1 font-weight-medium mb-2">Daily Activity</p>
        <v-sheet height="150" class="d-flex align-center justify-center">
          <!-- In a real app, this would be a chart component -->
          <p class="text-caption text-grey">Activity chart would be displayed here</p>
        </v-sheet>
      </div>
      
      <!-- Progress Analysis -->
      <v-alert
        :color="getProgressAlertColor()"
        variant="tonal"
        class="mb-4"
      >
        <div class="d-flex">
          <v-icon class="mr-3">{{ getProgressAlertIcon() }}</v-icon>
          <div>
            <p class="font-weight-medium">{{ progressAnalysis.title }}</p>
            <p>{{ progressAnalysis.message }}</p>
          </div>
        </div>
      </v-alert>
      
      <!-- Route Change Suggestion -->
      <v-alert
        v-if="showRouteChangeSuggestion"
        color="info"
        variant="outlined"
        class="mb-4"
      >
        <div class="d-flex">
          <v-icon class="mr-3">mdi-routes</v-icon>
          <div>
            <p class="font-weight-medium">You are not following the advice regularly.</p>
            <p>Would you like to change your route to be more suitable?</p>
            <div class="mt-2">
              <v-btn color="primary" variant="text" class="mr-2" @click="$emit('suggest-new-route')">
                Show Me Options
              </v-btn>
              <v-btn variant="text" @click="dismissRouteSuggestion">
                Continue Current Path
              </v-btn>
            </div>
          </div>
        </div>
      </v-alert>
      
      <!-- Action History -->
      <p class="text-subtitle-1 font-weight-medium mb-2">Recent Activity</p>
      <v-timeline density="compact" align="start">
        <v-timeline-item
          v-for="(action, index) in recentActions"
          :key="index"
          :dot-color="action.completed ? 'success' : (action.skipped ? 'warning' : 'grey')"
          :icon="action.completed ? 'mdi-check' : (action.skipped ? 'mdi-skip-next' : 'mdi-cancel')"
          size="small"
        >
          <div class="d-flex justify-space-between align-center">
            <div>
              <p class="text-body-2 font-weight-medium mb-0">{{ action.action }}</p>
              <p class="text-caption text-grey">
                Day {{ action.day }} - {{ formatDate(action.timestamp) }}
              </p>
              <p v-if="action.skipped" class="text-caption font-italic">
                "{{ action.reason }}"
              </p>
            </div>
            <v-chip
              size="small"
              :color="action.completed ? 'success' : (action.skipped ? 'warning' : 'error')"
              variant="outlined"
            >
              {{ action.completed ? 'Completed' : (action.skipped ? 'Skipped' : 'Missed') }}
            </v-chip>
          </div>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
    
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn variant="text" @click="$emit('view-full-history')">
        View Full History
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  activeDays: {
    type: Number,
    default: 0
  },
  totalDays: {
    type: Number,
    default: 7
  },
  completedActions: {
    type: Number,
    default: 0
  },
  totalRequiredActions: {
    type: Number,
    default: 5
  },
  actionHistory: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['suggest-new-route', 'view-full-history']);

// State
const showRouteChangeSuggestion = ref(true);

// Computed properties
const completionPercentage = computed(() => {
  return Math.round((props.completedActions / props.totalRequiredActions) * 100);
});

const consistencyPercentage = computed(() => {
  return Math.round((props.activeDays / props.totalDays) * 100);
});

const recentActions = computed(() => {
  // Get the 5 most recent actions
  return [...props.actionHistory]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);
});

const progressAnalysis = computed(() => {
  if (completionPercentage.value >= 80) {
    return {
      title: "Excellent Progress!",
      message: "You're consistently completing your actions and making great progress on your journey."
    };
  } else if (completionPercentage.value >= 60) {
    return {
      title: "Good Progress",
      message: "You're making steady progress. Keep up the good work and try to be consistent."
    };
  } else if (completionPercentage.value >= 40) {
    return {
      title: "Moderate Progress",
      message: "You're making some progress, but there's room for improvement. Try to complete more of your required actions."
    };
  } else {
    return {
      title: "Limited Progress",
      message: "You're not completing many of your required actions. Consider if this path is right for you or if you need additional support."
    };
  }
});

// Methods
const getCompletionTextColor = () => {
  if (completionPercentage.value >= 80) return 'text-success';
  if (completionPercentage.value >= 60) return 'text-info';
  if (completionPercentage.value >= 40) return 'text-warning';
  return 'text-error';
};

const getConsistencyTextColor = () => {
  if (consistencyPercentage.value >= 80) return 'text-success';
  if (consistencyPercentage.value >= 60) return 'text-info';
  if (consistencyPercentage.value >= 40) return 'text-warning';
  return 'text-error';
};

const getProgressAlertColor = () => {
  if (completionPercentage.value >= 80) return 'success';
  if (completionPercentage.value >= 60) return 'info';
  if (completionPercentage.value >= 40) return 'warning';
  return 'error';
};

const getProgressAlertIcon = () => {
  if (completionPercentage.value >= 80) return 'mdi-trophy';
  if (completionPercentage.value >= 60) return 'mdi-thumb-up';
  if (completionPercentage.value >= 40) return 'mdi-information';
  return 'mdi-alert-circle';
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const dismissRouteSuggestion = () => {
  showRouteChangeSuggestion.value = false;
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
