<template>
    <div class="container-fluid">
        <div class="content d-flex">
            <div class="main-content" :class="{ 'main-content--shrinked': libraryStatus }">
                <MusicVideo v-if="currentVideo" :current-video="currentVideo" />
                <VideoPlayer v-if="currentVideo" :current-video="currentVideo" :is-playing="isPlaying"
                    :video-ref="videoRef" :video-info="videoInfo" :videos="videos" @update-video-info="updateVideoInfo"
                    @toggle-is-playing="toggleIsPlaying" @skip-track="skipTrackHandler" />
                <VideoLibrary :videos="videos" :current-video-id="currentVideo ? currentVideo.id : null"
                    @select-video="selectVideo" />
            </div>
        </div>
        <video ref="videoRef" @timeupdate="timeUpdateHandler" @loadedmetadata="timeUpdateHandler"
            @ended="handleVideoEnd" controls />
    </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import MediaPlayer from "./MediaPlayer.vue";
import MediaLibrary from "./MediaLibrary.vue";
import MediaDisplay from "./MediaDisplay.vue";
import { getPagedMediaResources } from "../../../scripts/api/services/mediaResourcesService";
export default {
    name: "VideoControl",
    components: { MediaPlayer, MediaDisplay, MediaLibrary },
    setup() {
        const videos = ref([]);
        const videoRef = ref(null);
        const isPlaying = ref(false);
        const libraryStatus = ref(false);
        const currentVideo = ref(null);
        const videoInfo = reactive({ currentTime: 0, duration: 0, animationPercentage: 0 });
        const currentPage = ref(1);
        const totalPages = ref(1);
        const isLoading = ref(false);
        const fetchMedia = async (page) => {
            isLoading.value = true;
            try {
                const params = { Description: "", Artist: "", Title: "", Type: 2, PageIndex: page - 1, PageSize: 10 };
                const response = await getPagedMediaResources(params);
                if (response && response.items && response.items.length > 0) {
                    const newVideos = response.items.map((item) => ({
                        name: item.title,
                        artist: item.artist,
                        video: item.media.url,
                        id: item.id,
                        active: false,
                        duration: 0
                    }));
                    if (page === 1) {
                        videos.value = newVideos;
                        if (newVideos.length > 0) {
                            newVideos[0].active = true;
                            currentVideo.value = newVideos[0];
                            videoRef.value.src = newVideos[0].video;
                        }
                    } else {
                        videos.value = videos.value.concat(newVideos);
                    }
                    newVideos.forEach((video) => {
                        const vid = document.createElement('video');
                        vid.src = video.video;
                        vid.addEventListener("loadedmetadata", () => { video.duration = vid.duration; });
                    });
                    totalPages.value = response.pageCount || 1;
                    currentPage.value = page;
                }
            } catch (error) {
                console.error("Failed to fetch videos", error);
            } finally {
                isLoading.value = false;
            }
        };
        onMounted(() => {
            fetchMedia(1);
        });
        const setCurrentVideo = (video) => {
            currentVideo.value = video;
            videoRef.value.src = video.video;
            videos.value.forEach((v) => { v.active = v.id === video.id; });
        };
        const updateVideoInfo = (info) => { Object.assign(videoInfo, info); };
        const timeUpdateHandler = (e) => {
            const current = e.target.currentTime;
            const duration = e.target.duration || 1;
            updateVideoInfo({ currentTime: current, duration, animationPercentage: (current / duration) * 100 });
        };
        const toggleIsPlaying = (status) => {
            isPlaying.value = status;
            status ? videoRef.value.play() : videoRef.value.pause();
        };
        const selectVideo = (video) => {
            setCurrentVideo(video);
            if (isPlaying.value) { videoRef.value.play(); }
        };
        const handleVideoEnd = () => { skipTrackHandler("skip-forward"); };
        const skipTrackHandler = (direction) => {
            const currentIndex = videos.value.findIndex((video) => video.id === currentVideo.value.id);
            let nextIndex = 0;
            if (direction === "skip-forward") { nextIndex = (currentIndex + 1) % videos.value.length; }
            else if (direction === "skip-back") { nextIndex = (currentIndex - 1 + videos.value.length) % videos.value.length; }
            selectVideo(videos.value[nextIndex]);
        };
        return {
            videos,
            videoRef,
            isPlaying,
            libraryStatus,
            currentVideo,
            videoInfo,
            setCurrentVideo,
            updateVideoInfo,
            toggleIsPlaying,
            timeUpdateHandler,
            selectVideo,
            handleVideoEnd,
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
