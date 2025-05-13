<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <v-container fluid class="pt-16">
        <v-btn variant="text" color="primary" class="mb-4" prepend-icon="mdi-arrow-left"
          @click="$router.push(`/roadmap/${roadmapId}`)">
          Quay lại lộ trình
        </v-btn>

        <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
          <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
        </div>

        <div v-else-if="step">
          <div class="d-flex flex-column md:flex-row justify-space-between align-start mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">{{ step.title }}</h1>
              <p class="text-subtitle-1 text-grey-darken-1">{{
                step.description
              }}</p>
              <div class="d-flex align-center mt-2">
                <v-chip color="primary">Phase {{ currentPhase }}</v-chip>
                <v-chip color="secondary" class="ml-2">Bước {{ stepId }}/{{ totalStepsInPhase }}</v-chip>
              </div>
            </div>

            <div class="mood-selector mt-4 md:mt-0">
              <p class="text-subtitle-2 mb-2">Hôm nay bạn cảm thấy thế nào?</p>
              <div class="d-flex">
                <v-btn v-for="emoji in ['😔', '😐', '🙂', '😊']" :key="emoji"
                  :variant="mood === emoji ? 'elevated' : 'outlined'" :color="mood === emoji ? 'primary' : undefined"
                  class="mx-1" @click="mood = emoji">
                  {{ emoji }}
                </v-btn>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="d-flex align-center mb-2">
              <p class="text-body-2 text-grey-darken-1 mr-2">Tiến độ bước:</p>
              <v-progress-linear :model-value="step.progress" color="primary" height="8"
                class="flex-grow-1"></v-progress-linear>
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
                <v-card class="mb-6" :color="step.themeColor + '-lighten-5'">
                  <v-card-title>Giới thiệu bước</v-card-title>
                  <v-card-text>
                    <p class="text-body-1 mb-4">
                      {{ step.introduction }}
                    </p>

                    <div v-if="step.videoUrl" class="mt-6">
                      <h3 class="text-h6 mb-2">Hướng dẫn video</h3>
                      <div class="video-placeholder d-flex justify-center align-center"
                        :style="{ backgroundColor: step.themeColor + '-lighten-4' }">
                        <v-btn icon="mdi-play" :color="step.themeColor" size="x-large" variant="flat"></v-btn>
                      </div>
                    </div>

                    <div v-if="step.requireConfirmation" class="mt-6 pa-4 bg-primary-lighten-5 rounded">
                      <h3 class="text-h6 text-primary-darken-1 mb-2">Xác nhận vấn đề</h3>
                      <p class="text-primary-darken-2 mb-4">
                        Bước đầu tiên để giải quyết vấn đề là thừa nhận sự tồn tại
                        của nó. Vui lòng xác nhận rằng bạn đang gặp phải vấn đề
                        này và sẵn sàng làm việc để cải thiện nó.
                      </p>

                      <v-radio-group v-model="confirmation">
                        <v-radio label="Tôi thừa nhận đây là vấn đề của tôi và muốn cải thiện" value="acknowledge"
                          color="primary"></v-radio>
                        <v-radio label="Tôi chưa sẵn sàng đối mặt với vấn đề này" value="notReady"
                          color="primary"></v-radio>
                      </v-radio-group>
                    </div>

                    <div v-if="step.tips && step.tips.length > 0" class="mt-6">
                      <h3 class="text-h6 mb-3">Mẹo hữu ích</h3>
                      <v-list :bg-color="step.themeColor + '-lighten-5'" rounded="lg">
                        <v-list-item v-for="(tip, index) in step.tips" :key="index" :title="tip.title"
                          :subtitle="tip.content" class="mb-2">
                          <template v-slot:prepend>
                            <v-icon :color="step.themeColor">{{ tip.icon }}</v-icon>
                          </template>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-text>
                </v-card>
              </div>
            </v-window-item>

            <v-window-item value="actions">
              <div class="step-tab-wrapper">
                <v-row>
                  <v-col v-for="action in step.actions" :key="action.id" cols="12" md="6">
                    <v-card :class="{ 'bg-success-subtle': action.completed }">
                      <v-card-title class="d-flex justify-space-between align-center">
                        {{ action.title }}
                        <v-chip :color="action.required ? 'error' : step.themeColor" size="small">
                          {{ action.required ? "Bắt buộc" : "Tùy chọn" }}
                        </v-chip>
                      </v-card-title>
                      <v-card-subtitle class="d-flex align-center">
                        <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                        {{ action.duration }}
                      </v-card-subtitle>
                      <v-card-text>
                        <p>{{ action.description }}</p>

                        <div v-if="action.moodTags && action.moodTags.length > 0" class="mt-2">
                          <v-chip v-for="tag in action.moodTags" :key="tag" size="small" :color="step.themeColor"
                            class="mr-1 mb-1" variant="outlined">
                            {{ tag }}
                          </v-chip>
                        </div>
                      </v-card-text>
                      <v-card-actions class="d-flex justify-space-between">
                        <v-btn variant="text" size="small" @click="viewActionDetails(action)">
                          Chi tiết
                        </v-btn>

                        <v-checkbox v-model="action.completed" :label="action.completed
                            ? 'Đã hoàn thành'
                            : 'Đánh dấu hoàn thành'
                          " hide-details density="compact" @change="updateProgress"></v-checkbox>
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
                      <v-radio label="Tôi cảm thấy tốt hôm nay, không cần thực hiện bước này" value="feelGood"
                        color="warning"></v-radio>
                      <v-radio label="Bước này không liên quan đến tôi" value="notRelevant" color="warning"></v-radio>
                      <v-radio label="Tôi không có đủ thời gian ngay bây giờ" value="noTime" color="warning"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn variant="text" @click="showSkipConfirm = false">
                      Hủy
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="warning" @click="confirmSkip" :disabled="!skipReason">
                      Xác nhận bỏ qua
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </div>
            </v-window-item>
          </v-window>

          <div class="d-flex justify-space-between mt-8">
            <v-btn v-if="step.canSkip && !showSkipConfirm" variant="outlined" @click="showSkipConfirm = true">
              Bỏ qua bước này
            </v-btn>
            <div v-else></div>

            <v-btn size="large" :color="canContinue ? 'success' : step.themeColor" :disabled="!canContinue"
              @click="continueToNextStep">
              <v-icon start>{{
                step.isLast ? "mdi-check-circle" : "mdi-arrow-right"
              }}</v-icon>
              {{ step.isLast ? "Hoàn thành phase" : "Tiếp tục" }}
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <!-- Dialog đánh giá cuối phase -->
    <PhaseCompletionDialog :show="showPhaseCompletion" :phase-id="currentPhaseId" :phase-title="currentPhaseTitle"
      :documents="phaseDocuments" :criteria-list="phaseCriteria" @close="showPhaseCompletion = false"
      @submit="submitPhaseEvaluation" />
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
      totalStepsInPhase: 3, // Số bước trong phase 1

      // Dữ liệu cho PhaseCompletionDialog
      showPhaseCompletion: false,
      currentPhase: 1,
      nextPhase: 2,
      currentPhaseId: "phase1",
      currentPhaseTitle: "Nhận thức và Hiểu biết",
      nextPhaseTitle: "Xây dựng Kỹ năng",
      nextPhaseDescription: "Học và thực hành các kỹ thuật để đối phó với lo âu và xây dựng sự tự tin.",
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
      ],

      // Dữ liệu cho Phase 1 - Các bước khác nhau
      phase1Steps: {
        "1": {
          id: "1",
          roadmapId: this.roadmapId,
          title: "Nhận diện triệu chứng lo âu",
          description: "Học cách nhận biết các dấu hiệu và triệu chứng của lo âu",
          themeColor: "indigo",
          introduction: "Bước đầu tiên để vượt qua lo âu là nhận diện và thừa nhận vấn đề. Trong bước này, bạn sẽ học cách nhận biết các triệu chứng lo âu, hiểu nguồn gốc của chúng và tác động của chúng đến cuộc sống hàng ngày của bạn.",
          videoUrl: "/videos/step1.mp4",
          tips: [
            {
              title: "Lắng nghe cơ thể",
              content: "Chú ý đến các phản ứng thể chất như tim đập nhanh, khó thở, hoặc căng cơ",
              icon: "mdi-heart-pulse"
            },
            {
              title: "Ghi chú hàng ngày",
              content: "Ghi lại các triệu chứng và tình huống gây lo âu để nhận diện mẫu hình",
              icon: "mdi-notebook"
            }
          ],
          actions: [
            {
              id: "1-1",
              title: "Nhật ký triệu chứng",
              description:
                "Ghi lại các triệu chứng lo âu bạn gặp phải trong ngày",
              duration: "10 phút",
              completed: false,
              required: true,
              moodTags: ["Tự nhận thức", "Theo dõi triệu chứng"],
            },
            {
              id: "1-2",
              title: "Đánh giá mức độ lo âu",
              description: "Đánh giá mức độ lo âu của bạn trên thang điểm từ 1-10",
              duration: "5 phút",
              completed: false,
              required: true,
              moodTags: ["Đo lường", "Tự đánh giá"],
            },
            {
              id: "1-3",
              title: "Xác định yếu tố kích hoạt",
              description: "Nhận diện các tình huống hoặc suy nghĩ gây ra lo âu",
              duration: "15 phút",
              completed: false,
              required: false,
              moodTags: ["Phân tích", "Nhận thức"],
            },
          ],
          progress: 0,
          isFirst: true,
          isLast: false,
          nextStepId: "2",
          canSkip: false,
          requireConfirmation: true,
        },
        "2": {
          id: "2",
          roadmapId: this.roadmapId,
          title: "Kỹ thuật giảm lo âu tức thì",
          description: "Học các phương pháp nhanh chóng để giảm lo âu trong tình huống khẩn cấp",
          themeColor: "teal",
          introduction: "Sau khi đã nhận diện vấn đề, bước tiếp theo là học các kỹ thuật giảm nhẹ tức thì. Những kỹ thuật này sẽ giúp bạn đối phó với các tình huống gây lo âu và giảm triệu chứng ngay lập tức khi chúng xuất hiện.",
          videoUrl: "/videos/step2.mp4",
          tips: [
            {
              title: "Thực hành thường xuyên",
              content: "Các kỹ thuật thở và thư giãn hiệu quả hơn khi được thực hành thường xuyên",
              icon: "mdi-repeat"
            },
            {
              title: "Tìm không gian yên tĩnh",
              content: "Nếu có thể, hãy tìm một nơi yên tĩnh để thực hành các kỹ thuật này",
              icon: "mdi-meditation"
            }
          ],
          actions: [
            {
              id: "2-1",
              title: "Kỹ thuật thở 4-7-8",
              description:
                "Hít vào trong 4 giây, giữ 7 giây, và thở ra trong 8 giây",
              duration: "5 phút",
              completed: false,
              required: true,
              moodTags: ["Giảm nhẹ nhanh", "Kiểm soát hơi thở"],
            },
            {
              id: "2-2",
              title: "Thư giãn cơ bắp tiến triển",
              description: "Căng và thả lỏng từng nhóm cơ để giảm căng thẳng",
              duration: "10 phút",
              completed: false,
              required: false,
              moodTags: ["Thư giãn cơ thể", "Giảm căng thẳng"],
            },
            {
              id: "2-3",
              title: "Kỹ thuật neo đậu 5-4-3-2-1",
              description: "Sử dụng 5 giác quan để kéo bạn trở lại hiện tại",
              duration: "5 phút",
              completed: false,
              required: true,
              moodTags: ["Chánh niệm", "Tập trung"],
            },
          ],
          progress: 0,
          isFirst: false,
          isLast: false,
          nextStepId: "3",
          canSkip: true,
          requireConfirmation: false,
        },
        "3": {
          id: "3",
          roadmapId: this.roadmapId,
          title: "Thách thức suy nghĩ tiêu cực",
          description: "Học cách nhận diện và thay đổi các mẫu suy nghĩ tiêu cực gây ra lo âu",
          themeColor: "purple",
          introduction: "Suy nghĩ tiêu cực thường là nguyên nhân chính gây ra lo âu. Trong bước này, bạn sẽ học cách nhận diện, thách thức và thay đổi các mẫu suy nghĩ tiêu cực để giảm lo âu và cải thiện sức khỏe tinh thần.",
          videoUrl: "/videos/step3.mp4",
          tips: [
            {
              title: "Tìm bằng chứng",
              content: "Khi có suy nghĩ tiêu cực, hãy tìm bằng chứng ủng hộ và phản bác nó",
              icon: "mdi-scale-balance"
            },
            {
              title: "Đặt câu hỏi",
              content: "Hỏi bản thân: 'Điều tồi tệ nhất có thể xảy ra là gì? Khả năng xảy ra là bao nhiêu?'",
              icon: "mdi-help-circle"
            },
            {
              title: "Thay thế suy nghĩ",
              content: "Thực hành thay thế suy nghĩ tiêu cực bằng suy nghĩ cân bằng hơn",
              icon: "mdi-swap-horizontal"
            }
          ],
          actions: [
            {
              id: "3-1",
              title: "Nhật ký suy nghĩ",
              description:
                "Ghi lại các suy nghĩ tiêu cực và tác động của chúng",
              duration: "15 phút",
              completed: false,
              required: true,
              moodTags: ["Nhận thức", "Phân tích"],
            },
            {
              id: "3-2",
              title: "Nhận diện lỗi suy nghĩ",
              description: "Học cách nhận diện các lỗi suy nghĩ phổ biến như suy nghĩ nhị nguyên, đọc suy nghĩ",
              duration: "10 phút",
              completed: false,
              required: true,
              moodTags: ["Nhận thức", "Tư duy phản biện"],
            },
            {
              id: "3-3",
              title: "Thực hành tái cấu trúc nhận thức",
              description: "Thách thức và thay đổi suy nghĩ tiêu cực thành cân bằng hơn",
              duration: "20 phút",
              completed: false,
              required: false,
              moodTags: ["Thay đổi suy nghĩ", "Tích cực hóa"],
            },
          ],
          progress: 0,
          isFirst: false,
          isLast: true,
          nextStepId: "4",
          canSkip: false,
          requireConfirmation: false,
        }
      },

      // Dữ liệu cho Phase 2
      phase2Steps: {
        "4": {
          id: "4",
          roadmapId: this.roadmapId,
          title: "Thiền định cơ bản",
          description: "Học các kỹ thuật thiền định đơn giản để kiểm soát lo âu",
          themeColor: "blue",
          introduction: "Thiền định là một công cụ mạnh mẽ để kiểm soát lo âu. Trong bước này, bạn sẽ học các kỹ thuật thiền định cơ bản và thực hành chúng để giảm lo âu và tăng cường sự tập trung.",
          videoUrl: "/videos/meditation.mp4",
          tips: [
            {
              title: "Bắt đầu từ từ",
              content: "Bắt đầu với các buổi thiền ngắn 5 phút và tăng dần thời gian",
              icon: "mdi-clock-outline"
            },
            {
              title: "Tìm tư thế thoải mái",
              content: "Bạn có thể ngồi trên ghế, gối thiền hoặc nằm - miễn là thoải mái",
              icon: "mdi-human-handsup"
            }
          ],
          actions: [
            {
              id: "p2-1",
              title: "Thiền hơi thở 5 phút",
              description: "Tập trung vào hơi thở và thực hành thiền 5 phút mỗi ngày",
              duration: "5 phút",
              completed: false,
              required: true,
              moodTags: ["Giảm căng thẳng", "Tăng tập trung"],
            },
            {
              id: "p2-2",
              title: "Thiền chánh niệm",
              description: "Thực hành chánh niệm trong các hoạt động hàng ngày",
              duration: "10 phút",
              completed: false,
              required: true,
              moodTags: ["Sống trong hiện tại", "Giảm lo âu"],
            },
            {
              id: "p2-3",
              title: "Thiền trước khi ngủ",
              description: "Thực hành thiền trước khi ngủ để cải thiện chất lượng giấc ngủ",
              duration: "15 phút",
              completed: false,
              required: false,
              moodTags: ["Cải thiện giấc ngủ", "Thư giãn"],
            },
          ],
          progress: 0,
          isFirst: false,
          isLast: false,
          nextStepId: "5",
          canSkip: true,
          requireConfirmation: false,
        },
        "5": {
          id: "5",
          roadmapId: this.roadmapId,
          title: "Xây dựng thói quen tích cực",
          description: "Phát triển các thói quen hàng ngày để duy trì sức khỏe tinh thần",
          themeColor: "green",
          introduction: "Xây dựng thói quen tích cực là chìa khóa để duy trì sức khỏe tinh thần lâu dài. Trong bước này, bạn sẽ phát triển các thói quen hàng ngày giúp bạn duy trì sự cân bằng và phòng ngừa lo âu.",
          videoUrl: "/videos/habits.mp4",
          tips: [
            {
              title: "Bắt đầu nhỏ",
              content: "Tập trung vào một thói quen nhỏ mỗi lần và xây dựng dần dần",
              icon: "mdi-baby-carriage"
            },
            {
              title: "Nhất quán",
              content: "Thực hiện thói quen vào cùng một thời điểm mỗi ngày để tạo thói quen",
              icon: "mdi-calendar-clock"
            }
          ],
          actions: [
            {
              id: "p2-4",
              title: "Lịch trình buổi sáng",
              description: "Tạo và duy trì một lịch trình buổi sáng tích cực",
              duration: "30 phút",
              completed: false,
              required: true,
              moodTags: ["Năng lượng", "Khởi đầu tích cực"],
            },
            {
              id: "p2-5",
              title: "Nhật ký biết ơn",
              description: "Ghi lại 3 điều bạn biết ơn mỗi ngày",
              duration: "5 phút",
              completed: false,
              required: true,
              moodTags: ["Tích cực", "Biết ơn"],
            },
            {
              id: "p2-6",
              title: "Hoạt động thể chất",
              description: "Tham gia vào hoạt động thể chất ít nhất 20 phút mỗi ngày",
              duration: "20 phút",
              completed: false,
              required: false,
              moodTags: ["Tăng cường sức khỏe", "Giảm stress"],
            },
          ],
          progress: 0,
          isFirst: false,
          isLast: true,
          nextStepId: undefined,
          canSkip: false,
          requireConfirmation: false,
        }
      }
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
      // Hardcode: giả sử milestone id 3 là milestone cuối cùng trong phase 1
      return this.stepId === "3";
    }
  },
  watch: {
    // Theo dõi sự thay đổi của stepId để tải lại dữ liệu khi route thay đổi
    stepId: {
      immediate: true,
      handler() {
        this.loading = true;
        this.fetchStepDetails();
        // Reset các giá trị khi chuyển step
        this.mood = null;
        this.confirmation = null;
        this.skipReason = null;
        this.showSkipConfirm = false;
        this.activeTab = "overview";
      }
    }
  },
  mounted() {
    // Không cần gọi fetchStepDetails ở đây nữa vì đã có trong watch
  },
  methods: {
    fetchStepDetails() {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Kiểm tra xem step có thuộc phase 2 không
        if (this.stepId === "4" || this.stepId === "5") {
          this.step = JSON.parse(JSON.stringify(this.phase2Steps[this.stepId]));
          this.currentPhase = 2;
          this.nextPhase = 3;
          this.totalStepsInPhase = 2; // Phase 2 có 2 bước
          this.currentPhaseId = "phase2";
          this.currentPhaseTitle = "Xây dựng Kỹ năng";
          this.nextPhaseTitle = "Thực hành và Duy trì";
          this.nextPhaseDescription = "Áp dụng các kỹ năng đã học vào cuộc sống hàng ngày và xây dựng chiến lược dài hạn.";
          this.phaseDocuments = [
            { title: "Hướng dẫn thiền định cho người mới bắt đầu", url: "/docs/meditation-guide" },
            { title: "Xây dựng thói quen tích cực", url: "/docs/positive-habits" },
            { title: "Kỹ thuật đối phó với lo âu", url: "/docs/coping-techniques" }
          ];
          this.phaseCriteria = [
            {
              title: "Thực hành thiền định",
              description: "Bạn đã thực hành thiền định ít nhất 3 lần một tuần"
            },
            {
              title: "Xây dựng thói quen",
              description: "Bạn đã bắt đầu xây dựng ít nhất một thói quen tích cực mới"
            },
            {
              title: "Áp dụng kỹ thuật",
              description: "Bạn đã áp dụng các kỹ thuật đối phó khi gặp tình huống lo âu"
            }
          ];
        } else {
          // Lấy dữ liệu từ phase1Steps và tạo bản sao để tránh tham chiếu
          this.step = JSON.parse(JSON.stringify(this.phase1Steps[this.stepId]));
          this.totalStepsInPhase = 3; // Phase 1 có 3 bước
        }
        this.loading = false;
      }, 500); // Giảm thời gian chờ xuống 500ms để trải nghiệm mượt hơn
    },
    getNextStepId() {
      const currentId = parseInt(this.stepId);
      return (currentId + 1).toString();
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

      // Sửa lỗi: Kiểm tra ngay lập tức nếu là milestone cuối cùng trong phase
      if (this.isLastMilestoneInPhase) {
        this.showPhaseCompletion = true;
        return; // Thêm return để ngăn chặn code tiếp tục chạy
      }

      // Nếu không phải milestone cuối cùng, chuyển đến milestone tiếp theo
      if (this.step.nextStepId) {
        this.$router.push(
          `/roadmap/${this.roadmapId}/step/${this.step.nextStepId}`
        );
      } else {
        this.$router.push(`/roadmap/${this.roadmapId}/complete`);
      }
    },
    submitPhaseEvaluation(evaluationData) {
      // Đóng dialog đánh giá phase
      this.showPhaseCompletion = false;

      // Chuyển đến phase tiếp theo ngay lập tức nếu người dùng chọn "yes"
      if (evaluationData.moveToNextPhase === "yes") {
        // Chuyển đến milestone đầu tiên của phase tiếp theo
        this.$router.push(`/roadmap/${this.roadmapId}/step/4`);
      } else if (evaluationData.moveToNextPhase === "review") {
        // Quay lại trang roadmap detail
        this.$router.push(`/roadmap/${this.roadmapId}`);
      } else {
        // Tạm dừng lộ trình, quay về trang chủ
        this.$router.push("/");
      }
    },
    goToNextPhase() {
      // Đóng dialog mở khóa phase
      this.showPhaseUnlock = false;

      // Chuyển đến milestone đầu tiên của phase tiếp theo
      this.$router.push(`/roadmap/${this.roadmapId}/step/4`);
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
  width: calc(100% - 320px);
  /* Trừ đi chiều rộng của sidebar */
  margin-left: 320px;
  /* Thêm margin-left bằng với chiều rộng của sidebar */
}

.roadmap-content {
  flex: 1;
  width: 100%;
  padding: 0 40px;
  /* Thêm padding để nội dung không sát cạnh */
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

/* Animation cho dialog mở khóa */
.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), opacity 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.v-dialog-transition-enter-from,
.v-dialog-transition-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

/* Thêm animation khi chuyển step */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
