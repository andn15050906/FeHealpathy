<template>
    <div class="edit-group-container">
        <h1 class="title">Edit Group</h1>
        <v-form @submit.prevent="onSubmit" class="form">
            <v-text-field label="Group Name *" v-model="groupInfo.title" maxlength="45" outlined required
                class="form-input" />

            <div class="custom-checkbox">
                <input type="checkbox" v-model="groupInfo.isPrivate" class="custom-checkbox__input" />
                <label class="privateGroup">Private Group</label>
            </div>

            <div class="form-input">
                <label class="form-label">Group Avatar</label>
                <div class="file-input-wrapper">
                    <input type="file" id="file-upload" @change="onFileChange" accept="image/*"
                        class="custom-file-input" />
                    <label for="file-upload" class="custom-file-label">
                        Choose File
                    </label>
                    <span class="file-name">{{ groupInfo.avatarUrl?.name || 'No file chosen' }}</span>
                </div>
            </div>

            <v-textarea label="Short Description" v-model="groupInfo.shortDescription" rows="3" maxlength="200" outlined
                class="form-input" />

            <v-textarea label="Detail Description" v-model="groupInfo.description" rows="5" outlined
                class="form-input" />

            <v-btn type="submit" color="primary" :loading="isLoading" class="form-button">
                Save Changes
            </v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const groupInfo = ref({
    title: '',
    avatarUrl: null,
    shortDescription: '',
    description: '',
    isPrivate: false,
});

const isLoading = ref(false);

async function onSubmit() {
    isLoading.value = true;
    try {
        // Call API to update group
    } catch (error) {
        console.error('Error updating group:', error);
    } finally {
        isLoading.value = false;
    }
}

function onFileChange(event) {
    const file = event.target.files[0];
    groupInfo.value.avatarUrl = file || null;
}
</script>

<style scoped>
.edit-group-container {
    max-width: 800px;
    margin: 65px auto;
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
    display: flex;
    align-items: center;
    margin-top: -25px;
}

.custom-checkbox__input {
    margin-right: 10px;
}

.privateGroup {
    font-size: 14px;
    color: #555;
}
</style>
