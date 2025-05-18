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
          <div
            style="
              color: #43a047;
              margin-top: 6px;
              font-style: italic;
              font-size: 0.98rem;
            "
          >
            Mọi thông tin bạn cung cấp đều được bảo mật tuyệt đối. Hãy trả lời
            theo cảm nhận của bạn, không có đúng/sai!
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
                  <div
                    style="
                      color: #388e3c;
                      font-size: 0.97rem;
                      margin-bottom: 4px;
                    "
                  >
                    Hãy chọn nhóm mô tả đúng nhất về bạn nhé! (Bạn có thể chia
                    sẻ thêm nếu muốn)
                  </div>
                  <h3 class="text-h6 mb-4"
                    >Công việc hiện tại của bạn là gì?</h3
                  >
                  <v-radio-group v-model="answers.userType">
                    <v-radio
                      v-for="option in userTypeOptions"
                      :key="option.value"
                      :label="option.text"
                      :value="option.value"
                    ></v-radio>
                    <v-radio label="Khác" value="other"></v-radio>
                  </v-radio-group>
                  <v-text-field
                    v-if="answers.userType === 'other'"
                    v-model="answers.userTypeOther"
                    label="Vui lòng mô tả công việc của bạn"
                    outlined
                    dense
                  ></v-text-field>
                </v-card-text>
              </v-stepper-window-item>

              <template v-if="!skippedIssue">
                <v-stepper-window-item :value="2">
                  <v-card-text>
                    <div
                      style="
                        color: #388e3c;
                        font-size: 0.97rem;
                        margin-bottom: 4px;
                      "
                    >
                      Bạn có thể chọn vấn đề khác nếu cần, mọi chia sẻ đều được
                      bảo mật!
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
                    <div
                      style="
                        color: #388e3c;
                        font-size: 0.97rem;
                        margin-bottom: 4px;
                      "
                    >
                      Chia sẻ thêm để chúng tôi hiểu bạn hơn nhé!
                    </div>
                    <h3 class="text-h6 mb-4">Vấn đề đó thường xảy ra ở đâu?</h3>
                    <v-radio-group v-model="answers.where">
                      <v-radio
                        v-for="option in whereOptions"
                        :key="option.value"
                        :label="option.text"
                        :value="option.value"
                      ></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                    <v-text-field
                      v-if="answers.where === 'other'"
                      v-model="answers.whereOther"
                      label="Vui lòng mô tả nơi vấn đề xảy ra"
                      outlined
                      dense
                    ></v-text-field>
                  </v-card-text>
                </v-stepper-window-item>

                <v-stepper-window-item :value="4">
                  <v-card-text>
                    <div
                      style="
                        color: #388e3c;
                        font-size: 0.97rem;
                        margin-bottom: 4px;
                      "
                    >
                      Thường xảy ra vào thời gian nào?
                    </div>
                    <v-radio-group v-model="answers.when">
                      <v-radio
                        v-for="option in whenOptions"
                        :key="option.value"
                        :label="option.text"
                        :value="option.value"
                      ></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                    <v-text-field
                      v-if="answers.when === 'other'"
                      v-model="answers.whenOther"
                      label="Vui lòng mô tả thời gian vấn đề xảy ra"
                      outlined
                      dense
                    ></v-text-field>
                  </v-card-text>
                </v-stepper-window-item>

                <v-stepper-window-item :value="5">
                  <v-card-text>
                    <div
                      style="
                        color: #388e3c;
                        font-size: 0.97rem;
                        margin-bottom: 4px;
                      "
                    >
                      Ai thường liên quan đến vấn đề này?
                    </div>
                    <v-radio-group v-model="answers.related">
                      <v-radio
                        v-for="option in relatedOptions"
                        :key="option.value"
                        :label="option.text"
                        :value="option.value"
                      ></v-radio>
                      <v-radio label="Khác" value="other"></v-radio>
                    </v-radio-group>
                    <v-text-field
                      v-if="answers.related === 'other'"
                      v-model="answers.relatedOther"
                      label="Vui lòng mô tả người liên quan"
                      outlined
                      dense
                    ></v-text-field>
                  </v-card-text>
                </v-stepper-window-item>
              </template>
              <template v-else>
                <v-stepper-window-item :value="2">
                  <v-card-text class="text-center py-8">
                    <v-icon color="primary" size="48"
                      >mdi-emoticon-sad-outline</v-icon
                    >
                    <div
                      style="
                        font-size: 1.2rem;
                        color: #388e3c;
                        margin: 18px 0 8px 0;
                      "
                    >
                      Đôi khi thật khó để gọi tên vấn đề của mình.
                    </div>
                    <div style="color: #555; margin-bottom: 18px">
                      Bạn không cần phải vội vàng – khi nào sẵn sàng, chúng tôi
                      luôn ở đây để lắng nghe và đồng hành cùng bạn!
                    </div>
                    <v-btn
                      color="primary"
                      class="mr-4"
                      @click="backToFirstQuestion"
                    >
                      Quay lại trả lời
                    </v-btn>
                    <v-btn
                      outlined
                      color="grey"
                      @click="$router.push('/roadmaps/recommended')"
                    >
                      Bỏ qua & Xem các lộ trình
                    </v-btn>
                  </v-card-text>
                </v-stepper-window-item>
              </template>
            </v-stepper-window>

            <v-divider />

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
                {{ currentStep < 5 ? "Tiếp theo" : "Hoàn thành" }}
              </v-btn>
            </v-card-actions>
          </v-stepper>
        </v-card-text>
      </v-card>

      <div v-if="showResults">
        <div class="result-section">
          <div class="text-center mb-8">
            <v-icon color="primary" size="48" class="mb-4"
              >mdi-heart-multiple</v-icon
            >
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
              <p class="text-body-1"
                >Dựa trên những chia sẻ của bạn, chúng tôi nhận thấy tâm lý của
                bạn đang ở trạng thái khá ổn định. Đây là một điều tuyệt vời!</p
              >
              <p class="text-body-1 mt-2"
                >Bạn có muốn thư giãn với một chút âm nhạc không?</p
              >

              <div class="d-flex justify-center mt-4">
                <v-btn
                  color="primary"
                  prepend-icon="mdi-music"
                  @click="showMusicPlayer = true"
                >
                  Nghe nhạc thư giãn
                </v-btn>
              </div>

              <v-expand-transition>
                <div v-if="showMusicPlayer" class="mt-4">
                  <v-card flat>
                    <v-card-text>
                      <div class="text-center mb-2">
                        <div class="text-h6">Nhạc thư giãn</div>
                        <div class="text-subtitle-1 text-grey"
                          >Hãy thư giãn và tận hưởng</div
                        >
                      </div>
                      <v-slider
                        v-model="audioVolume"
                        prepend-icon="mdi-volume-low"
                        append-icon="mdi-volume-high"
                        @click:prepend="
                          audioVolume = Math.max(0, audioVolume - 10)
                        "
                        @click:append="
                          audioVolume = Math.min(100, audioVolume + 10)
                        "
                        step="1"
                        min="0"
                        max="100"
                      ></v-slider>
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
                <v-chip
                  v-if="index === 0"
                  color="success"
                  size="small"
                  class="best-match-chip"
                >
                  <v-icon size="x-small" class="mr-1">mdi-star</v-icon>
                  Phù hợp nhất với bạn
                </v-chip>
                <v-card-title class="d-flex align-center">
                  <v-icon
                    :color="roadmap.isPaid ? 'primary' : 'primary'"
                    class="mr-2"
                  >
                    {{ getRoadmapIcon(roadmap.id) }}
                  </v-icon>
                  <span class="text-truncate">{{ roadmap.title }}</span>
                  <v-chip
                    v-if="roadmap.isPaid"
                    color="primary"
                    size="small"
                    class="ml-2"
                  >
                    Trả phí
                  </v-chip>
                </v-card-title>
                <v-card-text>
                  <v-chip
                    :color="roadmap.isPaid ? 'primary' : 'success'"
                    class="mb-2"
                  >
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
                    <v-chip
                      :color="roadmap.isPaid ? 'primary' : 'success'"
                      size="small"
                    >
                      {{
                        roadmap.isPaid
                          ? roadmap.price.toLocaleString() + " VND"
                          : "Miễn phí"
                      }}
                    </v-chip>
                  </div>
                  <div v-if="roadmap.isPaid" class="paid-features mt-3">
                    <div class="text-caption font-weight-medium mb-1"
                      >Bao gồm:</div
                    >
                    <div
                      v-for="(feature, i) in roadmap.features"
                      :key="i"
                      class="d-flex align-center text-caption mb-1"
                    >
                      <v-icon size="x-small" color="primary" class="mr-1"
                        >mdi-check</v-icon
                      >
                      {{ feature }}
                    </div>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    block
                    :color="roadmap.isPaid ? 'primary' : 'primary'"
                    :variant="index === 0 ? 'elevated' : 'outlined'"
                    @click="viewRoadmapDetails(roadmap)"
                  >
                    {{ roadmap.isPaid ? "Xem chi tiết" : "Bắt đầu miễn phí" }}
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
              <v-list-item
                v-for="(feature, i) in selectedRoadmap?.features"
                :key="i"
                :title="feature"
                prepend-icon="mdi-check-circle"
                density="compact"
              ></v-list-item>
            </v-list>

            <v-divider class="my-4"></v-divider>

            <div class="d-flex justify-space-between align-center mb-4">
              <span class="text-subtitle-1">Tổng thanh toán:</span>
              <span class="text-h6 font-weight-bold"
                >{{ selectedRoadmap?.price.toLocaleString() }} VND</span
              >
            </div>

            <v-alert color="info" variant="tonal" class="mb-4">
              <div class="d-flex align-center">
                <v-icon color="info" class="mr-2">mdi-information</v-icon>
                <span
                  >Thanh toán an toàn và bảo mật. Bạn có thể hủy bất kỳ lúc
                  nào.</span
                >
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
            <v-icon color="success" size="64" class="mb-4"
              >mdi-check-circle</v-icon
            >
            <h3 class="text-h5 mb-2">Thanh toán thành công!</h3>
            <p class="mb-4"
              >Cảm ơn bạn đã thanh toán. Bạn đã có thể truy cập đầy đủ nội dung
              của lộ trình.</p
            >
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
              <div class="text-subtitle-1 font-weight-medium mb-2"
                >Dựa vào các câu trả lời của bạn, chúng tôi xác định:
              </div>
              <div v-if="analysisResult.issues.length > 0" class="mb-2">
                <span class="font-weight-medium"
                  >Bạn đang gặp các vấn đề về:</span
                >
                <span>{{ analysisResult.issues.join(", ") }}</span>
              </div>
              <div class="mb-2">
                <span class="font-weight-medium">Ở mức:</span>
                <span>{{ analysisResult.severity }}</span>
              </div>
              <div v-if="analysisResult.symptoms.length > 0">
                <span class="font-weight-medium">Các triệu chứng:</span>
                <ul class="mt-1 mb-0">
                  <li
                    v-for="(symptom, index) in analysisResult.symptoms"
                    :key="index"
                  >
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

            <div
              v-else-if="analysisResult.severity === 'nghiêm trọng'"
              class="text-error mb-4"
            >
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
            <v-icon
              :color="roadmapDetail.isPaid ? 'primary' : 'success'"
              class="mr-2"
            >
              {{ getRoadmapIcon(roadmapDetail.id) }}
            </v-icon>
            {{ roadmapDetail.title }}
            <v-chip
              v-if="roadmapDetail.isPaid"
              color="primary"
              size="small"
              class="ml-2"
            >
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
                  <v-timeline-item
                    v-for="(step, index) in roadmapDetail.steps"
                    :key="index"
                    :dot-color="
                      roadmapDetail.isPaid && !hasAccessToRoadmap
                        ? 'grey'
                        : 'primary'
                    "
                    :icon="
                      roadmapDetail.isPaid && !hasAccessToRoadmap && index > 0
                        ? 'mdi-lock'
                        : ''
                    "
                    size="small"
                  >
                    <div class="d-flex align-center">
                      <strong>Bước {{ index + 1 }}:</strong>
                      <span
                        class="ml-2"
                        :class="{
                          'text-grey':
                            roadmapDetail.isPaid &&
                            !hasAccessToRoadmap &&
                            index > 0,
                        }"
                      >
                        {{
                          index === 0 ||
                          !roadmapDetail.isPaid ||
                          hasAccessToRoadmap
                            ? step.title
                            : "Nội dung khóa học trả phí"
                        }}
                      </span>
                    </div>
                    <div
                      v-if="
                        index === 0 ||
                        !roadmapDetail.isPaid ||
                        hasAccessToRoadmap
                      "
                      class="text-body-2 mt-1"
                    >
                      {{ step.description }}
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </div>

              <v-divider v-if="roadmapDetail.isPaid" class="my-4"></v-divider>

              <div v-if="roadmapDetail.isPaid" class="mb-4">
                <h3 class="text-h6 mb-2">Quyền lợi khi mua lộ trình này</h3>
                <v-list density="compact">
                  <v-list-item
                    v-for="(feature, i) in roadmapDetail.features"
                    :key="i"
                    :title="feature"
                    prepend-icon="mdi-check-circle-outline"
                    density="compact"
                  ></v-list-item>
                </v-list>
              </div>

              <v-alert
                v-if="roadmapDetail.isPaid && !hasAccessToRoadmap"
                color="info"
                variant="tonal"
                class="mt-4"
              >
                <div class="d-flex align-center">
                  <v-icon color="info" class="mr-2">mdi-information</v-icon>
                  <span
                    >Mua lộ trình này để mở khóa tất cả nội dung và bắt đầu hành
                    trình của bạn.</span
                  >
                </div>
              </v-alert>
            </template>
          </v-card-text>

          <v-card-actions>
            <v-btn variant="text" @click="showRoadmapDetail = false">
              Đóng
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              v-if="roadmapDetail.isPaid && !hasAccessToRoadmap"
              color="primary"
              @click="selectRoadmap(roadmapDetail)"
            >
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
      issueOptions: {},
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
      // Thêm các biến mới cho chi tiết lộ trình
      showRoadmapDetail: false,
      roadmapDetail: null,
      loadingRoadmapDetail: false,
      roadmapDetailError: null,
      hasAccessToRoadmap: false,
    };
  },
  async created() {
    await this.fetchSuggestionData();
  },
  computed: {
    canProceed() {
      return true;
    },
    personalized() {
      return this.getPersonalizedAnalysis();
    },
  },
  methods: {
    async fetchSuggestionData() {
      try {
        this.loading = true;
        this.error = null;

        const response = await getSuggestionData();

        if (response) {
          this.userTypeOptions = response.userTypeOptions || [];
          this.issueOptions = response.issueOptions || {};
          this.whereOptions = response.whereOptions || [];
          this.whenOptions = response.whenOptions || [];
          this.relatedOptions = response.relatedOptions || [];
          this.audioTracks = response.audioTracks || [];
          this.roadmapIcons = response.roadmapIcons || {};

          if (this.audioTracks.length > 0) {
            this.currentTrack = this.audioTracks[0];
          }
        } else {
          this.error = "Không thể tải dữ liệu gợi ý. Vui lòng thử lại sau.";
          this.setDefaultOptions();
        }
      } catch (error) {
        console.error("Error fetching suggestion data:", error);
        this.error = "Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.";
        this.setDefaultOptions();
      } finally {
        this.loading = false;
      }
    },

    async fetchRoadmapDetail(roadmapId) {
      try {
        this.loadingRoadmapDetail = true;
        this.roadmapDetailError = null;

        const response = await getRoadmapById(roadmapId);

        if (response) {
          this.roadmapDetail = response;
          this.checkRoadmapAccess(roadmapId);
        } else {
          this.roadmapDetailError =
            "Không thể tải thông tin lộ trình. Vui lòng thử lại sau.";
        }
      } catch (error) {
        console.error("Error fetching roadmap detail:", error);
        this.roadmapDetailError =
          "Đã xảy ra lỗi khi tải thông tin lộ trình. Vui lòng thử lại sau.";
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

    setDefaultOptions() {
      this.userTypeOptions = [
        { text: "Học sinh", value: "student" },
        { text: "Sinh viên", value: "university" },
        { text: "Người đi làm", value: "worker" },
      ];

      this.issueOptions = {
        student: [
          { text: "Áp lực học tập, thi cử", value: "study_pressure" },
          { text: "Bị bắt nạt hoặc cô lập ở trường", value: "bullying" },
          { text: "Không có bạn thân", value: "no_close_friend" },
          { text: "Mâu thuẫn với cha mẹ", value: "parent_conflict" },
          { text: "Mất động lực", value: "no_motivation" },
        ],
        university: [
          { text: "Lo lắng về tương lai", value: "future_worry" },
          { text: "Mất định hướng nghề nghiệp", value: "career_confusion" },
          { text: "Cô đơn", value: "loneliness" },
          { text: "Chán học", value: "boredom" },
          { text: "Stress vì thực tập/thi cử", value: "intern_stress" },
        ],
        worker: [
          { text: "Căng thẳng công việc", value: "work_stress" },
          { text: "Mâu thuẫn đồng nghiệp", value: "colleague_conflict" },
          { text: "Cảm giác không được công nhận", value: "not_recognized" },
          { text: "Không còn đam mê", value: "no_passion" },
          {
            text: "Mất cân bằng cuộc sống – công việc",
            value: "work_life_balance",
          },
        ],
      };

      this.whereOptions = [
        { text: "Ở nhà", value: "home" },
        { text: "Ở trường/nơi làm việc", value: "work_school" },
        { text: "Ở nơi công cộng", value: "public" },
        { text: "Mọi nơi", value: "everywhere" },
      ];

      this.whenOptions = [
        { text: "Buổi sáng", value: "morning" },
        { text: "Buổi chiều", value: "afternoon" },
        { text: "Buổi tối", value: "evening" },
        { text: "Cuối tuần", value: "weekend" },
        { text: "Liên tục", value: "always" },
      ];

      this.relatedOptions = [
        { text: "Bản thân tôi", value: "myself" },
        { text: "Gia đình", value: "family" },
        { text: "Bạn bè", value: "friends" },
        { text: "Đồng nghiệp/bạn học", value: "colleagues" },
        { text: "Người yêu/vợ chồng", value: "partner" },
      ];

      this.audioTracks = [
        "Relaxing Nature Sounds",
        "Peaceful Piano",
        "Meditation Music",
        "Deep Sleep Sounds",
        "Stress Relief Melodies",
      ];

      this.roadmapIcons = {
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

    proceedToResults() {
      this.showAnalysisDialog = false;

      this.suggestedRoadmaps = this.generatePersonalizedRoadmaps(
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

    generatePersonalizedRoadmaps(stressLevel, depressionRisk) {
      let roadmaps = [];

      try {
        if (this.answers.userType && this.answers.issue) {
          const userTypeRoadmaps = this.issueOptions[this.answers.userType];
          if (userTypeRoadmaps && userTypeRoadmaps[this.answers.issue]) {
            roadmaps = userTypeRoadmaps[this.answers.issue];
          }
        }

        if (roadmaps.length === 0) {
          if (
            this.isNormalMentalHealth &&
            this.issueOptions.normal &&
            this.issueOptions.normal.normal
          ) {
            roadmaps = this.issueOptions.normal.normal;
          } else if (
            this.issueOptions.default &&
            this.issueOptions.default.default
          ) {
            roadmaps = this.issueOptions.default.default;
          }
        }
      } catch (error) {
        console.error("Error generating personalized roadmaps:", error);
      }

      if (roadmaps.length === 0) {
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
          if (
            ["career_confusion", "future_worry"].includes(this.answers.issue)
          ) {
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
              features: [],
            });
          }
        }

        if (this.answers.userType === "worker") {
          if (
            ["work_stress", "work_life_balance"].includes(this.answers.issue)
          ) {
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

        roadmaps.push({
          id: "7",
          title: "Thư giãn với âm nhạc",
          description:
            "Bộ sưu tập nhạc thư giãn và thiền định giúp giảm căng thẳng",
          match: 85,
          steps: 5,
          isPaid: false,
          price: 0,
          features: [],
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
          features: [],
        });

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
            features: [],
          });
        }
      }

      roadmaps.sort((a, b) => b.match - a.match);

      return roadmaps.slice(0, 4);
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

    getIssueOptions(userType) {
      if (!userType || !this.issueOptions) return [];
      return this.issueOptions[userType] || [];
    },

    getEvaluationText(userType, issue) {
      if (this.isNormalMentalHealth) {
        return "Dựa trên những chia sẻ của bạn, chúng tôi nhận thấy tâm lý của bạn đang ở trạng thái khá ổn định. Tuy nhiên, việc chăm sóc sức khỏe tinh thần là một hành trình liên tục, và chúng tôi có một số gợi ý để giúp bạn duy trì trạng thái tích cực này.";
      }

      if (!issue) {
        return "Bạn chưa sẵn sàng chia sẻ vấn đề của mình? Không sao cả! Bạn có thể thử các lộ trình dưới đây, hoặc quay lại khảo sát khi cảm thấy sẵn sàng hơn.";
      }

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

      return "Cảm ơn bạn đã chia sẻ những trải nghiệm cá nhân. Dựa trên thông tin bạn cung cấp, chúng tôi đã xây dựng lộ trình được cá nhân hóa để hỗ trợ bạn hiệu quả nhất. Mỗi thử thách bạn đang đối mặt đều là cơ hội để phát triển, và chúng tôi tin rằng với những công cụ phù hợp, bạn sẽ không chỉ vượt qua khó khăn mà còn phát triển mạnh mẽ hơn.";
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
  padding-top: 16px;
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
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>