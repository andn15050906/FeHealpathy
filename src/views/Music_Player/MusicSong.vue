<template>
    <div class="music-song">
        <img :src="currentSong.cover" alt="Cover art" class="music-song__cover" />
        <h3 class="music-song__title">{{ currentSong.name }}</h3>
        <h4 class="music-song__artist">{{ currentSong.artist }}</h4>
    </div>
</template>

<script>
export default {
    name: "MusicSong",
    props: {
        currentSong: {
            type: Object,
            required: true,
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

.music-song__cover {
    width: 180px;
    height: 180px;
    object-fit: cover;
    border-radius: 50%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
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
