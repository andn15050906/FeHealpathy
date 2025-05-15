<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <v-container fluid class="pt-16">
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="$router.push('/roadmaps/recommended')"
        >
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
        <v-card
          class="advisor-card mb-6 d-flex align-center"
          style="max-width: 420px"
        >
          <v-avatar size="56" class="mr-3">
            <img :src="advisorImg" alt="Advisor" />
          </v-avatar>
          <div>
            <div class="font-weight-bold">TS. Nguyễn An Tâm</div>
            <div class="text-caption">Chuyên gia tâm lý trị liệu</div>
            <div
              class="text-body-2 mt-1"
              style="font-style: italic; color: #6a39ca"
            >
              "Bạn xứng đáng được sống bình an. Hãy kiên nhẫn với chính mình."
            </div>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            icon
            color="primary"
            class="ml-2"
            title="Nhắn tin cho chuyên gia (sắp ra mắt)"
          >
            <v-icon>mdi-message-text-outline</v-icon>
          </v-btn>
          <v-btn
            icon
            color="success"
            class="ml-1"
            title="Tham gia group chat hỗ trợ (sắp ra mắt)"
          >
            <v-icon>mdi-account-group-outline</v-icon>
          </v-btn>
        </v-card>

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

          <!-- Giới thiệu lộ trình -->
          <v-card class="mb-6">
            <v-card-title class="d-flex align-center">
              <v-icon color="primary" class="mr-2"
                >mdi-information-outline</v-icon
              >
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
                  📌 Lộ trình này được thiết kế bởi các chuyên gia tâm lý với
                  nhiều năm kinh nghiệm. Tuy nhiên, đây không phải là sự thay
                  thế cho việc tư vấn y tế chuyên nghiệp.
                  <a
                    href="#"
                    target="_blank"
                    class="text-primary text-decoration-none"
                  >
                    Tìm hiểu thêm </a
                  >.
                </p>
              </v-alert>
            </v-card-text>
          </v-card>

          <h2 class="text-h5 mb-4">Các bước trong lộ trình</h2>
          <div class="mb-6">
            <v-timeline align="start">
              <v-timeline-item
                v-for="(phase, index) in roadmap.phases"
                :key="phase.id"
                :dot-color="getPhaseColor(phase)"
                size="small"
              >
                <template v-slot:opposite>
                  <div class="text-caption">Bước {{ index + 1 }}</div>
                </template>
                <v-card
                  :class="{
                    'border-primary': phase.current,
                    'bg-success-subtle': phase.completed,
                  }"
                >
                  <v-card-title class="d-flex align-center">
                    {{ phase.title }}
                    <v-chip
                      v-if="phase.current"
                      color="primary"
                      size="small"
                      class="ml-2"
                    >
                      Hiện tại
                    </v-chip>
                    <v-chip
                      v-if="phase.completed"
                      color="success"
                      size="small"
                      class="ml-2"
                    >
                      Hoàn thành
                    </v-chip>
                  </v-card-title>
                  <v-card-text>
                    <p>{{ phase.description }}</p>
                    <div class="d-flex flex-wrap gap-2 mt-3">
                      <v-chip
                        v-if="phase.videoUrl"
                        size="small"
                        color="primary"
                        variant="outlined"
                        class="mr-2"
                      >
                        <v-icon size="small" start>mdi-video</v-icon>
                        Video hướng dẫn
                      </v-chip>
                      <v-chip
                        v-if="phase.audioUrl"
                        size="small"
                        color="primary"
                        variant="outlined"
                        class="mr-2"
                      >
                        <v-icon size="small" start>mdi-music</v-icon>
                        Âm thanh
                      </v-chip>
                      <v-chip
                        v-if="phase.exerciseCount"
                        size="small"
                        color="primary"
                        variant="outlined"
                      >
                        <v-icon size="small" start>mdi-dumbbell</v-icon>
                        {{ phase.exerciseCount }} bài tập
                      </v-chip>
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      :color="phase.current ? 'success' : undefined"
                      :variant="phase.current ? 'elevated' : 'outlined'"
                      :disabled="
                        (!phase.current && !phase.completed) || !roadmap.isPaid
                      "
                      @click="
                        !roadmap.isPaid
                          ? (showUpgradeDialog = true)
                          : goToPhase(phase.id)
                      "
                    >
                      <v-icon v-if="phase.current" start>mdi-play</v-icon>
                      <v-icon v-if="!roadmap.isPaid" start>mdi-lock</v-icon>
                      {{
                        !roadmap.isPaid
                          ? "Thanh toán để mở khóa"
                          : phase.current
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
            <v-btn
              size="large"
              color="primary"
              prepend-icon="mdi-play"
              @click="startRoadmap"
            >
              Bắt đầu lộ trình
            </v-btn>
            <v-btn
              v-if="!roadmap.isPaid"
              size="large"
              color="primary"
              class="ml-4"
              prepend-icon="mdi-credit-card"
              @click="showUpgradeDialog = true"
            >
              Thanh toán để mở khóa
            </v-btn>
          </div>
        </div>

        <!-- Payment Dialog -->
        <v-dialog v-model="showUpgradeDialog" max-width="550" persistent>
          <v-card class="payment-dialog">
            <v-card-title
              class="text-h5 d-flex align-center bg-primary text-white pa-4"
            >
              <v-icon color="white" class="mr-3" size="28"
                >mdi-credit-card</v-icon
              >
              <span>Thanh toán lộ trình</span>
              <v-spacer></v-spacer>
              <v-btn
                icon
                variant="text"
                color="white"
                @click="showUpgradeDialog = false"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="pa-6">
              <div class="text-center mb-6">
                <v-avatar color="primary" size="80" class="mb-4">
                  <v-icon color="white" size="40">mdi-star</v-icon>
                </v-avatar>
                <h3 class="text-h5 mb-2">Nâng cấp trải nghiệm của bạn</h3>
                <p class="text-body-1"
                  >Mở khóa tất cả các tính năng cao cấp và nội dung độc quyền</p
                >
              </div>

              <v-divider class="mb-6"></v-divider>

              <h3 class="text-h6 mb-4 d-flex align-center">
                <v-icon color="primary" class="mr-2">mdi-check-decagram</v-icon>
                Với gói trả phí, bạn sẽ nhận được:
              </h3>

              <v-list class="feature-list mb-6" rounded="lg" border>
                <v-list-item
                  v-for="(feature, i) in roadmap?.paidFeatures || []"
                  :key="i"
                  class="feature-item"
                >
                  <template v-slot:prepend>
                    <v-avatar color="primary" size="36">
                      <v-icon color="white">mdi-check</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title>{{ feature }}</v-list-item-title>
                </v-list-item>
              </v-list>

              <v-divider class="mb-6"></v-divider>

              <div class="pricing-section mb-6">
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <h3 class="text-h6">Gói Premium</h3>
                    <p class="text-caption">Truy cập trọn đời</p>
                  </div>
                  <div class="text-right">
                    <div class="text-caption text-decoration-line-through"
                      >600.000 VND</div
                    >
                    <div class="text-h5 font-weight-bold text-primary"
                      >500.000 VND</div
                    >
                    <div class="text-caption text-success">Tiết kiệm 17%</div>
                  </div>
                </div>
              </div>

              <div class="payment-methods mb-6">
                <h3 class="text-subtitle-1 mb-3">Phương thức thanh toán:</h3>
                <div class="d-flex flex-wrap gap-2">
                  <v-btn variant="outlined" class="payment-method-btn">
                    <v-img
                      src="/src/components/PaymentComponents/payment-system/visa.png"
                      width="40"
                    ></v-img>
                  </v-btn>
                  <v-btn variant="outlined" class="payment-method-btn">
                    <v-img
                      src="/src/components/PaymentComponents/payment-system/mastercard.png"
                      width="40"
                    ></v-img>
                  </v-btn>
                  <v-btn variant="outlined" class="payment-method-btn">
                    <v-img
                      src="/src/components/PaymentComponents/payment-system/momo.png"
                      width="40"
                    ></v-img>
                  </v-btn>
                  <v-btn variant="outlined" class="payment-method-btn">
                    <v-img
                      src="/src/components/PaymentComponents/payment-system/zalopay.png"
                      width="40"
                    ></v-img>
                  </v-btn>
                </div>
              </div>

              <v-alert color="info" variant="tonal" class="mb-6">
                <div class="d-flex align-center">
                  <v-icon color="info" class="mr-2">mdi-shield-check</v-icon>
                  <span
                    >Thanh toán an toàn và bảo mật. Bạn có thể hủy bất kỳ lúc
                    nào.</span
                  >
                </div>
              </v-alert>
            </v-card-text>

            <v-card-actions class="pa-6 pt-0">
              <v-btn
                block
                color="primary"
                size="large"
                class="mb-2"
                @click="processUpgrade"
              >
                <v-icon start>mdi-credit-card</v-icon>
                Thanh toán ngay
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Payment Success Dialog -->
        <v-dialog v-model="showUpgradeSuccess" max-width="450" persistent>
          <v-card class="success-dialog">
            <v-card-text class="text-center pa-8">
              <div class="success-animation mb-6">
                <v-avatar color="success" size="96" class="success-icon">
                  <v-icon color="white" size="48">mdi-check-circle</v-icon>
                </v-avatar>
              </div>

              <h2 class="text-h4 mb-2">Thanh toán thành công!</h2>
              <p class="text-body-1 mb-6">
                Cảm ơn bạn đã thanh toán. Bạn đã có thể truy cập đầy đủ nội dung
                của lộ trình.
              </p>

              <v-btn
                color="primary"
                size="large"
                block
                @click="upgradeComplete"
                class="success-btn"
              >
                <v-icon start>mdi-arrow-right</v-icon>
                Tiếp tục
              </v-btn>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useEventBus } from "@/scripts/logic/eventBus";
import { useRoute, useRouter } from "vue-router";
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
    const showUpgradeDialog = ref(false);
    const showUpgradeSuccess = ref(false);

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
        // Kiểm tra xem có phải roadmap đã thanh toán không
        const isPaid =
          localStorage.getItem(`paid_roadmap_${props.id}`) === "true";

        roadmap.value = {
          id: props.id,
          title: props.id === "1" ? "Vượt qua lo âu" : "Xây dựng sự tự tin",
          description:
            "Học cách nhận biết và vượt qua các triệu chứng lo âu phổ biến",
          progress: 0,
          isPaid: isPaid,
          introText: [
            "Lộ trình này được thiết kế dựa trên các phương pháp đã được chứng minh hiệu quả trong việc hỗ trợ sức khỏe tinh thần.",
            "Trong quá trình này, bạn sẽ học cách nhận diện những suy nghĩ tiêu cực, thách thức chúng và thay thế bằng những suy nghĩ tích cực hơn.",
            "Mỗi bước trong lộ trình sẽ cung cấp cho bạn các công cụ và kỹ thuật thực tế để cải thiện sức khỏe tinh thần.",
          ],
          paidFeatures: [
            "Truy cập đầy đủ tất cả các bước và công cụ",
            "Bài tập thực hành chuyên sâu",
            "Tài liệu hướng dẫn chi tiết",
            "Âm nhạc và thiền định cao cấp",
            "Theo dõi tiến độ cá nhân",
            "Hỗ trợ từ chuyên gia",
          ],
          phases: [
            {
              id: "1",
              title: "Nhận diện vấn đề",
              description:
                "Nhận biết các triệu chứng lo âu và hiểu nguồn gốc của chúng",
              videoUrl: "/videos/phase1.mp4",
              exerciseCount: 2,
              completed: false,
              current: true,
              themeColor: "indigo",
            },
            {
              id: "2",
              title: "Giảm nhẹ tức thì",
              description:
                "Học các kỹ thuật thư giãn nhanh để giảm lo âu trong tình huống khẩn cấp",
              videoUrl: "/videos/phase2.mp4",
              audioUrl: "/audio/relaxation.mp3",
              exerciseCount: 3,
              completed: false,
              current: false,
              themeColor: "teal",
            },
            {
              id: "3",
              title: "Ổn định tâm trí",
              description:
                "Thực hành chánh niệm và các bài tập thiền để ổn định tâm trí",
              videoUrl: "/videos/phase3.mp4",
              audioUrl: "/audio/meditation.mp3",
              exerciseCount: 4,
              completed: false,
              current: false,
              themeColor: "purple",
            },
            {
              id: "4",
              title: "Đối mặt với vấn đề",
              description:
                "Phát triển chiến lược để đối mặt với các tình huống gây lo âu",
              videoUrl: "/videos/phase4.mp4",
              exerciseCount: 5,
              completed: false,
              current: false,
              themeColor: "blue",
            },
            {
              id: "5",
              title: "Duy trì và phát triển",
              description:
                "Xây dựng kế hoạch duy trì lâu dài và tiếp tục phát triển",
              videoUrl: "/videos/phase5.mp4",
              exerciseCount: 3,
              completed: false,
              current: false,
              themeColor: "green",
            },
          ],
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
        if (!roadmap.value.isPaid) {
          showUpgradeDialog.value = true;
        } else {
          goToPhase(currentPhase.id);
        }
      }
    };

    const goToPhase = (phaseId) => {
      // Nếu lộ trình chưa thanh toán, hiển thị dialog thanh toán
      if (!roadmap.value.isPaid) {
        showUpgradeDialog.value = true;
        return;
      }

      router.push(`/roadmap/${roadmap.value.id}/phase/${phaseId}`);
    };

    const processUpgrade = () => {
      // Giả lập quá trình thanh toán
      setTimeout(() => {
        showUpgradeDialog.value = false;
        showUpgradeSuccess.value = true;
      }, 1500);
    };

    const upgradeComplete = () => {
      // Lưu trạng thái đã thanh toán vào localStorage
      localStorage.setItem(`paid_roadmap_${props.id}`, "true");

      // Cập nhật trạng thái roadmap
      if (roadmap.value) {
        roadmap.value.isPaid = true;
      }

      showUpgradeSuccess.value = false;
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
      showUpgradeDialog,
      showUpgradeSuccess,
      getPhaseColor,
      startRoadmap,
      goToPhase,
      processUpgrade,
      upgradeComplete,
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

/* Remove these CSS classes
.paid-locked {
  position: relative;
  overflow: hidden;
}

.paid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #6a39ca;
  z-index: 1;
  backdrop-filter: blur(2px);
}

.paid-overlay span {
  margin-top: 8px;
  font-weight: 500;
}
*/

/* Payment Dialog Styling */
.payment-dialog {
  border-radius: 12px;
  overflow: hidden;
}

.feature-list {
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 8px;
}

.feature-item {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.feature-item:last-child {
  border-bottom: none;
}

.payment-method-btn {
  min-width: 80px;
  height: 50px;
  border-radius: 8px;
}

/* Success Dialog Styling */
.success-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.success-animation {
  animation: successPop 0.5s ease-out;
}

.success-icon {
  box-shadow: 0 0 0 8px rgba(76, 175, 80, 0.2);
}

.success-btn {
  animation: fadeInUp 0.5s ease-out 0.3s both;
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
  background: linear-gradient(
    to right,
    rgba(106, 57, 202, 0.05),
    rgba(106, 57, 202, 0.01)
  );
  padding: 16px 20px;
  border-radius: 12px;
  border-left: 4px solid #6a39ca;
}

@keyframes successPop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
