<template>
  <v-card class="recommendation-card mb-4">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-2">{{
        getRecommendationIcon()
      }}</v-icon>
      {{ isMotivation ? "Lời động viên" : "Lời khuyên" }}
    </v-card-title>

    <v-card-text>
      <p class="text-body-1">{{ content }}</p>

      <div v-if="source" class="text-caption text-grey mt-2">
        Từ: {{ source }}
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
        v-if="!isMotivation"
        color="primary"
        variant="text"
        @click="$emit('follow-recommendation')"
      >
        Làm theo lời khuyên
      </v-btn>

      <v-btn
        v-if="!isMotivation"
        variant="text"
        @click="$emit('skip-recommendation')"
      >
        Đưa lời khuyên khác
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RecommendationCard",
  props: {
    content: {
      type: String,
      required: true,
    },
    isMotivation: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      default: "",
    },
  },
  methods: {
    getRecommendationIcon() {
      return this.isMotivation ? "mdi-star" : "mdi-lightbulb";
    },
  },
};
</script>

<style scoped>
.recommendation-card {
  border-left: 4px solid var(--v-primary-base);
}
</style>
