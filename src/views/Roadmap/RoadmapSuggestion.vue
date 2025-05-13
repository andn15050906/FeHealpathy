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
          Quay lại lộ trình
        </v-btn>

        <v-card
          v-if="!showResults"
          class="mb-6 suggestion-card"
        >
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-lightbulb-outline</v-icon>
            Gợi ý lộ trình
          </v-card-title>
          <v-card-subtitle>
            Trả lời một vài câu hỏi để chúng tôi gợi ý lộ trình phù hợp nhất cho
            bạn
            <div style="color:#43a047; margin-top:6px; font-style:italic; font-size:0.98rem;">
              Mọi thông tin bạn cung cấp đều được bảo mật tuyệt đối. Hãy trả lời theo cảm nhận của bạn, không có đúng/sai!
            </div>
          </v-card-subtitle>

          <v-card-text>
            <v-stepper v-model="currentStep" class="bg-background">
              <v-stepper-header>
                <v-stepper-item
                  v-for="n in 5"
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
                    <div style="color:#388e3c; font-size:0.97rem; margin-bottom:4px;">
                      Hãy chọn nhóm mô tả đúng nhất về bạn nhé! (Bạn có thể chia sẻ thêm nếu muốn)
                    </div>
                    <h3 class="text-h6 mb-4">Công việc hiện tại của bạn là gì?</h3>
                    <v-radio-group v-model="answers.userType">
                      <v-radio label="Học sinh" value="student"></v-radio>
                      <v-radio label="Sinh viên" value="university"></v-radio>
                      <v-radio label="Người đi làm" value="worker"></v-radio>
                      <v-radio label="Người cao tuổi" value="elderly"></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                </v-stepper-window-item>

                <template v-if="!skippedIssue">
                  <v-stepper-window-item :value="2">
                    <v-card-text>
                      <div style="color:#388e3c; font-size:0.97rem; margin-bottom:4px;">
                        Bạn có thể chọn nhiều vấn đề nếu cần, mọi chia sẻ đều được bảo mật!
                      </div>
                      <h3 class="text-h6 mb-4">Vấn đề hiện tại của bạn là gì?</h3>
                      <v-radio-group v-model="answers.issue">
                        <v-radio
                          v-for="option in getIssueOptions(answers.userType)"
                          :key="option.value"
                          :label="option.text"
                          :value="option.value"
                        ></v-radio>
                        <v-radio label="Khác" value="other"></v-radio>
                      </v-radio-group>
                      <v-text-field
                        v-if="answers.issue === 'other'"
                        v-model="answers.issueOther"
                        label="Vui lòng mô tả vấn đề của bạn"
                        outlined
                        dense
                      ></v-text-field>
                    </v-card-text>
                  </v-stepper-window-item>

                  <v-stepper-window-item :value="3">
                    <v-card-text>
                      <div style="color:#388e3c; font-size:0.97rem; margin-bottom:4px;">
                        Chia sẻ thêm để chúng tôi hiểu bạn hơn nhé!
                      </div>
                      <h3 class="text-h6 mb-4">Vấn đề đó thường xảy ra ở đâu?</h3>
                      <v-radio-group v-model="answers.where">
                        <v-radio label="Ở nhà" value="home"></v-radio>
                        <v-radio label="Ở trường/lớp học" value="school"></v-radio>
                        <v-radio label="Nơi làm việc" value="work"></v-radio>
                        <v-radio label="Trên mạng xã hội" value="social"></v-radio>
                        <v-radio label="Không rõ" value="unknown"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-stepper-window-item>

                  <v-stepper-window-item :value="4">
                    <v-card-text>
                      <div style="color:#388e3c; font-size:0.97rem; margin-bottom:4px;">
                        Thường xảy ra vào thời gian nào?
                      </div>
                      <v-radio-group v-model="answers.when">
                        <v-radio label="Buổi sáng" value="morning"></v-radio>
                        <v-radio label="Trước khi ngủ" value="before_sleep"></v-radio>
                        <v-radio label="Buổi tối" value="evening"></v-radio>
                        <v-radio label="Khi đi học/làm" value="at_work"></v-radio>
                        <v-radio label="Luôn luôn" value="always"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-stepper-window-item>

                  <v-stepper-window-item :value="5">
                    <v-card-text>
                      <div style="color:#388e3c; font-size:0.97rem; margin-bottom:4px;">
                        Ai thường liên quan đến vấn đề này?
                      </div>
                      <v-radio-group v-model="answers.related">
                        <v-radio label="Bố mẹ" value="parent"></v-radio>
                        <v-radio label="Giáo viên / giảng viên" value="teacher"></v-radio>
                        <v-radio label="Bạn bè / người yêu" value="friend"></v-radio>
                        <v-radio label="Sếp / đồng nghiệp" value="boss"></v-radio>
                        <v-radio label="Chính bản thân mình" value="myself"></v-radio>
                        <v-radio label="Không rõ" value="unknown"></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-stepper-window-item>
                </template>
                <template v-else>
                  <v-stepper-window-item :value="2">
                    <v-card-text class="text-center py-8">
                      <v-icon color="primary" size="48">mdi-emoticon-sad-outline</v-icon>
                      <div style="font-size:1.2rem; color:#388e3c; margin: 18px 0 8px 0;">
                        Đôi khi thật khó để gọi tên vấn đề của mình.
                      </div>
                      <div style="color:#555; margin-bottom: 18px;">
                        Bạn không cần phải vội vàng – khi nào sẵn sàng, chúng tôi luôn ở đây để lắng nghe và đồng hành cùng bạn!
                      </div>
                      <v-btn color="primary" class="mr-4" @click="backToFirstQuestion">
                        Quay lại trả lời
                      </v-btn>
                      <v-btn outlined color="grey" @click="$router.push('/roadmaps/recommended')">
                        Bỏ qua & Xem các lộ trình
                      </v-btn>
                    </v-card-text>
                  </v-stepper-window-item>
                </template>
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
                  @click="onNextClick"
                >
                  {{ currentStep < 5 ? "Tiếp theo" : "Hoàn thành" }}
                </v-btn>
              </v-card-actions>
            </v-stepper>
          </v-card-text>
        </v-card>

        <div v-if="showResults">
          <div class="result-section">
            <div class="text-center mb-8">
              <v-icon color="primary" size="48" class="mb-4">mdi-heart-multiple</v-icon>
              <h2 class="result-title mb-4">Cảm ơn bạn đã chia sẻ!</h2>
              <div class="result-message">
                {{ getEvaluationText(answers.userType, answers.issue) }}
              </div>
            </div>

            <MentalProfile :profile="mentalProfile" />

            <div class="text-center mb-6">
              <h2 class="text-h5 mb-4">Lộ trình phù hợp dành cho bạn</h2>
              <p class="text-body-1 text-grey mb-6">
                Dựa trên những chia sẻ của bạn, chúng tôi đã chọn ra những lộ trình phù hợp nhất để giúp bạn vượt qua khó khăn
              </p>
            </div>

            <v-row>
              <v-col
                v-for="(roadmap, index) in suggestedRoadmaps"
                :key="roadmap.id"
                cols="12"
                md="4"
              >
                <v-card 
                  :class="{ 'border-primary': index === 0 }" 
                  height="100%"
                  class="roadmap-card"
                  :elevation="index === 0 ? 4 : 2"
                >
                  <div v-if="index === 0" class="best-match-banner">
                    <v-icon small class="mr-1">mdi-star</v-icon>
                    Phù hợp nhất với bạn
                  </div>
                  <v-card-title class="d-flex align-center">
                    <v-icon color="primary" class="mr-2">{{ getRoadmapIcon(roadmap.id) }}</v-icon>
                    {{ roadmap.title }}
                  </v-card-title>
                  <v-card-text>
                    <v-chip color="success" class="mb-2">
                      <v-icon small class="mr-1">mdi-check-circle</v-icon>
                      Phù hợp: {{ roadmap.match }}%
                    </v-chip>
                    <p class="text-body-2 mb-2">{{ roadmap.description }}</p>
                    <p class="text-caption d-flex align-center">
                      <v-icon small class="mr-1">mdi-clock-outline</v-icon>
                      {{ roadmap.steps }} bước
                    </p>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      block
                      :color="index === 0 ? 'primary' : undefined"
                      :variant="index === 0 ? 'elevated' : 'outlined'"
                      @click="selectRoadmap(roadmap.id)"
                    >
                      {{ index === 0 ? "Bắt đầu ngay" : "Xem chi tiết" }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <div class="text-center mt-8">
              <v-btn
                variant="outlined"
                style="margin-top: 30px"
                @click="$router.push('/roadmaps/recommended')"
              >
                Xem tất cả lộ trình
              </v-btn>
            </div>
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
    MentalProfile,
  },
  data() {
    return {
      currentStep: 1,
      showResults: false,
      roadmapSteps,
      answers: {
        userType: "",
        issue: "",
        issueOther: "",
        where: "",
        when: "",
        related: "",
      },
      userTypeOptions: [
        { text: "Học sinh", value: "student" },
        { text: "Sinh viên", value: "university" },
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
      skippedIssue: false,
    };
  },
  computed: {
    canProceed() {
      if (this.currentStep === 1) {
        return !!this.answers.userType;
      } else if (this.currentStep === 2) {
        return !!this.answers.issue && (this.answers.issue !== 'other' || !!this.answers.issueOther);
      }
      return true;
    },
  },
  methods: {
    onNextClick() {
      if (this.currentStep === 2) {
        if (!this.answers.issue || (this.answers.issue === 'other' && !this.answers.issueOther)) {
          this.skippedIssue = true;
          this.currentStep = 2;
          return;
        }
      }
      this.handleNext();
    },
    handleNext() {
      if (this.currentStep < 5) {
        this.currentStep++;
      } else {
        console.log('Generating results...');
        this.generateResults();
        console.log('Mental Profile:', this.mentalProfile);
        this.showResults = true;
      }
    },
    generateResults() {
      // Lấy text nguồn căng thẳng chính
      let stressSource = '';
      const issueOptions = this.getIssueOptions(this.answers.userType);
      const found = issueOptions.find(opt => opt.value === this.answers.issue);
      if (this.answers.issue === 'other' && this.answers.issueOther) {
        stressSource = this.answers.issueOther;
      } else if (found) {
        stressSource = found.text;
      } else {
        stressSource = 'Chưa xác định';
      }

      // Gợi ý mục tiêu cải thiện
      let improvementGoal = 'Chưa xác định';
      if (this.answers.issue === 'no_motivation' || this.answers.issue === 'no_passion') improvementGoal = 'Tìm lại động lực';
      else if (this.answers.issue === 'work_stress' || this.answers.issue === 'study_pressure') improvementGoal = 'Giảm căng thẳng';
      else if (this.answers.issue === 'loneliness' || this.answers.issue === 'no_close_friend') improvementGoal = 'Kết nối xã hội';
      else if (this.answers.issue === 'parent_conflict' || this.answers.issue === 'colleague_conflict') improvementGoal = 'Cải thiện mối quan hệ';
      else if (this.answers.issue === 'future_worry' || this.answers.issue === 'career_confusion') improvementGoal = 'Định hướng tương lai';

      // Tính điểm stressLevel và depressionRisk dựa trên trọng số khoa học
      let stressLevel = 20;
      let depressionRisk = 10;
      if (['study_pressure','work_stress','intern_stress'].includes(this.answers.issue)) stressLevel += 40;
      if (['bullying','parent_conflict','colleague_conflict'].includes(this.answers.issue)) stressLevel += 30;
      if (['no_motivation','no_passion'].includes(this.answers.issue)) stressLevel += 20;
      if (['loneliness','no_close_friend'].includes(this.answers.issue)) depressionRisk += 40;
      if (['no_motivation','no_passion'].includes(this.answers.issue)) depressionRisk += 30;
      if (this.answers.related === 'myself') depressionRisk += 20;
      stressLevel = Math.min(stressLevel, 100);
      depressionRisk = Math.min(depressionRisk, 100);

      // Chỉ số cảm xúc hôm nay (user mới)
      const today = new Date();
      const emotionalIndex = [{
        date: today.toISOString().split('T')[0],
        value: Math.floor((100-stressLevel+100-depressionRisk)/4) // trung bình hóa
      }];

      this.mentalProfile = {
        userType: this.getUserTypeText() || 'Chưa xác định',
        stressSource,
        improvementGoal,
        stressLevel,
        depressionRisk,
        emotionalIndex
      };

      // Tạo danh sách lộ trình đề xuất
      this.suggestedRoadmaps = [
        {
          id: "1",
          title: "Vượt qua lo âu",
          description: "Học cách nhận biết và vượt qua các triệu chứng lo âu thường gặp",
          match: 95,
          steps: 5,
        },
        {
          id: "2",
          title: "Xây dựng sự tự tin",
          description: "Phát triển sự tự tin và khả năng đối mặt với thử thách mới",
          match: 87,
          steps: 4,
        },
        {
          id: "3",
          title: "Kiểm soát cảm xúc",
          description: "Học cách nhận biết và điều chỉnh cảm xúc tiêu cực",
          match: 82,
          steps: 3,
        },
      ];
    },
    selectRoadmap(id) {
      this.$router.push(`/roadmap/${id}`);
    },
    getUserTypeText() {
      const option = this.userTypeOptions.find(
        (o) => o.value === this.answers.userType
      );
      return option ? option.text : 'Chưa xác định';
    },
    getIssueOptions(userType) {
      if (userType === 'student') {
        return [
          { text: "Áp lực học tập, thi cử", value: "study_pressure" },
          { text: "Bị bắt nạt hoặc cô lập ở trường", value: "bullying" },
          { text: "Không có bạn thân", value: "no_close_friend" },
          { text: "Mâu thuẫn với cha mẹ", value: "parent_conflict" },
          { text: "Mất động lực", value: "no_motivation" },
        ];
      } else if (userType === 'university') {
        return [
          { text: "Lo lắng về tương lai", value: "future_worry" },
          { text: "Mất định hướng nghề nghiệp", value: "career_confusion" },
          { text: "Cô đơn", value: "loneliness" },
          { text: "Chán học", value: "boredom" },
          { text: "Stress vì thực tập/thi cử", value: "intern_stress" },
        ];
      } else if (userType === 'worker') {
        return [
          { text: "Căng thẳng công việc", value: "work_stress" },
          { text: "Mâu thuẫn đồng nghiệp", value: "colleague_conflict" },
          { text: "Cảm giác không được công nhận", value: "not_recognized" },
          { text: "Không còn đam mê", value: "no_passion" },
          { text: "Mất cân bằng cuộc sống – công việc", value: "work_life_balance" },
        ];
      } else if (userType === 'other') {
        // Nếu chọn khác, chỉ hiện ô input
        return [];
      }
      return [];
    },
    skipStep(step) {
      if (step === 2) {
        this.skippedIssue = true;
        this.currentStep = 2;
      } else if (step < 5) {
        this.currentStep++;
      } else {
        this.generateResults();
        this.showResults = true;
      }
    },
    backToFirstQuestion() {
      this.skippedIssue = false;
      this.currentStep = 1;
    },
    getEvaluationText(userType, issue) {
      if (!issue) {
        return "Bạn chưa sẵn sàng chia sẻ vấn đề của mình? Không sao cả! Bạn có thể thử các lộ trình dưới đây, hoặc quay lại khảo sát khi cảm thấy sẵn sàng hơn.";
      }
      // Học sinh
      if (userType === 'student' && issue === 'study_pressure') {
        return "Bạn đang gặp áp lực học tập, thi cử. Hãy chia nhỏ mục tiêu, nghỉ ngơi hợp lý và đừng ngại nhờ sự giúp đỡ từ thầy cô, bạn bè hoặc gia đình.";
      }
      if (userType === 'student' && issue === 'bullying') {
        return "Bạn đang gặp vấn đề bị bắt nạt hoặc cô lập ở trường. Hãy mạnh dạn chia sẻ với người lớn, thầy cô hoặc chuyên gia tâm lý để được hỗ trợ.";
      }
      if (userType === 'student' && issue === 'no_close_friend') {
        return "Bạn cảm thấy thiếu bạn thân. Hãy thử mở lòng, tham gia các hoạt động nhóm để kết nối với mọi người xung quanh.";
      }
      if (userType === 'student' && issue === 'parent_conflict') {
        return "Bạn đang có mâu thuẫn với cha mẹ. Hãy thử lắng nghe, chia sẻ cảm xúc một cách bình tĩnh và tìm điểm chung.";
      }
      if (userType === 'student' && issue === 'no_motivation') {
        return "Bạn đang mất động lực. Hãy thử thay đổi thói quen, đặt mục tiêu nhỏ và tự thưởng cho bản thân khi hoàn thành.";
      }
      // Sinh viên
      if (userType === 'university' && issue === 'future_worry') {
        return "Bạn lo lắng về tương lai. Hãy thử lập kế hoạch nhỏ, tìm hiểu các lựa chọn nghề nghiệp và chia sẻ với người có kinh nghiệm.";
      }
      if (userType === 'university' && issue === 'career_confusion') {
        return "Bạn đang mất định hướng nghề nghiệp. Đừng ngại thử sức ở nhiều lĩnh vực, tham khảo ý kiến chuyên gia hoặc người đi trước.";
      }
      if (userType === 'university' && issue === 'loneliness') {
        return "Bạn cảm thấy cô đơn. Hãy thử kết nối với bạn bè, tham gia hoạt động nhóm hoặc chia sẻ với người thân.";
      }
      if (userType === 'university' && issue === 'boredom') {
        return "Bạn cảm thấy chán học. Hãy thử tìm cảm hứng mới, thay đổi môi trường học tập hoặc đặt mục tiêu nhỏ để tạo động lực.";
      }
      if (userType === 'university' && issue === 'intern_stress') {
        return "Bạn đang stress vì thực tập/thi cử. Hãy lên kế hoạch cụ thể, nghỉ ngơi hợp lý và đừng ngại nhờ sự giúp đỡ.";
      }
      // Người đi làm
      if (userType === 'worker' && issue === 'work_stress') {
        return "Bạn đang căng thẳng công việc. Hãy cân bằng giữa công việc và cuộc sống, đừng quên dành thời gian cho bản thân.";
      }
      if (userType === 'worker' && issue === 'colleague_conflict') {
        return "Bạn có mâu thuẫn với đồng nghiệp. Hãy thử trao đổi thẳng thắn, lắng nghe và tìm giải pháp chung.";
      }
      if (userType === 'worker' && issue === 'not_recognized') {
        return "Bạn cảm thấy không được công nhận. Hãy chia sẻ mong muốn của mình với cấp trên hoặc đồng nghiệp.";
      }
      if (userType === 'worker' && issue === 'no_passion') {
        return "Bạn không còn đam mê với công việc. Hãy thử tìm kiếm những điều mới mẻ hoặc cân nhắc thay đổi môi trường làm việc.";
      }
      if (userType === 'worker' && issue === 'work_life_balance') {
        return "Bạn đang mất cân bằng cuộc sống – công việc. Hãy sắp xếp thời gian hợp lý và ưu tiên sức khỏe tinh thần.";
      }
      // Trường hợp khác
      if (issue === 'other') {
        return "Cảm ơn bạn đã chia sẻ. Hãy tiếp tục lắng nghe cảm xúc của mình và đừng ngần ngại tìm kiếm sự hỗ trợ khi cần thiết.";
      }
      return "Chúng tôi đã xác định được vấn đề bạn đang gặp phải và đề xuất lộ trình phù hợp nhất cho bạn.";
    },
    getRoadmapIcon(id) {
      // Tuỳ ý bạn, có thể trả về icon khác nhau cho từng id
      if (id === "1") return "mdi-emoticon-happy-outline";
      if (id === "2") return "mdi-star-outline";
      if (id === "3") return "mdi-emoticon-cool-outline";
      return "mdi-lightbulb-outline";
    }
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

.suggestion-card {
  width: 100%;
  min-width: 1000px;
  margin: 0 auto;
}

@media (max-width: 1100px) {
  .suggestion-card {
    max-width: 98vw;
    min-width: unset;
    padding: 0 4px;
  }
}
</style>
