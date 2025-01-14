<template>
    <div class="container-fluid">
        <div class="content d-flex">
            <div class="main-content" :class="{ 'main-content--shrinked': libraryStatus }">
                <MusicSong :current-song="currentSong" />

                <MusicPlayer :current-song="currentSong" :is-playing="isPlaying" :audio-ref="audioRef"
                    :song-info="songInfo" @update-song-info="updateSongInfo" @toggle-is-playing="toggleIsPlaying"
                    @skip-track="skipTrackHandler" />

                <MusicLibrary :songs="songs" :current-song-id="currentSong.id" @select-song="selectSong" />
            </div>
        </div>

        <audio ref="audioRef" @timeupdate="timeUpdateHandler" @loadedmetadata="timeUpdateHandler"
            @ended="handleSongEnd" />
    </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import MusicPlayer from "./MusicPlayer.vue";
import MusicSong from "./MusicSong.vue";
import MusicLibrary from "./MusicLibrary.vue";

export default {
    name: "MusicControl",
    components: {
        MusicPlayer,
        MusicSong,
        MusicLibrary,
    },
    setup() {
        const songs = reactive([
            {
                name: "Bản nhạc 1",
                cover: "https://i.scdn.co/image/ab67616d0000b273331cabd7863a2d675633bca4",
                artist: "Hoàng Minh",
                audio: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3",
                id: "1",
                active: true,
            },
            {
                name: "Bản nhạc 2",
                cover: "https://i.scdn.co/image/ab67616d0000b273331cabd7863a2d675633bca4",
                artist: "Hoàng Minh",
                audio: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3",
                id: "2",
                active: false,
            },
            {
                name: "Bản nhạc 3",
                cover: "https://i.scdn.co/image/ab67616d0000b273331cabd7863a2d675633bca4",
                artist: "Hoàng Minh",
                audio: "https://commondatastorage.googleapis.com/codeskulptor-assets/sounddogs/soundtrack.mp3",
                id: "3",
                active: false,
            },
        ]);

        const audioRef = ref(null);
        const isPlaying = ref(false);
        const libraryStatus = ref(false);
        const currentSong = ref(songs[0]);
        const songInfo = reactive({
            currentTime: 0,
            duration: 0,
            animationPercentage: 0,
        });

        const setCurrentSong = (song) => {
            currentSong.value = song;
            audioRef.value.src = song.audio;

            songs.forEach((s) => {
                s.active = s.id === song.id;
            });
        };

        const updateSongInfo = (info) => {
            Object.assign(songInfo, info);
        };

        const timeUpdateHandler = (e) => {
            const current = e.target.currentTime;
            const duration = e.target.duration || 1;
            updateSongInfo({
                currentTime: current,
                duration,
                animationPercentage: (current / duration) * 100,
            });
        };

        const toggleIsPlaying = (status) => {
            isPlaying.value = status;
            if (status) {
                audioRef.value.play();
            } else {
                audioRef.value.pause();
            }
        };

        const selectSong = (song) => {
            setCurrentSong(song);
            if (isPlaying.value) {
                audioRef.value.play();
            }
        };

        const handleSongEnd = () => {
            skipTrackHandler("skip-forward");
        };

        const skipTrackHandler = (direction) => {
            const currentIndex = songs.findIndex((song) => song.id === currentSong.value.id);
            let nextIndex = 0;

            if (direction === "skip-forward") {
                nextIndex = (currentIndex + 1) % songs.length;
            } else if (direction === "skip-back") {
                nextIndex = (currentIndex - 1 + songs.length) % songs.length;
            }

            selectSong(songs[nextIndex]);
        };

        onMounted(() => {
            songs.forEach((song) => {
                const audio = new Audio(song.audio);
                audio.addEventListener("loadedmetadata", () => {
                    song.duration = audio.duration;
                });
            });
            audioRef.value.src = currentSong.value.audio;
        });

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
            skipTrackHandler,
        };
    },
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
