<template>
  <div class="roadmap-container">
    <div class="roadmap-content">


      <v-card v-if="!showResults" class="mb-6 suggestion-card">
        <v-card-title class="d-flex align-center">
          <v-icon color="primary" class="mr-2">mdi-lightbulb-outline</v-icon>
          Gợi ý lộ trình
        </v-card-title>
        <v-card-subtitle>
          Trả lời một vài câu hỏi để chúng tôi gợi ý lộ trình phù hợp nhất cho
          bạn
          <div style="
                color: #43a047;
                margin-top: 6px;
                font-style: italic;
                font-size: 0.98rem;
              ">
            Mọi thông tin bạn cung cấp đều được bảo mật tuyệt đối. Hãy trả lời
            theo cảm nhận của bạn, không có đúng/sai!
          </div>
        </v-card-subtitle>

        <v-card-text>
          <v-stepper v-model="currentStep" class="bg-background">
            <v-stepper-header>
              <v-stepper-item v-for="n in 5" :key="n" :value="n" :complete="currentStep > n">
                Câu hỏi {{ n }}
              </v-stepper-item>
            </v-stepper-header>

            <v-stepper-window>
              <v-stepper-window-item :value="1">
                <v-card-text>
                  <div style="
                        color: #388e3c;
                        font-size: 0.97rem;
                        margin-bottom: 4px;
                      ">
                    Hãy chọn nhóm mô tả đúng nhất về bạn nhé! (Bạn có thể chia
                    sẻ thêm nếu muốn)
                  </div>
                  <h3 class="text-h6 mb-4">Công việc hiện tại của bạn là gì?</h3>
                  <v-radio-group v-model="answers.userType">
                    <v-radio label="Học sinh" value="student"></v-radio>
                    <v-radio label="Sinh viên" value="university"></v-radio>
                    <v-radio label="Người đi làm" value="worker"></v-radio>
                    <v-radio label="Người cao tuổi" value="elderly"></v-radio>
                    <v-radio label="Khác" value="other"></v-radio>
                  </v-radio-group>
                  <v-text-field v-if="answers.userType === 'other'" v-model="answers.userTypeOther"
                    label="Vui lòng mô tả công việc của bạn" outlined dense></v-text-field>
                </v-card-text>
              </v-stepper-window-item>

              <template v-if="!skippedIssue">
                <v-stepper-window-item :value="2">
                  <v-card-text>
                    <div style="
                          color: #388e3c;
                          font-size: 0.97rem;
                          margin-bottom: 4px;
                        ">
                      Bạn có thể chọn nhiều vấn đề nếu cần, mọi chia sẻ đều
                      được bảo mật!
                    </div>
                    <h3 class="text-h6 mb-4">Vấn đề hiện tại của bạn là gì?</h3>
                    <v-radio-group v-model="answers.issue">
                      <v-radio v-for="option in getIssueOptions(answers.userType)" :key="option.value"
                        :label="option.text" :value="option.value"></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                    <v-text-field v-if="answers.issue === 'other'" v-model="answers.issueOther"
                      label="Vui lòng mô tả vấn đề của bạn" outlined dense></v-text-field>
                  </v-card-text>
                </v-stepper-window-item>

                <v-stepper-window-item :value="3">
                  <v-card-text>
                    <div style="
                          color: #388e3c;
                          font-size: 0.97rem;
                          margin-bottom: 4px;
                        ">
                      Chia sẻ thêm để chúng tôi hiểu bạn hơn nhé!
                    </div>
                    <h3 class="text-h6 mb-4">Vấn đề đó thường xảy ra ở đâu?</h3>
                    <v-radio-group v-model="answers.where">
                      <v-radio label="Ở nhà" value="home"></v-radio>
                      <v-radio label="Ở trường/lớp học" value="school"></v-radio>
                      <v-radio label="Nơi làm việc" value="work"></v-radio>
                      <v-radio label="Trên mạng xã hội" value="social"></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                    <v-text-field v-if="answers.where === 'other'" v-model="answers.whereOther"
                      label="Vui lòng mô tả nơi vấn đề xảy ra" outlined dense></v-text-field>
                  </v-card-text>
                </v-stepper-window-item>

                <v-stepper-window-item :value="4">
                  <v-card-text>
                    <div style="
                          color: #388e3c;
                          font-size: 0.97rem;
                          margin-bottom: 4px;
                        ">
                      Thường xảy ra vào thời gian nào?
                    </div>
                    <v-radio-group v-model="answers.when">
                      <v-radio label="Buổi sáng" value="morning"></v-radio>
                      <v-radio label="Trước khi ngủ" value="before_sleep"></v-radio>
                      <v-radio label="Buổi tối" value="evening"></v-radio>
                      <v-radio label="Khi đi học/làm" value="at_work"></v-radio>
                      <v-radio label="Luôn luôn" value="always"></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                    <v-text-field v-if="answers.when === 'other'" v-model="answers.whenOther"
                      label="Vui lòng mô tả thời gian vấn đề xảy ra" outlined dense></v-text-field>
                  </v-card-text>
                </v-stepper-window-item>

                <v-stepper-window-item :value="5">
                  <v-card-text>
                    <div style="
                          color: #388e3c;
                          font-size: 0.97rem;
                          margin-bottom: 4px;
                        ">
                      Ai thường liên quan đến vấn đề này?
                    </div>
                    <v-radio-group v-model="answers.related">
                      <v-radio label="Bố mẹ" value="parent"></v-radio>
                      <v-radio label="Giáo viên / giảng viên" value="teacher"></v-radio>
                      <v-radio label="Bạn bè / người yêu" value="friend"></v-radio>
                      <v-radio label="Sếp / đồng nghiệp" value="boss"></v-radio>
                      <v-radio label="Chính bản thân mình" value="myself"></v-radio>
                      <v-radio label="Không rõ" value="unknown"></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                    <v-text-field v-if="answers.related === 'other'" v-model="answers.relatedOther"
                      label="Vui lòng mô tả người liên quan" outlined dense></v-text-field>
                  </v-card-text>
                </v-stepper-window-item>
              </template>
              <template v-else>
                <v-stepper-window-item :value="2">
                  <v-card-text class="text-center py-8">
                    <v-icon color="primary" size="48">mdi-emoticon-sad-outline</v-icon>
                    <div style="
                          font-size: 1.2rem;
                          color: #388e3c;
                          margin: 18px 0 8px 0;
                        ">
                      Đôi khi thật khó để gọi tên vấn đề của mình.
                    </div>
                    <div style="color: #555; margin-bottom: 18px">
                      Bạn không cần phải vội vàng – khi nào sẵn sàng, chúng
                      tôi luôn ở đây để lắng nghe và đồng hành cùng bạn!
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

            <v-divider />

            <v-card-actions>
              <v-btn variant="text" @click="currentStep > 1 ? currentStep-- : null" :disabled="currentStep === 1">
                Quay lại
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="handleNext" :disabled="!canProceed">
                {{ currentStep < 5 ? "Tiếp theo" : "Hoàn thành" }} </v-btn>
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

          <!-- Hiển thị kết quả tâm lý bình thường -->
          <v-card v-if="isNormalMentalHealth" class="mb-6 normal-mental-card">
            <v-card-title class="d-flex align-center">
              <v-icon color="success" class="mr-2">mdi-check-circle</v-icon>
              Chúc mừng bạn!
            </v-card-title>
            <v-card-text>
              <p class="text-body-1">Dựa trên những chia sẻ của bạn, chúng tôi nhận thấy tâm lý
                của bạn đang ở trạng thái khá ổn định. Đây là một điều tuyệt
                vời!</p>
              <p class="text-body-1 mt-2">Bạn có muốn thư giãn với một chút âm nhạc không?</p>

              <div class="d-flex justify-center mt-4">
                <v-btn color="primary" prepend-icon="mdi-music" @click="showMusicPlayer = true">
                  Nghe nhạc thư giãn
                </v-btn>
              </div>

              <v-expand-transition>
                <div v-if="showMusicPlayer" class="mt-4">
                  <v-card flat>
                    <v-card-text>
                      <div class="text-center mb-2">
                        <div class="text-h6">Nhạc thư giãn</div>
                        <div class="text-subtitle-1 text-grey">Hãy thư giãn và tận hưởng</div>
                      </div>
                      <v-slider v-model="audioVolume" prepend-icon="mdi-volume-low" append-icon="mdi-volume-high"
                        @click:prepend="
                          audioVolume = Math.max(0, audioVolume - 10)
                          " @click:append="
                            audioVolume = Math.min(100, audioVolume + 10)
                            " step="1" min="0" max="100"></v-slider>
                      <div class="d-flex justify-space-between">
                        <v-btn icon @click="togglePlay">
                          <v-icon>{{
                            isPlaying ? "mdi-pause" : "mdi-play"
                          }}</v-icon>
                        </v-btn>
                        <div class="text-caption">{{ currentTrack }}</div>
                        <v-btn icon @click="nextTrack">
                          <v-icon>mdi-skip-next</v-icon>
                        </v-btn>
                      </div>
                    </v-card-text>
                  </v-card>
                </div>
              </v-expand-transition>
            </v-card-text>
          </v-card>

          <div class="text-center mb-6">
            <h2 class="text-h5 mb-4">Lộ trình phù hợp dành cho bạn</h2>
            <p class="text-body-1 text-grey mb-6">
              Dựa trên những chia sẻ của bạn, chúng tôi đã chọn ra những lộ
              trình phù hợp nhất để giúp bạn vượt qua khó khăn
            </p>
          </div>

          <v-row>
            <v-col v-for="(roadmap, index) in suggestedRoadmaps" :key="roadmap.id" cols="12" md="4">
              <v-card :class="{ 'border-primary': index === 0 }" height="100%" class="roadmap-card"
                :elevation="index === 0 ? 4 : 2">
                <div v-if="index === 0" class="best-match-banner">
                  <v-icon small class="mr-1">mdi-star</v-icon>
                  Phù hợp nhất với bạn
                </div>
                <v-card-title class="d-flex align-center">
                  <v-icon :color="roadmap.isPaid ? 'primary' : 'primary'" class="mr-2">
                    {{ getRoadmapIcon(roadmap.id) }}
                  </v-icon>
                  {{ roadmap.title }}
                  <v-chip v-if="roadmap.isPaid" color="primary" size="small" class="ml-2">
                    Trả phí
                  </v-chip>
                </v-card-title>
                <v-card-text>
                  <v-chip :color="roadmap.isPaid ? 'primary' : 'success'" class="mb-2">
                    <v-icon small class="mr-1">mdi-check-circle</v-icon>
                    Phù hợp: {{ roadmap.match }}%
                  </v-chip>
                  <p class="text-body-2 mb-2">{{ roadmap.description }}</p>
                  <div class="d-flex justify-space-between align-center mt-3">
                    <span class="text-caption d-flex align-center">
                      <v-icon small class="mr-1">mdi-clock-outline</v-icon>
                      {{ roadmap.steps }} bước
                    </span>
                    <v-chip :color="roadmap.isPaid ? 'primary' : 'success'" size="small">
                      {{
                        roadmap.isPaid
                          ? roadmap.price.toLocaleString() + " VND"
                          : "Miễn phí"
                      }}
                    </v-chip>
                  </div>
                  <div v-if="roadmap.isPaid" class="paid-features mt-3">
                    <div class="text-caption font-weight-medium mb-1">Bao gồm:</div>
                    <div v-for="(feature, i) in roadmap.features" :key="i"
                      class="d-flex align-center text-caption mb-1">
                      <v-icon size="x-small" color="primary" class="mr-1">mdi-check</v-icon>
                      {{ feature }}
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn block :color="roadmap.isPaid ? 'primary' : 'primary'"
                    :variant="index === 0 ? 'elevated' : 'outlined'" @click="selectRoadmap(roadmap)">
                    {{ roadmap.isPaid ? "Mua ngay" : "Bắt đầu miễn phí" }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <div class="text-center mt-8">
            <v-btn variant="outlined" style="margin-top: 30px" @click="$router.push('/roadmaps/recommended')">
              Xem tất cả lộ trình
            </v-btn>
          </div>
        </div>
      </div>

      <!-- Payment Dialog -->
      <v-dialog v-model="showPaymentDialog" max-width="500">
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-credit-card</v-icon>
            Thanh toán cho lộ trình {{ selectedRoadmap?.title }}
          </v-card-title>
          <v-card-text>
            <p class="mb-4">Với gói trả phí, bạn sẽ nhận được:</p>
            <v-list density="compact">
              <v-list-item v-for="(feature, i) in selectedRoadmap?.features" :key="i" :title="feature"
                prepend-icon="mdi-check-circle" density="compact"></v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-subtitle-1">Tổng thanh toán:</span>
              <span class="text-h6 font-weight-bold">{{ selectedRoadmap?.price.toLocaleString() }} VND</span>
            </div>

            <v-alert color="info" variant="tonal" class="mb-4">
              <div class="d-flex align-center">
                <v-icon color="info" class="mr-2">mdi-information</v-icon>
                <span>Thanh toán an toàn và bảo mật. Bạn có thể hủy bất kỳ lúc
                  nào.</span>
              </div>
            </v-alert>

            <v-btn block color="primary" class="mb-2" @click="processPayment">
              Thanh toán ngay
            </v-btn>
            <v-btn block variant="text" @click="showPaymentDialog = false">
              Hủy
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Payment Success Dialog -->
      <v-dialog v-model="showPaymentSuccess" max-width="400">
        <v-card>
          <v-card-text class="text-center pa-6">
            <v-icon color="success" size="64" class="mb-4">mdi-check-circle</v-icon>
            <h3 class="text-h5 mb-2">Thanh toán thành công!</h3>
            <p class="mb-4">Cảm ơn bạn đã thanh toán. Bạn đã có thể truy cập đầy đủ nội
              dung của lộ trình.</p>
            <v-btn color="primary" block @click="continueToRoadmap">
              Tiếp tục đến lộ trình
            </v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>

      <!-- Analysis Dialog -->
      <v-dialog v-model="showAnalysisDialog" max-width="500" persistent>
        <v-card>
          <v-card-title class="d-flex align-center">
            <v-icon color="primary" class="mr-2">mdi-clipboard-pulse</v-icon>
            Kết quả phân tích
          </v-card-title>
          <v-card-text class="pt-4">
            <v-card class="analysis-result-card">
              <div class="result-header">
                <v-icon color="primary" size="48">{{ personalized.icon }}</v-icon>
                <h2 class="result-title">{{ personalized.title }}</h2>
              </div>
              <v-alert color="success" class="mb-4">
                {{ personalized.message }}
              </v-alert>
              <v-btn color="primary" @click="proceedToResults">Xem lộ trình phù hợp</v-btn>
            </v-card>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="proceedToResults">
              Xem giải pháp đề xuất
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </div>
  </div>
</template>

<script>
import { roadmapSteps } from "@/scripts/data/roadmapData.js";

export default {
  name: "RoadmapSuggestion",
  data() {
    return {
      currentStep: 1,
      showResults: false,
      roadmapSteps,
      answers: {
        userType: "",
        userTypeOther: "",
        issue: "",
        issueOther: "",
        where: "",
        whereOther: "",
        when: "",
        whenOther: "",
        related: "",
        relatedOther: "",
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
      suggestedRoadmaps: [],
      skippedIssue: false,
      isNormalMentalHealth: false,
      showMusicPlayer: false,
      audioVolume: 50,
      isPlaying: false,
      currentTrack: "Relaxing Nature Sounds",
      audioTracks: [
        "Relaxing Nature Sounds",
        "Meditation Music",
        "Deep Sleep Music",
        "Stress Relief Melody",
      ],
      currentTrackIndex: 0,
      showPaymentDialog: false,
      showPaymentSuccess: false,
      selectedRoadmap: null,
      showAnalysisDialog: false,
      analysisResult: {
        issues: [],
        severity: "",
        symptoms: [],
      },
      stressLevel: 0,
      depressionRisk: 0,
    };
  },
  computed: {
    canProceed() {
      // Luôn cho phép nhấn nút tiếp theo để có thể bỏ qua
      return true;
    },
    personalized() {
      return this.getPersonalizedAnalysis();
    },
  },
  methods: {
    handleNext() {
      if (this.currentStep < 5) {
        // Nếu chưa chọn câu trả lời, coi như bỏ qua bước đó
        if (this.currentStep === 1 && !this.answers.userType) {
          this.currentStep++;
        } else if (this.currentStep === 2 && !this.answers.issue) {
          this.skippedIssue = true;
          this.currentStep = 2;
        } else if (this.currentStep === 3 && !this.answers.where) {
          this.currentStep++;
        } else if (this.currentStep === 4 && !this.answers.when) {
          this.currentStep++;
        } else if (this.currentStep === 5 && !this.answers.related) {
          this.generateResults();
          this.showResults = true;
        } else {
          this.currentStep++;
        }
      } else {
        console.log("Generating results...");
        this.generateResults();
        this.showResults = true;
      }
    },
    generateResults() {
      // Đánh giá mức độ vấn đề tâm lý
      this.stressLevel = 20;
      this.depressionRisk = 10;

      if (
        ["study_pressure", "work_stress", "intern_stress"].includes(
          this.answers.issue
        )
      )
        this.stressLevel += 40;
      if (
        ["bullying", "parent_conflict", "colleague_conflict"].includes(
          this.answers.issue
        )
      )
        this.stressLevel += 30;
      if (["no_motivation", "no_passion"].includes(this.answers.issue))
        this.stressLevel += 20;
      if (["loneliness", "no_close_friend"].includes(this.answers.issue))
        this.depressionRisk += 40;
      if (["no_motivation", "no_passion"].includes(this.answers.issue))
        this.depressionRisk += 30;
      if (this.answers.related === "myself") this.depressionRisk += 20;

      this.stressLevel = Math.min(this.stressLevel, 100);
      this.depressionRisk = Math.min(this.depressionRisk, 100);

      // Xác định nếu tâm lý bình thường
      this.isNormalMentalHealth =
        this.stressLevel < 30 && this.depressionRisk < 30;

      // Phân tích kết quả khảo sát
      this.analyzeResults(this.stressLevel, this.depressionRisk);

      // Hiển thị dialog phân tích trước
      this.showAnalysisDialog = true;
    },
    analyzeResults(stressLevel, depressionRisk) {
      const issues = [];
      const symptoms = [];
      let severity = "";

      // Xác định các vấn đề dựa trên câu trả lời
      if (this.answers.issue === "study_pressure") {
        issues.push("áp lực học tập");
        symptoms.push("khó tập trung", "lo lắng về kết quả học tập");
      } else if (this.answers.issue === "work_stress") {
        issues.push("căng thẳng công việc");
        symptoms.push(
          "mệt mỏi kéo dài",
          "khó khăn trong việc thư giãn sau giờ làm"
        );
      } else if (this.answers.issue === "bullying") {
        issues.push("bị bắt nạt");
        symptoms.push("cảm giác bất an", "lo sợ khi đến trường/nơi làm việc");
      } else if (this.answers.issue === "loneliness") {
        issues.push("cô đơn");
        symptoms.push("cảm giác trống rỗng", "thiếu kết nối xã hội");
      } else if (this.answers.issue === "no_passion") {
        issues.push("mất động lực");
        symptoms.push(
          "thiếu hứng thú với các hoạt động thường ngày",
          "cảm giác cuộc sống nhàm chán"
        );
      } else if (this.answers.issue) {
        issues.push(this.getIssueText(this.answers.issue));
      }

      // Xác định mức độ nghiêm trọng
      if (stressLevel > 70 || depressionRisk > 70) {
        severity = "nghiêm trọng";
      } else if (stressLevel > 40 || depressionRisk > 40) {
        severity = "trung bình";
      } else {
        severity = "nhẹ";
      }

      // Thêm các triệu chứng dựa trên các câu trả lời khác
      if (this.answers.when === "always") {
        symptoms.push("triệu chứng xuất hiện liên tục");
      }

      if (this.answers.related === "myself") {
        symptoms.push("tự đánh giá tiêu cực về bản thân");
      }

      // Lưu kết quả phân tích
      this.analysisResult = {
        issues: issues,
        severity: severity,
        symptoms: symptoms,
      };
    },
    getIssueText(issueValue) {
      const issueOptions = this.getIssueOptions(this.answers.userType);
      const issue = issueOptions.find((option) => option.value === issueValue);
      return issue ? issue.text.toLowerCase() : issueValue;
    },
    proceedToResults() {
      this.showAnalysisDialog = false;

      // Tạo danh sách lộ trình đề xuất dựa trên câu trả lời
      this.suggestedRoadmaps = this.generatePersonalizedRoadmaps(
        this.stressLevel,
        this.depressionRisk
      );

      // Đảm bảo luôn có ít nhất một lộ trình trả phí
      const hasPaidRoadmap = this.suggestedRoadmaps.some(
        (roadmap) => roadmap.isPaid
      );
      if (!hasPaidRoadmap) {
        // Thêm một lộ trình trả phí phù hợp nhất vào đầu danh sách
        const paidRoadmap = this.getDefaultPaidRoadmap();
        this.suggestedRoadmaps.unshift(paidRoadmap);

        // Giới hạn lại số lượng roadmap
        if (this.suggestedRoadmaps.length > 4) {
          this.suggestedRoadmaps = this.suggestedRoadmaps.slice(0, 4);
        }
      }

      this.showResults = true;
    },

    getDefaultPaidRoadmap() {
      // Lộ trình trả phí mặc định nếu không có lộ trình trả phí nào được đề xuất
      return {
        id: "default-paid",
        title: "Lộ trình toàn diện",
        description:
          "Giải pháp toàn diện giúp cải thiện sức khỏe tinh thần và phát triển bản thân",
        match: 90,
        steps: 5,
        isPaid: true,
        price: 500000,
        features: [
          "5 bước chi tiết với hướng dẫn chuyên sâu",
          "Bài tập thực hành hàng ngày",
          "Tài liệu tham khảo chuyên môn",
          "Công cụ theo dõi tiến độ",
          "Hỗ trợ từ chuyên gia",
        ],
      };
    },

    generatePersonalizedRoadmaps(stressLevel, depressionRisk) {
      const roadmaps = [];

      // Dựa vào userType và issue để tạo roadmap phù hợp
      if (this.answers.userType === "student") {
        if (["study_pressure", "future_worry"].includes(this.answers.issue)) {
          roadmaps.push({
            id: "1",
            title: "Vượt qua áp lực học tập",
            description:
              "Phương pháp giảm căng thẳng và cải thiện hiệu suất học tập",
            match: 95,
            steps: 5,
            isPaid: true,
            price: 500000,
            features: [
              "5 bài tập thư giãn chuyên sâu",
              "Hướng dẫn quản lý thời gian hiệu quả",
              "Kỹ thuật học tập tối ưu",
              "Tư vấn 1-1 với chuyên gia",
              "Theo dõi tiến độ cá nhân",
            ],
          });
        }

        if (["bullying", "no_close_friend"].includes(this.answers.issue)) {
          roadmaps.push({
            id: "2",
            title: "Xây dựng kỹ năng xã hội",
            description: "Phát triển sự tự tin và kỹ năng giao tiếp hiệu quả",
            match: 90,
            steps: 5,
            isPaid: true,
            price: 450000,
            features: [
              "Bài tập rèn luyện sự tự tin",
              "Kỹ thuật giao tiếp hiệu quả",
              "Xử lý tình huống khó khăn",
              "Hỗ trợ từ cộng đồng",
              "Tài liệu chuyên sâu về kỹ năng xã hội",
            ],
          });
        }
      }

      if (this.answers.userType === "university") {
        if (["career_confusion", "future_worry"].includes(this.answers.issue)) {
          roadmaps.push({
            id: "3",
            title: "Định hướng nghề nghiệp",
            description:
              "Khám phá đam mê và xây dựng lộ trình sự nghiệp rõ ràng",
            match: 93,
            steps: 5,
            isPaid: true,
            price: 550000,
            features: [
              "Bài kiểm tra định hướng nghề nghiệp",
              "Tư vấn 1-1 với chuyên gia hướng nghiệp",
              "Kế hoạch phát triển cá nhân",
              "Kỹ năng phỏng vấn và tìm việc",
              "Mạng lưới kết nối chuyên nghiệp",
            ],
          });
        }

        if (["loneliness", "boredom"].includes(this.answers.issue)) {
          roadmaps.push({
            id: "4",
            title: "Sống trọn vẹn đời sinh viên",
            description:
              "Tận hưởng và phát triển bản thân trong thời gian đại học",
            match: 88,
            steps: 5,
            isPaid: false,
            price: 0,
          });
        }
      }

      if (this.answers.userType === "worker") {
        if (["work_stress", "work_life_balance"].includes(this.answers.issue)) {
          roadmaps.push({
            id: "5",
            title: "Cân bằng công việc - cuộc sống",
            description: "Phương pháp quản lý stress và tạo sự cân bằng",
            match: 96,
            steps: 5,
            isPaid: true,
            price: 600000,
            features: [
              "5 kỹ thuật quản lý thời gian",
              "Phương pháp thiền mindfulness",
              "Kỹ năng đặt ranh giới lành mạnh",
              "Tư vấn 1-1 với chuyên gia",
              "Theo dõi mức độ stress hàng ngày",
            ],
          });
        }

        if (["no_passion", "not_recognized"].includes(this.answers.issue)) {
          roadmaps.push({
            id: "6",
            title: "Tìm lại đam mê trong công việc",
            description: "Khám phá lại ý nghĩa và niềm vui trong sự nghiệp",
            match: 92,
            steps: 5,
            isPaid: true,
            price: 500000,
            features: [
              "Bài tập khám phá giá trị cốt lõi",
              "Kỹ thuật đặt mục tiêu SMART",
              "Phương pháp tạo động lực nội tại",
              "Tư vấn phát triển sự nghiệp",
              "Công cụ đánh giá sự hài lòng",
            ],
          });
        }
      }

      // Luôn thêm ít nhất một lộ trình miễn phí
      roadmaps.push({
        id: "7",
        title: "Thư giãn với âm nhạc",
        description:
          "Bộ sưu tập nhạc thư giãn và thiền định giúp giảm căng thẳng",
        match: 85,
        steps: 5,
        isPaid: false,
        price: 0,
      });

      roadmaps.push({
        id: "8",
        title: "Yoga cơ bản",
        description:
          "Các bài tập yoga đơn giản giúp thư giãn cơ thể và tâm trí",
        match: 80,
        steps: 5,
        isPaid: false,
        price: 0,
      });

      // Nếu tâm lý bình thường, thêm lộ trình duy trì sức khỏe tinh thần
      if (this.isNormalMentalHealth) {
        roadmaps.push({
          id: "9",
          title: "Duy trì sức khỏe tinh thần",
          description:
            "Các hoạt động và thói quen giúp duy trì trạng thái tâm lý tích cực",
          match: 98,
          steps: 5,
          isPaid: false,
          price: 0,
        });
      }

      // Sắp xếp theo độ phù hợp
      roadmaps.sort((a, b) => b.match - a.match);

      // Giới hạn số lượng roadmap
      return roadmaps.slice(0, 4);
    },

    selectRoadmap(roadmap) {
      if (roadmap.isPaid) {
        this.selectedRoadmap = roadmap;
        this.showPaymentDialog = true;
      } else {
        // Chuyển đến lộ trình miễn phí
        this.$router.push(`/roadmap/${roadmap.id}`);
      }
    },

    processPayment() {
      // Giả lập quá trình thanh toán
      setTimeout(() => {
        this.showPaymentDialog = false;
        this.showPaymentSuccess = true;

        // Lưu trạng thái đã thanh toán vào localStorage
        localStorage.setItem(`paid_roadmap_${this.selectedRoadmap.id}`, "true");
      }, 1500);
    },

    continueToRoadmap() {
      this.showPaymentSuccess = false;
      if (this.selectedRoadmap) {
        this.$router.push(`/roadmap/${this.selectedRoadmap.id}`);
      }
    },

    backToFirstQuestion() {
      this.skippedIssue = false;
      this.currentStep = 1;
    },

    getIssueOptions(userType) {
      if (userType === "student") {
        return [
          { text: "Áp lực học tập, thi cử", value: "study_pressure" },
          { text: "Bị bắt nạt hoặc cô lập ở trường", value: "bullying" },
          { text: "Không có bạn thân", value: "no_close_friend" },
          { text: "Mâu thuẫn với cha mẹ", value: "parent_conflict" },
          { text: "Mất động lực", value: "no_motivation" },
        ];
      } else if (userType === "university") {
        return [
          { text: "Lo lắng về tương lai", value: "future_worry" },
          { text: "Mất định hướng nghề nghiệp", value: "career_confusion" },
          { text: "Cô đơn", value: "loneliness" },
          { text: "Chán học", value: "boredom" },
          { text: "Stress vì thực tập/thi cử", value: "intern_stress" },
        ];
      } else if (userType === "worker") {
        return [
          { text: "Căng thẳng công việc", value: "work_stress" },
          { text: "Mâu thuẫn đồng nghiệp", value: "colleague_conflict" },
          { text: "Cảm giác không được công nhận", value: "not_recognized" },
          { text: "Không còn đam mê", value: "no_passion" },
          {
            text: "Mất cân bằng cuộc sống – công việc",
            value: "work_life_balance",
          },
        ];
      } else if (userType === "other") {
        // Nếu chọn khác, chỉ hiện ô input
        return [];
      }
      return [];
    },

    getEvaluationText(userType, issue) {
      if (this.isNormalMentalHealth) {
        return "Dựa trên những chia sẻ của bạn, chúng tôi nhận thấy tâm lý của bạn đang ở trạng thái khá ổn định. Tuy nhiên, việc chăm sóc sức khỏe tinh thần là một hành trình liên tục, và chúng tôi có một số gợi ý để giúp bạn duy trì trạng thái tích cực này.";
      }

      if (!issue) {
        return "Bạn chưa sẵn sàng chia sẻ vấn đề của mình? Không sao cả! Bạn có thể thử các lộ trình dưới đây, hoặc quay lại khảo sát khi cảm thấy sẵn sàng hơn.";
      }

      if (this.analysisResult.severity === 'nghiêm trọng') {
        if (this.answers.issue === 'bullying') {
          return "Bị bắt nạt là trải nghiệm đau đớn. Bạn rất dũng cảm khi chia sẻ. Hãy tìm kiếm sự hỗ trợ từ người lớn, thầy cô hoặc chuyên gia tâm lý. Bạn không đơn độc!";
        }
        return "Hãy mạnh dạn tìm kiếm sự hỗ trợ từ người thân hoặc chuyên gia. Bạn xứng đáng được lắng nghe và giúp đỡ.";
      }
      if (this.analysisResult.severity === 'trung bình') {
        // ... tương tự, cá nhân hóa theo issue
      }
      if (this.analysisResult.severity === 'nhẹ') {
        // ... tương tự, cá nhân hóa theo issue
      }
      return "Cảm ơn bạn đã chia sẻ những trải nghiệm cá nhân. Dựa trên thông tin bạn cung cấp, chúng tôi đã xây dựng lộ trình được cá nhân hóa để hỗ trợ bạn hiệu quả nhất. Mỗi thử thách bạn đang đối mặt đều là cơ hội để phát triển, và chúng tôi tin rằng với những công cụ phù hợp, bạn sẽ không chỉ vượt qua khó khăn mà còn phát triển mạnh mẽ hơn.";
    },

    getRoadmapIcon(id) {
      const icons = {
        1: "mdi-school",
        2: "mdi-account-group",
        3: "mdi-briefcase",
        4: "mdi-school",
        5: "mdi-briefcase-check",
        6: "mdi-heart-pulse",
        7: "mdi-music",
        8: "mdi-yoga",
        9: "mdi-meditation",
        "default-paid": "mdi-star-circle",
      };

      return icons[id] || "mdi-lightbulb-outline";
    },

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      // Trong ứng dụng thực tế, bạn sẽ phát/dừng âm nhạc ở đây
    },

    nextTrack() {
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.audioTracks.length;
      this.currentTrack = this.audioTracks[this.currentTrackIndex];
      // Trong ứng dụng thực tế, bạn sẽ chuyển bài ở đây
    },

    getPersonalizedAnalysis() {
      if (this.isNormalMentalHealth) {
        return {
          icon: 'mdi-emoticon-happy-outline',
          title: 'Bạn đang làm rất tốt!',
          message: 'Tâm lý của bạn đang ở trạng thái ổn định. Hãy tiếp tục duy trì những thói quen tích cực. Nếu có điều gì khiến bạn băn khoăn, đừng ngần ngại chia sẻ với chúng tôi hoặc người thân yêu.',
        };
      }
      if (!this.answers.issue) {
        return {
          icon: 'mdi-emoticon-neutral-outline',
          title: 'Đôi khi thật khó để gọi tên vấn đề của mình',
          message: 'Bạn không cần phải vội vàng. Khi nào sẵn sàng, chúng tôi luôn ở đây để lắng nghe và đồng hành cùng bạn. Bạn có thể thử các hoạt động thư giãn hoặc kết nối với cộng đồng.',
        };
      }
      if (this.analysisResult.severity === 'nghiêm trọng') {
        if (this.answers.issue === 'bullying') {
          return {
            icon: 'mdi-emoticon-sad-outline',
            title: 'Bạn đang trải qua giai đoạn rất khó khăn',
            message: 'Bị bắt nạt là trải nghiệm đau đớn. Bạn rất dũng cảm khi chia sẻ. Hãy tìm kiếm sự hỗ trợ từ người lớn, thầy cô hoặc chuyên gia tâm lý. Bạn không đơn độc!',
          };
        }
        return {
          icon: 'mdi-emoticon-sad-outline',
          title: 'Bạn đang trải qua giai đoạn khó khăn',
          message: 'Hãy mạnh dạn tìm kiếm sự hỗ trợ từ người thân hoặc chuyên gia. Bạn xứng đáng được lắng nghe và giúp đỡ.',
        };
      }
      if (this.analysisResult.severity === 'trung bình') {
        // ... tương tự, cá nhân hóa theo issue
      }
      if (this.analysisResult.severity === 'nhẹ') {
        // ... tương tự, cá nhân hóa theo issue
      }
      return {
        icon: 'mdi-emoticon-neutral-outline',
        title: 'Bạn đang gặp một số khó khăn nhỏ',
        message: 'Hãy chăm sóc bản thân và thử các hoạt động tích cực. Nếu cần, hãy chia sẻ với người thân hoặc chuyên gia.',
      };
    },
  },
};
</script>

<style scoped>
.roadmap-container {
  display: flex;
  min-height: 100vh;
  max-width: 1300px;
  margin-bottom: 25px;
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

.paid-features {
  background-color: rgba(106, 57, 202, 0.1);
  border-radius: 8px;
  padding: 8px;
}

.normal-mental-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border-radius: 12px;
}

.result-message {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
  font-size: 1.1rem;
}

.result-title {
  color: #6a39ca;
  font-weight: 600;
}

@media (max-width: 1100px) {
  .suggestion-card {
    max-width: 98vw;
    min-width: unset;
    padding: 0 4px;
  }
}

.analysis-result-card {
  background: linear-gradient(135deg, #f3e7fa 0%, #e3f9e5 100%);
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(106, 57, 202, 0.08);
  padding: 32px 24px;
  margin: 0 auto;
  max-width: 500px;
  animation: fadeInUp 0.7s;
}
.result-header {
  text-align: center;
  margin-bottom: 16px;
}
.result-title {
  color: #6a39ca;
  font-weight: 700;
  margin-top: 8px;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px);}
  to { opacity: 1; transform: translateY(0);}
}
</style>
