<template>
  <v-dialog v-model="dialogVisible" max-width="600px" persistent>
    <v-card>
      <v-card-title class="text-h5 bg-primary text-white">
        <v-icon color="white" class="mr-2">mdi-check-circle</v-icon>
        Hoàn thành Phase: {{ phaseTitle }}
      </v-card-title>

      <v-card-text class="pt-4">
        <p class="text-body-1 mb-4">
          Chúc mừng! Bạn đã hoàn thành phase "{{ phaseTitle }}" trong lộ trình của mình.
        </p>

        <v-divider class="my-4"></v-divider>

        <h3 class="text-h6 mb-3">Đánh giá tiến độ của bạn</h3>

        <v-list>
          <v-list-item v-for="(criteria, index) in criteriaList" :key="index">
            <template v-slot:prepend>
              <v-checkbox v-model="completedCriteria[index]" color="success"></v-checkbox>
            </template>
            <v-list-item-title>{{ criteria.title }}</v-list-item-title>
            <v-list-item-subtitle>{{ criteria.description }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <h3 class="text-h6 mb-3">Tài liệu tham khảo</h3>
        <v-list>
          <v-list-item v-for="(doc, index) in documents" :key="index" :href="doc.url" target="_blank">
            <template v-slot:prepend>
              <v-icon color="primary">mdi-file-document-outline</v-icon>
            </template>
            <v-list-item-title>{{ doc.title }}</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-divider class="my-4"></v-divider>

        <h3 class="text-h6 mb-3">Bạn muốn làm gì tiếp theo?</h3>
        <v-radio-group v-model="nextAction">
          <v-radio value="yes" color="success">
            <template v-slot:label>
              <div>
                <strong>Tiếp tục lộ trình</strong>
                <div class="text-caption">Chuyển đến phase tiếp theo ngay lập tức</div>
              </div>
            </template>
          </v-radio>
          <v-radio value="review" color="primary">
            <template v-slot:label>
              <div>
                <strong>Xem lại lộ trình</strong>
                <div class="text-caption">Quay lại trang tổng quan lộ trình</div>
              </div>
            </template>
          </v-radio>
          <v-radio value="pause" color="warning">
            <template v-slot:label>
              <div>
                <strong>Tạm dừng</strong>
                <div class="text-caption">Tạm dừng lộ trình và quay lại sau</div>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" variant="elevated" @click="submitEvaluation" :disabled="!isFormValid">
          Xác nhận
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
.v-list-item {
  min-height: 64px;
}
</style>