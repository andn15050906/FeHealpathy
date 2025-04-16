<template>
    <v-card class="group-card" :to="toLink" elevation="0">
        <v-img :src="groupInfo.coverImgUrl" 
               class="group-image" 
               height="200"
               cover>
            <template v-slot:placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </v-row>
            </template>
        </v-img>
        
        <div class="group-info">
            <div class="info-container">
                <div class="group-name text-truncate">{{ groupInfo.name }}</div>
                <div class="member-count">
                    <v-icon size="small" color="grey">mdi-account-group</v-icon>
                    <span class="ml-1">{{ groupInfo.totalMembers }} members</span>
                </div>
            </div>
        </div>
    </v-card>
</template>

<script setup>
const props = defineProps({
    groupInfo: {
        type: Object,
        required: true
    },
    toLink: {
        type: String,
        required: true
    }
});
</script>

<style scoped>
.group-card {
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
    background: white;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.group-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

.group-image {
    width: 100%;
}

.group-info {
    padding: 16px;
    background: white;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

.info-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.group-name {
    font-size: 1.1rem;
    font-weight: 600;
    color: #1a1a1a;
    line-height: 1.4;
    max-width: 100%;
}

.member-count {
    display: flex;
    align-items: center;
    color: #666;
    font-size: 0.9rem;
}
</style>