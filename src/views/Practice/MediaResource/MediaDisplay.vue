<template>
    <div class="media-display" v-if="currentMedia">
        <h3 class="media-display__title">{{ currentMedia.name }}</h3>
        <h4 class="media-display__artist">{{ currentMedia.artist }}</h4>
        <div class="media-display__content">
            <audio v-if="currentMedia.type === 'audio'" :src="currentMedia.url" controls></audio>
            <video v-if="currentMedia.type === 'video'" :src="currentMedia.url" controls></video>
        </div>
    </div>
    <div v-else class="media-display">
        <p>No media selected</p>
    </div>
</template>

<script>
export default {
    name: "MediaDisplay",
    props: {
        currentMedia: {
            type: Object,
            default: null,
        },
    },
};
</script>

<style scoped>
.media-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}

.media-display__title {
    margin-top: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
}

.media-display__artist {
    font-size: 1.2rem;
    color: #666;
}

.media-display__content {
    margin-top: 1rem;
    display: flex;
    justify-content: center;
    width: 100%;
}

audio, video {
    width: 100%;
    max-width: 600px;
    border-radius: 10px;
}
</style>
