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
          @click="$router.push('/')"
        >
          Back to Roadmaps
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

        <div v-else-if="roadmap">
          <div class="d-flex align-center mb-6">
            <h1 class="text-h4 font-weight-bold">{{ roadmap.title }}</h1>
          </div>

          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2"
                >mdi-information-outline</v-icon
              >
              Introduction
            </v-card-title>
            <v-card-text>
              <div
                v-for="(text, index) in roadmap.introText"
                :key="index"
                class="mb-2"
              >
                <p>{{ text }}</p>
              </div>

              <v-alert
                color="warning"
                variant="tonal"
                class="mt-4"
                icon="mdi-information-outline"
              >
                <v-alert-title>Important Note</v-alert-title>
                <p>
                  📌 Cognitive Behavioral Therapy (CBT) has been recognized by
                  many professional associations, especially the
                  <strong>American Psychological Association (APA)</strong>, as
                  one of the most effective psychological therapies.
                  <a
                    href="https://www.radiashealth.org/what-is-cognitive-behavioral-therapy/"
                    target="_blank"
                    class="text-primary text-decoration-none"
                  >
                    Learn more </a
                  >.
                </p>
              </v-alert>
            </v-card-text>
          </v-card>

          <h2 class="text-h5 mb-4">Roadmap Steps</h2>
          <div class="mb-6">
            <v-timeline align="start">
              <v-timeline-item
                v-for="(step, index) in roadmap.steps"
                :key="step.id"
                :dot-color="getStepColor(step)"
                size="small"
              >
                <template v-slot:opposite>
                  <div class="text-caption">Step {{ index + 1 }}</div>
                </template>
                <v-card
                  :class="{
                    'border-primary': step.current,
                    'bg-success-subtle': step.completed,
                  }"
                >
                  <v-card-title class="d-flex align-center">
                    {{ step.title }}
                    <v-chip
                      v-if="step.current"
                      color="primary"
                      size="small"
                      class="ml-2"
                    >
                      Current
                    </v-chip>
                    <v-chip
                      v-if="step.completed"
                      color="success"
                      size="small"
                      class="ml-2"
                    >
                      Completed
                    </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <p>{{ step.description }}</p>
                    <div
                      v-if="step.videoUrl"
                      class="d-flex align-center mt-2 text-primary"
                    >
                      <v-icon size="small" class="mr-1">mdi-video</v-icon>
                      <span class="text-caption">Has video guide</span>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      :color="step.current ? 'success' : undefined"
                      :variant="step.current ? 'elevated' : 'outlined'"
                      :disabled="!step.current && !step.completed"
                      @click="goToStep(step.id)"
                    >
                      <v-icon v-if="step.current" start>mdi-play</v-icon>
                      {{
                        step.current
                          ? "Start This Step"
                          : step.completed
                          ? "Review"
                          : "Locked"
                      }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </div>

          <div class="text-center mb-8">
            <v-btn
              size="large"
              color="primary"
              prepend-icon="mdi-play"
              @click="startRoadmap"
            >
              Start Roadmap
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
  name: "RoadmapDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      roadmapSteps,
      roadmap: null,
    };
  },
  mounted() {
    this.fetchRoadmap();
  },
  methods: {
    fetchRoadmap() {
      // In a real app, this would be an API call
      setTimeout(() => {
        this.roadmap = {
          id: this.id,
          title: this.id === "1" ? "Overcoming Anxiety" : "Building Confidence",
          description: "Learn to identify and overcome common anxiety symptoms",
          progress: 0,
          introText: [
            "This roadmap is designed based on Cognitive Behavioral Therapy (CBT), a method proven effective in treating anxiety.",
            "During the process, you will learn to identify negative thoughts, challenge them, and replace them with more positive ones.",
            "Each step in the roadmap will help you build the necessary skills to effectively manage anxiety and improve your overall mental health.",
          ],
          steps: [
            {
              id: "1",
              title: "Identifying the Problem",
              description:
                "Recognize anxiety symptoms and understand their origins",
              videoUrl: "/videos/step1.mp4",
              completed: false,
              current: true,
            },
            {
              id: "2",
              title: "Immediate Relief",
              description:
                "Learn quick relaxation techniques to reduce anxiety in urgent situations",
              videoUrl: "/videos/step2.mp4",
              completed: false,
              current: false,
            },
            {
              id: "3",
              title: "Stabilizing the Mind",
              description:
                "Practice mindfulness and meditation exercises to stabilize your mind",
              videoUrl: "/videos/step3.mp4",
              completed: false,
              current: false,
            },
            {
              id: "4",
              title: "Facing the Problem",
              description:
                "Develop strategies to face anxiety-inducing situations",
              videoUrl: "/videos/step4.mp4",
              completed: false,
              current: false,
            },
            {
              id: "5",
              title: "Evaluation & Maintenance",
              description:
                "Evaluate progress and build a long-term maintenance plan",
              videoUrl: "/videos/step5.mp4",
              completed: false,
              current: false,
            },
          ],
        };
        this.loading = false;
      }, 1000);
    },
    getStepColor(step) {
      if (step.completed) {
        return "success";
      }
      if (step.current) {
        return "primary";
      }
      return "grey";
    },
    startRoadmap() {
      const currentStep = this.roadmap.steps.find((step) => step.current);
      if (currentStep) {
        this.goToStep(currentStep.id);
      }
    },
    goToStep(stepId) {
      this.$router.push(`/roadmap/${this.roadmap.id}/step/${stepId}`);
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

.border-primary {
  border: 2px solid #6a39ca !important;
}

.bg-success-subtle {
  background-color: #f0fff4 !important;
}
</style>
