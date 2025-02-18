<template>
  <v-timeline align="start">
    <v-timeline-item v-for="(item, i) in timelineItems" :key="i" :dot-color="item.color" :icon="item.icon" fill-dot>
      <v-card>
        <v-card-title :class="['text-h6', `bg-${item.color}`]">{{ item.title }}</v-card-title>
        <v-card-text class="bg-white text--primary">
          <p>{{ item.content }}</p>
          <RouterLink :to="item.link">
            <v-btn :color="item.color" variant="outlined">{{ item.linkTitle }}</v-btn>
          </RouterLink>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
const props = defineProps({
  timelineItems: {
    type: Array,
    required: true,
  }
});
</script>