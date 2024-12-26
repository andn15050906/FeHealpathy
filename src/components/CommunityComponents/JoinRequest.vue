<template>
    <div class="edit-section pa-4">
        <v-card v-if="requests.length > 0">
            <v-container>
                <v-row v-for="request in requests" :key="request.userId" class="mb-4" align="center">
                    <v-col cols="auto">
                        <v-avatar size="48">
                            <img :src="request.userAvatar" />
                        </v-avatar>
                    </v-col>
                    <v-col>
                        <p class="font-weight-bold mb-2">{{ request.userName }}</p>
                        <p class="text-caption">Ngày tạo: {{ request.createdAt }}</p>
                    </v-col>
                    <v-col cols="auto">
                        <v-btn v-if="!request.isRunApi" color="red" size="small" class="mr-2"
                            @click="rejectJoinRequestAsync(request.userId)">
                            Từ chối
                        </v-btn>
                        <v-btn v-if="!request.isRunApi" color="primary" size="small"
                            @click="acceptJoinRequestAsync(request.userId)">
                            Phê duyệt
                        </v-btn>
                        <v-progress-circular v-else indeterminate size="24" color="primary" />
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <v-card v-else>
            <v-card-text class="text-center">
                Không có yêu cầu tham gia
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";

const route = useRoute();
const requests = ref([]);

onMounted(() => {
    getJoinRequestAsync();
});

async function getJoinRequestAsync() {
    /*const result = await getJoinRequestApi(
        route.params.id
    );

    if (result.isSuccess) {
        requests.value = result.responseBody.requestList;
        requests.value.forEach(request => {
            request.isRunApi = false;
        });
    } else {
        console.log("Có lỗi xảy ra");
    }*/
}

async function acceptJoinRequestAsync(memberId) {
    const request = requests.value.find(request => request.userId == memberId);
    if (request) request.isRunApi = true;

    const result = await acceptRequestApi(route.params.id, memberId);

    if (result.isSuccess) {
        console.log("Chào mừng thành viên mới");
        requests.value = requests.value.filter(request => request.userId !== memberId);
    } else {
        console.log("Có lỗi xảy ra");
    }
}

async function rejectJoinRequestAsync(memberId) {
    const request = requests.value.find(request => request.userId == memberId);
    if (request) request.isRunApi = true;

    const result = await rejectRequestApi(route.params.id, memberId);

    if (result.responseBody.isSuccess) {
        console.log("Thao tác thành công");
        requests.value = requests.value.filter(request => request.userId !== memberId);
    } else {
        console.log("Có lỗi xảy ra");
    }
}
</script>

<style scoped>
.edit-section {
    margin: 1rem 18rem 0 18rem;
    background-color: white;
    border: 1px solid rgba(180, 180, 180, 0.599);
    border-radius: 8px;
}
</style>
