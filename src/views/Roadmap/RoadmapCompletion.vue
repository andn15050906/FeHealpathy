<template>
  <div class="roadmap-container">
    <div class="roadmap-content">

      <v-btn variant="text" color="primary" class="mb-4" prepend-icon="mdi-arrow-left"
        @click="$router.push(`/roadmap/${id}`)">
        Quay lại lộ trình
      </v-btn>

      <v-card class="mb-6 text-center py-6 bg-primary text-white" elevation="1">
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
              <v-icon color="primary" size="48" class="mb-2">mdi-calendar-check</v-icon>
              <h3 class="text-h5 mb-1">Số ngày hoạt động</h3>
              <p class="text-h3 text-primary font-weight-bold">14</p>
              <p class="text-body-2 text-grey">ngày</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="text-center" height="100%">
            <v-card-text>
              <v-icon color="success" size="48" class="mb-2">mdi-check-circle</v-icon>
              <h3 class="text-h5 mb-1">Hành động đã hoàn thành</h3>
              <p class="text-h3 text-success font-weight-bold">23</p>
              <p class="text-body-2 text-grey">hành động</p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
          <v-card class="text-center" height="100%">
            <v-card-text>
              <v-icon color="amber-darken-2" size="48" class="mb-2">mdi-medal</v-icon>
              <h3 class="text-h5 mb-1">Tiến bộ cảm xúc</h3>
              <div class="d-flex justify-center align-center my-2">
                <v-progress-linear model-value="68" color="success" height="8" class="w-50"></v-progress-linear>
                <span class="ml-2 font-weight-medium">68%</span>
              </div>
              <p class="text-body-2 text-grey">cải thiện</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <div style="height: 32px;"></div>
      <v-card class="my-6">
        <v-card-title>Đánh giá sự cải thiện của bạn</v-card-title>
        <v-card-subtitle>
          Vui lòng cho chúng tôi biết mức độ cải thiện của bạn sau khi hoàn
          thành lộ trình này
        </v-card-subtitle>
        <v-card-text>
          <v-radio-group v-model="improvement">
            <v-radio label="Tôi đã cải thiện một chút" value="little" color="primary"></v-radio>
            <v-radio label="Tôi đã cải thiện vừa phải" value="moderate" color="primary"></v-radio>
            <v-radio label="Tôi đã cải thiện đáng kể" value="significant" color="primary"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" @click="submitSurvey" :disabled="!improvement">
            Gửi phản hồi
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card v-if="showCoupon" class="my-6 border-dashed border-2 border-amber">
        <v-card-title class="text-center text-amber-darken-2">Mã giảm giá đặc biệt</v-card-title>
        <v-card-text class="text-center">
          <div class="coupon-code mb-4">
            <p class="text-h4 font-weight-bold text-amber-darken-2">MENTAL25</p>
          </div>
          <p class="text-body-2 text-amber-darken-1">
            Sử dụng mã này để được giảm 25% cho khóa học "Tâm lý học ứng dụng"
            của chúng tôi
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
            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="amber-darken-2">mdi-star</v-icon>
              </template>
              <v-list-item-title>Lộ trình nâng cao: Vượt qua lo âu</v-list-item-title>
              <v-list-item-subtitle>Các kỹ thuật nâng cao để đối phó với lo âu mãn
                tính</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn variant="outlined" size="small">Xem chi tiết</v-btn>
              </template>
            </v-list-item>

            <v-list-item>
              <template v-slot:prepend>
                <v-icon color="amber-darken-2">mdi-star</v-icon>
              </template>
              <v-list-item-title>Thiền định hàng ngày</v-list-item-title>
              <v-list-item-subtitle>Xây dựng thói quen thiền định để cải thiện sức khỏe tinh
                thần</v-list-item-subtitle>
              <template v-slot:append>
                <v-btn variant="outlined" size="small">Xem chi tiết</v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <div class="text-center mt-8">
        <v-btn size="large" color="success" prepend-icon="mdi-home" @click="$router.push('/')">
          Quay lại trang chủ
        </v-btn>
      </div>

    </div>
  </div>
</template>

<script>
import { roadmapSteps } from "@/scripts/data/roadmapData.js";

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
      roadmapSteps: roadmapSteps.map((step) => ({
        ...step,
        completed: true,
      })),
      improvement: null,
      showCoupon: false,
    };
  },
  methods: {
    submitSurvey() {
      // In a real app, this would be an API call
      this.showCoupon = true;
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
