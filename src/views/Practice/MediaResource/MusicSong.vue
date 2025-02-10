<template>
    <div class="music-song" v-if="currentSong">
        <h3 class="music-song__title">{{ currentSong.name }}</h3>
        <h4 class="music-song__artist">{{ currentSong.artist }}</h4>
    </div>
    <div v-else class="music-song">
        <p>No song selected</p>
    </div>
</template>

<script>
export default {
    name: "MusicSong",
    props: {
        currentSong: {
            type: Object,
            default: null,
        },
    },
};
</script>

<style scoped>
.music-song {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}

.music-song__title {
    margin-top: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
}

.music-song__artist {
    font-size: 1.2rem;
    color: #666;
}
</style>
