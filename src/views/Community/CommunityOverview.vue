<template>
    <div class="mx-8 pa-4 d-flex justify-space-between align-center">
        <span class="font-weight-bold text-subtitle-1">
            Joined Groups ({{ joinedGroups.length }})
        </span>
        <div>
            <v-btn class="d-flex align-center text-subtitle-1 font-weight-bold" style="width: 100%;" color="primary"
                :to="'/create-group'">
                <span>Create your group</span>
            </v-btn>
        </div>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr);">
        <GroupCard v-for="group in joinedGroups" :key="group.id" class="px-2 mb-4" style="overflow: auto;"
            :group-info="group" :to-link="'/group/' + group.id" />
    </div>
    <div class="mx-8 mt-4 pa-4">
        <span class="font-weight-bold text-subtitle-1">
            Groups you might like
        </span>
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr);">
        <GroupCard v-for="group in recommendedGroups" :key="group.id" class="px-2 mb-4" style="overflow: auto;"
            :group-info="group" :to-link="'/group/' + group.id" />
    </div>
    <div class="d-flex flex-wrap mx-8" v-if="!isDataFetched">
        <div v-for="i in 8" :key="i" class="px-2 mb-4">
            <div class="pa-2">
                <v-card>
                    <v-skeleton-loader type="image" height="180px" width="100%" class="rounded-0" />

                    <v-card-text class="pa-2">
                        <v-skeleton-loader type="text" width="100%" class="mb-2" />
                        <v-skeleton-loader type="text" width="100%" />
                    </v-card-text>

                    <v-card-actions class="justify-center">
                        <v-skeleton-loader type="button" width="97%" />
                    </v-card-actions>
                </v-card>
            </div>
        </div>
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