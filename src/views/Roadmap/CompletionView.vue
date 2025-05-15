<template>
  <div class="roadmap-container">
    <RoadmapSidebar :steps="roadmapSteps" :activeStep="5" />
    <div class="roadmap-content">
      <RoadmapHeader />
      <v-container class="pt-16">
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="$router.push('/roadmaps/recommended')"
        >
          Quay lại lộ trình
        </v-btn>

        <v-card
          class="mb-6 text-center py-6 bg-primary text-white"
          elevation="1"
        >
          <v-icon size="64" class="mb-2">mdi-trophy-outline</v-icon>
          <h2 class="text-h4 mb-2">Chúc mừng bạn đã hoàn thành!</h2>
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
                <p class="text-h3 text-primary font-weight-bold">14</p>
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
                <h3 class="text-h5 mb-1">Hành động đã thực hiện</h3>
                <p class="text-h3 text-success font-weight-bold">23</p>
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
                    model-value="68"
                    color="success"
                    height="8"
                    class="w-50"
                  ></v-progress-linear>
                  <span class="ml-2 font-weight-medium">68%</span>
                </div>
                <p class="text-body-2 text-grey">cải thiện</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <v-card class="my-6">
          <v-card-title>Đánh giá trạng thái của bạn</v-card-title>
          <v-card-subtitle>
            Hãy cho chúng tôi biết mức độ cải thiện của bạn sau khi hoàn thành
            lộ trình này
          </v-card-subtitle>
          <v-card-text>
            <v-radio-group v-model="improvement">
              <v-radio
                label="Tôi đã cải thiện một chút"
                value="little"
              ></v-radio>
              <v-radio
                label="Tôi đã cải thiện kha khá"
                value="moderate"
              ></v-radio>
              <v-radio
                label="Tôi đã cải thiện rất nhiều"
                value="significant"
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
              Gửi đánh giá
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
              <p class="text-h4 font-weight-bold text-amber-darken-2"
                >MENTAL25</p
              >
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
            Dựa trên đánh giá của bạn, chúng tôi gợi ý thêm các lộ trình sau
          </v-card-subtitle>
          <v-card-text>
            <v-list bg-color="transparent">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="amber-darken-2">mdi-star</v-icon>
                </template>
                <v-list-item-title
                  >Lộ trình nâng cao: Vượt qua lo âu</v-list-item-title
                >
                <v-list-item-subtitle
                  >Các kỹ thuật nâng cao để đối phó với lo âu mãn
                  tính</v-list-item-subtitle
                >
                <template v-slot:append>
                  <v-btn variant="outlined" size="small">Xem chi tiết</v-btn>
                </template>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="amber-darken-2">mdi-star</v-icon>
                </template>
                <v-list-item-title>Thiền định hàng ngày</v-list-item-title>
                <v-list-item-subtitle
                  >Xây dựng thói quen thiền định để cải thiện sức khỏe tinh
                  thần</v-list-item-subtitle
                >
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
      </v-container>
    </div>
  </div>
</template>

<script>
import RoadmapSidebar from "@/components/RoadmapSidebar.vue";
import RoadmapHeader from "@/components/RoadmapHeader.vue";

export default {
  name: "CompletionView",
  components: {
    RoadmapSidebar,
    RoadmapHeader,
  },
  data() {
    return {
      improvement: null,
      showCoupon: false,
      roadmapSteps: [
        {
          id: 1,
          title: "Self-Awareness",
          completed: true,
          icon: "mdi-eye-outline",
        },
        {
          id: 2,
          title: "Seeking Support",
          completed: true,
          icon: "mdi-hand-heart-outline",
        },
        {
          id: 3,
          title: "Building Healthy Habits",
          completed: true,
          icon: "mdi-sprout-outline",
        },
        {
          id: 4,
          title: "Developing Coping Strategies",
          completed: true,
          icon: "mdi-brain",
        },
        {
          id: 5,
          title: "Maintaining Mental Wellness",
          completed: true,
          icon: "mdi-heart-pulse",
        },
      ],
    };
  },
  methods: {
    submitSurvey() {
      // In a real app, this would be an API call
      this.showCoupon = true;
    },
  },
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.roadmap-content {
  flex: 1;
  width: 100%;
}

.coupon-code {
  background-color: white;
  border: 2px dashed #f59e0b;
  border-radius: 8px;
  padding: 16px;
}
</style>
