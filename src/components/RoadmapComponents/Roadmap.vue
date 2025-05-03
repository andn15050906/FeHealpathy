<template>
  <v-timeline align="start">
    <v-timeline-item v-for="(item, i) in timelineItems" :key="i" :dot-color="item.color" :icon="item.icon" fill-dot>
      <v-card :id="item.id ?? `roadmap-step-${i + 1}`" :class="interactive && item.color == '#28a745' ? 'glowing-roadmap-step' : ''">
        <v-card-title :style="{ backgroundColor: item.color, color: '#fff' }">{{ item.title }}</v-card-title>
        <v-card-text class="bg-white text--primary">
          <p class="roadmap-content">{{ item.content }}</p>
          <RouterLink :to="item.link">
            <v-btn :id="`roadmap-btn-${i + 1}`" :color="item.color" variant="outlined">{{ item.linkTitle ?? 'Tìm hiểu thêm' }}</v-btn>
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
  },
  interactive: {
    type: Boolean,
    required: false
  }
});
</script>

<style scoped>
.roadmap-content {
  font-size: 1.2rem; 
  margin: 10px 0; 
}

.glowing-roadmap-step {
  animation: glow 1.5s infinite alternate, scale 1.5s infinite alternate;
}

@keyframes glow {
    0% {
        box-shadow: 0 0 20px rgba(0, 123, 255, 0.8);
    }
    100% {
        box-shadow: 0 0 40px rgba(0, 123, 255, 1);
    }
}

@keyframes scale {
    0% {
        transform: scale(0.9);
    }
    100% {
        transform: scale(1);
    }
}
</style>