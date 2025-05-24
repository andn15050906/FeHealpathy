<template>
  <div class="roadmap-container">
    <div class="roadmap-content">

      <v-btn variant="text" color="primary" class="mb-4" prepend-icon="mdi-arrow-left"
        @click="$router.push(`/roadmap/${roadmapId}`)">
        Quay lại lộ trình
      </v-btn>

      <div v-if="phase">
        <div class="d-flex flex-column md:flex-row justify-space-between align-start mb-6">
          <div>
            <h1 class="text-h4 font-weight-bold">{{ parsedTitle }}</h1>
            <div class="d-flex align-center mt-2">
              <v-chip color="primary">Phase {{ phase.index + 1 }}</v-chip>
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
            Hành động ({{ completedActionsCount }}/{{ parsedActions.length }})
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <v-window-item value="overview">
            <div class="step-tab-wrapper">
              <v-card
                class="mb-6 phase-intro-card"
                elevation="2"
                :style="{ 
                  backgroundColor: '#fff',
                  borderRadius: '16px'
                }"
              >
                <v-card-text class="phase-intro-content">
                  <!-- Giới thiệu bước section -->
                  <div class="intro-section">
                    <h3 class="intro-title">
                      <v-icon :color="phaseColor" class="mr-2">mdi-information-outline</v-icon>
                      Giới thiệu bước
                    </h3>
                    <p class="intro-description">
                      {{ parsedDescription }}
                    </p>
                  </div>

                  <!-- Hướng dẫn video section -->
                  <div v-if="phase.videoUrl" class="video-section">
                    <h3 class="section-title">
                      <v-icon :color="phaseColor" class="mr-2">mdi-play-circle-outline</v-icon>
                      Hướng dẫn video
                    </h3>
                    <div class="video-placeholder">
                      <v-btn
                        icon="mdi-play"
                        :color="phaseColor"
                        size="large"
                        variant="flat"
                        elevation="2"
                      ></v-btn>
                    </div>
                  </div>

                  <!-- Mẹo hữu ích section -->
                  <div v-if="parsedIntroduction" class="tips-section">
                    <h3 class="section-title">
                      <v-icon :color="phaseColor" class="mr-2">mdi-lightbulb-outline</v-icon>
                      Mẹo hữu ích
                    </h3>
                    <div class="tips-content">
                      <div class="tip-item" v-for="(tip, index) in parsedTipsArray" :key="index">
                        <v-icon :color="phaseColor" size="20" class="tip-icon">mdi-check-circle</v-icon>
                        <span class="tip-text">{{ tip }}</span>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </div>
          </v-window-item>

          <v-window-item value="actions">
            <div class="step-tab-wrapper">
              <v-row>
                <v-col v-for="action in parsedActions" :key="action.id || action.Id || action.Title" cols="12" md="6">
                  <v-card :class="{ 'bg-success-subtle': action.completed }">
                    <v-card-title class="d-flex justify-space-between align-center">
                      {{ action.Title || action.title }}
                      <v-chip :color="action.Required ? 'error' : phaseColor" size="small">
                        {{ action.Required ? "Bắt buộc" : "Tùy chọn" }}
                      </v-chip>
                    </v-card-title>
                    <v-card-subtitle class="d-flex align-center">
                      <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>
                      {{ action.Duration || action.duration }}
                    </v-card-subtitle>
                    <v-card-text>
                      <p>{{ action.Description || action.description }}</p>

                      <div v-if="action.Tools && action.Tools.length > 0" class="mt-4">
                        <h4 class="text-subtitle-1 mb-2">Công cụ hỗ trợ:</h4>
                        <v-list density="compact">
                          <v-list-item v-for="tool in action.Tools" :key="tool.Id" :title="tool.Name"
                            :subtitle="tool.Description" :to="tool.Link" link>
                            <template v-slot:prepend>
                              <v-icon :color="phaseColor">{{ tool.Icon || 'mdi-tools' }}</v-icon>
                            </template>
                          </v-list-item>
                        </v-list>
                      </div>

                      <div v-if="action.MoodTags && action.MoodTags.length > 0" class="mt-2">
                        <v-chip v-for="tag in action.MoodTags" :key="tag" size="small" :color="phaseColor"
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

          <v-btn size="large" :color="canContinue ? 'success' : phaseColor" :disabled="!canContinue"
            @click="completePhase">
            <v-icon start>{{
              isLastPhase ? "mdi-check-circle" : "mdi-arrow-right"
            }}</v-icon>
            {{ isLastPhase ? "Hoàn thành lộ trình" : "Hoàn thành phase" }}
          </v-btn>
        </div>
      </div>

    </div>

    <PhaseCompletionDialog :show="showPhaseCompletion" :phase-id="currentPhaseId" :phase-title="currentPhaseTitle"
      :documents="phaseDocuments" :criteria-list="phaseCriteria" @close="showPhaseCompletion = false"
      @submit="submitPhaseEvaluation" />
  </div>
</template>

<script>
import PhaseCompletionDialog from "@/components/Roadmap/PhaseCompletionDialog.vue";
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useEventBus } from '@/scripts/logic/eventBus';
import { getPhaseDetailsById } from "@/scripts/api/services/roadmapService";

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

    const phase = ref({
      id: "",
      roadmapId: "",
      title: "",
      description: "",
      themeColor: "",
      introduction: "",
      videoUrl: "",
      tips: [],
      actions: [],
      canSkip: false,
      requireConfirmation: false,
      nextPhaseId: "",
      completionCriteria: [],
      resources: [],
    });
    const activeTab = ref("overview");
    const mood = ref(null);
    const skipReason = ref(null);
    const showSkipConfirm = ref(false);

    const showPhaseCompletion = ref(false);
    const currentPhase = ref(1);
    const nextPhase = ref(2);
    const currentPhaseId = ref("phase1");
    const currentPhaseTitle = ref("Nhận diện vấn đề");
    const phaseDocuments = ref([]);
    const phaseCriteria = ref([]);

    const completedPhases = ref({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false
    });

    const phaseColors = [
      'primary', 'success', 'info', 'warning', 'error'
    ];
    const phaseColor = computed(() => {
      if (!phase.value || typeof phase.value.index !== 'number') return 'primary';
      return phaseColors[phase.value.index % phaseColors.length];
    });

    const phasePastelColors = [
      "#e3e0f7", // tím nhạt
      "#e0f7fa", // xanh ngọc nhạt
      "#fff9e5", // vàng nhạt
      "#e6f7e0", // xanh lá nhạt
      "#ffe0e0", // hồng nhạt
    ];
    const phasePastelColor = computed(() => {
      if (!phase.value || typeof phase.value.index !== 'number') return phasePastelColors[0];
      return phasePastelColors[phase.value.index % phasePastelColors.length];
    });

    const getStorageKey = () => `completedPhases_roadmap_${props.roadmapId}`;

    const saveCompletedPhases = () => {
      localStorage.setItem(getStorageKey(), JSON.stringify(completedPhases.value));
    };

    const loadCompletedPhases = () => {
      const savedPhases = localStorage.getItem(getStorageKey());
      if (savedPhases) {
        completedPhases.value = JSON.parse(savedPhases);
      } else {
        resetCompletedPhases();
      }
    };

    const resetCompletedPhases = () => {
      completedPhases.value = {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false
      };
    };

    const parseJsonString = (jsonString) => {
      if (!jsonString) return null;

      try {
        if (typeof jsonString === 'object') return jsonString;

        return JSON.parse(jsonString);
      } catch (error) {
        console.error("Error parsing JSON string:", error);
        return jsonString; 
      }
    };

    const parsedTitle = computed(() => {
      if (!phase.value) return "";

      if (typeof phase.value.title === 'string' && phase.value.title.startsWith('{') && phase.value.title.includes('Title')) {
        try {
          const parsedData = parseJsonString(phase.value.title);
          return parsedData.Title || "Untitled Phase";
        } catch (e) {
          return phase.value.title;
        }
      }

      return phase.value.title;
    });

    const parsedDescription = computed(() => {
      if (!phase.value || !phase.value.description) return "";

      // Nếu là chuỗi JSON array
      if (typeof phase.value.description === 'string' && phase.value.description.trim().startsWith('[')) {
        try {
          const arr = parseJsonString(phase.value.description);
          if (Array.isArray(arr)) {
            // Ghép tất cả Description lại, mỗi cái xuống dòng
            return arr.map(item => item.Description).filter(Boolean).join('\n');
          }
        } catch (e) {
          return phase.value.description;
        }
      }

      // Nếu là object array
      if (Array.isArray(phase.value.description)) {
        return phase.value.description.map(item => item.Description).filter(Boolean).join('\n');
      }

      // Nếu là object
      if (typeof phase.value.description === 'object' && phase.value.description.Description) {
        return phase.value.description.Description;
      }

      // Nếu là chuỗi thường
      return phase.value.description;
    });

    const parsedIntroduction = computed(() => {
      if (!phase.value) return "";

      if (typeof phase.value.introduction === 'string' && phase.value.introduction.startsWith('{')) {
        try {
          const parsedData = parseJsonString(phase.value.introduction);
          return parsedData.Introduction || parsedData.Content || "";
        } catch (e) {
          return phase.value.introduction;
        }
      }

      return phase.value.introduction;
    });

    const parsedTips = computed(() => {
      if (!phase.value || !phase.value.tips) return [];

      if (typeof phase.value.tips === 'string' && phase.value.tips.startsWith('[')) {
        try {
          return parseJsonString(phase.value.tips);
        } catch (e) {
          return [];
        }
      }

      return phase.value.tips;
    });

    const parsedActions = computed(() => {
      if (!phase.value || !phase.value.recommendations) return [];
      let recs = phase.value.recommendations;
      if (typeof recs === 'string' && recs.startsWith('[')) {
        try {
          recs = JSON.parse(recs);
        } catch (e) {
          return [];
        }
      }
      if (Array.isArray(recs)) {
        // Lọc các recommendation là hành động (IsAction = true hoặc isAction = true)
        return recs.filter(rec => rec.IsAction === true || rec.isAction === true);
      }
      return [];
    });

    const completedActionsCount = computed(() => {
      if (!parsedActions.value) return 0;
      return parsedActions.value.filter(action => action.completed).length;
    });

    const canContinue = computed(() => {
      if (!parsedActions.value) return false;

      const requiredActions = parsedActions.value.filter(
        (action) => action.required
      );
      return requiredActions.length === 0 || requiredActions.every((action) => action.completed);
    });

    const isLastPhase = computed(() => {
      return currentPhase.value === 5;
    });

    const fetchPhaseDetails = async () => {
      try {
        const phaseData = await getPhaseDetailsById(props.phaseId);

        if (phaseData) {
          phase.value = {
            ...phaseData,
            actions: Array.isArray(phaseData.actions) ? phaseData.actions : [],
            tips: Array.isArray(phaseData.tips) ? phaseData.tips : [],
            completionCriteria: Array.isArray(phaseData.completionCriteria) ? phaseData.completionCriteria : [],
            resources: Array.isArray(phaseData.resources) ? phaseData.resources : [],
            themeColor: phaseData.themeColor || 'primary'
          };

          currentPhase.value = phaseData.index + 1;
          currentPhaseId.value = "phase" + currentPhase.value;
          currentPhaseTitle.value = phaseData.title || "Phase " + currentPhase.value;
          
          if (phaseData.nextPhaseId) {
            nextPhase.value = parseInt(phaseData.nextPhaseId);
          }

          console.log("Phase data loaded successfully:", phase.value);
        } else {
          console.warn(`No phase found with ID: ${props.phaseId}`);
          phase.value = {
            id: props.phaseId,
            roadmapId: props.roadmapId,
            title: "Phase không tồn tại",
            description: "Không tìm thấy thông tin về phase này",
            themeColor: "grey",
            introduction: "Không có thông tin về phase này.",
            actions: []
          };
        }

        loadCompletedPhases();
      } catch (error) {
        console.error("Error fetching phase details:", error);
        phase.value = {
          id: props.phaseId,
          roadmapId: props.roadmapId,
          title: "Lỗi khi tải dữ liệu",
          description: "Không thể tải thông tin về phase này",
          themeColor: "grey",
          introduction: "Đã xảy ra lỗi khi tải dữ liệu phase.",
          actions: []
        };
      }
    };

    const viewActionDetails = (action) => {
      alert(`Chi tiết hành động: ${action.title}\n\n${action.description}`);
    };

    const confirmSkip = () => {
      if (!skipReason.value) return;

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

      console.log("Hiển thị dialog đánh giá phase");
      showPhaseCompletion.value = true;
    };

    const submitPhaseEvaluation = (evaluationData) => {
      showPhaseCompletion.value = false;

      completedPhases.value[currentPhase.value] = true;

      syncCompletedPhasesWithRoadmapDetail();

      if (evaluationData.moveToNextPhase === "yes") {
        if (phase.value.nextPhaseId) {
          router.push(`/roadmap/${props.roadmapId}/phase/${phase.value.nextPhaseId}`);
        } else {
          router.push(`/roadmap/${props.roadmapId}/complete`);
        }
      } else if (evaluationData.moveToNextPhase === "review") {
        router.push(`/roadmap/${props.roadmapId}`);
      } else {
        router.push("/");
      }
    };

    const syncCompletedPhasesWithRoadmapDetail = () => {
      eventBus.emit('update-roadmap-phases', {
        roadmapId: props.roadmapId,
        phases: completedPhases.value
      });

      saveCompletedPhases();
    };

    watch(() => props.phaseId, () => {
      fetchPhaseDetails();
      mood.value = null;
      skipReason.value = null;
      showSkipConfirm.value = false;
      activeTab.value = "overview";
    }, { immediate: true });

    watch(() => props.roadmapId, () => {
      loadCompletedPhases();
    });

    onMounted(() => {
      loadCompletedPhases();
    });

    const parsedTipsArray = computed(() => {
      if (!parsedIntroduction.value) return [];
      
      // Split by common separators and filter out empty strings
      const tips = parsedIntroduction.value
        .split(/[.\n;]/)
        .map(tip => tip.trim())
        .filter(tip => tip.length > 0);
        
      return tips.length > 0 ? tips : [parsedIntroduction.value];
    });

    return {
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
      syncCompletedPhasesWithRoadmapDetail,
      parsedTitle,
      parsedDescription,
      parsedIntroduction,
      parsedTips,
      parsedActions,
      phaseColor,
      phasePastelColor,
      parsedTipsArray
    };
  }
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
}

.roadmap-content {
  flex: 1;
  width: 100%;
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
  max-width: 1200px;
  min-width: 1200px;
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

.phase-intro-card {
  transition: all 0.3s ease;
}

.phase-intro-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
}

.phase-intro-content {
  padding: 32px !important;
}

.intro-section {
  margin-bottom: 32px;
}

.intro-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.intro-description {
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
  margin: 0;
}

.video-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
}

.video-placeholder {
  background: rgba(255, 255, 255, 0.7);
  height: 200px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.video-placeholder:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: scale(1.02);
}

.tips-section {
  margin-bottom: 16px;
}

.tips-content {
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.tip-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  padding: 8px 0;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-icon {
  margin-right: 12px;
  margin-top: 2px;
  flex-shrink: 0;
}

.tip-text {
  font-size: 1rem;
  line-height: 1.5;
  color: #4a5568;
  flex: 1;
}
</style>
