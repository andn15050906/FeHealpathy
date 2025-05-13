<template>
  <v-card class="mb-6 mt-4" elevation="1">
    <v-card-text>
      <div class="d-flex align-center mb-4">
        <v-icon color="primary" class="mr-2">mdi-map-marker-path</v-icon>
        <span class="text-h6">Hành trình sức khỏe tinh thần của bạn</span>
      </div>

      <v-progress-linear
        :model-value="progressValue"
        color="primary"
        height="8"
        class="mb-6"
      ></v-progress-linear>

      <div class="d-flex justify-space-between">
        <div
          v-for="step in steps"
          :key="step.id"
          class="text-center progress-step"
        >
          <v-avatar size="40" :color="getStepColor(step)" class="mb-2">
            <v-icon v-if="step.completed" color="white">mdi-check</v-icon>
            <span v-else class="text-white">{{ step.id }}</span>
          </v-avatar>
          <div class="text-caption text-center progress-step-title">
            {{ formatStepTitle(step.title) }}
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "RoadmapProgress",
  props: {
    steps: {
      type: Array,
      required: true,
    },
    activeStep: {
      type: Number,
      required: true,
    },
    progressValue: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    getStepColor(step) {
      if (step.completed) {
        return "primary";
      }
      if (step.id === this.activeStep) {
        return "primary";
      }
      return "grey";
    },
    formatStepTitle(title) {
      const words = title.split(" ");
      if (words.length === 1) return title;

      return `${words[0]}<br>${words.slice(1).join(" ")}`;
    },
  },
};
</script>

<style scoped>
.progress-step {
  width: 20%;
}

.progress-step-title {
  font-size: 0.75rem;
  line-height: 1.2;
}
</style>
