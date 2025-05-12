<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <v-container fluid class="pt-16" style="margin-top: 15px;">
        <div
          class="d-flex flex-column md:flex-row md:items-center md:justify-between gap-4 mb-6"
        >
          <div>
            <h1 class="text-h4 font-weight-bold text-gray-900">
              Các lộ trình sức khỏe tinh thần
            </h1>
            <p class="text-subtitle-1 text-gray-600 mt-2">
              Chọn một lộ trình hoặc để chúng tôi gợi ý cho bạn
            </p>
          </div>
          <v-btn
            color="primary"
            prepend-icon="mdi-lightbulb-outline"
            size="large"
            @click="goToSuggestion"
          >
            Gợi ý lộ trình
          </v-btn>
        </div>

        <v-tabs v-model="activeTab" class="mb-6">
          <v-tab value="suggested">Lộ trình được đề xuất</v-tab>
          <v-tab value="all">Tất cả lộ trình</v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="suggested">
            <div class="roadmap-grid">
              <RoadmapCard
                v-for="roadmap in suggestedRoadmaps"
                :key="roadmap.id"
                :roadmap="roadmap"
                @view="viewRoadmap"
              />
            </div>
          </v-window-item>

          <v-window-item value="all">
            <div class="roadmap-grid">
              <RoadmapCard
                v-for="roadmap in allRoadmaps"
                :key="roadmap.id"
                :roadmap="roadmap"
                @view="viewRoadmap"
              />
            </div>
          </v-window-item>
        </v-window>
      </v-container>
    </div>
  </div>
</template>

<script>
import RoadmapCard from "@/components/Roadmap/RoadmapCard.vue";
import { roadmapSteps } from "@/scripts/data/roadmapData.js";

export default {
  name: "RoadmapOverview",
  components: {
    RoadmapCard,
  },
  data() {
    return {
      activeTab: "suggested",
      roadmapSteps,
      suggestedRoadmaps: [
        {
          id: "1",
          title: "Vượt qua lo âu",
          description:
            "Học cách nhận biết và vượt qua các triệu chứng lo âu phổ biến",
          steps: 5,
          category: "anxiety",
          featured: true,
          completionRate: 78,
          image: "/images/anxiety.jpg",
        },
        {
          id: "2",
          title: "Xây dựng sự tự tin",
          description:
            "Phát triển sự tự tin và khả năng đối mặt với thử thách mới",
          steps: 4,
          category: "confidence",
          featured: true,
          completionRate: 85,
          image: "/images/confidence.jpg",
        },
      ],
      allRoadmaps: [
        {
          id: "1",
          title: "Vượt qua lo âu",
          description:
            "Học cách nhận biết và vượt qua các triệu chứng lo âu phổ biến",
          steps: 5,
          category: "anxiety",
          featured: true,
          completionRate: 78,
          image: "/images/anxiety.jpg",
        },
        {
          id: "2",
          title: "Xây dựng sự tự tin",
          description:
            "Phát triển sự tự tin và khả năng đối mặt với thử thách mới",
          steps: 4,
          category: "confidence",
          featured: true,
          completionRate: 85,
          image: "/images/confidence.jpg",
        },
        {
          id: "3",
          title: "Kiểm soát cảm xúc",
          description: "Học cách nhận biết và điều chỉnh cảm xúc tiêu cực",
          steps: 3,
          category: "emotions",
          featured: false,
          completionRate: 62,
          image: "/images/emotions.jpg",
        },
        {
          id: "4",
          title: "Cân bằng công việc - cuộc sống",
          description: "Tạo sự cân bằng giữa công việc và cuộc sống cá nhân",
          steps: 4,
          category: "work-life",
          featured: false,
          completionRate: 70,
          image: "/images/balance.jpg",
        },
        {
          id: "5",
          title: "Giấc ngủ chất lượng",
          description: "Phương pháp giúp ngủ ngon và sâu giấc",
          steps: 3,
          category: "sleep",
          featured: false,
          completionRate: 90,
          image: "/images/sleep.jpg",
        },
      ],
    };
  },
  methods: {
    goToSuggestion() {
      this.$router.push("/suggest");
    },
    viewRoadmap(id) {
      this.$router.push(`/roadmap/${id}`);
    },
    updateStatus() {
      // In a real app, this would update the user's status
      alert("Status updated!");
    },
  },
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
  width: calc(100% - 320px); /* Trừ đi chiều rộng của sidebar */
  margin-left: 320px;
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

.roadmap-content, .roadmap-grid {
  max-width: 1800px;
  margin: 0 auto;
  justify-items: stretch;
}

</style>
