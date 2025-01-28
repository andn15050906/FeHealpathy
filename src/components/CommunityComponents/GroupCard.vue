<template>
    <v-card class="glowing v-card--material pa-3 v-card v-sheet theme--light v-card--material--has-heading elevation-2"
        style="margin: 10px;">
        <v-img :src="groupInfo.coverImgUrl" fit="fill" style="width: 100%; height: 13em;" />
        <div>
            <div style="font-weight: bold; font-size: 1rem; line-height: 1.75rem; letter-spacing: 0.00937em;">{{
                groupInfo.name }}</div>
            <div style="display: flex; flex-direction: row; justify-content: space-between;">
                <div>{{ groupInfo.totalMembers }} {{ text.members }}</div>
                <div>{{ groupInfo.totalPosts }} {{ text.posts }}</div>
            </div>
            <v-btn style="width: 100%;" color="primary" :to="toLink">{{ text.View }}</v-btn>
        </div>
    </v-card>
</template>

<script setup>
import { onMounted, ref, defineProps } from 'vue';
import dict from '@/scripts/data/dictionary.json';

const text = ref({
    members: '',
    posts: '',
    View: ''
});

const props = defineProps({
    groupInfo: {
        type: Object,
        required: true
    },
    toLink: {
        type: String,
        required: true
    }
})

onMounted(async () => {
    text.value = {
        members: dict["en"]["members"],
        posts: dict["en"]["posts"],
        View: dict["en"]["View"],
    }
})
</script>

<style>
.glowing {
    justify-content: center;
    align-items: center;
    flex: 1;
    border-radius: 10px;
    color: white;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.glowing:hover {
    transform: scale(1.05);
}
</style>