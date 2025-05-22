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
                    <v-radio v-for="option in userTypeOptions" :key="option.value" :label="option.text"
                      :value="option.value"></v-radio>
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
                      Bạn có thể chọn vấn đề khác nếu cần, mọi chia sẻ đều được
                      bảo mật!
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
                      <v-radio v-for="option in whereOptions" :key="option.value" :label="option.text"
                        :value="option.value"></v-radio>
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
                      {{ questions[5]?.content || 'Thường xảy ra vào thời gian nào?' }}
                    </div>
                    <v-radio-group v-model="answers.when">
                      <v-radio v-for="option in whenOptions" :key="option.value" :label="option.text"
                        :value="option.value"></v-radio>
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
                      <v-radio v-for="option in relatedOptions" :key="option.value" :label="option.text"
                        :value="option.value"></v-radio>
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
                      Bạn không cần phải vội vàng – khi nào sẵn sàng, chúng tôi
                      luôn ở đây để lắng nghe và đồng hành cùng bạn!
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
              <p class="text-body-1">Dựa trên những chia sẻ của bạn, chúng tôi nhận thấy tâm lý của
                bạn đang ở trạng thái khá ổn định. Đây là một điều tuyệt vời!</p>
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
                <v-chip v-if="index === 0" color="success" size="small" class="best-match-chip">
                  <v-icon size="x-small" class="mr-1">mdi-star</v-icon>
                  Phù hợp nhất với bạn
                </v-chip>
                <v-card-title class="d-flex align-center">
                  <v-icon :color="roadmap.isPaid ? 'primary' : 'primary'" class="mr-2">
                    {{ getRoadmapIcon(roadmap.id) }}
                  </v-icon>
                  <span class="text-truncate">{{ roadmap.title }}</span>
                  <v-chip v-if="roadmap.isPaid" color="primary" size="small" class="ml-2">
                    Trả phí
                  </v-chip>
                </v-card-title>
                <v-card-text>
                  <v-chip :color="roadmap.isPaid ? 'primary' : 'success'" class="mb-2">
                    <v-icon small class="mr-1">mdi-check-circle</v-icon>
                    Phù hợp: {{ roadmap.match }}%
                  </v-chip>
                  <p class="text-body-2 mb-2 roadmap-description">{{
                    roadmap.description
                  }}</p>
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
                    :variant="index === 0 ? 'elevated' : 'outlined'" @click="viewRoadmapDetails(roadmap)">
                    {{ roadmap.isPaid ? "Xem chi tiết" : "Bắt đầu miễn phí" }}
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
            <p class="mb-4">Cảm ơn bạn đã thanh toán. Bạn đã có thể truy cập đầy đủ nội dung
              của lộ trình.</p>
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
              Việc nhận diện vấn đề là bước đầu tiên quan trọng trong hành trình
              chăm sóc sức khỏe tinh thần. Dựa trên kết quả này, chúng tôi sẽ đề
              xuất các lộ trình phù hợp để hỗ trợ bạn.
            </p>

            <div v-if="isNormalMentalHealth" class="text-success mb-4">
              <v-icon color="success" class="mr-1">mdi-check-circle</v-icon>
              Tâm lý của bạn đang ở trạng thái khá ổn định. Tuy nhiên, việc chăm
              sóc sức khỏe tinh thần vẫn luôn cần thiết.
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

      <!-- Roadmap Detail Dialog -->
      <v-dialog v-model="showRoadmapDetail" max-width="800" scrollable>
        <v-card v-if="roadmapDetail">
          <v-card-title class="d-flex align-center">
            <v-icon :color="roadmapDetail.isPaid ? 'primary' : 'success'" class="mr-2">
              {{ getRoadmapIcon(roadmapDetail.id) }}
            </v-icon>
            {{ roadmapDetail.title }}
            <v-chip v-if="roadmapDetail.isPaid" color="primary" size="small" class="ml-2">
              Trả phí
            </v-chip>
          </v-card-title>

          <v-card-text>
            <v-alert v-if="loadingRoadmapDetail" type="info" class="mb-4">
              Đang tải thông tin lộ trình...
            </v-alert>

            <v-alert v-if="roadmapDetailError" type="error" class="mb-4">
              {{ roadmapDetailError }}
            </v-alert>

            <template v-if="!loadingRoadmapDetail && !roadmapDetailError">
              <div class="mb-4">
                <h3 class="text-h6 mb-2">Mô tả</h3>
                <p>{{ roadmapDetail.description }}</p>
              </div>

              <v-divider class="my-4"></v-divider>

              <div class="mb-4">
                <h3 class="text-h6 mb-2">Các bước thực hiện</h3>
                <v-timeline density="compact" align="start">
                  <v-timeline-item v-for="(step, index) in roadmapDetail.steps" :key="index" :dot-color="roadmapDetail.isPaid && !hasAccessToRoadmap
                    ? 'grey'
                    : 'primary'
                    " :icon="roadmapDetail.isPaid && !hasAccessToRoadmap && index > 0
                      ? 'mdi-lock'
                      : ''
                      " size="small">
                    <div class="d-flex align-center">
                      <strong>Bước {{ index + 1 }}:</strong>
                      <span class="ml-2" :class="{
                        'text-grey':
                          roadmapDetail.isPaid &&
                          !hasAccessToRoadmap &&
                          index > 0,
                      }">
                        {{
                          index === 0 ||
                            !roadmapDetail.isPaid ||
                            hasAccessToRoadmap
                            ? step.title
                            : "Nội dung khóa học trả phí"
                        }}
                      </span>
                    </div>
                    <div v-if="
                      index === 0 ||
                      !roadmapDetail.isPaid ||
                      hasAccessToRoadmap
                    " class="text-body-2 mt-1">
                      {{ step.description }}
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </div>

              <v-divider v-if="roadmapDetail.isPaid" class="my-4"></v-divider>

              <div v-if="roadmapDetail.isPaid" class="mb-4">
                <h3 class="text-h6 mb-2">Quyền lợi khi mua lộ trình này</h3>
                <v-list density="compact">
                  <v-list-item v-for="(feature, i) in roadmapDetail.features" :key="i" :title="feature"
                    prepend-icon="mdi-check-circle-outline" density="compact"></v-list-item>
                </v-list>
              </div>

              <v-alert v-if="roadmapDetail.isPaid && !hasAccessToRoadmap" color="info" variant="tonal" class="mt-4">
                <div class="d-flex align-center">
                  <v-icon color="info" class="mr-2">mdi-information</v-icon>
                  <span>Mua lộ trình này để mở khóa tất cả nội dung và bắt đầu hành
                    trình của bạn.</span>
                </div>
              </v-alert>
            </template>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="text" @click="showRoadmapDetail = false">
              Đóng
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn v-if="roadmapDetail.isPaid && !hasAccessToRoadmap" color="primary"
              @click="selectRoadmap(roadmapDetail)">
              Mua ngay - {{ roadmapDetail.price.toLocaleString() }} VND
            </v-btn>
            <v-btn v-else color="primary" @click="startRoadmap(roadmapDetail)">
              {{
                hasAccessToRoadmap ? "Tiếp tục lộ trình" : "Bắt đầu miễn phí"
              }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
</template>

<script>
import {
  getSuggestionData,
  getRoadmapById,
  getRoadmaps,
} from "@/scripts/api/services/roadmapService.js";

export default {
  name: "RoadmapSuggestion",
  data() {
    return {
      currentStep: 1,
      showResults: false,
      loading: false,
      error: null,
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
      userTypeOptions: [],
      issueOptions: [],
      whereOptions: [],
      whenOptions: [],
      relatedOptions: [],
      suggestedRoadmaps: [],
      skippedIssue: false,
      isNormalMentalHealth: false,
      showMusicPlayer: false,
      audioVolume: 50,
      isPlaying: false,
      currentTrack: "Relaxing Nature Sounds",
      audioTracks: [],
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
      roadmapIcons: {},
      showRoadmapDetail: false,
      roadmapDetail: null,
      loadingRoadmapDetail: false,
      roadmapDetailError: null,
      hasAccessToRoadmap: false,
      surveyData: null,
      questions: [],
    };
  },
  async created() {
    await this.fetchSuggestionData();
  },
  computed: {
    canProceed() {
      return true;
    }
  },
  methods: {
    getIssueOptions(userType) {
      if (!userType || !this.questions) return [];

      // Tìm tất cả câu hỏi có precondition khớp với userType
      const matchingQuestions = this.questions.filter(question =>
        question.precondition === userType
      );

      // Nếu tìm thấy câu hỏi phù hợp, trả về answers của câu hỏi đó
      if (matchingQuestions.length > 0) {
        // Lấy câu hỏi đầu tiên tìm thấy
        const issueQuestion = matchingQuestions[0];
        return issueQuestion.answers.map(answer => ({
          text: answer.content,
          value: answer.id
        }));
      }

      return [];
    },
    async fetchSuggestionData() {
      try {
        this.loading = true;
        this.error = null;

        const response = await getSuggestionData();
        console.log("API Response:", response);

        if (!response || !response.items || !response.items.length) {
          throw new Error("No data received from API");
        }

        const surveyData = response.items[0];
        console.log("Survey data:", surveyData);

        this.surveyData = surveyData;

        if (surveyData.questions && Array.isArray(surveyData.questions)) {
          this.questions = surveyData.questions;
          console.log("Questions loaded:", this.questions);

          // Xử lý câu hỏi 1 - Loại người dùng
          if (this.questions[0] && this.questions[0].answers) {
            this.userTypeOptions = this.questions[0].answers.map(answer => ({
              text: answer.content,
              value: answer.id
            }));
            console.log("User type options:", this.userTypeOptions);
          }

          // Câu hỏi 2 được xử lý động trong getIssueOptions và watch

          // Xử lý câu hỏi 3 - Nơi xảy ra
          if (this.questions[4] && this.questions[4].answers) {
            this.whereOptions = this.questions[4].answers.map(answer => ({
              text: answer.content,
              value: answer.id
            }));
            console.log("Where options:", this.whereOptions);
          }

          // Xử lý câu hỏi 5 - Thời điểm
          if (this.questions[5] && this.questions[5].answers) {
            this.whenOptions = this.questions[5].answers.map(answer => ({
              text: answer.content,
              value: answer.id
            }));
            console.log("When options:", this.whenOptions);
          }

          // Xử lý câu hỏi 4 - Người liên quan
          if (this.questions[6] && this.questions[6].answers) {
            this.relatedOptions = this.questions[6].answers.map(answer => ({
              text: answer.content,
              value: answer.id
            }));
            console.log("Related options:", this.relatedOptions);
          }
        } else {
          throw new Error("Invalid questions data structure");
        }
      } catch (error) {
        console.error("Error fetching suggestion data:", error);
        this.error = "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.";
      } finally {
        this.loading = false;
      }
    },

    parsePhases(phases) {
      if (!phases || !Array.isArray(phases)) return [];
      
      return phases.map(phase => {
        try {
          // Nếu phase.description là JSON string, parse nó
          if (phase.description && typeof phase.description === 'string') {
            const parsedDesc = JSON.parse(phase.description);
            // Nếu là array của objects có Title, map ra array của Title
            if (Array.isArray(parsedDesc)) {
              return {
                ...phase,
                description: '',
                title: parsedDesc.map(item => item.Title || '').filter(Boolean)[0] || phase.title || ''
              };
            }
          }
          return phase;
        } catch (e) {
          console.error('Error parsing phase description:', e);
          return phase;
        }
      });
    },

    async fetchRoadmapDetail(roadmapId) {
      try {
        this.loadingRoadmapDetail = true;
        this.roadmapDetailError = null;

        const response = await getRoadmapById(roadmapId);
        console.log("Roadmap detail response:", response);

        if (response) {
          this.roadmapDetail = {
            ...response,
            steps: this.parsePhases(response.phases || []), // Parse phases khi load detail
          };
          this.checkRoadmapAccess(roadmapId);
        } else {
          throw new Error("Could not find roadmap details");
        }
      } catch (error) {
        console.error("Error fetching roadmap detail:", error);
        this.roadmapDetailError = "Đã xảy ra lỗi khi tải thông tin lộ trình. Vui lòng thử lại sau.";
      } finally {
        this.loadingRoadmapDetail = false;
      }
    },

    checkRoadmapAccess(roadmapId) {
      const hasPaid = localStorage.getItem(`paid_roadmap_${roadmapId}`);
      this.hasAccessToRoadmap = hasPaid === "true";
    },

    async viewRoadmapDetails(roadmap) {
      this.selectedRoadmap = roadmap;
      await this.fetchRoadmapDetail(roadmap.id);
      this.showRoadmapDetail = true;
    },

    startRoadmap(roadmap) {
      this.showRoadmapDetail = false;
      this.$router.push(`/roadmap/${roadmap.id}`);
    },

    handleNext() {
      if (this.currentStep < 5) {
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
      this.stressLevel = 20;
      this.depressionRisk = 10;

      // Tìm câu trả lời của câu hỏi 2 dựa vào userType
      const question2 = this.questions.find(q => q.precondition === this.answers.userType);
      if (question2 && question2.answers) {
        const selectedAnswer = question2.answers.find(answer => answer.id === this.answers.issue);

        if (selectedAnswer) {
          const content = selectedAnswer.content.toLowerCase();

          // Gán issue dựa vào nội dung câu trả lời
          if (content.includes('áp lực học tập')) {
            this.answers.issue = 'study_pressure';
            this.stressLevel += 40;
            this.depressionRisk += 40;
          } else if (content.includes('căng thẳng công việc')) {
            this.answers.issue = 'work_stress';
            this.stressLevel += 40;
            this.depressionRisk += 40;
          } else if (content.includes('bắt nạt')) {
            this.answers.issue = 'bullying';
            this.stressLevel += 30;
            this.depressionRisk += 30;
          } else if (content.includes('cô đơn')) {
            this.answers.issue = 'loneliness';
            this.stressLevel += 40;
            this.depressionRisk += 40;
          } else if (content.includes('động lực') || content.includes('đam mê')) {
            this.answers.issue = 'no_passion';
            this.stressLevel += 20;
            this.depressionRisk += 20;
          }

          // Xét thêm điểm dựa vào score của câu trả lời nếu có
          if (selectedAnswer.score) {
            this.stressLevel += selectedAnswer.score * 10;
            this.depressionRisk += selectedAnswer.score * 5;
          }
        }
      }

      // Xét câu trả lời về thời gian (câu 4)
      const timeQuestion = this.questions[5];
      if (timeQuestion && timeQuestion.answers) {
        const selectedTimeAnswer = timeQuestion.answers.find(answer => answer.id === this.answers.when);
        if (selectedTimeAnswer && selectedTimeAnswer.content.toLowerCase().includes('thường xuyên')) {
          this.answers.when = 'always';
          this.stressLevel += 15;
          this.depressionRisk += 15;
        }
      }

      // Xét câu trả lời về người liên quan (câu 5)
      const relatedQuestion = this.questions[6];
      if (relatedQuestion && relatedQuestion.answers) {
        const selectedRelatedAnswer = relatedQuestion.answers.find(answer => answer.id === this.answers.related);
        if (selectedRelatedAnswer) {
          const content = selectedRelatedAnswer.content.toLowerCase();
          if (content.includes('bản thân') || content.includes('một mình')) {
            this.answers.related = 'myself';
            this.depressionRisk += 20;
          }
        }
      }

      this.stressLevel = Math.min(this.stressLevel, 100);
      this.depressionRisk = Math.min(this.depressionRisk, 100);

      this.isNormalMentalHealth =
        this.stressLevel < 30 && this.depressionRisk < 30;

      this.analyzeResults(this.stressLevel, this.depressionRisk);

      this.showAnalysisDialog = true;
    },

    analyzeResults(stressLevel, depressionRisk) {
      const issues = [];
      const symptoms = [];
      let severity = "";

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

      if (stressLevel > 70 || depressionRisk > 70) {
        severity = "nghiêm trọng";
      } else if (stressLevel > 40 || depressionRisk > 40) {
        severity = "trung bình";
      } else {
        severity = "nhẹ";
      }

      if (this.answers.when === "always") {
        symptoms.push("triệu chứng xuất hiện liên tục");
      }

      if (this.answers.related === "myself") {
        symptoms.push("tự đánh giá tiêu cực về bản thân");
      }

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

    async proceedToResults() {
      this.showAnalysisDialog = false;

      this.suggestedRoadmaps = await this.generatePersonalizedRoadmaps(
        this.stressLevel,
        this.depressionRisk
      );

      const hasPaidRoadmap = this.suggestedRoadmaps.some(
        (roadmap) => roadmap.isPaid
      );
      if (!hasPaidRoadmap) {
        const paidRoadmap = this.getDefaultPaidRoadmap();
        this.suggestedRoadmaps.unshift(paidRoadmap);

        if (this.suggestedRoadmaps.length > 4) {
          this.suggestedRoadmaps = this.suggestedRoadmaps.slice(0, 4);
        }
      }

      this.showResults = true;
    },

    getDefaultPaidRoadmap() {
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

    async generatePersonalizedRoadmaps(stressLevel, depressionRisk) {
      let roadmaps = [];
      
      try {
        // Lấy toàn bộ danh sách roadmaps
        const response = await getRoadmaps();
        if (!response || !Array.isArray(response)) {
          throw new Error("Invalid roadmaps data received");
        }

        roadmaps = response.map(roadmap => ({
          id: roadmap.id,
          title: roadmap.title,
          description: roadmap.description,
          steps: roadmap.phases?.length || 0,
          isPaid: roadmap.price ? true : false,
          price: roadmap.price || 0,
          features: [],
          match: this.calculateMatchScore(roadmap, stressLevel, depressionRisk),
          category: roadmap.category || '',
          phases: roadmap.phases || []
        }));

        // Lọc và sắp xếp roadmaps phù hợp
        roadmaps = roadmaps
          .filter(roadmap => {
            const title = roadmap.title.toLowerCase();
            const category = roadmap.category.toLowerCase();
            
            // Kiểm tra match với issue
            if (this.answers.issue === 'study_pressure' && 
                (title.includes('học tập') || title.includes('áp lực'))) {
              return true;
            }
            if (this.answers.issue === 'work_stress' && 
                (category === 'work-life' || title.includes('công việc') || title.includes('căng thẳng'))) {
              return true;
            }
            if (this.answers.issue === 'bullying' && 
                (title.includes('bắt nạt') || title.includes('xã hội'))) {
              return true;
            }
            if (this.answers.issue === 'loneliness' && 
                (title.includes('cô đơn') || title.includes('kết nối'))) {
              return true;
            }
            if (this.answers.issue === 'no_passion' && 
                (title.includes('động lực') || title.includes('đam mê'))) {
              return true;
            }
            
            // Nếu không match cụ thể, kiểm tra các từ khóa chung
            return title.includes('cân bằng') || 
                   title.includes('stress') || 
                   title.includes('sức khỏe tinh thần');
          })
          .sort((a, b) => b.match - a.match)
          .slice(0, 4); // Giới hạn 4 kết quả

        // Nếu không có roadmap phù hợp, thêm roadmap mặc định
        if (roadmaps.length === 0) {
          if (stressLevel > 60) {
            roadmaps.push({
              id: 'stress-management',
              title: 'Quản lý căng thẳng hiệu quả',
              description: 'Các kỹ thuật và phương pháp giúp bạn đối phó với stress trong cuộc sống.',
              match: 85,
              steps: 5,
              isPaid: false,
              price: 0,
              features: []
            });
          }

          if (depressionRisk > 60) {
            roadmaps.push({
              id: 'mood-improvement',
              title: 'Cải thiện tâm trạng',
              description: 'Các hoạt động và bài tập giúp cải thiện tâm trạng và năng lượng tích cực.',
              match: 80,
              steps: 5,
              isPaid: false,
              price: 0,
              features: []
            });
          }
        }

        return roadmaps;

      } catch (error) {
        console.error("Error generating personalized roadmaps:", error);
        return [];
      }
    },

    calculateMatchScore(roadmap, stressLevel, depressionRisk) {
      let score = 70; // Base score
      const title = roadmap.title.toLowerCase();
      const category = roadmap.category?.toLowerCase() || '';

      // Match với issue cụ thể
      if (this.answers.issue === 'study_pressure' && 
          (title.includes('học tập') || title.includes('áp lực'))) {
        score += 20;
      }
      if (this.answers.issue === 'work_stress' && 
          (category === 'work-life' || title.includes('công việc') || title.includes('căng thẳng'))) {
        score += 20;
      }
      if (this.answers.issue === 'bullying' && 
          (title.includes('bắt nạt') || title.includes('xã hội'))) {
        score += 20;
      }
      if (this.answers.issue === 'loneliness' && 
          (title.includes('cô đơn') || title.includes('kết nối'))) {
        score += 20;
      }
      if (this.answers.issue === 'no_passion' && 
          (title.includes('động lực') || title.includes('đam mê'))) {
        score += 20;
      }

      // Match với mức độ stress/trầm cảm
      if (stressLevel > 60 && title.includes('căng thẳng')) {
        score += 15;
      }
      if (depressionRisk > 60 && title.includes('trầm cảm')) {
        score += 15;
      }

      // Bonus cho các roadmap về cân bằng và sức khỏe tinh thần
      if (title.includes('cân bằng')) {
        score += 10;
      }
      if (title.includes('sức khỏe tinh thần')) {
        score += 10;
      }

      return Math.min(score, 100); // Cap at 100%
    },

    selectRoadmap(roadmap) {
      this.selectedRoadmap = roadmap;
      this.showRoadmapDetail = false;
      this.showPaymentDialog = true;
    },

    processPayment() {
      setTimeout(() => {
        this.showPaymentDialog = false;
        this.showPaymentSuccess = true;

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

    getRoadmapIcon(id) {
      return this.roadmapIcons[id] || "mdi-lightbulb-outline";
    },

    togglePlay() {
      this.isPlaying = !this.isPlaying;
      // Trong ứng dụng thực tế, bạn sẽ phát/dừng âm nhạc ở đây
    },

    nextTrack() {
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.audioTracks.length;
      this.currentTrack = this.audioTracks[this.currentTrackIndex];
    },

    getEvaluationText(userType, issue) {
      if (!userType || !issue) {
        return 'Cảm ơn bạn đã chia sẻ. Chúng tôi sẽ đề xuất một số lộ trình phù hợp với bạn.';
      }

      // Lấy text của user type
      const userTypeOption = this.userTypeOptions.find(opt => opt.value === userType);
      const userTypeText = userTypeOption ? userTypeOption.text.toLowerCase() : '';

      // Lấy text của issue
      const issueOptions = this.getIssueOptions(userType);
      const issueOption = issueOptions.find(opt => opt.value === issue);
      const issueText = issueOption ? issueOption.text.toLowerCase() : '';

      if (userType === 'other' || issue === 'other') {
        return 'Cảm ơn bạn đã chia sẻ chi tiết. Chúng tôi sẽ cố gắng đề xuất những lộ trình phù hợp nhất với hoàn cảnh của bạn.';
      }

      if (this.isNormalMentalHealth) {
        return `Là một ${userTypeText}, việc gặp ${issueText} là điều bình thường. Tuy nhiên, chúng tôi nhận thấy bạn đang kiểm soát tốt vấn đề này. Hãy tiếp tục duy trì những thói quen tích cực nhé!`;
      }

      if (this.analysisResult.severity === 'nghiêm trọng') {
        return `Chúng tôi hiểu rằng là một ${userTypeText}, việc đối mặt với ${issueText} có thể rất khó khăn. Đừng lo lắng, chúng tôi sẽ đồng hành cùng bạn vượt qua giai đoạn này.`;
      }

      if (this.analysisResult.severity === 'trung bình') {
        return `Là một ${userTypeText}, việc ${issueText} có thể ảnh hưởng đến cuộc sống của bạn. Hãy để chúng tôi giúp bạn cải thiện tình hình này nhé.`;
      }

      return `Cảm ơn bạn đã chia sẻ về ${issueText}. Chúng tôi sẽ gợi ý một số phương pháp giúp bạn cải thiện tình hình này.`;
    },

    watch: {
      'answers.userType': {
        handler(newUserType) {
          this.answers.issue = '';
          this.answers.issueOther = '';

          // Cập nhật options cho câu 2
          this.issueOptions = this.getIssueOptions(newUserType);
        },
        immediate: true
      }
    },
  },
};
</script>

<style scoped>
.roadmap-container {
  min-width: 1200px;
  margin-top: -35px;
  padding: 20px;
}

.roadmap-content {
  max-width: 1200px;
  margin: 0 auto;
}

.suggestion-card {
  border-radius: 12px;
  overflow: hidden;
}

.result-section {
  padding: 20px 0;
}

.result-title {
  font-weight: 600;
  color: #2e7d32;
}

.result-message {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.normal-mental-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  background-color: #f1f8e9;
}

.roadmap-card {
  border-radius: 12px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.roadmap-card .v-card-title {
  padding-top: 40px !important;
  /* hoặc lớn hơn nếu cần */
  padding-right: 16px;
  position: relative;
}

.roadmap-card .v-card-text {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.roadmap-card .v-card-actions {
  margin-top: auto;
  padding: 16px;
}

.roadmap-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.best-match-chip {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.border-primary {
  border: 2px solid #2e7d32;
}

.paid-features {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 8px;
}

.normal-mental-card {
  background: linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%);
  border-radius: 12px;
  background-color: #f1f8e9;
}

.result-message {
  max-width: 800px;
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
  font-weight: 600;
}

.best-match-chip {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
}

.border-primary {
  border: 2px solid #2e7d32;
}

.paid-features {
  background-color: #f5f5f5;
  padding: 8px;
  border-radius: 8px;
}

.roadmap-description {
  min-height: 40px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>