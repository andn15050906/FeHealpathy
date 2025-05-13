<template>
  <v-card variant="outlined" class="activity-card">
    <v-card-text>
      <div class="d-flex align-center mb-2">
        <v-icon :color="activity.recommended ? 'primary' : 'grey'" class="mr-2"
          >mdi-star</v-icon
        >
        <span class="text-subtitle-1 font-weight-medium">{{
          activity.title
        }}</span>
        <v-chip
          v-if="activity.recommended"
          size="small"
          color="primary"
          class="ml-2"
          variant="flat"
        >
          Recommended
        </v-chip>
      </div>

      <p class="text-body-2 mb-2">{{ activity.description }}</p>

      <div
        v-if="activity.moodTags && activity.moodTags.length > 0"
        class="mb-3"
      >
        <v-chip
          v-for="tag in activity.moodTags"
          :key="tag"
          size="small"
          color="accent"
          class="mr-1 mb-1"
          variant="outlined"
        >
          {{ tag }}
        </v-chip>
      </div>

      <v-btn
        variant="text"
        color="primary"
        size="small"
        class="px-0"
        @click="$emit('start-activity', activity.id)"
      >
        START ACTIVITY
        <v-icon right>mdi-arrow-right</v-icon>
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "ActivityCard",
  props: {
    activity: {
      type: Object,
      required: true,
    },
  },
  emits: ["start-activity"],
};
</script>

<style scoped>
.activity-card {
  height: 100%;
  border-radius: 8px;
}
</style>
