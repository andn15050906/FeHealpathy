<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <div class="d-flex flex-column md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold text-gray-900">
            Các lộ trình sức khỏe tinh thần
          </h1>
          <p class="text-subtitle-1 text-gray-600 mt-2">
            Bạn có thể tự chọn lộ trình phù hợp, hoặc để chúng tôi đồng hành
            cùng bạn tạo nên một hành trình riêng biệt – an toàn, bảo mật và
            dành riêng cho bạn.
          </p>
        </div>
        <v-btn color="primary" prepend-icon="mdi-leaf" size="large"
          style="font-weight: 600; border-radius: 24px; min-width: 220px" @click="goToSuggestion">
          Khám phá lộ trình phù hợp cho bạn
        </v-btn>
      </div>

      <div style="
          margin-top: 8px;
          color: #43a047;
          font-style: italic;
          font-size: 0.98rem;
        ">
        Chỉ mất 1 phút để nhận lộ trình cá nhân hóa, an toàn và bảo mật tuyệt
        đối cho bạn!
      </div>

      <v-tabs v-model="activeTab" class="mb-6">
        <v-tab value="suggested">Lộ trình được đề xuất</v-tab>
        <v-tab value="all">Tất cả lộ trình</v-tab>
      </v-tabs>

      <v-window style="margin-top: -35px" v-model="activeTab">
        <v-window-item value="suggested">
          <div class="roadmap-grid">
            <RoadmapCard v-for="roadmap in suggestedRoadmaps" :key="roadmap.id" :roadmap="roadmap"
              @view="viewRoadmap" />
          </div>
        </v-window-item>

        <v-window-item value="all">
          <div class="roadmap-grid">
            <RoadmapCard v-for="roadmap in allRoadmaps" :key="roadmap.id" :roadmap="roadmap" @view="viewRoadmap" />
          </div>
        </v-window-item>
      </v-window>
    </div>
  </div>
</template>

<script>
import RoadmapCard from "@/components/Roadmap/RoadmapCard.vue";
import { getRoadmaps } from "@/scripts/api/services/roadmapService.js";

export default {
  name: "RoadmapOverview",
  components: {
    RoadmapCard,
  },
  data() {
    return {
      activeTab: "suggested",
      suggestedRoadmaps: [],
      allRoadmaps: [],
      loading: true,
      roadmapSteps: [],
    };
  },
  async created() {
    await this.fetchRoadmaps();
  },
  methods: {
    async fetchRoadmaps() {
      try {
        this.loading = true;
        const response = await getRoadmaps();

        if (Array.isArray(response)) {
          this.allRoadmaps = response;

          this.suggestedRoadmaps = response.filter(
            (roadmap) => roadmap.featured
          );

          if (this.suggestedRoadmaps.length === 0 && response.length > 0) {
            this.suggestedRoadmaps = response.slice(0, 2);
          }
        }
      } catch (error) {
        console.error("Error fetching roadmaps:", error);
      } finally {
        this.loading = false;
      }
    },
    goToSuggestion() {
      this.$router.push("/suggest");
    },
    viewRoadmap(id) {
      this.$router.push(`/roadmap/${id}`);
    },
    updateStatus() {
      alert("Status updated!");
    }
  }
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
  max-width: 1200px;
}

.roadmap-content {
  flex: 1;
  width: 100%;
  padding: 0 24px;
  box-sizing: border-box;
}

.roadmap-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px 0;
  justify-items: stretch;
}

.roadmap-content,
.roadmap-grid {
  max-width: 1500px;
  margin: 0 auto;
  justify-items: stretch;
}

@media (max-width: 700px) {
  .d-flex {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 12px !important;
  }

  .roadmap-title,
  .text-subtitle-1 {
    font-size: 1.1rem !important;
    text-align: left !important;
  }

  .healing-btn,
  .v-btn {
    min-width: 90vw !important;
    width: 100% !important;
    font-size: 1rem !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    display: block !important;
  }

  .roadmap-content {
    padding: 0 8px !important;
  }

  .roadmap-grid {
    grid-template-columns: 1fr !important;
    gap: 18px !important;
    padding: 16px 0 24px 0 !important;
    justify-items: center !important;
  }

  .roadmap-card {
    width: 95vw !important;
    min-width: unset !important;
    max-width: 400px !important;
    margin: 0 auto !important;
  }

  .v-tabs,
  .v-window {
    border-radius: 10px !important;
    padding: 0 2px !important;
  }

  .text-subtitle-1 {
    font-size: 1rem !important;
    margin-bottom: 8px !important;
  }

  .roadmap-header-box,
  .mb-6 {
    text-align: left !important;
  }

  .healing-note,
  .roadmap-note {
    font-size: 0.95rem !important;
    text-align: left !important;
    margin-top: 8px !important;
  }
}
</style>