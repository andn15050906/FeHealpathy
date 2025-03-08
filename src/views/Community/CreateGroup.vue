<template>
    <div class="row">
        <div class="background-white" style="width: 30%;">
            <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
            <p class="text-h5 text-bold">Create Group</p>
            <div style="display: flex; margin-bottom: 10px;">
                <v-avatar size="40px">
                    <img :src="userProfile.Avatar">
                </v-avatar>
                <div style="margin-left: 20px">
                    <span class="text-subtitle2 text-weight-bold">{{ userProfile.UserName }}</span>
                </div>
            </div>

            <v-form @submit="onSubmit" style="height:80%;">
                <v-container class="py-0">
                    <v-text-field label="Tên nhóm *" v-model="groupInfo.groupName" maxlength="50" class="purple-input"
                        lazy-rules :rules="groupNameRules" outlined persistent-placeholder />
                    <v-text-field label="Mô tả (Không bắt buộc)" v-model="groupInfo.groupDescription" maxlength="200"
                        class="purple-input" lazy-rules :rules="groupNameRules" outlined persistent-placeholder />
                    <v-select ref="publicityRef" v-model="groupInfo.publicity" :items="publicityOptions"
                        item-title="label" label="Chọn quyền riêng tư *" outlined>
                        <template v-slot:item="{ props, item }">
                            <v-list-item v-bind="props" style="width: 332px;">
                                <span>
                                    <i class="fa-solid fa-gear" style="margin-right: 5px"></i>
                                    <v-label caption>{{ item.raw.description }}</v-label>
                                </span>
                            </v-list-item>
                        </template>
                    </v-select>
                    <v-select ref="postModeRef" v-model="groupInfo.postMode" :items="postModeOptions" item-title="label"
                        label="Chế độ đăng bài" outlined />
                </v-container>
                <v-row align="center" justify="center">
                    <v-btn :disable="isLoadingBtn" @click="router.back()" color="negative" style="margin: 10px;">
                        <i class="fa-solid fa-xmark"></i>
                    </v-btn>
                    <v-btn type="submit" :disable="groupInfo.groupName == '' || groupInfo.publicity.id != 1"
                        color="primary" :loading="isLoadingBtn" style="margin: 10px;">Create Group</v-btn>
                </v-row>
            </v-form>
        </div>

        <div class="col background-dark-100" style="width: 70%;">
            <v-container class="group-preview">
                <div class="text-subtitle2">
                    <span>Preview cover image</span>
                    <span v-if="isValidInput == false" class="text-red text-bold">Please upload cover image.</span>
                </div>
                <div class="main-preview q-mt-md">
                    <ImageInput v-model="groupInfo.coverImage" ref="coverImageInput" />
                    <hr>
                    <div style="padding: 20px">
                        <p v-if="groupInfo.groupName == ''" class="text-bold text-h4 preview-content">Group Name</p>
                        <p v-if="groupInfo.groupName != ''" class="text-bold text-h4 preview-content">
                            {{ groupInfo.groupName }}
                        </p>
                        <span v-if="groupInfo.publicity == ''" class="preview-content">Group privacy</span>
                        <span v-if="groupInfo.publicity.id == 1" class="preview-content">
                            <i class="fa-solid fa-user-group"></i>Public group</span>
                        <span v-if="groupInfo.publicity.id == 2" class="preview-content">
                            <font-awesome-icon icon="fa-solid fa-lock" />Private group.</span>
                        <span class="preview-content-1 text-weight-bold">1 member(s)</span>
                        <hr>
                        <v-btn v-for="buttonText in tabButtons" :key="button" color="grey-lighten-5" style="margin: 5px"
                            outlined flat disabled no-caps>{{ buttonText }}</v-btn>
                    </div>
                </div>
            </v-container>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, inject } from 'vue';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ImageInput from '@/components/Common/Misc/ImageInput.vue';
import GlobalState from '@/scripts/logic/globalState';

const publicityOptions = [
    {
        id: 1,
        label: 'Public',
        description: 'Everyone can view',
        icon: 'public',
        value: true
    },
    {
        id: 2,
        label: 'Private',
        description: 'Only members can see',
        icon: 'lock',
        value: false
    }
];
const postModeOptions = [
    {
        id: 1,
        label: "Free post",
        value: false
    },
    {
        id: 2,
        label: "Require approval",
        value: true
    }
];
const breadcrumbs = [
    {
        title: 'Group',
        disabled: true,
        to: "#"
    },
    {
        title: 'Create Group',
        disabled: true,
        to: "#"
    }
];

const sweetAlert = inject('sweetAlert');
const router = useRouter();
const isLoadingBtn = ref(false)
const groupInfo = ref({
    groupName: '',
    groupDescription: '',
    publicity: publicityOptions[0],
    postMode: postModeOptions[0],
    coverImage: null
})
const coverImageInput = ref(null)
let isValidInput = ref(null)
const publicityRef = ref(null)
const postModeRef = ref(null)
const tabButtons = ref(["Introducion", "Posts", "Members"])
const userProfile = ref({})
const groupNameRules = [
    val => val && val.length > 0 || "This field must not be empty.",
    val => val && val.length <= 200 || "Maximum 200 characters."
];

onMounted(() => {
    if (!GlobalState.isAuth())
        useRouter().push('/sign-in');
    userProfile.value = GlobalState.getUserProfile();
})

async function onSubmit() {
    groupInfo.value.groupName = groupInfo.value.groupName.trim().replace(/\s+/g, " ");
    groupInfo.value.groupDescription = groupInfo.value.groupDescription.trim();
    verifyInput();

    if (isValidInput.value == 1) {
        isLoadingBtn.value = true
        // Get the result after creating group.
        const result = await createGroupApi(
            groupInfo.value
        );

        if (result.isSuccess) {
            sweetAlert.showSuccess("Created Successfully!");
            router.push(`/social/group/${result.responseBody}`);
        } else {
            NotificationHelper.notifyError(
                result.message ?? "Error"
            );
        }
        isLoadingBtn.value = false
    }

}

function verifyInput() {
    isValidInput.value = coverImageInput.value.verifyInput();
}
</script>

<style scoped>
.background-white {
    background-color: white;
    box-shadow: 5px 0px 10px 0px rgba(0, 0, 0, 0.1);
}

.background-dark-100 {
    background-color: rgba(124, 123, 123, 0.1);
}

.text-small {
    font-size: 0.75rem;
}

.group-buttons {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.group-preview {
    background-color: white;
    box-shadow: 0 0px 10px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    overflow-y: auto;
    max-height: 85vh;
}

.main-preview {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.preview-content {
    color: rgb(176, 175, 175);
}

.preview-content-1 {
    color: rgb(121, 118, 118);
}

.preview-post-bg {
    background-color: rgb(249, 249, 249);
    border-radius: 5px;
}

.preview-bg {
    background-color: rgb(242, 244, 247);
}
</style>