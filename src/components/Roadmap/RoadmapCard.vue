<template>
  <v-card
    class="roadmap-card h-100"
    elevation="1"
    @click="handleRoadmapClick"
  >
    <div class="position-relative">
      <v-img
        :src="roadmap.thumbUrl || '/images/default-roadmap.jpg'"
        @error="handleImageError"
        height="200"
        cover
      ></v-img>
      <div class="position-absolute" style="top: 10px; right: 10px">
        <v-chip
          v-if="roadmap.featured"
          color="warning"
          class="mb-2"
        >
          <v-icon start size="small">mdi-star</v-icon>
          Đề xuất hàng đầu
        </v-chip>
        <v-chip
          v-if="roadmap.price > 0"
          color="primary"
          class="price-tag"
        >
          <v-icon start size="small">mdi-cash</v-icon>
          {{ formatPrice(roadmap.price) }}
        </v-chip>
      </div>
    </div>

    <v-card-title>{{ roadmap.title }}</v-card-title>

    <v-card-subtitle class="d-flex align-center">
      <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
      {{ roadmap.phases?.length || 0 }} giai đoạn
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
      <v-btn block :color="roadmap.price > 0 ? 'success' : 'primary'" variant="tonal">
        <v-icon start size="small" v-if="roadmap.price > 0">mdi-lock</v-icon>
        {{ getActionButtonText }}
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
  data() {
    return {
      showPaymentDialog: false
    }
  },
  computed: {
    getActionButtonText() {
      if (this.roadmap.price > 0) {
        return this.isReturningUser ? 'Tiếp tục' : 'Xem chi tiết';
      }
      return this.isReturningUser ? 'Tiếp tục' : 'Bắt đầu hành trình';
    }
  },
  methods: {
    handleImageError(e) {
      e.target.src = '/images/default-roadmap.jpg';
    },
    formatPrice(price) {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    },
    handleRoadmapClick() {
      if (this.roadmap.price > 0 && !this.isReturningUser) {
        // Nếu là lộ trình trả phí và chưa mua
        this.$router.push(`/roadmap/${this.roadmap.id}`);
      } else {
        // Nếu là lộ trình miễn phí hoặc đã mua
        this.$router.push(`/roadmap/${this.roadmap.id}`);
      }
    },
    proceedToPayment() {
      this.showPaymentDialog = false;
      this.$router.push(`/payment/roadmap/${this.roadmap.id}`);
    }
  },
  emits: ["view"]
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

.price-tag {
  margin-left: 8px;
}

.price-section {
  text-align: center;
  margin: 20px 0;
}

.price {
  font-size: 24px;
  font-weight: bold;
  color: #2196F3;
}

.vat {
  font-size: 14px;
  color: #666;
  margin-left: 8px;
}

.features ul {
  list-style-type: none;
  padding: 0;
}

.features li {
  padding: 8px 0;
  display: flex;
  align-items: center;
}

.features li:before {
  content: "✓";
  color: #4CAF50;
  margin-right: 8px;
  font-weight: bold;
}
</style>
