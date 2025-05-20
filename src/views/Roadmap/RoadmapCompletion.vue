<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <div
        v-if="loading"
        class="d-flex justify-center align-center"
        style="height: 300px"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="64"
        ></v-progress-circular>
      </div>

      <template v-else-if="error">
        <v-alert type="error" class="mb-4">
          {{ error }}
          <v-btn color="error" variant="text" @click="fetchCompletionData"
            >Thử lại</v-btn
          >
        </v-alert>
      </template>

      <template v-else>
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="$router.push(`/roadmap/${id}`)"
        >
          Quay lại lộ trình
        </v-btn>

        <v-card
          class="mb-6 text-center py-6 bg-primary text-white"
          elevation="1"
        >
          <v-icon size="64" class="mb-2">mdi-trophy-outline</v-icon>
          <h2 class="text-h4 mb-2">Chúc mừng bạn đã hoàn thành lộ trình!</h2>
          <p class="text-body-1">
            Đây là một thành tựu đáng tự hào. Hãy tiếp tục duy trì những thói
            quen tốt bạn đã xây dựng.
          </p>
        </v-card>

        <v-row>
          <v-col cols="12" md="4">
            <v-card class="text-center" height="100%">
              <v-card-text>
                <v-icon color="primary" size="48" class="mb-2"
                  >mdi-calendar-check</v-icon
                >
                <h3 class="text-h5 mb-1">Số ngày hoạt động</h3>
                <p class="text-h3 text-primary font-weight-bold">{{
                  statistics.daysActive
                }}</p>
                <p class="text-body-2 text-grey">ngày</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="text-center" height="100%">
              <v-card-text>
                <v-icon color="success" size="48" class="mb-2"
                  >mdi-check-circle</v-icon
                >
                <h3 class="text-h5 mb-1">Hành động đã hoàn thành</h3>
                <p class="text-h3 text-success font-weight-bold">{{
                  statistics.actionsCompleted
                }}</p>
                <p class="text-body-2 text-grey">hành động</p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="text-center" height="100%">
              <v-card-text>
                <v-icon color="amber-darken-2" size="48" class="mb-2"
                  >mdi-medal</v-icon
                >
                <h3 class="text-h5 mb-1">Tiến bộ cảm xúc</h3>
                <div class="d-flex justify-center align-center my-2">
                  <v-progress-linear
                    :model-value="statistics.emotionalImprovement"
                    color="success"
                    height="8"
                    class="w-50"
                  ></v-progress-linear>
                  <span class="ml-2 font-weight-medium"
                    >{{ statistics.emotionalImprovement }}%</span
                  >
                </div>
                <p class="text-body-2 text-grey">cải thiện</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div style="height: 32px"></div>
        <v-card class="my-6">
          <v-card-title>Đánh giá sự cải thiện của bạn</v-card-title>
          <v-card-subtitle>
            Vui lòng cho chúng tôi biết mức độ cải thiện của bạn sau khi hoàn
            thành lộ trình này
          </v-card-subtitle>
          <v-card-text>
            <v-radio-group v-model="improvement">
              <v-radio
                v-for="option in improvementOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                color="primary"
              ></v-radio>
            </v-radio-group>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              color="primary"
              @click="submitSurvey"
              :disabled="!improvement"
            >
              Gửi phản hồi
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card
          v-if="showCoupon"
          class="my-6 border-dashed border-2 border-amber"
        >
          <v-card-title class="text-center text-amber-darken-2"
            >Mã giảm giá đặc biệt</v-card-title
          >
          <v-card-text class="text-center">
            <div class="coupon-code mb-4">
              <p class="text-h4 font-weight-bold text-amber-darken-2">{{
                coupon.code
              }}</p>
            </div>
            <p class="text-body-2 text-amber-darken-1">
              {{ coupon.description }}
            </p>
          </v-card-text>
        </v-card>

        <v-card v-if="improvement === 'little'" class="my-6 bg-blue-lighten-5">
          <v-card-title>Gợi ý lộ trình nâng cao</v-card-title>
          <v-card-subtitle>
            Dựa trên phản hồi của bạn, chúng tôi gợi ý các lộ trình bổ sung sau
          </v-card-subtitle>
          <v-card-text>
            <v-list bg-color="transparent">
              <v-list-item
                v-for="(roadmap, index) in advancedRoadmaps"
                :key="index"
              >
                <template v-slot:prepend>
                  <v-icon color="amber-darken-2">mdi-star</v-icon>
                </template>
                <v-list-item-title>{{ roadmap.title }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  roadmap.description
                }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-btn variant="outlined" size="small">Xem chi tiết</v-btn>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <div class="text-center mt-8">
          <v-btn
            size="large"
            color="success"
            prepend-icon="mdi-home"
            @click="$router.push('/')"
          >
            Quay lại trang chủ
          </v-btn>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getCompletionData } from "@/scripts/api/services/roadmapService";

export default {
  name: "RoadmapCompletion",
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      error: null,
      improvement: null,
      showCoupon: false,
      improvementOptions: [
        { label: "Tôi đã cải thiện một chút", value: "little" },
        { label: "Tôi đã cải thiện vừa phải", value: "moderate" },
        { label: "Tôi đã cải thiện đáng kể", value: "significant" },
      ],
      statistics: {
        daysActive: 0,
        actionsCompleted: 0,
        emotionalImprovement: 0,
      },
      coupon: {
        code: "",
        description: "",
      },
      advancedRoadmaps: [],
    };
  },
  created() {
    this.fetchCompletionData();
  },
  methods: {
    async fetchCompletionData() {
      try {
        this.loading = true;
        this.error = null;

        const response = await getCompletionData();

        if (response) {
          if (response.statistics) {
            this.statistics = {
              daysActive: response.statistics.daysActive || 0,
              actionsCompleted: response.statistics.actionsCompleted || 0,
              emotionalImprovement:
                response.statistics.emotionalImprovement || 0,
            };
          }

          if (response.couponCode) {
            this.coupon = {
              code: response.couponCode,
              description: response.couponDescription || "",
            };
          }

          if (
            response.advancedRoadmaps &&
            response.advancedRoadmaps.length > 0
          ) {
            this.advancedRoadmaps = response.advancedRoadmaps;
          }
        } else {
          this.setDefaultData();
        }
      } catch (error) {
        this.error = "Không thể tải dữ liệu hoàn thành. Vui lòng thử lại sau.";
        this.setDefaultData();
      } finally {
        this.loading = false;
      }
    },

    setDefaultData() {
      this.statistics = {
        daysActive: 14,
        actionsCompleted: 23,
        emotionalImprovement: 68,
      };

      this.coupon = {
        code: "MENTAL25",
        description:
          'Sử dụng mã này để được giảm 25% cho khóa học "Tâm lý học ứng dụng" của chúng tôi',
      };

      this.advancedRoadmaps = [
        {
          title: "Lộ trình nâng cao: Vượt qua lo âu",
          description: "Các kỹ thuật nâng cao để đối phó với lo âu mãn tính",
        },
        {
          title: "Thiền định hàng ngày",
          description:
            "Xây dựng thói quen thiền định để cải thiện sức khỏe tinh thần",
        },
      ];
    },

    submitSurvey() {
      // TODO: Implement API call to save survey response
      this.showCoupon = true;

      console.log("Submitting survey with improvement:", this.improvement);
    },

    goToSuggestion() {
      this.$router.push("/suggest");
    },

    updateStatus() {
    },
  },
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
  margin-bottom: 25px;
  width: 100%;
}

.roadmap-content {
  flex: 1;
  width: 60vw !important;
  max-width: 60vw !important;
}

.coupon-code {
  background-color: white;
  border: 2px dashed #f59e0b;
  border-radius: 8px;
  padding: 16px;
}

.border-dashed {
  border-style: dashed !important;
}
</style>