<template>
  <v-card class="mb-6" elevation="1">
    <v-card-text>
      <div v-if="loading" class="d-flex justify-center align-center pa-4">
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </div>

      <div v-else>
        <div class="d-flex align-center mb-4">
          <v-avatar color="primary" size="40" class="mr-3">
            <v-icon color="white">mdi-sprout-outline</v-icon>
          </v-avatar>
          <span class="text-h6">{{ displayStep.title }}</span>
        </div>

        <p class="text-body-1 mb-6">{{ displayStep.description }}</p>

        <div class="mb-6">
          <div class="d-flex align-center mb-3">
            <v-icon color="primary" class="mr-2">mdi-target</v-icon>
            <span class="text-subtitle-1 font-weight-medium"
              >What to focus on:</span
            >
          </div>

          <div
            v-for="(focus, index) in displayFocusAreas"
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
              v-for="activity in displayActivities"
              :key="activity.id"
              cols="12"
              md="6"
            >
              <ActivityCard :activity="activity" />
            </v-col>
          </v-row>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import ActivityCard from "./ActivityCard.vue";
import { getStepDetails } from "@/scripts/api/services/roadmapService";

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
  data() {
    return {
      detailedStep: null,
      loading: false,
    };
  },
  async created() {
    // If the step has an ID, fetch detailed information
    if (this.step && this.step.id) {
      await this.fetchStepDetails(this.step.id);
    }
  },
  methods: {
    async fetchStepDetails(stepId) {
      try {
        this.loading = true;
        const response = await getStepDetails(stepId);

        if (response) {
          this.detailedStep = response;
        }
      } catch (error) {
        console.error("Error fetching step details:", error);
      } finally {
        this.loading = false;
      }
    },
  },
  computed: {
    // Use detailed step data if available, otherwise use the prop data
    displayStep() {
      return this.detailedStep || this.step;
    },
    displayFocusAreas() {
      return this.detailedStep?.focusAreas || this.step.focusAreas || [];
    },
    displayActivities() {
      return this.detailedStep?.activities || this.step.activities || [];
    },
  },
};
</script>