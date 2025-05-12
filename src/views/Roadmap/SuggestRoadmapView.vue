<template>
  <div class="roadmap-container">
    <RoadmapSidebar :steps="roadmapSteps" :activeStep="0" />
    <div class="roadmap-content">
      <RoadmapHeader />
      <v-container>
        <v-card class="mb-6 mt-4" elevation="1">
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="mr-2"
                >mdi-lightbulb-outline</v-icon
              >
              <span class="text-h6">Gợi ý lộ trình phù hợp</span>
            </div>

            <p class="text-body-1 mb-6">
              Hãy trả lời một số câu hỏi để chúng tôi có thể gợi ý lộ trình phù
              hợp nhất với bạn
            </p>

            <v-stepper v-model="currentStep" class="bg-background">
              <v-stepper-header>
                <v-stepper-item
                  v-for="n in 3"
                  :key="n"
                  :value="n"
                  :complete="currentStep > n"
                >
                  Câu hỏi {{ n }}
                </v-stepper-item>
              </v-stepper-header>

              <v-stepper-window>
                <v-stepper-window-item :value="1">
                  <v-card-text>
                    <h3 class="text-h6 mb-4">Bạn thuộc đối tượng nào?</h3>
                    <v-radio-group v-model="answers.userType">
                      <v-radio
                        v-for="option in userTypeOptions"
                        :key="option.value"
                        :label="option.text"
                        :value="option.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-stepper-window-item>

                <v-stepper-window-item :value="2">
                  <v-card-text>
                    <h3 class="text-h6 mb-4"
                      >Nguồn gây stress chính của bạn là gì?</h3
                    >
                    <v-radio-group v-model="answers.stressSource">
                      <v-radio
                        v-for="option in stressSourceOptions"
                        :key="option.value"
                        :label="option.text"
                        :value="option.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-stepper-window-item>

                <v-stepper-window-item :value="3">
                  <v-card-text>
                    <h3 class="text-h6 mb-4"
                      >Bạn muốn cải thiện điều gì nhất?</h3
                    >
                    <v-radio-group v-model="answers.improvementGoal">
                      <v-radio
                        v-for="option in improvementGoalOptions"
                        :key="option.value"
                        :label="option.text"
                        :value="option.value"
                      ></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-stepper-window-item>
              </v-stepper-window>

              <v-divider></v-divider>

              <v-card-actions>
                <v-btn
                  variant="text"
                  @click="currentStep > 1 ? currentStep-- : null"
                  :disabled="currentStep === 1"
                >
                  Quay lại
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="handleNext"
                  :disabled="!canProceed"
                >
                  {{ currentStep < 3 ? "Tiếp theo" : "Hoàn thành" }}
                </v-btn>
              </v-card-actions>
            </v-stepper>
          </v-card-text>
        </v-card>

        <v-card v-if="showResults" class="mb-6" elevation="1">
          <v-card-text>
            <div class="d-flex align-center mb-4">
              <v-icon color="primary" class="mr-2"
                >mdi-account-heart-outline</v-icon
              >
              <span class="text-h6">Hồ sơ tinh thần của bạn</span>
            </div>

            <v-row>
              <v-col cols="12" md="6">
                <div class="mb-4">
                  <div class="text-subtitle-2 text-grey">Đối tượng</div>
                  <div class="text-body-1">{{ getUserTypeText() }}</div>
                </div>

                <div class="mb-4">
                  <div class="text-subtitle-2 text-grey"
                    >Nguồn stress chính</div
                  >
                  <div class="text-body-1">{{ getStressSourceText() }}</div>
                </div>

                <div class="mb-4">
                  <div class="text-subtitle-2 text-grey"
                    >Mục tiêu cải thiện</div
                  >
                  <div class="text-body-1">{{ getImprovementGoalText() }}</div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <div class="mb-4">
                  <div class="text-subtitle-2 text-grey">Mức độ stress</div>
                  <v-progress-linear
                    model-value="75"
                    color="error"
                    height="8"
                  ></v-progress-linear>
                  <div class="text-caption text-right">75%</div>
                </div>

                <div class="mb-4">
                  <div class="text-subtitle-2 text-grey">Nguy cơ trầm cảm</div>
                  <v-progress-linear
                    model-value="45"
                    color="warning"
                    height="8"
                  ></v-progress-linear>
                  <div class="text-caption text-right">45%</div>
                </div>

                <div>
                  <div class="text-subtitle-2 text-grey"
                    >Chỉ số cảm xúc theo ngày</div
                  >
                  <v-sheet height="100" class="d-flex align-end">
                    <div
                      v-for="(day, i) in emotionalIndex"
                      :key="i"
                      class="emotion-bar mx-1"
                      :style="`height: ${day.value}%; width: 20%`"
                    ></div>
                  </v-sheet>
                  <div class="d-flex justify-space-between">
                    <span
                      v-for="(day, i) in emotionalIndex"
                      :key="i"
                      class="text-caption"
                    >
                      {{ day.date.split("-")[2] }}
                    </span>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <div v-if="showResults" class="mb-6">
          <h2 class="text-h5 mb-4">Lộ trình được gợi ý cho bạn</h2>
          <v-row>
            <v-col
              v-for="(roadmap, index) in suggestedRoadmaps"
              :key="roadmap.id"
              cols="12"
              md="4"
            >
              <v-card :class="{ 'border-primary': index === 0 }" height="100%">
                <div v-if="index === 0" class="best-match-banner"
                  >Phù hợp nhất</div
                >
                <v-card-title>{{ roadmap.title }}</v-card-title>
                <v-card-text>
                  <v-chip color="success" class="mb-2">
                    Độ phù hợp: {{ roadmap.match }}%
                  </v-chip>
                  <p class="text-body-2 mb-2">{{ roadmap.description }}</p>
                  <p class="text-caption">{{ roadmap.steps }} bước</p>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    block
                    :color="index === 0 ? 'primary' : undefined"
                    :variant="index === 0 ? 'elevated' : 'outlined'"
                    @click="selectRoadmap(roadmap.id)"
                  >
                    {{ index === 0 ? "Chọn lộ trình này" : "Xem chi tiết" }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <div class="text-center mt-6">
            <v-btn variant="outlined" @click="$router.push('/')">
              Xem tất cả lộ trình có sẵn
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import RoadmapSidebar from "@/components/RoadmapSidebar.vue";
import RoadmapHeader from "@/components/RoadmapHeader.vue";

export default {
  name: "SuggestRoadmapView",
  components: {
    RoadmapSidebar,
    RoadmapHeader,
  },
  data() {
    return {
      currentStep: 1,
      showResults: false,
      answers: {
        userType: "",
        stressSource: "",
        improvementGoal: "",
      },
      userTypeOptions: [
        { text: "Học sinh / Sinh viên", value: "student" },
        { text: "Người đi làm", value: "worker" },
        { text: "Người cao tuổi", value: "elderly" },
        { text: "Khác", value: "other" },
      ],
      stressSourceOptions: [
        { text: "Gia đình", value: "family" },
        { text: "Học hành", value: "study" },
        { text: "Công việc", value: "work" },
        { text: "Các mối quan hệ", value: "relationship" },
        { text: "Tài chính", value: "finance" },
      ],
      improvementGoalOptions: [
        { text: "Sự tự tin", value: "confidence" },
        { text: "Kiểm soát cảm xúc", value: "emotions" },
        { text: "Thoát khỏi lo âu", value: "anxiety" },
        { text: "Cải thiện giấc ngủ", value: "sleep" },
        { text: "Tập trung tốt hơn", value: "focus" },
      ],
      emotionalIndex: [
        { date: "2023-05-05", value: 65 },
        { date: "2023-05-06", value: 58 },
        { date: "2023-05-07", value: 72 },
        { date: "2023-05-08", value: 68 },
        { date: "2023-05-09", value: 75 },
      ],
      suggestedRoadmaps: [
        {
          id: "1",
          title: "Vượt qua lo âu",
          description:
            "Lộ trình giúp bạn nhận diện và vượt qua các triệu chứng lo âu thường gặp",
          match: 95,
          steps: 5,
        },
        {
          id: "2",
          title: "Xây dựng sự tự tin",
          description:
            "Phát triển sự tự tin và khả năng đối mặt với thử thách mới",
          match: 87,
          steps: 4,
        },
        {
          id: "3",
          title: "Kiểm soát cảm xúc",
          description: "Học cách nhận diện và điều chỉnh cảm xúc tiêu cực",
          match: 82,
          steps: 3,
        },
      ],
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
          completed: false,
          active: true,
          icon: "mdi-sprout-outline",
        },
        {
          id: 4,
          title: "Developing Coping Strategies",
          completed: false,
          icon: "mdi-brain",
        },
        {
          id: 5,
          title: "Maintaining Mental Wellness",
          completed: false,
          icon: "mdi-heart-pulse",
        },
      ],
    };
  },
  computed: {
    canProceed() {
      if (this.currentStep === 1) {
        return !!this.answers.userType;
      } else if (this.currentStep === 2) {
        return !!this.answers.stressSource;
      } else if (this.currentStep === 3) {
        return !!this.answers.improvementGoal;
      }
      return false;
    },
  },
  methods: {
    handleNext() {
      if (this.currentStep < 3) {
        this.currentStep++;
      } else {
        this.generateResults();
      }
    },
    generateResults() {
      // In a real app, this would be an API call
      this.showResults = true;
    },
    selectRoadmap(id) {
      this.$router.push("/");
    },
    getUserTypeText() {
      const option = this.userTypeOptions.find(
        (o) => o.value === this.answers.userType
      );
      return option ? option.text : "";
    },
    getStressSourceText() {
      const option = this.stressSourceOptions.find(
        (o) => o.value === this.answers.stressSource
      );
      return option ? option.text : "";
    },
    getImprovementGoalText() {
      const option = this.improvementGoalOptions.find(
        (o) => o.value === this.answers.improvementGoal
      );
      return option ? option.text : "";
    },
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
  padding: 0;
}

.emotion-bar {
  background-color: #6a39ca;
  border-radius: 4px 4px 0 0;
}

.border-primary {
  border: 2px solid #6a39ca !important;
  overflow: hidden;
}

.best-match-banner {
  background-color: #6a39ca;
  color: white;
  text-align: center;
  padding: 4px;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>