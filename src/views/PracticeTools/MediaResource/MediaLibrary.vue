<template>
    <div class="media-library">
        <ul class="library-list">
            <li v-for="media in mediaList" :key="media.id" :class="[
                'library-item',
                { 'library-item--active': media.active, 'library-item--playing': media.id === currentMediaId }
            ]" @click="selectMedia(media)">
                <div class="library-item__details">
                    <h4 class="library-item__name">{{ media.name }}</h4>
                    <p class="library-item__artist">{{ media.artist }}</p>
                </div>
                <p class="library-item__duration">{{ formatTime(media.duration) }}</p>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: "MediaLibrary",
    props: {
        mediaList: {
            type: Array,
            required: true,
        },
        currentMediaId: {
            type: [String, Number],
            default: null,
        },
    },
    methods: {
        selectMedia(media) {
            this.$emit("select-media", media);
        },
        formatTime(duration) {
            if (!duration) return "00:00";
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
        },
    },
};
</script>

<style scoped>
.media-library {
    width: 100%;
    margin-top: 10px;
    background-color: #fff;
    border-radius: 1rem;
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 350px;
    overflow-y: auto;
}

.library-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.library-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.library-item__details {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.library-item__name {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
}

.library-item__artist {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
}

.library-item__duration {
    font-size: 0.85rem;
    color: #666;
    margin-left: auto;
    text-align: right;
}

.library-item:hover {
    background-color: #f0f0f0;
}

.library-item--active {
    background-color: #e0f7fa;
}

.media-library::-webkit-scrollbar {
    width: 8px;
}

.media-library::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 4px;
}

.media-library::-webkit-scrollbar-thumb:hover {
    background-color: #bbb;
}

.media-library::-webkit-scrollbar-track {
    background-color: #f9f9f9;
}
</style>