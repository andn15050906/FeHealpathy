<template>
    <div class="create-group-container">
        <h1 class="title">Create New Group</h1>
        <v-form @submit.prevent="onSubmit" class="form">
            <!-- Group Title -->
            <v-text-field
                label="Group Name *"
                v-model="groupInfo.title"
                maxlength="45"
                outlined
                required
                class="form-input"
            />

            <!-- Privacy (Checkbox) -->
            <div class="custom-checkbox">
                <input type="checkbox" v-model="checked" class="custom-checkbox__input"/>
                <label class="privateGroup">Private Group</label>
            </div>

            <!-- Group Avatar -->
            <div class="form-input">
                <label class="form-label">Group Avatar</label>
                <div class="file-input-wrapper">
                    <input 
                        type="file" 
                        id="file-upload" 
                        @change="onFileChange" 
                        accept="image/*" 
                        class="custom-file-input"
                    />
                    <label for="file-upload" class="custom-file-label">
                        Choose File
                    </label>
                    <span class="file-name">{{ groupInfo.avatarUrl?.name || 'No file chosen' }}</span>
                </div>
            </div>

            <!-- Short Description -->
            <v-textarea
                label="Short Description"
                v-model="groupInfo.shortDescription"
                rows="3"
                maxlength="200"
                outlined
                class="form-input"
            />

            <!-- Full Description -->
            <v-textarea
                label="Detail Description"
                v-model="groupInfo.description"
                rows="5"
                outlined
                class="form-input"
            />

            <!-- Creator -->
            <v-text-field
                label="Creator *"
                v-model="groupInfo.creatorId"
                outlined
                disabled
                class="form-input"
            />

            <!-- Submit Button -->
            <v-btn type="submit" color="primary" :loading="isLoading" class="form-button">
                Create Group
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
    creatorId: 'Current User',
});

const isLoading = ref(false);

async function onSubmit() {
    isLoading.value = true;
    try {
        // Call API to create group
        // ...
        
    } catch (error) {
        
    } finally {
        isLoading.value = false;
    }
}

function resetForm() {
    groupInfo.value = {
        title: '',
        avatarUrl: null,
        shortDescription: '',
        description: '',
        isPrivate: false,
        creatorId: 'Current User',
    };
}

function onFileChange(event) {
    const file = event.target.files[0];
    if (file) {
        groupInfo.value.avatarUrl = file;
    } else {
        groupInfo.value.avatarUrl = null;
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

.my-checkbox {
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.my-checkbox input[type="checkbox"] {
  margin-right: 15px;
}

.custom-checkbox {
  margin-top: -25px;
  display: flex;
  align-items: center; 
}

.privateGroup {
  margin-left: 10px;
}
</style>