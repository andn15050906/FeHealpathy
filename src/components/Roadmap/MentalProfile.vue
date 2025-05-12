<template>
  <v-card class="mb-6">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-2">mdi-brain</v-icon>
      Mental Profile
    </v-card-title>
    <v-card-subtitle
      >Based on your responses, we've created your mental health
      profile</v-card-subtitle
    >

    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <div class="mb-4">
            <div class="text-subtitle-2 text-grey">User Type</div>
            <div class="text-body-1">{{ profile.userType }}</div>
          </div>

          <div class="mb-4">
            <div class="text-subtitle-2 text-grey">Main Stress Source</div>
            <div class="text-body-1">{{ profile.stressSource }}</div>
          </div>

          <div class="mb-4">
            <div class="text-subtitle-2 text-grey">Improvement Goal</div>
            <div class="text-body-1">{{ profile.improvementGoal }}</div>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="mb-4">
            <div class="text-subtitle-2 text-grey">Stress Level</div>
            <v-progress-linear
              :model-value="profile.stressLevel"
              color="error"
              height="8"
            ></v-progress-linear>
            <div class="text-caption text-right"
              >{{ profile.stressLevel }}%</div
            >
          </div>

          <div class="mb-4">
            <div class="text-subtitle-2 text-grey">Depression Risk</div>
            <v-progress-linear
              :model-value="profile.depressionRisk"
              color="warning"
              height="8"
            ></v-progress-linear>
            <div class="text-caption text-right"
              >{{ profile.depressionRisk }}%</div
            >
          </div>

          <div>
            <div class="text-subtitle-2 text-grey">Emotional Index by Day</div>
            <v-sheet height="100" class="d-flex align-end">
              <div
                v-for="(day, i) in profile.emotionalIndex"
                :key="i"
                class="emotion-bar mx-1"
                :style="`height: ${day.value}%; width: 20%`"
              ></div>
            </v-sheet>
            <div class="d-flex justify-space-between">
              <span
                v-for="(day, i) in profile.emotionalIndex"
                :key="i"
                class="text-caption"
              >
                {{ formatDate(day.date) }}
              </span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "MentalProfile",
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.getDate();
    },
  },
};
</script>

<style scoped>
.emotion-bar {
  background-color: #6a39ca;
  border-radius: 4px 4px 0 0;
}
</style>
