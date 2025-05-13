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
              <div class="d-flex align-center mt-2">
                <v-chip color="primary">Phase {{ currentPhase }}</v-chip>
                <v-chip color="secondary" class="ml-2">Bước {{ getStepNumberInPhase() }}/{{ totalStepsInCurrentPhase }}</v-chip>
              </div>
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
                <v-card class="mb-6" :color="step.themeColor + '-lighten-5'">
                  <v-card-title>Giới thiệu bước</v-card-title>
                  <v-card-text>
                    <p class="text-body-1 mb-4">
                      {{ step.introduction }}
                    </p>

                    <div v-if="step.videoUrl" class="mt-6">
                      <h3 class="text-h6 mb-2">Hướng dẫn video</h3>
                      <div
                        class="video-placeholder d-flex justify-center align-center"
                        :style="{ backgroundColor: step.themeColor + '-lighten-4' }"
                      >
                        <v-btn
                          icon="mdi-play"
                          :color="step.themeColor"
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
                    
                    <div v-if="step.tips && step.tips.length > 0" class="mt-6">
                      <h3 class="text-h6 mb-3">Mẹo hữu ích</h3>
                      <v-list :bg-color="step.themeColor + '-lighten-5'" rounded="lg">
                        <v-list-item
                          v-for="(tip, index) in step.tips"
                          :key="index"
                          :title="tip.title"
                          :subtitle="tip.content"
                          class="mb-2"
                        >
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
                          :color="action.required ? 'error' : step.themeColor"
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
                            :color="step.themeColor"
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
              :color="canContinue ? 'success' : step.themeColor"
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
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useEventBus } from '../../scripts/logic/evenBus';

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
  setup(props) {
    const router = useRouter();
    const eventBus = useEventBus();
    
    const loading = ref(true);
    const step = ref(null);
    const activeTab = ref("overview");
    const mood = ref(null);
    const confirmation = ref(null);
    const skipReason = ref(null);
    const showSkipConfirm = ref(false);
    
    // Dữ liệu cho PhaseCompletionDialog
    const showPhaseCompletion = ref(false);
    const currentPhase = ref(1);
    const nextPhase = ref(2);
    const currentPhaseId = ref("phase1");
    const currentPhaseTitle = ref("Nhận thức và Hiểu biết");
    const nextPhaseTitle = ref("Xây dựng Kỹ năng");
    const nextPhaseDescription = ref("Học và thực hành các kỹ thuật để đối phó với lo âu và xây dựng sự tự tin.");
    const phaseDocuments = ref([
      { title: "Hiểu về lo âu và các triệu chứng", url: "/docs/anxiety-symptoms" },
      { title: "Kỹ thuật thở để giảm lo âu", url: "/docs/breathing-techniques" },
      { title: "Nhận diện và thách thức suy nghĩ tiêu cực", url: "/docs/negative-thoughts" }
    ]);
    const phaseCriteria = ref([
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
    ]);
    
    // Trạng thái hoàn thành của các phase
    const completedPhases = ref({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false
    });
    
    // Cấu trúc của roadmap
    const roadmapStructure = {
      1: { // Phase 1
        name: "Nhận thức và Hiểu biết",
        steps: ["1", "2", "3"],
        nextPhase: 2
      },
      2: { // Phase 2
        name: "Giảm nhẹ tức thì",
        steps: ["4", "5"],
        nextPhase: 3
      },
      3: { // Phase 3
        name: "Ổn định tâm trí",
        steps: ["6", "7", "8"],
        nextPhase: 4
      },
      4: { // Phase 4
        name: "Đối mặt với vấn đề",
        steps: ["9", "10"],
        nextPhase: 5
      },
      5: { // Phase 5
        name: "Đánh giá và Duy trì",
        steps: ["11", "12"],
        nextPhase: null
      }
    };
    
    const totalStepsInCurrentPhase = ref(3); // Mặc định là phase 1 có 3 bước
    
    // Dữ liệu cho Phase 1 - Các bước khác nhau
    const phase1Steps = {
      "1": {
        id: "1",
        roadmapId: props.roadmapId,
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
        roadmapId: props.roadmapId,
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
        roadmapId: props.roadmapId,
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
    };
    
    // Dữ liệu cho Phase 2
    const phase2Steps = {
      "4": {
        id: "4",
        roadmapId: props.roadmapId,
        title: "Giảm nhẹ tức thì",
        description: "Học các kỹ thuật thư giãn nhanh để giảm lo âu trong tình huống khẩn cấp",
        themeColor: "blue",
        introduction: "Giảm nhẹ tức thì là một kỹ thuật quan trọng để đối phó với lo âu. Trong bước này, bạn sẽ học các kỹ thuật thư giãn nhanh và hiệu quả để giảm lo âu ngay lập tức khi cần thiết.",
        videoUrl: "/videos/meditation.mp4",
        tips: [
          {
            title: "Thực hành thường xuyên",
            content: "Các kỹ thuật thư giãn hiệu quả hơn khi được thực hành thường xuyên",
            icon: "mdi-repeat"
          },
          {
            title: "Áp dụng khi cần",
            content: "Sử dụng các kỹ thuật này ngay khi bạn cảm thấy lo âu bắt đầu xuất hiện",
            icon: "mdi-alert-circle-outline"
          }
        ],
        actions: [
          {
            id: "p2-1",
            title: "Kỹ thuật thở 4-7-8",
            description: "Hít vào trong 4 giây, giữ 7 giây, và thở ra trong 8 giây",
            duration: "5 phút",
            completed: false,
            required: true,
            moodTags: ["Giảm căng thẳng", "Tăng tập trung"],
          },
          {
            id: "p2-2",
            title: "Thư giãn cơ bắp tiến triển",
            description: "Căng và thả lỏng từng nhóm cơ để giảm căng thẳng",
            duration: "10 phút",
            completed: false,
            required: true,
            moodTags: ["Thư giãn cơ thể", "Giảm lo âu"],
          },
          {
            id: "p2-3",
            title: "Kỹ thuật neo đậu 5-4-3-2-1",
            description: "Sử dụng 5 giác quan để kéo bạn trở lại hiện tại",
            duration: "15 phút",
            completed: false,
            required: false,
            moodTags: ["Chánh niệm", "Tập trung"],
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
        roadmapId: props.roadmapId,
        title: "Kỹ thuật thư giãn nâng cao",
        description: "Học các kỹ thuật thư giãn nâng cao để kiểm soát lo âu lâu dài",
        themeColor: "green",
        introduction: "Sau khi đã làm quen với các kỹ thuật thư giãn cơ bản, bước này sẽ giới thiệu các kỹ thuật nâng cao hơn để giúp bạn kiểm soát lo âu trong dài hạn.",
        videoUrl: "/videos/habits.mp4",
        tips: [
          {
            title: "Kiên trì thực hành",
            content: "Các kỹ thuật nâng cao cần thời gian để thành thạo, hãy kiên trì",
            icon: "mdi-clock-time-five-outline"
          },
          {
            title: "Kết hợp các kỹ thuật",
            content: "Kết hợp nhiều kỹ thuật khác nhau để tìm ra phương pháp hiệu quả nhất cho bạn",
            icon: "mdi-puzzle"
          }
        ],
        actions: [
          {
            id: "p2-4",
            title: "Thiền định cơ bản",
            description: "Thực hành thiền định đơn giản 10 phút mỗi ngày",
            duration: "10 phút",
            completed: false,
            required: true,
            moodTags: ["Tĩnh tâm", "Tập trung"],
          },
          {
            id: "p2-5",
            title: "Kỹ thuật thở sâu",
            description: "Thực hành các kỹ thuật thở sâu để giảm lo âu",
            duration: "5 phút",
            completed: false,
            required: true,
            moodTags: ["Thư giãn", "Kiểm soát hơi thở"],
          },
          {
            id: "p2-6",
            title: "Yoga nhẹ nhàng",
            description: "Thực hành các tư thế yoga đơn giản để thư giãn cơ thể",
            duration: "20 phút",
            completed: false,
            required: false,
            moodTags: ["Thư giãn cơ thể", "Kết nối tâm trí"],
          },
        ],
        progress: 0,
        isFirst: false,
        isLast: true,
        nextStepId: undefined,
        canSkip: false,
        requireConfirmation: false,
      }
    };
    
    // Computed properties
    const completedActionsCount = computed(() => {
      if (!step.value) return 0;
      return step.value.actions.filter((action) => action.completed).length;
    });
    
    const canContinue = computed(() => {
      if (!step.value) return false;

      if (step.value.requireConfirmation) {
        return confirmation.value === "acknowledge";
      }

      const requiredActions = step.value.actions.filter(
        (action) => action.required
      );
      return requiredActions.every((action) => action.completed);
    });
    
    const isLastMilestoneInPhase = computed(() => {
      // Kiểm tra xem step hiện tại có phải là step cuối cùng trong phase không
      const phaseSteps = roadmapStructure[currentPhase.value].steps;
      return props.stepId === phaseSteps[phaseSteps.length - 1];
    });
    
    // Methods
    // Lấy số thứ tự của step trong phase hiện tại
    const getStepNumberInPhase = () => {
      const phaseSteps = roadmapStructure[currentPhase.value].steps;
      return phaseSteps.indexOf(props.stepId) + 1;
    };
    
    // Lưu trạng thái hoàn thành của các phase vào localStorage
    const saveCompletedPhases = () => {
      localStorage.setItem('completedPhases', JSON.stringify(completedPhases.value));
    };
    
    // Khôi phục trạng thái hoàn thành của các phase từ localStorage
    const loadCompletedPhases = () => {
      const savedPhases = localStorage.getItem('completedPhases');
      if (savedPhases) {
        completedPhases.value = JSON.parse(savedPhases);
      }
    };
    
    const fetchStepDetails = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Xác định phase hiện tại dựa trên stepId
        determineCurrentPhase();
        
        // Cập nhật số bước trong phase hiện tại
        totalStepsInCurrentPhase.value = roadmapStructure[currentPhase.value].steps.length;
        
        // Kiểm tra xem step có thuộc phase 2 không
        if (currentPhase.value === 2) {
          step.value = JSON.parse(JSON.stringify(phase2Steps[props.stepId]));
          nextPhase.value = roadmapStructure[currentPhase.value].nextPhase;
          currentPhaseId.value = "phase" + currentPhase.value;
          currentPhaseTitle.value = roadmapStructure[currentPhase.value].name;
          
          if (nextPhase.value) {
            nextPhaseTitle.value = roadmapStructure[nextPhase.value].name;
            nextPhaseDescription.value = "Áp dụng các kỹ năng đã học vào cuộc sống hàng ngày và xây dựng chiến lược dài hạn.";
          }
          
          phaseDocuments.value = [
            { title: "Hướng dẫn thiền định cho người mới bắt đầu", url: "/docs/meditation-guide" },
            { title: "Xây dựng thói quen tích cực", url: "/docs/positive-habits" },
            { title: "Kỹ thuật đối phó với lo âu", url: "/docs/coping-techniques" }
          ];
          phaseCriteria.value = [
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
          step.value = JSON.parse(JSON.stringify(phase1Steps[props.stepId]));
          nextPhase.value = roadmapStructure[currentPhase.value].nextPhase;
          currentPhaseId.value = "phase" + currentPhase.value;
          currentPhaseTitle.value = roadmapStructure[currentPhase.value].name;
          
          if (nextPhase.value) {
            nextPhaseTitle.value = roadmapStructure[nextPhase.value].name;
          }
        }
        
        // Cập nhật trạng thái hoàn thành từ localStorage
        loadCompletedPhases();
        
        loading.value = false;
      }, 500); // Giảm thời gian chờ xuống 500ms để trải nghiệm mượt hơn
    };
    
    // Xác định phase hiện tại dựa trên stepId
    const determineCurrentPhase = () => {
      for (const [phaseId, phaseData] of Object.entries(roadmapStructure)) {
        if (phaseData.steps.includes(props.stepId)) {
          currentPhase.value = parseInt(phaseId);
          break;
        }
      }
    };
    
    const getNextStepId = () => {
      const currentId = parseInt(props.stepId);
      return (currentId + 1).toString();
    };
    
    const updateProgress = () => {
      if (!step.value) return;

      const completedCount = step.value.actions.filter(
        (a) => a.completed
      ).length;
      step.value.progress = Math.round(
        (completedCount / step.value.actions.length) * 100
      );
    };
    
    const viewActionDetails = (action) => {
      // In a real app, this would open a detailed view of the action
      alert(`Chi tiết hành động: ${action.title}\n\n${action.description}`);
    };
    
    const confirmSkip = () => {
      if (!skipReason.value) return;

      // In a real app, this would send the skip reason to the API
      if (step.value.nextStepId) {
        router.push(
          `/roadmap/${props.roadmapId}/step/${step.value.nextStepId}`
        );
      } else {
        router.push(`/roadmap/${props.roadmapId}/complete`);
      }
    };
    
    const continueToNextStep = () => {
      if (!canContinue.value) return;

      // Sửa lỗi: Kiểm tra ngay lập tức nếu là milestone cuối cùng trong phase
      if (isLastMilestoneInPhase.value) {
        showPhaseCompletion.value = true;
        return; // Thêm return để ngăn chặn code tiếp tục chạy
      }

      // Nếu không phải milestone cuối cùng, chuyển đến milestone tiếp theo
      if (step.value.nextStepId) {
        router.push(
          `/roadmap/${props.roadmapId}/step/${step.value.nextStepId}`
        );
      } else {
        router.push(`/roadmap/${props.roadmapId}/complete`);
      }
    };
    
    const submitPhaseEvaluation = (evaluationData) => {
      // Đóng dialog đánh giá phase
      showPhaseCompletion.value = false;
      
      // Đánh dấu phase hiện tại là đã hoàn thành
      completedPhases.value[currentPhase.value] = true;
      
      // Đồng bộ trạng thái với RoadmapDetail
      syncCompletedPhasesWithRoadmapDetail();
      
      // Chuyển đến phase tiếp theo ngay lập tức nếu người dùng chọn "yes"
      if (evaluationData.moveToNextPhase === "yes") {
        // Lấy step đầu tiên của phase tiếp theo
        const nextPhaseFirstStep = roadmapStructure[nextPhase.value].steps[0];
        
        // Chuyển đến milestone đầu tiên của phase tiếp theo
        router.push(`/roadmap/${props.roadmapId}/step/${nextPhaseFirstStep}`);
      } else if (evaluationData.moveToNextPhase === "review") {
        // Quay lại trang roadmap detail
        router.push(`/roadmap/${props.roadmapId}`);
      } else {
        // Tạm dừng lộ trình, quay về trang chủ
        router.push("/");
      }
    };
    
    const goToNextPhase = () => {
      // Lấy step đầu tiên của phase tiếp theo
      const nextPhaseFirstStep = roadmapStructure[nextPhase.value].steps[0];
      
      // Chuyển đến milestone đầu tiên của phase tiếp theo
      router.push(`/roadmap/${props.roadmapId}/step/${nextPhaseFirstStep}`);
    };
    
    const goToSuggestion = () => {
      router.push("/suggest");
    };
    
    const updateStatus = () => {
      // In a real app, this would update the user's status
      alert("Status updated!");
    };
    
    const syncCompletedPhasesWithRoadmapDetail = () => {
      // Gửi sự kiện để thông báo cho RoadmapDetail cập nhật trạng thái
      eventBus.emit('update-roadmap-phases', completedPhases.value);
      
      // Lưu trạng thái vào localStorage để đảm bảo nhất quán
      saveCompletedPhases();
      
      // Log để debug
      console.log('Đã cập nhật trạng thái phase:', completedPhases.value);
    };
    
    // Watch for changes in stepId
    watch(() => props.stepId, () => {
      loading.value = true;
      fetchStepDetails();
      // Reset các giá trị khi chuyển step
      mood.value = null;
      confirmation.value = null;
      skipReason.value = null;
      showSkipConfirm.value = false;
      activeTab.value = "overview";
    }, { immediate: true });
    
    onMounted(() => {
      // Khôi phục trạng thái hoàn thành của các phase từ localStorage
      loadCompletedPhases();
    });
    
    return {
      loading,
      step,
      activeTab,
      mood,
      confirmation,
      skipReason,
      showSkipConfirm,
      showPhaseCompletion,
      currentPhase,
      nextPhase,
      currentPhaseId,
      currentPhaseTitle,
      nextPhaseTitle,
      phaseDocuments,
      phaseCriteria,
      completedPhases,
      totalStepsInCurrentPhase,
      completedActionsCount,
      canContinue,
      isLastMilestoneInPhase,
      getStepNumberInPhase,
      updateProgress,
      viewActionDetails,
      confirmSkip,
      continueToNextStep,
      submitPhaseEvaluation,
      goToNextPhase,
      goToSuggestion,
      updateStatus,
      syncCompletedPhasesWithRoadmapDetail
    };
  }
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
