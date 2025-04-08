<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Invite user to conversation</h2>
        <p class="subtitle">Select a user to invite</p>
      </div>

      <div class="modal-body">
        <input
          v-model="search"
          placeholder="Search user..."
          @input="handleSearch"
          class="input"
        />
        <ul v-if="searchResults.length" class="user-list">
          <li
            v-for="user in searchResults"
            :key="user.id"
            @click="selectUser(user)"
            class="user-item"
          >
            <span class="user-name">{{ user.fullName }}</span>
            <span class="user-email">({{ user.email }})</span>
          </li>
        </ul>
      </div>

      <div v-if="selectedUser" class="selected-user">
        ✅ Selected: <strong>{{ selectedUser.fullName }}</strong>
      </div>

      <div class="modal-footer">
        <button
          @click="inviteUser"
          :disabled="!selectedUser || isSubmitting"
          class="btn primary"
        >
          {{ isSubmitting ? "Inviting..." : "Invite" }}
        </button>
        <button @click="$emit('close')" class="btn secondary">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getUsers } from "@/scripts/api/services/userService";
import { submitInviteMember } from "@/scripts/api/services/notificationService";

const emit = defineEmits(["close"]);

onMounted(() => {
  console.log("InviteUser component mounted");
});

const props = defineProps({
  conversationId: String,
});

const search = ref("");
const searchResults = ref([]);
const selectedUser = ref(null);
const isSubmitting = ref(false);

const handleSearch = async () => {
  const keyword = search.value.trim();
  if (keyword.length < 2) return;

  try {
    const res = await getUsers({ name: keyword });
    searchResults.value = res.items;
  } catch (err) {
    console.error("Error searching users", err);
  }
};

const selectUser = (user) => {
  selectedUser.value = user;
  searchResults.value = [];
  search.value = user.fullName;
};

const inviteUser = async () => {
  if (!selectedUser.value || !props.conversationId) return;

  isSubmitting.value = true;

  try {
    const payload = {
      conversationId: props.conversationId,
      userIds: [selectedUser.value.id],
    };

    await submitInviteMember(payload);

    // Gửi lời mời vào conversation
    // ...

    selectedUser.value = null;
    search.value = "";
    emit("close");
  } catch (error) {
    console.error("Invite failed:", error);
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
