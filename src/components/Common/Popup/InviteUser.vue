<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Mời người dùng vào cuộc hội thoại</h2>
        <p class="subtitle">Chọn người dùng để mời</p>
      </div>

      <div class="modal-body">
        <input v-model="search" placeholder="Tìm kiếm người dùng..." @input="handleSearch" class="input" />
        <ul v-if="searchResults.length" class="user-list">
          <li v-for="user in searchResults" :key="user.id" @click="toggleUser(user)" class="user-item">
            <span class="user-name">{{ user.fullName }}</span>
            <span class="user-email">({{ user.email }})</span>
          </li>
        </ul>
      </div>

      <div v-if="selectedUsers.length" class="selected-user">
        ✅ Đã chọn:
        <strong v-for="(user, idx) in selectedUsers" :key="user.id">
          {{ user.fullName }}<span v-if="idx < selectedUsers.length - 1">, </span>
        </strong>
      </div>

      <!-- Add input for Title and Avatar -->
      <div class="form-group">
        <label for="title">Tiêu đề cuộc hội thoại</label>
        <input v-model="conversationInfo.title" placeholder="Nhập tiêu đề cuộc hội thoại" class="input" />
      </div>
      <div class="form-group">
        <label for="avatar">Tải lên ảnh đại diện</label>
        <input type="file" @change="handleFileChange" accept="image/*" class="input" />
      </div>

      <div class="modal-footer">
        <button @click="inviteUsers" :disabled="!selectedUsers.length || isSubmitting" class="btn primary">
          {{ isSubmitting ? "Đang mời..." : "Mời" }}
        </button>
        <button @click="$emit('close')" class="btn secondary">Hủy</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getUsers } from "@/scripts/api/services/userService";
import { submitInviteMember } from "@/scripts/api/services/notificationService";
import { createConversation, updateConversation } from "@/scripts/api/services/conversationService";

const emit = defineEmits(["close", "created"]);

const props = defineProps({
  conversationId: String,
  currentUser: Object,
  currentRoomMembers: Array,
});

const search = ref("");
const searchResults = ref([]);
const selectedUsers = ref([]);
const isSubmitting = ref(false);

const conversationInfo = ref({
  title: "",
  avatarUrl: null,
  isPrivate: false
});

const handleSearch = async () => {
  const keyword = search.value.trim();
  if (keyword.length < 2) return;

  try {
    const res = (await getUsers({ name: keyword })).items || [];
    searchResults.value = res.filter(u => !selectedUsers.value.some(s => s.id === u.id));
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err);
  }
};

const toggleUser = (user) => {
  const exists = selectedUsers.value.find(u => u.id === user.id);
  if (!exists) {
    selectedUsers.value.push(user);
    search.value = "";
    searchResults.value = [];
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    conversationInfo.value.avatarUrl = file;
  }
};

const inviteUsers = async () => {
  if (!selectedUsers.value.length || !props.currentUser) return;

  isSubmitting.value = true;

  try {
    const userIds = selectedUsers.value.map(u => u.id);

    await submitInviteMember({
      conversationId: props.conversationId,
      userIds,
    });

    const memberIds = [
      ...(props.currentRoomMembers || []),
      props.currentUser.id,
      ...userIds,
    ];

    const uniqueIds = [...new Set(memberIds.filter(Boolean))];

    const members = uniqueIds.map((id) => ({
      userId: id,
      isAdmin: id === props.currentUser.id,
    }));

    const formData = new FormData();
    formData.append('Title', conversationInfo.value.title);
    formData.append('IsPrivate', conversationInfo.value.isPrivate);

    // If avatar file is provided, add it to formData
    if (conversationInfo.value.avatarUrl) {
      const file = conversationInfo.value.avatarUrl;
      formData.append('Thumb.File', file);
      formData.append('Thumb.Title', file.name);
    }

    members.forEach((member, index) => {
      formData.append(`Members[${index}].UserId`, member.userId);
      formData.append(`Members[${index}].IsAdmin`, member.isAdmin);
    });

    if ((props.currentRoomMembers?.length || 0) >= 3) {
      formData.append("Id", props.conversationId);
      await updateConversation(formData);
    } else {
      await createConversation(formData);
    }

    emit("created");
    emit("close");
    selectedUsers.value = [];
    search.value = "";
    searchResults.value = [];
    conversationInfo.value.title = "";
    conversationInfo.value.avatarUrl = null;
  } catch (error) {
    console.error("Lỗi mời:", error);
  } finally {
    isSubmitting.value = false;
  }
};
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

.modal-content {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 95%;
  max-width: 420px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
}

.subtitle {
  margin-left: 10px;
  margin-top: 17px;
  font-size: 0.9rem;
  color: #777;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-top: 16px;
  font-size: 1rem;
}

.form-group {
  margin-top: 16px;
}

.user-list {
  list-style: none;
  padding: 0;
  margin-top: 10px;
  border: 1px solid #eee;
  border-radius: 6px;
  max-height: 160px;
  overflow-y: auto;
}

.user-item {
  padding: 10px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
}

.user-item:hover {
  background-color: #f4f4f4;
}

.user-name {
  font-weight: 500;
}

.user-email {
  color: #888;
  font-style: italic;
}

.selected-user {
  margin: 12px 0;
  font-size: 0.95rem;
  color: #2c3e50;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 10px;
}

.btn {
  padding: 10px 18px;
  font-size: 0.95rem;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.btn.primary {
  background-color: #3498db;
  color: white;
}

.btn.primary:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}

.btn.secondary {
  background-color: #f2f2f2;
  color: #555;
}

.btn.secondary:hover {
  background-color: #e2e2e2;
}
</style>
