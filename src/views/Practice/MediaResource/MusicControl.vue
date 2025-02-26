<template>
    <div class="container-fluid">
        <div class="content d-flex">
            <div class="main-content" :class="{ 'main-content--shrinked': libraryStatus }">
                <MediaDisplay v-if="currentSong" :current-song="currentSong" />
                <MediaPlayer v-if="currentSong" :current-song="currentSong" :is-playing="isPlaying"
                    :audio-ref="audioRef" :song-info="songInfo" :songs="songs" @update-song-info="updateSongInfo"
                    @toggle-is-playing="toggleIsPlaying" @skip-track="skipTrackHandler" />
                <MediaLibrary :songs="songs" :current-song-id="currentSong ? currentSong.id : null"
                    @select-song="selectSong" />
            </div>
        </div>
        <audio ref="audioRef" @timeupdate="timeUpdateHandler" @loadedmetadata="timeUpdateHandler"
            @ended="handleSongEnd" />
    </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import MediaPlayer from "./MediaPlayer.vue";
import MediaLibrary from "./MediaLibrary.vue";
import MediaDisplay from "./MediaDisplay.vue";
import { getPagedMediaResources } from "../../../scripts/api/services/mediaResourcesService";
export default {
    name: "MusicControl",
    components: { MediaPlayer, MediaDisplay, MediaLibrary },
    setup() {
        const songs = ref([]);
        const audioRef = ref(null);
        const isPlaying = ref(false);
        const libraryStatus = ref(false);
        const currentSong = ref(null);
        const songInfo = reactive({ currentTime: 0, duration: 0, animationPercentage: 0 });
        const currentPage = ref(1);
        const totalPages = ref(1);
        const isLoading = ref(false);
        const fetchMedia = async (page) => {
            isLoading.value = true;
            try {
                const params = { Description: "", Artist: "", Title: "", Type: 1, PageIndex: page - 1, PageSize: 10 };
                const response = await getPagedMediaResources(params);
                if (response && response.items && response.items.length > 0) {
                    const newSongs = response.items.map((item) => ({
                        name: item.title,
                        artist: item.artist,
                        audio: item.media.url,
                        id: item.id,
                        active: false,
                        duration: 0
                    }));
                    if (page === 1) {
                        songs.value = newSongs;
                        if (newSongs.length > 0) {
                            newSongs[0].active = true;
                            currentSong.value = newSongs[0];
                            audioRef.value.src = newSongs[0].audio;
                        }
                    } else {
                        songs.value = songs.value.concat(newSongs);
                    }
                    newSongs.forEach((song) => {
                        const audio = new Audio(song.audio);
                        audio.addEventListener("loadedmetadata", () => { song.duration = audio.duration; });
                    });
                    totalPages.value = response.pageCount || 1;
                    currentPage.value = page;
                }
            } catch (error) {
                console.error("Failed to fetch songs", error);
            } finally {
                isLoading.value = false;
            }
        };
        const handleScroll = () => {
            const scrollableHeight = document.documentElement.scrollHeight;
            const currentScroll = window.innerHeight + window.scrollY;
            if (currentScroll + 5 >= scrollableHeight && !isLoading.value && currentPage.value === 1 && currentPage.value < totalPages.value) {
                fetchMedia(2);
            }
        };
        onMounted(() => {
            fetchMedia(1);
            window.addEventListener("scroll", handleScroll);
        });
        onUnmounted(() => {
            window.removeEventListener("scroll", handleScroll);
        });
        const setCurrentSong = (song) => {
            currentSong.value = song;
            audioRef.value.src = song.audio;
            songs.value.forEach((s) => { s.active = s.id === song.id; });
        };
        const updateSongInfo = (info) => { Object.assign(songInfo, info); };
        const timeUpdateHandler = (e) => {
            const current = e.target.currentTime;
            const duration = e.target.duration || 1;
            updateSongInfo({ currentTime: current, duration, animationPercentage: (current / duration) * 100 });
        };
        const toggleIsPlaying = (status) => {
            isPlaying.value = status;
            status ? audioRef.value.play() : audioRef.value.pause();
        };
        const selectSong = (song) => {
            setCurrentSong(song);
            if (isPlaying.value) { audioRef.value.play(); }
        };
        const handleSongEnd = () => { skipTrackHandler("skip-forward"); };
        const skipTrackHandler = (direction) => {
            const currentIndex = songs.value.findIndex((song) => song.id === currentSong.value.id);
            let nextIndex = 0;
            if (direction === "skip-forward") { nextIndex = (currentIndex + 1) % songs.value.length; }
            else if (direction === "skip-back") { nextIndex = (currentIndex - 1 + songs.value.length) % songs.value.length; }
            selectSong(songs.value[nextIndex]);
        };
        return {
            songs,
            audioRef,
            isPlaying,
            libraryStatus,
            currentSong,
            songInfo,
            setCurrentSong,
            updateSongInfo,
            toggleIsPlaying,
            timeUpdateHandler,
            selectSong,
            handleSongEnd,
            skipTrackHandler
        };
    }
};
</script>

<style scoped>
.container-fluid {
    height: 100%;
}

.main-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    flex-grow: 1;
    transition: margin-left 0.3s ease;
    margin-left: 0;
}

.main-content--shrinked {
    margin-left: 20%;
}
</style>