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
          @click="$router.push(`/roadmap/${roadmapId}`)"
        >
          Back to Roadmap
        </v-btn>

        <div
          v-if="loading"
          class="d-flex justify-center align-center"
          style="height: 400px"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
        </div>

        <div v-else-if="step">
          <div
            class="d-flex flex-column md:flex-row justify-space-between align-start mb-6"
          >
            <div>
              <h1 class="text-h4 font-weight-bold">{{ step.title }}</h1>
              <p class="text-subtitle-1 text-grey-darken-1">{{
                step.description
              }}</p>
            </div>

            <div class="mood-selector mt-4 md:mt-0">
              <p class="text-subtitle-2 mb-2">How are you feeling today?</p>
              <div class="d-flex">
                <v-btn
                  v-for="emoji in ['😔', '😐', '🙂', '😊']"
                  :key="emoji"
                  :variant="mood === emoji ? 'elevated' : 'outlined'"
                  :color="mood === emoji ? 'primary' : undefined"
                  class="mx-1"
                  @click="mood = emoji"
                >
                  {{ emoji }}
                </v-btn>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex align-center mb-2">
              <p class="text-body-2 text-grey-darken-1 mr-2">Step progress:</p>
              <v-progress-linear
                :model-value="step.progress"
                color="primary"
                height="8"
                class="flex-grow-1"
              ></v-progress-linear>
              <span class="ml-2 text-body-2">{{ step.progress }}%</span>
            </div>
          </div>

          <v-tabs v-model="activeTab" class="mb-6">
            <v-tab value="overview">Overview</v-tab>
            <v-tab value="actions">
              Actions ({{ completedActionsCount }}/{{ step.actions.length }})
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="overview">
              <v-card class="mb-6">
                <v-card-title>Step Introduction</v-card-title>
                <v-card-text>
                  <p class="text-body-1 mb-4">
                    {{ getStepIntroduction() }}
                  </p>

                  <div v-if="step.videoUrl" class="mt-6">
                    <h3 class="text-h6 mb-2">Video Guide</h3>
                    <div
                      class="video-placeholder d-flex justify-center align-center"
                    >
                      <v-btn
                        icon="mdi-play"
                        color="primary"
                        size="x-large"
                        variant="flat"
                      ></v-btn>
                    </div>
                  </div>

                  <div
                    v-if="step.requireConfirmation"
                    class="mt-6 pa-4 bg-primary-lighten-5 rounded"
                  >
                    <h3 class="text-h6 text-primary-darken-1 mb-2"
                      >Problem Confirmation</h3
                    >
                    <p class="text-primary-darken-2 mb-4">
                      The first step to solving a problem is acknowledging its
                      existence. Please confirm that you are experiencing this
                      issue and are ready to work on improving it.
                    </p>

                    <v-radio-group v-model="confirmation">
                      <v-radio
                        label="I acknowledge this is my issue and want to improve"
                        value="acknowledge"
                        color="primary"
                      ></v-radio>
                      <v-radio
                        label="I'm not ready to face this issue yet"
                        value="notReady"
                        color="primary"
                      ></v-radio>
                    </v-radio-group>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <v-window-item value="actions">
              <v-row>
                <v-col
                  v-for="action in step.actions"
                  :key="action.id"
                  cols="12"
                  md="6"
                >
                  <v-card :class="{ 'bg-success-subtle': action.completed }">
                    <v-card-title
                      class="d-flex justify-space-between align-center"
                    >
                      {{ action.title }}
                      <v-chip
                        :color="action.required ? 'error' : 'primary'"
                        size="small"
                      >
                        {{ action.required ? "Required" : "Optional" }}
                      </v-chip>
                    </v-card-title>
                    <v-card-subtitle class="d-flex align-center">
                      <v-icon size="small" class="mr-1"
                        >mdi-clock-outline</v-icon
                      >
                      {{ action.duration }}
                    </v-card-subtitle>
                    <v-card-text>
                      <p>{{ action.description }}</p>

                      <div
                        v-if="action.moodTags && action.moodTags.length > 0"
                        class="mt-2"
                      >
                        <v-chip
                          v-for="tag in action.moodTags"
                          :key="tag"
                          size="small"
                          color="accent"
                          class="mr-1 mb-1"
                          variant="outlined"
                        >
                          {{ tag }}
                        </v-chip>
                      </div>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-space-between">
                      <v-btn
                        variant="text"
                        size="small"
                        @click="viewActionDetails(action.id)"
                      >
                        Details
                      </v-btn>

                      <v-checkbox
                        v-model="action.completed"
                        :label="
                          action.completed ? 'Completed' : 'Mark as completed'
                        "
                        hide-details
                        density="compact"
                        @change="updateProgress"
                      ></v-checkbox>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>

              <v-card v-if="showSkipConfirm" class="mt-6 bg-warning-lighten-5">
                <v-card-title>Do you want to skip this step?</v-card-title>
                <v-card-subtitle>
                  Please let us know why so we can improve your experience
                </v-card-subtitle>
                <v-card-text>
                  <v-radio-group v-model="skipReason">
                    <v-radio
                      label="I feel good today, don't need to do this step"
                      value="feelGood"
                      color="warning"
                    ></v-radio>
                    <v-radio
                      label="This step is not relevant to me"
                      value="notRelevant"
                      color="warning"
                    ></v-radio>
                    <v-radio
                      label="I don't have enough time right now"
                      value="noTime"
                      color="warning"
                    ></v-radio>
                  </v-radio-group>
                </v-card-text>
                <v-card-actions>
                  <v-btn variant="text" @click="showSkipConfirm = false">
                    Cancel
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="warning"
                    @click="confirmSkip"
                    :disabled="!skipReason"
                  >
                    Confirm Skip
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-window-item>
          </v-window>

          <div class="d-flex justify-space-between mt-8">
            <v-btn
              v-if="step.canSkip && !showSkipConfirm"
              variant="outlined"
              @click="showSkipConfirm = true"
            >
              Skip this step
            </v-btn>
            <div v-else></div>

            <v-btn
              size="large"
              :color="canContinue ? 'success' : 'primary'"
              :disabled="!canContinue"
              @click="continueToNextStep"
            >
              <v-icon start>{{
                step.isLast ? "mdi-check-circle" : "mdi-arrow-right"
              }}</v-icon>
              {{ step.isLast ? "Complete Roadmap" : "Continue" }}
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import { roadmapSteps } from "@/scripts/data/roadmapData.js";

export default {
  name: "StepDetail",
  props: {
    roadmapId: {
      type: String,
      required: true,
    },
    stepId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      roadmapSteps,
      step: null,
      activeTab: "overview",
      mood: null,
      confirmation: null,
      skipReason: null,
      showSkipConfirm: false,
    };
  },
  computed: {
    completedActionsCount() {
      if (!this.step) return 0;
      return this.step.actions.filter((action) => action.completed).length;
    },
    canContinue() {
      if (!this.step) return false;

      if (this.step.requireConfirmation) {
        return this.confirmation === "acknowledge";
      }

      const requiredActions = this.step.actions.filter(
        (action) => action.required
      );
      return requiredActions.every((action) => action.completed);
    },
  },
  mounted() {
    this.fetchStepDetails();
  },
  methods: {
    fetchStepDetails() {
      // In a real app, this would be an API call
      setTimeout(() => {
        this.step = {
          id: this.stepId,
          roadmapId: this.roadmapId,
          title:
            this.stepId === "1"
              ? "Identifying the Problem"
              : "Immediate Relief",
          description:
            this.stepId === "1"
              ? "Recognize anxiety symptoms and understand their origins"
              : "Learn quick relaxation techniques to reduce anxiety in urgent situations",
          videoUrl: "/videos/step1.mp4",
          actions: [
            {
              id: "1",
              title: "Emotion Journal",
              description:
                "Record situations that cause anxiety and your emotions",
              duration: "10 minutes",
              completed: false,
              required: true,
              moodTags: ["Good for when sad", "Helpful for anxiety"],
            },
            {
              id: "2",
              title: "Deep Breathing Exercise",
              description:
                "Practice deep breathing techniques to reduce anxiety",
              duration: "5 minutes",
              completed: false,
              required: false,
              moodTags: ["Quick relief", "For immediate stress"],
            },
            {
              id: "3",
              title: "Thought Analysis",
              description: "Identify and challenge negative thoughts",
              duration: "15 minutes",
              completed: false,
              required: true,
              moodTags: ["For overthinking", "Mental clarity"],
            },
          ],
          progress: 0,
          isFirst: this.stepId === "1",
          isLast: this.stepId === "5",
          nextStepId: this.getNextStepId(),
          canSkip: this.stepId !== "4",
          requireConfirmation: this.stepId === "1",
        };
        this.loading = false;
      }, 1000);
    },
    getNextStepId() {
      const currentId = parseInt(this.stepId);
      return currentId < 5 ? (currentId + 1).toString() : undefined;
    },
    getStepIntroduction() {
      if (this.stepId === "1") {
        return "The first step in overcoming anxiety is identifying and acknowledging the problem. In this step, you will learn to recognize anxiety symptoms, understand their origins, and their impact on your daily life.";
      } else {
        return "Once you have identified the problem, the next step is to learn immediate relief techniques. These techniques will help you cope with anxiety-inducing situations and reduce symptoms immediately.";
      }
    },
    updateProgress() {
      if (!this.step) return;

      const completedCount = this.step.actions.filter(
        (a) => a.completed
      ).length;
      this.step.progress = Math.round(
        (completedCount / this.step.actions.length) * 100
      );
    },
    viewActionDetails(actionId) {
      // In a real app, this would open a detailed view of the action
      alert(`Viewing details for action ${actionId}`);
    },
    confirmSkip() {
      if (!this.skipReason) return;

      // In a real app, this would send the skip reason to the API
      if (this.step.nextStepId) {
        this.$router.push(
          `/roadmap/${this.roadmapId}/step/${this.step.nextStepId}`
        );
      } else {
        this.$router.push(`/roadmap/${this.roadmapId}/complete`);
      }
    },
    continueToNextStep() {
      if (!this.canContinue) return;

      if (this.step.nextStepId) {
        this.$router.push(
          `/roadmap/${this.roadmapId}/step/${this.step.nextStepId}`
        );
      } else {
        this.$router.push(`/roadmap/${this.roadmapId}/complete`);
      }
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

.video-placeholder {
  background-color: #f0f0f0;
  height: 300px;
  border-radius: 8px;
}

.bg-success-subtle {
  background-color: #f0fff4 !important;
}
</style>
