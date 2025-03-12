<template>
    <div class="media-player">
        <div class="time-control">
            <p class="time-control__current" v-if="mediaInfo">{{ getTime(mediaInfo?.currentTime || 0) }}</p>
            <div class="track">
                <div class="track__bar">
                    <input type="range" min="0" :max="mediaInfo?.duration || 0" 
                        :value="mediaInfo?.currentTime || 0"
                        @input="dragHandler" 
                        @change="updateCurrentTime"
                        class="track__input" />
                    <div class="track__animate" :style="trackAnim"></div>
                </div>
            </div>
            <p class="time-control__total" v-if="mediaInfo">
                {{ mediaInfo?.duration ? getTime(mediaInfo.duration) : '00:00' }}
            </p>
        </div>
        <div class="play-control">
            <i @click="skipTrackHandler('skip-back')"
                class="fas fa-angle-left play-control__button play-control__button--skip-back"></i>
            <i v-if="!isPlaying" @click="playMediaHandler"
                class="fas fa-play play-control__button play-control__button--play"></i>
            <i v-else @click="playMediaHandler"
                class="fas fa-pause play-control__button play-control__button--pause"></i>
            <i @click="skipTrackHandler('skip-forward')"
                class="fas fa-angle-right play-control__button play-control__button--skip-forward"></i>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MediaPlayer',
    props: {
        currentMedia: {
            type: Object,
            required: true,
        },
        isPlaying: {
            type: Boolean,
            required: true,
        },
        audioRef: {
            type: Object,
            required: true,
        },
        medias: {
            type: Array,
            required: true,
        },
        mediaInfo: {
            type: Object,
            required: true,
        }
    },
    methods: {
        dragHandler(e) {
            const currentTime = e.target.value;
            if (this.audioRef) {
                this.audioRef.currentTime = currentTime;
            }
            
            this.$emit("update-media-info", {
                ...this.mediaInfo,
                currentTime: parseFloat(currentTime),
            });
        },
        
        updateCurrentTime(e) {
            if (this.audioRef) {
                this.audioRef.currentTime = parseFloat(e.target.value);
            }
        },
        
        playMediaHandler() {
            if (!this.audioRef) return;
            this.$emit("toggle-is-playing", !this.isPlaying);
        },

        getTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
        },

        skipTrackHandler(direction) {
            this.$emit("skip-track", direction);
        },
    },
    computed: {
        trackAnim() {
            if (!this.mediaInfo || !this.mediaInfo.duration || this.mediaInfo.currentTime < 0) {
                return { width: "0%" };
            }
            const percentage = (this.mediaInfo.currentTime / this.mediaInfo.duration) * 100;
            return { width: `${Math.min(percentage, 100)}%` };
        },
    },
};
</script>


<style scoped>
.media-player {
    width: 100%;
    height: auto;
    background-color: #fff;
    border-radius: 1rem;
    padding: 1.8rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.time-control {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.time-control__current,
.time-control__total {
    font-size: 1rem;
    color: #666;
    text-align: center;
}

.track {
    width: 100%;
    height: 0.5rem;
    background-color: #b7b7b7;
    border-radius: 0.25rem;
    margin: 0 1rem;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
}

.track__bar {
    height: 100%;
    width: 100%;
    position: relative;
    z-index: 1;
    border-radius: 0.25rem;
}

.track__input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 100%;
    background: transparent;
    position: absolute;
    z-index: 2;
    cursor: pointer;
}

.track__input:focus {
    outline: none;
}

.track__animate {
    background: linear-gradient(to right, #2ab3bf, #205950);
    height: 100%;
    border-radius: 0.25rem;
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    transition: width 0.1s ease-in-out;
}

.play-control {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
    gap: 2rem;
}

.play-control__button {
    color: #2ab3bf;
    cursor: pointer;
    font-size: 1.5rem;
    transition: color 0.3s ease;
}

.play-control__button:hover {
    color: #205950;
}

.play-control__button--play,
.play-control__button--pause {
    font-size: 2rem;
}

.media-display {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.media-display__video {
    width: 100%;
    max-width: 600px;
    border-radius: 1rem;
}
</style>
