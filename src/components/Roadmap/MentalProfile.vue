<template>
  <v-card class="mb-6 mental-profile-card">
    <v-card-title class="d-flex align-center">
      <v-icon color="primary" class="mr-2">mdi-heart-pulse</v-icon>
      Hồ sơ tâm lý của bạn
    </v-card-title>
    <v-card-subtitle class="text-subtitle-1">
      Dựa trên những chia sẻ của bạn, chúng tôi đã tạo ra hồ sơ tâm lý này để hiểu rõ hơn về tình trạng của bạn
    </v-card-subtitle>

    <v-card-text>
      <div v-if="personalAdvice" class="advice-box mb-4">
        <v-icon color="success" class="mr-1">mdi-hand-heart</v-icon>
        <span>{{ personalAdvice }}</span>
      </div>
      <v-row>
        <v-col cols="12" md="6">
          <div class="profile-section">
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey d-flex align-center">
                <v-icon small class="mr-1">mdi-account</v-icon>
                Đối tượng
              </div>
              <div class="text-body-1">{{ profile.userType }}</div>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-2 text-grey d-flex align-center">
                <v-icon small class="mr-1">mdi-alert-circle</v-icon>
                Nguồn căng thẳng chính
              </div>
              <div class="text-body-1">{{ profile.stressSource }}</div>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-2 text-grey d-flex align-center">
                <v-icon small class="mr-1">mdi-target</v-icon>
                Mục tiêu cải thiện
              </div>
              <div class="text-body-1">{{ profile.improvementGoal }}</div>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="6">
          <div class="profile-section">
            <div class="mb-4">
              <div class="text-subtitle-2 text-grey d-flex align-center">
                <v-icon small class="mr-1">mdi-lightning-bolt</v-icon>
                Mức độ căng thẳng
              </div>
              <v-progress-linear
                :model-value="profile.stressLevel"
                :color="getStressColor(profile.stressLevel)"
                height="8"
                rounded
              ></v-progress-linear>
              <div class="text-caption text-right mt-1">
                {{ getStressText(profile.stressLevel) }}
              </div>
            </div>

            <div class="mb-4">
              <div class="text-subtitle-2 text-grey d-flex align-center">
                <v-icon small class="mr-1">mdi-emoticon-sad-outline</v-icon>
                Nguy cơ trầm cảm
              </div>
              <v-progress-linear
                :model-value="profile.depressionRisk"
                :color="getDepressionColor(profile.depressionRisk)"
                height="8"
                rounded
              ></v-progress-linear>
              <div class="text-caption text-right mt-1">
                {{ getDepressionText(profile.depressionRisk) }}
              </div>
            </div>

            <div>
              <div class="text-subtitle-2 text-grey d-flex align-center">
                <v-icon small class="mr-1">mdi-chart-line</v-icon>
                <span v-if="profile.emotionalIndex && profile.emotionalIndex.length > 1">Chỉ số cảm xúc 5 ngày gần đây</span>
                <span v-else>Chỉ số cảm xúc hôm nay</span>
              </div>
              <v-sheet height="100" class="d-flex align-end emotion-chart">
                <div
                  v-for="(day, i) in (profile.emotionalIndex && profile.emotionalIndex.length > 1 ? profile.emotionalIndex : [profile.emotionalIndex[0]])"
                  :key="i"
                  class="emotion-bar mx-1"
                  :style="`height: ${day ? day.value: 0}%; width: 20%`"
                ></div>
              </v-sheet>
              <div class="d-flex justify-space-between mt-1">
                <span
                  v-for="(day, i) in (profile.emotionalIndex && profile.emotionalIndex.length > 1 ? profile.emotionalIndex : [profile.emotionalIndex[0]])"
                  :key="i"
                  class="text-caption"
                >
                  {{ day ? formatDate(day.date) : "" }}
                </span>
              </div>
              <div v-if="!profile.emotionalIndex || profile.emotionalIndex.length <= 1" class="text-caption mt-2" style="color:#888;">
                Chỉ số cảm xúc sẽ được cập nhật khi bạn sử dụng web thường xuyên hơn.
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { getMentalProfileData } from "@/scripts/data/roadmapData.js";

export default {
  name: "MentalProfile",
  data() {
    return {
      profile: {
        userType: "",
        stressSource: "",
        improvementGoal: "",
        stressLevel: 0,
        depressionRisk: 0,
        emotionalIndex: []
      }
    };
  },
  computed: {
    personalAdvice() {
      // Use either the prop profile or the locally fetched profile
      const profileData = this.profile;
      
      // Return empty if no profile data is available yet
      if (!profileData) return '';
      
      // Đánh giá cá nhân hóa dựa trên profile
      if (profileData.stressLevel >= 70) {
        return "Bạn đang có mức độ căng thẳng cao. Hãy thử các bài tập thở sâu, nghỉ ngơi hợp lý và đừng ngần ngại chia sẻ với người thân hoặc chuyên gia.";
      }
      if (profileData.depressionRisk >= 70) {
        return "Nguy cơ trầm cảm của bạn khá cao. Đừng tự chịu đựng một mình, hãy tìm kiếm sự hỗ trợ từ bạn bè, gia đình hoặc chuyên gia tâm lý.";
      }
      if (profileData.stressLevel < 30 && profileData.depressionRisk < 30) {
        return "Tình trạng tâm lý của bạn khá ổn định. Hãy tiếp tục duy trì lối sống lành mạnh và quan tâm đến cảm xúc của mình nhé!";
      }
      if (profileData.userType === "Người đi làm" && profileData.stressSource === "Công việc") {
        return "Công việc có thể mang lại nhiều áp lực. Hãy cân bằng giữa công việc và cuộc sống, đừng quên dành thời gian cho bản thân.";
      }
      if (profileData.userType === "Học sinh/Sinh viên" && profileData.stressSource === "Việc học") {
        return "Áp lực học tập là điều ai cũng trải qua. Hãy chia nhỏ mục tiêu, nghỉ ngơi hợp lý và đừng ngại nhờ sự giúp đỡ từ thầy cô, bạn bè hoặc gia đình.";
      }
      return "Hãy lắng nghe cảm xúc của mình và đừng ngần ngại tìm kiếm sự hỗ trợ khi cần thiết. Chúng tôi luôn đồng hành cùng bạn!";
    }
  },
  async created() {
    // Only fetch data if no profile is provided via props
    if (!this.profile || !this.profile.userType) {
      try {
        this.profile = await getMentalProfileData();
      } catch (error) {
        console.error("Error fetching mental profile data:", error);
      }
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.getDate();
    },
    getStressColor(level) {
      if (level < 30) return 'success';
      if (level < 70) return 'warning';
      return 'error';
    },
    getDepressionColor(level) {
      if (level < 30) return 'success';
      if (level < 70) return 'warning';
      return 'error';
    },
    getStressText(level) {
      if (level < 30) return 'Mức độ căng thẳng thấp';
      if (level < 70) return 'Mức độ căng thẳng trung bình';
      return 'Mức độ căng thẳng cao';
    },
    getDepressionText(level) {
      if (level < 30) return 'Nguy cơ thấp';
      if (level < 70) return 'Nguy cơ trung bình';
      return 'Nguy cơ cao';
    }
  },
};
</script>

<style scoped>
.mental-profile-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.profile-section {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.emotion-chart {
  background: #fff;
  border-radius: 8px;
  padding: 8px;
}

.emotion-bar {
  background: linear-gradient(180deg, #6a39ca 0%, #8e44ad 100%);
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
}

.advice-box {
  background: #e8f5e9;
  border-radius: 8px;
  padding: 12px 16px;
  color: #388e3c;
  font-weight: 500;
  display: flex;
  align-items: center;
  font-size: 1.05rem;
}
</style>
