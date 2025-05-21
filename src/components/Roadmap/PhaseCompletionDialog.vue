<template>
  <v-dialog v-model="dialogVisible" max-width="540px" persistent>
    <v-card class="rounded-xl pa-0">
      <v-card-title
        class="d-flex align-center"
        :style="{ background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)', color: 'white', borderTopLeftRadius: '18px', borderTopRightRadius: '18px' }"
      >
        <v-icon size="36" class="mr-3 bounce">mdi-trophy</v-icon>
        <span class="text-h5 font-weight-bold">Hoàn thành Phase: {{ phaseTitle }}</span>
      </v-card-title>

      <v-card-text class="pt-5 pb-0 px-6">
        <div class="mb-4 text-center">
          <v-icon color="success" size="40" class="mb-2">mdi-check-circle</v-icon>
          <div class="text-h6 font-weight-bold" style="color: #43cea2;">
            Chúc mừng bạn đã hoàn thành phase này! Hãy tự hào về bản thân mình!
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="mb-2 text-subtitle-2 font-weight-bold">Đánh giá tiến độ của bạn</div>
        <v-row dense>
          <v-col cols="12" v-for="(criteria, index) in criteriaList" :key="index">
            <v-sheet
              class="pa-3 mb-2 d-flex align-center transition"
              :elevation="completedCriteria[index] ? 3 : 1"
              :color="completedCriteria[index] ? '#e8f5e9' : '#f5f7fa'"
              rounded
            >
              <v-checkbox
                v-model="completedCriteria[index]"
                color="success"
                hide-details
                class="mr-2"
              ></v-checkbox>
              <div>
                <div class="font-weight-medium">{{ criteria.title }}</div>
                <div class="text-caption" style="color: #888;">{{ criteria.description }}</div>
              </div>
            </v-sheet>
          </v-col>
        </v-row>

        <v-divider class="my-4"></v-divider>

        <div class="mb-2 text-subtitle-2 font-weight-bold">Tài liệu tham khảo</div>
        <div>
          <div
            v-for="(doc, idx) in documents"
            :key="idx"
            :href="doc.url"
            target="_blank"
            class="rounded-lg mb-1 doc-link"
            style="display: flex; align-items: center; gap: 10px; min-height: 48px; cursor: pointer;"
            @click="() => window.open(doc.url, '_blank')"
          >
            <v-icon left color="primary" style="margin-right: 8px;">mdi-file-document-outline</v-icon>
            <span>{{ doc.title }}</span>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <div class="mb-2 text-subtitle-2 font-weight-bold">Bạn muốn làm gì tiếp theo?</div>
        <v-radio-group v-model="nextAction" class="mb-2">
          <v-radio
            label="Tiếp tục lộ trình"
            value="yes"
            color="primary"
            class="mb-1"
            prepend-icon="mdi-arrow-right-bold-circle"
          ></v-radio>
          <v-radio
            label="Xem lại lộ trình"
            value="review"
            color="info"
            class="mb-1"
            prepend-icon="mdi-eye-outline"
          ></v-radio>
          <v-radio
            label="Tạm dừng"
            value="pause"
            color="grey"
            prepend-icon="mdi-pause-circle"
          ></v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions class="px-6 pb-5 pt-2">
        <v-spacer></v-spacer>
        <v-btn color="primary" block large class="rounded-lg" @click="submitEvaluation" :disabled="!isFormValid">
          Xác nhận & Tiếp tục
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'PhaseCompletionDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    phaseId: {
      type: String,
      required: true
    },
    phaseTitle: {
      type: String,
      required: true
    },
    documents: {
      type: Array,
      default: () => []
    },
    criteriaList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogVisible: false,
      completedCriteria: {},
      nextAction: 'yes'
    };
  },
  computed: {
    isFormValid() {
      // Kiểm tra xem người dùng đã chọn ít nhất một tiêu chí và đã chọn hành động tiếp theo chưa
      return Object.values(this.completedCriteria).some(value => value === true) && this.nextAction;
    }
  },
  watch: {
    show(newVal) {
      this.dialogVisible = newVal;
      if (newVal) {
        // Khởi tạo completedCriteria khi dialog mở
        this.criteriaList.forEach((_, index) => {
          this.completedCriteria[index] = false;
        });
      }
    },
    dialogVisible(newVal) {
      if (!newVal) {
        this.$emit('close');
      }
    }
  },
  created() {
    // Khởi tạo completedCriteria
    if (this.criteriaList) {
      this.criteriaList.forEach((_, index) => {
        this.completedCriteria[index] = false;
      });
    }
  },
  methods: {
    submitEvaluation() {
      // Gửi dữ liệu đánh giá lên component cha
      this.$emit('submit', {
        phaseId: this.phaseId,
        completedCriteria: this.completedCriteria,
        moveToNextPhase: this.nextAction
      });

      // Reset form
      this.nextAction = 'yes';
      this.criteriaList.forEach((_, index) => {
        this.completedCriteria[index] = false;
      });
    }
  }
};
</script>

<style scoped>
.bounce {
  animation: bounce 1.2s infinite alternate;
}
@keyframes bounce {
  0% { transform: translateY(0);}
  100% { transform: translateY(-6px);}
}
.doc-link {
  display: flex !important;
  align-items: center;
  flex-direction: row;
  gap: 10px;
  min-height: 48px;
}
.doc-link:hover {
  background: #e3f2fd !important;
  cursor: pointer;
}
</style>