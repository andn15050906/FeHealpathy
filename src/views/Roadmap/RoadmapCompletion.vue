<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <AppHeader
        @take-assessment="goToSuggestion"
        @update-status="updateStatus"
      />
      <v-container>
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="$router.push(`/roadmap/${id}`)"
        >
          Back to Roadmap
        </v-btn>

        <v-card
          class="mb-6 text-center py-6 bg-primary text-white"
          elevation="1"
        >
          <v-icon size="64" class="mb-2">mdi-trophy-outline</v-icon>
          <h2 class="text-h4 mb-2"
            >Congratulations on Completing Your Roadmap!</h2
          >
          <p class="text-body-1">
            This is an achievement to be proud of. Continue maintaining the good
            habits you've built.
          </p>
        </v-card>

        <v-row>
          <v-col cols="12" md="4">
            <v-card class="text-center" height="100%">
              <v-card-text>
                <v-icon color="primary" size="48" class="mb-2"
                  >mdi-calendar-check</v-icon
                >
                <h3 class="text-h5 mb-1">Active Days</h3>
                <p class="text-h3 text-primary font-weight-bold">14</p>
                <p class="text-body-2 text-grey">days</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="text-center" height="100%">
              <v-card-text>
                <v-icon color="success" size="48" class="mb-2"
                  >mdi-check-circle</v-icon
                >
                <h3 class="text-h5 mb-1">Actions Completed</h3>
                <p class="text-h3 text-success font-weight-bold">23</p>
                <p class="text-body-2 text-grey">actions</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="text-center" height="100%">
              <v-card-text>
                <v-icon color="amber-darken-2" size="48" class="mb-2"
                  >mdi-medal</v-icon
                >
                <h3 class="text-h5 mb-1">Emotional Progress</h3>
                <div class="d-flex justify-center align-center my-2">
                  <v-progress-linear
                    model-value="68"
                    color="success"
                    height="8"
                    class="w-50"
                  ></v-progress-linear>
                  <span class="ml-2 font-weight-medium">68%</span>
                </div>
                <p class="text-body-2 text-grey">improvement</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="my-6">
          <v-card-title>Rate Your Improvement</v-card-title>
          <v-card-subtitle>
            Please let us know how much you've improved after completing this
            roadmap
          </v-card-subtitle>
          <v-card-text>
            <v-radio-group v-model="improvement">
              <v-radio
                label="I've improved a little"
                value="little"
                color="primary"
              ></v-radio>
              <v-radio
                label="I've improved moderately"
                value="moderate"
                color="primary"
              ></v-radio>
              <v-radio
                label="I've improved significantly"
                value="significant"
                color="primary"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              color="primary"
              @click="submitSurvey"
              :disabled="!improvement"
            >
              Submit Feedback
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card
          v-if="showCoupon"
          class="my-6 border-dashed border-2 border-amber"
        >
          <v-card-title class="text-center text-amber-darken-2"
            >Special Discount Code</v-card-title
          >
          <v-card-text class="text-center">
            <div class="coupon-code mb-4">
              <p class="text-h4 font-weight-bold text-amber-darken-2"
                >MENTAL25</p
              >
            </div>
            <p class="text-body-2 text-amber-darken-1">
              Use this code for a 25% discount on our "Applied Psychology"
              course
            </p>
          </v-card-text>
        </v-card>

        <v-card v-if="improvement === 'little'" class="my-6 bg-blue-lighten-5">
          <v-card-title>Advanced Roadmap Suggestions</v-card-title>
          <v-card-subtitle>
            Based on your feedback, we suggest these additional roadmaps
          </v-card-subtitle>
          <v-card-text>
            <v-list bg-color="transparent">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="amber-darken-2">mdi-star</v-icon>
                </template>
                <v-list-item-title
                  >Advanced Roadmap: Overcoming Anxiety</v-list-item-title
                >
                <v-list-item-subtitle
                  >Advanced techniques for dealing with chronic
                  anxiety</v-list-item-subtitle
                >
                <template v-slot:append>
                  <v-btn variant="outlined" size="small">View Details</v-btn>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="amber-darken-2">mdi-star</v-icon>
                </template>
                <v-list-item-title>Daily Meditation</v-list-item-title>
                <v-list-item-subtitle
                  >Build a meditation habit to improve mental
                  health</v-list-item-subtitle
                >
                <template v-slot:append>
                  <v-btn variant="outlined" size="small">View Details</v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <div class="text-center mt-8">
          <v-btn
            size="large"
            color="success"
            prepend-icon="mdi-home"
            @click="$router.push('/')"
          >
            Return to Home
          </v-btn>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import { roadmapSteps } from "@/scripts/data/roadmapData.js";

export default {
  name: "RoadmapCompletion",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      roadmapSteps: roadmapSteps.map((step) => ({
        ...step,
        completed: true,
      })),
      improvement: null,
      showCoupon: false,
    };
  },
  methods: {
    submitSurvey() {
      // In a real app, this would be an API call
      this.showCoupon = true;
    },
    goToSuggestion() {
      this.$router.push("/suggest");
    },
    updateStatus() {
      // In a real app, this would update the user's status
      alert("Status updated!");
    },
  },
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
}

.roadmap-content {
  flex: 1;
}

.coupon-code {
  background-color: white;
  border: 2px dashed #f59e0b;
  border-radius: 8px;
  padding: 16px;
}

.border-dashed {
  border-style: dashed !important;
}
</style>
