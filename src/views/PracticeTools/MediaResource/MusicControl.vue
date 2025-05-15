<template>
    <div class="container-fluid">
        <div class="content d-flex">
            <div class="main-content" :class="{ 'main-content--shrinked': libraryStatus }">
                <MediaDisplay v-if="currentMedia" :current-media="currentMedia" />
                <MediaPlayer v-if="currentMedia" :current-media="currentMedia" :is-playing="isPlaying"
                    :audio-ref="audioRef" :media-info="mediaInfo" :medias="medias" @update-media-info="updatemediaInfo"
                    @toggle-is-playing="toggleIsPlaying" @skip-track="skipTrackHandler" />
                <MediaLibrary :medias="medias" :media-list="medias"
                    :current-media-id="currentMedia ? currentMedia.id : null" @select-media="selectMedia" />
            </div>
        </div>
        <audio ref="audioRef" @timeupdate="timeUpdateHandler" @loadedmetadata="timeUpdateHandler"
            @ended="handlemediaEnd" />
    </div>
</template>

<script>
import { ref, reactive, onMounted, onUnmounted } from "vue"
import MediaPlayer from "./MediaPlayer.vue"
import MediaDisplay from "./MediaDisplay.vue"
import MediaLibrary from "./MediaLibrary.vue"
import { getPagedMediaResources } from "@/scripts/api/services/mediaResourcesService"
import { logMediaViewed } from "@/scripts/api/services/activityLogService";

export default {
    name: "MusicControl",
    components: { MediaPlayer, MediaDisplay, MediaLibrary },
    setup() {
        const medias = ref([])
        const audioRef = ref(null)
        const isPlaying = ref(false)
        const libraryStatus = ref(false)
        const currentMedia = ref(null)
        const mediaInfo = reactive({ currentTime: 0, duration: 0, animationPercentage: 0 })
        const currentPage = ref(1)
        const totalPages = ref(1)
        const isLoading = ref(false)

        function loadTrackMetadata(media) {
            return new Promise((resolve) => {
                const audio = new Audio()
                audio.preload = "metadata"
                audio.src = media.audio
                audio.onloadedmetadata = () => {
                    media.duration = audio.duration
                    resolve()
                }
                audio.onerror = () => {
                    resolve()
                }
            })
        }

        const fetchMedia = async (page) => {
            isLoading.value = true
            try {
                const params = { Description: "", Artist: "", Title: "", Type: 1, PageIndex: page - 1, PageSize: 10 }
                const response = await getPagedMediaResources(params)
                if (response && response.items && response.items.length > 0) {
                    const items = response.items.map((item) => ({
                        name: item.title,
                        artist: item.artist,
                        audio: item.media.url,
                        id: item.id,
                        active: false,
                        duration: 0
                    }))
                    const promises = items.map((mediaObj) => loadTrackMetadata(mediaObj))
                    await Promise.all(promises)
                    if (page === 1) {
                        medias.value = items
                        if (items.length > 0) {
                            items[0].active = true
                            currentMedia.value = items[0]
                            logMediaViewed(items[0].id)
                            audioRef.value.src = items[0].audio
                        }
                    } else {
                        medias.value = medias.value.concat(items)
                    }
                    totalPages.value = response.pageCount || 1
                    currentPage.value = page
                }
            } catch (error) {
                console.error("Lỗi khi tải phương tiện truyền thông", error)
            } finally {
                isLoading.value = false
            }
        }

        const handleScroll = () => {
            const scrollableHeight = document.documentElement.scrollHeight
            const currentScroll = window.innerHeight + window.scrollY
            if (
                currentScroll + 5 >= scrollableHeight &&
                !isLoading.value &&
                currentPage.value === 1 &&
                currentPage.value < totalPages.value
            ) {
                fetchMedia(2)
            }
        }

        onMounted(() => {
            fetchMedia(1)
            window.addEventListener("scroll", handleScroll)
        })

        onUnmounted(() => {
            window.removeEventListener("scroll", handleScroll)
        })

        const setCurrentMedia = (media) => {
            currentMedia.value = media
            logMediaViewed(media.id)
            audioRef.value.src = media.audio
            medias.value.forEach((s) => {
                s.active = s.id === media.id
            })
        }

        const updatemediaInfo = (info) => {
            Object.assign(mediaInfo, info)
        }

        const timeUpdateHandler = (e) => {
            const current = e.target.currentTime
            const duration = e.target.duration || 1
            updatemediaInfo({ currentTime: current, duration, animationPercentage: (current / duration) * 100 })
        }

        const toggleIsPlaying = (status) => {
            isPlaying.value = status
            if (status) {
                audioRef.value.play()
            } else {
                audioRef.value.pause()
            }
        }

        const selectMedia = (media) => {
            setCurrentMedia(media)
            if (isPlaying.value) {
                audioRef.value.play()
            }
        }

        const handlemediaEnd = () => {
            skipTrackHandler("skip-forward")
        }

        const skipTrackHandler = (direction) => {
            const currentIndex = medias.value.findIndex((media) => media.id === currentMedia.value.id)
            let nextIndex = 0
            if (direction === "skip-forward") {
                nextIndex = (currentIndex + 1) % medias.value.length
            } else if (direction === "skip-back") {
                nextIndex = (currentIndex - 1 + medias.value.length) % medias.value.length
            }
            selectMedia(medias.value[nextIndex])
        }

        return {
            medias,
            audioRef,
            isPlaying,
            libraryStatus,
            currentMedia,
            mediaInfo,
            currentPage,
            totalPages,
            isLoading,
            fetchMedia,
            setCurrentMedia,
            updatemediaInfo,
            toggleIsPlaying,
            timeUpdateHandler,
            selectMedia,
            handlemediaEnd,
            skipTrackHandler
        }
    }
}
</script>

<style scoped>
.container-fluid {
    width: 72vw;
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