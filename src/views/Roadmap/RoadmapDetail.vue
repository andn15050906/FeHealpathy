<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <v-btn variant="text" color="primary" class="mb-4" prepend-icon="mdi-arrow-left"
        @click="$router.push('/')">
        Quay lại danh sách lộ trình
      </v-btn>

      <!-- Lời chào và động viên -->
      <div v-if="roadmap" class="healing-header mb-4">
        <h2 class="text-h5 font-weight-bold mb-1" style="color: #6a39ca">
          Chào mừng bạn đến với hành trình {{ roadmap.title }}
        </h2>
        <div class="text-body-1" style="color: #444">
          Bạn không đơn độc – chúng tôi sẽ đồng hành cùng bạn từng bước nhỏ. Hãy
          tiến triển theo nhịp độ của riêng bạn và tự hào vì đã bắt đầu hành
          trình này.
        </div>
      </div>

      <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </div>

      <div v-else-if="roadmap">
        <!-- Payment Required Dialog -->
        <v-dialog v-model="showPaymentDialog" max-width="500">
          <v-card>
            <v-card-title class="headline">Yêu cầu thanh toán</v-card-title>
            <v-card-text>
              <p class="mt-4">Để truy cập đầy đủ lộ trình "{{ roadmap.title }}", bạn cần thanh toán:</p>
              <div class="price-section">
                <span class="price">{{ formatPrice(roadmap.price) }}</span>
                <span class="vat">(Đã bao gồm VAT)</span>
              </div>
              <div class="features mt-4" v-if="roadmap.features && roadmap.features.length">
                <p class="font-weight-bold mb-2">Quyền lợi khi mua:</p>
                <ul>
                  <li v-for="(feature, index) in roadmap.features" :key="index">
                    {{ feature }}
                  </li>
                </ul>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" variant="text" @click="showPaymentDialog = false">
                Để sau
              </v-btn>
              <v-btn color="primary" @click="proceedToPayment">
                Thanh toán ngay
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <div class="d-flex align-center mb-6">
          <h1 class="text-h4 font-weight-bold">{{ roadmap.title }}</h1>
          <v-chip
            v-if="roadmap.price > 0"
            color="primary"
            class="ml-4"
          >
            <v-icon start size="small">mdi-cash</v-icon>
            {{ formatPrice(roadmap.price) }}
          </v-chip>
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
                nhiều năm kinh nghiệm. Tuy nhiên, đây không phải là sự thay thế
                cho việc tư vấn y tế chuyên nghiệp.
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
                  <div v-if="isJsonArray(phase.description)" style="margin-bottom: -20px;">
                    <div v-for="(item, idx) in parseJson(phase.description)" :key="idx" class="mb-2">
                      <p class="font-weight-bold mb-1">{{ item.Title }}</p>
                    </div>
                  </div>
                  <div v-else>
                    <p>{{ phase.description }}</p>
                  </div>

                  <div class="d-flex flex-wrap gap-2 mt-3">
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
                  <v-btn 
                    :color="phase.current ? 'success' : undefined"
                    :variant="phase.current ? 'elevated' : 'outlined'" 
                    :disabled="(!phase.current && !phase.completed) || (roadmap.price > 0 && !isReturningUser)"
                    @click="goToPhase(phase.id)"
                  >
                    <v-icon v-if="roadmap.price > 0 && !isReturningUser" start>mdi-lock</v-icon>
                    <v-icon v-else-if="phase.current" start>mdi-play</v-icon>
                    {{
                      phase.current
                        ? (roadmap.price > 0 && !isReturningUser ? "Yêu cầu thanh toán" : "Bắt đầu bước này")
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
          <v-btn 
            size="large" 
            color="primary" 
            prepend-icon="mdi-play" 
            @click="handleStartRoadmap"
          >
            <v-icon v-if="roadmap.price > 0 && !isReturningUser" start>mdi-lock</v-icon>
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
import { useRouter } from "vue-router";
import {
  getRoadmapById,
  getRoadmapSteps,
} from "@/scripts/api/services/roadmapService";
import advisorImg from "@/img/advisor.jpg";

export default {
  name: "RoadmapDetail",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const showPaymentDialog = ref(false);
    const isJsonArray = (str) => {
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed);
      } catch (e) {
        return false;
      }
    };

    const parseJson = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return [];
      }
    };

    const roadmap = ref({
      id: "",
      title: "",
      description: "",
      introText: [],
      phases: [],
      price: 0,
    });
    const completedPhases = ref({
      1: false,
      2: false,
      3: false,
      4: false,
      5: false,
    });
    const loading = ref(true);
    const isReturningUser = ref(false);

    const getStorageKey = () => `completedPhases_roadmap_${props.id}`;

    const saveCompletedPhases = () => {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify(completedPhases.value)
      );
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
        5: false,
      };
    };

    const updatePhaseStatus = () => {
      if (!roadmap.value?.phases || !Array.isArray(roadmap.value.phases)) return;

      const hasBEStatus = roadmap.value.phases.some(
        (p) => p.current || p.completed
      );

      if (hasBEStatus) {
        return;
      }

      let foundCurrent = false;
      for (const phase of roadmap.value.phases) {
        if (!phase || typeof phase !== 'object') continue;
        const phaseId = parseInt(phase.id);
        if (completedPhases.value[phaseId]) {
          phase.completed = true;
          phase.current = false;
        } else if (!foundCurrent) {
          phase.current = true;
          foundCurrent = true;
        } else {
          phase.current = false;
          phase.completed = false;
        }
      }
    };

    const fetchRoadmap = async () => {
      try {
        loading.value = true;

        const [roadmapResponse, stepsResponse] = await Promise.all([
          getRoadmapById(props.id),
          getRoadmapSteps(props.id),
        ]);

        if (roadmapResponse) {
          // parse introText nếu là string JSON
          if (typeof roadmapResponse.introText === "string") {
            try {
              roadmapResponse.introText = JSON.parse(roadmapResponse.introText);
            } catch (e) {
              roadmapResponse.introText = [roadmapResponse.introText];
            }
          }

          roadmap.value = roadmapResponse;

          if (!roadmap.value.phases || roadmap.value.phases.length === 0) {
            roadmap.value.phases = stepsResponse;
          }

          updatePhaseStatus();
        }
      } catch (error) {
        console.error("Error fetching roadmap:", error);
      } finally {
        loading.value = false;
      }
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

    const handleStartRoadmap = () => {
      if (roadmap.value.price > 0 && !isReturningUser.value) {
        showPaymentDialog.value = true;
      } else {
        startRoadmap();
      }
    };

    const proceedToPayment = () => {
      showPaymentDialog.value = false;
      router.push(`/payment/roadmap/${roadmap.value.id}`);
    };

    const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    };

    const goToPhase = (phaseId) => {
      if (roadmap.value.price > 0 && !isReturningUser.value) {
        showPaymentDialog.value = true;
        return;
      }
      router.push(`/roadmap/${roadmap.value.id}/phase/${phaseId}`);
    };

    const eventBus = useEventBus();

    const handleUpdateRoadmapPhases = (data) => {
      if (data?.roadmapId === props.id && completedPhases.value) {
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
      try {
        loadCompletedPhases();
        fetchRoadmap();
        eventBus.on("update-roadmap-phases", handleUpdateRoadmapPhases);
        console.log(
          `RoadmapDetail mounted for roadmap ${props.id}, eventBus listener registered`
        );
      } catch (error) {
        console.error('Error in RoadmapDetail onMounted:', error);
      }
    });

    onBeforeUnmount(() => {
      if (eventBus && typeof eventBus.off === 'function') {
        eventBus.off("update-roadmap-phases", handleUpdateRoadmapPhases);
      }
      console.log(
        `RoadmapDetail unmounted for roadmap ${props.id}, eventBus listener removed`
      );
    });

    return {
      roadmap,
      completedPhases,
      getPhaseColor,
      startRoadmap,
      goToPhase,
      loading,
      showPaymentDialog,
      isReturningUser,
      handleStartRoadmap,
      proceedToPayment,
      formatPrice,
      isJsonArray,
      parseJson,
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

.advisor-card {
  border-radius: 12px;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #6a39ca;
}

.healing-header {
  background: linear-gradient(to right,
      rgba(106, 57, 202, 0.05),
      rgba(106, 57, 202, 0.01));
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 4px solid #6a39ca;
}
</style>