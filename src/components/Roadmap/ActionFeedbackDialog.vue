<template>
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title class="text-h5"> Đánh giá kết quả </v-card-title>

      <v-card-text>
        <p class="mb-4"
          >Bạn cảm thấy thế nào sau khi thực hiện "{{ actionTitle }}"?</p
        >

        <div class="mood-selector mb-4">
          <div class="d-flex justify-center">
            <v-btn
              v-for="(emoji, index) in ['😔', '😐', '🙂', '😊']"
              :key="index"
              :variant="selectedMood === index ? 'elevated' : 'outlined'"
              :color="selectedMood === index ? 'primary' : undefined"
              class="mx-2"
              @click="selectedMood = index"
            >
              {{ emoji }}
            </v-btn>
          </div>
        </div>

        <v-divider class="my-4"></v-divider>

        <p class="mb-2">Bạn có gặp khó khăn gì khi thực hiện không?</p>
        <v-radio-group v-model="difficulty" class="mt-2">
          <v-radio label="Không, rất dễ thực hiện" value="easy"></v-radio>
          <v-radio
            label="Có một chút khó khăn nhưng vẫn làm được"
            value="moderate"
          ></v-radio>
          <v-radio label="Khá khó khăn để thực hiện" value="hard"></v-radio>
        </v-radio-group>

        <v-textarea
          v-model="feedback"
          label="Chia sẻ thêm cảm nhận của bạn (không bắt buộc)"
          rows="3"
          class="mt-4"
        ></v-textarea>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          @click="submitFeedback"
          :disabled="selectedMood === null || !difficulty"
        >
          Gửi đánh giá
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ActionFeedbackDialog",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    actionId: {
      type: String,
      required: true,
    },
    actionTitle: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedMood: null,
      difficulty: null,
      feedback: "",
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
  methods: {
    submitFeedback() {
      const feedbackData = {
        actionId: this.actionId,
        mood: this.selectedMood,
        difficulty: this.difficulty,
        feedback: this.feedback,
      };

      this.$emit("submit", feedbackData);
      this.resetForm();
    },
    resetForm() {
      this.selectedMood = null;
      this.difficulty = null;
      this.feedback = "";
    },
  },
};
</script>