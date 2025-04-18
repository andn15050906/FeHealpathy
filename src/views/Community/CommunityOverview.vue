<template>
    <div class="community-container pa-6">
        <div class="d-flex justify-space-between align-center mb-6">
            <h2 class="text-h5 font-weight-bold">
                Nhóm Của Bạn ({{ joinedGroups.length }})
            </h2>
            <v-btn color="primary" variant="elevated" :to="'/create-group'" prepend-icon="mdi-plus">
                Tạo Nhóm Mới
            </v-btn>
        </div>

        <v-row>
            <v-col v-for="group in joinedGroups" :key="group.id" cols="12" sm="6" md="4" lg="3">
                <GroupCard :group-info="group" :to-link="'chat'/* + group.id*/" />
            </v-col>
        </v-row>

        <h2 class="text-h5 font-weight-bold mt-8 mb-6">
            Nhóm Được Đề Xuất
        </h2>

        <v-row>
            <v-col v-for="group in recommendedGroups" :key="group.id" cols="12" sm="6" md="4" lg="3">
                <GroupCard :group-info="group" :to-link="'chat'/* + group.id*/" />
            </v-col>
        </v-row>

        <v-row v-if="!isDataFetched">
            <v-col v-for="i in 8" :key="i" cols="12" sm="6" md="4" lg="3">
                <v-card class="pa-2">
                    <v-skeleton-loader type="image" height="200" />
                    <v-skeleton-loader type="text" class="mt-2" />
                    <v-skeleton-loader type="text" width="60%" />
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import GroupCard from '@/components/CommunityComponents/GroupCard.vue';
import data from '../../scripts/data/data.json';

const joinedGroups = ref([]);
const recommendedGroups = ref([]);
const isDataFetched = ref(false);

onMounted(async () => {
    joinedGroups.value = data.Community.Groups.Joined;
    recommendedGroups.value = data.Community.Groups.Recommended;
    isDataFetched.value = true;
})
</script>

<style scoped>
.community-container {
    max-width: 1400px;
    margin: 0 auto;
}
</style>