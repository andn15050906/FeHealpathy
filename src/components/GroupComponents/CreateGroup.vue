<template>
    <div class="create-group-container">
        <h1 class="title">Tạo cuộc hội thoại mới</h1>
        <v-form @submit.prevent="onSubmit" class="form">
            <!-- Conversation Title -->
            <v-text-field label="Conversation Name *" v-model="conversationInfo.title" maxlength="45" outlined required
                class="form-input" />

            <!-- Privacy (Checkbox) -->
            <div class="custom-checkbox">
                <input type="checkbox" v-model="conversationInfo.isPrivate" class="custom-checkbox__input" />
                <label class="privateConversation">Cuộc hội thoại riêng tư</label>
            </div>

            <!-- Conversation Avatar -->
            <div class="form-input">
                <label class="form-label">Ảnh đại diện cuộc hội thoại</label>
                <div class="file-input-wrapper">
                    <input type="file" id="file-upload" @change="onFileChange" accept="image/*"
                        class="custom-file-input" />
                    <label for="file-upload" class="custom-file-label">
                        Chọn tệp
                    </label>
                    <span class="file-name">{{ conversationInfo.avatarUrl?.name || 'Không có tệp được chọn' }}</span>
                </div>
            </div>

            <!-- Add Members -->
            <div class="form-input">
                <label class="form-label">Thêm thành viên</label>
                <v-autocomplete v-model="newMemberName" :items="userSearchResults" item-title="fullName" item-value="id"
                    label="Tìm kiếm người dùng" @input="onUserSearch" return-object outlined />
                <v-btn @click="addMember" color="secondary" :disabled="!newMemberName">
                    Thêm thành viên
                </v-btn>
            </div>

            <!-- Display Added Members -->
            <div v-if="members.length > 0" class="members-list">
                <p><strong>Thành viên:</strong></p>
                <ul>
                    <li v-for="(member, index) in members" :key="index">{{ member.name }} (Admin: {{ member.isAdmin ?
                        'Có' : 'Không' }})</li>
                </ul>
            </div>

            <!-- Submit Button -->
            <v-btn type="submit" color="primary" :loading="isLoading" class="form-button">
                Tạo cuộc hội thoại
            </v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { createConversation } from '@/scripts/api/services/conversationService';
import { getUsers } from '@/scripts/api/services/userService';

const conversationInfo = ref({
    title: '',
    avatarUrl: null,
    isPrivate: false,
});

const members = ref([]);
const newMemberName = ref(null);
const userSearchResults = ref([]);
const isLoading = ref(false);

async function onSubmit() {
    isLoading.value = true;
    const formData = new FormData();

    formData.append('Title', conversationInfo.value.title);
    formData.append('IsPrivate', conversationInfo.value.isPrivate);

    if (conversationInfo.value.avatarUrl) {
        const file = conversationInfo.value.avatarUrl;

        formData.append('Thumb.File', file);
        formData.append('Thumb.Title', file.name);
    }

    members.value.forEach((member, index) => {
        formData.append(`Members[${index}].UserId`, member.id);
        formData.append(`Members[${index}].IsAdmin`, member.isAdmin);
    });

    try {
        await createConversation(formData);
        alert("Cuộc hội thoại đã được tạo thành công!");

        resetForm();
    } catch (error) {
            alert("Không thể tạo cuộc hội thoại. Vui lòng thử lại.");
    } finally {
        isLoading.value = false;
    }
}

function resetForm() {
    conversationInfo.value = {
        title: '',
        avatarUrl: null,
        isPrivate: false,
    };
    members.value = [];
}

async function onUserSearch(event) {
    const query = event.target.value;
    if (!query) return;
    try {
        if (query && typeof query === 'string') {
            const response = await getUsers({ name: query });
            userSearchResults.value = [...response.items];
        } else {
            userSearchResults.value = [];
        }
    } catch (error) {
        console.error("Failed to fetch users", error);
    }
}

function addMember() {
    if (newMemberName.value) {
        console.log("Selected User:", newMemberName.value);
        members.value.push({
            id: newMemberName.value.id,
            name: newMemberName.value.fullName,
            isAdmin: false,
        });

        newMemberName.value = null;
    }
}

function onFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        conversationInfo.value.avatarUrl = file;
    } else {
        conversationInfo.value.avatarUrl = null;
    }
}
</script>

<style scoped>
.create-group-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: "Roboto", sans-serif;
}

.title {
    font-size: 28px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 30px;
    color: #333;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-input {
    width: 100%;
}

.form-label {
    font-size: 14px;
    color: #555;
    margin-bottom: 5px;
    font-weight: 500;
}

.file-input-wrapper {
    display: flex;
    align-items: center;
    gap: 10px;
}

.custom-file-input {
    display: none;
}

.custom-file-label {
    background-color: #f5f5f5;
    color: #555;
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 8px 16px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.custom-file-label:hover {
    background-color: #e0e0e0;
}

.file-name {
    font-size: 14px;
    color: #888;
}

.form-button {
    align-self: flex-end;
    margin-top: 30px;
    padding: 10px 20px;
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    background-color: #3f51b5;
    border-radius: 6px;
    transition: background-color 0.3s ease;
}

.form-button:hover {
    background-color: #303f9f;
}

.form-button:disabled {
    background-color: #c5cae9;
    color: #fff;
}

.custom-checkbox {
    margin-top: -25px;
    display: flex;
    align-items: center;
}

.privateConversation {
    margin-left: 10px;
}

.members-list {
    margin-top: 20px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
}
</style>
