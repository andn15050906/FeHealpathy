<template>
  <v-card class="mb-6" elevation="1">
    <v-card-text>
      <div class="d-flex align-center mb-4">
        <v-avatar color="primary" size="40" class="mr-3">
          <v-icon color="white">mdi-sprout-outline</v-icon>
        </v-avatar>
        <span class="text-h6">{{ step.title }}</span>
      </div>

      <p class="text-body-1 mb-6">{{ step.description }}</p>

      <div class="mb-6">
        <div class="d-flex align-center mb-3">
          <v-icon color="primary" class="mr-2">mdi-target</v-icon>
          <span class="text-subtitle-1 font-weight-medium"
            >What to focus on:</span
          >
        </div>

        <div
          v-for="(focus, index) in step.focusAreas"
          :key="index"
          class="d-flex align-center mb-2"
        >
          <v-icon color="grey" class="mr-2">mdi-arrow-right</v-icon>
          <span class="text-body-2">{{ focus }}</span>
        </div>
      </div>

      <div>
        <div class="d-flex align-center mb-4">
          <v-icon color="primary" class="mr-2">mdi-star</v-icon>
          <span class="text-subtitle-1 font-weight-medium"
            >Recommended activities:</span
          >
        </div>

        <v-row>
          <v-col
            v-for="activity in step.activities"
            :key="activity.id"
            cols="12"
            md="6"
          >
            <ActivityCard :activity="activity" />
          </v-col>
        </v-row>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import ActivityCard from "./ActivityCard.vue";

export default {
  name: "StepDetail",
  components: {
    ActivityCard,
  },
  props: {
    step: {
      type: Object,
      required: true,
    },
  },
};
</script>
