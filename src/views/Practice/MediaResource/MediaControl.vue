<template>
    <div class="container mt-4">
        <MediaCategory v-if="selectedMood === null" :moods="moods" @select-mood="selectMood" />

        <MediaList v-else :mood="moods[selectedMood]" @back="selectedMood = null" />
    </div>
</template>

<script>
import MediaCategory from "../../../components/MediaResourceComponents/MediaCategory.vue";
import MediaList from "../../../components/MediaResourceComponents/MediaList.vue";

export default {
    components: {
        MediaCategory,
        MediaList,
    },
    data() {
        return {
            moods: [
                {
                    name: "Happy",
                    icon: "fas fa-smile text-success",
                    files: [
                        { name: "Happy Song 1", url: "/happy-song-1", fileUrl: "https://example.com/happy-song-1.mp3" },
                        { name: "Happy Song 2", url: "/happy-song-2", fileUrl: "https://example.com/happy-song-2.mp3" },
                    ],
                },
                {
                    name: "Sad",
                    icon: "fas fa-frown text-primary",
                    files: [
                        { name: "Sad Song 1", url: "/sad-song-1", fileUrl: "https://example.com/sad-song-1.mp3" },
                    ],
                },
                {
                    name: "Angry",
                    icon: "fas fa-angry text-danger",
                    files: [
                        { name: "Angry Song 1", url: "/angry-song-1", fileUrl: "https://example.com/angry-song-1.mp3" },
                        { name: "Angry Song 2", url: "/angry-song-2", fileUrl: "https://example.com/angry-song-2.mp3" },
                    ],
                },
                {
                    name: "Excited",
                    icon: "fas fa-grin-stars text-warning",
                    files: [
                        { name: "Excited Song 1", url: "/excited-song-1", fileUrl: "https://example.com/excited-song-1.mp3" },
                    ],
                },
                {
                    name: "Calm",
                    icon: "fas fa-meh text-muted",
                    files: [
                        { name: "Calm Song 1", url: "/calm-song-1", fileUrl: "https://example.com/calm-song-1.mp3" },
                    ],
                },
            ],
            selectedMood: null,
        };
    },
    methods: {
        selectMood(index) {
            this.selectedMood = index;
        },
    },
};
</script>