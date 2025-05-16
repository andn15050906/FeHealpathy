<template>
  <div class="roadmap-container">
    <div class="roadmap-content">

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
import { phaseDetails } from "@/scripts/data/roadmapData.js";

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
    const phaseDocuments = ref([]);
    const phaseCriteria = ref([]);

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
        
        var roadmapId = props.roadmapId;
        roadmapId = 1;
        
        // Lấy dữ liệu phase
        if (phaseDetails[roadmapId] && phaseDetails[roadmapId][props.phaseId]) {
          phase.value = JSON.parse(JSON.stringify(phaseDetails[roadmapId][props.phaseId]));
          currentPhaseTitle.value = phase.value.title;
          
          // Xác định phase tiếp theo
          if (phase.value.nextPhaseId) {
            nextPhase.value = parseInt(phase.value.nextPhaseId);
          }
          
          // Cập nhật dữ liệu cho dialog đánh giá phase
          if (phase.value.completionCriteria) {
            phaseCriteria.value = phase.value.completionCriteria;
          }
          
          if (phase.value.resources) {
            phaseDocuments.value = phase.value.resources;
          }
        } else {
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

        // Cập nhật trạng thái hoàn thành từ localStorage
        loadCompletedPhases();

        loading.value = false;
      }, 500);
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
  margin-bottom: 25px;
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
