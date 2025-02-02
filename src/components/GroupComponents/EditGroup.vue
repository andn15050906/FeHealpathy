<template>
    <div class="edit-conversation-container">
        <h1 class="title">Edit Conversation</h1>
        <v-form @submit.prevent="onSubmit" class="form">
            <!-- Conversation Title -->
            <v-text-field label="Conversation Name *" v-model="conversationInfo.title" maxlength="45" outlined required
                class="form-input" />

            <!-- Privacy (Checkbox) -->
            <div class="custom-checkbox">
                <input type="checkbox" v-model="conversationInfo.isPrivate" class="custom-checkbox__input" />
                <label class="privateGroup">Private Conversation</label>
            </div>

            <!-- Conversation Avatar -->
            <div class="form-input">
                <label class="form-label">Conversation Avatar</label>
                <div class="file-input-wrapper">
                    <input type="file" id="file-upload" @change="onFileChange" accept="image/*"
                        class="custom-file-input" />
                    <label for="file-upload" class="custom-file-label">
                        Choose File
                    </label>
                    <span class="file-name">{{ conversationInfo.avatarUrl?.name || 'No file chosen' }}</span>
                </div>
            </div>

            <!-- Add Members -->
            <div class="form-input">
                <label class="form-label">Add Members</label>
                <v-autocomplete v-model="newMemberName" :items="userSearchResults" item-title="fullName" item-value="id"
                    label="Search for users" @input="onUserSearch" return-object outlined />
                <v-btn @click="addMember" color="secondary" :disabled="!newMemberName">
                    Add Member
                </v-btn>
            </div>

            <!-- Members List -->
            <div v-if="members.length > 0" class="members-list">
                <p><strong>Members:</strong></p>
                <ul>
                    <li v-for="(member, index) in members" :key="index">{{ member.name }} (Admin: {{ member.isAdmin ? 'Yes' : 'No' }})</li>
                </ul>
            </div>

            <!-- Submit Button -->
            <v-btn type="submit" color="primary" :loading="isLoading" class="form-button">
                Save Changes
            </v-btn>
        </v-form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { updateConversation, getPagedConversations } from '@/scripts/api/services/conversationService';
import { getUsers } from '@/scripts/api/services/userService';

const route = useRoute();
const router = useRouter();

const conversationInfo = ref({
    title: '',
    avatarUrl: null,
    isPrivate: false,
});

const newMemberName = ref(null);
const userSearchResults = ref([]);
const members = ref([]);
const isLoading = ref(false);

const conversationId = route.params.id;

onMounted(async () => {
    if (!conversationId) return;
    try {
        const response = await getPagedConversations({ ConversationIds: conversationId });
        if (response.items && response.items.length > 0) {
            const conversation = response.items[0];
            conversationInfo.value = {
                title: conversation.title || '',
                avatarUrl: conversation.avatarUrl || null,
                isPrivate: conversation.isPrivate || false
            };

            const updatedMembers = await Promise.all(conversation.members.map(async (member) => {
                const userResponse = await getUsers({ id: member.creatorId });
                const userName = userResponse.items.length > 0 ? userResponse.items[0].fullName : 'Unknown';
                return { ...member, name: userName };
            }));

            members.value = updatedMembers;
        } else {
            console.warn("No conversation found with the given ID");
        }
    } catch (error) {
        console.error('Error fetching conversation:', error);
    }
});

async function onSubmit() {
    isLoading.value = true;
    try {
        const formData = new FormData();
        formData.append("Id", route.params.id);
        formData.append('Title', conversationInfo.value.title);
        formData.append('IsPrivate', conversationInfo.value.isPrivate);
        if (conversationInfo.value.avatarUrl instanceof File) {
            formData.append('Thumb.File', conversationInfo.value.avatarUrl);
            formData.append('Thumb.Title', conversationInfo.value.avatarUrl.name);
        }

        await updateConversation(formData);
        router.push('/chat');
    } catch (error) {
        console.error('Error updating conversation:', error);
    } finally {
        isLoading.value = false;
    }
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
    conversationInfo.value.avatarUrl = file || null;
}
</script>

<style scoped>
.edit-conversation-container {
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

.members-list {
    margin-top: 20px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 5px;
}
</style>
