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
                  <v-btn text @click="skipStep(1)">Bỏ qua</v-btn>
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
                    <v-btn text @click="skipStep(2)">Bỏ qua</v-btn>
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
                    <v-btn text @click="skipStep(3)">Bỏ qua</v-btn>
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
                    <v-btn text @click="skipStep(4)">Bỏ qua</v-btn>
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
                    <v-btn text @click="skipStep(5)">Bỏ qua</v-btn>
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
            <v-alert color="info" variant="tonal" border="start" class="mb-4">
              <div class="text-subtitle-1 font-weight-medium mb-2">Dựa vào các câu trả lời của bạn, chúng tôi xác định:
              </div>
              <div v-if="analysisResult.issues.length > 0" class="mb-2">
                <span class="font-weight-medium">Bạn đang gặp các vấn đề về:</span>
                <span>{{ analysisResult.issues.join(", ") }}</span>
              </div>
              <div class="mb-2">
                <span class="font-weight-medium">Ở mức:</span>
                <span>{{ analysisResult.severity }}</span>
              </div>
              <div v-if="analysisResult.symptoms.length > 0">
                <span class="font-weight-medium">Các triệu chứng:</span>
                <ul class="mt-1 mb-0">
                  <li v-for="(symptom, index) in analysisResult.symptoms" :key="index">
                    {{ symptom }}
                  </li>
                </ul>
              </div>
            </v-alert>

            <p class="text-body-1 mb-4">
              Việc nhận diện vấn đề là bước đầu tiên quan trọng trong hành
              trình chăm sóc sức khỏe tinh thần. Dựa trên kết quả này, chúng
              tôi sẽ đề xuất các lộ trình phù hợp để hỗ trợ bạn.
            </p>

            <div v-if="isNormalMentalHealth" class="text-success mb-4">
              <v-icon color="success" class="mr-1">mdi-check-circle</v-icon>
              Tâm lý của bạn đang ở trạng thái khá ổn định. Tuy nhiên, việc
              chăm sóc sức khỏe tinh thần vẫn luôn cần thiết.
            </div>

            <div v-else-if="analysisResult.severity === 'nghiêm trọng'" class="text-error mb-4">
              <v-icon color="error" class="mr-1">mdi-alert-circle</v-icon>
              Nếu bạn cảm thấy quá khó khăn, đừng ngần ngại tìm kiếm sự hỗ trợ
              từ chuyên gia tâm lý.
            </div>
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
import { roadmapSteps, suggestionData } from "@/scripts/data/roadmapData.js";

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
      userTypeOptions: suggestionData.userTypeOptions,
      whereOptions: suggestionData.whereOptions,
      whenOptions: suggestionData.whenOptions,
      relatedOptions: suggestionData.relatedOptions,
      /*
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
      */
      suggestedRoadmaps: [],
      skippedIssue: false,
      isNormalMentalHealth: false,
      showMusicPlayer: false,
      audioVolume: 50,
      isPlaying: false,
      currentTrack: "Relaxing Nature Sounds",
      audioTracks: suggestionData.audioTracks,
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
      if (this.currentStep === 1) {
        return !!this.answers.userType;
      } else if (this.currentStep === 2) {
        return !!this.answers.issue;
      } else if (this.currentStep === 3) {
        return !!this.answers.where;
      } else if (this.currentStep === 4) {
        return !!this.answers.when;
      } else if (this.currentStep === 5) {
        return !!this.answers.related;
      }
      return false;
    },
  },
  methods: {
    handleNext() {
      if (this.currentStep < 5) {
        this.currentStep++;
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
      
      // Get roadmaps based on user type and issue
      if (this.answers.userType && this.answers.issue) {
        const userTypeRoadmaps = suggestionData.suggestedRoadmaps[this.answers.userType];
        if (userTypeRoadmaps && userTypeRoadmaps[this.answers.issue]) {
          roadmaps.push(...userTypeRoadmaps[this.answers.issue]);
        }
      }
      
      // Always add default roadmaps
      roadmaps.push(...suggestionData.suggestedRoadmaps.default);
      
      // Nếu tâm lý bình thường, thêm lộ trình duy trì sức khỏe tinh thần
      if (this.isNormalMentalHealth) {
        roadmaps.push(suggestionData.suggestedRoadmaps.normal);
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

    getIssueOptions(userType) {
      return suggestionData.issueOptions[userType] || [];
    },

    getEvaluationText(userType, issue) {
      // Nếu tâm lý bình thường
      if (this.isNormalMentalHealth) {
        return "Dựa trên những chia sẻ của bạn, chúng tôi nhận thấy tâm lý của bạn đang ở trạng thái khá ổn định. Tuy nhiên, việc chăm sóc sức khỏe tinh thần là một hành trình liên tục, và chúng tôi có một số gợi ý để giúp bạn duy trì trạng thái tích cực này.";
      }

      if (!issue) {
        return "Bạn chưa sẵn sàng chia sẻ vấn đề của mình? Không sao cả! Bạn có thể thử các lộ trình dưới đây, hoặc quay lại khảo sát khi cảm thấy sẵn sàng hơn.";
      }

      // Học sinh
      if (userType === "student") {
        if (issue === "study_pressure") {
          return "Áp lực học tập có thể khiến bạn cảm thấy choáng ngợp và kiệt sức. Đây là trải nghiệm phổ biến mà nhiều học sinh xuất sắc đều từng trải qua. Việc bạn nhận ra vấn đề và chủ động tìm kiếm hỗ trợ cho thấy bạn có tinh thần trách nhiệm và sự trưởng thành. Lộ trình chúng tôi đề xuất sẽ giúp bạn xây dựng các kỹ năng quản lý áp lực học tập hiệu quả, cải thiện phương pháp học và tìm lại niềm vui trong việc học.";
        }
        if (issue === "bullying") {
          return "Việc bị bắt nạt hoặc cô lập ở trường là trải nghiệm vô cùng đau đớn và không ai đáng phải trải qua điều này. Điều quan trọng là bạn hiểu rằng đây không phải lỗi của bạn. Nhiều người thành công hiện nay cũng từng trải qua những khó khăn tương tự. Bạn đã rất dũng cảm khi chia sẻ điều này. Lộ trình của chúng tôi sẽ giúp bạn xây dựng sức mạnh nội tại, kỹ năng xã hội và các chiến lược để đối phó với tình huống này một cách an toàn và hiệu quả.";
        }
        if (issue === "no_close_friend") {
          return "Cảm giác không có bạn thân có thể tạo ra sự cô đơn và thiếu kết nối. Điều này hoàn toàn bình thường, đặc biệt trong giai đoạn học sinh khi các mối quan hệ đang phát triển và thay đổi. Việc bạn nhận ra mong muốn có những kết nối sâu sắc hơn là dấu hiệu của sự trưởng thành về mặt cảm xúc. Lộ trình của chúng tôi sẽ giúp bạn phát triển kỹ năng giao tiếp, xây dựng sự tự tin và tạo dựng các mối quan hệ bạn bè có ý nghĩa.";
        }
        if (issue === "parent_conflict") {
          return "Mâu thuẫn với cha mẹ là một phần tự nhiên của quá trình trưởng thành và tìm kiếm bản sắc riêng. Điều này không có nghĩa là bạn hoặc cha mẹ có lỗi - đôi khi chỉ là do khác biệt về quan điểm và cách giao tiếp. Việc bạn muốn cải thiện mối quan hệ này cho thấy sự trưởng thành và tình cảm sâu sắc của bạn. Lộ trình của chúng tôi sẽ giúp bạn phát triển kỹ năng giao tiếp hiệu quả, hiểu biết hơn về động lực gia đình và xây dựng mối quan hệ hài hòa hơn với cha mẹ.";
        }
        if (issue === "no_motivation") {
          return "Cảm giác mất động lực học tập có thể đến từ nhiều nguyên nhân khác nhau - từ áp lực quá lớn, thiếu mục tiêu rõ ràng, đến cảm giác choáng ngợp. Đây là trải nghiệm phổ biến mà nhiều học sinh xuất sắc cũng từng trải qua. Việc bạn nhận ra vấn đề này là bước đầu tiên quan trọng. Lộ trình của chúng tôi sẽ giúp bạn tìm lại niềm vui trong học tập, xây dựng thói quen hiệu quả và kết nối lại với mục tiêu cá nhân để tạo động lực nội tại bền vững.";
        }
      }

      // Sinh viên
      if (userType === "university") {
        if (issue === "future_worry") {
          return "Lo lắng về tương lai là điều hoàn toàn tự nhiên, đặc biệt trong giai đoạn đại học - thời điểm bạn đang đứng trước nhiều lựa chọn quan trọng. Những cảm xúc này cho thấy bạn là người có trách nhiệm và quan tâm đến con đường phía trước. Nhiều người thành công cũng từng trải qua giai đoạn bất định tương tự. Lộ trình của chúng tôi sẽ giúp bạn xây dựng tầm nhìn rõ ràng về tương lai, phát triển kế hoạch hành động cụ thể và xây dựng sự tự tin để đối mặt với những thách thức sắp tới.";
        }
        if (issue === "career_confusion") {
          return "Cảm giác mất định hướng nghề nghiệp là trải nghiệm phổ biến của nhiều sinh viên, ngay cả những người có thành tích học tập xuất sắc. Trong thế giới với vô số lựa chọn nghề nghiệp, việc cảm thấy choáng ngợp là điều dễ hiểu. Việc bạn đang tìm kiếm sự rõ ràng cho thấy bạn đang chủ động với tương lai của mình. Lộ trình của chúng tôi sẽ giúp bạn khám phá đam mê, nhận diện điểm mạnh, và xây dựng lộ trình sự nghiệp phù hợp với giá trị cốt lõi của bạn.";
        }
        if (issue === "loneliness") {
          return "Cảm giác cô đơn trong môi trường đại học là trải nghiệm phổ biến hơn bạn nghĩ. Nhiều sinh viên cảm thấy khó khăn khi xây dựng kết nối ý nghĩa, đặc biệt trong môi trường mới và áp lực học tập cao. Điều này không phản ánh giá trị của bạn mà chỉ là một giai đoạn chuyển tiếp. Lộ trình của chúng tôi sẽ giúp bạn phát triển kỹ năng kết nối, tìm kiếm cộng đồng phù hợp và xây dựng các mối quan hệ có ý nghĩa trong thời gian đại học.";
        }
        if (issue === "boredom") {
          return "Cảm giác chán nản với việc học đại học có thể đến từ nhiều nguyên nhân - từ việc chọn sai ngành, thiếu kết nối với nội dung học, đến cảm giác thiếu thách thức. Đây là trải nghiệm mà nhiều sinh viên xuất sắc cũng từng gặp phải. Việc bạn nhận ra vấn đề này là bước đầu tiên để tìm lại niềm đam mê. Lộ trình của chúng tôi sẽ giúp bạn kết nối lại với mục tiêu học tập, khám phá những khía cạnh mới của ngành học và tìm cách áp dụng kiến thức vào các dự án thực tế có ý nghĩa.";
        }
        if (issue === "intern_stress") {
          return "Áp lực từ thực tập và thi cử có thể tạo ra cảm giác choáng ngợp và lo âu. Đây là trải nghiệm phổ biến khi bạn phải cân bằng giữa học tập và áp lực thực tế của môi trường làm việc. Việc bạn nhận ra và tìm cách đối phó với stress này cho thấy bạn có tinh thần trách nhiệm cao. Lộ trình của chúng tôi sẽ giúp bạn phát triển các kỹ năng quản lý stress, cân bằng cuộc sống-học tập và xây dựng sự tự tin trong môi trường chuyên nghiệp.";
        }
      }

      // Người đi làm
      if (userType === "worker") {
        if (issue === "work_stress") {
          return "Căng thẳng công việc là thách thức phổ biến trong cuộc sống hiện đại, đặc biệt khi bạn là người có trách nhiệm cao và mong muốn hoàn thành tốt nhiệm vụ. Cảm giác này cho thấy bạn thực sự quan tâm đến công việc của mình. Tuy nhiên, căng thẳng kéo dài có thể ảnh hưởng đến sức khỏe và hiệu suất. Lộ trình của chúng tôi sẽ giúp bạn phát triển các kỹ năng quản lý stress hiệu quả, thiết lập ranh giới lành mạnh và tìm lại niềm vui trong công việc mà không làm giảm năng suất.";
        }
        if (issue === "colleague_conflict") {
          return "Mâu thuẫn với đồng nghiệp có thể tạo ra môi trường làm việc căng thẳng và ảnh hưởng đến sự hài lòng trong công việc. Đây là tình huống phổ biến trong môi trường làm việc, ngay cả với những người có kỹ năng chuyên môn xuất sắc. Việc bạn muốn cải thiện tình hình cho thấy bạn có tinh thần xây dựng và chuyên nghiệp. Lộ trình của chúng tôi sẽ giúp bạn phát triển kỹ năng giao tiếp hiệu quả, giải quyết xung đột và xây dựng mối quan hệ đồng nghiệp hài hòa, tích cực.";
        }
        if (issue === "not_recognized") {
          return "Cảm giác không được công nhận đóng góp trong công việc có thể gây nên sự thất vọng và mất động lực. Đây là trải nghiệm mà nhiều người tài năng đã từng gặp phải. Việc bạn nhận ra giá trị bản thân và mong muốn được ghi nhận xứng đáng là điều hoàn toàn hợp lý. Lộ trình của chúng tôi sẽ giúp bạn phát triển các chiến lược để nâng cao sự hiện diện chuyên nghiệp, truyền đạt giá trị đóng góp hiệu quả và xây dựng sự tự tin trong môi trường làm việc.";
        }
        if (issue === "no_passion") {
          return "Cảm giác mất đam mê với công việc thường xuất hiện ở những người từng rất nhiệt huyết. Đây có thể là dấu hiệu cho thấy bạn đã phát triển vượt qua vị trí hiện tại hoặc đang cần những thách thức mới. Nhiều người thành công đã trải qua giai đoạn này trước khi tìm được hướng đi đúng đắn. Lộ trình của chúng tôi sẽ giúp bạn kết nối lại với giá trị cốt lõi, khám phá những khía cạnh mới trong sự nghiệp và tìm lại niềm vui cũng như ý nghĩa trong công việc.";
        }
        if (issue === "work_life_balance") {
          return "Mất cân bằng giữa công việc và cuộc sống cá nhân là thách thức lớn trong thời đại số hiện nay. Ranh giới giữa công việc và đời sống ngày càng mờ nhạt, đặc biệt với những người có trách nhiệm cao và tận tâm. Việc bạn nhận ra sự mất cân bằng này là bước đầu tiên quan trọng. Lộ trình của chúng tôi sẽ giúp bạn thiết lập ranh giới lành mạnh, phát triển thói quen tự chăm sóc bản thân và xây dựng lối sống cân bằng, bền vững mà vẫn duy trì hiệu suất công việc cao.";
        }
      }

      // Trường hợp khác
      return "Cảm ơn bạn đã chia sẻ những trải nghiệm cá nhân. Dựa trên thông tin bạn cung cấp, chúng tôi đã xây dựng lộ trình được cá nhân hóa để hỗ trợ bạn hiệu quả nhất. Mỗi thử thách bạn đang đối mặt đều là cơ hội để phát triển, và chúng tôi tin rằng với những công cụ phù hợp, bạn sẽ không chỉ vượt qua khó khăn mà còn phát triển mạnh mẽ hơn.";
    },
    
    getRoadmapIcon(id) {
      return suggestionData.roadmapIcons[id] || "mdi-lightbulb-outline";
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
</style>
