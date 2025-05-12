<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title class="text-h5"> Đánh giá cuối phase </v-card-title>

      <v-card-text>
        <p class="mb-4"
          >Bạn đã hoàn thành phase "{{ phaseTitle }}". Hãy đánh giá kết quả của
          bạn:</p
        >

        <v-expansion-panels variant="accordion" class="mb-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2"
                  >mdi-file-document-outline</v-icon
                >
                Tài liệu tham khảo
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <p
                >Các tài liệu quan trọng bạn nên đọc để hiểu rõ hơn về phase
                này:</p
              >
              <ul class="mt-2">
                <li v-for="(doc, index) in documents" :key="index" class="mb-2">
                  <a
                    :href="doc.url"
                    target="_blank"
                    class="text-decoration-none"
                  >
                    {{ doc.title }}
                  </a>
                </li>
              </ul>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel>
            <v-expansion-panel-title>
              <div class="d-flex align-center">
                <v-icon color="primary" class="mr-2"
                  >mdi-check-circle-outline</v-icon
                >
                Tiêu chí đánh giá
              </div>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-list>
                <v-list-item
                  v-for="(criterion, index) in criteria"
                  :key="index"
                >
                  <template v-slot:prepend>
                    <v-checkbox
                      v-model="criterion.achieved"
                      hide-details
                      density="compact"
                    ></v-checkbox>
                  </template>
                  <v-list-item-title>{{ criterion.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    criterion.description
                  }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-divider class="my-4"></v-divider>

        <p class="mb-2">Bạn có muốn chuyển sang phase tiếp theo không?</p>
        <v-radio-group v-model="moveToNextPhase" class="mt-2">
          <v-radio
            label="Có, tôi đã sẵn sàng cho phase tiếp theo"
            value="yes"
          ></v-radio>
          <v-radio
            label="Tôi muốn ôn tập lại phase này thêm một thời gian"
            value="review"
          ></v-radio>
          <v-radio
            label="Tôi muốn tạm dừng lộ trình một thời gian"
            value="pause"
          ></v-radio>
        </v-radio-group>

        <v-textarea
          v-model="reflection"
          label="Chia sẻ suy nghĩ của bạn về phase này (không bắt buộc)"
          rows="3"
          class="mt-4"
        ></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          @click="submitEvaluation"
          :disabled="!moveToNextPhase"
        >
          Tiếp tục
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PhaseCompletionDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    phaseId: {
      type: String,
      required: true,
    },
    phaseTitle: {
      type: String,
      required: true,
    },
    documents: {
      type: Array,
      default: () => [],
    },
    criteriaList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      moveToNextPhase: null,
      reflection: "",
      criteria: [],
    };
  },
  computed: {
    dialog: {
      get() {
        return this.show;
      },
      set(value) {
        if (!value) {
          this.$emit("close");
        }
      },
    },
  },
  watch: {
    criteriaList: {
      immediate: true,
      handler(newVal) {
        this.criteria = newVal.map((c) => ({
          ...c,
          achieved: false,
        }));
      },
    },
  },
  methods: {
    submitEvaluation() {
      const evaluationData = {
        phaseId: this.phaseId,
        moveToNextPhase: this.moveToNextPhase,
        criteria: this.criteria,
        reflection: this.reflection,
      };

      this.$emit("submit", evaluationData);
      this.resetForm();
    },
    resetForm() {
      this.moveToNextPhase = null;
      this.reflection = "";
      this.criteria = this.criteriaList.map((c) => ({
        ...c,
        achieved: false,
      }));
    },
  },
};
</script>
