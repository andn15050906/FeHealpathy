<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-box">
      <h2 class="modal-title">Thông tin cuộc trò chuyện</h2>
      <p class="member-count"
        >{{ conversation?.users?.length || 0 }} thành viên</p
      >

      <div class="form-group">
        <label>Tiêu đề</label>
        <input v-model="title" class="input" />
      </div>

      <div class="form-group">
        <label>Ảnh đại diện</label>
        <input type="file" @change="onFileChange" accept="image/*" />
        <img v-if="preview" :src="preview" class="avatar-preview" />
      </div>

      <div class="actions">
        <button class="btn primary" @click="updateInfo" :disabled="saving">
          {{ saving ? "Đang cập nhật..." : "Cập nhật" }}
        </button>
        <button class="btn secondary" @click="$emit('close')"> Hủy </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { updateConversation } from "@/scripts/api/services/conversationService";

const props = defineProps({
  conversation: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close", "updated"]);

const title = ref(props.conversation.title);
const preview = ref(props.conversation.avatarUrl || "");
const file = ref(null);
const members = ref(props.conversation.users || []);
const saving = ref(false);

watch(
  () => props.conversation,
  (newConversation) => {
    // Khi props.conversation thay đổi
    title.value = newConversation.title;
    preview.value = newConversation.avatarUrl || "";
    members.value = newConversation.users || [];
  },
  { immediate: true }
);

function onFileChange(e) {
  const f = e.target.files[0];
  if (f) {
    file.value = f;
    preview.value = URL.createObjectURL(f);
  }
}

async function updateInfo() {
  saving.value = true;
  try {
    const form = new FormData();
    form.append("Id", props.conversation.id);
    form.append("Title", title.value);
    // nếu đổi avatar
    if (file.value) {
      form.append("Thumb.File", file.value);
      form.append("Thumb.Title", file.value.name);
    }
    await updateConversation(form);
    emit("updated"); // để parent fetch lại rooms/messages
    emit("close");
  } catch (err) {
    console.error("Update failed:", err);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 90%;
  max-width: 360px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}
.modal-title {
  margin: 0 0 8px;
  font-size: 1.3rem;
}
.member-count {
  margin-bottom: 16px;
  color: #555;
  font-size: 0.9rem;
}
.form-group {
  margin-bottom: 16px;
}
.input {
  width: 100%;
  padding: 6px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
}
.avatar-preview {
  display: block;
  margin-top: 8px;
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid #ccc;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.btn {
  padding: 6px 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn.primary {
  background: #3498db;
  color: white;
}
.btn.secondary {
  background: #eee;
  color: #333;
}
.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
