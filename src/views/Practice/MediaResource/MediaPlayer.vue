<template>
    <div class="container-fluid">
        <div class="content d-flex">
            <div class="main-content" :class="{ 'main-content--shrinked': libraryStatus }">
                <MediaDisplay v-if="currentMedia" :current-media="currentMedia" />
                <MediaPlayer v-if="currentMedia" :current-media="currentMedia" :is-playing="isPlaying"
                    :media-ref="mediaRef" :media-info="mediaInfo" :media-list="mediaList" @update-media-info="updateMediaInfo"
                    @toggle-is-playing="toggleIsPlaying" @skip-media="skipMediaHandler" />
                <MediaLibrary :media-list="mediaList" :current-media-id="currentMedia ? currentMedia.id : null"
                    @select-media="selectMedia" />
            </div>
        </div>
        
        <component 
    :is="currentMedia && currentMedia.type === 'video' ? 'video' : 'audio'" 
    v-if="currentMedia"
    ref="mediaRef" 
    :src="currentMedia ? currentMedia.url : ''" 
    @timeupdate="timeUpdateHandler" 
    @loadedmetadata="timeUpdateHandler"
    @ended="handleMediaEnd" 
    controls 
/>

            @ended="handleMediaEnd" controls />
    </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import MediaDisplay from "./MediaDisplay.vue";
import MediaLibrary from "./MediaLibrary.vue";
import { getPagedMediaResources } from "../../../scripts/api/services/mediaResourcesService";
export default {
    name: "MediaPlayer",
    components: { MediaDisplay, MediaLibrary },
    setup() {
        const mediaList = ref([]);
        const mediaRef = ref(null);
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
                const params = { Description: "", Artist: "", Title: "", PageIndex: page - 1, PageSize: 10 };
                const response = await getPagedMediaResources(params);
                if (response && response.items && response.items.length > 0) {
                    const newMedia = response.items.map((item) => ({
                        name: item.title,
                        artist: item.artist,
                        url: item.media.url,
                        type: item.media.type === 1 ? 'audio' : 'video',
                        id: item.id,
                        active: false,
                        duration: 0
                    }));
                    if (page === 1) {
                        mediaList.value = newMedia;
                        if (newMedia.length > 0) {
                            newMedia[0].active = true;
                            currentMedia.value = newMedia[0];
                            mediaRef.value.src = newMedia[0].url;
                        }
                    } else {
                        mediaList.value = mediaList.value.concat(newMedia);
                    }
                    newMedia.forEach((media) => {
                        const element = document.createElement(media.type);
                        element.src = media.url;
                        element.addEventListener("loadedmetadata", () => { media.duration = element.duration; });
                    });
                    totalPages.value = response.pageCount || 1;
                    currentPage.value = page;
                }
            } catch (error) {
                console.error("Failed to fetch media", error);
            } finally {
                isLoading.value = false;
            }
        };
        onMounted(() => {
            fetchMedia(1);
        });
        const setCurrentMedia = (media) => {
            currentMedia.value = media;
            mediaRef.value.src = media.url;
            mediaList.value.forEach((m) => { m.active = m.id === media.id; });
        };
        const updateMediaInfo = (info) => { Object.assign(mediaInfo, info); };
        const timeUpdateHandler = (e) => {
            const current = e.target.currentTime;
            const duration = e.target.duration || 1;
            updateMediaInfo({ currentTime: current, duration, animationPercentage: (current / duration) * 100 });
        };
        const toggleIsPlaying = (status) => {
            isPlaying.value = status;
            status ? mediaRef.value.play() : mediaRef.value.pause();
        };
        const selectMedia = (media) => {
            setCurrentMedia(media);
            if (isPlaying.value) { mediaRef.value.play(); }
        };
        const handleMediaEnd = () => { skipMediaHandler("skip-forward"); };
        const skipMediaHandler = (direction) => {
            const currentIndex = mediaList.value.findIndex((media) => media.id === currentMedia.value.id);
            let nextIndex = 0;
            if (direction === "skip-forward") { nextIndex = (currentIndex + 1) % mediaList.value.length; }
            else if (direction === "skip-back") { nextIndex = (currentIndex - 1 + mediaList.value.length) % mediaList.value.length; }
            selectMedia(mediaList.value[nextIndex]);
        };
        return {
            mediaList,
            mediaRef,
            isPlaying,
            libraryStatus,
            currentMedia,
            mediaInfo,
            setCurrentMedia,
            updateMediaInfo,
            toggleIsPlaying,
            timeUpdateHandler,
            selectMedia,
            handleMediaEnd,
            skipMediaHandler
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
