<template>
  <div class="roadmap-container">
    <RoadmapSidebar :steps="roadmapSteps" :activeStep="parseInt(id)" />
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

        <StepDetail :step="currentStep" />

        <v-card class="mb-6" variant="outlined">
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="mr-2"
                >mdi-clipboard-check-outline</v-icon
              >
              <span class="text-h6">Tiến độ của bạn</span>
            </div>

            <v-progress-linear
              model-value="25"
              color="primary"
              height="8"
              class="mb-2"
            ></v-progress-linear>

            <div class="d-flex justify-space-between">
              <span class="text-caption">Mới bắt đầu</span>
              <span class="text-caption">1/4 hoạt động đã hoàn thành</span>
            </div>
          </v-card-text>
        </v-card>

        <div class="d-flex justify-end">
          <v-btn
            color="primary"
            variant="elevated"
            size="large"
            prepend-icon="mdi-arrow-right"
          >
            Tiếp tục bước tiếp theo
          </v-btn>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import RoadmapSidebar from "@/components/RoadmapSidebar.vue";
import RoadmapHeader from "@/components/RoadmapHeader.vue";
import StepDetail from "@/components/StepDetail.vue";

export default {
  name: "StepDetailView",
  components: {
    RoadmapSidebar,
    RoadmapHeader,
    StepDetail,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      roadmapSteps: [
        {
          id: 1,
          title: "Nhận thức bản thân",
          completed: true,
          icon: "mdi-eye-outline",
        },
        {
          id: 2,
          title: "Tìm kiếm hỗ trợ",
          completed: true,
          icon: "mdi-hand-heart-outline",
        },
        {
          id: 3,
          title: "Xây dựng thói quen lành mạnh",
          completed: false,
          active: true,
          icon: "mdi-sprout-outline",
        },
        {
          id: 4,
          title: "Phát triển chiến lược đối phó",
          completed: false,
          icon: "mdi-brain",
        },
        {
          id: 5,
          title: "Duy trì sức khỏe tinh thần",
          completed: false,
          icon: "mdi-heart-pulse",
        },
      ],
      currentStep: {
        id: 3,
        title: "Xây dựng thói quen lành mạnh",
        description:
          "Phát triển thói quen lành mạnh nhất quán tạo nền tảng cho sức khỏe tinh thần tốt. Những thay đổi nhỏ, bền vững trong thói quen hàng ngày của bạn có thể tạo ra tác động tích cực đáng kể theo thời gian.",
        focusAreas: [
          "Thiết lập mô hình giấc ngủ đều đặn",
          "Đưa hoạt động thể chất vào thói quen của bạn",
          "Phát triển thói quen ăn uống lành mạnh",
          "Tạo ranh giới giữa thời gian làm việc và cá nhân",
        ],
        activities: [
          {
            id: 1,
            title: "Danh sách kiểm tra vệ sinh giấc ngủ",
            description:
              "Tạo và thực hiện thói quen trước khi đi ngủ để cải thiện chất lượng giấc ngủ.",
            recommended: true,
            icon: "mdi-sleep",
          },
          {
            id: 2,
            title: "Lịch vận động",
            description:
              "Lên lịch hoạt động thể chất thường xuyên mà bạn thích, ngay cả khi đó chỉ là đi bộ ngắn hàng ngày.",
            recommended: true,
            icon: "mdi-run",
          },
          {
            id: 3,
            title: "Lập kế hoạch bữa ăn",
            description:
              "Lên kế hoạch các bữa ăn cân bằng bao gồm thực phẩm hỗ trợ tâm trạng như omega-3 và carbohydrate phức hợp.",
            recommended: false,
            icon: "mdi-food-apple-outline",
          },
          {
            id: 4,
            title: "Ranh giới kỹ thuật số",
            description:
              "Đặt thời gian cụ thể để ngắt kết nối khỏi email và thông báo công việc.",
            recommended: false,
            icon: "mdi-cellphone-off",
          },
        ],
      },
    };
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
  padding: 0;
}
</style>
