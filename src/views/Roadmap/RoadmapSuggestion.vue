<template>
  <div class="roadmap-container">
    <div class="roadmap-content">
      <AppHeader @take-assessment="resetSurvey" @update-status="updateStatus" />
      <v-container>
        <v-btn
          variant="text"
          color="primary"
          class="mb-4"
          prepend-icon="mdi-arrow-left"
          @click="$router.push('/')"
        >
          Quay lại lộ trình
        </v-btn>

        <v-card v-if="!showResults" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-lightbulb-outline</v-icon>
            Gợi ý lộ trình
          </v-card-title>
          <v-card-subtitle>
            Trả lời một vài câu hỏi để chúng tôi gợi ý lộ trình phù hợp nhất cho bạn
          </v-card-subtitle>

          <v-card-text>
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
                    <h3 class="text-h6 mb-4">Bạn thuộc nhóm người dùng nào?</h3>
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
                    <h3 class="text-h6 mb-4">Nguồn gây căng thẳng chính của bạn là gì?</h3>
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
                    <h3 class="text-h6 mb-4">Bạn muốn cải thiện điều gì nhất?</h3>
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

        <div v-if="showResults">
          <MentalProfile :profile="mentalProfile" />

          <h2 class="text-h5 mb-4">Lộ trình phù hợp dành cho bạn</h2>
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
                    Phù hợp: {{ roadmap.match }}%
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
            <v-btn variant="outlined" style="margin-top: 30px;" @click="$router.push('/overview')">
              Xem tất cả lộ trình
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
import MentalProfile from "@/components/Roadmap/MentalProfile.vue";
import { roadmapSteps } from "@/scripts/data/roadmapData.js";

export default {
  name: "RoadmapSuggestion",
  components: {
    MentalProfile
  },
  data() {
    return {
      currentStep: 1,
      showResults: false,
      roadmapSteps,
      answers: {
        userType: "",
        stressSource: "",
        improvementGoal: "",
      },
      userTypeOptions: [
        { text: "Học sinh/Sinh viên", value: "student" },
        { text: "Người đi làm", value: "worker" },
        { text: "Người cao tuổi", value: "elderly" },
        { text: "Khác", value: "other" },
      ],
      stressSourceOptions: [
        { text: "Gia đình", value: "family" },
        { text: "Việc học", value: "study" },
        { text: "Công việc", value: "work" },
        { text: "Các mối quan hệ", value: "relationship" },
        { text: "Tài chính", value: "finance" },
      ],
      improvementGoalOptions: [
        { text: "Sự tự tin", value: "confidence" },
        { text: "Kiểm soát cảm xúc", value: "emotions" },
        { text: "Vượt qua lo âu", value: "anxiety" },
        { text: "Giấc ngủ tốt hơn", value: "sleep" },
        { text: "Tập trung tốt hơn", value: "focus" },
      ],
      mentalProfile: null,
      suggestedRoadmaps: [],
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
      this.mentalProfile = {
        userType: this.getUserTypeText(),
        stressSource: this.getStressSourceText(),
        improvementGoal: this.getImprovementGoalText(),
        stressLevel: 75,
        depressionRisk: 45,
        emotionalIndex: [
          { date: "2023-05-05", value: 65 },
          { date: "2023-05-06", value: 58 },
          { date: "2023-05-07", value: 72 },
          { date: "2023-05-08", value: 68 },
          { date: "2023-05-09", value: 75 },
        ],
      };

      this.suggestedRoadmaps = [
        {
          id: "1",
          title: "Overcoming Anxiety",
          description: "Learn to identify and overcome common anxiety symptoms",
          match: 95,
          steps: 5,
        },
        {
          id: "2",
          title: "Building Confidence",
          description:
            "Develop self-confidence and ability to face new challenges",
          match: 87,
          steps: 4,
        },
        {
          id: "3",
          title: "Emotional Control",
          description: "Learn to identify and adjust negative emotions",
          match: 82,
          steps: 3,
        },
      ];

      this.showResults = true;
    },
    selectRoadmap(id) {
      this.$router.push(`/roadmap/${id}`);
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
    resetSurvey() {
      this.currentStep = 1;
      this.showResults = false;
      this.answers = {
        userType: "",
        stressSource: "",
        improvementGoal: "",
      };
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
}

.roadmap-content {
  flex: 1;
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
