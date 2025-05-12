<template>
  <v-card
    class="roadmap-card h-100"
    elevation="1"
    @click="$emit('view', roadmap.id)"
  >
    <div class="position-relative">
      <v-img
        :src="roadmap.image || '/images/placeholder.jpg'"
        height="160"
        cover
      ></v-img>
      <v-chip
        v-if="roadmap.featured"
        color="warning"
        class="position-absolute"
        style="top: 10px; right: 10px"
      >
        <v-icon start size="small">mdi-star</v-icon>
        Đề xuất hàng đầu
      </v-chip>
    </div>

    <v-card-title>{{ roadmap.title }}</v-card-title>

    <v-card-subtitle class="d-flex align-center">
      <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
      {{ roadmap.steps }} bước
      <v-spacer></v-spacer>
      <span v-if="roadmap.completionRate" class="text-success">
        {{ roadmap.completionRate }}% hoàn thành
      </span>
    </v-card-subtitle>

    <v-card-text>
      <p>{{ roadmap.description }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn block color="primary" variant="tonal"> Xem chi tiết </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "RoadmapCard",
  props: {
    roadmap: {
      type: Object,
      required: true,
    },
  },
  emits: ["view"],
};
</script>

<style scoped>
.roadmap-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.roadmap-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}
</style>
