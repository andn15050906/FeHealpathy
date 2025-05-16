<template>
  <div class="roadmap-container">
    <div class="roadmap-content">

      <v-btn variant="text" color="primary" class="mb-4" prepend-icon="mdi-arrow-left"
        @click="$router.push('/roadmaps/recommended')">
        Quay lại danh sách lộ trình
      </v-btn>

      <!-- Lời chào và động viên -->
      <div v-if="roadmap" class="healing-header mb-4">
        <h2 class="text-h5 font-weight-bold mb-1" style="color: #6a39ca">
          Chào mừng bạn đến với hành trình {{ roadmap.title }}
        </h2>
        <div class="text-body-1" style="color: #444">
          Bạn không đơn độc – chúng tôi sẽ đồng hành cùng bạn từng bước nhỏ.
          Hãy tiến triển theo nhịp độ của riêng bạn và tự hào vì đã bắt đầu
          hành trình này.
        </div>
      </div>

      <!-- Card advisor -->
      <v-card class="advisor-card mb-6 d-flex align-center" style="max-width: 420px">
        <v-avatar size="56" class="mr-3">
          <img :src="advisorImg" alt="Advisor" />
        </v-avatar>
        <div>
          <div class="font-weight-bold">TS. Nguyễn An Tâm</div>
          <div class="text-caption">Chuyên gia tâm lý trị liệu</div>
          <div class="text-body-2 mt-1" style="font-style: italic; color: #6a39ca">
            "Bạn xứng đáng được sống bình an. Hãy kiên nhẫn với chính mình."
          </div>
        </div>
        <v-spacer></v-spacer>
        <v-btn icon color="primary" class="ml-2" title="Nhắn tin cho chuyên gia (sắp ra mắt)">
          <v-icon>mdi-message-text-outline</v-icon>
        </v-btn>
        <v-btn icon color="success" class="ml-1" title="Tham gia group chat hỗ trợ (sắp ra mắt)">
          <v-icon>mdi-account-group-outline</v-icon>
        </v-btn>
      </v-card>

      <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <div v-else-if="roadmap">
        <div class="d-flex align-center mb-6">
          <h1 class="text-h4 font-weight-bold">{{ roadmap.title }}</h1>
        </div>

        <!-- Giới thiệu lộ trình -->
        <v-card class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-information-outline</v-icon>
            Giới thiệu lộ trình
          </v-card-title>
          <v-card-text>
            <div class="mb-2">
              <p v-for="(text, index) in roadmap.introText" :key="index">{{
                text
              }}</p>
            </div>
            <v-alert color="warning" variant="tonal" class="mt-4">
              <div class="d-flex align-center mb-2">
                <v-icon color="warning" class="mr-2">mdi-information-outline</v-icon>
                <span class="font-weight-bold" style="color: #ff9800; font-size: large">Lưu ý quan trọng</span>
              </div>
              <p>
                📌 Lộ trình này được thiết kế bởi các chuyên gia tâm lý với
                nhiều năm kinh nghiệm. Tuy nhiên, đây không phải là sự thay
                thế cho việc tư vấn y tế chuyên nghiệp.
                <a href="#" target="_blank" class="text-primary text-decoration-none">
                  Tìm hiểu thêm </a>.
              </p>
            </v-alert>
          </v-card-text>
        </v-card>

        <h2 class="text-h5 mb-4">Các bước trong lộ trình</h2>
        <div class="mb-6">
          <v-timeline align="start">
            <v-timeline-item v-for="(phase, index) in roadmap.phases" :key="phase.id" :dot-color="getPhaseColor(phase)"
              size="small">
              <template v-slot:opposite>
                <div class="text-caption">Bước {{ index + 1 }}</div>
              </template>
              <v-card :class="{
                'border-primary': phase.current,
                'bg-success-subtle': phase.completed,
              }">
                <v-card-title class="d-flex align-center">
                  {{ phase.title }}
                  <v-chip v-if="phase.current" color="primary" size="small" class="ml-2">
                    Hiện tại
                  </v-chip>
                  <v-chip v-if="phase.completed" color="success" size="small" class="ml-2">
                    Hoàn thành
                  </v-chip>
                </v-card-title>
                <v-card-text>
                  <p>{{ phase.description }}</p>
                  <div class="d-flex flex-wrap gap-2 mt-3">
                    <v-chip v-if="phase.videoUrl" size="small" color="primary" variant="outlined" class="mr-2">
                      <v-icon size="small" start>mdi-video</v-icon>
                      Video hướng dẫn
                    </v-chip>
                    <v-chip v-if="phase.audioUrl" size="small" color="primary" variant="outlined" class="mr-2">
                      <v-icon size="small" start>mdi-music</v-icon>
                      Âm thanh
                    </v-chip>
                    <v-chip v-if="phase.exerciseCount" size="small" color="primary" variant="outlined">
                      <v-icon size="small" start>mdi-dumbbell</v-icon>
                      {{ phase.exerciseCount }} bài tập
                    </v-chip>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn :color="phase.current ? 'success' : undefined"
                    :variant="phase.current ? 'elevated' : 'outlined'" :disabled="!phase.current && !phase.completed"
                    @click="goToPhase(phase.id)">
                    <v-icon v-if="phase.current" start>mdi-play</v-icon>
                    {{
                      phase.current
                        ? "Bắt đầu bước này"
                        : phase.completed
                          ? "Xem lại"
                          : "Đã khóa"
                    }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </div>

        <div class="text-center mb-8">
          <v-btn size="large" color="primary" prepend-icon="mdi-play" @click="startRoadmap">
            Bắt đầu lộ trình
          </v-btn>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useEventBus } from "@/scripts/logic/eventBus";
import { useRoute, useRouter } from "vue-router";
import advisorImg from "@/img/advisor.jpg";
import { roadmapDetails } from "@/scripts/data/roadmapData.js";

export default {
  name: "RoadmapDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const loading = ref(true);
    const roadmap = ref(null);
    const completedPhases = ref({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    });

    // Tạo key lưu trữ dựa trên ID lộ trình
    const getStorageKey = () => `completedPhases_roadmap_${props.id}`;

    // Lưu trạng thái hoàn thành của các phase vào localStorage
    const saveCompletedPhases = () => {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify(completedPhases.value)
      );
    };

    // Khôi phục trạng thái hoàn thành của các phase từ localStorage
    const loadCompletedPhases = () => {
      const savedPhases = localStorage.getItem(getStorageKey());
      if (savedPhases) {
        completedPhases.value = JSON.parse(savedPhases);
      } else {
        // Reset về trạng thái mặc định nếu không có dữ liệu
        resetCompletedPhases();
      }
    };

    // Reset trạng thái hoàn thành về mặc định
    const resetCompletedPhases = () => {
      completedPhases.value = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
      };
    };

    // Cập nhật trạng thái của các phase trong roadmap
    const updatePhaseStatus = () => {
      if (!roadmap.value || !roadmap.value.phases) return;

      let foundCurrent = false;

      for (const phase of roadmap.value.phases) {
        const phaseId = parseInt(phase.id);

        // Nếu phase đã hoàn thành, đánh dấu phase là đã hoàn thành
        if (completedPhases.value[phaseId]) {
          phase.completed = true;
          phase.current = false;
        } else if (!foundCurrent) {
          // Đánh dấu phase đầu tiên chưa hoàn thành là current
          phase.current = true;
          foundCurrent = true;
        } else {
          // Các phase còn lại không phải current và chưa hoàn thành
          phase.current = false;
          phase.completed = false;
        }
      }
    };

    const fetchRoadmap = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        roadmap.value = roadmapDetails[props.id === "1" ? 1 : 2] || {
          id: props.id,
          title: "Lộ trình không tồn tại",
          description: "Không tìm thấy lộ trình này",
          progress: 0,
          introText: ["Không có thông tin về lộ trình này."],
          phases: []
        };

        // Cập nhật trạng thái phase dựa trên completedPhases
        updatePhaseStatus();

        loading.value = false;
      }, 1000);
    };

    const getPhaseColor = (phase) => {
      if (phase.completed) {
        return "success";
      }
      if (phase.current) {
        return "primary";
      }
      return "grey";
    };

    const startRoadmap = () => {
      const currentPhase = roadmap.value.phases.find((phase) => phase.current);
      if (currentPhase) {
        goToPhase(currentPhase.id);
      }
    };

    const goToPhase = (phaseId) => {
      router.push(`/roadmap/${roadmap.value.id}/phase/${phaseId}`);
    };

    // Sử dụng event bus
    const eventBus = useEventBus();

    // Lắng nghe sự kiện cập nhật từ StepDetail
    const handleUpdateRoadmapPhases = (data) => {
      // Chỉ cập nhật nếu sự kiện thuộc về lộ trình hiện tại
      if (data.roadmapId === props.id) {
        console.log(
          `Received update for roadmap ${data.roadmapId}:`,
          data.phases
        );
        completedPhases.value = data.phases;
        saveCompletedPhases();
        updatePhaseStatus();
      }
    };

    onMounted(() => {
      loadCompletedPhases();
      fetchRoadmap();

      // Đăng ký lắng nghe sự kiện
      eventBus.on("update-roadmap-phases", handleUpdateRoadmapPhases);
      console.log(
        `RoadmapDetail mounted for roadmap ${props.id}, eventBus listener registered`
      );
    });

    onBeforeUnmount(() => {
      // Hủy đăng ký sự kiện
      eventBus.off("update-roadmap-phases", handleUpdateRoadmapPhases);
      console.log(
        `RoadmapDetail unmounted for roadmap ${props.id}, eventBus listener removed`
      );
    });

    return {
      loading,
      roadmap,
      completedPhases,
      getPhaseColor,
      startRoadmap,
      goToPhase,
      advisorImg,
    };
  },
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
}

.roadmap-content {
  flex: 1;
  width: 100%;
  padding: 0 40px;
}

.border-primary {
  border: 2px solid #6a39ca !important;
}

.bg-success-subtle {
  background-color: #f0fff4 !important;
}

.v-alert-title {
  display: inline-block !important;
  vertical-align: middle;
  margin-bottom: 0 !important;
}

/* Advisor card styling */
.advisor-card {
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6a39ca;
}

/* Healing header styling */
.healing-header {
  background: linear-gradient(to right,
      rgba(106, 57, 202, 0.05),
      rgba(106, 57, 202, 0.01));
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 4px solid #6a39ca;
}
</style>
