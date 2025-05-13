<template>
  <v-navigation-drawer permanent width="220" class="sidebar">
    <v-list-item class="sidebar-header">
      <v-list-item-title class="text-h6 d-flex align-center">
        <v-icon color="primary" class="mr-2">mdi-map-marker-path</v-icon>
        Tiến trình lộ trình
      </v-list-item-title>
      <template v-slot:append>
        <v-btn icon variant="text">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list nav>
      <v-list-item
        v-for="step in steps"
        :key="step.id"
        :value="step.id"
        :class="{ 'active-step': step.id === activeStep }"
        :rounded="'pill'"
      >
        <template v-slot:prepend>
          <v-avatar size="32" :color="getStepColor(step)" class="step-avatar">
            <v-icon v-if="step.completed" color="white">mdi-check</v-icon>
            <span v-else class="text-white">{{ step.id }}</span>
          </v-avatar>
        </template>
        <v-list-item-title>{{ step.title }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-4">
        <v-progress-linear
          model-value="50"
          color="primary"
          height="8"
          rounded
        ></v-progress-linear>
        <div class="d-flex align-center mt-2">
          <v-avatar size="24" color="success" class="mr-2">
            <v-icon size="small" color="white">mdi-check</v-icon>
          </v-avatar>
          <span class="text-body-2">Tiến trình của bạn: 50%</span>
        </div>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "RoadmapSidebar",
  props: {
    steps: {
      type: Array,
      required: true,
    },
    activeStep: {
      type: Number,
      required: true,
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
  },
};
</script>

<style scoped>
.sidebar {
  border-right: 1px solid #e0e0e0;
}

.sidebar-header {
  padding: 16px;
}

.active-step {
  background-color: #e0d7f0;
}

.step-avatar {
  margin-right: 8px;
}
</style>
