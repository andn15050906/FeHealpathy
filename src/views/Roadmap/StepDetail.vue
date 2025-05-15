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

        <div v-else-if="phase">
          <div class="d-flex flex-column md:flex-row justify-space-between align-start mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">{{ phase.title }}</h1>
              <p class="text-subtitle-1 text-grey-darken-1">{{
                phase.description
              }}</p>
              <div class="d-flex align-center mt-2">
                <v-chip color="primary">Phase {{ currentPhase }}</v-chip>
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

          <v-tabs v-model="activeTab" class="mb-6">
            <v-tab value="overview">Tổng quan</v-tab>
            <v-tab value="actions">
              Hành động ({{ completedActionsCount }}/{{ phase.actions.length }})
            </v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="overview">
              <div class="step-tab-wrapper">
                <v-card class="mb-6" :color="phase.themeColor + '-lighten-5'">
                  <v-card-title>Giới thiệu phase</v-card-title>
                  <v-card-text>
                    <p class="text-body-1 mb-4">
                      {{ phase.introduction }}
                    </p>

                    <div v-if="phase.videoUrl" class="mt-6">
                      <h3 class="text-h6 mb-2">Hướng dẫn video</h3>
                      <div class="video-placeholder d-flex justify-center align-center"
                        :style="{ backgroundColor: phase.themeColor + '-lighten-4' }">
                        <v-btn icon="mdi-play" :color="phase.themeColor" size="x-large" variant="flat"></v-btn>
                      </div>
                    </div>

                    <div v-if="phase.tips && phase.tips.length > 0" class="mt-6">
                      <h3 class="text-h6 mb-3">Mẹo hữu ích</h3>
                      <v-list :bg-color="phase.themeColor + '-lighten-5'" rounded="lg">
                        <v-list-item v-for="(tip, index) in phase.tips" :key="index" :title="tip.title"
                          :subtitle="tip.content" class="mb-2">
                          <template v-slot:prepend>
                            <v-icon :color="phase.themeColor">{{ tip.icon }}</v-icon>
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
                  <v-col v-for="action in phase.actions" :key="action.id" cols="12" md="6">
                    <v-card :class="{ 'bg-success-subtle': action.completed }">
                      <v-card-title class="d-flex justify-space-between align-center">
                        {{ action.title }}
                        <v-chip :color="action.required ? 'error' : phase.themeColor" size="small">
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
                          <v-chip v-for="tag in action.moodTags" :key="tag" size="small" :color="phase.themeColor"
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
                          " hide-details density="compact"></v-checkbox>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>

                <v-card v-if="showSkipConfirm" class="mt-6 bg-warning-lighten-5">
                  <v-card-title>Bạn có muốn bỏ qua phase này không?</v-card-title>
                  <v-card-subtitle>
                    Vui lòng cho chúng tôi biết lý do để chúng tôi có thể cải
                    thiện trải nghiệm của bạn
                  </v-card-subtitle>
                  <v-card-text>
                    <v-radio-group v-model="skipReason">
                      <v-radio label="Tôi cảm thấy tốt hôm nay, không cần thực hiện phase này" value="feelGood"
                        color="warning"></v-radio>
                      <v-radio label="Phase này không liên quan đến tôi" value="notRelevant" color="warning"></v-radio>
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
            <v-btn v-if="phase.canSkip && !showSkipConfirm" variant="outlined" @click="showSkipConfirm = true">
              Bỏ qua phase này
            </v-btn>
            <div v-else></div>

            <v-btn size="large" :color="canContinue ? 'success' : phase.themeColor" :disabled="!canContinue"
              @click="completePhase">
              <v-icon start>{{
                isLastPhase ? "mdi-check-circle" : "mdi-arrow-right"
              }}</v-icon>
              {{ isLastPhase ? "Hoàn thành lộ trình" : "Hoàn thành phase" }}
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
import PhaseCompletionDialog from "@/components/Roadmap/PhaseCompletionDialog.vue";
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useEventBus } from '@/scripts/logic/eventBus';

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
    phaseId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const eventBus = useEventBus();

    const loading = ref(true);
    const phase = ref(null);
    const activeTab = ref("overview");
    const mood = ref(null);
    const skipReason = ref(null);
    const showSkipConfirm = ref(false);

    // Dữ liệu cho PhaseCompletionDialog
    const showPhaseCompletion = ref(false);
    const currentPhase = ref(1);
    const nextPhase = ref(2);
    const currentPhaseId = ref("phase1");
    const currentPhaseTitle = ref("Nhận diện vấn đề");
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

    // Tạo key lưu trữ dựa trên ID lộ trình
    const getStorageKey = () => `completedPhases_roadmap_${props.roadmapId}`;

    // Lưu trạng thái hoàn thành của các phase vào localStorage
    const saveCompletedPhases = () => {
      localStorage.setItem(getStorageKey(), JSON.stringify(completedPhases.value));
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
        5: false
      };
    };

    // Dữ liệu cho các phase
    const phaseData = {
      "1": {
        id: "1",
        roadmapId: props.roadmapId,
        title: "Nhận diện triệu chứng lo âu",
        description: "Học cách nhận biết các dấu hiệu và triệu chứng của lo âu",
        themeColor: "indigo",
        introduction: "Bước đầu tiên để vượt qua lo âu là nhận diện và thừa nhận vấn đề. Trong phase này, bạn sẽ học cách nhận biết các triệu chứng lo âu, hiểu nguồn gốc của chúng và tác động của chúng đến cuộc sống hàng ngày của bạn.",
        videoUrl: "/videos/phase1.mp4",
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
        canSkip: false,
        requireConfirmation: false, // Đã bỏ yêu cầu xác nhận
        nextPhaseId: "2"
      },
      "2": {
        id: "2",
        roadmapId: props.roadmapId,
        title: "Giảm nhẹ tức thì",
        description: "Học các kỹ thuật thư giãn nhanh để giảm lo âu trong tình huống khẩn cấp",
        themeColor: "teal",
        introduction: "Sau khi đã nhận diện vấn đề, phase tiếp theo là học các kỹ thuật giảm nhẹ tức thì. Những kỹ thuật này sẽ giúp bạn đối phó với các tình huống gây lo âu và giảm triệu chứng ngay lập tức khi chúng xuất hiện.",
        videoUrl: "/videos/phase2.mp4",
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
        canSkip: true,
        requireConfirmation: false,
        nextPhaseId: "3"
      },
      "3": {
        id: "3",
        roadmapId: props.roadmapId,
        title: "Ổn định tâm trí",
        description: "Thực hành chánh niệm và các bài tập thiền để ổn định tâm trí",
        themeColor: "purple",
        introduction: "Suy nghĩ tiêu cực thường là nguyên nhân chính gây ra lo âu. Trong phase này, bạn sẽ học cách nhận diện, thách thức và thay đổi các mẫu suy nghĩ tiêu cực để giảm lo âu và cải thiện sức khỏe tinh thần.",
        videoUrl: "/videos/phase3.mp4",
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
        canSkip: false,
        requireConfirmation: false,
        nextPhaseId: "4"
      },
      "4": {
        id: "4",
        roadmapId: props.roadmapId,
        title: "Đối mặt với vấn đề",
        description: "Phát triển chiến lược để đối mặt với các tình huống gây lo âu",
        themeColor: "blue",
        introduction: "Đối mặt với vấn đề là một bước quan trọng trong việc vượt qua lo âu. Trong phase này, bạn sẽ học cách phát triển các chiến lược để đối mặt với các tình huống gây lo âu và xây dựng sự tự tin.",
        videoUrl: "/videos/phase4.mp4",
        tips: [
          {
            title: "Tiếp cận từng bước",
            content: "Chia nhỏ các tình huống khó khăn thành các bước nhỏ hơn, dễ quản lý hơn",
            icon: "mdi-stairs"
          },
          {
            title: "Thực hành thường xuyên",
            content: "Đối mặt thường xuyên với các tình huống gây lo âu sẽ giúp giảm phản ứng lo âu theo thời gian",
            icon: "mdi-repeat"
          }
        ],
        actions: [
          {
            id: "4-1",
            title: "Xây dựng thang đo lo âu",
            description: "Tạo danh sách các tình huống gây lo âu từ nhẹ đến nặng",
            duration: "15 phút",
            completed: false,
            required: true,
            moodTags: ["Lập kế hoạch", "Tự nhận thức"],
          },
          {
            id: "4-2",
            title: "Thực hành đối mặt",
            description: "Đối mặt với một tình huống gây lo âu nhẹ từ thang đo của bạn",
            duration: "30 phút",
            completed: false,
            required: true,
            moodTags: ["Đối mặt", "Xây dựng sự tự tin"],
          },
          {
            id: "4-3",
            title: "Phản ánh và điều chỉnh",
            description: "Đánh giá trải nghiệm đối mặt và điều chỉnh chiến lược nếu cần",
            duration: "10 phút",
            completed: false,
            required: false,
            moodTags: ["Phản ánh", "Học hỏi"],
          },
        ],
        canSkip: false,
        requireConfirmation: false,
        nextPhaseId: "5"
      },
      "5": {
        id: "5",
        roadmapId: props.roadmapId,
        title: "Đánh giá & Duy trì",
        description: "Đánh giá tiến độ và xây dựng kế hoạch duy trì lâu dài",
        themeColor: "green",
        introduction: "Phase cuối cùng tập trung vào việc đánh giá tiến độ của bạn và xây dựng kế hoạch duy trì lâu dài. Bạn sẽ xem xét những gì đã học được, đánh giá sự tiến bộ và phát triển chiến lược để duy trì những kỹ năng mới.",
        videoUrl: "/videos/phase5.mp4",
        tips: [
          {
            title: "Ghi nhận tiến bộ",
            content: "Dành thời gian để ghi nhận và ăn mừng những tiến bộ bạn đã đạt được",
            icon: "mdi-trophy"
          },
          {
            title: "Xây dựng thói quen",
            content: "Tích hợp các kỹ thuật bạn đã học vào thói quen hàng ngày",
            icon: "mdi-calendar-check"
          }
        ],
        actions: [
          {
            id: "5-1",
            title: "Đánh giá tiến độ",
            description: "Xem lại nhật ký và đánh giá sự tiến bộ của bạn",
            duration: "20 phút",
            completed: false,
            required: true,
            moodTags: ["Đánh giá", "Phản ánh"],
          },
          {
            id: "5-2",
            title: "Xây dựng kế hoạch duy trì",
            description: "Phát triển kế hoạch để duy trì và tiếp tục cải thiện",
            duration: "30 phút",
            completed: false,
            required: true,
            moodTags: ["Lập kế hoạch", "Duy trì"],
          },
          {
            id: "5-3",
            title: "Xác định nguồn hỗ trợ",
            description: "Xác định các nguồn hỗ trợ để giúp bạn duy trì tiến độ",
            duration: "15 phút",
            completed: false,
            required: false,
            moodTags: ["Hỗ trợ", "Kết nối"],
          },
        ],
        canSkip: false,
        requireConfirmation: false,
        nextPhaseId: null
      }
    };

    // Computed properties
    const completedActionsCount = computed(() => {
      if (!phase.value) return 0;
      return phase.value.actions.filter((action) => action.completed).length;
    });

    const canContinue = computed(() => {
      if (!phase.value) return false;

      // Đã bỏ phần kiểm tra confirmation
      const requiredActions = phase.value.actions.filter(
        (action) => action.required
      );
      return requiredActions.every((action) => action.completed);
    });

    const isLastPhase = computed(() => {
      return currentPhase.value === 5;
    });

    const fetchPhaseDetails = () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        // Xác định phase hiện tại dựa trên phaseId
        currentPhase.value = parseInt(props.phaseId);
        currentPhaseId.value = "phase" + currentPhase.value;
        currentPhaseTitle.value = phaseData[props.phaseId].title;

        // Lấy dữ liệu phase
        phase.value = JSON.parse(JSON.stringify(phaseData[props.phaseId]));

        // Xác định phase tiếp theo
        if (phase.value.nextPhaseId) {
          nextPhase.value = parseInt(phase.value.nextPhaseId);
        }

        // Cập nhật dữ liệu cho dialog đánh giá phase
        updatePhaseCompletionData();

        // Cập nhật trạng thái hoàn thành từ localStorage
        loadCompletedPhases();

        loading.value = false;
      }, 500);
    };

    const updatePhaseCompletionData = () => {
      // Cập nhật dữ liệu cho dialog đánh giá phase dựa trên phase hiện tại
      switch (currentPhase.value) {
        case 1:
          phaseDocuments.value = [
            { title: "Hiểu về lo âu và các triệu chứng", url: "/docs/anxiety-symptoms" },
            { title: "Kỹ thuật thở để giảm lo âu", url: "/docs/breathing-techniques" },
            { title: "Nhận diện và thách thức suy nghĩ tiêu cực", url: "/docs/negative-thoughts" }
          ];
          phaseCriteria.value = [
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
          ];
          break;
        case 2:
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
          break;
        case 3:
          phaseDocuments.value = [
            { title: "Hướng dẫn thực hành chánh niệm", url: "/docs/mindfulness-guide" },
            { title: "Kỹ thuật thiền cho người mới bắt đầu", url: "/docs/meditation-beginners" },
            { title: "Ổn định tâm trí trong cuộc sống hàng ngày", url: "/docs/daily-mindfulness" }
          ];
          phaseCriteria.value = [
            {
              title: "Thực hành chánh niệm",
              description: "Bạn đã thực hành chánh niệm ít nhất 5 phút mỗi ngày"
            },
            {
              title: "Nhận biết suy nghĩ",
              description: "Bạn có thể nhận biết suy nghĩ tiêu cực khi chúng xuất hiện"
            },
            {
              title: "Ổn định tâm trí",
              description: "Bạn có thể ổn định tâm trí khi cảm thấy lo âu"
            }
          ];
          break;
        case 4:
          phaseDocuments.value = [
            { title: "Kỹ thuật đối mặt với lo âu", url: "/docs/facing-anxiety" },
            { title: "Xây dựng sự tự tin", url: "/docs/building-confidence" },
            { title: "Chiến lược đối phó với tình huống khó khăn", url: "/docs/coping-strategies" }
          ];
          phaseCriteria.value = [
            {
              title: "Xây dựng thang đo",
              description: "Bạn đã xây dựng thang đo các tình huống gây lo âu"
            },
            {
              title: "Đối mặt với tình huống",
              description: "Bạn đã đối mặt với ít nhất một tình huống gây lo âu"
            },
            {
              title: "Áp dụng kỹ thuật",
              description: "Bạn đã áp dụng các kỹ thuật đã học để đối phó với tình huống"
            }
          ];
          break;
        case 5:
          phaseDocuments.value = [
            { title: "Duy trì tiến bộ dài hạn", url: "/docs/maintaining-progress" },
            { title: "Phòng ngừa tái phát", url: "/docs/relapse-prevention" },
            { title: "Xây dựng lối sống cân bằng", url: "/docs/balanced-lifestyle" }
          ];
          phaseCriteria.value = [
            {
              title: "Đánh giá tiến độ",
              description: "Bạn đã đánh giá tiến độ của mình trong toàn bộ lộ trình"
            },
            {
              title: "Xây dựng kế hoạch",
              description: "Bạn đã xây dựng kế hoạch duy trì lâu dài"
            },
            {
              title: "Xác định nguồn hỗ trợ",
              description: "Bạn đã xác định các nguồn hỗ trợ để giúp duy trì tiến độ"
            }
          ];
          break;
      }
    };

    const viewActionDetails = (action) => {
      // In a real app, this would open a detailed view of the action
      alert(`Chi tiết hành động: ${action.title}\n\n${action.description}`);
    };

    const confirmSkip = () => {
      if (!skipReason.value) return;

      // In a real app, this would send the skip reason to the API
      if (phase.value.nextPhaseId) {
        router.push(
          `/roadmap/${props.roadmapId}/phase/${phase.value.nextPhaseId}`
        );
      } else {
        router.push(`/roadmap/${props.roadmapId}/complete`);
      }
    };

    const completePhase = () => {
      if (!canContinue.value) return;

      // Hiển thị dialog đánh giá phase
      console.log("Hiển thị dialog đánh giá phase");
      showPhaseCompletion.value = true;
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
        if (phase.value.nextPhaseId) {
          // Chuyển đến phase tiếp theo
          router.push(`/roadmap/${props.roadmapId}/phase/${phase.value.nextPhaseId}`);
        } else {
          // Đây là phase cuối cùng, chuyển đến trang hoàn thành
          router.push(`/roadmap/${props.roadmapId}/complete`);
        }
      } else if (evaluationData.moveToNextPhase === "review") {
        // Quay lại trang roadmap detail
        router.push(`/roadmap/${props.roadmapId}`);
      } else {
        // Tạm dừng lộ trình, quay về trang chủ
        router.push("/");
      }
    };

    const syncCompletedPhasesWithRoadmapDetail = () => {
      // Gửi sự kiện để thông báo cho RoadmapDetail cập nhật trạng thái
      // Thêm roadmapId vào dữ liệu để RoadmapDetail biết cập nhật cho lộ trình nào
      eventBus.emit('update-roadmap-phases', {
        roadmapId: props.roadmapId,
        phases: completedPhases.value
      });

      // Lưu trạng thái vào localStorage để đảm bảo nhất quán
      saveCompletedPhases();

      // Log để debug
      console.log(`Đã cập nhật trạng thái phase cho lộ trình ${props.roadmapId}:`, completedPhases.value);
    };

    // Watch for changes in phaseId
    watch(() => props.phaseId, () => {
      loading.value = true;
      fetchPhaseDetails();
      // Reset các giá trị khi chuyển phase
      mood.value = null;
      skipReason.value = null;
      showSkipConfirm.value = false;
      activeTab.value = "overview";
    }, { immediate: true });

    // Watch for changes in roadmapId
    watch(() => props.roadmapId, () => {
      // Khi chuyển lộ trình, cần tải lại trạng thái hoàn thành từ localStorage
      loadCompletedPhases();
    });

    onMounted(() => {
      // Khôi phục trạng thái hoàn thành của các phase từ localStorage
      loadCompletedPhases();

      // Thêm console.log để debug
      console.log(`StepDetail mounted for roadmap ${props.roadmapId}, phase ${props.phaseId}`);
    });

    return {
      loading,
      phase,
      activeTab,
      mood,
      skipReason,
      showSkipConfirm,
      showPhaseCompletion,
      currentPhase,
      nextPhase,
      currentPhaseId,
      currentPhaseTitle,
      phaseDocuments,
      phaseCriteria,
      completedPhases,
      completedActionsCount,
      canContinue,
      isLastPhase,
      viewActionDetails,
      confirmSkip,
      completePhase,
      submitPhaseEvaluation,
      syncCompletedPhasesWithRoadmapDetail
    };
  }
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

.v-dialog-transition-enter-active,
.v-dialog-transition-leave-active {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.5, 1), opacity 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.v-dialog-transition-enter-from,
.v-dialog-transition-leave-to {
  transform: scale(0.9);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
