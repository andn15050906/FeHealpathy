<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <v-container fluid class="pt-16">
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="$router.push(`/roadmap/${roadmapId}`)"
        >
          Quay lại lộ trình
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

        <div v-else-if="step">
          <div
            class="d-flex flex-column md:flex-row justify-space-between align-start mb-6"
          >
            <div>
              <h1 class="text-h4 font-weight-bold">{{ step.title }}</h1>
              <p class="text-subtitle-1 text-grey-darken-1">{{
                step.description
              }}</p>
            </div>

            <div class="mood-selector mt-4 md:mt-0">
              <p class="text-subtitle-2 mb-2">Hôm nay bạn cảm thấy thế nào?</p>
              <div class="d-flex">
                <v-btn
                  v-for="emoji in ['😔', '😐', '🙂', '😊']"
                  :key="emoji"
                  :variant="mood === emoji ? 'elevated' : 'outlined'"
                  :color="mood === emoji ? 'primary' : undefined"
                  class="mx-1"
                  @click="mood = emoji"
                >
                  {{ emoji }}
                </v-btn>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex align-center mb-2">
              <p class="text-body-2 text-grey-darken-1 mr-2">Tiến độ bước:</p>
              <v-progress-linear
                :model-value="step.progress"
                color="primary"
                height="8"
                class="flex-grow-1"
              ></v-progress-linear>
              <span class="ml-2 text-body-2">{{ step.progress }}%</span>
            </div>
          </div>

          <v-tabs v-model="activeTab" class="mb-6">
            <v-tab value="overview">Tổng quan</v-tab>
            <v-tab value="actions">
              Hành động ({{ completedActionsCount }}/{{ step.actions.length }})
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="overview">
              <div class="step-tab-wrapper">
                <v-card class="mb-6">
                  <v-card-title>Giới thiệu bước</v-card-title>
                  <v-card-text>
                    <p class="text-body-1 mb-4">
                      {{ getStepIntroduction() }}
                    </p>

                    <div v-if="step.videoUrl" class="mt-6">
                      <h3 class="text-h6 mb-2">Hướng dẫn video</h3>
                      <div
                        class="video-placeholder d-flex justify-center align-center"
                      >
                        <v-btn
                          icon="mdi-play"
                          color="primary"
                          size="x-large"
                          variant="flat"
                        ></v-btn>
                      </div>
                    </div>

                    <div
                      v-if="step.requireConfirmation"
                      class="mt-6 pa-4 bg-primary-lighten-5 rounded"
                    >
                      <h3 class="text-h6 text-primary-darken-1 mb-2"
                        >Xác nhận vấn đề</h3
                      >
                      <p class="text-primary-darken-2 mb-4">
                        Bước đầu tiên để giải quyết vấn đề là thừa nhận sự tồn tại
                        của nó. Vui lòng xác nhận rằng bạn đang gặp phải vấn đề
                        này và sẵn sàng làm việc để cải thiện nó.
                      </p>

                      <v-radio-group v-model="confirmation">
                        <v-radio
                          label="Tôi thừa nhận đây là vấn đề của tôi và muốn cải thiện"
                          value="acknowledge"
                          color="primary"
                        ></v-radio>
                        <v-radio
                          label="Tôi chưa sẵn sàng đối mặt với vấn đề này"
                          value="notReady"
                          color="primary"
                        ></v-radio>
                      </v-radio-group>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-window-item>

            <v-window-item value="actions">
              <div class="step-tab-wrapper">
                <v-row>
                  <v-col
                    v-for="action in step.actions"
                    :key="action.id"
                    cols="12"
                    md="6"
                  >
                    <v-card :class="{ 'bg-success-subtle': action.completed }">
                      <v-card-title
                        class="d-flex justify-space-between align-center"
                      >
                        {{ action.title }}
                        <v-chip
                          :color="action.required ? 'error' : 'primary'"
                          size="small"
                        >
                          {{ action.required ? "Bắt buộc" : "Tùy chọn" }}
                        </v-chip>
                      </v-card-title>
                      <v-card-subtitle class="d-flex align-center">
                        <v-icon size="small" class="mr-1"
                          >mdi-clock-outline</v-icon
                        >
                        {{ action.duration }}
                      </v-card-subtitle>
                      <v-card-text>
                        <p>{{ action.description }}</p>

                        <div
                          v-if="action.moodTags && action.moodTags.length > 0"
                          class="mt-2"
                        >
                          <v-chip
                            v-for="tag in action.moodTags"
                            :key="tag"
                            size="small"
                            color="accent"
                            class="mr-1 mb-1"
                            variant="outlined"
                          >
                            {{ tag }}
                          </v-chip>
                        </div>
                      </v-card-text>
                      <v-card-actions class="d-flex justify-space-between">
                        <v-btn
                          variant="text"
                          size="small"
                          @click="viewActionDetails(action)"
                        >
                          Chi tiết
                        </v-btn>

                        <v-checkbox
                          v-model="action.completed"
                          :label="
                            action.completed
                              ? 'Đã hoàn thành'
                              : 'Đánh dấu hoàn thành'
                          "
                          hide-details
                          density="compact"
                          @change="updateProgress"
                        ></v-checkbox>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>

                <v-card v-if="showSkipConfirm" class="mt-6 bg-warning-lighten-5">
                  <v-card-title>Bạn có muốn bỏ qua bước này không?</v-card-title>
                  <v-card-subtitle>
                    Vui lòng cho chúng tôi biết lý do để chúng tôi có thể cải
                    thiện trải nghiệm của bạn
                  </v-card-subtitle>
                  <v-card-text>
                    <v-radio-group v-model="skipReason">
                      <v-radio
                        label="Tôi cảm thấy tốt hôm nay, không cần thực hiện bước này"
                        value="feelGood"
                        color="warning"
                      ></v-radio>
                      <v-radio
                        label="Bước này không liên quan đến tôi"
                        value="notRelevant"
                        color="warning"
                      ></v-radio>
                      <v-radio
                        label="Tôi không có đủ thời gian ngay bây giờ"
                        value="noTime"
                        color="warning"
                      ></v-radio>
                    </v-radio-group>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn variant="text" @click="showSkipConfirm = false">
                      Hủy
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="warning"
                      @click="confirmSkip"
                      :disabled="!skipReason"
                    >
                      Xác nhận bỏ qua
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </v-window-item>
          </v-window>

          <div class="d-flex justify-space-between mt-8">
            <v-btn
              v-if="step.canSkip && !showSkipConfirm"
              variant="outlined"
              @click="showSkipConfirm = true"
            >
              Bỏ qua bước này
            </v-btn>
            <div v-else></div>

            <v-btn
              size="large"
              :color="canContinue ? 'success' : 'primary'"
              :disabled="!canContinue"
              @click="continueToNextStep"
            >
              <v-icon start>{{
                step.isLast ? "mdi-check-circle" : "mdi-arrow-right"
              }}</v-icon>
              {{ step.isLast ? "Hoàn thành lộ trình" : "Tiếp tục" }}
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
    
    <!-- Dialog đánh giá cuối phase -->
    <PhaseCompletionDialog
      :show="showPhaseCompletion"
      :phase-id="currentPhaseId"
      :phase-title="currentPhaseTitle"
      :documents="phaseDocuments"
      :criteria-list="phaseCriteria"
      @close="showPhaseCompletion = false"
      @submit="submitPhaseEvaluation"
    />
  </div>
</template>

<script>
import { roadmapSteps } from "@/scripts/data/roadmapData.js";
import PhaseCompletionDialog from "@/components/Roadmap/PhaseCompletionDialog.vue";

export default {
  name: "StepDetail",
  components: {
    PhaseCompletionDialog
  },
  props: {
    roadmapId: {
      type: String,
      required: true,
    },
    stepId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      roadmapSteps,
      step: null,
      activeTab: "overview",
      mood: null,
      confirmation: null,
      skipReason: null,
      showSkipConfirm: false,
      
      // Dữ liệu cho PhaseCompletionDialog
      showPhaseCompletion: false,
      currentPhaseId: "phase1",
      currentPhaseTitle: "Nhận thức và Hiểu biết",
      phaseDocuments: [
        { title: "Hiểu về lo âu và các triệu chứng", url: "/docs/anxiety-symptoms" },
        { title: "Kỹ thuật thở để giảm lo âu", url: "/docs/breathing-techniques" },
        { title: "Nhận diện và thách thức suy nghĩ tiêu cực", url: "/docs/negative-thoughts" }
      ],
      phaseCriteria: [
        { 
          title: "Nhận diện triệu chứng", 
          description: "Bạn có thể nhận diện được các triệu chứng lo âu của mình" 
        },
        { 
          title: "Hiểu nguồn gốc", 
          description: "Bạn hiểu được nguồn gốc của lo âu và các yếu tố kích hoạt" 
        },
        { 
          title: "Áp dụng kỹ thuật", 
          description: "Bạn đã thử và áp dụng được ít nhất một kỹ thuật giảm lo âu" 
        }
      ]
    };
  },
  computed: {
    completedActionsCount() {
      if (!this.step) return 0;
      return this.step.actions.filter((action) => action.completed).length;
    },
    canContinue() {
      if (!this.step) return false;

      if (this.step.requireConfirmation) {
        return this.confirmation === "acknowledge";
      }

      const requiredActions = this.step.actions.filter(
        (action) => action.required
      );
      return requiredActions.every((action) => action.completed);
    },
    isLastMilestoneInPhase() {
      // Hardcode: giả sử milestone id 3 là milestone cuối cùng trong phase
      return this.stepId === "3";
    }
  },
  mounted() {
    this.fetchStepDetails();
  },
  methods: {
    getStepIntroduction() {
      if (this.stepId === "1") {
        return "Bước đầu tiên để vượt qua lo âu là nhận diện và thừa nhận vấn đề. Trong bước này, bạn sẽ học cách nhận biết các triệu chứng lo âu, hiểu nguồn gốc của chúng và tác động của chúng đến cuộc sống hàng ngày của bạn.";
      } else {
        return "Sau khi đã nhận diện vấn đề, bước tiếp theo là học các kỹ thuật giảm nhẹ tức thì. Những kỹ thuật này sẽ giúp bạn đối phó với các tình huống gây lo âu và giảm triệu chứng ngay lập tức.";
      }
    },
    fetchStepDetails() {
      // In a real app, this would be an API call
      setTimeout(() => {
        this.step = {
          id: this.stepId,
          roadmapId: this.roadmapId,
          title: this.stepId === "1" ? "Nhận diện vấn đề" : "Giảm nhẹ tức thì",
          description:
            this.stepId === "1"
              ? "Nhận biết các triệu chứng lo âu và hiểu nguồn gốc của chúng"
              : "Học các kỹ thuật thư giãn nhanh để giảm lo âu trong tình huống khẩn cấp",
          videoUrl: "/videos/step1.mp4",
          actions: [
            {
              id: "1",
              title: "Nhật ký cảm xúc",
              description:
                "Ghi lại các tình huống gây lo âu và cảm xúc của bạn",
              duration: "10 phút",
              completed: false,
              required: true,
              moodTags: ["Tốt khi buồn", "Hữu ích cho lo âu"],
            },
            {
              id: "2",
              title: "Bài tập thở sâu",
              description: "Thực hành kỹ thuật thở sâu để giảm lo âu",
              duration: "5 phút",
              completed: false,
              required: false,
              moodTags: ["Giảm nhẹ nhanh", "Cho stress tức thì"],
            },
            {
              id: "3",
              title: "Phân tích suy nghĩ",
              description: "Nhận diện và thách thức suy nghĩ tiêu cực",
              duration: "15 phút",
              completed: false,
              required: true,
              moodTags: ["Cho suy nghĩ quá mức", "Làm rõ tâm trí"],
            },
          ],
          progress: 0,
          isFirst: this.stepId === "1",
          isLast: this.stepId === "5",
          nextStepId: this.getNextStepId(),
          canSkip: this.stepId !== "4",
          requireConfirmation: this.stepId === "1",
        };
        this.loading = false;
      }, 1000);
    },
    getNextStepId() {
      const currentId = parseInt(this.stepId);
      return currentId < 5 ? (currentId + 1).toString() : undefined;
    },
    updateProgress() {
      if (!this.step) return;

      const completedCount = this.step.actions.filter(
        (a) => a.completed
      ).length;
      this.step.progress = Math.round(
        (completedCount / this.step.actions.length) * 100
      );
    },
    viewActionDetails(action) {
      // In a real app, this would open a detailed view of the action
      alert(`Chi tiết hành động: ${action.title}\n\n${action.description}`);
    },
    confirmSkip() {
      if (!this.skipReason) return;

      // In a real app, this would send the skip reason to the API
      if (this.step.nextStepId) {
        this.$router.push(
          `/roadmap/${this.roadmapId}/step/${this.step.nextStepId}`
        );
      } else {
        this.$router.push(`/roadmap/${this.roadmapId}/complete`);
      }
    },
    continueToNextStep() {
      if (!this.canContinue) return;

      // Nếu đây là milestone cuối cùng trong phase, hiển thị dialog đánh giá phase
      if (this.isLastMilestoneInPhase) {
        this.showPhaseCompletion = true;
      } else {
        // Nếu không, chuyển đến milestone tiếp theo
        if (this.step.nextStepId) {
          this.$router.push(
            `/roadmap/${this.roadmapId}/step/${this.step.nextStepId}`
          );
        } else {
          this.$router.push(`/roadmap/${this.roadmapId}/complete`);
        }
      }
    },
    submitPhaseEvaluation(evaluationData) {
      // Đóng dialog
      this.showPhaseCompletion = false;
      
      // Chuyển đến milestone tiếp theo hoặc trang hoàn thành
      if (evaluationData.moveToNextPhase === "yes") {
        if (this.step.nextStepId) {
          this.$router.push(
            `/roadmap/${this.roadmapId}/step/${this.step.nextStepId}`
          );
        } else {
          this.$router.push(`/roadmap/${this.roadmapId}/complete`);
        }
      } else if (evaluationData.moveToNextPhase === "review") {
        // Quay lại trang roadmap detail
        this.$router.push(`/roadmap/${this.roadmapId}`);
      } else {
        // Tạm dừng lộ trình, quay về trang chủ
        this.$router.push("/");
      }
    },
    goToSuggestion() {
      this.$router.push("/suggest");
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
  margin-left: 320px; /* Thêm margin-left bằng với chiều rộng của sidebar */
}

.roadmap-content {
  flex: 1;
  width: 100%;
  padding: 0 40px; /* Thêm padding để nội dung không sát cạnh */
}

.video-placeholder {
  background-color: #f0f0f0;
  height: 300px;
  border-radius: 8px;
}

.bg-success-subtle {
  background-color: #f0fff4 !important;
}

.step-tab-wrapper {
  max-width: 1300px;
  min-width: 1300px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}
</style>