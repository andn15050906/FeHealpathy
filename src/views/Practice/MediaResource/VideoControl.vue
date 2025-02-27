<template>
    <div class="container-fluid">
        <div class="content d-flex">
            <div class="main-content" :class="{ 'main-content--shrinked': libraryStatus }">
                <MediaDisplay v-if="currentMedia" :current-media="currentMedia" />
                <video ref="videoRef" class="video-player" @timeupdate="timeUpdateHandler" @loadedmetadata="timeUpdateHandler"
                    @ended="handleMediaEnd" controls />
                <MediaLibrary :medias="medias" :media-list="medias" :current-media-id="currentMedia ? currentMedia.id : null"
                    @select-media="selectMedia" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import MediaPlayer from "./MediaPlayer.vue";
import MediaDisplay from "./MediaDisplay.vue";
import MediaLibrary from "./MediaLibrary.vue";
import { getPagedMediaResources } from "../../../scripts/api/services/mediaResourcesService";

export default {
    name: "VideoControl",
    components: { MediaPlayer, MediaDisplay, MediaLibrary },
    setup() {
        const medias = ref([]);
        const videoRef = ref(null);
        const isPlaying = ref(false);
        const libraryStatus = ref(false);
        const currentMedia = ref(null);
        const mediaInfo = reactive({ currentTime: 0, duration: 0, animationPercentage: 0 });
        const currentPage = ref(1);
        const totalPages = ref(1);
        const isLoading = ref(false);

        const fetchMedia = async (page) => {
            isLoading.value = true;
            try {
                const params = { Description: "", Artist: "", Title: "", Type: 2, PageIndex: page - 1, PageSize: 10 };
                const response = await getPagedMediaResources(params);
                if (response && response.items.length > 0) {
                    const newMedias = response.items.map((item) => ({
                        name: item.title,
                        artist: item.artist,
                        video: item.media.url,
                        id: item.id,
                        active: false,
                        duration: 0
                    }));
                    if (page === 1) {
                        medias.value = newMedias;
                        if (newMedias.length > 0) {
                            newMedias[0].active = true;
                            currentMedia.value = newMedias[0];
                            videoRef.value.src = newMedias[0].video;
                        }
                    } else {
                        medias.value = medias.value.concat(newMedias);
                    }
                    totalPages.value = response.pageCount || 1;
                    currentPage.value = page;
                }
            } catch (error) {
                console.error("Failed to fetch medias", error);
            } finally {
                isLoading.value = false;
            }
        };

        const selectMedia = (media) => {
            currentMedia.value = media;
            videoRef.value.src = media.video;
            medias.value.forEach((s) => { s.active = s.id === media.id; });
            if (isPlaying.value) videoRef.value.play();
        };

        const updateMediaInfo = (info) => { Object.assign(mediaInfo, info); };

        const timeUpdateHandler = (e) => {
            const current = e.target.currentTime;
            const duration = e.target.duration || 1;
            mediaInfo.currentTime = current;
            mediaInfo.duration = duration;
            mediaInfo.animationPercentage = (current / duration) * 100;
        };

        const toggleIsPlaying = (status) => {
            isPlaying.value = status;
            status ? videoRef.value.play() : videoRef.value.pause();
        };

        const handleMediaEnd = () => { skipVideoHandler("skip-forward"); };

        const skipVideoHandler = (direction) => {
            const currentIndex = medias.value.findIndex((media) => media.id === currentMedia.value.id);
            let nextIndex = direction === "skip-forward" ? (currentIndex + 1) % medias.value.length : (currentIndex - 1 + medias.value.length) % medias.value.length;
            selectMedia(medias.value[nextIndex]);
        };

        onMounted(() => { fetchMedia(1); });

        return {
            medias,
            videoRef,
            isPlaying,
            libraryStatus,
            currentMedia,
            mediaInfo,
            selectMedia,
            timeUpdateHandler,
            toggleIsPlaying,
            handleMediaEnd,
            skipVideoHandler,
            updateMediaInfo
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

.video-player {
    width: 80%;
    max-width: 800px;
    margin: 20px auto;
    display: block;
}
</style>
