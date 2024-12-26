<template>
    <v-list-item tag="a" class="d-flex flex-row align-center">
        <!-- Avatar -->
        <v-avatar style="border-radius: 5px;">
            <v-img :src="memberInfo.avatarUrl" max-width="3rem" max-height="3rem" />
        </v-avatar>

        <!-- Member Info -->
        <div class="pl-4">
            <div class="font-weight-bold group-name">
                {{ memberInfo.nickName }}
            </div>
            <span v-if="memberInfo.isManager" class="admin-tag">Quản trị viên</span>
            <div>
                Ngày tham gia: {{ memberInfo.joinedAt }} - Hoạt động lần cuối: {{ memberInfo.lastActiveAt }}
            </div>
        </div>

        <!-- Actions -->
        <div class="ml-auto d-flex">
            <v-btn v-if="userProfileStore.currentUserId !== memberInfo.userId" color="primary" class="mr-2" small
                outlined>Thêm bạn bè</v-btn>
            <v-menu v-if="isGroupManager" offset-y>
                <template #activator="{ attrs, on }">
                    <v-btn color="grey" small v-bind="attrs" v-on="on" outlined icon>
                        <v-icon>mdi-dots-horizontal</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-if="!memberInfo.isManager" @click="ChangeMemberRole">
                        <v-list-item-title>Mời làm quản trị viên</v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="memberInfo.isManager" @click="ChangeMemberRole">
                        <v-list-item-title>Gỡ vai trò quản trị viên</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeMemberDialog = true">
                        <v-list-item-title>Xóa thành viên</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
        </div>
    </v-list-item>

    <!-- Remove Member Dialog -->
    <v-dialog v-model="removeMemberDialog" persistent>
        <v-card>
            <v-card-title class="d-flex align-center">
                <v-avatar color="red" class="mr-2">
                    <v-icon>mdi-account-remove</v-icon>
                </v-avatar>
                <span>Bạn chắc chắn muốn xóa thành viên này khỏi nhóm?</span>
            </v-card-title>
            <v-card-actions class="justify-end">
                <v-btn text color="primary" @click="removeMemberDialog = false">Hủy bỏ</v-btn>
                <v-btn text color="red" @click="removeMember">Xóa thành viên</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
    groupId: {
        type: String,
        default: ""
    },
    isGroupManager: {
        type: Boolean,
        default: false
    },
    memberInfo: {
        type: Object,
        default: null
    }
})

// Local props variables
// const toLink = `/social/group/${props.groupId}`

const emit = defineEmits(['removeMember', 'changeRole']);
const isLoading = ref(false);
const isExecuting = ref(false);
const isChangeRole = ref(false);
const removeMemberDialog = ref(false);

/*async function removeMember() {
    isExecuting.value = true;
    var result = await RemoveMemberApi(
        props.groupId,
        props.memberInfo.userId
    )
    if (result.isSuccess) {
        if (result.responseBody.statusCode == 4) {
            NotificationHelper.notifyError("Group must have at least one admin!");
            return;
        }
        NotificationHelper.notifySuccess("Xóa thành viên thành công");
        emit('removeMember', props.memberInfo.userId, props.memberInfo.isManager);
    }
    else {
        NotificationHelper.notifyError("Đã có lỗi xảy ra!");
    }
    isExecuting.value = false;
}

async function ChangeMemberRole() {
    isChangeRole.value = true

    var result = await ChangeMemberRoleApi(
        props.groupId,
        props.memberInfo.userId
    )
    if (result.responseBody.isSuccess) {
        NotificationHelper.notifySuccess("Thay đổi thành công");
        emit('changeRole', props.memberInfo.userId, !props.memberInfo.isManager);
    }
    else {
        NotificationHelper.notifyError("Đã có lỗi xảy ra!");
    }
    isChangeRole.value = false
}*/
</script>

<style scoped>
.admin-tag {
    padding: .2rem;
    background-color: #53bf9432;
    border-radius: 3px;
    color: var(--primary);
}
</style>