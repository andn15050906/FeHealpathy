<template>
  <v-card
    class="roadmap-card h-100"
    elevation="1"
    @click="$emit('view', roadmap.id)"
  >
    <div class="position-relative">
      <v-img
        :src="roadmap.thumbUrl || '/images/default-roadmap.jpg'"
        @error="handleImageError"
        height="200"
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
      <template v-if="isReturningUser && roadmap.completionRate">
        <span class="text-success">
          {{ roadmap.completionRate }}% hoàn thành
        </span>
      </template>
      <template v-else>
        <span class="text-primary font-italic" style="font-size:0.97rem;">
          Hành trình này dành riêng cho bạn
        </span>
      </template>
    </v-card-subtitle>

    <v-card-text>
      <p>{{ roadmap.description }}</p>
    </v-card-text>

    <v-card-actions>
      <v-btn block color="primary" variant="tonal">
        {{ isReturningUser ? 'Tiếp tục' : 'Bắt đầu hành trình' }}
      </v-btn>
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
    isReturningUser: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["view"],
  methods: {
    handleImageError(e) {
      e.target.src = '/images/default-roadmap.jpg';
    }
  }
};
</script>

<style scoped>
.roadmap-card {
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  border-radius: 12px !important;
  overflow: hidden;
  height: auto !important;
  display: flex;
  flex-direction: column;
  min-height: 420px;
}

.roadmap-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.v-card-title {
  padding: 20px 16px 10px;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
}

.v-card-subtitle {
  padding: 0 16px 16px;
}

.v-card-text {
  padding: 0 16px 20px;
  flex-grow: 1;
}

.v-card-text p {
  line-height: 1.6;
  color: #4a5568;
}

.v-card-actions {
  margin-top: auto;
  padding: 16px;
  padding-top: 0;
}
</style>
