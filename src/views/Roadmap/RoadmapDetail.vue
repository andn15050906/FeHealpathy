<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <v-container fluid class="pt-16">
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="$router.push('/overview')"
        >
          Quay lại danh sách lộ trình
        </v-btn>

        <div
          v-if="loading"
          class="d-flex justify-center align-center"
          style="height: 400px"
        >
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          ></v-progress-circular>
        </div>

        <div v-else-if="roadmap">
          <div class="d-flex align-center mb-6">
            <h1 class="text-h4 font-weight-bold">{{ roadmap.title }}</h1>
          </div>

          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2"
                >mdi-information-outline</v-icon
              >
              Giới thiệu
            </v-card-title>
            <v-card-text>
              <div
                v-for="(text, index) in roadmap.introText"
                :key="index"
                class="mb-2"
              >
                <p>{{ text }}</p>
              </div>

              <v-alert color="warning" variant="tonal" class="mt-4">
                <div class="d-flex align-center mb-2">
                  <v-icon color="warning" class="mr-2"
                    >mdi-information-outline</v-icon
                  >
                  <span
                    class="font-weight-bold"
                    style="color: #ff9800; font-size: large"
                    >Lưu ý quan trọng</span
                  >
                </div>
                <p>
                  📌 <b>Liệu pháp Nhận thức Hành vi (CBT)</b> đã được nhiều hiệp
                  hội chuyên môn, đặc biệt là
                  <b>Hiệp hội Tâm lý học Hoa Kỳ (APA)</b>, công nhận là một
                  trong những liệu pháp tâm lý hiệu quả nhất.
                  <a
                    href="https://www.radiashealth.org/what-is-cognitive-behavioral-therapy/"
                    target="_blank"
                    class="text-primary text-decoration-none"
                  >
                    Tìm hiểu thêm
                  </a>
                  .
                </p>
              </v-alert>
            </v-card-text>
          </v-card>

          <h2 class="text-h5 mb-4">Các bước trong lộ trình</h2>
          <div class="mb-6">
            <v-timeline align="start">
              <v-timeline-item
                v-for="(step, index) in roadmap.steps"
                :key="step.id"
                :dot-color="getStepColor(step)"
                size="small"
              >
                <template v-slot:opposite>
                  <div class="text-caption">Bước {{ index + 1 }}</div>
                </template>
                <v-card
                  :class="{
                    'border-primary': step.current,
                    'bg-success-subtle': step.completed,
                  }"
                >
                  <v-card-title class="d-flex align-center">
                    {{ step.title }}
                    <v-chip
                      v-if="step.current"
                      color="primary"
                      size="small"
                      class="ml-2"
                    >
                      Hiện tại
                    </v-chip>
                    <v-chip
                      v-if="step.completed"
                      color="success"
                      size="small"
                      class="ml-2"
                    >
                      Hoàn thành
                    </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <p>{{ step.description }}</p>
                    <div
                      v-if="step.videoUrl"
                      class="d-flex align-center mt-2 text-primary"
                    >
                      <v-icon size="small" class="mr-1">mdi-video</v-icon>
                      <span class="text-caption">Có hướng dẫn video</span>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      :color="step.current ? 'success' : undefined"
                      :variant="step.current ? 'elevated' : 'outlined'"
                      :disabled="!step.current && !step.completed"
                      @click="goToStep(step.id)"
                    >
                      <v-icon v-if="step.current" start>mdi-play</v-icon>
                      {{
                        step.current
                          ? "Bắt đầu bước này"
                          : step.completed
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
            <v-btn
              size="large"
              color="primary"
              prepend-icon="mdi-play"
              @click="startRoadmap"
            >
              Bắt đầu lộ trình
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import { roadmapSteps } from "@/scripts/data/roadmapData.js";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useEventBus } from "../../scripts/logic/evenBus";
import { useRoute, useRouter } from "vue-router";

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

    // Cấu trúc của roadmap
    const phaseStructure = {
      1: {
        // Phase 1
        name: "Nhận thức và Hiểu biết",
        steps: ["1"],
        nextPhase: 2,
      },
      2: {
        // Phase 2
        name: "Giảm nhẹ tức thì",
        steps: ["2"],
        nextPhase: 3,
      },
      3: {
        // Phase 3
        name: "Ổn định tâm trí",
        steps: ["3"],
        nextPhase: 4,
      },
      4: {
        // Phase 4
        name: "Đối mặt với vấn đề",
        steps: ["4"],
        nextPhase: 5,
      },
      5: {
        // Phase 5
        name: "Đánh giá và Duy trì",
        steps: ["5"],
        nextPhase: null,
      },
    };

    // Khôi phục trạng thái hoàn thành của các phase từ localStorage
    const loadCompletedPhases = () => {
      const savedPhases = localStorage.getItem("completedPhases");
      if (savedPhases) {
        completedPhases.value = JSON.parse(savedPhases);
      }
    };

    // Lưu trạng thái hoàn thành của các phase vào localStorage
    const saveCompletedPhases = () => {
      localStorage.setItem(
        "completedPhases",
        JSON.stringify(completedPhases.value)
      );
    };

    // Cập nhật trạng thái của các step trong roadmap
    const updateStepStatus = () => {
      if (!roadmap.value || !roadmap.value.steps) return;

      let foundCurrent = false;

      for (const step of roadmap.value.steps) {
        const phaseId = step.phaseId;

        // Nếu phase đã hoàn thành, đánh dấu step là đã hoàn thành
        if (completedPhases.value[phaseId]) {
          step.completed = true;
          step.current = false;
        } else if (!foundCurrent) {
          // Đánh dấu step đầu tiên chưa hoàn thành là current
          step.current = true;
          foundCurrent = true;
        } else {
          // Các step còn lại không phải current và chưa hoàn thành
          step.current = false;
          step.completed = false;
        }
      }
    };

    const fetchRoadmap = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        roadmap.value = {
          id: props.id,
          title: props.id === "1" ? "Vượt qua lo âu" : "Xây dựng sự tự tin",
          description:
            "Học cách nhận biết và vượt qua các triệu chứng lo âu phổ biến",
          progress: 0,
          introText: [
            "Lộ trình này được thiết kế dựa trên Liệu pháp Nhận thức Hành vi (CBT), một phương pháp đã được chứng minh hiệu quả trong điều trị lo âu.",
            "Trong quá trình này, bạn sẽ học cách nhận diện những suy nghĩ tiêu cực, thách thức chúng và thay thế bằng những suy nghĩ tích cực hơn.",
            "Mỗi bước trong lộ trình sẽ giúp bạn xây dựng các kỹ năng cần thiết để quản lý lo âu hiệu quả và cải thiện sức khỏe tinh thần tổng thể.",
          ],
          steps: [
            {
              id: "1",
              title: "Nhận diện vấn đề",
              description:
                "Nhận biết các triệu chứng lo âu và hiểu nguồn gốc của chúng",
              videoUrl: "/videos/step1.mp4",
              completed: false,
              current: true,
              phaseId: 1,
            },
            {
              id: "2",
              title: "Giảm nhẹ tức thì",
              description:
                "Học các kỹ thuật thư giãn nhanh để giảm lo âu trong tình huống khẩn cấp",
              videoUrl: "/videos/step2.mp4",
              completed: false,
              current: false,
              phaseId: 2,
            },
            {
              id: "3",
              title: "Ổn định tâm trí",
              description:
                "Thực hành chánh niệm và các bài tập thiền để ổn định tâm trí",
              videoUrl: "/videos/step3.mp4",
              completed: false,
              current: false,
              phaseId: 3,
            },
            {
              id: "4",
              title: "Đối mặt với vấn đề",
              description:
                "Phát triển chiến lược để đối mặt với các tình huống gây lo âu",
              videoUrl: "/videos/step4.mp4",
              completed: false,
              current: false,
              phaseId: 4,
            },
            {
              id: "5",
              title: "Đánh giá & Duy trì",
              description:
                "Đánh giá tiến độ và xây dựng kế hoạch duy trì lâu dài",
              videoUrl: "/videos/step5.mp4",
              completed: false,
              current: false,
              phaseId: 5,
            },
          ],
        };

        // Cập nhật trạng thái step dựa trên completedPhases
        updateStepStatus();

        loading.value = false;
      }, 1000);
    };

    const getStepColor = (step) => {
      if (step.completed) {
        return "success";
      }
      if (step.current) {
        return "primary";
      }
      return "grey";
    };

    const startRoadmap = () => {
      const currentStep = roadmap.value.steps.find((step) => step.current);
      if (currentStep) {
        goToStep(currentStep.id);
      }
    };

    const goToStep = (stepId) => {
      router.push(`/roadmap/${roadmap.value.id}/step/${stepId}`);
    };

    const goToSuggestion = () => {
      router.push("/suggest");
    };

    const updateStatus = () => {
      // In a real app, this would update the user's status
      alert("Status updated!");
    };

    // Sử dụng event bus
    const eventBus = useEventBus();

    // Lắng nghe sự kiện cập nhật từ StepDetail
    const handleUpdateRoadmapPhases = (phases) => {
      completedPhases.value = phases;
      saveCompletedPhases();
      updateStepStatus();
    };

    onMounted(() => {
      loadCompletedPhases();
      fetchRoadmap();

      // Đăng ký lắng nghe sự kiện
      eventBus.on("update-roadmap-phases", handleUpdateRoadmapPhases);
    });

    onBeforeUnmount(() => {
      // Hủy đăng ký sự kiện
      eventBus.off("update-roadmap-phases", handleUpdateRoadmapPhases);
    });

    return {
      loading,
      roadmap,
      completedPhases,
      phaseStructure,
      getStepColor,
      startRoadmap,
      goToStep,
      goToSuggestion,
      updateStatus,
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
  padding: 0 40px; /* Thêm padding để nội dung không sát cạnh */
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
</style>
