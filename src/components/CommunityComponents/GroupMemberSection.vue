<template>
    <div class="edit-section pa-4">
        <v-expansion-panels>
            <v-expansion-panel>
                <template v-slot:header>
                    <v-row class="align-center">
                        <v-col>
                            <p class="text-h6 font-weight-bold ml-4">Thành viên nhóm</p>
                        </v-col>
                    </v-row>
                </template>
                <v-card>
                    <v-row dense>
                        <v-col v-for="(member, index) in members" :key="index" cols="12" sm="6" md="4">
                            <MemberCard :memberInfo="member" :groupId="route.params.id" :isGroupManager="isGroupManager"
                                @removeMember="onRemoveMember" @changeRole="onChangeRole" />
                        </v-col>
                    </v-row>
                </v-card>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, watch } from 'vue';
import { useRoute } from 'vue-router';
import MemberCard from './MemberCard.vue';

const members = ref([]);
const route = useRoute();

const emit = defineEmits(['removeMember']);
const props = defineProps({
    isGroupManager: {
        type: Boolean,
        default: false,
    },
    groupMemberCount: {
        type: Number,
        default: 0,
    },
});

onBeforeMount(() => {
    getMemberAsync();
});

watch(
    () => props.groupMemberCount,
    () => {
        getMemberAsync();
    }
);

async function getMemberAsync() {
    /*const result = await getMemberApi(
        route.params.id
    );
    if (result.isSuccess) {
        members.value = result.responseBody.members;
    } else {
        NotificationHelper.notifyError(
            result.message ?? "Có lỗi xảy ra khi tạo"
        );
    }*/
}

function onRemoveMember(memberId) {
    members.value = members.value.filter((member) => member.userId != memberId);
    emit('removeMember');
}

function onChangeRole(memberId, newRole) {
    const member = members.value.find((member) => member.userId == memberId);
    if (member) {
        member.isManager = newRole;
    }
}
</script>

<style scoped>
.edit-section {
    padding: 16px;
}
</style>
